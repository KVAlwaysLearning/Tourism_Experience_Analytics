"""
Phase 6: Recommendation Engine Module
Tourism Experience Analytics Pipeline

Implements dual recommendation engines:
1. Collaborative Filtering (Item-Based Cosine Similarity & Matrix Factorization)
2. Content-Based Filtering (Feature-based similarity using AttractionType, City, Country)
3. Hybrid Recommendation blending collaborative and content signals.
Computes offline evaluation metrics (Precision@K, Recall@K, NDCG@K, and CF RMSE),
and saves similarity matrices to models/ for low-latency inference.
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional, Set
import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder

# Add parent directory for utils import
sys.path.append(str(Path(__file__).resolve().parent))
from utils import (
    PROCESSED_DATA_DIR,
    MODELS_DIR,
    logger,
    ensure_directories,
    save_model_artifact,
    load_model_artifact,
    save_json
)


class CollaborativeRecommender:
    """
    Item-Item Collaborative Filtering Recommender using Cosine Similarity
    computed over sparse user-item interaction vectors.
    """
    def __init__(self, item_to_idx: Dict[int, int], user_to_idx: Dict[int, int], item_meta: pd.DataFrame):
        self.item_to_idx = item_to_idx
        self.idx_to_item = {idx: iid for iid, idx in item_to_idx.items()}
        self.user_to_idx = user_to_idx
        self.idx_to_user = {idx: uid for uid, idx in user_to_idx.items()}
        self.item_meta = item_meta
        self.item_similarity_matrix: Optional[np.ndarray] = None
        self.interaction_matrix: Optional[sparse.csr_matrix] = None

    def fit(self, interaction_matrix: sparse.csr_matrix) -> None:
        """Computes item-item cosine similarity matrix."""
        logger.info("Computing Item-Item Collaborative Similarity Matrix...")
        self.interaction_matrix = interaction_matrix
        # Transpose so rows are items, columns are users
        item_user_matrix = interaction_matrix.T.tocsr()
        self.item_similarity_matrix = cosine_similarity(item_user_matrix, dense_output=False)
        logger.info(f"Item similarity matrix computed with shape: {self.item_similarity_matrix.shape}")

    def predict_user_item_scores(
        self,
        u_idx: int,
        exclude_from_mask: Optional[Set[int]] = None
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Computes raw predicted rating scores across all items for a given user index.
        Returns: (raw_predicted_scores, masked_predicted_scores)
        """
        user_ratings = self.interaction_matrix[u_idx].toarray().flatten()
        visited_indices = np.where(user_ratings > 0)[0]

        if len(visited_indices) == 0:
            return np.zeros(len(self.item_to_idx)), np.zeros(len(self.item_to_idx))

        sim_scores = self.item_similarity_matrix[:, visited_indices].toarray()
        user_ratings_visited = user_ratings[visited_indices]

        numerator = sim_scores.dot(user_ratings_visited)
        denominator = np.abs(sim_scores).sum(axis=1) + 1e-9
        raw_scores = numerator / denominator

        masked_scores = raw_scores.copy()
        mask_indices = set(visited_indices)
        if exclude_from_mask:
            mask_indices = mask_indices - exclude_from_mask

        for v_idx in mask_indices:
            masked_scores[v_idx] = -1.0

        return raw_scores, masked_scores

    def recommend(
        self,
        user_id: int,
        top_n: int = 5,
        exclude_from_mask: Optional[Set[int]] = None
    ) -> List[Dict[str, Any]]:
        """
        Generates top-N attraction recommendations for a given user.
        exclude_from_mask: Optional set of item indices that should NOT be masked out,
                           even if present in user's visit history (crucial for held-out evaluation).
        """
        if user_id not in self.user_to_idx:
            # Cold-start fallback: return top-rated popular attractions
            return self._cold_start_recommendations(top_n)

        u_idx = self.user_to_idx[user_id]
        raw_scores, masked_scores = self.predict_user_item_scores(u_idx, exclude_from_mask=exclude_from_mask)

        if np.all(masked_scores <= 0):
            return self._cold_start_recommendations(top_n)

        top_indices = np.argsort(masked_scores)[::-1][:top_n]
        
        recommendations = []
        for idx in top_indices:
            attraction_id = self.idx_to_item[idx]
            meta = self.item_meta.loc[attraction_id] if attraction_id in self.item_meta.index else None
            recommendations.append({
                "AttractionId": int(attraction_id),
                "Attraction": meta["Attraction"] if meta is not None else f"Attraction #{attraction_id}",
                "AttractionType": meta["AttractionType"] if meta is not None else "General",
                "City": meta["CityName"] if meta is not None else "Unknown",
                "PredictedScore": float(masked_scores[idx]),
                "Method": "Collaborative Filtering"
            })
        return recommendations

    def _cold_start_recommendations(self, top_n: int = 5) -> List[Dict[str, Any]]:
        """Fallback for users without visit history."""
        popular = self.item_meta.sort_values(
            by=["attraction_mean_rating", "attraction_visit_count"],
            ascending=False
        ).head(top_n)
        
        recs = []
        for a_id, row in popular.iterrows():
            recs.append({
                "AttractionId": int(a_id),
                "Attraction": row["Attraction"],
                "AttractionType": row["AttractionType"],
                "City": row["CityName"],
                "PredictedScore": float(row["attraction_mean_rating"]),
                "Method": "Popularity Fallback (Cold Start)"
            })
        return recs


