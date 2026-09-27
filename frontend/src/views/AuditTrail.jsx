import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, CheckCircle2, XCircle, Sparkles, Filter, Search, ChevronDown, ChevronUp, User, Shield } from 'lucide-react';
import { API_BASE } from '../config';

export default function AuditTrail() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchAudit = () => {
    setLoading(true);
    fetch(`${API_BASE}/audit`)
      .then(res => res.json())
      .then(data => {
        setAudits(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setAudits([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const filteredAudits = audits.filter(item => {
    if (actionFilter !== 'ALL' && item.action !== actionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const text = `${item.action} ${item.description} ${item.details} ${item.reviewer}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  const getActionIcon = (action) => {
    switch (action) {
      case 'Approved':
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      case 'Rejected':
        return <XCircle size={18} className="text-red-500" />;
      case 'AI Match':
      case 'AI Match Run':
        return <Sparkles size={18} className="text-blue-500" />;
      default:
        return <History size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white flex items-center gap-3">
          Governance & Compliance Audit Trail
        </h1>
        <p className="text-sm text-muted mt-1">
          Immutable vertical activity feed documenting every AI recommendation, human decision, and ERP synchronization.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="glass-panel p-4 rounded-xl border border-white/60 dark:border-gray-800 flex flex-wrap items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-2 bg-white/60 dark:bg-black/40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 min-w-[200px]">
          <Search size={14} className="text-muted" />
          <input 
            type="text"
            placeholder="Search audit trail by description or reviewer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-ink dark:text-white"
          />
        </div>

        <select 
          value={actionFilter} 
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-white/60 dark:bg-black/40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-ink dark:text-white outline-none"
        >
          <option value="ALL">All Actions</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="AI Match Run">AI Match Run</option>
          <option value="SAP/ERP Sync">SAP/ERP Sync</option>
        </select>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
        {loading ? (
          <div className="p-8 text-center text-muted animate-pulse">Loading audit history...</div>
        ) : filteredAudits.length === 0 ? (
          <div className="p-12 text-center text-muted">No audit events match your filter.</div>
        ) : (
          filteredAudits.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="relative group">
                {/* Timeline Icon Node */}
                <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-gray-700 flex items-center justify-center shadow-sm">
                  {getActionIcon(item.action)}
                </div>

                {/* Audit Card */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 ml-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${item.action === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : item.action === 'Rejected' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>
                        {item.action}
                      </span>
                      <span className="text-xs font-semibold text-ink dark:text-white">
                        {item.description}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-muted tabular-nums">
                      {new Date(item.timestamp || Date.now()).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted pt-1">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span className="font-medium text-ink dark:text-white">
                        {item.reviewer || "Senior Material Auditor"}
                      </span>
                    </div>

                    <button className="flex items-center gap-1 text-[11px] hover:text-primary transition-colors">
                      {isExpanded ? "Hide Details" : "View Governance Details"}
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Expandable detail */}
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-xs font-mono space-y-2 text-ink dark:text-white"
                    >
                      <div><span className="text-gray-400">Audit ID:</span> #{item.id}</div>
                      <div><span className="text-gray-400">Timestamp:</span> {item.timestamp}</div>
                      <div><span className="text-gray-400">Details:</span> {item.details || "Verified matching confidence parameters and attribute specification guardrails."}</div>
                      <div><span className="text-gray-400">Governance Policy:</span> ISO 8000 Master Data Quality Compliance</div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
