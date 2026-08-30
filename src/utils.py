"""
Tourism Experience Analytics - Shared Utilities
Helper functions for directory setup, model persistence, and evaluation metrics.
"""

import os
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
import joblib
import numpy as np
import pandas as pd

# Setup logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("TourismAnalytics")

# Directory paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
MODELS_DIR = PROJECT_ROOT / "models"
DOCS_DIR = PROJECT_ROOT / "docs"
FIGURES_DIR = DOCS_DIR / "figures"


def ensure_directories() -> None:
    """Ensure all required project directories exist."""
    for d in [RAW_DATA_DIR, PROCESSED_DATA_DIR, MODELS_DIR, DOCS_DIR, FIGURES_DIR]:
        d.mkdir(parents=True, exist_ok=True)
    logger.info("Project directory structure verified.")


def save_model_artifact(artifact: Any, filepath: Path) -> None:
    """Save any model or python object using joblib."""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, filepath)
    logger.info(f"Saved artifact to {filepath}")


def load_model_artifact(filepath: Path) -> Any:
    """Load model artifact using joblib."""
    if not filepath.exists():
        raise FileNotFoundError(f"Model artifact not found at {filepath}")
    return joblib.load(filepath)


def save_json(data: Dict[str, Any], filepath: Path) -> None:
    """Save dictionary to JSON file."""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    logger.info(f"Saved JSON to {filepath}")


def load_json(filepath: Path) -> Dict[str, Any]:
    """Load JSON file."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)
