# Tourism Experience Analytics: Classification, Prediction, and Recommendation System
## Technical Report & Project Documentation

**Domain:** Tourism & Hospitality Analytics
**Architecture:** Multi-stage machine learning pipeline (regression, classification, recommendation) with an interactive Streamlit deployment.
**Live Application:** https://tourismexperienceanalytics-app0.streamlit.app/

---

## Executive Summary

This project builds an end-to-end analytics pipeline over a real tourism transaction dataset — 52,930 transactions, 33,530 users, and a catalog of 1,698 attractions, of which 30 have recorded visits, heavily concentrated in Bali and other Indonesian destinations. The pipeline addresses three tasks:

1. **Rating Prediction (Regression):** forecasts a tourist's satisfaction rating (1–5) for a given visit.
2. **Visit Mode Classification:** predicts the trip context (*Business, Couples, Family, Friends, Solo*) from demographic and visit features.
3. **Attraction Recommendation:** ranks personalized Top-N attraction suggestions using item-based collaborative filtering.

All results below are the actual numbers produced by running the pipeline against the real dataset (`docs/model_comparison.md`), not illustrative or placeholder figures.

---

## 1. Data Cleaning & Integrity

The raw dataset comprises 9 relational tables.

| Table | Rows | Issues found | Resolution |
|---|---:|---|---|
| `Transaction.xlsx` | 52,930 | `VisitMode` stored as a numeric ID rather than a label | Decoded to text via `Mode.xlsx`; kept both id and label |
| `User.xlsx` | 33,530 | 4 rows missing `CityId` | Imputed with `-1` (Unknown) |
| `City.xlsx` | 9,143 | 1 row missing `CityName` | Imputed with `'Unknown'`; text normalized |
| `Country.xlsx` / `Region.xlsx` / `Continent.xlsx` | 165 / 22 / 6 | Inconsistent casing/whitespace | Title-cased and trimmed |
| `Mode.xlsx` | 6 | Lookup table | Trimmed labels |
| `Type.xlsx` | 17 | Category catalog | Normalized category names |
| `Updated_Item.xlsx` | 1,698 | **1,668 of 1,698 rows (98%) had a text label — `Museum`, `Park`, `Beach`, `Temple`, or `Market` — sitting in the numeric `AttractionTypeId` column instead of an ID.** The legacy `Item.xlsx` (only 30 rows) was superseded entirely. | Resolved via a documented rules-based mapping built from the actual name patterns under each label (e.g. "History Museum" → History Museums; "Science Museum"/"Art Gallery"/"Cultural Heritage Center" → Speciality Museums; "National Park"/"Eco Park" → National Parks; "Botanical Garden"/"Wildlife Reserve" → Nature & Wildlife Areas). All 1,698 rows resolved cleanly with 0 unresolved and 0 fallback cases. |

This last item is the most significant data-quality issue in the project — left unresolved, it would have silently nulled out the `AttractionType` feature for 98% of the catalog, degrading both the classifier and the recommender without raising any error.

---

## 2. Preprocessing & Feature Engineering

**Join path:** `Transaction → User → City → Country → Region → Continent`, and `Transaction → Updated_Item → Type`.

