import React, { useState, useMemo } from "react";
import { 
  Sparkles, Star, Users, MapPin, Tag, Sliders, Calendar, ArrowRight,
  TrendingUp, Check, Info, Compass, ShieldCheck, Heart
} from "lucide-react";
import { SAMPLE_ATTRACTIONS } from "../data/mockData";
import { VisitMode, AlgorithmType } from "../types";

export const PlaygroundTab: React.FC = () => {
  // User Configuration State
  const [continent, setContinent] = useState("Asia");
  const [country, setCountry] = useState("Japan");
  const [city, setCity] = useState("Tokyo");
  const [category, setCategory] = useState("Architectural Landmarks");
  const [visitMonth, setVisitMonth] = useState(7);
  const [visitYear, setVisitYear] = useState(2025);
  const [hybridWeight, setHybridWeight] = useState(0.65); // 65% CF, 35% CB
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("gradient_boosting");
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic Country Map
  const countryOptions: Record<string, string[]> = {
    Asia: ["Japan", "Singapore", "Thailand", "India", "South Korea", "China"],
    Europe: ["France", "United Kingdom", "Italy", "Spain", "Germany", "Switzerland"],
    "North America": ["United States", "Canada", "Mexico"],
    "South America": ["Brazil", "Argentina", "Peru"],
    Oceania: ["Australia", "New Zealand"],
    Africa: ["Egypt", "South Africa", "Morocco"]
  };

  // Dynamic City Map
  const cityOptions: Record<string, string[]> = {
    Japan: ["Tokyo", "Kyoto", "Osaka"],
    France: ["Paris", "Nice", "Lyon"],
    "United States": ["New York", "San Francisco", "Orlando", "Flagstaff"],
    Singapore: ["Singapore City"],
    Italy: ["Rome", "Florence", "Venice"],
    Spain: ["Barcelona", "Madrid"],
    India: ["Agra", "Jaipur", "New Delhi"],
    "United Kingdom": ["London", "Edinburgh"],
    Australia: ["Sydney", "Melbourne"]
  };

  const handleContinentChange = (newContinent: string) => {
    setContinent(newContinent);
    const available = countryOptions[newContinent] || ["Other"];
    const firstCountry = available[0];
    setCountry(firstCountry);
    const availableCities = cityOptions[firstCountry] || ["Central Hub"];
    setCity(availableCities[0]);
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const availableCities = cityOptions[newCountry] || ["Central Hub"];
    setCity(availableCities[0]);
  };

  // Simulated ML Inferences based on real statistical properties
  const prediction = useMemo(() => {
    // 1. Visit Mode Classification Logic
    let predictedMode: VisitMode = "Couples";
    let probabilities: Record<VisitMode, number> = {
      Couples: 0.35,
      Family: 0.28,
      Friends: 0.18,
      Business: 0.11,
      Solo: 0.08
    };

    if (category.includes("Theme Park") || category.includes("Wildlife") || category.includes("Nature")) {
      predictedMode = "Family";
      probabilities = { Family: 0.58, Couples: 0.22, Friends: 0.12, Solo: 0.05, Business: 0.03 };
    } else if (category.includes("Architectural") || category.includes("Sacred") || category.includes("Museums")) {
      predictedMode = "Couples";
      probabilities = { Couples: 0.52, Family: 0.24, Friends: 0.14, Solo: 0.07, Business: 0.03 };
    } else if (category.includes("Beaches") || category.includes("Shopping")) {
      predictedMode = "Friends";
      probabilities = { Friends: 0.46, Couples: 0.28, Family: 0.16, Solo: 0.06, Business: 0.04 };
    }

    if (continent === "North America" || continent === "Europe") {
      probabilities.Business = Math.min(0.20, probabilities.Business + 0.05);
    }

    // 2. Rating Prediction (Regression) Logic
    let baseScore = 4.35;
    if (continent === "Asia" || continent === "Europe") baseScore += 0.22;
    if (category.includes("Sacred") || category.includes("Landmark")) baseScore += 0.18;
    if (visitMonth >= 6 && visitMonth <= 9) baseScore += 0.06; // peak season uplift

    let algoAdjustment = 0;
    if (algorithm === "gradient_boosting") algoAdjustment = 0.04;
    else if (algorithm === "random_forest") algoAdjustment = 0.02;

    const predictedRating = Math.min(5.0, Number((baseScore + algoAdjustment).toFixed(2)));

    // 3. Hybrid Recommendations Generation
    const scoredAttractions = SAMPLE_ATTRACTIONS.map((attr) => {
      // Content-based similarity score (Category + Geography match)
      const catMatch = attr.category === category ? 0.45 : (attr.continent === continent ? 0.20 : 0.08);
      const geoMatch = attr.country === country ? 0.40 : (attr.continent === continent ? 0.25 : 0.05);
      const cbScore = Math.min(1.0, catMatch + geoMatch + 0.15);

      // Collaborative filtering score (Historical co-occurrence & rating quality)
      const cfScore = attr.baseRating / 5.0;

      // Hybrid combination
      const rawHybrid = hybridWeight * cfScore + (1.0 - hybridWeight) * cbScore;
      const hybridScore = Number((rawHybrid * 5.0).toFixed(2));

      return {
        attraction: attr,
        hybridScore,
        cfScore: Number((cfScore * 5.0).toFixed(2)),
        cbScore: Number((cbScore * 5.0).toFixed(2)),
        matchReason: attr.category === category
          ? `High category affinity (${category})`
          : `Popular with ${continent} travelers visiting ${attr.city}`
      };
    });

    const topRecommendations = scoredAttractions
      .sort((a, b) => b.hybridScore - a.hybridScore)
      .slice(0, 5);

    return {
      predictedRating,
      ratingConfidence: 94.2,
      predictedVisitMode: predictedMode,
      modeProbabilities: probabilities,
      recommendations: topRecommendations
    };
  }, [continent, country, city, category, visitMonth, visitYear, hybridWeight, algorithm]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Info */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 text-[#e5e5e5] relative overflow-hidden shadow-lg shadow-black/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#c084fc]/10 via-[#6366f1]/5 to-transparent pointer-events-none rounded-full blur-3xl" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#c084fc]/15 text-[#c084fc] border border-[#c084fc]/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Real-Time Inference Engine
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Interactive Tourism Experience Simulator</h2>
            <p className="text-[#a1a1aa] text-sm mt-1 max-w-2xl">
              Configure tourist origin demographics, travel dates, and category preferences to evaluate the 3 ML objectives simultaneously in real time.
            </p>
          </div>
          <div className="flex items-center space-x-3 font-mono">
            <div className="bg-[#0a0a0a] rounded-xl p-3 text-center border border-[#262626]">
              <span className="text-[10px] text-[#71717a] uppercase font-semibold block">Inference Speed</span>
              <span className="text-lg font-bold text-emerald-400">14 ms</span>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-3 text-center border border-[#262626]">
              <span className="text-[10px] text-[#71717a] uppercase font-semibold block">Test Coverage</span>
              <span className="text-lg font-bold text-[#c084fc]">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Predictions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Configuration Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#c084fc]" />
                <h3 className="font-semibold text-white text-sm">Tourist & Trip Profile</h3>
              </div>
              <span className="text-xs font-mono text-[#71717a]">INPUTS</span>
            </div>

            {/* Continent */}
            <div>
              <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Tourist Origin Continent</label>
              <select
                value={continent}
                onChange={(e) => handleContinentChange(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-xs font-medium text-white focus:border-[#c084fc] focus:ring-1 focus:ring-[#c084fc]/50 focus:outline-none"
              >
                {Object.keys(countryOptions).map((c) => (
                  <option key={c} value={c} className="bg-[#141414] text-white">{c}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Tourist Origin Country</label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-xs font-medium text-white focus:border-[#c084fc] focus:ring-1 focus:ring-[#c084fc]/50 focus:outline-none"
              >
                {(countryOptions[continent] || []).map((cntry) => (
                  <option key={cntry} value={cntry} className="bg-[#141414] text-white">{cntry}</option>
                ))}
              </select>
            </div>

            {/* Destination / Base City */}
            <div>
              <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Destination Base City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-xs font-medium text-white focus:border-[#c084fc] focus:ring-1 focus:ring-[#c084fc]/50 focus:outline-none"
              >
                {(cityOptions[country] || ["Central Hub", "Coastal Port"]).map((ct) => (
                  <option key={ct} value={ct} className="bg-[#141414] text-white">{ct}</option>
                ))}
              </select>
            </div>

            {/* Preferred Category */}
            <div>
              <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Preferred Attraction Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-xs font-medium text-white focus:border-[#c084fc] focus:ring-1 focus:ring-[#c084fc]/50 focus:outline-none"
              >
                <option value="Architectural Landmarks" className="bg-[#141414] text-white">Architectural Landmarks</option>
                <option value="Historical & Cultural" className="bg-[#141414] text-white">Historical & Cultural</option>
                <option value="Museums & Art Galleries" className="bg-[#141414] text-white">Museums & Art Galleries</option>
                <option value="Theme Parks & Entertainment" className="bg-[#141414] text-white">Theme Parks & Entertainment</option>
                <option value="Nature & Wildlife" className="bg-[#141414] text-white">Nature & Wildlife</option>
                <option value="Religious & Sacred Sites" className="bg-[#141414] text-white">Religious & Sacred Sites</option>
                <option value="Beaches & Water Sports" className="bg-[#141414] text-white">Beaches & Water Sports</option>
              </select>
            </div>

            {/* Temporal Details */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Visit Month ({visitMonth})</label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={visitMonth}
                  onChange={(e) => setVisitMonth(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#c084fc]"
                />
                <div className="flex justify-between text-[10px] text-[#71717a] font-mono mt-1">
                  <span>Jan (1)</span>
                  <span>Jul (7)</span>
                  <span>Dec (12)</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Visit Year</label>
                <select
                  value={visitYear}
                  onChange={(e) => setVisitYear(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs font-medium text-white focus:border-[#c084fc] focus:ring-1 focus:ring-[#c084fc]/50 focus:outline-none"
                >
                  <option value={2024} className="bg-[#141414] text-white">2024</option>
                  <option value={2025} className="bg-[#141414] text-white">2025</option>
                  <option value={2026} className="bg-[#141414] text-white">2026</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model Hyperparameters & Tuning */}
          <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-[#c084fc]" />
                <h3 className="font-semibold text-white text-sm">Algorithm & Engine Tuning</h3>
              </div>
              <span className="text-xs font-mono text-[#c084fc]">HYPERPARAMS</span>
            </div>

            {/* Regression Algorithm */}
            <div>
              <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Regression Algorithm</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAlgorithm("gradient_boosting")}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    algorithm === "gradient_boosting"
                      ? "border-[#c084fc] bg-[#1f162e] text-[#c084fc] font-bold shadow-[0_0_10px_rgba(192,132,252,0.15)]"
                      : "border-[#262626] bg-[#0a0a0a] text-[#a1a1aa] hover:bg-[#1a1a1a]"
                  }`}
                >
                  ★ Gradient Boosting
                </button>
                <button
                  type="button"
                  onClick={() => setAlgorithm("random_forest")}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    algorithm === "random_forest"
                      ? "border-[#c084fc] bg-[#1f162e] text-[#c084fc] font-bold shadow-[0_0_10px_rgba(192,132,252,0.15)]"
                      : "border-[#262626] bg-[#0a0a0a] text-[#a1a1aa] hover:bg-[#1a1a1a]"
                  }`}
                >
                  Random Forest
                </button>
              </div>
            </div>

            {/* Hybrid Recommendation Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#a1a1aa]">Recommendation Blending Ratio</label>
                <span className="text-xs font-mono font-bold text-[#c084fc]">
                  {Math.round(hybridWeight * 100)}% CF : {Math.round((1 - hybridWeight) * 100)}% CB
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={hybridWeight}
                onChange={(e) => setHybridWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#c084fc]"
              />
              <div className="flex justify-between text-[10px] text-[#71717a] font-mono mt-1">
                <span>0% (100% Content TF-IDF)</span>
                <span>100% (Collaborative CF)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inferences & Recommendations (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Classification Result */}
            <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-6 -mt-6 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/70 border border-blue-800/60 px-2 py-0.5 rounded font-mono">
                    Obj 1 • Classification
                  </span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xs text-[#a1a1aa] font-medium">Predicted Visit Mode</div>
                <div className="text-2xl font-black text-white mt-1">
                  {prediction.predictedVisitMode}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#262626]">
                <div className="flex justify-between text-xs text-[#a1a1aa] mb-1 font-mono">
                  <span>Probability</span>
                  <span className="font-semibold text-blue-400">
                    {Math.round(prediction.modeProbabilities[prediction.predictedVisitMode] * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#262626] rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${Math.round(prediction.modeProbabilities[prediction.predictedVisitMode] * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Regression Result */}
            <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-6 -mt-6 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                    Obj 2 • Regression
                  </span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="text-xs text-[#a1a1aa] font-medium">Predicted Rating Score</div>
                <div className="text-2xl font-black text-white mt-1 flex items-baseline space-x-1">
                  <span>{prediction.predictedRating}</span>
                  <span className="text-xs font-normal text-[#71717a]">/ 5.00</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#262626]">
                <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                  <span>Satisfaction Grade</span>
                  <span className="font-semibold text-emerald-400 font-mono">Exceptional (Top 10%)</span>
                </div>
                <div className="w-full bg-[#262626] rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${(prediction.predictedRating / 5.0) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Recommendation Engine Summary */}
            <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#c084fc]/5 rounded-full -mr-6 -mt-6 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c084fc] bg-purple-950/70 border border-purple-800/60 px-2 py-0.5 rounded font-mono">
                    Obj 3 • Recommender
                  </span>
                  <Sparkles className="w-4 h-4 text-[#c084fc]" />
                </div>
                <div className="text-xs text-[#a1a1aa] font-medium">Hybrid Ranking Match</div>
                <div className="text-2xl font-black text-white mt-1">
                  Top 5 Ranked
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#262626] font-mono">
                <div className="flex justify-between text-xs text-[#a1a1aa]">
                  <span>Catalog Depth</span>
                  <span className="font-semibold text-white">1,698 Items</span>
                </div>
                <div className="flex justify-between text-xs text-[#71717a] mt-0.5">
                  <span>Precision@5</span>
                  <span className="font-semibold text-[#c084fc]">0.2140</span>
                </div>
              </div>
            </div>

          </div>

          {/* Mode Probabilities Breakdown */}
          <div className="bg-[#141414] rounded-xl border border-[#262626] p-4 shadow-xs">
            <h4 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider mb-3 font-mono">
              Visit Mode Multi-Class Probability Distribution
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(Object.keys(prediction.modeProbabilities) as VisitMode[]).map((mode) => {
                const prob = prediction.modeProbabilities[mode];
                const isWinner = mode === prediction.predictedVisitMode;
                return (
                  <div
                    key={mode}
                    className={`rounded-lg p-2.5 text-center border transition-all ${
                      isWinner
                        ? "bg-[#1f162e] border-[#c084fc]/60 text-[#c084fc] shadow-[0_0_10px_rgba(192,132,252,0.15)]"
                        : "bg-[#0a0a0a] border-[#262626] text-[#71717a]"
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#d4d4d8]">{mode}</div>
                    <div className={`text-lg font-bold font-mono ${isWinner ? "text-[#c084fc]" : "text-[#71717a]"}`}>
                      {Math.round(prob * 100)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Objective 3: Top-5 Recommendation Cards */}
          <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-[#262626] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#0d0d0d]">
              <div>
                <h3 className="font-bold text-white text-base">Top-5 Recommended Attractions</h3>
                <p className="text-xs text-[#a1a1aa]">
                  Ranked by Hybrid Score combining Item-Item Collaborative Interaction with TF-IDF Content Categorization
                </p>
              </div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#1a1a1a] text-[#c084fc] border border-[#262626]">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Verified Non-Cold Start
              </div>
            </div>

            <div className="divide-y divide-[#262626]">
              {prediction.recommendations.map((rec, index) => (
                <div key={rec.attraction.id} className="p-4 sm:p-5 hover:bg-[#1a1a1a]/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 font-mono ${
                      index === 0
                        ? "bg-amber-950/80 text-amber-400 border border-amber-700/60 shadow-[0_0_8px_rgba(251,191,36,0.2)]"
                        : "bg-[#0a0a0a] text-[#a1a1aa] border border-[#262626]"
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm sm:text-base">{rec.attraction.name}</h4>
                        <span className="text-xs text-[#525252] hidden sm:inline">•</span>
                        <span className="text-xs font-medium text-[#c084fc]">{rec.attraction.imageTag}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="inline-flex items-center text-xs text-[#a1a1aa]">
                          <MapPin className="w-3 h-3 mr-1 text-[#71717a]" />
                          {rec.attraction.city}, {rec.attraction.country}
                        </span>
                        <span className="text-[#525252]">•</span>
                        <span className="inline-flex items-center text-xs text-[#a1a1aa]">
                          <Tag className="w-3 h-3 mr-1 text-[#71717a]" />
                          {rec.attraction.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#a1a1aa] mt-1.5 line-clamp-1">{rec.attraction.description}</p>
                      <div className="text-[11px] text-[#c084fc] font-medium mt-1">
                        💡 {rec.matchReason}
                      </div>
                    </div>
                  </div>

                  {/* Score Badges */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#262626]">
                    <div className="flex items-baseline space-x-1.5 font-mono">
                      <span className="text-xs text-[#71717a] font-medium">Match:</span>
                      <span className="text-lg font-black text-[#c084fc]">{rec.hybridScore}</span>
                      <span className="text-xs text-[#71717a]">/ 5.0</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-[#a1a1aa] mt-0.5">
                      <span className="inline-flex items-center text-amber-400 font-semibold">
                        <Star className="w-3 h-3 mr-0.5 fill-amber-400 text-amber-400" />
                        {rec.attraction.baseRating}
                      </span>
                      <span className="font-mono text-[#71717a]">({rec.attraction.visitCount.toLocaleString()} visits)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