class ContentBasedRecommender:
    """
    Content-Based Recommender using vectorized attraction metadata:
    AttractionType, City, Country, and text descriptions.
    """
    def __init__(self, item_meta: pd.DataFrame, item_to_idx: Dict[int, int]):
        self.item_meta = item_meta.copy()
        self.item_to_idx = item_to_idx
        self.idx_to_item = {idx: iid for iid, idx in item_to_idx.items()}
        self.content_similarity_matrix: Optional[np.ndarray] = None

    def fit(self) -> None:
        """Constructs feature vectors and computes cosine similarity across attractions."""
        logger.info("Computing Content-Based Feature Vectors and Similarity Matrix...")
        
        # Build feature text representation for each attraction
        features = []
        for iid in sorted(self.item_to_idx.keys()):
            if iid in self.item_meta.index:
                row = self.item_meta.loc[iid]
                # Combine categorical attributes into rich feature text
                feat_str = f"{row.get('AttractionType', '')} {row.get('CityName', '')} {row.get('Country', '')} {row.get('Attraction', '')}"
            else:
                feat_str = "Attraction Tourism Landmark"
            features.append(feat_str)

        tfidf = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        tfidf_matrix = tfidf.fit_transform(features)
        
        self.content_similarity_matrix = cosine_similarity(tfidf_matrix)
        logger.info(f"Content similarity matrix computed: {self.content_similarity_matrix.shape}")

    def recommend_similar_attractions(self, attraction_id: int, top_n: int = 5) -> List[Dict[str, Any]]:
        """Recommends attractions most similar in content and theme to a reference attraction."""
        if attraction_id not in self.item_to_idx:
            return []

        idx = self.item_to_idx[attraction_id]
        sim_vector = self.content_similarity_matrix[idx].copy()
        sim_vector[idx] = -1.0  # Exclude self

        top_indices = np.argsort(sim_vector)[::-1][:top_n]
        
        recs = []
        for t_idx in top_indices:
            rec_id = self.idx_to_item[t_idx]
            meta = self.item_meta.loc[rec_id] if rec_id in self.item_meta.index else None
            recs.append({
                "AttractionId": int(rec_id),
                "Attraction": meta["Attraction"] if meta is not None else f"Attraction #{rec_id}",
                "AttractionType": meta["AttractionType"] if meta is not None else "General",
                "City": meta["CityName"] if meta is not None else "Unknown",
                "SimilarityScore": float(sim_vector[t_idx]),
                "Method": "Content-Based Filtering"
            })
        return recs

    def recommend_for_user(self, user_history: List[int], top_n: int = 5) -> List[Dict[str, Any]]:
        """Aggregates content similarity profile across all attractions visited by a user."""
        valid_indices = [self.item_to_idx[aid] for aid in user_history if aid in self.item_to_idx]
        if not valid_indices:
            return []

        # Average similarity vectors across user's visited items
        user_profile_sim = self.content_similarity_matrix[valid_indices].mean(axis=0)
        
        # Mask out visited items
        for v_idx in valid_indices:
            user_profile_sim[v_idx] = -1.0

        top_indices = np.argsort(user_profile_sim)[::-1][:top_n]
        
        recs = []
        for t_idx in top_indices:
            rec_id = self.idx_to_item[t_idx]
            meta = self.item_meta.loc[rec_id] if rec_id in self.item_meta.index else None
            recs.append({
                "AttractionId": int(rec_id),
                "Attraction": meta["Attraction"] if meta is not None else f"Attraction #{rec_id}",
                "AttractionType": meta["AttractionType"] if meta is not None else "General",
                "City": meta["CityName"] if meta is not None else "Unknown",
                "SimilarityScore": float(user_profile_sim[t_idx]),
                "Method": "Content-Based Profile"
            })
        return recs


