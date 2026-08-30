import { AttractionItem, CleaningStat } from "../types";

export const SAMPLE_ATTRACTIONS: AttractionItem[] = [
  {
    id: 1,
    name: "Eiffel Tower & Champ de Mars",
    category: "Architectural Landmarks",
    city: "Paris",
    country: "France",
    continent: "Europe",
    baseRating: 4.8,
    visitCount: 14250,
    description: "Iconic wrought-iron lattice tower on the Champ de Mars with panoramic city views.",
    imageTag: "🗼 Landmark"
  },
  {
    id: 2,
    name: "Louvre Museum",
    category: "Museums & Art Galleries",
    city: "Paris",
    country: "France",
    continent: "Europe",
    baseRating: 4.7,
    visitCount: 12890,
    description: "World's largest art museum and historic monument home to the Mona Lisa.",
    imageTag: "🎨 Art & History"
  },
  {
    id: 3,
    name: "Fushimi Inari Taisha",
    category: "Religious & Sacred Sites",
    city: "Kyoto",
    country: "Japan",
    continent: "Asia",
    baseRating: 4.9,
    visitCount: 11600,
    description: "Spiritual Shinto shrine famous for its thousands of vibrant vermilion torii gates.",
    imageTag: "⛩️ Sacred Shrine"
  },
  {
    id: 4,
    name: "Tokyo Skytree & Asakusa",
    category: "Architectural Landmarks",
    city: "Tokyo",
    country: "Japan",
    continent: "Asia",
    baseRating: 4.8,
    visitCount: 13100,
    description: "Broadcasting and observation tower offering sweeping views of Mount Fuji and Tokyo skyline.",
    imageTag: "🏙️ Modern City"
  },
  {
    id: 5,
    name: "Colosseum & Roman Forum",
    category: "Historical & Cultural",
    city: "Rome",
    country: "Italy",
    continent: "Europe",
    baseRating: 4.8,
    visitCount: 13950,
    description: "Ancient amphitheatre constructed of travertine stone in the heart of Rome.",
    imageTag: "🏛️ Ancient History"
  },
  {
    id: 6,
    name: "Universal Studios & Sentosa",
    category: "Theme Parks & Entertainment",
    city: "Singapore City",
    country: "Singapore",
    continent: "Asia",
    baseRating: 4.6,
    visitCount: 9800,
    description: "Premier theme park featuring state-of-the-art rides, shows, and attractions based on blockbuster films.",
    imageTag: "🎢 Theme Park"
  },
  {
    id: 7,
    name: "Taj Mahal",
    category: "Historical & Cultural",
    city: "Agra",
    country: "India",
    continent: "Asia",
    baseRating: 4.9,
    visitCount: 10400,
    description: "Ivory-white marble mausoleum on the south bank of the Yamuna river.",
    imageTag: "🕌 World Wonder"
  },
  {
    id: 8,
    name: "Central Park & Broadway",
    category: "Nature & Wildlife",
    city: "New York",
    country: "United States",
    continent: "North America",
    baseRating: 4.6,
    visitCount: 11200,
    description: "Urban park between the Upper West and Upper East Sides of Manhattan.",
    imageTag: "🌳 Urban Nature"
  },
  {
    id: 9,
    name: "Sydney Opera House & Harbour",
    category: "Architectural Landmarks",
    city: "Sydney",
    country: "Australia",
    continent: "Oceania",
    baseRating: 4.8,
    visitCount: 8900,
    description: "Multi-venue performing arts centre at Sydney Harbour, noted for its expressive sail design.",
    imageTag: "🎭 Performing Arts"
  },
  {
    id: 10,
    name: "Sagrada Família",
    category: "Architectural Landmarks",
    city: "Barcelona",
    country: "Spain",
    continent: "Europe",
    baseRating: 4.9,
    visitCount: 10850,
    description: "Antoni Gaudí's masterpiece basilica blending Gothic and Art Nouveau forms.",
    imageTag: "⛪ Basilica"
  },
  {
    id: 11,
    name: "Grand Canyon National Park",
    category: "Nature & Wildlife",
    city: "Flagstaff",
    country: "United States",
    continent: "North America",
    baseRating: 4.9,
    visitCount: 9400,
    description: "Immense canyon carved by the Colorado River, renowned for its layered red rock formations.",
    imageTag: "🏜️ Canyon"
  },
  {
    id: 12,
    name: "Marina Bay Sands SkyPark",
    category: "Theme Parks & Entertainment",
    city: "Singapore City",
    country: "Singapore",
    continent: "Asia",
    baseRating: 4.7,
    visitCount: 8900,
    description: "Iconic cantilevered observation deck with infinity pool overlooking Singapore Marina Bay.",
    imageTag: "🌃 Sky Deck"
  }
];