**Features used by the trained models** (from the saved feature manifests):
- `VisitYear`, `VisitMonth`
- `Continent_encoded`, `Country_encoded`, `AttractionType_encoded`
- `VisitMode_label_encoded` (regression only, since it's the classification target)
- `user_mean_rating`, `user_visit_count` — per-user aggregates
- `attraction_mean_rating`, `attraction_visit_count` — per-attraction aggregates

**Split:** 80/20 train/test, stratified by `VisitMode_label`. Scaling fit strictly on the training split.

**A methodological note worth flagging honestly:** `user_mean_rating` turns out to be the single strongest predictor of `Rating` (see Section 3). Because this feature is an aggregate of a user's own historical ratings, there's a risk of it partly reflecting the target itself rather than an independent signal — a common effect in aggregate-feature pipelines. This doesn't invalidate the regression result, but it's worth treating the R² figure as an upper bound rather than a guaranteed generalization number, and is a good candidate for a leave-one-out aggregate calculation in a future iteration.

---

## 3. Exploratory Data Analysis

### 3.1 Where tourists come from

![User demographics](report_images/1_user_demographics.png)

Visit volume splits fairly evenly across three continents — Asia (~15,700), Australia & Oceania (~14,800), and Europe (~13,300) — with America (~8,200) and Africa (~850) well behind. At the country level, **Australia is the single dominant origin market by a wide margin** (~13,000 visits, roughly double the UK's ~6,700 and the US's ~6,200), followed by the UK, US, and Indonesia (~4,800, likely domestic tourism given the destinations below).

### 3.2 What they visit

![Top attractions](report_images/2_top_attractions.png)

The catalog is dominated by Indonesian, specifically Balinese, destinations. **Sacred Monkey Forest Sanctuary** is by far the most-visited attraction (~13,000 visits — more than double the next entry), followed by Waterbom Bali (~6,500) and Tegalalang Rice Terrace (~5,800). By rating (minimum 20 visits), **Mount Semeru Volcano** (~4.7) and Waterbom Bali (~4.65) lead — notably, the single most-visited attraction (Sacred Monkey Forest Sanctuary) only ranks 8th by rating (~4.27), meaning volume and satisfaction don't fully align here.

### 3.3 Rating patterns

![Rating distributions](report_images/3_rating_distributions.png)

Ratings are strongly skewed positive: 23,936 five-star and 17,966 four-star ratings account for the large majority of the 52,930 transactions, against only 1,263 one-star and 2,035 two-star ratings. Overall mean rating is approximately **4.16**.

The boxplot across visit modes is worth noting for what it *doesn't* show: Couples, Friends, Family, Solo, and Business all have **visually identical distributions** — same median (4), same interquartile range (4–5), same low-end outliers (1–2). Visit mode alone does not appear to meaningfully drive satisfaction in this dataset; this is a legitimate finding, not a gap in the analysis.

### 3.4 What actually correlates with rating

![Correlation heatmap](report_images/4_correlation_heatmap.png)

`user_mean_rating` is the dominant correlate of `Rating` at **r = 0.85** — a user's own rating history is a much stronger signal than anything about the attraction itself. `attraction_mean_rating` correlates far more modestly (r = 0.30), and `attraction_visit_count` weaker still (r = 0.12). `VisitYear` and `VisitMonth` show essentially no linear relationship with rating (r ≈ 0.00–0.02). This is consistent with the leakage caveat noted in Section 2 — the regression model is likely leaning heavily on the "generous raters rate generously" pattern rather than attraction-specific quality signals.

### 3.5 Visit mode by origin

![Visit mode by continent](report_images/5_visit_mode_demographics.png)

The most distinctive pattern here is **Australia & Oceania**: Family visits make up roughly 39% of its total — clearly the highest Family share of any continent — and it's the only continent shown with **zero recorded Business visits**. Asia and America are the only continents with a visible (if small, ~2–3%) Business segment. Europe, Africa, and America are all Couples-dominant (~45–52%), while Asia has a comparatively larger Friends share alongside its Family-heavy profile.

### 3.6 Attraction type vs. rating

![Attraction type popularity](report_images/6_attraction_type_popularity.png)

Across the 17 attraction categories, **Water Parks** and **Nature & Wildlife Areas** post the highest average ratings (~4.6+), while **Historic Sites** rates lowest (~3.55) — a roughly one-point spread across categories, the widest pattern in the EDA. (Note: this chart's visit-volume axis is difficult to read precisely due to a dual-encoding layout issue; the rating trend by category is the reliable takeaway here, not exact visit counts.)

---

## 4. Model Comparison & Evaluation

*(Numbers below are from `docs/model_comparison.md`, generated by `evaluate.py` from the actual trained models — reconfirmed independently during review.)*

### 4.1 Regression: Rating Prediction

| Algorithm | R² Score | RMSE | MSE | MAE | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| Linear Regression | 0.7349 | 0.5027 | 0.2527 | 0.2843 | Candidate |
| Ridge Regression | 0.7349 | 0.5027 | 0.2527 | 0.2843 | Candidate |
| Random Forest | 0.7334 | 0.5041 | 0.2541 | 0.2638 | Candidate |
| Gradient Boosting | 0.7451 | 0.4929 | 0.2429 | 0.2652 | Candidate |
| **LightGBM Regressor** | **0.7454** | **0.4926** | **0.2427** | **0.2648** | **★ Best Model** |

All five models land within a fairly tight R² band (0.73–0.75) — given `user_mean_rating`'s dominant correlation noted above, this is expected: the models are largely converging on the same strong signal rather than differentiating heavily on modeling technique.

### 4.2 Classification: Visit Mode Prediction

| Algorithm | Accuracy | Macro F1 | Macro Precision | Macro Recall | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| Logistic Regression | 23.9% | 0.1966 | 0.2495 | 0.3025 | Candidate |
| **Random Forest** | 46.0% | **0.3585** | 0.3576 | 0.4047 | **★ Best Model** |
| Gradient Boosting | 49.4% | 0.3137 | 0.5679 | 0.3081 | Candidate |
| LightGBM Classifier | 39.4% | 0.3175 | 0.3292 | 0.4051 | Candidate |

Worth explaining the selection: Gradient Boosting has the *highest raw accuracy* (49.4%), but Random Forest was selected because it has the best *Macro F1* (0.3585) — the fairer metric here given the class imbalance across visit modes (Couples and Family dominate the dataset; Business is rare, as also seen in Section 3.5). Gradient Boosting's high accuracy comes partly from favoring majority classes, which Macro F1 penalizes.

### 4.3 Attraction Recommendation (Item-Item Collaborative Filtering)

| Metric | Value |
|---|:---:|
| Precision@5 | 0.0723 |
| Recall@5 | 0.3617 |
| Rating prediction RMSE | 0.4490 |

Precision@5 is low in absolute terms, but this is a direct consequence of the catalog: only 30 of the 1,698 attractions in `Updated_Item.xlsx` have any recorded transactions, so the eligible recommendation pool per user is small and ratings are sparse. Recall@5 of 0.36 — the model rediscovers a user's held-out liked attraction within its top-5 about 36% of the time — is a more informative number given that constraint.

---

## 5. Business Applications

Tied to the four core use cases named in the project brief, grounded in what the data actually shows:

**Personalization.** With Australia contributing roughly a quarter of all visits and Bali-area attractions dominating the catalog, a DMO or tour operator serving Australian travelers specifically could prioritize this rating/recommendation pipeline for that segment first, where data density is highest.

**Tourism Analytics & Demand Planning.** The volume gap between the top attraction (Sacred Monkey Forest Sanctuary, ~13,000 visits) and the rest of the catalog signals a concentration risk — most demand is funneled through a small number of sites, useful for capacity and crowd-management planning at those specific locations.

**Customer Segmentation.** The Australia & Oceania Family-travel skew (Section 3.5) is actionable — family-oriented packages and amenities are likely to resonate more with that specific origin market than with, say, European travelers, who skew more Couples-oriented.

**Retention & Quality.** Since attraction-level quality (`attraction_mean_rating`) explains rating outcomes far less than a user's own rating tendency does (Section 3.4), attraction-specific "quality alerts" from this regression model should be read cautiously — a drop in predicted rating may reflect a change in who's visiting rather than a change in the attraction itself.

---

## 6. Streamlit Application

Live at: **https://tourismexperienceanalytics-app0.streamlit.app/**

The app (`app/app.py`) provides:
- A sidebar form for continent, country, city, attraction-type preference, and visit date
- A Random Forest–predicted Visit Mode for the given inputs
- A Top-5 recommended attraction list from the collaborative filtering model
- Embedded EDA visualizations for context

---

## 7. Known Limitations

- **Recommendation coverage** is limited to the 30 attractions with recorded transactions; the remaining 1,668 catalog entries have no interaction data to recommend from.
- **Classification performance is modest** (46% accuracy, 0.36 Macro F1) — visit mode is a genuinely hard, imbalanced 5-class problem from these features alone; this should be reported as a real finding, not something to over-tune away.
- **Regression R² may be partly inflated** by the `user_mean_rating` feature's proximity to the target, as noted in Sections 2 and 3.4 — worth a follow-up iteration using leave-one-out aggregate features if pursued further.
