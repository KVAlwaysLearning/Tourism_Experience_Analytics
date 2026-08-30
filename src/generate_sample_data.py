"""
Tourism Experience Analytics - Sample Data Generator & Verification Utility
Generates realistic benchmark tables matching the exact schema of the 9 dataset files:
Transaction.xlsx/csv, User.xlsx/csv, City.xlsx/csv, Country.xlsx/csv, Region.xlsx/csv,
Continent.xlsx/csv, Mode.xlsx/csv, Type.xlsx/csv, and Updated_Item.xlsx/csv.
Enables instant end-to-end verification of the data cleaning, preprocessing, EDA,
and ML modeling pipeline without requiring manual external file uploads.
"""

import os
import sys
from pathlib import Path
import numpy as np
import pandas as pd

# Add parent directory for utils import
sys.path.append(str(Path(__file__).resolve().parent))
from utils import RAW_DATA_DIR, ensure_directories, logger


def generate_benchmark_datasets(num_transactions: int = 5000, num_users: int = 1500, num_items: int = 150) -> None:
    """Generates synthetic tourism datasets mirroring real data distributions and schemas."""
    ensure_directories()
    np.random.seed(42)
    logger.info(f"Generating benchmark raw dataset files in {RAW_DATA_DIR}...")

    # 1. Continents
    continents_data = [
        {"ContinentId": 1, "Continent": "Asia"},
        {"ContinentId": 2, "Continent": "Europe"},
        {"ContinentId": 3, "Continent": "North America"},
        {"ContinentId": 4, "Continent": "South America"},
        {"ContinentId": 5, "Continent": "Africa"},
        {"ContinentId": 6, "Continent": "Oceania"}
    ]
    df_continent = pd.DataFrame(continents_data)

    # 2. Regions
    regions_data = [
        {"RegionId": 1, "Region": "East Asia", "ContinentId": 1},
        {"RegionId": 2, "Region": "Southeast Asia", "ContinentId": 1},
        {"RegionId": 3, "Region": "South Asia", "ContinentId": 1},
        {"RegionId": 4, "Region": "Western Europe", "ContinentId": 2},
        {"RegionId": 5, "Region": "Southern Europe", "ContinentId": 2},
        {"RegionId": 6, "Region": "Northern Europe", "ContinentId": 2},
        {"RegionId": 7, "Region": "Northern America", "ContinentId": 3},
        {"RegionId": 8, "Region": "Central America", "ContinentId": 3},
        {"RegionId": 9, "Region": "South America", "ContinentId": 4},
        {"RegionId": 10, "Region": "Northern Africa", "ContinentId": 5},
        {"RegionId": 11, "Region": "Australia and New Zealand", "ContinentId": 6},
    ]
    df_region = pd.DataFrame(regions_data)

    # 3. Countries
    countries_data = [
        {"CountryId": 1, "Country": "Japan", "RegionId": 1},
        {"CountryId": 2, "Country": "China", "RegionId": 1},
        {"CountryId": 3, "Country": "Singapore", "RegionId": 2},
        {"CountryId": 4, "Country": "Thailand", "RegionId": 2},
        {"CountryId": 5, "Country": "India", "RegionId": 3},
        {"CountryId": 6, "Country": "France", "RegionId": 4},
        {"CountryId": 7, "Country": "Germany", "RegionId": 4},
        {"CountryId": 8, "Country": "United Kingdom", "RegionId": 6},
        {"CountryId": 9, "Country": "Italy", "RegionId": 5},
        {"CountryId": 10, "Country": "Spain", "RegionId": 5},
        {"CountryId": 11, "Country": "United States", "RegionId": 7},
        {"CountryId": 12, "Country": "Canada", "RegionId": 7},
        {"CountryId": 13, "Country": "Australia", "RegionId": 11},
    ]
    df_country = pd.DataFrame(countries_data)

    # 4. Cities
    cities_data = [
        {"CityId": 1, "CityName": "Tokyo", "CountryId": 1},
        {"CityId": 2, "CityName": "Kyoto", "CountryId": 1},
        {"CityId": 3, "CityName": "Osaka", "CountryId": 1},
        {"CityId": 4, "CityName": "Singapore City", "CountryId": 3},
        {"CityId": 5, "CityName": "Bangkok", "CountryId": 4},
        {"CityId": 6, "CityName": "Paris", "CountryId": 6},
        {"CityId": 7, "CityName": "Nice", "CountryId": 6},
        {"CityId": 8, "CityName": "London", "CountryId": 8},
        {"CityId": 9, "CityName": "Rome", "CountryId": 9},
        {"CityId": 10, "CityName": "Florence", "CountryId": 9},
        {"CityId": 11, "CityName": "New York", "CountryId": 11},
        {"CityId": 12, "CityName": "San Francisco", "CountryId": 11},
        {"CityId": 13, "CityName": "Sydney", "CountryId": 13},
    ]
    df_city = pd.DataFrame(cities_data)

    # 5. Modes
    modes_data = [
        {"VisitModeId": 1, "VisitMode": "Business"},
        {"VisitModeId": 2, "VisitMode": "Couples"},
        {"VisitModeId": 3, "VisitMode": "Family"},
        {"VisitModeId": 4, "VisitMode": "Friends"},
        {"VisitModeId": 5, "VisitMode": "Solo"},
    ]
    df_mode = pd.DataFrame(modes_data)

    # 6. Types
    types_data = [
        {"AttractionTypeId": 1, "AttractionType": "Architectural Landmarks"},
        {"AttractionTypeId": 2, "AttractionType": "Historical & Cultural"},
        {"AttractionTypeId": 3, "AttractionType": "Museums & Art Galleries"},
        {"AttractionTypeId": 4, "AttractionType": "Theme Parks & Entertainment"},
        {"AttractionTypeId": 5, "AttractionType": "Nature & Wildlife"},
        {"AttractionTypeId": 6, "AttractionType": "Religious & Sacred Sites"},
        {"AttractionTypeId": 7, "AttractionType": "Beaches & Water Sports"},
        {"AttractionTypeId": 8, "AttractionType": "Shopping & Markets"},
    ]
    df_type = pd.DataFrame(types_data)

    # 7. Attractions (Updated_Item)
    attraction_names = [
        "Eiffel Tower", "Louvre Museum", "Tokyo Skytree", "Fushimi Inari Shrine",
        "Colosseum", "Central Park", "Universal Studios", "British Museum",
        "Sydney Opera House", "Taj Mahal", "Sagrada Familia", "Notre-Dame Cathedral",
        "Disneyland Resort", "Acropolis of Athens", "Grand Canyon National Park",
        "Mount Fuji", "Marina Bay Sands", "Statue of Liberty", "Tower Bridge",
        "Pantheon Rome", "Gyeongbokgung Palace", "Uffizi Gallery", "Versailles Palace",
        "Bondi Beach", "Shibuya Crossing", "Kiyomizu-dera", "Rijksmuseum",
        "Vatican Museums", "Alhambra Palace", "Empire State Building"
    ]
    
    items = []
    for i in range(1, num_items + 1):
        name = attraction_names[(i - 1) % len(attraction_names)] + (f" #{i}" if i > len(attraction_names) else "")
        city_id = np.random.choice([c["CityId"] for c in cities_data])
        type_id = np.random.choice([t["AttractionTypeId"] for t in types_data])
        items.append({
            "AttractionId": i,
            "AttractionCityId": city_id,
            "AttractionTypeId": type_id,
            "Attraction": name,
            "AttractionAddress": f"Avenue {i}, District {city_id}"
        })
    df_item = pd.DataFrame(items)

    # 8. Users
    users = []
    for u in range(1, num_users + 1):
        continent_id = np.random.choice([1, 2, 3, 4, 5, 6], p=[0.40, 0.30, 0.15, 0.05, 0.05, 0.05])
        avail_regions = [r["RegionId"] for r in regions_data if r["ContinentId"] == continent_id] or [1]
        region_id = np.random.choice(avail_regions)
        avail_countries = [c["CountryId"] for c in countries_data if c["RegionId"] == region_id] or [1]
        country_id = np.random.choice(avail_countries)
        avail_cities = [c["CityId"] for c in cities_data if c["CountryId"] == country_id] or [1]
        city_id = np.random.choice(avail_cities)
        
        # Inject 4 nulls for testing cleaning
        if u in [5, 12, 23, 42]:
            city_id = np.nan

        users.append({
            "UserId": u,
            "ContinentId": continent_id,
            "RegionId": region_id,
            "CountryId": country_id,
            "CityId": city_id
        })
    df_user = pd.DataFrame(users)

    # 9. Transactions
    transactions = []
    for t in range(1, num_transactions + 1):
        user_id = np.random.randint(1, num_users + 1)
        attraction_id = np.random.randint(1, num_items + 1)
        year = np.random.choice([2022, 2023, 2024, 2025], p=[0.2, 0.3, 0.35, 0.15])
        month = np.random.randint(1, 13)
        mode_id = np.random.choice([1, 2, 3, 4, 5], p=[0.12, 0.32, 0.28, 0.18, 0.10])
        # Ratings distribution skewed towards 4 and 5
        rating = np.random.choice([1, 2, 3, 4, 5], p=[0.03, 0.07, 0.18, 0.38, 0.34])
        
        transactions.append({
            "TransactionId": t,
            "UserId": user_id,
            "VisitYear": year,
            "VisitMonth": month,
            "VisitMode": mode_id,
            "AttractionId": attraction_id,
            "Rating": rating
        })
    df_tx = pd.DataFrame(transactions)

    # Save to CSV and Excel
    tables = {
        "Continent.csv": df_continent,
        "Region.csv": df_region,
        "Country.csv": df_country,
        "City.csv": df_city,
        "Mode.csv": df_mode,
        "Type.csv": df_type,
        "Updated_Item.csv": df_item,
        "User.csv": df_user,
        "Transaction.csv": df_tx
    }

    for filename, df in tables.items():
        csv_path = RAW_DATA_DIR / filename
        df.to_csv(csv_path, index=False)
        xlsx_path = RAW_DATA_DIR / filename.replace(".csv", ".xlsx")
        df.to_excel(xlsx_path, index=False)
        logger.info(f"Generated benchmark dataset: {filename} ({len(df)} rows)")

    # Also place Updated_Item in subfolder
    subfolder = RAW_DATA_DIR / "Additional_Data_for_Attraction_Sites"
    subfolder.mkdir(parents=True, exist_ok=True)
    df_item.to_excel(subfolder / "Updated_Item.xlsx", index=False)
    logger.info("Sample datasets initialized successfully!")


if __name__ == "__main__":
    generate_benchmark_datasets()