export const CONTINENT_DATA = [
  { name: "Asia", visits: 21540, share: "40.7%", color: "#3B82F6" },
  { name: "Europe", visits: 15420, share: "29.1%", color: "#10B981" },
  { name: "North America", visits: 8640, share: "16.3%", color: "#F59E0B" },
  { name: "South America", visits: 3120, share: "5.9%", color: "#8B5CF6" },
  { name: "Oceania", visits: 2450, share: "4.6%", color: "#EC4899" },
  { name: "Africa", visits: 1760, share: "3.4%", color: "#6366F1" }
];

export const TOP_COUNTRIES_DATA = [
  { country: "Japan", visits: 6420 },
  { country: "United States", visits: 5890 },
  { country: "France", visits: 5120 },
  { country: "United Kingdom", visits: 4320 },
  { country: "Singapore", visits: 3950 },
  { country: "Italy", visits: 3680 },
  { country: "Germany", visits: 3120 },
  { country: "China", visits: 2980 },
  { country: "Australia", visits: 2450 },
  { country: "India", visits: 2190 }
];

export const RATING_DISTRIBUTION_DATA = [
  { rating: "1 Star", count: 1580, percentage: 3.0, fill: "#EF4444" },
  { rating: "2 Stars", count: 3705, percentage: 7.0, fill: "#F97316" },
  { rating: "3 Stars", count: 9527, percentage: 18.0, fill: "#FBBF24" },
  { rating: "4 Stars", count: 20113, percentage: 38.0, fill: "#34D399" },
  { rating: "5 Stars", count: 18005, percentage: 34.0, fill: "#10B981" }
];

export const VISIT_MODE_DEMO_DATA = [
  { continent: "Asia", Couples: 35, Family: 30, Friends: 18, Business: 10, Solo: 7 },
  { continent: "Europe", Couples: 38, Family: 26, Friends: 17, Business: 12, Solo: 7 },
  { continent: "North America", Couples: 28, Family: 25, Friends: 24, Business: 14, Solo: 9 },
  { continent: "South America", Couples: 30, Family: 28, Friends: 22, Business: 11, Solo: 9 },
  { continent: "Oceania", Couples: 32, Family: 27, Friends: 21, Business: 12, Solo: 8 },
  { continent: "Africa", Couples: 25, Family: 28, Friends: 25, Business: 13, Solo: 9 }
];

export const ATTRACTION_TYPE_STATS = [
  { category: "Architectural Landmarks", visits: 13450, avgRating: 4.82 },
  { category: "Historical & Cultural", visits: 11820, avgRating: 4.79 },
  { category: "Museums & Art", visits: 9450, avgRating: 4.72 },
  { category: "Theme Parks", visits: 8120, avgRating: 4.61 },
  { category: "Nature & Wildlife", visits: 7420, avgRating: 4.68 },
  { category: "Religious & Sacred", visits: 6350, avgRating: 4.88 },
  { category: "Beaches & Water", visits: 4180, avgRating: 4.54 },
  { category: "Culinary & Markets", visits: 3950, avgRating: 4.65 }
];

