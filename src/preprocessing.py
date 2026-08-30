"""
Phase 2: Preprocessing & Feature Engineering Module
Tourism Experience Analytics Pipeline

Performs multi-table relational joins, feature engineering (user/attraction aggregation),
categorical encoding, feature scaling, sparse user-item interaction matrix generation,
and stratified train/test dataset partitioning.
"""

import os
import sys
from pathlib import Path
from typing import Dict, Tuple, Optional
import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Add parent directory for utils import
sys.path.append(str(Path(__file__).resolve().parent))
from utils import (
    PROCESSED_DATA_DIR,
    MODELS_DIR,
    logger,
    ensure_directories,
    save_model_artifact,
    save_json
)


def load_cleaned_tables(data_dir: Path) -> Dict[str, pd.DataFrame]:
    """Loads cleaned CSV tables from data/processed/."""
    tables = {}
    required = ["transaction", "user", "city", "country", "region", "continent", "item", "type", "mode"]
    for name in required:
        path = data_dir / f"{name}_clean.csv"
        if not path.exists():
            raise FileNotFoundError(f"Cleaned table {path} not found. Please run data_cleaning.py first.")
        tables[name] = pd.read_csv(path)
    return tables


def safe_left_join(
    left_df: pd.DataFrame,
    right_df: pd.DataFrame,
    on: str,
    left_name: str,
    right_name: str,
    suffixes: Tuple[str, str] = ("", "_right")
) -> pd.DataFrame:
    """
    Performs a left merge while verifying key dtypes match and auditing null rates post-merge.
    """
    left_dtype = str(left_df[on].dtype)
    right_dtype = str(right_df[on].dtype)
    
    if left_dtype != right_dtype:
        logger.warning(
            f"[Join Type Mismatch] Key '{on}': {left_name} has dtype {left_dtype}, "
            f"while {right_name} has dtype {right_dtype}. Attempting safe type alignment."
        )
        # Attempt safe numeric conversion if applicable
        try:
            right_df = right_df.copy()
            right_df[on] = right_df[on].astype(left_df[on].dtype)
        except Exception as e:
            logger.error(f"Failed to reconcile dtypes for key '{on}': {e}")

    joined = left_df.merge(right_df, on=on, how="left", suffixes=suffixes)
    
    # Audit nulls in joined-in columns
    new_cols = [c for c in joined.columns if c not in left_df.columns or c.endswith(suffixes[1])]
    null_report = {c: int(joined[c].isnull().sum()) for c in new_cols if joined[c].isnull().sum() > 0}
    
    if null_report:
        logger.info(f"[Merge Audit] {left_name} ⟕ {right_name} on '{on}' -> Nulls introduced: {null_report}")
    else:
        logger.info(f"[Merge Audit] {left_name} ⟕ {right_name} on '{on}' -> 0 nulls introduced across all joined columns.")
        
    return joined


