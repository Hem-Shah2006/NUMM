import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Server, CheckCircle2, Send, Database, ArrowRight, Code } from 'lucide-react';

export default function SyncDemo() {
  const [repository, setRepository] = useState([]);
  const [selectedCpse, setSelectedCpse] = useState('ONGC');
  const [selectedCnmc, setSelectedCnmc] = useState('');
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [syncCompleted, setSyncCompleted] = useState(false);
  const [syncPayload, setSyncPayload] = useState(null);

  const steps = [
    "Connecting to SAP S/4HANA Enterprise Gateway...",
    "Validating MARA / MARC material master schema...",
    "Writing CNMC cross-reference field to table MARA-MATNR...",
    "✓ SAP ERP Synchronization Complete"
  ];

  useEffect(() => {
    fetch('http://127.0.0.1:8000/repository')
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setRepository(arr);
        if (arr.length > 0) {
          setSelectedCnmc(arr[0].cnmc_code);
        }
      })
      .catch(() => setRepository([]));
  }, []);

  const handlePushToErp = () => {
    if (!selectedCnmc) return;
    setIsSyncing(true);
    setSyncCompleted(false);
    setSyncStep(0);

    const interval = setInterval(() => {
      setSyncStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);

    setTimeout(() => {
      fetch('http://127.0.0.1:8000/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpse: selectedCpse,
          cnmc_code: selectedCnmc
        })
      })
        .then(res => res.json())
        .then(data => {
          setSyncPayload(data.payload);
          setSyncCompleted(true);
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }, 3200);
  };

  const currentCnmcItem = repository.find(r => r.cnmc_code === selectedCnmc);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white flex items-center gap-3">
          SAP / ERP Downstream Sync Connector
        </h1>
        <p className="text-sm text-muted mt-1">
          Demonstrate the "last mile" ERP integration — pushing unified CNMC cross-reference codes back into enterprise SAP instances.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/60 dark:border-gray-800 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pick CPSE */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
              1. Select Target CPSE Enterprise
            </label>
            <select 
              value={selectedCpse}
              onChange={(e) => setSelectedCpse(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-sm font-semibold text-ink dark:text-white outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ONGC">ONGC (Oil and Natural Gas Corp.)</option>
              <option value="NTPC">NTPC (National Thermal Power Corp.)</option>
              <option value="SAIL">SAIL (Steel Authority of India)</option>
              <option value="Coal India">Coal India Limited (CIL)</option>
            </select>
          </div>

          {/* Pick CNMC Entry */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
              2. Select Approved CNMC Master Entry
            </label>
            <select 
              value={selectedCnmc}
              onChange={(e) => setSelectedCnmc(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-sm font-mono font-semibold text-ink dark:text-white outline-none focus:ring-2 focus:ring-primary"
            >
              {repository.length === 0 ? (
                <option value="">No CNMC codes in repository yet</option>
              ) : (
                repository.map(r => (
                  <option key={r.cnmc_code} value={r.cnmc_code}>
                    {r.cnmc_code} - {r.description?.slice(0, 30)}...
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Selected Item Summary Card */}
        {currentCnmcItem && (
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-mono font-bold text-primary dark:text-white">{currentCnmcItem.cnmc_code}</span>
              <p className="font-semibold text-ink dark:text-white mt-0.5">{currentCnmcItem.description}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
              Category: {currentCnmcItem.category}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={handlePushToErp}
          disabled={isSyncing || !selectedCnmc}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1F3864] to-[#2E75B6] text-white font-bold text-base shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          <Send size={18} className={isSyncing ? "animate-pulse" : ""} />
          {isSyncing ? "Synchronizing to SAP..." : "Push Cross-Reference to ERP →"}
        </button>

        {/* Multi-Step Progress Indicator */}
        {isSyncing && (
          <div className="p-6 rounded-2xl bg-[#0F172A] text-white space-y-4 shadow-2xl border border-white/10">
            <div className="flex items-center gap-3 font-bold text-sm text-blue-400">
              <RefreshCw size={18} className="animate-spin" />
              SAP Integration Pipeline Execution
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-blue-500/30">
              {steps.map((stepText, idx) => (
                <div 
                  key={idx}
                  className={`text-xs font-mono transition-opacity flex items-center gap-2 ${idx <= syncStep ? 'opacity-100 text-emerald-400 font-bold' : 'opacity-30 text-gray-400'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${idx <= syncStep ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                  {stepText}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Banner & Payload Code Box */}
        {syncCompleted && syncPayload && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 font-bold text-sm">
              <CheckCircle2 size={22} />
              SUCCESS: CNMC cross-reference payload pushed into {selectedCpse} SAP Instance!
            </div>

            {/* JSON Code Block */}
            <div className="rounded-2xl bg-[#0F172A] p-6 text-white space-y-3 font-mono text-xs border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between text-gray-400 border-b border-white/10 pb-2">
                <span className="flex items-center gap-2">
                  <Code size={16} className="text-blue-400" />
                  SAP S/4HANA OData / REST Payload
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">HTTP 200 OK</span>
              </div>
              <pre className="text-emerald-400 overflow-x-auto">
                {JSON.stringify(syncPayload, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
