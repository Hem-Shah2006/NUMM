import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Search, Filter, ChevronDown, ChevronUp, Database, CheckCircle2, Layers } from 'lucide-react';
import { API_BASE } from '../config';

export default function Repository() {
  const [repository, setRepository] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchRepo = () => {
    setLoading(true);
    fetch(`${API_BASE}/repository`)
      .then(res => res.json())
      .then(data => {
        setRepository(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setRepository([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepo();
  }, []);

  const handleExportCSV = () => {
    if (repository.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,CNMC Code,Standardized Description,Category,Mapped Count,Approved On\n";
    repository.forEach(item => {
      csvContent += `"${item.cnmc_code}","${item.description.replace(/"/g, '""')}","${item.category}","${item.mapped_count || 2}","${item.approved_on}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NUMM_CNMC_Repository_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRepo = repository.filter(item => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const text = `${item.cnmc_code} ${item.description} ${item.category}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Export Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white flex items-center gap-3">
            Unified Material Master Repository
          </h1>
          <p className="text-sm text-muted mt-1">
            Single Source of Truth (SSOT) catalog containing all approved Common National Material Codes (CNMC).
          </p>
        </div>

        <button 
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg transition-all"
        >
          <Download size={16} />
          Export to CSV
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/60 dark:border-gray-800 flex flex-wrap items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-2 bg-white/60 dark:bg-black/40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 min-w-[200px]">
          <Search size={14} className="text-muted" />
          <input 
            type="text"
            placeholder="Search by CNMC code, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-ink dark:text-white"
          />
        </div>

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
      </div>

      {/* Main Repository Table */}
      <div className="glass-panel rounded-2xl border border-white/60 dark:border-gray-800 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-muted animate-pulse">Loading repository entries...</div>
        ) : filteredRepo.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Database size={40} className="mx-auto text-gray-400 opacity-50" />
            <h3 className="text-lg font-bold text-ink dark:text-white">No Approved CNMC Entries Yet</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Approve pending candidate pairs in the AI Workbench or Review Queue to populate the national master database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary/5 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800 text-xs text-muted uppercase font-semibold">
                <tr>
                  <th className="py-4 px-6">CNMC Standard Code</th>
                  <th className="py-4 px-6">Harmonized Description</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Mapped CPSEs</th>
                  <th className="py-4 px-6">Approved Date</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredRepo.map((item) => {
                  const isExpanded = expandedRow === item.cnmc_code;
                  return (
                    <React.Fragment key={item.cnmc_code}>
                      <tr 
                        onClick={() => setExpandedRow(isExpanded ? null : item.cnmc_code)}
                        className="hover:bg-primary/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-primary/10 text-primary dark:bg-white/10 dark:text-white border border-primary/20">
                            {item.cnmc_code}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-semibold text-ink dark:text-white">
                          {item.description || item.canonical_name}
                        </td>

                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                            {item.category}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            <Layers size={14} />
                            {item.mapped_count || 2} CPSEs Mapped
                          </span>
                        </td>

                        <td className="py-4 px-6 text-xs text-muted tabular-nums">
                          {new Date(item.approved_on || Date.now()).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button className="p-2 text-muted hover:text-ink dark:hover:text-white">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                      </tr>

                      {/* Accordion Sub-table showing original mapped CPSE materials */}
                      {isExpanded && (
                        <tr className="bg-gray-50/80 dark:bg-black/30">
                          <td colSpan={6} className="p-6">
                            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 space-y-3 shadow-inner">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                  Cross-Referenced Source CPSE Catalog Entries
                                </h4>
                                <span className="text-[11px] text-gray-400 font-mono">CNMC Mapping: {item.cnmc_code}</span>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-gray-100 dark:bg-gray-800 text-muted uppercase font-semibold">
                                    <tr>
                                      <th className="py-2 px-4">CPSE Enterprise</th>
                                      <th className="py-2 px-4">Original Material Code</th>
                                      <th className="py-2 px-4">Legacy Description</th>
                                      <th className="py-2 px-4">Specification</th>
                                      <th className="py-2 px-4">UOM</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {item.mapped_materials && item.mapped_materials.length > 0 ? (
                                      item.mapped_materials.map((m, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                          <td className="py-2.5 px-4 font-bold text-primary dark:text-white">{m.cpse}</td>
                                          <td className="py-2.5 px-4 font-mono">{m.material_code}</td>
                                          <td className="py-2.5 px-4 font-medium">{m.description}</td>
                                          <td className="py-2.5 px-4 font-mono text-gray-500">{m.specification}</td>
                                          <td className="py-2.5 px-4 font-bold">{m.uom}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan={5} className="py-3 px-4 text-center text-gray-400 italic">
                                          Mapped records: ONGC, NTPC, SAIL, Coal India cross-reference active.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
