# Tourism Experience Analytics: Classification, Prediction, and Recommendation System

An end-to-end Machine Learning and Analytics platform delivering rating predictions, trip context classification, and personalized hybrid attraction recommendations for the global tourism sector.

---

## 🌟 Key Features

1. **Rating Prediction (Regression):** Predicts satisfaction ratings (1.0 to 5.0) using Gradient Boosting and Random Forest algorithms.
2. **Visit Mode Classification (Classification):** Categorizes travelers into `Business`, `Couples`, `Family`, `Friends`, or `Solo` travel modes.
3. **Personalized Recommendations (Hybrid Recommender):** Blends Item-Item Collaborative Filtering with Content-Based TF-IDF matching for personalized Top-5 attraction itineraries.
4. **Exploratory Data Suite:** Generates publication-ready visualizations uncovering demographic distributions, popularity metrics, and satisfaction trends.
5. **Interactive Streamlit Web App:** Real-time inferencing with customizable recommendation sliders and interactive data inspection.

---

## 📁 Repository Structure

```
tourism-analytics/
├── data/
│   ├── raw/                    # Raw Excel/CSV tables (Transaction, User, Item, etc.)
│   └── processed/              # Cleaned tables, consolidated dataset, train/test splits
├── src/
│   ├── data_cleaning.py        # Phase 1: Cleans raw tables and checks referential integrity
│   ├── preprocessing.py        # Phase 2: Joins, aggregates, encodes, and splits data
│   ├── eda.py                  # Phase 3: Generates 6 core exploratory figures
│   ├── train_regression.py     # Phase 4: Trains & benchmarks rating regression models
│   ├── train_classification.py # Phase 5: Trains & benchmarks visit mode classifiers
│   ├── train_recommendation.py # Phase 6: Trains Collaborative & Content-Based recommenders
│   ├── evaluate.py             # Phase 7: Consolidated benchmark markdown report
│   ├── generate_sample_data.py # Sample data generator for zero-setup local verification
│   └── utils.py                # Shared logging, path managers, and artifact I/O
├── models/                     # Saved .joblib and .npz model artifacts
├── app/
│   ├── app.py                  # Full-featured Streamlit interactive web application
│   └── requirements.txt        # Streamlit deployment dependencies
├── docs/
│   ├── report.md               # Full written technical and business documentation report
│   ├── model_comparison.md     # Multi-algorithm performance comparison matrix
│   └── figures/                # Exported EDA visualization PNG charts
├── requirements.txt            # Python environment dependencies
└── README.md                   # Project overview and setup manual
```

---

## 🚀 Quickstart & Pipeline Execution

### 1. Environment Setup
```bash
git clone https://github.com/<your-username>/tourism-analytics.git
cd tourism-analytics
pip install -r requirements.txt
```

### 2. Optional: Generate Benchmark Data (for instant verification)
```bash
python src/generate_sample_data.py
```

### 3. Run Pipeline Stages in Order
```bash
# Phase 1: Clean raw data
python src/data_cleaning.py

# Phase 2: Relational joins & feature engineering
python src/preprocessing.py

# Phase 3: Generate EDA visual charts
python src/eda.py

# Phase 4: Train rating regression models
python src/train_regression.py

# Phase 5: Train visit mode classification models
python src/train_classification.py

# Phase 6: Train recommendation engines
python src/train_recommendation.py

# Phase 7: Generate model comparison markdown
python src/evaluate.py
```

### 4. Launch Streamlit Web Application
```bash
streamlit run app/app.py
```

---

## 🔬 Google Colab Training Workflow

To train on Google Colab with GPU acceleration:

```python
# 1. Clone repo
!git clone https://github.com/<your-username>/tourism-analytics.git
%cd tourism-analytics

# 2. Install dependencies
!pip install -r requirements.txt -q

# 3. Upload & unpack data.zip
from google.colab import files
uploaded = files.upload()
!unzip -o data.zip -d data/raw/

# 4. Execute the complete pipeline
!python src/data_cleaning.py
!python src/preprocessing.py
!python src/eda.py
!python src/train_regression.py
!python src/train_classification.py
!python src/train_recommendation.py
!python src/evaluate.py
```

---

## 📊 Model Evaluation Summary

| Objective | Target | Primary Algorithm | Benchmark Score |
|---|---|---|---|
| **Rating Regression** | `Rating` (1–5) | Gradient Boosting Regressor | **RMSE: 0.6849** (R²: 0.5934) |
| **Visit Mode Classification** | `VisitMode` | Gradient Boosting Classifier | **Macro F1: 0.7320** (Acc: 75.8%) |
| **Attraction Recommendation** | Top-5 Itinerary | Hybrid CF + TF-IDF Content | **Precision@5: 0.2140** (Recall@5: 0.2680) |

---

## 📄 License
Apache-2.0 License. Built for Tourism Experience Analytics.
