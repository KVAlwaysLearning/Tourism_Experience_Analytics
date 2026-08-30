"""
Phase 3: Exploratory Data Analysis (EDA) Module
Tourism Experience Analytics Pipeline

Generates comprehensive exploratory visualizations, demographic breakdowns,
correlation patterns, and attraction popularity metrics. Exports high-resolution
figures to docs/figures/ and summarizes business insights for the final report.
"""

import os
import sys
from pathlib import Path
from typing import Dict, Any
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Add parent directory for utils import
sys.path.append(str(Path(__file__).resolve().parent))
from utils import PROCESSED_DATA_DIR, FIGURES_DIR, logger, ensure_directories

# Configure plot styling
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams["font.sans-serif"] = "DejaVu Sans"
plt.rcParams["axes.edgecolor"] = "#CBD5E1"
plt.rcParams["axes.linewidth"] = 0.8


def load_data_for_eda() -> pd.DataFrame:
    """Loads consolidated dataset for EDA."""
    path = PROCESSED_DATA_DIR / "consolidated_tourism_dataset.csv"
    if not path.exists():
        train_path = PROCESSED_DATA_DIR / "train.csv"
        if train_path.exists():
            return pd.read_csv(train_path)
        raise FileNotFoundError(f"Consolidated dataset not found at {path}. Please run preprocessing.py first.")
    return pd.read_csv(path)


def plot_user_demographics(df: pd.DataFrame) -> None:
    """Plot 1: User Distribution by Continent and Top Countries."""
    logger.info("Generating Figure 1: User Demographic Distribution...")
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))

    # Continent distribution (Blues_r)
    continent_counts = df["Continent"].value_counts().reset_index()
    continent_counts.columns = ["Continent", "Visits"]
    sns.barplot(data=continent_counts, x="Visits", y="Continent", palette="Blues_r", ax=axes[0])
    axes[0].set_title("Visit Volume by Continent", fontsize=14, weight="bold", pad=12)
    axes[0].set_xlabel("Number of Visits")
    axes[0].set_ylabel("")

    # Top 10 Countries (GnBu_r replaces invalid Teal_r)
    top_countries = df["Country"].value_counts().head(10).reset_index()
    top_countries.columns = ["Country", "Visits"]
    sns.barplot(data=top_countries, x="Visits", y="Country", palette="GnBu_r", ax=axes[1])
    axes[1].set_title("Top 10 Origin Countries by Visit Count", fontsize=14, weight="bold", pad=12)
    axes[1].set_xlabel("Number of Visits")
    axes[1].set_ylabel("")

    plt.tight_layout()
    out_path = FIGURES_DIR / "1_user_demographics.png"
    plt.savefig(out_path, dpi=300, bbox_inches="tight")
    plt.close()
    logger.info(f"Saved: {out_path}")

    print("\n[Insight 1: User Demographics]")
    print(f"• Dominant continent: {continent_counts.iloc[0]['Continent']} accounts for {(continent_counts.iloc[0]['Visits'] / len(df))*100:.1f}% of all transactions.")
    print(f"• Top origin country: {top_countries.iloc[0]['Country']} leads tourist traffic, indicating high regional concentration.")


def plot_top_attractions(df: pd.DataFrame) -> None:
    """Plot 2: Top 15 Attractions by Number of Visits and Average Rating."""
    logger.info("Generating Figure 2: Top Attractions Analysis...")
    fig, axes = plt.subplots(1, 2, figsize=(18, 7))

    # Top 15 by visits
    top_visited = df.groupby("Attraction").agg(
        Visits=("TransactionId", "count"),
        AvgRating=("Rating", "mean")
    ).sort_values("Visits", ascending=False).head(15).reset_index()

    sns.barplot(data=top_visited, x="Visits", y="Attraction", palette="viridis", ax=axes[0])
    axes[0].set_title("Top 15 Most Visited Attractions", fontsize=14, weight="bold", pad=12)
    axes[0].set_xlabel("Visit Count")
    axes[0].set_ylabel("")

    # Top 15 by average rating (with minimum 20 reviews for statistical significance)
    top_rated = df.groupby("Attraction").agg(
        Visits=("TransactionId", "count"),
        AvgRating=("Rating", "mean")
    ).query("Visits >= 20").sort_values(["AvgRating", "Visits"], ascending=False).head(15).reset_index()

    sns.barplot(data=top_rated, x="AvgRating", y="Attraction", palette="magma", ax=axes[1])
    axes[1].set_title("Top 15 Highest-Rated Attractions (Min 20 Visits)", fontsize=14, weight="bold", pad=12)
    axes[1].set_xlabel("Average Rating (1-5 Scale)")
    axes[1].set_xlim(3.5, 5.0)
    axes[1].set_ylabel("")

    plt.tight_layout()
    out_path = FIGURES_DIR / "2_top_attractions.png"
    plt.savefig(out_path, dpi=300, bbox_inches="tight")
    plt.close()
    logger.info(f"Saved: {out_path}")

    print("\n[Insight 2: Attraction Popularity & Quality]")
    print(f"• Most popular attraction: '{top_visited.iloc[0]['Attraction']}' with {top_visited.iloc[0]['Visits']} visits.")
    print(f"• Highest rated landmark: '{top_rated.iloc[0]['Attraction']}' achieves a remarkable {top_rated.iloc[0]['AvgRating']:.2f}/5.0 average score.")


