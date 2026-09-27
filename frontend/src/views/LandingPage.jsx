import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Cpu, ShieldCheck, Layers, Sparkles, Building2, Eye, Server, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../config';

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    processed: 92,
    clusters: 18,
    cpses: 4,
    savings: 24.85
  });

  useEffect(() => {
    fetch(`${API_BASE}/stats`)
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnterPlatform = () => {
    // Smooth 200ms fade out before navigating to dashboard
    const mainEl = document.getElementById('landing-wrapper');
    if (mainEl) {
      mainEl.style.transition = 'opacity 200ms ease-out';
      mainEl.style.opacity = '0';
    }
    setTimeout(() => {
      navigate('/dashboard');
    }, 200);
  };

  return (
    <div id="landing-wrapper" className="min-h-screen bg-[#0B1626] text-[#E8EDF5] selection:bg-[#E08A2C] selection:text-white font-sans opacity-100 transition-opacity duration-200">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (100vh) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#122A4E] via-[#1A3B6C] to-[#2E75B6]">
        
        {/* Layer 1: Faint animated grid / network mesh (~5% opacity) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05] animate-mesh"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
        
        {/* Layer 2: 2-3 Soft-blurred circular glows (Saffron top-right, Steel Blue bottom-left) */}
        <div className="absolute top-[-15%] right-[-10%] w-[550px] h-[550px] bg-[#E08A2C] opacity-[0.14] blur-[140px] rounded-full pointer-events-none animate-glow-1" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[650px] h-[650px] bg-[#2E75B6] opacity-[0.15] blur-[150px] rounded-full pointer-events-none animate-glow-2" />

        {/* Layer 3: Faint outline map of India (SVG Path, ~4% opacity, right-aligned) */}
        <div className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04] w-[340px] md:w-[480px]">
          <svg viewBox="0 0 500 550" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-white stroke-current stroke-[1.5]">
            <path d="M 230 40 L 260 50 L 280 80 L 310 90 L 340 80 L 360 100 L 400 110 L 420 140 L 390 160 L 370 150 L 340 180 L 310 170 L 290 190 L 280 230 L 310 260 L 290 290 L 260 320 L 240 370 L 210 420 L 190 480 L 180 520 L 170 480 L 160 420 L 140 370 L 130 330 L 110 300 L 90 270 L 60 250 L 40 220 L 50 190 L 70 180 L 90 160 L 110 150 L 140 140 L 170 120 L 190 90 L 210 60 Z" />
            <circle cx="230" cy="180" r="4" fill="currentColor" opacity="0.6" />
            <circle cx="160" cy="270" r="4" fill="currentColor" opacity="0.6" />
            <circle cx="280" cy="290" r="4" fill="currentColor" opacity="0.6" />
            <circle cx="190" cy="420" r="4" fill="currentColor" opacity="0.6" />
            <line x1="230" y1="180" x2="160" y2="270" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />
            <line x1="160" y1="270" x2="280" y2="290" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />
            <line x1="280" y1="290" x2="190" y2="420" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />
          </svg>
        </div>

        {/* Header Navigation */}
        <header className="relative z-20 px-6 py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#122A4E] border border-white/20 flex items-center justify-center font-bold text-white shadow-md relative">
                <span className="font-heading text-lg">N</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E08A2C]" />
              </div>
              <div>
                <span className="text-xl font-bold font-heading tracking-tight text-white block">
                  NUMM Platform
                </span>
                <span className="text-[10px] text-gray-300 font-mono tracking-widest uppercase block">
                  Govt. of India · SIH 26099
                </span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-200">
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection('cpse-pilots')} className="hover:text-white transition-colors">CPSE Network</button>
            </nav>

            <button 
              onClick={handleEnterPlatform}
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E08A2C] hover:bg-[#C97720] text-white text-sm font-bold shadow-lg shadow-[#E08A2C]/20 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              Enter Platform
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-16 text-center space-y-8 my-auto">
          {/* Small Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E08A2C]/10 border border-[#E08A2C]/40 text-[#E08A2C] text-xs font-semibold tracking-wide"
          >
            <Sparkles size={14} className="animate-pulse text-[#E08A2C]" />
            AI-Powered · Government of India Initiative
          </motion.div>

          {/* H1 Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold font-heading tracking-tight leading-[1.08] text-white"
          >
            One Nation. <br />
            <span className="text-[#E08A2C] drop-shadow-sm">
              One Material Code.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#E8EDF5]/90 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            AI-driven standardization and harmonization of material master data across India's Central Public Sector Enterprises.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button 
              onClick={handleEnterPlatform}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#E08A2C] hover:bg-[#C97720] text-white font-bold text-base shadow-xl shadow-[#E08A2C]/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              Enter Platform
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base flex items-center justify-center gap-2 transition-all"
            >
              Watch how it works
            </button>
          </motion.div>

          {/* Row of 4 CPSE Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8 space-y-3"
            id="cpse-pilots"
          >
            <p className="text-xs uppercase tracking-widest text-gray-300/80 font-medium">Currently piloted with 4 CPSEs</p>
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
              {[
                { name: "ONGC", fullName: "Oil & Natural Gas Corp." },
                { name: "NTPC", fullName: "National Thermal Power Corp." },
                { name: "SAIL", fullName: "Steel Authority of India" },
                { name: "Coal India", fullName: "Coal India Limited" }
              ].map((cpse, idx) => (
                <div 
                  key={idx} 
                  className="px-4 py-2.5 rounded-xl bg-[#122A4E]/80 border border-white/15 flex items-center gap-3 shadow-md hover:border-[#E08A2C]/50 transition-colors"
                >
                  <Building2 size={16} className="text-[#E08A2C]" />
                  <div className="text-left">
                    <span className="font-bold text-sm text-white block leading-tight">{cpse.name}</span>
                    <span className="text-[10px] text-gray-300 block leading-tight">{cpse.fullName}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="h-6" />
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE STATS STRIP (Slim dark-navy band, no extra pattern) */}
      {/* ========================================================================= */}
      <section className="bg-[#0B1626] border-y border-white/10 py-8 px-6 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-extrabold text-[#E08A2C] tabular-nums font-heading">
              {stats.processed}
            </div>
            <div className="text-xs md:text-sm text-white/80 font-medium">Materials Analyzed</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-extrabold text-[#E08A2C] tabular-nums font-heading">
              {stats.clusters}
            </div>
            <div className="text-xs md:text-sm text-white/80 font-medium">Duplicate Clusters Found</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-extrabold text-[#E08A2C] tabular-nums font-heading">
              {stats.cpses}
            </div>
            <div className="text-xs md:text-sm text-white/80 font-medium">CPSEs Connected</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-extrabold text-[#E08A2C] tabular-nums font-heading">
              ₹{stats.savings} Lakh
            </div>
            <div className="text-xs md:text-sm text-white/80 font-medium">Estimated Savings</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "HOW IT WORKS" SECTION (Background: #F7F9FC + subtle dot-grid) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-24 px-6 bg-[#F7F9FC] text-[#1A1F2B] relative">
        {/* Subtle repeating dot-grid pattern (SVG, 2-3% opacity navy dots) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #122A4E 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E75B6] block">
              Automated & Governed Pipeline
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#122A4E]">
              From fragmented codes to one national standard
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
              A 4-step end-to-end workflow transforming disconnected enterprise material catalogs into a unified national taxonomy.
            </p>
          </div>

          {/* 4-Step Horizontal Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { 
                step: "01", 
                title: "Ingest", 
                desc: "Pull material master data from every CPSE's SAP/ERP instance automatically.", 
                icon: Database 
              },
              { 
                step: "02", 
                title: "Match", 
                desc: "AI compares descriptions, technical specs & units across all connected sources.", 
                icon: Cpu 
              },
              { 
                step: "03", 
                title: "Validate", 
                desc: "A human reviewer approves or edits every AI recommendation with full guardrails.", 
                icon: ShieldCheck 
              },
              { 
                step: "04", 
                title: "Unify", 
                desc: "One Common National Material Code (CNMC) is generated, fully traceable to source ERPs.", 
                icon: Layers 
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#122A4E] text-white flex items-center justify-center shadow-md">
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#E08A2C] bg-[#E08A2C]/10 border border-[#E08A2C]/20 px-2.5 py-1 rounded-full">
                        Step {item.step}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-heading text-[#122A4E] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURE HIGHLIGHTS SECTION (Background: Solid White) */}
      {/* ========================================================================= */}
      <section id="features" className="py-24 px-6 bg-white text-[#1A1F2B] border-t border-gray-100">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E75B6] block">
              Core Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#122A4E]">
              Enterprise-Grade AI Architecture
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
              Engineered specifically for multi-CPSE industrial catalogs without risking data corruption or silent misclassifications.
            </p>
          </div>

          {/* 3-Column Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#F7F9FC] border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#122A4E]/10 text-[#E08A2C] flex items-center justify-center">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#122A4E]">Explainable AI</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Shows attribute-level match reasoning (Semantic similarity + Specification guardrails), never a black-box percentage.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F7F9FC] border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#122A4E]/10 text-[#E08A2C] flex items-center justify-center">
                <Server size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#122A4E]">Non-destructive Integration</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                CPSE legacy material codes are never overwritten. They are mapped and cross-referenced under a unified CNMC umbrella.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F7F9FC] border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#122A4E]/10 text-[#E08A2C] flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#122A4E]">Full Governance & Audit Trail</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every human approval, rejection, and description tweak is permanently logged in an immutable compliance timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CTA FOOTER SECTION (Hero Bookend with Mirrored Saffron Glow) */}
      {/* ========================================================================= */}
      <footer className="relative py-20 px-6 bg-gradient-to-br from-[#122A4E] via-[#1A3B6C] to-[#2E75B6] text-white overflow-hidden border-t border-white/10">
        
        {/* Layer 1: Faint mesh */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />

        {/* Layer 2: Mirrored Glows (Saffron glow bottom-right instead of top-right) */}
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-[#E08A2C] opacity-[0.14] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#2E75B6] opacity-[0.15] blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
            See it in action
          </h2>
          <p className="text-[#E8EDF5]/90 text-base max-w-xl mx-auto">
            Experience live AI material matching, attribute verification, human review queue triage, and SAP ERP payload generation.
          </p>
          <div className="pt-2">
            <button 
              onClick={handleEnterPlatform}
              className="px-8 py-4 rounded-xl bg-[#E08A2C] hover:bg-[#C97720] text-white font-bold text-base shadow-xl shadow-[#E08A2C]/25 inline-flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              Enter Platform
              <ArrowRight size={18} />
            </button>
          </div>
          
          <div className="pt-12 border-t border-white/15 text-xs text-gray-300 font-medium">
            Built for Smart India Hackathon · Problem Statement 26099
          </div>
        </div>
      </footer>
    </div>
  );
}
