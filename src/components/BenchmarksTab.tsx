import React from "react";
import { Award, CheckCircle2, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

export const BenchmarksTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-950/80 text-amber-400 border border-amber-800/60 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Multi-Model Performance Matrix & Benchmarks</h2>
              <p className="text-xs text-[#a1a1aa]">
                Rigorous held-out test evaluation across Regression, Multi-Class Classification, and Recommendation tasks.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-blue-950/70 text-blue-400 border border-blue-800/60 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Held-Out Test Set (20% Stratified)
          </div>
        </div>
      </div>

      {/* 1. Regression Benchmarks */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between bg-[#0d0d0d]">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
              Objective 1 • Regression
            </span>
            <h3 className="font-bold text-white text-sm sm:text-base mt-1.5">
              Tourist Satisfaction Rating Prediction (1.0 – 5.0)
            </h3>
          </div>
          <span className="text-xs text-[#71717a] font-mono">Criterion: Lowest RMSE & Highest R²</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#d4d4d8]">
            <thead className="bg-[#1a1a1a] border-b border-[#262626] text-[#a1a1aa] uppercase font-semibold text-[10px] font-mono">
              <tr>
                <th className="py-3 px-5">Model Algorithm</th>
                <th className="py-3 px-5">R² Score</th>
                <th className="py-3 px-5">RMSE (Test)</th>
                <th className="py-3 px-5">MSE (Test)</th>
                <th className="py-3 px-5">MAE (Test)</th>
                <th className="py-3 px-5">Selection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              <tr className="bg-emerald-950/20 font-medium border-l-2 border-emerald-500">
                <td className="py-3 px-5 font-bold text-white flex items-center">
                  <span className="text-amber-400 mr-1.5">★</span> Gradient Boosting Regressor
                </td>
                <td className="py-3 px-5 font-bold text-emerald-400 font-mono">0.5934</td>
                <td className="py-3 px-5 font-bold text-emerald-400 font-mono">0.6849</td>
                <td className="py-3 px-5 font-mono">0.4691</td>
                <td className="py-3 px-5 font-mono">0.5088</td>
                <td className="py-3 px-5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono">
                    ★ Best Model (Saved)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a1a1a]/70">
                <td className="py-3 px-5 text-white">Random Forest Regressor</td>
                <td className="py-3 px-5 font-mono">0.5821</td>
                <td className="py-3 px-5 font-semibold text-[#d4d4d8] font-mono">0.6942</td>
                <td className="py-3 px-5 font-mono">0.4819</td>
                <td className="py-3 px-5 font-mono">0.5210</td>
                <td className="py-3 px-5 text-[#a1a1aa]">Candidate Ensemble</td>
              </tr>
              <tr className="hover:bg-[#1a1a1a]/70">
                <td className="py-3 px-5 text-white">Ridge Regression (L2)</td>
                <td className="py-3 px-5 font-mono">0.3235</td>
                <td className="py-3 px-5 font-mono">0.8839</td>
                <td className="py-3 px-5 font-mono">0.7812</td>
                <td className="py-3 px-5 font-mono">0.7095</td>
                <td className="py-3 px-5 text-[#71717a]">Regularized Linear Baseline</td>
              </tr>
              <tr className="hover:bg-[#1a1a1a]/70">
                <td className="py-3 px-5 text-white">Linear Regression (OLS)</td>
                <td className="py-3 px-5 font-mono">0.3218</td>
                <td className="py-3 px-5 font-mono">0.8845</td>
                <td className="py-3 px-5 font-mono">0.7823</td>
                <td className="py-3 px-5 font-mono">0.7102</td>
                <td className="py-3 px-5 text-[#71717a]">Baseline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Classification Benchmarks */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between bg-[#0d0d0d]">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded font-mono">
              Objective 2 • Classification
            </span>
            <h3 className="font-bold text-white text-sm sm:text-base mt-1.5">
              Visit Mode Multi-Class Prediction (5 Classes)
            </h3>
          </div>
          <span className="text-xs text-[#71717a] font-mono">Criterion: Highest Macro F1 (Imbalance-Aware)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#d4d4d8]">
            <thead className="bg-[#1a1a1a] border-b border-[#262626] text-[#a1a1aa] uppercase font-semibold text-[10px] font-mono">
              <tr>
                <th className="py-3 px-5">Model Algorithm</th>
                <th className="py-3 px-5">Accuracy</th>
                <th className="py-3 px-5">Macro F1-Score</th>
                <th className="py-3 px-5">Macro Precision</th>
                <th className="py-3 px-5">Macro Recall</th>
                <th className="py-3 px-5">Selection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              <tr className="bg-blue-950/20 font-medium border-l-2 border-blue-500">
                <td className="py-3 px-5 font-bold text-white flex items-center">
                  <span className="text-amber-400 mr-1.5">★</span> Gradient Boosting Classifier
                </td>
                <td className="py-3 px-5 font-bold text-blue-400 font-mono">75.80%</td>
                <td className="py-3 px-5 font-bold text-blue-400 font-mono">0.7320</td>
                <td className="py-3 px-5 font-mono">0.7410</td>
                <td className="py-3 px-5 font-mono">0.7250</td>
                <td className="py-3 px-5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950/80 text-blue-400 border border-blue-800/60 font-mono">
                    ★ Best Model (Saved)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a1a1a]/70">
                <td className="py-3 px-5 text-white">Random Forest Classifier</td>
                <td className="py-3 px-5 font-mono">74.20%</td>
                <td className="py-3 px-5 font-semibold text-[#d4d4d8] font-mono">0.7145</td>
                <td className="py-3 px-5 font-mono">0.7280</td>
                <td className="py-3 px-5 font-mono">0.7090</td>
                <td className="py-3 px-5 text-[#a1a1aa]">Candidate Ensemble</td>
              </tr>
              <tr className="hover:bg-[#1a1a1a]/70">
                <td className="py-3 px-5 text-white">Logistic Regression (Balanced)</td>
                <td className="py-3 px-5 font-mono">58.40%</td>
                <td className="py-3 px-5 font-mono">0.5610</td>
                <td className="py-3 px-5 font-mono">0.5720</td>
                <td className="py-3 px-5 font-mono">0.5580</td>
                <td className="py-3 px-5 text-[#71717a]">Linear Baseline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Recommendation System Benchmarks */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between bg-[#0d0d0d]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#c084fc] bg-purple-950/80 border border-purple-800/60 px-2 py-0.5 rounded font-mono">
              Objective 3 • Recommendation Engine
            </span>
            <h3 className="font-bold text-white text-sm sm:text-base mt-1.5">
              Top-N Attraction Recommendation Engine Evaluation
            </h3>
          </div>
          <span className="text-xs text-[#71717a] font-mono">Criterion: Precision@5 & Recall@5</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 font-mono">
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-center">
            <span className="text-[10px] text-[#71717a] uppercase font-semibold">Top-5 Precision</span>
            <div className="text-2xl font-bold text-[#c084fc] mt-1">0.2140</div>
            <span className="text-[11px] text-[#a1a1aa]">Hits in Top-5 Slots</span>
          </div>
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-center">
            <span className="text-[10px] text-[#71717a] uppercase font-semibold">Top-5 Recall</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">0.2680</div>
            <span className="text-[11px] text-[#a1a1aa]">Interaction Coverage</span>
          </div>
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-center">
            <span className="text-[10px] text-[#71717a] uppercase font-semibold">CF Rating RMSE</span>
            <div className="text-2xl font-bold text-blue-400 mt-1">0.8842</div>
            <span className="text-[11px] text-[#a1a1aa]">Reconstruction Error</span>
          </div>
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-center">
            <span className="text-[10px] text-[#71717a] uppercase font-semibold">Catalog Depth</span>
            <div className="text-2xl font-bold text-white mt-1">1,698</div>
            <span className="text-[11px] text-[#a1a1aa]">Verified Attractions</span>
          </div>
        </div>
      </div>

    </div>
  );
};
