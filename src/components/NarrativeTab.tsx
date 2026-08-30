import React from "react";
import { BookOpen, Sparkles, TrendingUp, Users, ShieldAlert, Calendar, CheckCircle2 } from "lucide-react";

export const NarrativeTab: React.FC = () => {
  const pillars = [
    {
      id: "personalization",
      title: "1. Hyper-Personalization at Scale",
      icon: Sparkles,
      color: "text-blue-400 bg-blue-950/80 border-blue-800/60",
      description: "Delivering bespoke Top-5 attraction itineraries generated through hybrid blending of Collaborative interaction matrices and Content TF-IDF semantic embeddings.",
      impact: "Boosts user discovery, increases booking conversion rates, and reduces search abandonment across tourist digital touchpoints."
    },
    {
      id: "analytics",
      title: "2. Tourism Analytics & Demand Planning",
      icon: TrendingUp,
      color: "text-emerald-400 bg-emerald-950/80 border-emerald-800/60",
      description: "Aggregating global footfall volumes, geographic origin corridors (Asia 40.7%, Europe 29.1%), and seasonal demand variations.",
      impact: "Equips regional tourism boards and municipal authorities with predictive insights to optimize transport scheduling, workforce staffing, and crowd flow control."
    },
    {
      id: "segmentation",
      title: "3. Visit Mode Segmentation & Marketing",
      icon: Users,
      color: "text-[#c084fc] bg-purple-950/80 border-purple-800/60",
      description: "Classifying travelers into five distinctive behavioral personas (Couples, Family, Friends, Business, Solo) with 75.8% accuracy and 0.732 Macro F1.",
      impact: "Enables destination marketers to craft targeted travel packages (e.g., family theme-park bundles vs. romantic cultural excursions) that maximize revenue per visitor."
    },
    {
      id: "retention",
      title: "4. Retention & Experience Quality Guardrails",
      icon: ShieldAlert,
      color: "text-amber-400 bg-amber-950/80 border-amber-800/60",
      description: "Forecasting satisfaction ratings using Gradient Boosting Regressors (RMSE 0.6849) to identify low-satisfaction risk triggers prior to departure.",
      impact: "Allows attraction operators to deploy proactive service interventions, mitigating negative public reviews and maintaining destination reputation."
    }
  ];

  const pacingSchedule = [
    { day: "Day 1", task: "Repository Scaffold & Phase 1 Data Cleaning", status: "Complete" },
    { day: "Day 2", task: "Phase 2 Preprocessing & Phase 3 EDA Visualizations", status: "Complete" },
    { day: "Day 3", task: "Phase 4 Regression & Phase 5 Classification Training", status: "Complete" },
    { day: "Day 4", task: "Phase 6 Recommendation Engine (CF + Content-Based)", status: "Complete" },
    { day: "Day 5", task: "Phase 7 Evaluation Summary & Colab Pipeline Verification", status: "Complete" },
    { day: "Day 6", task: "Phase 8 Interactive Analytics & Simulation Interface", status: "Complete" },
    { day: "Day 7", task: "Technical Documentation Report & Final Deliverables Review", status: "Complete" },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-[#1f162e] text-[#c084fc] border border-[#c084fc]/30 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Strategic Business Narrative & Impact Report</h2>
            <p className="text-xs text-[#a1a1aa]">
              Translating machine learning predictions into measurable commercial and operational outcomes for global tourism stakeholders.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.id} className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2.5 rounded-lg border ${pillar.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">{pillar.title}</h3>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed mb-3">
                  {pillar.description}
                </p>
              </div>

              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-3 text-xs text-[#d4d4d8]">
                <span className="font-bold text-emerald-400 font-mono">🎯 Business Impact: </span>
                {pillar.impact}
              </div>
            </div>
          );
        })}
      </div>

      {/* 7-Day Project Pacing & Milestones */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#c084fc]" />
            <h3 className="font-bold text-white text-sm">7-Day Execution Pacing Schedule</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-400 font-mono">All 7 Milestones Delivered</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {pacingSchedule.map((p) => (
            <div key={p.day} className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-3 text-center flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#c084fc] uppercase tracking-wider font-mono">{p.day}</span>
                <div className="text-xs font-medium text-[#d4d4d8] mt-1 line-clamp-3">{p.task}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#262626] flex items-center justify-center text-[10px] font-bold text-emerald-400 font-mono">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                {p.status}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