export const DATA_CLEANING_AUDIT: CleaningStat[] = [
  {
    table: "Transaction.xlsx",
    initialRows: 52930,
    finalRows: 52930,
    initialNulls: 0,
    finalNulls: 0,
    cleaningAction: "Decoded numeric VisitModeId to text labels via Mode.xlsx. Validated rating bounds [1, 5] and verified 100% referential integrity."
  },
  {
    table: "User.xlsx",
    initialRows: 33530,
    finalRows: 33530,
    initialNulls: 4,
    finalNulls: 0,
    cleaningAction: "Imputed 4 missing CityId records with -1 (representing Unspecified City). Standardized schema integers."
  },
  {
    table: "City.xlsx",
    initialRows: 9143,
    finalRows: 9143,
    initialNulls: 1,
    finalNulls: 0,
    cleaningAction: "Imputed 1 missing CityName record with 'Unknown'. Standardized string casing to Title Case and stripped trailing spaces."
  },
  {
    table: "Updated_Item.xlsx",
    initialRows: 1698,
    finalRows: 1698,
    initialNulls: 14,
    finalNulls: 0,
    cleaningAction: "Adopted as canonical catalog (superseding 30-row Item.xlsx). Imputed empty addresses with empty strings. Validated all AttractionIds."
  },
  {
    table: "Country.xlsx",
    initialRows: 165,
    finalRows: 165,
    initialNulls: 0,
    finalNulls: 0,
    cleaningAction: "Standardized country naming and verified RegionId relational mappings."
  },
  {
    table: "Region.xlsx",
    initialRows: 22,
    finalRows: 22,
    initialNulls: 0,
    finalNulls: 0,
    cleaningAction: "Cleaned region hierarchy labels and verified ContinentId foreign keys."
  },
  {
    table: "Continent.xlsx",
    initialRows: 6,
    finalRows: 6,
    initialNulls: 0,
    finalNulls: 0,
    cleaningAction: "Validated master continent reference records."
  },
  {
    table: "Mode.xlsx",
    initialRows: 6,
    finalRows: 6,
    initialNulls: 0,
    finalNulls: 0,
    cleaningAction: "Normalized classification target labels: Business, Couples, Family, Friends, Solo."
  },
  {
    table: "Type.xlsx",
    initialRows: 17,
    finalRows: 17,
    initialNulls: 0,
    finalNulls: 0,
    cleaningAction: "Cleaned 17 attraction category definitions."
  }
];

export const PYTHON_SCRIPTS_CODE: Record<string, { title: string; filename: string; description: string; phase: string }> = {
  data_cleaning: {
    title: "Phase 1: Data Cleaning",
    filename: "src/data_cleaning.py",
    phase: "Phase 1",
    description: "Loads the 9 Excel files, validates schemas, imputes CityId/CityName missing values, strips whitespace, decodes VisitMode labels, and verifies AttractionId foreign key integrity."
  },
  preprocessing: {
    title: "Phase 2: Preprocessing & Features",
    filename: "src/preprocessing.py",
    phase: "Phase 2",
    description: "Builds consolidated master dataset via relational joins, engineers user/attraction aggregate features, builds sparse User-Item interaction matrix, and generates stratified train/test splits."
  },
  eda: {
    title: "Phase 3: Exploratory Data Analysis",
    filename: "src/eda.py",
    phase: "Phase 3",
    description: "Generates 6 publication-ready exploratory visualization figures (demographics, top attractions, rating distributions, correlation heatmaps, visit mode distributions) and exports PNGs to docs/figures/."
  },
  train_regression: {
    title: "Phase 4: Rating Regression",
    filename: "src/train_regression.py",
    phase: "Phase 4",
    description: "Trains Linear Regression, Random Forest, and Gradient Boosting Regressors to predict tourist satisfaction ratings. Evaluates R², RMSE, MSE, MAE, and saves best_regressor.joblib."
  },
  train_classification: {
    title: "Phase 5: Visit Mode Classification",
    filename: "src/train_classification.py",
    phase: "Phase 5",
    description: "Trains Logistic Regression, Random Forest, and Gradient Boosting Classifiers to predict visit mode. Evaluates Accuracy, Macro F1, Macro Precision, Recall, and confusion matrix."
  },
  train_recommendation: {
    title: "Phase 6: Recommendation Engine",
    filename: "src/train_recommendation.py",
    phase: "Phase 6",
    description: "Implements Item-Item Collaborative Filtering (Cosine Similarity) and Content-Based Filtering (TF-IDF), evaluates Precision@5/Recall@5, and saves item_similarity.npz and content_similarity.npz."
  },
  evaluate: {
    title: "Phase 7: Unified Evaluation Summary",
    filename: "src/evaluate.py",
    phase: "Phase 7",
    description: "Loads metrics across regression, classification, and recommendation tasks, generating a unified benchmark report in docs/model_comparison.md."
  },
  streamlit_app: {
    title: "Phase 8: Streamlit Deployment App",
    filename: "app/app.py",
    phase: "Phase 8",
    description: "Full-featured interactive web application with cached model inference, dynamic hybrid weighting slider, real-time predictions, and EDA visualizers."
  }
};
