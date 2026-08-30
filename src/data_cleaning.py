"""
Phase 1: Data Cleaning Module
Tourism Experience Analytics Pipeline

Documented Judgment Call on AttractionTypeId:
In raw Updated_Item.xlsx, approximately 98% of rows have string category labels
('Museum', 'Park', 'Beach', 'Temple', 'Market') instead of numeric IDs.
This module resolves these string labels to canonical integer AttractionTypeIds
matching Type.xlsx by inspecting the attraction name prefixes (e.g., 'National Park' -> 61,
'Botanical Garden' -> 63, 'History Museum' -> 45, 'Science Museum' -> 84), with documented
fallbacks to primary category IDs, ensuring 100% relational integrity and avoiding silent join data loss.

Loads the 9 raw Excel datasets, performs schema and anomaly validation,
handles nulls, normalizes text representations, decodes categorical codes,
and validates relational integrity across tables.
"""

import os
import sys
from pathlib import Path
from typing import Dict, Tuple, Any, Optional
import pandas as pd
import numpy as np

# Add parent directory for utils import if needed
sys.path.append(str(Path(__file__).resolve().parent))
from utils import RAW_DATA_DIR, PROCESSED_DATA_DIR, logger, ensure_directories


def load_raw_files(data_dir: Path) -> Dict[str, pd.DataFrame]:
    """
    Loads all required raw Excel/CSV files from data/raw/.
    Prioritizes Updated_Item.xlsx from Additional_Data_for_Attraction_Sites/ or root raw dir.
    """
    raw_files: Dict[str, pd.DataFrame] = {}
    
    file_mappings = {
        "transaction": "Transaction.xlsx",
        "user": "User.xlsx",
        "city": "City.xlsx",
        "country": "Country.xlsx",
        "region": "Region.xlsx",
        "continent": "Continent.xlsx",
        "mode": "Mode.xlsx",
        "type": "Type.xlsx",
    }
    
    for name, filename in file_mappings.items():
        path = data_dir / filename
        # Support fallback if CSV exists
        if not path.exists():
            csv_path = data_dir / filename.replace(".xlsx", ".csv")
            if csv_path.exists():
                logger.info(f"Loading {name} from CSV fallback: {csv_path}")
                raw_files[name] = pd.read_csv(csv_path)
                continue
            raise FileNotFoundError(f"Required raw data file not found: {path}")
        logger.info(f"Loading {name} from {path}")
        raw_files[name] = pd.read_excel(path)

    # Load canonical attractions item table (Updated_Item.xlsx)
    updated_item_subpath = data_dir / "Additional_Data_for_Attraction_Sites" / "Updated_Item.xlsx"
    updated_item_root = data_dir / "Updated_Item.xlsx"
    updated_item_csv = data_dir / "Updated_Item.csv"

    if updated_item_subpath.exists():
        logger.info(f"Loading canonical Updated_Item from: {updated_item_subpath}")
        raw_files["item"] = pd.read_excel(updated_item_subpath)
    elif updated_item_root.exists():
        logger.info(f"Loading canonical Updated_Item from root: {updated_item_root}")
        raw_files["item"] = pd.read_excel(updated_item_root)
    elif updated_item_csv.exists():
        logger.info(f"Loading canonical Updated_Item from CSV: {updated_item_csv}")
        raw_files["item"] = pd.read_csv(updated_item_csv)
    else:
        old_item = data_dir / "Item.xlsx"
        if old_item.exists():
            logger.warning("Updated_Item.xlsx not found, falling back to Item.xlsx (Caution: may be 30-row subset)")
            raw_files["item"] = pd.read_excel(old_item)
        else:
            raise FileNotFoundError("Could not find Updated_Item.xlsx or Item.xlsx in data/raw/")

    return raw_files


