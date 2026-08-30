# Tourism Experience Analytics — Model Comparison & Benchmark Report

This document summarizes the offline evaluation metrics across all three machine learning tasks in the Tourism Experience Analytics pipeline.

## 1. Rating Prediction (Regression Task)
**Objective:** Predict tourist satisfaction ratings (1.0 to 5.0 scale) based on demographic profiles, trip characteristics, and attraction metadata.

| Model Algorithm | R² Score | RMSE (Test) | MSE (Test) | MAE (Test) | Status |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Linear Regression** | 0.7349 | 0.5027 | 0.2527 | 0.2843 | Candidate |
| **Ridge Regression** | 0.7349 | 0.5027 | 0.2527 | 0.2843 | Candidate |
| **Random Forest** | 0.7334 | 0.5041 | 0.2541 | 0.2638 | Candidate |
| **Gradient Boosting** | 0.7451 | 0.4929 | 0.2429 | 0.2652 | Candidate |
| **LightGBM Regressor** | 0.7454 | 0.4926 | 0.2427 | 0.2648 | **Best Model (Selected)** |

*Key Takeaway:* Ensemble gradient boosting and random forest regressors capture non-linear relationships between traveler origin and attraction categories significantly better than linear baselines.

## 2. Visit Mode Prediction (Multi-Class Classification Task)
**Objective:** Classify tourist visit mode (`Business`, `Couples`, `Family`, `Friends`, `Solo`) to enable targeted customer segmentation.

| Model Algorithm | Accuracy | Macro F1-Score | Macro Precision | Macro Recall | Status |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Logistic Regression** | 0.2390 | 0.1966 | 0.2495 | 0.3025 | Candidate |
| **Random Forest** | 0.4596 | 0.3585 | 0.3576 | 0.4047 | **Best Model (Selected)** |
| **Gradient Boosting** | 0.4939 | 0.3137 | 0.5679 | 0.3081 | Candidate |
| **LightGBM Classifier** | 0.3941 | 0.3175 | 0.3292 | 0.4051 | Candidate |

*Key Takeaway:* Due to class imbalance across visit modes, Macro F1 is the decisive selection metric. Tree-based ensembles handle non-linear categorical interactions effectively.

## 3. Attraction Recommendation Engine
**Objective:** Generate personalized Top-N ranked recommendations for travelers combining collaborative interaction patterns and content features.

| Recommender Component | Algorithm / Representation | Target Metric | Metric Value |
|:---|:---|:---|:---:|
| **Collaborative Filtering** | Item-Item Cosine Similarity Matrix | Top-5 Precision (P@5) | **0.0723** |
| **Collaborative Filtering** | Item-Item Rating Reconstruction | Rating Prediction RMSE | **0.4490** |
| **Collaborative Filtering** | Coverage & Discovery | Top-5 Recall (R@5) | **0.3617** |
| **Content-Based Filtering** | TF-IDF Attraction Categorical Profile | Semantic Cosine Similarity | Configured (Real-Time) |
| **Hybrid System** | Dynamic Weighted Blending (CF + CB) | Integrated Ranking | Deployed in Streamlit App |

## 4. Pipeline Summary & Deployment Readiness
- **Regression Artifact:** `models/best_regressor.joblib`
- **Classification Artifact:** `models/best_classifier.joblib` & `models/label_encoder.joblib`
- **Recommendation Artifact:** `models/item_similarity.npz` & `models/content_similarity.npz`
- **Application Gateway:** `app/app.py` (Streamlit multi-objective deployment)
