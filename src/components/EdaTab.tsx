import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  Cell, Legend, LineChart, Line, ComposedChart
} from "recharts";
import { 
  CONTINENT_DATA, TOP_COUNTRIES_DATA, RATING_DISTRIBUTION_DATA, 
  VISIT_MODE_DEMO_DATA, ATTRACTION_TYPE_STATS 
} from "../data/mockData";
import { BarChart3, Globe, Star, TrendingUp, Users, Compass, Layers } from "lucide-react";

export const EdaTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-[#1f162e] text-[#c084fc] border border-[#c084fc]/30 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Exploratory Data Analysis (EDA) Suite</h2>
            <p className="text-xs text-[#a1a1aa]">
              Interactive visualizations generated from 52,930 historical tourism transactions across 1,698 global attractions.
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: Demographics & Top Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Plot 1: Continent Share */}
        <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#c084fc]" />
                <h3 className="font-bold text-white text-sm">Figure 1A: Tourist Volume by Continent</h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#71717a]">52,930 TXN</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONTINENT_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#262626" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#d4d4d8" }} />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} visits`, "Volume"]}
                    contentStyle={{ backgroundColor: "#141414", borderColor: "#262626", borderRadius: "8px", fontSize: "12px", color: "#e5e5e5" }}
                  />
                  <Bar dataKey="visits" radius={[0, 4, 4, 0]}>
                    {CONTINENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#262626] bg-[#0d0d0d] p-3 rounded-lg text-xs text-[#a1a1aa]">
            <span className="font-semibold text-white">💡 Key Insight:</span> Asia (40.7%) and Europe (29.1%) represent nearly 70% of all recorded traveler origins, making them primary focus corridors for tourism boards.
          </div>
        </div>

        {/* Plot 1B: Top 10 Countries */}
        <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Figure 1B: Top 10 Origin Countries</h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#71717a]">Country Breakdown</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_COUNTRIES_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                  <XAxis dataKey="country" angle={-35} textAnchor="end" tick={{ fontSize: 10, fill: "#a1a1aa" }} height={40} />
                  <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} tourists`, "Visits"]}
                    contentStyle={{ backgroundColor: "#141414", borderColor: "#262626", borderRadius: "8px", fontSize: "12px", color: "#e5e5e5" }}
                  />
                  <Bar dataKey="visits" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#262626] bg-[#0d0d0d] p-3 rounded-lg text-xs text-[#a1a1aa]">
            <span className="font-semibold text-white">💡 Key Insight:</span> Japan and the United States lead inbound transactions, demonstrating high willingness to travel for cultural and architectural exploration.
          </div>
        </div>

      </div>

      {/* Row 2: Rating Distributions & Demographics by Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Plot 2: Rating Distribution */}
        <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Figure 2: Global Satisfaction Rating Distribution</h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-amber-400">Mean: 4.35 / 5.0</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RATING_DISTRIBUTION_DATA} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                  <XAxis dataKey="rating" tick={{ fontSize: 11, fill: "#d4d4d8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} reviews`, "Count"]}
                    contentStyle={{ backgroundColor: "#141414", borderColor: "#262626", borderRadius: "8px", fontSize: "12px", color: "#e5e5e5" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {RATING_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-rate-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#262626] bg-[#0d0d0d] p-3 rounded-lg text-xs text-[#a1a1aa]">
            <span className="font-semibold text-white">💡 Key Insight:</span> Over 72% of all visits receive 4 or 5 stars. Regression models must account for positive skewness using regularized loss formulations.
          </div>
        </div>

        {/* Plot 3: Stacked Visit Mode Proportions by Continent */}
        <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#c084fc]" />
                <h3 className="font-bold text-white text-sm">Figure 3: Visit Mode Breakdown by Continent (%)</h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#c084fc]">Segmentation</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={VISIT_MODE_DEMO_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                  <XAxis dataKey="continent" tick={{ fontSize: 10, fill: "#d4d4d8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#141414", borderColor: "#262626", borderRadius: "8px", fontSize: "12px", color: "#e5e5e5" }} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px", color: "#a1a1aa" }} />
                  <Bar dataKey="Couples" stackId="a" fill="#60a5fa" />
                  <Bar dataKey="Family" stackId="a" fill="#34d399" />
                  <Bar dataKey="Friends" stackId="a" fill="#fbbf24" />
                  <Bar dataKey="Business" stackId="a" fill="#818cf8" />
                  <Bar dataKey="Solo" stackId="a" fill="#f472b6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#262626] bg-[#0d0d0d] p-3 rounded-lg text-xs text-[#a1a1aa]">
            <span className="font-semibold text-white">💡 Key Insight:</span> Couples (32–38%) and Family (25–30%) comprise the vast majority of long-haul travel, while domestic trips exhibit higher Friends/Solo shares.
          </div>
        </div>

      </div>

      {/* Row 3: Attraction Category Popularity vs Average Rating */}
      <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#c084fc]" />
            <h3 className="font-bold text-white text-sm">Figure 4: Category Footfall Volume vs. Average Rating</h3>
          </div>
          <span className="text-[11px] font-mono font-semibold text-[#c084fc]">Dual-Axis Analysis</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={ATTRACTION_TYPE_STATS} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis dataKey="category" angle={-25} textAnchor="end" tick={{ fontSize: 10, fill: "#d4d4d8" }} height={45} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#60a5fa" }} label={{ value: "Visits", angle: -90, position: "insideLeft", fill: "#60a5fa", fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" domain={[4.0, 5.0]} tick={{ fontSize: 10, fill: "#f87171" }} label={{ value: "Avg Rating (1-5)", angle: 90, position: "insideRight", fill: "#f87171", fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#141414", borderColor: "#262626", borderRadius: "8px", fontSize: "12px", color: "#e5e5e5" }} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px", color: "#a1a1aa" }} />
              <Bar yAxisId="left" dataKey="visits" name="Visit Footfall" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="avgRating" name="Average Rating Score" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: "#f87171" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-[#262626] bg-[#0d0d0d] p-3 rounded-lg text-xs text-[#a1a1aa]">
          <span className="font-semibold text-white">💡 Key Takeaway:</span> Architectural Landmarks and Historical Sites generate the highest visit volumes, while Religious & Sacred Sites achieve peak customer satisfaction (4.88/5.0).
        </div>
      </div>

    </div>
  );
};