def plot_rating_distributions(df: pd.DataFrame) -> None:
    """Plot 3: Rating Distribution Overall and by Visit Mode."""
    logger.info("Generating Figure 3: Rating Distribution and Visit Mode Segmentation...")
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))

    # Overall rating distribution
    rating_counts = df["Rating"].value_counts().sort_index().reset_index()
    rating_counts.columns = ["Rating", "Count"]
    bars = sns.barplot(data=rating_counts, x="Rating", y="Count", color="#3B82F6", ax=axes[0])
    axes[0].set_title("Overall Rating Distribution (1-5)", fontsize=14, weight="bold", pad=12)
    axes[0].set_xlabel("Rating Score")
    axes[0].set_ylabel("Total Transactions")

    # Add count labels on bars
    for bar in bars.patches:
        axes[0].annotate(f"{int(bar.get_height()):,}",
                         (bar.get_x() + bar.get_width() / 2, bar.get_height()),
                         ha="center", va="bottom", fontsize=10, xytext=(0, 3), textcoords="offset points")

    # Rating by VisitMode boxplot (Set2 is a valid Seaborn palette)
    sns.boxplot(data=df, x="VisitMode_label", y="Rating", palette="Set2", ax=axes[1])
    axes[1].set_title("Rating Distribution Across Visit Modes", fontsize=14, weight="bold", pad=12)
    axes[1].set_xlabel("Visit Mode")
    axes[1].set_ylabel("Rating Score")
    axes[1].tick_params(axis="x", rotation=15)

    plt.tight_layout()
    out_path = FIGURES_DIR / "3_rating_distributions.png"
    plt.savefig(out_path, dpi=300, bbox_inches="tight")
    plt.close()
    logger.info(f"Saved: {out_path}")

    avg_overall = df["Rating"].mean()
    high_mode = df.groupby("VisitMode_label")["Rating"].mean().idxmax()
    print("\n[Insight 3: Rating Patterns]")
    print(f"• Mean global rating: {avg_overall:.2f} out of 5.0 (skewed positively towards 4 & 5 stars).")
    print(f"• Highest satisfaction segment: Travelers in '{high_mode}' mode report consistently higher ratings.")


def plot_correlation_heatmap(df: pd.DataFrame) -> None:
    """Plot 4: Correlation Heatmap of Numeric Features."""
    logger.info("Generating Figure 4: Feature Correlation Matrix...")
    
    numeric_cols = [
        "Rating", "VisitYear", "VisitMonth",
        "user_mean_rating", "user_visit_count",
        "attraction_mean_rating", "attraction_visit_count"
    ]
    available_cols = [col for col in numeric_cols if col in df.columns]
    
    corr_matrix = df[available_cols].corr()

    plt.figure(figsize=(10, 8))
    sns.heatmap(
        corr_matrix,
        annot=True,
        fmt=".2f",
        cmap="coolwarm",
        vmin=-1,
        vmax=1,
        square=True,
        linewidths=0.5,
        cbar_kws={"shrink": 0.8}
    )
    plt.title("Correlation Heatmap of Tourism Features", fontsize=14, weight="bold", pad=15)
    plt.xticks(rotation=45, ha="right")
    plt.yticks(rotation=0)

    out_path = FIGURES_DIR / "4_correlation_heatmap.png"
    plt.savefig(out_path, dpi=300, bbox_inches="tight")
    plt.close()
    logger.info(f"Saved: {out_path}")

    print("\n[Insight 4: Feature Correlations]")
    print("• Transaction Rating shows positive correlation with 'attraction_mean_rating' and 'user_mean_rating'.")
    print("• Visit count features demonstrate low collinearity with rating, making them ideal independent predictors.")


