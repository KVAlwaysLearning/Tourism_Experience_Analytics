# Tourism Experience Analytics: Classification, Prediction, and Recommendation System
## Technical Report & Project Documentation

**Domain:** Tourism & Hospitality Analytics  
**Architecture:** Multi-Stage Machine Learning Pipeline & Interactive Streamlit Web Application  
**Primary Deliverables:** Cleaned Data Pipeline, Preprocessing Engine, EDA Suite, Regression Predictor, Visit Mode Classifier, Hybrid Recommender, and Deployment App.

---

## Executive Summary

The **Tourism Experience Analytics** system delivers an end-to-end data intelligence and predictive modeling platform designed for destination marketing organizations (DMOs), tour operators, and tourism platforms. By integrating behavioral transaction logs with tourist demographic profiles and attraction catalogs, the platform addresses three primary machine learning tasks:

1. **Satisfaction Rating Prediction (Regression):** Accurately forecasts tourist rating scores (1.0–5.0) to preempt dissatisfaction and protect brand reputation.
2. **Visit Mode Classification (Multi-Class Classification):** Classifies trip context (*Business, Couples, Family, Friends, Solo*) for targeted customer segmentation.
3. **Personalized Attraction Recommendation (Hybrid Filtering):** Generates ranked Top-N attraction recommendations by synthesizing Item-Item Collaborative Filtering with Content-Based TF-IDF semantic profiles.

---

## 1. Data Cleaning & Integrity Architecture

The raw data architecture comprises 9 distinct relational tables spanning 52,930 transactions, 33,530 unique users, and 1,698 verified attractions.

### 1.1 Summary of Table Schemas & Anomalies Detected

| Table Name | Raw Rows | Key Columns | Issues Identified & Cleaned | Resolution Strategy |
|:---|:---:|:---|:---|:---|
| `Transaction.xlsx` | 52,930 | `TransactionId, UserId, VisitYear, VisitMonth, VisitMode, AttractionId, Rating` | Numeric `VisitMode` ID codes, unverified rating bounds. | Decoded to text labels via `Mode.xlsx`, bounded ratings to [1, 5], verified 100% referential integrity with attractions catalog. |
| `User.xlsx` | 33,530 | `UserId, ContinentId, RegionId, CountryId, CityId` | 4 records with missing `CityId`. | Imputed missing `CityId` with `-1` (representing Unknown/Unspecified City). |
| `City.xlsx` | 9,143 | `CityId, CityName, CountryId` | 1 record with missing `CityName`, inconsistent casing/spaces. | Imputed null with `'Unknown'`, applied Title Case normalization and trimmed whitespace. |
| `Country.xlsx` | 165 | `CountryId, Country, RegionId` | Inconsistent string casing. | Standardized text casing and whitespace trimming. |
| `Region.xlsx` | 22 | `Region, RegionId, ContinentId` | Category text standardization. | Trimmed and formatted to standardized title case. |
| `Continent.xlsx` | 6 | `ContinentId, Continent` | Text standardization. | Normalized string formatting. |
| `Mode.xlsx` | 6 | `VisitModeId, VisitMode` | Lookup table. | Trimmed labels (`Business`, `Couples`, `Family`, `Friends`, `Solo`). |
| `Type.xlsx` | 17 | `AttractionTypeId, AttractionType` | Category catalog. | Normalized category names across 17 distinct attraction types. |
| `Updated_Item.xlsx` | 1,698 | `AttractionId, AttractionCityId, AttractionTypeId, Attraction, AttractionAddress` | Legacy `Item.xlsx` contained only 30 rows. | Canonical `Updated_Item.xlsx` (1,698 attractions) selected as primary source; full catalog validated against transaction logs. |

---

## 2. Preprocessing & Feature Engineering

### 2.1 Multi-Table Relational Pipeline
The relational data was consolidated through hierarchical joins:
$$\text{Transaction} \xrightarrow{\text{UserId}} \text{User} \xrightarrow{\text{CityId}} \text{City} \xrightarrow{\text{CountryId}} \text{Country} \xrightarrow{\text{RegionId}} \text{Region} \xrightarrow{\text{ContinentId}} \text{Continent}$$
$$\text{Transaction} \xrightarrow{\text{AttractionId}} \text{Updated\_Item} \xrightarrow{\text{AttractionTypeId}} \text{Type}$$

### 2.2 Engineered Behavioral Features
1. **User Aggregate Signals:**
   - `user_mean_rating`: Historical average satisfaction rating given by the user.
   - `user_visit_count`: Total transaction activity count per user.
   - `user_dominant_mode`: Modal visit context across the user's historical visits.
2. **Attraction Aggregate Signals:**
   - `attraction_mean_rating`: Global average review rating received by the attraction.
   - `attraction_visit_count`: Historical footfall volume and popularity index.
3. **Temporal Features:**
   - `VisitSeason`: Derived from `VisitMonth` (*Winter, Spring, Summer, Autumn*).
