import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Beaker, CheckSquare, Database, History, RefreshCw, Moon, Sun, ChevronLeft, ChevronRight, Home } from 'lucide-react';

import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import MatchingWorkbench from './views/MatchingWorkbench';
import ReviewQueue from './views/ReviewQueue';
import Repository from './views/Repository';
import AuditTrail from './views/AuditTrail';
import SyncDemo from './views/SyncDemo';

function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/matching', name: 'AI Matching Workbench', icon: Beaker },
    { path: '/review', name: 'Review Queue', icon: CheckSquare },
    { path: '/repository', name: 'Unified Repository', icon: Database },
    { path: '/audit', name: 'Audit Trail', icon: History },
    { path: '/sync', name: 'SAP/ERP Sync (Demo)', icon: RefreshCw }
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} h-screen glass-panel fixed left-0 top-0 pt-16 flex flex-col z-30 transition-all duration-300 !rounded-none !border-t-0 !border-l-0 !border-b-0`}>
      <div className="px-5 py-4 mb-2 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50">
        {!collapsed && (
          <div>
            <h2 className="text-base font-bold text-primary dark:text-white leading-tight">NUMM Platform</h2>
            <p className="text-[10px] text-muted tracking-wider uppercase font-semibold">Govt. of India</p>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-muted transition-colors mx-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1.5 mt-2">
        <Link 
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs font-semibold text-muted hover:bg-black/5 dark:hover:bg-white/10 mb-4"
        >
          <Home size={18} className="flex-shrink-0 text-blue-500" />
          {!collapsed && <span>Landing Page</span>}
        </Link>

        {navItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.path);
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs font-semibold ${
                active 
                  ? 'bg-gradient-to-r from-[#1F3864] to-[#2E75B6] text-white shadow-md' 
                  : 'hover:bg-black/5 dark:hover:bg-white/10 text-ink dark:text-ink-soft'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 m-3 rounded-xl bg-primary/5 dark:bg-white/5 border border-primary/10 text-[11px] text-muted space-y-1">
          <span className="font-bold text-primary dark:text-white block">SIH 2026 Prototype</span>
          <p className="text-[10px] leading-tight">Problem Statement 26099: National Material Master</p>
        </div>
      )}
    </aside>
  );
}

function Topbar({ toggleTheme, isDark, collapsed }) {
  return (
    <header className={`h-16 w-full fixed top-0 left-0 ${collapsed ? 'pl-20' : 'pl-64'} pr-6 flex items-center justify-between glass-panel z-20 transition-all duration-300 !rounded-none !border-t-0 !border-l-0 !border-r-0`}>
      <div className="flex items-center gap-3">
        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          4 CPSEs Connected (ONGC, NTPC, SAIL, CIL)
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-ink dark:text-white transition-colors"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-700" />}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1F3864] to-[#2E75B6] flex items-center justify-center text-white font-bold text-xs shadow-md">
            GOI
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-bold text-xs block leading-tight text-ink dark:text-white">Govt. Auditor</span>
            <span className="text-[10px] text-muted block leading-tight">Ministry of Heavy Industries</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function MainApp() {
  const [isDark, setIsDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Topbar toggleTheme={() => setIsDark(!isDark)} isDark={isDark} collapsed={collapsed} />
      
      <main className={`${collapsed ? 'pl-20' : 'pl-64'} pt-16 min-h-screen transition-all duration-300`}>
        <div className="p-8 max-w-[1400px] mx-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matching" element={<MatchingWorkbench />} />
            <Route path="/review" element={<ReviewQueue />} />
            <Route path="/repository" element={<Repository />} />
            <Route path="/audit" element={<AuditTrail />} />
            <Route path="/sync" element={<SyncDemo />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
