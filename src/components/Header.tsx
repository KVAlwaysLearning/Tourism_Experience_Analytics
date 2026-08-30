import React from "react";
import { Compass, Sparkles, Database, BarChart3, Award, Code2, BookOpen, CheckCircle2 } from "lucide-react";
import { TabType } from "../types";

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "playground", label: "Model Playground", icon: Sparkles, badge: "Live" },
    { id: "eda", label: "EDA & Insights", icon: BarChart3, badge: "6 Plots" },
    { id: "pipeline", label: "Cleaning & Pipeline", icon: Database, badge: "9 Tables" },
    { id: "benchmarks", label: "Model Benchmarks", icon: Award, badge: "Verified" },
    { id: "code", label: "Python Scripts", icon: Code2, badge: "8 Modules" },
    { id: "narrative", label: "Business Report", icon: BookOpen, badge: "4 Pillars" },
  ] as const;

  return (
    <header className="bg-[#0d0d0d] border-b border-[#262626] sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#c084fc] to-[#6366f1] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(192,132,252,0.25)]">
            <Compass className="h-5 w-5 text-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg font-bold text-white tracking-tight">Tourism Experience Analytics</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Pipeline Ready
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa]">
              Classification • Rating Prediction • Hybrid Recommendation System & Streamlit App
            </p>
          </div>
        </div>

        {/* Global Key Stats */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-1.5 flex items-center space-x-2">
            <span className="text-[#71717a]">TXN:</span>
            <span className="font-bold text-white">52,930</span>
          </div>
          <div className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-1.5 flex items-center space-x-2">
            <span className="text-[#71717a]">USERS:</span>
            <span className="font-bold text-white">33,530</span>
          </div>
          <div className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-1.5 flex items-center space-x-2">
            <span className="text-[#71717a]">ITEMS:</span>
            <span className="font-bold text-[#c084fc]">1,698</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1f1f1f]">
        <nav className="flex space-x-1.5 overflow-x-auto py-1.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#1d152b] text-[#c084fc] font-semibold border border-[#c084fc]/40 shadow-[0_0_12px_rgba(192,132,252,0.12)]"
                    : "text-[#a1a1aa] hover:text-white hover:bg-[#141414] border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#c084fc]" : "text-[#71717a]"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider ${
                      isActive ? "bg-[#c084fc]/20 text-[#c084fc] border border-[#c084fc]/30" : "bg-[#1a1a1a] text-[#71717a] border border-[#262626]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
