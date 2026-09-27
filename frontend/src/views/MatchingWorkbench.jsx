import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, AlertTriangle, CheckCircle2, XCircle, Edit3, ArrowRight, Filter, SortDesc, X, Check, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MatchingWorkbench() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMatchingRunning, setIsMatchingRunning] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  // Filters & Sorting
  const [cpseFilter, setCpseFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected item for drawer
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedDesc, setEditedDesc] = useState('');

  const loadingSteps = [
    "Parsing material descriptions across 4 CPSE databases...",
    "Extracting technical attributes (dimensions, pressures, grades)...",
    "Computing semantic similarity using sentence-transformers...",
    "Cross-checking specification guardrails and UOM equivalencies...",
    "Clustering equivalent material candidates into candidate pairs..."
  ];

  const fetchMatches = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/matches')
      .then(res => res.json())
      .then(data => {
        setMatches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setMatches([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const triggerAiMatching = () => {
    setIsMatchingRunning(true);
    setProgressStep(0);

    const interval = setInterval(() => {
      setProgressStep(prev => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 700);

    setTimeout(() => {
      fetch('http://127.0.0.1:8000/match/run', { method: 'POST' })
        .then(() => fetchMatches())
        .finally(() => {
          setIsMatchingRunning(false);
        });
    }, 3800);
  };

  const handleApprove = (match, customDesc = null) => {
    const descToUse = customDesc || match.merged_desc || match.source_desc;
    fetch(`http://127.0.0.1:8000/matches/${match.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: descToUse,
        category: match.source_category,
        reviewer: "Senior Material Auditor (Govt. of India)"
      })
    }).then(() => {
      setSelectedMatch(null);
      setIsEditing(false);
      fetchMatches();
    });
  };

  const handleReject = (match) => {
    fetch(`http://127.0.0.1:8000/matches/${match.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer: "Senior Material Auditor (Govt. of India)"
      })
    }).then(() => {
      setSelectedMatch(null);
      setIsEditing(false);
      fetchMatches();
    });
  };

  // Filter logic
  const filteredMatches = matches.filter(m => {
    if (cpseFilter !== 'ALL' && m.source_cpse !== cpseFilter && m.target_cpse !== cpseFilter) return false;
    if (categoryFilter !== 'ALL' && m.source_category !== categoryFilter) return false;
    if (classFilter !== 'ALL' && m.classification !== classFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.source_code} ${m.target_code} ${m.source_desc} ${m.target_desc}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const getBadgeStyle = (classification) => {
    switch (classification) {
      case 'Identical':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Near-duplicate — Review':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Equivalent':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Spec Mismatch — Flagged':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 font-bold';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header & Run AI Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white flex items-center gap-3">
            AI Matching Workbench
          </h1>
          <p className="text-sm text-muted mt-1">
            Semantic vector comparison + rule-based attribute verification across enterprise databases.
          </p>
        </div>

        <button 
          onClick={triggerAiMatching}
          disabled={isMatchingRunning}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#2E75B6] to-[#1F3864] text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          <Sparkles size={18} className="animate-spin-slow" />
          {isMatchingRunning ? "Running Pipeline..." : "Run AI Matching Pipeline"}
        </button>
      </div>

      {/* AI Processing Modal Overlay */}
      <AnimatePresence>
        {isMatchingRunning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0F172A] border border-white/20 text-white rounded-2xl p-8 max-w-lg w-full space-y-6 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 text-[#60a5fa] flex items-center justify-center mx-auto animate-pulse">
                <Sparkles size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Executing AI Matching Pipeline</h3>
                <p className="text-xs text-gray-400 mt-1">Cross-referencing 92 material master entries across 4 CPSEs</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
                    animate={{ width: `${((progressStep + 1) / loadingSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-xs font-mono text-blue-400 flex items-center justify-center gap-2 min-h-[24px]">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  {loadingSteps[progressStep]}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter & Sort Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/60 dark:border-gray-800 flex flex-wrap items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-2 bg-white/60 dark:bg-black/40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 min-w-[200px]">
          <Filter size={14} className="text-muted" />
          <input 
            type="text"
            placeholder="Search code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-ink dark:text-white"
          />
        </div>

        {/* CPSE Filter */}
        <select 
          value={cpseFilter} 
          onChange={(e) => setCpseFilter(e.target.value)}
          className="bg-white/60 dark:bg-black/40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-ink dark:text-white outline-none"
        >
          <option value="ALL">All CPSEs</option>
          <option value="ONGC">ONGC</option>
          <option value="NTPC">NTPC</option>
          <option value="SAIL">SAIL</option>
          <option value="CIL">Coal India</option>
        </select>

        {/* Category Filter */}
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/60 dark:bg-black/40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-ink dark:text-white outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="Fasteners">Fasteners</option>
          <option value="Valves">Valves</option>
          <option value="Pipes">Pipes</option>
          <option value="Cables">Cables</option>
          <option value="Bearings">Bearings</option>
          <option value="Gaskets">Gaskets</option>
          <option value="Pumps">Pumps</option>
          <option value="Motors">Motors</option>
        </select>

        {/* Classification Filter */}
        <select 
          value={classFilter} 
          onChange={(e) => setClassFilter(e.target.value)}
          className="bg-white/60 dark:bg-black/40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-ink dark:text-white outline-none"
        >
          <option value="ALL">All Classifications</option>
          <option value="Identical">Identical</option>
          <option value="Near-duplicate — Review">Near-duplicate — Review</option>
          <option value="Spec Mismatch — Flagged">Spec Mismatch — Flagged</option>
        </select>
      </div>

      {/* Candidates Table */}
      <div className="glass-panel rounded-2xl border border-white/60 dark:border-gray-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary/5 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800 text-xs text-muted uppercase font-semibold">
              <tr>
                <th className="py-4 px-6">Source Material (CPSE)</th>
                <th className="py-4 px-6">Compared Target (CPSE)</th>
                <th className="py-4 px-6">Semantic Match Gauge</th>
                <th className="py-4 px-6">Classification Badge</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted text-sm">
                    No matching candidate pairs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredMatches.map((m) => {
                  const pct = Math.round(m.semantic_score * 100);
                  const isTrap = m.classification === 'Spec Mismatch — Flagged';
                  return (
                    <tr 
                      key={m.id} 
                      onClick={() => { setSelectedMatch(m); setIsEditing(false); setEditedDesc(m.merged_desc || m.source_desc); }}
                      className={`hover:bg-primary/5 dark:hover:bg-white/5 cursor-pointer transition-colors ${isTrap ? 'bg-red-500/5' : ''}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs px-2 py-0.5 rounded bg-primary/10 text-primary dark:bg-white/10 dark:text-white">
                            {m.source_cpse}
                          </span>
                          <span className="font-mono text-xs text-gray-500">{m.source_code}</span>
                        </div>
                        <p className="text-xs font-medium text-ink dark:text-white mt-1 line-clamp-1">
                          {m.source_desc}
                        </p>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                            {m.target_cpse}
                          </span>
                          <span className="font-mono text-xs text-gray-500">{m.target_code}</span>
                        </div>
                        <p className="text-xs font-medium text-ink dark:text-white mt-1 line-clamp-1">
                          {m.target_desc}
                        </p>
                      </td>

                      <td className="py-4 px-6 min-w-[160px]">
                        <div className="flex items-center justify-between text-xs font-bold mb-1 tabular-nums">
                          <span>{pct}%</span>
                          <span className="text-[10px] text-gray-400">Cosine Sim</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${pct >= 90 ? (isTrap ? 'bg-red-500' : 'bg-emerald-500') : 'bg-amber-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${getBadgeStyle(m.classification)}`}>
                          {isTrap && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                          {m.classification}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`text-xs font-bold ${m.status === 'Approved' ? 'text-emerald-500' : m.status === 'Rejected' ? 'text-red-500' : 'text-gray-400'}`}>
                          {m.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedMatch(m); setIsEditing(false); setEditedDesc(m.merged_desc || m.source_desc); }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary dark:bg-white/10 dark:text-white hover:bg-primary hover:text-white text-xs font-semibold transition-all"
                        >
                          Review <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Side Slide-Over Drawer for Detailed Attribute Inspection */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0F172A] h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between border-l border-gray-200 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-ink dark:text-white flex items-center gap-2">
                      Attribute Verification & Guardrails
                    </h3>
                    <p className="text-xs text-muted">Candidate Pair ID #{selectedMatch.id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedMatch(null)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Trap Callout Alert Banner if Spec Mismatch */}
                {selectedMatch.classification === 'Spec Mismatch — Flagged' && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <AlertTriangle size={18} />
                      ATTRIBUTE GUARDRAIL FLAG: SPECIFICATION CONFLICT
                    </div>
                    <p className="text-xs leading-relaxed">
                      {selectedMatch.mismatch_reason || "Critical specification parameters differ between these CPSE catalog entries. Silently merging these items will corrupt stock records."}
                    </p>
                  </div>
                )}

                {/* Side-by-side Attribute Comparison Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Item Comparison Breakdown</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Source Item */}
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs px-2 py-0.5 rounded bg-primary text-white">
                          {selectedMatch.source_cpse}
                        </span>
                        <span className="font-mono text-xs">{selectedMatch.source_code}</span>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted">Description</div>
                        <div className="text-xs font-semibold text-ink dark:text-white">{selectedMatch.source_desc}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted">Specification</div>
                        <div className="text-xs text-ink dark:text-white font-mono">{selectedMatch.source_spec}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted">UOM</div>
                        <div className="text-xs font-bold text-primary dark:text-white">{selectedMatch.source_uom}</div>
                      </div>
                    </div>

                    {/* Target Item */}
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs px-2 py-0.5 rounded bg-secondary text-white">
                          {selectedMatch.target_cpse}
                        </span>
                        <span className="font-mono text-xs">{selectedMatch.target_code}</span>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted">Description</div>
                        <div className="text-xs font-semibold text-ink dark:text-white">{selectedMatch.target_desc}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted">Specification</div>
                        <div className={`text-xs font-mono ${selectedMatch.classification === 'Spec Mismatch — Flagged' ? 'text-red-500 font-bold border-l-2 border-red-500 pl-2' : 'text-ink dark:text-white'}`}>
                          {selectedMatch.target_spec}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted">UOM</div>
                        <div className="text-xs font-bold text-secondary dark:text-white">{selectedMatch.target_uom}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confidence Breakdown Mini Bar Chart */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold text-ink dark:text-white">Confidence Model Breakdown</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Semantic Vector Similarity</span>
                        <span className="font-bold">{Math.round(selectedMatch.semantic_score * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${selectedMatch.semantic_score * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Attribute Specification Match</span>
                        <span className="font-bold">{Math.round(selectedMatch.attribute_score * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${selectedMatch.attribute_score < 0.6 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${selectedMatch.attribute_score * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inline Editable Version on Edit Click */}
                {isEditing && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-3">
                    <label className="block text-xs font-bold text-blue-600 dark:text-blue-400">
                      Standardized Common Name Editor:
                    </label>
                    <textarea 
                      value={editedDesc}
                      onChange={(e) => setEditedDesc(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-xs font-medium text-ink dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleReject(selectedMatch)}
                  className="py-3 px-4 rounded-xl border border-red-500 text-red-500 hover:bg-red-500/10 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <XCircle size={16} />
                  Reject
                </button>

                <button 
                  onClick={() => {
                    if (!isEditing) {
                      setIsEditing(true);
                      setEditedDesc(selectedMatch.merged_desc || selectedMatch.source_desc);
                    } else {
                      handleApprove(selectedMatch, editedDesc);
                    }
                  }}
                  className="py-3 px-4 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500/10 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <Edit3 size={16} />
                  {isEditing ? "Confirm Edit" : "Edit & Approve"}
                </button>

                <button 
                  onClick={() => handleApprove(selectedMatch, isEditing ? editedDesc : null)}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 size={16} />
                  Approve & Assign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
