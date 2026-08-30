import React, { useState } from "react";
import { TabType } from "./types";
import { Header } from "./components/Header";
import { PlaygroundTab } from "./components/PlaygroundTab";
import { EdaTab } from "./components/EdaTab";
import { PipelineTab } from "./components/PipelineTab";
import { BenchmarksTab } from "./components/BenchmarksTab";
import { CodeExplorerTab } from "./components/CodeExplorerTab";
import { NarrativeTab } from "./components/NarrativeTab";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("playground");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col font-sans antialiased selection:bg-[#c084fc]/30 selection:text-white">
      {/* Global Header & Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === "playground" && <PlaygroundTab />}
        {activeTab === "eda" && <EdaTab />}
        {activeTab === "pipeline" && <PipelineTab />}
        {activeTab === "benchmarks" && <BenchmarksTab />}
        {activeTab === "code" && <CodeExplorerTab />}
        {activeTab === "narrative" && <NarrativeTab />}
      </main>

      {/* Global Footer */}
      <footer className="bg-[#0d0d0d] border-t border-[#262626] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#a1a1aa] gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
            <span>
              <strong className="text-white font-medium">Tourism Experience Analytics</strong> • ML Pipeline, Regression, Classification & Recommendation
            </span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>Streamlit: <code className="text-[#c084fc] bg-[#141414] border border-[#262626] px-1.5 py-0.5 rounded">app/app.py</code></span>
            <span>Reports: <code className="text-[#d4d4d8] bg-[#141414] border border-[#262626] px-1.5 py-0.5 rounded">docs/report.md</code></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
