"""
Phase 5: Classification Modeling Module (Visit Mode Prediction)
Tourism Experience Analytics Pipeline

Trains and benchmarks multiple multi-class classification algorithms
(Logistic Regression, Random Forest Classifier, Gradient Boosting/LightGBM/XGBoost)
to predict traveler visit mode (Business, Family, Couples, Friends, Solo).
Computes Accuracy, Precision, Recall, Macro F1-score, generates confusion matrices,
and persists deployment artifacts.
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

# Optional LightGBM / XGBoost with graceful fallback
try:
    from lightgbm import LGBMClassifier
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False

try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

# Add parent directory for utils import
sys.path.append(str(Path(__file__).resolve().parent))
from utils import (
    PROCESSED_DATA_DIR,
    MODELS_DIR,
    DOCS_DIR,
    logger,
    ensure_directories,
    save_model_artifact,
    load_model_artifact,
    save_json
)


def load_train_test_data() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Loads preprocessed train and test datasets."""
    train_path = PROCESSED_DATA_DIR / "train.csv"
    test_path = PROCESSED_DATA_DIR / "test.csv"
    
    if not train_path.exists() or not test_path.exists():
        raise FileNotFoundError("Train or test CSV not found. Please run preprocessing.py first.")
        
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)
    return train_df, test_df


def prepare_classification_features(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, List[str]]:
    """
    Selects demographic, contextual, temporal, and attraction features
    for predicting VisitMode.
    Note: VisitMode and its direct derivations are excluded to prevent target leakage.
    """
    feature_candidates = [
        "VisitYear",
        "VisitMonth",
        "Continent_encoded",
        "Country_encoded",
        "AttractionType_encoded",
        "user_mean_rating",
        "user_visit_count",
        "attraction_mean_rating",
        "attraction_visit_count"
    ]

    features = [f for f in feature_candidates if f in train_df.columns and f in test_df.columns]
    target = "VisitMode_label_encoded"

    X_train = train_df[features].fillna(0).values
    y_train = train_df[target].values

    X_test = test_df[features].fillna(0).values
    y_test = test_df[target].values

    logger.info(f"Classification training with {len(features)} features: {features}")
    return X_train, y_train, X_test, y_test, features


def train_and_evaluate_classifiers(
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
    class_names: List[str]
) -> Tuple[Dict[str, Any], Dict[str, Dict[str, float]], str, np.ndarray]:
    """
    Trains multiple classifiers and evaluates on held-out test data.
    Metrics evaluated: Accuracy, Macro Precision, Macro Recall, Macro F1.
    """
    models: Dict[str, Any] = {
        "Logistic Regression": LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=120, max_depth=14, class_weight="balanced", random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42)
    }

    if HAS_LGBM:
        models["LightGBM Classifier"] = LGBMClassifier(n_estimators=120, max_depth=6, class_weight="balanced", random_state=42, verbose=-1)
    elif HAS_XGB:
        models["XGBoost Classifier"] = XGBClassifier(n_estimators=100, max_depth=6, random_state=42)

    results: Dict[str, Dict[str, float]] = {}
    best_model_name = ""
    highest_f1 = -1.0
    best_conf_matrix = np.zeros((len(class_names), len(class_names)))

    for name, model in models.items():
        logger.info(f"Training {name}...")
        model.fit(X_train, y_train)
        
        preds = model.predict(X_test)

        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, average="macro", zero_division=0)
        rec = recall_score(y_test, preds, average="macro", zero_division=0)
        f1 = f1_score(y_test, preds, average="macro", zero_division=0)

        results[name] = {
            "Accuracy": float(acc),
            "Precision (Macro)": float(prec),
            "Recall (Macro)": float(rec),
            "F1-Score (Macro)": float(f1)
        }

        logger.info(f"[{name}] Accuracy: {acc:.4f} | F1 (Macro): {f1:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f}")

        if f1 > highest_f1:
            highest_f1 = f1
            best_model_name = name
            best_conf_matrix = confusion_matrix(y_test, preds)

    return models, results, best_model_name, best_conf_matrix


def print_classification_results(
    results: Dict[str, Dict[str, float]],
    best_name: str,
    conf_matrix: np.ndarray,
    class_names: List[str]
) -> None:
    """Displays benchmark table and formatted confusion matrix."""
    print("\n=========================================================================================")
    print("                      CLASSIFICATION MODEL BENCHMARKS (VISIT MODE)                       ")
    print("=========================================================================================")
    print(f"{'Model Algorithm':<26} | {'Accuracy':<10} | {'Macro F1':<10} | {'Macro Precision':<16} | {'Macro Recall':<12}")
    print("-" * 89)
    for name, metrics in results.items():
        prefix = "★ " if name == best_name else "  "
        print(f"{prefix + name:<26} | {metrics['Accuracy']:<10.4f} | {metrics['F1-Score (Macro)']:<10.4f} | {metrics['Precision (Macro)']:<16.4f} | {metrics['Recall (Macro)']:<12.4f}")
    print("=========================================================================================")
    print(f"★ Best Performing Model: {best_name} (Macro F1: {results[best_name]['F1-Score (Macro)']:.4f})\n")

    print("Confusion Matrix for Best Model:")
    print(f"{'Actual \\ Predicted':<18} | " + " | ".join([f"{c[:8]:<8}" for c in class_names]))
    print("-" * (20 + 11 * len(class_names)))
    for idx, row in enumerate(conf_matrix):
        row_str = " | ".join([f"{val:<8}" for val in row])
        print(f"{class_names[idx][:18]:<18} | {row_str}")
    print("\n")


def run_classification_pipeline() -> Tuple[Any, Dict[str, Any]]:
    """Main execution entry point for Phase 5 Classification."""
    ensure_directories()
    logger.info("--- Starting Phase 5: Classification Model Training ---")
    
    train_df, test_df = load_train_test_data()
    
    # Load label encoder for target classes
    label_encoder = load_model_artifact(MODELS_DIR / "label_encoder.joblib")
    class_names = [str(c) for c in label_encoder.classes_]

    X_train, y_train, X_test, y_test, features = prepare_classification_features(train_df, test_df)
    
    models, results, best_name, conf_matrix = train_and_evaluate_classifiers(
        X_train, y_train, X_test, y_test, class_names
    )

    print_classification_results(results, best_name, conf_matrix, class_names)

    best_model = models[best_name]

    # Save artifacts
    save_model_artifact(best_model, MODELS_DIR / "best_classifier.joblib")
    save_json({
        "features": features,
        "target": "VisitMode_label",
        "classes": class_names,
        "best_model": best_name
    }, MODELS_DIR / "classifier_features.json")
    save_json(results, MODELS_DIR / "classification_metrics.json")

    return best_model, results


if __name__ == "__main__":
    run_classification_pipeline()
