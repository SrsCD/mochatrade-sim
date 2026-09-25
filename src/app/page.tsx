'use client';

import { useState, useMemo } from 'react';
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

export default function SimulatorApp() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_BITREBELS_SCENARIO);
  const [selectedScenario, setSelectedScenario] = useState<'bitrebels' | 'baseline' | 'custom'>('bitrebels');
  const [activeView, setActiveView] = useState<'overview' | 'simulator'>('simulator');

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

  const handleNavClick = (e: React.MouseEvent, view: 'overview' | 'simulator', hashId?: string) => {
    e.preventDefault();
    setActiveView(view);
    
    if (hashId) {
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          if (hashId === 'assumptions' && el instanceof HTMLDetailsElement) {
            el.open = true;
          }
        }
      }, 50);
    } else if (view === 'simulator') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full max-w-full relative">
      {/* Sidebar - since it's a fixed app, we can put the sidebar in a flex layout */}
      <div className="flex w-full min-h-screen relative">
        
        {/* LEFT APPLICATION SIDEBAR (~220px) */}
        <aside className="w-56 bg-white border-r border-app-border flex-shrink-0 flex flex-col justify-between min-h-screen select-none z-20 hidden md:flex sticky top-0">
          <div className="p-4">
            <div className="flex items-center gap-2.5 pb-5 border-b border-app-border">
              <div className="h-8 w-8 rounded bg-teal-50 border border-teal-200/80 flex items-center justify-center overflow-hidden flex-shrink-0">
                <span className="font-serif-display text-teal-brand font-bold">M</span>
              </div>
              <span className="font-serif-display text-[17px] font-semibold text-ink-primary whitespace-nowrap leading-none">MochaTrade</span>
            </div>
            
            <nav className="mt-4 space-y-1">
              <a href="#" onClick={(e) => handleNavClick(e, 'overview')} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${activeView === 'overview' ? 'text-teal-brand bg-teal-subtle/80 border border-teal-border/70' : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-50'}`}>
                <span className={`material-symbols-outlined text-[17px] ${activeView === 'overview' ? 'text-teal-brand' : 'text-slate-400'}`}>dashboard</span>
                <span>Overview</span>
              </a>
              <a href="#" onClick={(e) => handleNavClick(e, 'simulator')} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${activeView === 'simulator' ? 'text-teal-brand bg-teal-subtle/80 border border-teal-border/70' : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-50'}`}>
                <span className={`material-symbols-outlined text-[17px] ${activeView === 'simulator' ? 'text-teal-brand' : 'text-slate-400'}`}>tune</span>
                <span>Simulator</span>
              </a>
              <a href="#" onClick={(e) => handleNavClick(e, 'simulator', 'scenarios')} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium text-ink-secondary hover:text-ink-primary hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[17px] text-slate-400">stacked_bar_chart</span>
                <span>Scenarios</span>
              </a>
              <a href="#" onClick={(e) => handleNavClick(e, 'simulator', 'assumptions')} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium text-ink-secondary hover:text-ink-primary hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[17px] text-slate-400">rule</span>
                <span>Assumptions</span>
              </a>
            </nav>
          </div>
          
          <div className="p-3 border-t border-app-border bg-slate-50/50">
            <div className="flex items-center gap-2.5 px-1.5 py-1">
              <div className="w-7 h-7 rounded bg-teal-100/90 border border-teal-200/80 flex items-center justify-center text-[11px] font-semibold text-teal-brand flex-shrink-0">GT</div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-ink-primary block truncate">Growth Team</span>
                <span className="text-[11px] text-ink-secondary block truncate">Internal Strategy</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-app-border/60 flex items-center justify-between text-[11px] text-ink-secondary px-1">
              <span className="truncate">MochaTrade Internal</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400">unfold_more</span>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-app-canvas">
          
          {/* Top Header Bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-app-border px-6 py-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="font-serif-display text-[30px] font-semibold tracking-tight text-ink-primary leading-none">MochaTrade Growth Simulator</h1>
              <p className="text-xs text-ink-secondary">Internal strategy & decision support</p>
            </div>
            
            {/* Scenario selection controls */}
            {activeView === 'simulator' && (
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={handleApplyBitrebels}
                  className="px-3 py-1.5 bg-teal-brand text-white rounded text-xs font-semibold shadow-subtle hover:bg-teal-hover transition-colors"
                >
                  Apply BITREBELS Strategy
                </button>

                <button 
                  type="button" 
                  onClick={handleApplyBaseline}
                  className="px-2.5 py-1.5 bg-white border border-app-border rounded text-xs font-medium text-ink-secondary hover:text-ink-primary hover:bg-slate-50 transition-colors shadow-subtle"
                >
                  Load baseline
                </button>
                
                <button 
                  type="button" 
                  onClick={handleApplyBitrebels}
                  className="px-2.5 py-1.5 bg-white border border-app-border rounded text-xs font-medium text-ink-secondary hover:text-ink-primary hover:bg-slate-50 transition-colors shadow-subtle"
                  title="Reset to recommended defaults"
                >
                  Reset
                </button>
                
                <div className="h-4 w-px bg-app-border mx-0.5"></div>
                
                <button 
                  type="button" 
                  onClick={() => {
                    const header = "Month,Signups,Activated,Active Traders,Trading Volume,Fee Revenue\n";
                    const rows = result.monthly.map(m => 
                      `${m.month},${m.signups},${m.activated},${m.activeTraders},${m.tradingVolume},${m.feeRevenue}`
                    ).join('\n');
                    const csv = header + rows;
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `mochatrade-simulation-${selectedScenario}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 bg-teal-brand hover:bg-teal-hover text-white rounded text-xs font-medium transition-colors shadow-subtle flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  Export model
                </button>
              </div>
            )}
          </header>
          
          <main className="p-6 space-y-6 max-w-[1520px] w-full mx-auto">
            {activeView === 'overview' ? (
              <Overview result={result} selectedScenario={selectedScenario} />
            ) : (
              <>
              <KPIGrid result={result} baseline={baseline} />
            
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: MODEL INPUTS */}
              <ControlPanel inputs={inputs} onChange={handleInputChange} />
              
              {/* RIGHT COLUMN: VISUAL MODEL */}
              <div className="col-span-12 lg:col-span-7 space-y-6">
                
                <div className="bg-white border border-app-border rounded-lg shadow-subtle p-5 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-app-border">
                    <div>
                      <h3 className="font-serif-display text-[17px] font-semibold text-ink-primary">Growth funnel & trust engine</h3>
                      <p className="text-xs text-ink-secondary mt-0.5">Step-by-step conversion progression and trust reinforcement</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <Funnel result={result} baseline={baseline} />
                    <TrustPanel result={result} baseline={baseline} />
                  </div>
                </div>
                
                <VolumeChart result={result} baseline={baseline} />
                <ScenarioComparison result={result} baseline={baseline} />
                
              </div>
            </div>
            
            <div className="bg-white border border-teal-border rounded-lg shadow-subtle p-5 space-y-2 bg-gradient-to-r from-teal-subtle/40 to-white">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-brand text-[18px]">lightbulb</span>
                <span className="font-semibold text-ink-primary text-sm">Decision Insight</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                At the current effective fee of <strong>{result.effectiveFee.toFixed(4)}%</strong> and 
                an activation rate of <strong>{result.finalActivationRate.toFixed(1)}%</strong>, 
                the model generates <strong>{formatCurrency(result.annualRevenue)}</strong> in Year-1 fee revenue 
                from a pool of <strong>{formatNumber(result.activeTraders)}</strong> active traders. 
                {result.annualRevenue > baseline.annualRevenue ? 
                  ` This strategy yields a ${( ((result.annualRevenue - baseline.annualRevenue) / baseline.annualRevenue) * 100 ).toFixed(1)}% revenue upside compared to the status quo baseline, largely driven by ${result.activeTraders > baseline.activeTraders ? 'higher compounding trader retention' : 'pricing structure changes'}.` 
                  : 
                  ` This represents a ${( ((baseline.annualRevenue - result.annualRevenue) / baseline.annualRevenue) * 100 ).toFixed(1)}% revenue decrease compared to the baseline, highlighting the trade-off of the current inputs.`
                }
              </p>
            </div>
            
            <AssumptionsPanel />
              </>
            )}
            
          </main>
        </div>
      </div>
    </div>
  );
}
