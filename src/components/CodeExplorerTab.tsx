import React, { useState } from "react";
import { Code2, Copy, Check, Terminal, FileCode, ArrowRight } from "lucide-react";
import { PYTHON_SCRIPTS_CODE } from "../data/mockData";

export const CodeExplorerTab: React.FC = () => {
  const [selectedScript, setSelectedScript] = useState<string>("data_cleaning");
  const [copied, setCopied] = useState(false);

  const scriptKeys = Object.keys(PYTHON_SCRIPTS_CODE);
  const currentScript = PYTHON_SCRIPTS_CODE[selectedScript] || PYTHON_SCRIPTS_CODE["data_cleaning"];

  const handleCopy = () => {
    navigator.clipboard.writeText(`# ${currentScript.title}\n# Path: ${currentScript.filename}\n# Description: ${currentScript.description}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#1f162e] text-[#c084fc] border border-[#c084fc]/30 rounded-lg">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Python Pipeline & Script Explorer</h2>
              <p className="text-xs text-[#a1a1aa]">
                Inspect modular Python scripts corresponding to Phases 1–8 of the Tourism Analytics specification.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4d4d8] bg-[#0a0a0a] border border-[#262626] px-3 py-1.5 rounded-lg font-mono">
            <Terminal className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>Colab & CLI Ready</span>
          </div>
        </div>
      </div>

      {/* Main Script Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Script Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717a] px-1 mb-2 font-mono">
            Pipeline Modules ({scriptKeys.length})
          </h3>
          <div className="space-y-1.5">
            {scriptKeys.map((key) => {
              const item = PYTHON_SCRIPTS_CODE[key];
              const isSelected = selectedScript === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedScript(key)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#1f162e]/90 border-[#c084fc]/60 text-white shadow-xs"
                      : "bg-[#141414] border-[#262626] hover:bg-[#1a1a1a] text-[#d4d4d8]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileCode className={`w-4 h-4 ${isSelected ? "text-[#c084fc]" : "text-[#71717a]"}`} />
                    <div>
                      <div className="text-xs font-bold">{item.title}</div>
                      <div className="text-[10px] text-[#71717a] font-mono mt-0.5">{item.filename}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded font-mono ${
                    isSelected ? "bg-[#c084fc]/30 text-[#e9d5ff]" : "bg-[#0a0a0a] text-[#a1a1aa] border border-[#262626]"
                  }`}>
                    {item.phase}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer & Details (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0a0a0a] rounded-xl border border-[#262626] text-[#e5e5e5] overflow-hidden shadow-lg">
            
            {/* Top Bar */}
            <div className="px-5 py-3 bg-[#0d0d0d] border-b border-[#262626] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-[#a1a1aa] ml-2">{currentScript.filename}</span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 text-xs text-[#d4d4d8] hover:text-white bg-[#141414] hover:bg-[#262626] border border-[#262626] px-3 py-1 rounded-md transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Path & Info"}</span>
              </button>
            </div>

            {/* Script Description Card */}
            <div className="p-5 bg-[#0d0d0d]/60 border-b border-[#262626] text-xs text-[#d4d4d8] space-y-2">
              <div className="font-bold text-white text-sm flex items-center space-x-2">
                <span>{currentScript.title}</span>
                <span className="text-[10px] text-[#c084fc] font-mono">({currentScript.phase})</span>
              </div>
              <p className="text-[#a1a1aa] leading-relaxed">{currentScript.description}</p>
            </div>

            {/* Quick CLI Execution Guide */}
            <div className="p-5 bg-[#0a0a0a] font-mono text-xs text-emerald-400 space-y-2">
              <div className="text-[11px] text-[#71717a] uppercase font-bold tracking-wider">Execute in Shell / Terminal:</div>
              <div className="bg-[#141414] border border-[#262626] p-3 rounded-lg text-emerald-300">
                python {currentScript.filename}
              </div>
            </div>

          </div>

          {/* Full Pipeline Command Runner Card */}
          <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 font-mono">
              Google Colab Sequential Pipeline Execution
            </h4>
            <div className="bg-[#0a0a0a] border border-[#262626] text-[#d4d4d8] font-mono text-xs p-3.5 rounded-lg overflow-x-auto space-y-1">
              <div className="text-[#71717a]"># Run all stages in order:</div>
              <div className="text-emerald-400">!python src/data_cleaning.py</div>
              <div className="text-emerald-400">!python src/preprocessing.py</div>
              <div className="text-emerald-400">!python src/eda.py</div>
              <div className="text-emerald-400">!python src/train_regression.py</div>
              <div className="text-emerald-400">!python src/train_classification.py</div>
              <div className="text-emerald-400">!python src/train_recommendation.py</div>
              <div className="text-emerald-400">!python src/evaluate.py</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
