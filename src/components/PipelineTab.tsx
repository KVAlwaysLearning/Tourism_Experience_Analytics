import React from "react";
import { Database, CheckCircle2, ArrowRight, ShieldCheck, FileCheck, Layers, Sparkles, Filter } from "lucide-react";
import { DATA_CLEANING_AUDIT } from "../data/mockData";

export const PipelineTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Data Architecture & Preprocessing Pipeline</h2>
              <p className="text-xs text-[#a1a1aa]">
                End-to-end data cleaning, multi-table relational joins, anomaly imputation, and feature engineering.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-mono">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Zero Leakage (Split-Before-Scale)
          </div>
        </div>
      </div>

      {/* Relational Join Flow Diagram */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-xs">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center font-mono">
          <Layers className="w-4 h-4 mr-2 text-[#c084fc]" />
          Multi-Table Relational Schema Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded font-mono">Core Fact</span>
            <h4 className="font-bold text-white text-sm mt-2 font-mono">Transaction.xlsx</h4>
            <p className="text-[11px] text-[#a1a1aa] mt-1">52,930 Records • Rating (1-5)</p>
            <div className="mt-3 text-[10px] text-[#71717a] font-mono bg-[#141414] border border-[#262626] rounded p-1.5">
              UserId, AttractionId, VisitMode
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">User Hierarchy</span>
            <h4 className="font-bold text-white text-sm mt-2 font-mono">User → City → Country</h4>
            <p className="text-[11px] text-[#a1a1aa] mt-1">33,530 Users • 9,143 Cities</p>
            <div className="mt-3 text-[10px] text-[#71717a] font-mono bg-[#141414] border border-[#262626] rounded p-1.5">
              CityId, CountryId, RegionId
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-[#c084fc] bg-purple-950/80 border border-purple-800/60 px-2 py-0.5 rounded font-mono">Catalog Master</span>
            <h4 className="font-bold text-white text-sm mt-2 font-mono">Updated_Item.xlsx</h4>
            <p className="text-[11px] text-[#a1a1aa] mt-1">1,698 Canonical Attractions</p>
            <div className="mt-3 text-[10px] text-[#71717a] font-mono bg-[#141414] border border-[#262626] rounded p-1.5">
              AttractionId, TypeId, CityId
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 rounded font-mono">Lookups</span>
            <h4 className="font-bold text-white text-sm mt-2 font-mono">Mode & Type Tables</h4>
            <p className="text-[11px] text-[#a1a1aa] mt-1">5 Visit Modes • 17 Categories</p>
            <div className="mt-3 text-[10px] text-[#71717a] font-mono bg-[#141414] border border-[#262626] rounded p-1.5">
              VisitMode_label, AttractionType
            </div>
          </div>
        </div>
      </div>

      {/* Data Cleaning Audit Table */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between bg-[#0d0d0d]">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Phase 1: Data Cleaning & Integrity Audit</h3>
          </div>
          <span className="text-xs text-[#71717a] font-mono">9 Master Tables Audited</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#d4d4d8]">
            <thead className="bg-[#1a1a1a] border-b border-[#262626] text-[#a1a1aa] uppercase font-semibold text-[10px] tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Table Name</th>
                <th className="py-3 px-4">Initial Rows</th>
                <th className="py-3 px-4">Clean Rows</th>
                <th className="py-3 px-4">Nulls (Pre → Post)</th>
                <th className="py-3 px-4">Cleaning Actions Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {DATA_CLEANING_AUDIT.map((row) => (
                <tr key={row.table} className="hover:bg-[#1a1a1a]/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-white font-mono">{row.table}</td>
                  <td className="py-3 px-4 font-mono">{row.initialRows.toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400 font-mono">{row.finalRows.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-[#0a0a0a] text-[#a1a1aa] border border-[#262626]">
                      {row.initialNulls} → {row.finalNulls}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#a1a1aa] max-w-md">{row.cleaningAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Engineering Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            <span>User Behavioral Aggregates</span>
          </div>
          <ul className="space-y-2 text-xs text-[#a1a1aa]">
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-1.5">•</span>
              <div><strong className="text-white font-mono">user_mean_rating:</strong> Historic average score given by user.</div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-1.5">•</span>
              <div><strong className="text-white font-mono">user_visit_count:</strong> Activity volume and frequency.</div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 font-bold mr-1.5">•</span>
              <div><strong className="text-white font-mono">user_dominant_mode:</strong> Preferred trip mode (e.g. Couples).</div>
            </li>
          </ul>
        </div>

        <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Attraction Popularity Signals</span>
          </div>
          <ul className="space-y-2 text-xs text-[#a1a1aa]">
            <li className="flex items-start">
              <span className="text-emerald-400 font-bold mr-1.5">•</span>
              <div><strong className="text-white font-mono">attraction_mean_rating:</strong> Global benchmark review score.</div>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-400 font-bold mr-1.5">•</span>
              <div><strong className="text-white font-mono">attraction_visit_count:</strong> Historical popularity index.</div>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-400 font-bold mr-1.5">•</span>
              <div><strong className="text-white font-mono">Category & Location:</strong> Hierarchical geographic one-hot tags.</div>
            </li>
          </ul>
        </div>

        <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-[#c084fc] font-bold text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Matrix & Recommendation Pipeline</span>
          </div>
          <ul className="space-y-2 text-xs text-[#a1a1aa]">
            <li className="flex items-start">
              <span className="text-[#c084fc] font-bold mr-1.5">•</span>
              <div><strong className="text-white font-mono">Sparse CSR Matrix:</strong> 33,530 users × 1,698 items.</div>
            </li>
            <li className="flex items-start">
              <span className="text-[#c084fc] font-bold mr-1.5">•</span>
              <div><strong className="text-white font-mono">Item-Item Cosine Similarity:</strong> Fast memory-mapped lookup.</div>
            </li>
            <li className="flex items-start">
              <span className="text-[#c084fc] font-bold mr-1.5">•</span>
              <div><strong className="text-white font-mono">Content TF-IDF Vectors:</strong> N-gram semantic feature embeddings.</div>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