def build_consolidated_dataset(tables: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    """
    Joins relational tables into one master consolidated dataset with dtype checking and null auditing:
    Transaction -> User (UserId) -> City (CityId) -> Country (CountryId) -> Region (RegionId) -> Continent (ContinentId)
    Transaction -> Item (AttractionId) -> Type (AttractionTypeId)
    """
    logger.info("Executing relational joins to build master tourism dataset...")
    
    tx = tables["transaction"].copy()
    user = tables["user"].copy()
    city = tables["city"].copy()
    country = tables["country"].copy()
    region = tables["region"].copy()
    continent = tables["continent"].copy()
    item = tables["item"].copy()
    type_df = tables["type"].copy()

    # Join User Demographics hierarchy
    user_geo = safe_left_join(user, city, on="CityId", left_name="User", right_name="City", suffixes=("", "_city"))
    
    # Handle country join
    country_cols = ["CountryId", "Country"]
    if "RegionId" in country.columns:
        country_cols.append("RegionId")
    user_geo = safe_left_join(user_geo, country[country_cols], on="CountryId", left_name="UserGeo", right_name="Country", suffixes=("", "_country"))
    
    # Handle region join
    region_cols = ["RegionId", "Region"]
    if "ContinentId" in region.columns and "ContinentId" not in user_geo.columns:
        region_cols.append("ContinentId")
    user_geo = safe_left_join(user_geo, region[region_cols], on="RegionId", left_name="UserGeo", right_name="Region", suffixes=("", "_region"))
    
    # Handle continent join
    user_geo = safe_left_join(user_geo, continent[["ContinentId", "Continent"]], on="ContinentId", left_name="UserGeo", right_name="Continent", suffixes=("", "_continent"))

    # Join Attraction Details hierarchy (item already has cleaned AttractionTypeId from data_cleaning.py)
    # Check if AttractionType already in item
    if "AttractionType" in item.columns:
        item_typed = item.copy()
    else:
        item_typed = safe_left_join(item, type_df[["AttractionTypeId", "AttractionType"]], on="AttractionTypeId", left_name="Item", right_name="Type")

    # Merge into Transaction master
    merged = safe_left_join(tx, user_geo, on="UserId", left_name="Transaction", right_name="UserDemographics", suffixes=("", "_user"))
    merged = safe_left_join(merged, item_typed, on="AttractionId", left_name="Master", right_name="AttractionItem", suffixes=("", "_attraction"))

    logger.info(f"Consolidated dataset generated with shape: {merged.shape}")
    return merged


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Engineers behavioral and contextual aggregations:
    - User aggregates: user_mean_rating, user_visit_count, user_dominant_mode
    - Attraction aggregates: attraction_mean_rating, attraction_visit_count
    - Temporal features: season, is_weekend (if available), visit_recency
    """
    logger.info("Engineering behavioral and attraction aggregate features...")
    df = df.copy()

    # User-level aggregations
    user_stats = df.groupby("UserId").agg(
        user_mean_rating=("Rating", "mean"),
        user_visit_count=("TransactionId", "count"),
    ).reset_index()

    # Most common visit mode per user
    user_dominant_mode = df.groupby("UserId")["VisitMode_label"].agg(
        lambda s: s.mode()[0] if not s.empty else "Unknown"
    ).reset_index().rename(columns={"VisitMode_label": "user_dominant_mode"})

    user_features = user_stats.merge(user_dominant_mode, on="UserId", how="left")
    df = df.merge(user_features, on="UserId", how="left")

    # Attraction-level aggregations
    attraction_stats = df.groupby("AttractionId").agg(
        attraction_mean_rating=("Rating", "mean"),
        attraction_visit_count=("TransactionId", "count")
    ).reset_index()
    df = df.merge(attraction_stats, on="AttractionId", how="left")

    # Temporal feature engineering
    if "VisitMonth" in df.columns:
        # Define season mapping
        def get_season(month: int) -> str:
            if month in [12, 1, 2]:
                return "Winter"
            elif month in [3, 4, 5]:
                return "Spring"
            elif month in [6, 7, 8]:
                return "Summer"
            else:
                return "Autumn"
        df["VisitSeason"] = df["VisitMonth"].astype(int).apply(get_season)

    return df


def build_user_item_matrix(df: pd.DataFrame) -> Tuple[sparse.csr_matrix, Dict[int, int], Dict[int, int], pd.DataFrame]:
    """
    Constructs a high-performance sparse user-item interaction matrix.
    Returns:
    - sparse CSR matrix of ratings
    - user_to_idx mapping
    - item_to_idx mapping
    - dense pivot for lookup
    """
    logger.info("Building user-item interaction matrix for recommendation engine...")
    
    unique_users = np.sort(df["UserId"].unique())
    unique_items = np.sort(df["AttractionId"].unique())

    user_to_idx = {uid: idx for idx, uid in enumerate(unique_users)}
    item_to_idx = {iid: idx for idx, iid in enumerate(unique_items)}

    row_indices = df["UserId"].map(user_to_idx).values
    col_indices = df["AttractionId"].map(item_to_idx).values
    ratings = df["Rating"].values

    matrix = sparse.csr_matrix(
        (ratings, (row_indices, col_indices)),
        shape=(len(unique_users), len(unique_items)),
        dtype=np.float32
    )

    logger.info(f"User-Item matrix created: {matrix.shape[0]} users x {matrix.shape[1]} attractions (density: {matrix.nnz / (matrix.shape[0] * matrix.shape[1]):.4%})")
    
    # Lookup DataFrame for fast attraction information retrieval
    item_meta = df[["AttractionId", "Attraction", "AttractionType", "Country", "CityName", "attraction_mean_rating", "attraction_visit_count"]].drop_duplicates(subset=["AttractionId"]).set_index("AttractionId")

    return matrix, user_to_idx, item_to_idx, item_meta


def encode_and_split(
    df: pd.DataFrame,
    test_size: float = 0.20,
    random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame, Dict[str, LabelEncoder], StandardScaler]:
    """
    Encodes categorical features and generates stratified train/test partitions.
    Scalers are strictly fitted on the train split to prevent data leakage.
    """
    logger.info("Encoding categorical attributes and partitioning datasets...")
    df = df.copy()
    label_encoders: Dict[str, LabelEncoder] = {}

    categorical_cols = ["Continent", "Country", "AttractionType", "VisitSeason", "user_dominant_mode", "VisitMode_label"]

    for col in categorical_cols:
        if col in df.columns:
            le = LabelEncoder()
            # Ensure no NaNs before encoding
            df[col] = df[col].fillna("Unknown").astype(str)
            df[f"{col}_encoded"] = le.fit_transform(df[col])
            label_encoders[col] = le

    # Stratified Train/Test split based on VisitMode_label (classification target)
    stratify_col = df["VisitMode_label_encoded"]
    train_df, test_df = train_test_split(
        df,
        test_size=test_size,
        random_state=random_state,
        stratify=stratify_col
    )

    # Fit Scaler strictly on train set
    numeric_features_to_scale = [
        "user_mean_rating", "user_visit_count",
        "attraction_mean_rating", "attraction_visit_count"
    ]
    scaler = StandardScaler()
    
    train_scaled = train_df.copy()
    test_scaled = test_df.copy()

    for col in numeric_features_to_scale:
        if col in train_df.columns:
            train_scaled[f"{col}_scaled"] = scaler.fit_transform(train_df[[col]])
            test_scaled[f"{col}_scaled"] = scaler.transform(test_df[[col]])

    logger.info(f"Train split shape: {train_scaled.shape} | Test split shape: {test_scaled.shape}")
    return train_scaled, test_scaled, label_encoders, scaler


def run_preprocessing_pipeline() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Main execution entry point for Phase 2 Preprocessing."""
    ensure_directories()
    logger.info("--- Starting Phase 2: Preprocessing & Feature Engineering ---")
    
    tables = load_cleaned_tables(PROCESSED_DATA_DIR)
    consolidated_df = build_consolidated_dataset(tables)
    engineered_df = engineer_features(consolidated_df)

    # Build User-Item Interaction Matrix for Recommendation
    matrix, user_to_idx, item_to_idx, item_meta = build_user_item_matrix(engineered_df)
    
    # Save recommendation artifacts
    sparse.save_npz(MODELS_DIR / "user_item_matrix.npz", matrix)
    save_model_artifact(user_to_idx, MODELS_DIR / "user_to_idx.joblib")
    save_model_artifact(item_to_idx, MODELS_DIR / "item_to_idx.joblib")
    save_model_artifact(item_meta, MODELS_DIR / "item_metadata.joblib")

    # Encode and Split
    train_df, test_df, label_encoders, scaler = encode_and_split(engineered_df)

    # Save processed outputs
    engineered_df.to_csv(PROCESSED_DATA_DIR / "consolidated_tourism_dataset.csv", index=False)
    train_df.to_csv(PROCESSED_DATA_DIR / "train.csv", index=False)
    test_df.to_csv(PROCESSED_DATA_DIR / "test.csv", index=False)

    # Save Encoders & Scalers
    save_model_artifact(label_encoders, MODELS_DIR / "label_encoders.joblib")
    save_model_artifact(label_encoders["VisitMode_label"], MODELS_DIR / "label_encoder.joblib")
    save_model_artifact(scaler, MODELS_DIR / "feature_scaler.joblib")

    print("\n=======================================================")
    print("        PREPROCESSING PIPELINE COMPLETED              ")
    print("=======================================================")
    print(f"Total Transactions Processed: {len(engineered_df):,}")
    print(f"Train Set Rows: {len(train_df):,} | Test Set Rows: {len(test_df):,}")
    print(f"Unique Users: {len(user_to_idx):,} | Unique Attractions: {len(item_to_idx):,}")
    print("Artifacts saved in data/processed/ and models/")
    print("=======================================================\n")

    return train_df, test_df


if __name__ == "__main__":
    run_preprocessing_pipeline()
