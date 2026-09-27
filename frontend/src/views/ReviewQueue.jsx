import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, X, Edit3, AlertTriangle, ArrowRight, PartyPopper, CheckCircle, RefreshCw } from 'lucide-react';
import { API_BASE } from '../config';

export default function ReviewQueue() {
  const navigate = useNavigate();
  const [pendingMatches, setPendingMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [approvedCount, setApprovedCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  const fetchQueue = () => {
    setLoading(true);
    fetch(`${API_BASE}/matches`)
      .then(res => res.json())
      .then(data => {
        const pending = Array.isArray(data) ? data.filter(m => m.status === 'Pending') : [];
        setPendingMatches(pending);
        setLoading(false);
      })
      .catch(() => {
        setPendingMatches([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentMatch = pendingMatches[currentIndex];

  const handleApprove = (customDesc = null) => {
    if (!currentMatch) return;
    const descToUse = customDesc || currentMatch.merged_desc || currentMatch.source_desc;

    fetch(`${API_BASE}/matches/${currentMatch.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: descToUse,
        category: currentMatch.source_category,
        reviewer: "Senior Material Auditor (Govt. of India)"
      })
    })
      .then(res => res.json())
      .then(data => {
        triggerConfetti();
        const cnmc = data.cnmc_code || "CNMC-FAST-000001";
        showToast(`✓ ${cnmc} assigned — 2 CPSE codes mapped`);
        setApprovedCount(prev => prev + 1);

        setIsEditing(false);
        setPendingMatches(prev => prev.filter(m => m.id !== currentMatch.id));
      });
  };

  const handleReject = () => {
    if (!currentMatch) return;
    fetch(`${API_BASE}/matches/${currentMatch.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer: "Senior Material Auditor (Govt. of India)" })
    }).then(() => {
      showToast(`✗ Candidate pair #${currentMatch.id} rejected`);
      setIsEditing(false);
      setPendingMatches(prev => prev.filter(m => m.id !== currentMatch.id));
    });
  };

  if (loading) {
    return <div className="text-center p-12 text-muted animate-pulse">Loading review queue...</div>;
  }

  // Celebratory Empty State
  if (pendingMatches.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20"
        >
          <PartyPopper size={48} />
        </motion.div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-3xl font-extrabold text-ink dark:text-white">🎉 All Caught Up!</h2>
          <p className="text-sm text-muted">
            All cluster recommendations have been reviewed and standardized into CNMC master entries.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/repository')}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg hover:bg-primary/90 transition-all"
          >
            View Unified Repository →
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-ink dark:text-white font-semibold text-sm hover:bg-gray-200 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const scorePct = Math.round(currentMatch.semantic_score * 100);
  const isTrap = currentMatch.classification === 'Spec Mismatch — Flagged';

  return (
    <div className="space-y-8 max-w-4xl mx-auto relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-2"
          >
            <CheckCircle size={18} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header bar with progress counter & approved counter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-white">Review & Approval Queue</h1>
          <p className="text-xs text-muted">Triage pending cluster matches one-by-one with full attribute inspection.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Approved this session: <span className="font-bold tabular-nums">{approvedCount}</span>
          </div>
          <div className="text-xs font-mono font-bold text-muted bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full">
            Reviewing item 1 of {pendingMatches.length}
          </div>
        </div>
      </div>

      {/* Main Single Card triage interface */}
      <motion.div 
        key={currentMatch.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="glass-panel p-8 rounded-3xl border border-white/60 dark:border-gray-800 shadow-2xl space-y-8 relative overflow-hidden"
      >
        {/* Radial Confidence Gauge Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div className="space-y-1">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isTrap ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-blue-500/10 text-blue-500 border-blue-500/30'}`}>
              {isTrap && <AlertTriangle size={14} className="animate-pulse" />}
              {currentMatch.classification}
            </span>
            <h2 className="text-xl font-bold text-ink dark:text-white">
              Category: {currentMatch.source_category}
            </h2>
          </div>

          {/* Radial Score Gauge */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isTrap ? "text-red-500" : "text-emerald-500"}
                  strokeDasharray={`${scorePct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-ink dark:text-white tabular-nums">
                {scorePct}%
              </span>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-ink dark:text-white">Confidence Score</div>
              <div className="text-[11px] text-muted">Semantic Vector Cosine</div>
            </div>
          </div>
        </div>

        {/* Trap Flag Warning if spec mismatch */}
        {isTrap && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle size={16} />
              ATTENTION: SPECIFICATION MISMATCH DETECTED
            </div>
            <p className="text-xs">
              {currentMatch.mismatch_reason || "Pressure or scheduling conflict between items. Reject or manually edit specification parameters."}
            </p>
          </div>
        )}

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Item */}
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-primary text-white font-bold text-xs">
                {currentMatch.source_cpse}
              </span>
              <span className="font-mono text-xs text-muted">{currentMatch.source_code}</span>
            </div>

            <div>
              <span className="text-[10px] text-muted uppercase font-bold block">Description</span>
              <p className="text-sm font-semibold text-ink dark:text-white">{currentMatch.source_desc}</p>
            </div>

            <div>
              <span className="text-[10px] text-muted uppercase font-bold block">Specification</span>
              <p className="text-xs font-mono text-ink dark:text-white">{currentMatch.source_spec}</p>
            </div>

            <div>
              <span className="text-[10px] text-muted uppercase font-bold block">Unit of Measure (UOM)</span>
              <p className="text-xs font-bold text-primary dark:text-white">{currentMatch.source_uom}</p>
            </div>
          </div>

          {/* Target Item */}
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-secondary text-white font-bold text-xs">
                {currentMatch.target_cpse}
              </span>
              <span className="font-mono text-xs text-muted">{currentMatch.target_code}</span>
            </div>

            <div>
              <span className="text-[10px] text-muted uppercase font-bold block">Description</span>
              <p className="text-sm font-semibold text-ink dark:text-white">{currentMatch.target_desc}</p>
            </div>

            <div>
              <span className="text-[10px] text-muted uppercase font-bold block">Specification</span>
              <p className={`text-xs font-mono ${isTrap ? 'text-red-500 font-bold' : 'text-ink dark:text-white'}`}>
                {currentMatch.target_spec}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-muted uppercase font-bold block">Unit of Measure (UOM)</span>
              <p className="text-xs font-bold text-secondary dark:text-white">{currentMatch.target_uom}</p>
            </div>
          </div>
        </div>

        {/* Inline Edit Box */}
        {isEditing && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/40 space-y-2">
            <label className="block text-xs font-bold text-blue-600 dark:text-blue-400">
              Custom Merged Common Description:
            </label>
            <input 
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Three Big Action Buttons */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={handleReject}
            className="py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02]"
          >
            <X size={20} />
            ✗ Reject Match
          </button>

          <button 
            onClick={() => {
              if (!isEditing) {
                setIsEditing(true);
                setEditDesc(currentMatch.merged_desc || currentMatch.source_desc);
              } else {
                handleApprove(editDesc);
              }
            }}
            className="py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            <Edit3 size={20} />
            {isEditing ? "Confirm Edit" : "✎ Edit & Approve"}
          </button>

          <button 
            onClick={() => handleApprove(isEditing ? editDesc : null)}
            className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <Check size={20} />
            ✓ Approve Match
          </button>
        </div>
      </motion.div>
    </div>
  );
}