4. **Data Splitting & Scaling:**
   - Split: 80% Train, 20% Test (Stratified by `VisitMode_label` to preserve target distributions).
   - Scaling: `StandardScaler` fitted **strictly on the training split** to prevent data leakage.

---

## 3. Exploratory Data Analysis & Visual Insights

Six core visualizations were generated to uncover behavioral dynamics:

1. **User Demographics (`1_user_demographics.png`):** Asian and European visitors account for over 68% of total visits, highlighting primary geographic tourist corridors.
2. **Top Attractions (`2_top_attractions.png`):** Flagship historical and architectural landmarks (e.g., Eiffel Tower, Fushimi Inari, Colosseum) command both the highest visit volume and top-tier satisfaction ratings (>4.7/5.0).
3. **Rating Distribution (`3_rating_distributions.png`):** Satisfaction is positively skewed with an overall mean of 4.35 stars. Couples and family travelers report the lowest variance and highest median scores.
4. **Correlation Matrix (`4_correlation_heatmap.png`):** Transaction rating correlates moderately with `attraction_mean_rating` (r = 0.62) and `user_mean_rating` (r = 0.48), confirming strong predictive utility.
5. **Demographic Visit Modes (`5_visit_mode_demographics.png`):** Family and Couples travel dominate long-haul international visitors, while domestic travelers show higher Solo and Friends trip frequencies.
6. **Attraction Type Popularity (`6_attraction_type_popularity.png`):** Cultural Landmarks and Theme Parks lead transaction volumes, while Sacred/Spiritual sites achieve the highest average ratings.

---

## 4. Machine Learning Model Comparison & Evaluation

### 4.1 Regression: Rating Prediction
**Target:** Continuous Rating $[1.0, 5.0]$

| Algorithm | R² Score | RMSE (Test) | MSE (Test) | MAE (Test) | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| **Gradient Boosting Regressor** | **0.5934** | **0.6849** | **0.4691** | **0.5088** | **★ Best Model** |
| Random Forest Regressor | 0.5821 | 0.6942 | 0.4819 | 0.5210 | Candidate |
| Ridge Regression | 0.3235 | 0.8839 | 0.7812 | 0.7095 | Baseline |
| Linear Regression | 0.3218 | 0.8845 | 0.7823 | 0.7102 | Baseline |

### 4.2 Classification: Visit Mode Prediction
**Target:** 5 Classes (*Business, Couples, Family, Friends, Solo*)

| Algorithm | Accuracy | Macro F1-Score | Macro Precision | Macro Recall | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| **Gradient Boosting Classifier** | **75.8%** | **0.7320** | **0.7410** | **0.7250** | **★ Best Model** |
| Random Forest Classifier | 74.2% | 0.7145 | 0.7280 | 0.7090 | Candidate |
| Logistic Regression | 58.4% | 0.5610 | 0.5720 | 0.5580 | Baseline |

### 4.3 Recommendation System: Dual Hybrid Engine
- **Item-Item Collaborative Filtering:** Evaluated via Cosine Similarity over user-item rating vectors.
  - **Precision@5:** `0.2140`
  - **Recall@5:** `0.2680`
  - **Reconstruction RMSE:** `0.8842`
- **Content-Based Filtering:** TF-IDF feature vectors over `AttractionType`, `CityName`, and `Country`.
- **Hybrid Blending Equation:**
$$\text{Score}_{\text{Hybrid}}(u, i) = \alpha \cdot \text{Score}_{\text{CF}}(u, i) + (1 - \alpha) \cdot \text{Score}_{\text{CB}}(u, i)$$
  where $\alpha \in [0, 1]$ is configurable via the UI slider.

---

## 5. Strategic Business Applications (The 4 Core Pillars)

### 5.1 Personalization
Delivers hyper-personalized Top-5 itineraries based on live user inputs, origin demographics, and similarity modeling, increasing user engagement and booking conversions.

### 5.2 Tourism Analytics & Demand Planning
Enables tourism authorities to forecast demand spikes across seasons and origin countries, assisting in municipal crowd management and transport scheduling.

### 5.3 Customer Segmentation & Mode Targeting
Accurately classifying visit modes allows operators to design customized travel packages (e.g., family entertainment bundles vs. executive business excursions).

### 5.4 Retention & Quality Optimization
Predictive regression models allow operators to detect potential negative experiences in real-time, enabling proactive service recovery before negative reviews are posted.

---

## 6. Streamlit Web Application Guide

The deployment application (`app/app.py`) provides:
- **Interactive Control Sidebar:** Dynamic dropdowns for Continent, Country, City, Category, and Visit Date.
- **Real-Time Prediction Cards:** Instant classification of Visit Mode and forecasted Satisfaction Rating.
- **Ranked Recommendation Table:** Formatted Top-5 attractions with dynamic hybrid score weighting.
- **Embedded Visualizations:** One-click inspection of EDA charts and benchmark matrices.
