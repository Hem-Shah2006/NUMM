import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Copy, CheckSquare, IndianRupee, ArrowUpRight, Info, ChevronRight, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_materials: 92,
    duplicate_clusters: 18,
    standardized_count: 0,
    pending_review_count: 18,
    estimated_savings_lakhs: 24.85,
    cpse_breakdown: [
      { cpse: 'ONGC', count: 23 },
      { cpse: 'NTPC', count: 23 },
      { cpse: 'SAIL', count: 23 },
      { cpse: 'CIL', count: 23 }
    ],
    category_standardization: []
  });
  const [loading, setLoading] = useState(true);
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const timelineData = [
    { week: 'W1 (Ingest)', duplicatesFound: 24, standardized: 0 },
    { week: 'W2 (Initial ML)', duplicatesFound: 22, standardized: 4 },
    { week: 'W3 (Triage)', duplicatesFound: 18, standardized: 8 },
    { week: 'W4 (Review)', duplicatesFound: 14, standardized: 12 },
    { week: 'W5 (Validation)', duplicatesFound: 8, standardized: 15 },
    { week: 'W6 (Current)', duplicatesFound: stats.pending_review_count, standardized: stats.standardized_count }
  ];

  const pieColors = ['#1F3864', '#2E75B6', '#2E7D32', '#C55A11', '#8E44AD', '#16A085', '#D35400', '#2C3E50'];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    );
  }

  const kpiList = [
    {
      label: "Total Materials Processed",
      value: stats.total_materials,
      icon: Database,
      trend: "+100%",
      sub: "Across 4 connected CPSE databases"
    },
    {
      label: "Duplicate Clusters Found",
      value: stats.duplicate_clusters,
      icon: Copy,
      trend: "18 Identified",
      sub: "Semantic similarity ≥ 85%"
    },
    {
      label: "Materials Standardized",
      value: stats.standardized_count,
      icon: CheckSquare,
      trend: `${stats.duplicate_clusters > 0 ? Math.round((stats.standardized_count/stats.duplicate_clusters)*100) : 0}% Done`,
      sub: "CNMC codes assigned"
    },
    {
      label: "Estimated Savings",
      value: `₹${stats.estimated_savings_lakhs} Lakh`,
      icon: IndianRupee,
      trend: "Demand Aggregation",
      hasInfo: true,
      sub: "12% bulk discount projection"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white flex items-center gap-3">
            National Harmonization Command Center
          </h1>
          <p className="text-sm text-muted mt-1">
            Real-time cross-CPSE material master analytics & standardization governance.
          </p>
        </div>

        <button 
          onClick={() => navigate('/matching')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow"
        >
          Open AI Workbench
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Top Row: 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiList.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-white/60 dark:border-gray-800 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary dark:bg-white/10 dark:text-white">
                  <Icon size={22} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-md">
                  <ArrowUpRight size={12} />
                  {kpi.trend}
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-extrabold text-ink dark:text-white tabular-nums tracking-tight">
                  {kpi.value}
                </h2>
                {kpi.hasInfo && (
                  <div className="relative">
                    <button 
                      onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
                      className="text-muted hover:text-primary transition-colors p-1"
                      title="View Savings Formula"
                    >
                      <Info size={16} />
                    </button>
                    {showFormulaTooltip && (
                      <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-[#0F172A] text-white text-xs rounded-xl shadow-2xl z-30 border border-white/20">
                        <div className="font-bold text-amber-400 mb-1">Savings Formula:</div>
                        <p className="font-mono text-[11px] leading-tight text-gray-300">
                          Σ (Duplicate Entries - 1) × Unit Cost × Annual Qty × 12% Bulk Discount
                        </p>
                        <p className="mt-2 text-[10px] text-gray-400">
                          Calculated across category lookup benchmarks (e.g. Valves ₹8k, Pipes ₹1.2k, Fasteners ₹50).
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-xs font-medium text-muted mt-1">{kpi.label}</p>
              <p className="text-[11px] text-gray-400 mt-2">{kpi.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Middle Row: 2 Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bar Chart Materials by CPSE */}
        <div className="glass-panel p-6 rounded-2xl border border-white/60 dark:border-gray-800 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-ink dark:text-white">Materials Ingested by CPSE</h3>
              <p className="text-xs text-muted">Equal representation across 4 simulated enterprises (92 total)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:bg-white/10 dark:text-white">
              4 CPSEs
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.cpse_breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="cpse" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2E75B6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Donut Chart Category-wise Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-white/60 dark:border-gray-800 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-ink dark:text-white">Category Cluster Distribution</h3>
              <p className="text-xs text-muted">Duplicate detection density across industrial categories</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
              8 Categories
            </span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={(stats?.category_standardization && stats.category_standardization.length > 0) ? stats.category_standardization : [
                    { category: 'Fasteners', total: 4 },
                    { category: 'Valves', total: 3 },
                    { category: 'Pipes', total: 3 },
                    { category: 'Cables', total: 2 },
                    { category: 'Bearings', total: 2 },
                    { category: 'Gaskets', total: 2 },
                    { category: 'Pumps', total: 1 },
                    { category: 'Motors', total: 1 }
                  ]}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {((stats?.category_standardization && stats.category_standardization.length > 0) ? stats.category_standardization : [1,2,3,4,5,6,7,8]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: 1 Full Width Line Chart + Pending Queue Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Line Chart Duplicate Reduction Over Time */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/60 dark:border-gray-800 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-ink dark:text-white">Duplicate Reduction Over Time</h3>
              <p className="text-xs text-muted">Simulated 6-week timeline: Duplicates identified vs Approved CNMC standardization</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="duplicatesFound" name="Pending Duplicates" stroke="#C55A11" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="standardized" name="Standardized (CNMC)" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Pending Review Queue Callout */}
        <div className="glass-panel p-6 rounded-2xl border border-[#2E75B6]/30 dark:border-[#2E75B6]/30 bg-gradient-to-br from-primary/5 to-secondary/10 flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
              Action Needed
            </div>
            <h3 className="text-xl font-bold text-ink dark:text-white">Pending Review Queue</h3>
            <p className="text-xs text-muted leading-relaxed">
              Review AI-identified material cluster recommendations. Human validation ensures zero false merges before CNMC assignment.
            </p>
            
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Pending Triage:</span>
              <span className="text-2xl font-black text-primary dark:text-white tabular-nums">
                {stats.pending_review_count} items
              </span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/review')}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-[#1F3864] to-[#2E75B6] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            Go to Review Queue →
          </button>
        </div>
      </div>
    </div>
  );
}
