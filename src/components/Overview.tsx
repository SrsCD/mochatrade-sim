import { SimulationResult } from '@/lib/model';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatting';

export default function Overview({ result, selectedScenario }: { result: SimulationResult, selectedScenario: string }) {
  return (
    <div className="max-w-[800px] mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="space-y-3">
        <h2 className="font-serif-display text-2xl font-semibold text-ink-primary">Product Overview</h2>
        <p className="text-sm text-ink-secondary leading-relaxed">
          The MochaTrade Growth Simulator is an interactive business decision-support tool. 
          It mathematically models how changes to user acquisition channels, onboarding trust levers, 
          and fee schedules directly compound to project Year-1 trading volume and gross exchange revenue.
        </p>
      </div>

      {/* Strategy Summary */}
      <div className="bg-white border border-teal-border rounded-lg shadow-subtle p-6 space-y-4 bg-gradient-to-r from-teal-subtle/30 to-white">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-teal-brand">emoji_objects</span>
          <h3 className="font-semibold text-ink-primary">Round 1 BITREBELS Strategy</h3>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          The core recommendation proposes building sustainable trading economics through trust-led, community-driven growth. 
          Rather than relying exclusively on high-CAC paid acquisition, the strategy leverages organic referral/community sharing and 
          transparent risk-guided onboarding to improve top-of-funnel activation and long-term trader retention.
        </p>
      </div>

      {/* Core Model Flow */}
      <div className="bg-white border border-app-border rounded-lg shadow-subtle p-6 space-y-5">
        <h3 className="font-semibold text-ink-primary text-sm">Core Model Engine</h3>
        
        <div className="flex items-center justify-between text-xs font-medium text-ink-primary bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="flex flex-col items-center gap-1.5 w-24 text-center">
            <span className="material-symbols-outlined text-slate-400">group_add</span>
            <span>Acquisition</span>
          </div>
          <span className="material-symbols-outlined text-teal-brand text-[16px]">arrow_forward</span>
          <div className="flex flex-col items-center gap-1.5 w-24 text-center">
            <span className="material-symbols-outlined text-slate-400">how_to_reg</span>
            <span>Activation</span>
          </div>
          <span className="material-symbols-outlined text-teal-brand text-[16px]">arrow_forward</span>
          <div className="flex flex-col items-center gap-1.5 w-24 text-center">
            <span className="material-symbols-outlined text-slate-400">event_repeat</span>
            <span>Retention</span>
          </div>
          <span className="material-symbols-outlined text-teal-brand text-[16px]">arrow_forward</span>
          <div className="flex flex-col items-center gap-1.5 w-24 text-center">
            <span className="material-symbols-outlined text-slate-400">candlestick_chart</span>
            <span>Trading Volume</span>
          </div>
          <span className="material-symbols-outlined text-teal-brand text-[16px]">arrow_forward</span>
          <div className="flex flex-col items-center gap-1.5 w-24 text-center">
            <span className="material-symbols-outlined text-slate-400">payments</span>
            <span>Revenue</span>
          </div>
        </div>
      </div>

      {/* Current State Snapshot */}
      <div className="bg-white border border-app-border rounded-lg shadow-subtle p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink-primary text-sm">Current Active State</h3>
          <span className="text-[11px] font-semibold text-teal-brand bg-teal-subtle px-2 py-0.5 rounded border border-teal-border uppercase">
            {selectedScenario} SCENARIO
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Activation Rate</span>
            <div className="text-lg font-bold text-ink-primary num">{formatPercent(result.finalActivationRate)}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Active Traders (M12)</span>
            <div className="text-lg font-bold text-ink-primary num">{formatNumber(result.activeTraders)}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Year-1 Volume</span>
            <div className="text-lg font-bold text-ink-primary num">{formatCurrency(result.annualVolume)}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Year-1 Revenue</span>
            <div className="text-lg font-bold text-teal-brand num">{formatCurrency(result.annualRevenue)}</div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