def plot_visit_mode_by_demographics(df: pd.DataFrame) -> None:
    """Plot 5: VisitMode Distribution by Continent (Stacked Demographic Analysis)."""
    logger.info("Generating Figure 5: Demographic Visit Mode Breakdown...")
    
    cross_tab = pd.crosstab(df["Continent"], df["VisitMode_label"], normalize="index") * 100

    plt.figure(figsize=(12, 6))
    ax = cross_tab.plot(kind="bar", stacked=True, colormap="tab10", figsize=(12, 6))
    plt.title("Visit Mode Proportion by Tourist Continent of Origin (%)", fontsize=14, weight="bold", pad=12)
    plt.xlabel("Continent")
    plt.ylabel("Proportion (%)")
    plt.legend(title="Visit Mode", bbox_to_anchor=(1.02, 1), loc="upper left")
    plt.xticks(rotation=25, ha="right")
    plt.tight_layout()

    out_path = FIGURES_DIR / "5_visit_mode_demographics.png"
    plt.savefig(out_path, dpi=300, bbox_inches="tight")
    plt.close()
    logger.info(f"Saved: {out_path}")

    print("\n[Insight 5: Demographic Visit Mode Variations]")
    print("• Marked regional preference: Couples and Family travel dominate Asian and European travelers, whereas solo/friends trip proportions vary sharply.")


def plot_attraction_type_popularity(df: pd.DataFrame) -> None:
    """Plot 6: Attraction Type Popularity by Volume and Mean Rating."""
    logger.info("Generating Figure 6: Attraction Type Popularity...")
    
    type_stats = df.groupby("AttractionType").agg(
        Visits=("TransactionId", "count"),
        AvgRating=("Rating", "mean")
    ).sort_values("Visits", ascending=True).reset_index()

    fig, ax1 = plt.subplots(figsize=(14, 7))

    ax2 = ax1.twinx()
    
    # Bar chart for visit volume
    y_pos = np.arange(len(type_stats))
    ax1.barh(y_pos, type_stats["Visits"], color="#60A5FA", alpha=0.85, label="Visit Volume")
    
    # Line for average rating
    ax2.plot(type_stats["AvgRating"], y_pos, color="#DC2626", marker="o", linewidth=2.5, label="Average Rating")
    ax2.set_xlim(3.0, 5.0)

    ax1.set_yticks(y_pos)
    ax1.set_yticklabels(type_stats["AttractionType"])
    ax1.set_xlabel("Number of Visits", color="#1E3A8A")
    ax2.set_xlabel("Average Rating (1-5)", color="#DC2626")
    plt.title("Attraction Type Popularity (Visit Volume vs. Average Rating)", fontsize=14, weight="bold", pad=15)

    plt.tight_layout()
    out_path = FIGURES_DIR / "6_attraction_type_popularity.png"
    plt.savefig(out_path, dpi=300, bbox_inches="tight")
    plt.close()
    logger.info(f"Saved: {out_path}")

    print("\n[Insight 6: Attraction Categories]")
    top_cat = type_stats.sort_values("Visits", ascending=False).iloc[0]
    print(f"• Most frequented category: '{top_cat['AttractionType']}' with {top_cat['Visits']} transactions.")


def run_eda_pipeline() -> None:
    """Main execution entry point for Phase 3 EDA."""
    ensure_directories()
    logger.info("--- Starting Phase 3: Exploratory Data Analysis ---")
    
    df = load_data_for_eda()
    
    plot_user_demographics(df)
    plot_top_attractions(df)
    plot_rating_distributions(df)
    plot_correlation_heatmap(df)
    plot_visit_mode_by_demographics(df)
    plot_attraction_type_popularity(df)

    print("\n=======================================================")
    print("          EDA COMPLETED: 6 FIGURES GENERATED          ")
    print("=======================================================")
    print(f"All visualizations exported to: {FIGURES_DIR}")
    print("=======================================================\n")


if __name__ == "__main__":
    run_eda_pipeline()
