"""
Phase 4: Regression Modeling Module (Rating Prediction)
Tourism Experience Analytics Pipeline

Trains and evaluates multiple regression models (Linear Regression, Random Forest Regressor,
and Gradient Boosting/LightGBM/XGBoost Regressors) to predict tourist satisfaction ratings (1-5).
Selects the best performing model based on RMSE and R2 score, and exports artifacts for deployment.
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Optional LightGBM / XGBoost with graceful fallback
try:
    from lightgbm import LGBMRegressor
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False

try:
    from xgboost import XGBRegressor
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

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


def load_train_test_data() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Loads preprocessed train and test datasets."""
    train_path = PROCESSED_DATA_DIR / "train.csv"
    test_path = PROCESSED_DATA_DIR / "test.csv"
    
    if not train_path.exists() or not test_path.exists():
        raise FileNotFoundError("Train or test CSV not found. Please run preprocessing.py first.")
        
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)
    return train_df, test_df


def prepare_regression_features(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, List[str]]:
    """
    Selects predictive features for rating regression.
    Features include demographic encodings, attraction category, temporal features,
    and historical aggregate signals.
    """
    feature_candidates = [
        "VisitYear",
        "VisitMonth",
        "Continent_encoded",
        "Country_encoded",
        "AttractionType_encoded",
        "VisitMode_label_encoded",
        "user_mean_rating",
        "user_visit_count",
        "attraction_mean_rating",
        "attraction_visit_count"
    ]
    
    # Filter features that exist in both splits
    features = [f for f in feature_candidates if f in train_df.columns and f in test_df.columns]
    target = "Rating"

    X_train = train_df[features].fillna(0).values
    y_train = train_df[target].values

    X_test = test_df[features].fillna(0).values
    y_test = test_df[target].values

    logger.info(f"Regression training with {len(features)} features: {features}")
    return X_train, y_train, X_test, y_test, features


def train_and_evaluate_regressors(
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray
) -> Tuple[Dict[str, Any], Dict[str, Dict[str, float]], str]:
    """
    Trains multiple regression algorithms and computes evaluation metrics:
    - R² (Coefficient of Determination)
    - MSE (Mean Squared Error)
    - RMSE (Root Mean Squared Error)
    - MAE (Mean Absolute Error)
    """
    models: Dict[str, Any] = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(alpha=1.0),
        "Random Forest": RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42)
    }

    if HAS_LGBM:
        models["LightGBM Regressor"] = LGBMRegressor(n_estimators=120, max_depth=6, learning_rate=0.08, random_state=42, verbose=-1)
    elif HAS_XGB:
        models["XGBoost Regressor"] = XGBRegressor(n_estimators=100, max_depth=6, learning_rate=0.08, random_state=42)

    results: Dict[str, Dict[str, float]] = {}
    best_model_name = ""
    lowest_rmse = float("inf")

    for name, model in models.items():
        logger.info(f"Training {name}...")
        model.fit(X_train, y_train)
        
        preds = model.predict(X_test)
        # Rating is bounded between 1 and 5
        preds_clipped = np.clip(preds, 1.0, 5.0)

        mse = mean_squared_error(y_test, preds_clipped)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_test, preds_clipped)
        r2 = r2_score(y_test, preds_clipped)

        results[name] = {
            "R2": float(r2),
            "MSE": float(mse),
            "RMSE": float(rmse),
            "MAE": float(mae)
        }

        logger.info(f"[{name}] R²: {r2:.4f} | RMSE: {rmse:.4f} | MSE: {mse:.4f} | MAE: {mae:.4f}")

        if rmse < lowest_rmse:
            lowest_rmse = rmse
            best_model_name = name

    return models, results, best_model_name


def print_comparison_table(results: Dict[str, Dict[str, float]], best_name: str) -> None:
    """Displays formatted evaluation comparison table."""
    print("\n=========================================================================")
    print("                    REGRESSION MODEL BENCHMARKS                          ")
    print("=========================================================================")
    print(f"{'Model Algorithm':<26} | {'R² Score':<10} | {'RMSE':<10} | {'MSE':<10} | {'MAE':<8}")
    print("-" * 73)
    for name, metrics in results.items():
        prefix = "★ " if name == best_name else "  "
        print(f"{prefix + name:<26} | {metrics['R2']:<10.4f} | {metrics['RMSE']:<10.4f} | {metrics['MSE']:<10.4f} | {metrics['MAE']:<8.4f}")
    print("=========================================================================")
    print(f"★ Best Performing Model: {best_name} (Lowest RMSE: {results[best_name]['RMSE']:.4f})\n")


def run_regression_pipeline() -> Tuple[Any, Dict[str, Any]]:
    """Main execution entry point for Phase 4 Regression."""
    ensure_directories()
    logger.info("--- Starting Phase 4: Regression Model Training ---")
    
    train_df, test_df = load_train_test_data()
    X_train, y_train, X_test, y_test, features = prepare_regression_features(train_df, test_df)
    
    models, results, best_name = train_and_evaluate_regressors(X_train, y_train, X_test, y_test)
    print_comparison_table(results, best_name)

    best_model = models[best_name]

    # Save artifacts
    save_model_artifact(best_model, MODELS_DIR / "best_regressor.joblib")
    save_json({"features": features, "target": "Rating", "best_model": best_name}, MODELS_DIR / "regressor_features.json")
    save_json(results, MODELS_DIR / "regression_metrics.json")

    return best_model, results


if __name__ == "__main__":
    run_regression_pipeline()
