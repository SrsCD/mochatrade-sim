'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { SimulatorInputs, runSimulation, SimulationResult } from '@/lib/model';
import { DEFAULT_BITREBELS_SCENARIO, BASELINE_SCENARIO } from '@/lib/scenarios';
import { formatCurrency, formatNumber } from '@/lib/formatting';
import KPIGrid from '@/components/KPIGrid';
import ControlPanel from '@/components/ControlPanel';
import Funnel from '@/components/Funnel';
import TrustPanel from '@/components/TrustPanel';
import VolumeChart from '@/components/VolumeChart';
import ScenarioComparison from '@/components/ScenarioComparison';
import AssumptionsPanel from '@/components/AssumptionsPanel';
import Overview from '@/components/Overview';
import { motion, AnimatePresence } from 'framer-motion';

export default function SimulatorApp() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_BITREBELS_SCENARIO);
  const [selectedScenario, setSelectedScenario] = useState<'bitrebels' | 'baseline' | 'custom'>('bitrebels');
  
  // Controls the actual rendered view component
  const [activeView, setActiveView] = useState<'overview' | 'simulator'>('simulator');
  // Controls the highlighted item in the sidebar
  const [activeNav, setActiveNav] = useState<'overview' | 'simulator' | 'scenarios' | 'assumptions'>('simulator');

  const mainScrollRef = useRef<HTMLDivElement>(null);

  // The dynamic result based on user inputs
  const result: SimulationResult = useMemo(() => runSimulation(inputs), [inputs]);
  // The static baseline for variance calculations
  const baseline: SimulationResult = useMemo(() => runSimulation(BASELINE_SCENARIO), []);

  const handleApplyBitrebels = () => {
    setInputs(DEFAULT_BITREBELS_SCENARIO);
    setSelectedScenario('bitrebels');
  };

  const handleApplyBaseline = () => {
    setInputs(BASELINE_SCENARIO);
    setSelectedScenario('baseline');
  };

  const handleInputChange = (newInputs: SimulatorInputs) => {
    setInputs(newInputs);
    setSelectedScenario('custom');
  };

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const targetScroll = window.scrollY + el.getBoundingClientRect().top - 90;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent, target: 'overview' | 'simulator' | 'scenarios' | 'assumptions') => {
    e.preventDefault();
    setActiveNav(target);

    if (target === 'overview') {
      setActiveView('overview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (activeView === 'overview') {
        setActiveView('simulator');
        // Wait for DOM to render the simulator sections
        setTimeout(() => {
          if (target === 'simulator') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            scrollToElement(target);
            if (target === 'assumptions') {
              setTimeout(() => document.dispatchEvent(new CustomEvent('open-assumptions')), 300);
            }
          }
        }, 100);
      } else {
        if (target === 'simulator') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          scrollToElement(target);
          if (target === 'assumptions') {
            document.dispatchEvent(new CustomEvent('open-assumptions'));
          }
        }
      }
    }
  };

  // Set up IntersectionObserver to update activeNav on scroll
  useEffect(() => {
    if (activeView !== 'simulator') return;
    
    const options = {
      root: null, // Uses body/viewport
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let activeId = '';
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
        }
      });
      
      if (activeId) {
        if (activeId === 'main-simulator') setActiveNav('simulator');
        else if (activeId === 'scenarios') setActiveNav('scenarios');
        else if (activeId === 'assumptions') setActiveNav('assumptions');
      }
    };

    const observer = new IntersectionObserver(observerCallback, options);
    
    setTimeout(() => {
      const elSim = document.getElementById('main-simulator');
      const elSce = document.getElementById('scenarios');
      const elAss = document.getElementById('assumptions');
      
      if (elSim) observer.observe(elSim);
      if (elSce) observer.observe(elSce);
      if (elAss) observer.observe(elAss);
    }, 100);

    return () => observer.disconnect();
  }, [activeView]);

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full max-w-full relative">
      <div className="flex w-full min-h-screen relative">

        
        {/* LEFT APPLICATION SIDEBAR (~192px) */}
        <aside className="w-48 bg-white border-r border-app-border flex-shrink-0 flex flex-col h-screen select-none z-20 hidden md:flex sticky top-0">
          <div className="p-4 pt-6">
            <nav className="space-y-4">
              <div className="space-y-1">
                <a href="#" onClick={(e) => handleNavClick(e, 'overview')} className={`relative flex items-center gap-2.5 px-3 py-2 rounded-r text-xs font-medium transition-colors ${activeNav === 'overview' ? 'text-ink-primary font-semibold' : 'text-ink-secondary hover:text-ink-primary hover:bg-app-hover'}`}>
                  {activeNav === 'overview' && (
                    <motion.div layoutId="activeNav" className="absolute inset-0 bg-teal-subtle/50 border-l-2 border-teal-brand z-0" transition={{ duration: 0.25, ease: 'easeOut' }} />
                  )}
                  <span className={`relative z-10 material-symbols-outlined text-[18px] ${activeNav === 'overview' ? 'text-teal-brand' : 'text-slate-400'}`}>dashboard</span>
                  <span className="relative z-10">Overview</span>
                </a>
              </div>
              
              <div className="space-y-1">
                <a href="#" onClick={(e) => handleNavClick(e, 'simulator')} className={`relative flex items-center gap-2.5 px-3 py-2 rounded-r text-xs font-medium transition-colors ${activeNav === 'simulator' ? 'text-ink-primary font-semibold' : 'text-ink-secondary hover:text-ink-primary hover:bg-app-hover'}`}>
                  {activeNav === 'simulator' && (
                    <motion.div layoutId="activeNav" className="absolute inset-0 bg-teal-subtle/50 border-l-2 border-teal-brand z-0" transition={{ duration: 0.25, ease: 'easeOut' }} />
                  )}
                  <span className={`relative z-10 material-symbols-outlined text-[18px] ${activeNav === 'simulator' ? 'text-teal-brand' : 'text-slate-400'}`}>tune</span>
                  <span className="relative z-10">Simulator</span>
                </a>
                
                <a href="#" onClick={(e) => handleNavClick(e, 'scenarios')} className={`relative flex items-center gap-2.5 px-3 py-2 rounded-r text-xs font-medium transition-colors z-10 ${activeNav === 'scenarios' ? 'text-ink-primary font-semibold' : 'text-ink-secondary hover:text-ink-primary hover:bg-app-hover'}`}>
                  {activeNav === 'scenarios' && (
                    <motion.div layoutId="activeNav" className="absolute inset-0 bg-teal-subtle/50 border-l-2 border-teal-brand z-0" transition={{ duration: 0.25, ease: 'easeOut' }} />
                  )}
                  <span className={`relative z-10 material-symbols-outlined text-[18px] ${activeNav === 'scenarios' ? 'text-teal-brand' : 'text-slate-400'}`}>stacked_bar_chart</span>
                  <span className="relative z-10">Scenarios</span>
                </a>
                
                <a href="#" onClick={(e) => handleNavClick(e, 'assumptions')} className={`relative flex items-center gap-2.5 px-3 py-2 rounded-r text-xs font-medium transition-colors z-10 ${activeNav === 'assumptions' ? 'text-ink-primary font-semibold' : 'text-ink-secondary hover:text-ink-primary hover:bg-app-hover'}`}>
                  {activeNav === 'assumptions' && (
                    <motion.div layoutId="activeNav" className="absolute inset-0 bg-teal-subtle/50 border-l-2 border-teal-brand z-0" transition={{ duration: 0.25, ease: 'easeOut' }} />
                  )}
                  <span className={`relative z-10 material-symbols-outlined text-[18px] ${activeNav === 'assumptions' ? 'text-teal-brand' : 'text-slate-400'}`}>rule</span>
                  <span className="relative z-10">Assumptions</span>
                </a>
              </div>
            </nav>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <div ref={mainScrollRef} className="flex-1 flex flex-col min-w-0 bg-app-canvas scroll-smooth">
          
          {/* Top Header Bar */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-app-border px-6 py-4 flex items-center justify-between gap-4 shadow-subtle">
            <div>
              <h1 className="font-serif-display text-[26px] font-bold tracking-tight text-ink-primary leading-none flex items-baseline">
                MochaTrade <span className="font-sans font-medium text-lg text-ink-secondary tracking-normal ml-2">Growth Simulator</span>
              </h1>
              <p className="text-[11px] text-ink-secondary mt-1.5 font-medium tracking-wide uppercase">Internal strategy & decision support</p>
            </div>
            
            {/* Scenario selection controls */}
            {activeView === 'simulator' && (
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="button" 
                  onClick={handleApplyBitrebels}
                  className="px-3.5 py-1.5 bg-teal-brand text-ink-primary rounded text-[13px] font-bold shadow-subtle hover:bg-teal-hover transition-colors"
                >
                  Apply BITREBELS Strategy
                </motion.button>

                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="button" 
                  onClick={handleApplyBaseline}
                  className="px-3 py-1.5 bg-white border border-app-border rounded text-[13px] font-medium text-ink-secondary hover:text-ink-primary hover:bg-app-hover transition-colors shadow-subtle"
                >
                  Load baseline
                </motion.button>
                
                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="button" 
                  onClick={handleApplyBitrebels}
                  className="px-3 py-1.5 bg-white border border-app-border rounded text-[13px] font-medium text-ink-secondary hover:text-ink-primary hover:bg-app-hover transition-colors shadow-subtle"
                  title="Reset to recommended defaults"
                >
                  Reset
                </motion.button>
              </div>
            )}
          </header>
          
          <main className="p-6 md:p-10 md:pt-6 space-y-8 max-w-[1520px] w-full mx-auto relative overflow-hidden min-h-[800px]">
            <AnimatePresence mode="wait">
            {activeView === 'overview' ? (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Overview result={result} selectedScenario={selectedScenario} />
              </motion.div>
            ) : (
              <motion.div 
                key="simulator"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-6 pb-12"
              >
                <div id="main-simulator" className="space-y-6 pt-2 scroll-mt-24">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}>
                    <KPIGrid result={result} baseline={baseline} />
                  </motion.div>
              
                  <div className="grid grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN: MODEL INPUTS */}
                    <div className="col-span-12 lg:col-span-5 space-y-6 sticky top-24">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                        <ControlPanel inputs={inputs} onChange={handleInputChange} />
                      </motion.div>
                    </div>
                    
                    {/* RIGHT COLUMN: VISUAL MODEL (Funnel & Trust) */}
                    <div className="col-span-12 lg:col-span-7 space-y-6">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="bg-white border border-app-border rounded-lg shadow-subtle p-6 space-y-5">
                        <div className="flex items-center justify-between pb-4 border-b border-app-border">
                          <div>
                            <h3 className="font-serif-display text-[18px] font-semibold text-ink-primary">Growth funnel</h3>
                            <p className="text-[12px] text-ink-secondary mt-0.5">Step-by-step conversion progression</p>
                          </div>
                        </div>
                        <Funnel result={result} baseline={baseline} />
                      </motion.div>
                      
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
                        <TrustPanel result={result} baseline={baseline} />
                      </motion.div>
                    </div>
                  </div>

                  {/* SECTION 1: VOLUME CHART (FULL WIDTH) */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="w-full">
                    <VolumeChart result={result} baseline={baseline} />
                  </motion.div>
                  
                  {/* SECTION 2: COMPARISON & INSIGHT */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start scroll-mt-24" id="scenarios">
                    <motion.div className="lg:col-span-2 h-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
                      <ScenarioComparison result={result} baseline={baseline} />
                    </motion.div>
                    
                    <motion.div className="lg:col-span-1 h-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
                      <div className="bg-white border border-teal-border rounded-lg shadow-subtle p-5 space-y-3 bg-gradient-to-br from-teal-subtle/40 to-white h-full">
                        <div className="flex items-center gap-2 pb-2 border-b border-teal-border/60">
                          <span className="material-symbols-outlined text-teal-brand text-[18px]">lightbulb</span>
                          <span className="font-serif-display font-semibold text-ink-primary text-[16px]">Decision insight</span>
                        </div>
                        <p className="text-[13px] text-ink-secondary leading-relaxed">
                          At the current effective fee of <strong className="text-ink-primary font-semibold">{result.effectiveFee.toFixed(4)}%</strong> and 
                          an activation rate of <strong className="text-ink-primary font-semibold">{result.finalActivationRate.toFixed(1)}%</strong>, 
                          the model generates <strong className="text-ink-primary font-semibold">{formatCurrency(result.annualRevenue)}</strong> in Year-1 fee revenue 
                          from a pool of <strong className="text-ink-primary font-semibold">{formatNumber(result.activeTraders)}</strong> active traders. 
                        </p>
                        <p className="text-[13px] text-ink-secondary leading-relaxed pt-2">
                          {result.annualRevenue > baseline.annualRevenue ? 
                            `This yields a ${(((result.annualRevenue - baseline.annualRevenue) / baseline.annualRevenue) * 100).toFixed(1)}% revenue upside compared to the baseline, largely driven by ${result.activeTraders > baseline.activeTraders ? 'compounding trader retention' : 'pricing structure changes'}.` 
                            : 
                            `This represents a ${(((baseline.annualRevenue - result.annualRevenue) / baseline.annualRevenue) * 100).toFixed(1)}% revenue decrease compared to the baseline.`
                          }
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* SECTION 3: ASSUMPTIONS */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }} className="scroll-mt-24">
                    <AssumptionsPanel />
                  </motion.div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
