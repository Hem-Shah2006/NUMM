import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Cpu, ShieldCheck, Layers, Sparkles, CheckCircle2, TrendingUp, Building2, Eye, Server, RefreshCw } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    processed: 92,
    clusters: 18,
    cpses: 4,
    savings: 24.85
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          processed: data.total_materials || 92,
          clusters: data.duplicate_clusters || 18,
          cpses: data.cpse_breakdown?.length || 4,
          savings: data.estimated_savings_lakhs || 24.85
        });
      })
      .catch(() => {});
  }, []);

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white selection:bg-[#2E75B6] selection:text-white">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1F3864] to-[#2E75B6] flex items-center justify-center font-bold text-xl shadow-lg shadow-[#2E75B6]/20">
              N
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                NUMM Platform
              </span>
              <span className="block text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                Govt. of India · SIH 26099
              </span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <button onClick={scrollToHowItWorks} className="hover:text-white transition-colors">How It Works</button>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#cpse" className="hover:text-white transition-colors">CPSE Network</a>
          </nav>

          <button 
            onClick={() => navigate('/dashboard')}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2E75B6] to-[#1F3864] hover:from-[#3b82c6] hover:to-[#25467d] text-white text-sm font-semibold shadow-lg shadow-[#2E75B6]/30 transition-all hover:scale-[1.03]"
          >
            Enter Platform
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2E75B6]/15 border border-[#2E75B6]/40 text-[#60a5fa] text-xs font-semibold tracking-wide"
          >
            <Sparkles size={14} className="animate-pulse" />
            AI-Powered · Government of India Initiative
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white"
          >
            One Nation. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#60a5fa] via-[#38bdf8] to-[#2E75B6]">
              One Material Code.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            AI-driven standardization and harmonization of material master data across India's Central Public Sector Enterprises. Eliminate duplicates, optimize procurement, and drive national savings.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#2E75B6] to-[#1F3864] hover:from-[#3b82c6] hover:to-[#25467d] text-white font-semibold text-base shadow-xl shadow-[#2E75B6]/30 flex items-center justify-center gap-3 transition-all hover:scale-105"
            >
              Enter Platform
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-base flex items-center justify-center gap-2 transition-all"
            >
              Watch How It Works
            </button>
          </motion.div>

          {/* Connected CPSE Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-12 space-y-3"
            id="cpse"
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Currently piloted with 4 CPSEs</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {[
                { name: "ONGC", fullName: "Oil and Natural Gas Corp.", color: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
                { name: "NTPC", fullName: "National Thermal Power Corp.", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
                { name: "SAIL", fullName: "Steel Authority of India", color: "border-blue-500/30 bg-blue-500/10 text-blue-300" },
                { name: "Coal India", fullName: "Coal India Limited", color: "border-purple-500/30 bg-purple-500/10 text-purple-300" }
              ].map((cpse, idx) => (
                <div key={idx} className={`px-5 py-2.5 rounded-xl border ${cpse.color} flex items-center gap-2.5 shadow-sm`}>
                  <Building2 size={16} />
                  <div className="text-left">
                    <span className="font-bold text-sm block leading-none">{cpse.name}</span>
                    <span className="text-[10px] text-gray-400 block leading-tight">{cpse.fullName}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className="bg-[#0B132B] border-y border-white/10 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-extrabold text-[#60a5fa] tabular-nums">{stats.processed}</div>
            <div className="text-xs md:text-sm text-gray-400 font-medium">Materials Analyzed</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-extrabold text-amber-400 tabular-nums">{stats.clusters}</div>
            <div className="text-xs md:text-sm text-gray-400 font-medium">Duplicate Clusters Found</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-extrabold text-emerald-400 tabular-nums">{stats.cpses}</div>
            <div className="text-xs md:text-sm text-gray-400 font-medium">CPSEs Connected</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-extrabold text-purple-400 tabular-nums">₹{stats.savings} Lakh</div>
            <div className="text-xs md:text-sm text-gray-400 font-medium">Estimated Savings</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0F172A] relative">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              From fragmented codes to one national standard
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              A 4-step automated and human-governed workflow transforming legacy enterprise material catalogs into a unified taxonomy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: "01", title: "Ingest", desc: "Pull material master data from every CPSE's SAP/ERP instance automatically.", icon: Database, color: "text-blue-400" },
              { step: "02", title: "Match", desc: "AI compares descriptions, technical specs & units across all connected sources.", icon: Cpu, color: "text-purple-400" },
              { step: "03", title: "Validate", desc: "A human reviewer approves or edits every AI recommendation with full guardrails.", icon: ShieldCheck, color: "text-emerald-400" },
              { step: "04", title: "Unify", desc: "One Common National Material Code (CNMC) is generated, fully traceable to source ERPs.", icon: Layers, color: "text-amber-400" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-white/5 ${item.color}`}>
                      <Icon size={24} />
                    </div>
                    <span className="font-mono text-2xl font-bold text-white/20">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-24 px-6 bg-[#1E293B]/50 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Enterprise-Grade AI Architecture
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Built specifically to handle multi-CPSE industrial catalog complexity without compromising data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Explainable AI</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Shows attribute-level match reasoning (Semantic similarity + Specification guardrails), never a black-box percentage.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Server size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Non-Destructive Integration</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                CPSE legacy material codes are never overwritten. They are mapped and cross-referenced under a unified CNMC umbrella.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Full Audit Governance</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Every human approval, rejection, and description tweak is permanently logged in an immutable compliance timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 px-6 bg-gradient-to-b from-[#0F172A] to-black border-t border-white/10 text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-white">Ready to explore the prototype?</h2>
          <p className="text-gray-400 text-sm">Experience live matching, attribute verification, review queue triage, and SAP ERP payload generation.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#2E75B6] to-[#1F3864] hover:from-[#3b82c6] hover:to-[#25467d] text-white font-semibold text-base shadow-xl shadow-[#2E75B6]/30 inline-flex items-center gap-3 transition-all hover:scale-105"
          >
            Enter Platform →
          </button>
        </div>
        <div className="pt-8 border-t border-white/10 text-xs text-gray-400">
          Built for Smart India Hackathon · Problem Statement 26099 (NUMM Platform)
        </div>
      </footer>
    </div>
  );
}