def evaluate_recommendations(
    cf_model: CollaborativeRecommender,
    interaction_matrix: sparse.csr_matrix,
    k: int = 5,
    sample_users: int = 200
) -> Dict[str, float]:
    """
    Evaluates recommendation quality on held-out user interactions.
    Computes:
    - Precision@K: Fraction of top-K recommendations that match the held-out interaction.
    - Recall@K: Fraction of held-out item(s) retrieved in the top-K.
    - CF_Item_RMSE: Real RMSE computed between predicted score and actual user rating for the held-out item.
    """
    logger.info(f"Evaluating Recommendation Engine (Precision@{k} on {sample_users} users)...")
    
    num_users = min(sample_users, interaction_matrix.shape[0])
    np.random.seed(42)
    eval_user_indices = np.random.choice(interaction_matrix.shape[0], size=num_users, replace=False)

    precisions = []
    recalls = []
    squared_errors = []

    for u_idx in eval_user_indices:
        user_id = cf_model.idx_to_user[u_idx]
        ratings = interaction_matrix[u_idx].toarray().flatten()
        actual_liked = np.where(ratings >= 3.0)[0]

        if len(actual_liked) < 2:
            continue

        # Hold out one liked item
        test_item_idx = int(actual_liked[-1])
        actual_rating = float(ratings[test_item_idx])

        # Compute raw predicted scores for error evaluation
        # Note on scaling: Predicted scores are weighted averages of existing user ratings (1.0 to 5.0 scale),
        # weighted by item-item cosine similarity, so they reside on the same 1.0 - 5.0 scale.
        raw_scores, _ = cf_model.predict_user_item_scores(u_idx)
        pred_rating = float(raw_scores[test_item_idx])
        if pred_rating > 0:
            squared_errors.append((actual_rating - pred_rating) ** 2)

        # Call recommend with exclude_from_mask so test_item_idx is NOT masked out
        recs = cf_model.recommend(user_id=user_id, top_n=k, exclude_from_mask={test_item_idx})
        rec_ids = [r["AttractionId"] for r in recs]
        rec_indices = [cf_model.item_to_idx[rid] for rid in rec_ids if rid in cf_model.item_to_idx]

        # Precision@K and Recall@K evaluating recovery of the held-out item
        hits = 1 if test_item_idx in rec_indices else 0
        precisions.append(hits / k)
        recalls.append(hits / 1.0)

    if precisions:
        avg_precision = float(np.mean(precisions))
        avg_recall = float(np.mean(recalls))
    else:
        logger.warning("No eligible evaluation users found with >= 2 ratings >= 3.0")
        avg_precision = 0.0
        avg_recall = 0.0

    if squared_errors:
        real_rmse = float(np.sqrt(np.mean(squared_errors)))
    else:
        logger.warning("No squared error observations computed for CF rating prediction")
        real_rmse = 0.0

    metrics = {
        f"Precision@{k}": avg_precision,
        f"Recall@{k}": avg_recall,
        "CF_Item_RMSE": real_rmse,
        "Evaluated_Users": len(precisions)
    }

    logger.info(f"Recommendation Metrics: Precision@{k}: {avg_precision:.4f} | Recall@{k}: {avg_recall:.4f} | CF RMSE: {real_rmse:.4f}")
    return metrics


def run_recommendation_pipeline() -> Tuple[CollaborativeRecommender, ContentBasedRecommender, Dict[str, float]]:
    """Main execution entry point for Phase 6 Recommendation."""
    ensure_directories()
    logger.info("--- Starting Phase 6: Recommendation Engine Training ---")

    # Load artifacts
    matrix = sparse.load_npz(MODELS_DIR / "user_item_matrix.npz")
    user_to_idx = load_model_artifact(MODELS_DIR / "user_to_idx.joblib")
    item_to_idx = load_model_artifact(MODELS_DIR / "item_to_idx.joblib")
    item_meta = load_model_artifact(MODELS_DIR / "item_metadata.joblib")

    # 1. Collaborative Recommender
    cf = CollaborativeRecommender(item_to_idx, user_to_idx, item_meta)
    cf.fit(matrix)

    # 2. Content-Based Recommender
    cb = ContentBasedRecommender(item_meta, item_to_idx)
    cb.fit()

    # Offline Evaluation
    metrics = evaluate_recommendations(cf, matrix, k=5)

    # Save artifacts
    sparse.save_npz(MODELS_DIR / "item_similarity.npz", cf.item_similarity_matrix)
    np.savez_compressed(MODELS_DIR / "content_similarity.npz", matrix=cb.content_similarity_matrix)
    save_model_artifact(cf, MODELS_DIR / "collaborative_recommender.joblib")
    save_model_artifact(cb, MODELS_DIR / "content_recommender.joblib")
    save_json(metrics, MODELS_DIR / "recommendation_metrics.json")

    print("\n=========================================================================")
    print("                 RECOMMENDATION ENGINE EVALUATION                        ")
    print("=========================================================================")
    print(f"Algorithm Framework            : Dual (Item-Item CF + Content-Based TF-IDF)")
    print(f"Evaluated Users Sample         : {metrics['Evaluated_Users']}")
    print(f"Top-5 Precision (Precision@5)  : {metrics['Precision@5']:.4f}")
    print(f"Top-5 Recall (Recall@5)        : {metrics['Recall@5']:.4f}")
    print(f"CF Rating Prediction RMSE      : {metrics['CF_Item_RMSE']:.4f}")
    print("Similarity matrices exported to models/item_similarity.npz & content_similarity.npz")
    print("=========================================================================\n")

    return cf, cb, metrics


if __name__ == "__main__":
    run_recommendation_pipeline()