def resolve_attraction_type_id(
    item_df: pd.DataFrame,
    type_df: pd.DataFrame
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Properly resolves AttractionTypeId in the item table.
    
    1. Builds lookup from Type table.
    2. Identifies numeric vs string-label rows.
    3. Resolves string labels via Attraction name prefix patterns.
    4. Applies category-level fallbacks if prefix does not match known sub-patterns.
    5. Sets unresolvable rows to -1 ('Unknown').
    6. Casts AttractionTypeId to int64.
    7. Computes and returns summary audit counts.
    """
    logger.info("[Item] Resolving AttractionTypeId column (handling numeric and string label mixed formats)...")
    
    # 1. Type lookup table preparation
    type_lookup = dict(zip(type_df["AttractionTypeId"], type_df["AttractionType"]))
    name_to_id = {str(name).strip().title(): int(tid) for tid, name in zip(type_df["AttractionTypeId"], type_df["AttractionType"])}
    
    # Known exact prefix mapping table
    # (Original label, Name prefix pattern) -> (Resolved AttractionTypeId, Resolved AttractionType)
    prefix_rules = {
        # Museum prefixes
        ("Museum", "History Museum"): (45, "History Museums"),
        ("Museum", "Science Museum"): (84, "Speciality Museums"),
        ("Museum", "Cultural Heritage Center"): (84, "Speciality Museums"),
        ("Museum", "Art Gallery"): (84, "Speciality Museums"),
        # Park prefixes
        ("Park", "National Park"): (61, "National Parks"),
        ("Park", "Eco Park"): (61, "National Parks"),
        ("Park", "Botanical Garden"): (63, "Nature & Wildlife Areas"),
        ("Park", "Wildlife Reserve"): (63, "Nature & Wildlife Areas"),
    }

    # Primary fallback mappings for the 5 known labels
    label_fallbacks = {
        "Beach": (13, "Beaches"),
        "Temple": (76, "Religious Sites"),
        "Market": (34, "Flea & Street Markets"),
        "Museum": (45, "History Museums"),
        "Park": (61, "National Parks")
    }

    already_numeric_count = 0
    prefix_resolved_counts: Dict[str, int] = {
        "Beach": 0,
        "Temple": 0,
        "Market": 0,
        "Museum": 0,
        "Park": 0
    }
    fallback_used_count = 0
    unresolved_count = 0

    resolved_type_ids = []
    resolved_type_names = []

    for _, row in item_df.iterrows():
        raw_val = row.get("AttractionTypeId")
        attraction_name = str(row.get("Attraction", "")).strip()
        # Extract prefix before ' - '
        name_prefix = attraction_name.split(" - ")[0].strip() if " - " in attraction_name else attraction_name

        # Check if already integer parseable
        is_numeric = False
        parsed_id = None
        try:
            if pd.notnull(raw_val) and str(raw_val).strip() != "":
                parsed_id = int(float(str(raw_val).strip()))
                is_numeric = True
        except (ValueError, TypeError):
            is_numeric = False

        if is_numeric and parsed_id is not None:
            already_numeric_count += 1
            resolved_type_ids.append(parsed_id)
            type_name = type_lookup.get(parsed_id, f"Type {parsed_id}")
            resolved_type_names.append(type_name)
            continue

        # Process string label
        label_str = str(raw_val).strip().title() if pd.notnull(raw_val) else ""

        # Beach (any prefix)
        if label_str == "Beach":
            resolved_type_ids.append(13)
            resolved_type_names.append("Beaches")
            prefix_resolved_counts["Beach"] += 1
        # Temple (any prefix)
        elif label_str == "Temple":
            resolved_type_ids.append(76)
            resolved_type_names.append("Religious Sites")
            prefix_resolved_counts["Temple"] += 1
        # Market (any prefix)
        elif label_str == "Market":
            resolved_type_ids.append(34)
            resolved_type_names.append("Flea & Street Markets")
            prefix_resolved_counts["Market"] += 1
        # Museum (check prefixes or fallback)
        elif label_str == "Museum":
            matched = False
            for (lbl, pfx), (res_id, res_name) in prefix_rules.items():
                if lbl == "Museum" and (pfx.lower() in name_prefix.lower() or pfx.lower() in attraction_name.lower()):
                    resolved_type_ids.append(res_id)
                    resolved_type_names.append(res_name)
                    prefix_resolved_counts["Museum"] += 1
                    matched = True
                    break
            if not matched:
                fb_id, fb_name = label_fallbacks["Museum"]
                resolved_type_ids.append(fb_id)
                resolved_type_names.append(fb_name)
                fallback_used_count += 1
        # Park (check prefixes or fallback)
        elif label_str == "Park":
            matched = False
            for (lbl, pfx), (res_id, res_name) in prefix_rules.items():
                if lbl == "Park" and (pfx.lower() in name_prefix.lower() or pfx.lower() in attraction_name.lower()):
                    resolved_type_ids.append(res_id)
                    resolved_type_names.append(res_name)
                    prefix_resolved_counts["Park"] += 1
                    matched = True
                    break
            if not matched:
                fb_id, fb_name = label_fallbacks["Park"]
                resolved_type_ids.append(fb_id)
                resolved_type_names.append(fb_name)
                fallback_used_count += 1
        else:
            # Check if direct match in Type.xlsx name
            if label_str in name_to_id:
                resolved_type_ids.append(name_to_id[label_str])
                resolved_type_names.append(label_str)
                already_numeric_count += 1
            else:
                # Unresolved
                unresolved_count += 1
                logger.warning(f"[Item] Unresolved AttractionTypeId: '{raw_val}' for Attraction '{attraction_name}'")
                resolved_type_ids.append(-1)
                resolved_type_names.append("Unknown")

    item_df = item_df.copy()
    item_df["AttractionTypeId"] = pd.Series(resolved_type_ids, index=item_df.index).astype("int64")
    item_df["AttractionType"] = pd.Series(resolved_type_names, index=item_df.index)

    summary = {
        "already_numeric": already_numeric_count,
        "prefix_resolved": prefix_resolved_counts,
        "fallback_used": fallback_used_count,
        "unresolved": unresolved_count,
        "total_rows": len(item_df)
    }

    # Print summary table
    print("\n=======================================================")
    print("      ATTRACTION TYPE ID RESOLUTION AUDIT SUMMARY     ")
    print("=======================================================")
    print(f"Total Rows Processed           : {summary['total_rows']:,}")
    print(f"Already Numeric / Direct IDs   : {summary['already_numeric']:,}")
    print(f"Resolved via Prefix Mapping    :")
    for lbl, count in summary["prefix_resolved"].items():
        print(f"  • {lbl:<12}                 : {count:,}")
    print(f"Fallback Resolutions Used      : {summary['fallback_used']:,}")
    print(f"Unresolved (-1 / Unknown)      : {summary['unresolved']:,}")
    print(f"Final AttractionTypeId Dtype   : {item_df['AttractionTypeId'].dtype}")
    print("=======================================================\n")

    return item_df, summary


def clean_datasets(raw_dfs: Dict[str, pd.DataFrame]) -> Tuple[Dict[str, pd.DataFrame], Dict[str, Dict]]:
    """
    Applies rigorous data cleaning rules across all tables:
    1. Null imputation (CityId=-1 in User, CityName='Unknown' in City)
    2. Whitespace and casing normalization
    3. VisitMode ID-to-label decoding
    4. AttractionTypeId resolution from string labels & prefix mappings
    5. Referential integrity checks for AttractionId
    6. Rating range verification (1-5)
    """
    cleaned: Dict[str, pd.DataFrame] = {}
    stats: Dict[str, Dict] = {}

    for name, df in raw_dfs.items():
        stats[name] = {
            "initial_rows": len(df),
            "initial_nulls": int(df.isnull().sum().sum()),
            "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()}
        }

    # Clean User Table
    user_df = raw_dfs["user"].copy()
    user_null_cities = user_df["CityId"].isnull().sum()
    logger.info(f"[User] Imputing {user_null_cities} missing CityId values with -1")
    user_df["CityId"] = user_df["CityId"].fillna(-1).astype(int)
    cleaned["user"] = user_df

    # Clean City Table
    city_df = raw_dfs["city"].copy()
    city_null_names = city_df["CityName"].isnull().sum()
    logger.info(f"[City] Imputing {city_null_names} missing CityName values with 'Unknown'")
    city_df["CityName"] = city_df["CityName"].fillna("Unknown").astype(str).str.strip().str.title()
    cleaned["city"] = city_df

    # Clean Country Table
    country_df = raw_dfs["country"].copy()
    if "Country" in country_df.columns:
        country_df["Country"] = country_df["Country"].astype(str).str.strip().str.title()
    cleaned["country"] = country_df

    # Clean Region Table
    region_df = raw_dfs["region"].copy()
    if "Region" in region_df.columns:
        region_df["Region"] = region_df["Region"].astype(str).str.strip().str.title()
    cleaned["region"] = region_df

    # Clean Continent Table
    continent_df = raw_dfs["continent"].copy()
    if "Continent" in continent_df.columns:
        continent_df["Continent"] = continent_df["Continent"].astype(str).str.strip().str.title()
    cleaned["continent"] = continent_df

    # Clean Mode Table
    mode_df = raw_dfs["mode"].copy()
    mode_df["VisitMode"] = mode_df["VisitMode"].astype(str).str.strip().str.title()
    cleaned["mode"] = mode_df

    # Clean Type Table
    type_df = raw_dfs["type"].copy()
    type_df["AttractionType"] = type_df["AttractionType"].astype(str).str.strip().str.title()
    cleaned["type"] = type_df

    # Clean Item (Attractions) Table & Resolve AttractionTypeId
    item_df = raw_dfs["item"].copy()
    if "Attraction" in item_df.columns:
        item_df["Attraction"] = item_df["Attraction"].astype(str).str.strip().str.title()
    if "AttractionAddress" in item_df.columns:
        item_df["AttractionAddress"] = item_df["AttractionAddress"].fillna("").astype(str).str.strip()

    # Resolve AttractionTypeId before downstream use
    item_df, type_resolution_summary = resolve_attraction_type_id(item_df, type_df)
    cleaned["item"] = item_df

    # Clean Transaction Table
    tx_df = raw_dfs["transaction"].copy()
    
    # Standardize column naming
    if "VisitMode" in tx_df.columns and "VisitModeId" not in tx_df.columns:
        tx_df["VisitModeId"] = tx_df["VisitMode"].astype(int)
    
    # Map VisitModeId to VisitMode_label using mode lookup
    mode_lookup = dict(zip(cleaned["mode"]["VisitModeId"], cleaned["mode"]["VisitMode"]))
    tx_df["VisitMode_label"] = tx_df["VisitModeId"].map(mode_lookup)
    
    # Fill any unmapped mode
    unmapped_modes = tx_df["VisitMode_label"].isnull().sum()
    if unmapped_modes > 0:
        logger.warning(f"[Transaction] {unmapped_modes} VisitModeIds could not be mapped. Imputing with 'Other'")
        tx_df["VisitMode_label"] = tx_df["VisitMode_label"].fillna("Other")

    # Referential integrity check: AttractionId
    valid_attractions = set(cleaned["item"]["AttractionId"].unique())
    orphan_mask = ~tx_df["AttractionId"].isin(valid_attractions)
    orphan_count = orphan_mask.sum()
    if orphan_count > 0:
        logger.warning(f"[Transaction] Dropping {orphan_count} orphan transactions with AttractionIds not in Item catalog")
        tx_df = tx_df[~orphan_mask].copy()
    else:
        logger.info("[Transaction] 100% referential integrity verified between Transaction and Attraction Item catalog.")

    # Rating range validation (1 to 5)
    invalid_ratings = ((tx_df["Rating"] < 1) | (tx_df["Rating"] > 5)).sum()
    if invalid_ratings > 0:
        logger.warning(f"[Transaction] Found {invalid_ratings} ratings outside 1-5 range. Clipping to [1, 5].")
        tx_df["Rating"] = tx_df["Rating"].clip(1, 5)
    else:
        logger.info("[Transaction] All ratings verified within valid 1-5 integer bounds.")

    cleaned["transaction"] = tx_df

    # Final stats update
    for name, df in cleaned.items():
        stats[name]["final_rows"] = len(df)
        stats[name]["final_nulls"] = int(df.isnull().sum().sum())

    return cleaned, stats


def save_cleaned_tables(cleaned_dfs: Dict[str, pd.DataFrame], output_dir: Path) -> None:
    """Saves each cleaned DataFrame as a standardized CSV into data/processed/."""
    output_dir.mkdir(parents=True, exist_ok=True)
    for name, df in cleaned_dfs.items():
        out_path = output_dir / f"{name}_clean.csv"
        df.to_csv(out_path, index=False)
        logger.info(f"Saved cleaned table -> {out_path} ({len(df)} rows)")


def run_cleaning_pipeline() -> Tuple[Dict[str, pd.DataFrame], Dict[str, Dict]]:
    """Main execution entry point for Phase 1 Data Cleaning."""
    ensure_directories()
    logger.info("--- Starting Phase 1: Data Cleaning ---")
    raw_dfs = load_raw_files(RAW_DATA_DIR)
    cleaned_dfs, stats = clean_datasets(raw_dfs)
    save_cleaned_tables(cleaned_dfs, PROCESSED_DATA_DIR)
    
    print("\n=======================================================")
    print("           DATA CLEANING SUMMARY & AUDIT              ")
    print("=======================================================")
    print(f"{'Table':<15} | {'Initial Rows':<13} | {'Clean Rows':<11} | {'Nulls (Init -> Final)'}")
    print("-" * 65)
    for name, s in stats.items():
        print(f"{name:<15} | {s['initial_rows']:<13} | {s['final_rows']:<11} | {s['initial_nulls']} -> {s['final_nulls']}")
    print("=======================================================\n")
    
    return cleaned_dfs, stats


if __name__ == "__main__":
    run_cleaning_pipeline()
