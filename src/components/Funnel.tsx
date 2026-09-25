import { SimulationResult } from '@/lib/model';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/formatting';

export default function Funnel({ result, baseline }: { result: SimulationResult, baseline: SimulationResult }) {
  
  const renderVariance = (val: number, base: number) => {
    if (base === 0) return null;
    const diff = ((val - base) / base) * 100;
    if (Math.abs(diff) < 0.01) return null;
    
    return (
      <span className={`text-xs font-semibold block num ${diff > 0 ? 'text-badge-pos' : 'text-badge-neg'}`}>
        {diff > 0 ? '+' : ''}{diff.toFixed(1)}% vs base
      </span>
    );
  };

  return (
    <div className="md:col-span-7 space-y-2.5 text-xs">
      <div className="p-3 rounded-lg border border-app-border bg-slate-50/60 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-xs font-semibold text-ink-primary num shadow-subtle">1</span>
          <div>
            <span className="font-semibold text-ink-primary text-sm block">Signups</span>
            <span className="text-xs text-slate-500">Top-of-funnel acquisition</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-base font-bold text-ink-primary num">{formatNumber(result.inputs.signups)}</span>
        </div>
      </div>
      
      <div className="flex items-center px-4 py-0.5 text-xs text-teal-brand font-medium gap-1.5">
        <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
        <span>{formatPercent(result.finalActivationRate)} activation</span>
      </div>

      <div className="p-3 rounded-lg border border-app-border bg-slate-50/60 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-xs font-semibold text-ink-primary num shadow-subtle">2</span>
          <div>
            <span className="font-semibold text-ink-primary text-sm block">Activated users</span>
            <span className="text-xs text-slate-500">Completed KYC & first wallet load</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-base font-bold text-ink-primary num">{formatNumber(result.activatedUsers)}</span>
          {renderVariance(result.activatedUsers, baseline.activatedUsers)}
        </div>
      </div>

      <div className="flex items-center px-4 py-0.5 text-xs text-teal-brand font-medium gap-1.5">
        <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
        <span>{formatPercent(result.inputs.retention)} active trader conversion</span>
      </div>

      <div className="p-3 rounded-lg border border-app-border bg-slate-50/60 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-xs font-semibold text-ink-primary num shadow-subtle">3</span>
          <div>
            <span className="font-semibold text-ink-primary text-sm block">Active traders</span>
            <span className="text-xs text-slate-500">Sustained monthly transacting pool (M12)</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-base font-bold text-ink-primary num">{formatNumber(result.activeTraders)}</span>
          {renderVariance(result.activeTraders, baseline.activeTraders)}
        </div>
      </div>

      <div className="flex items-center px-4 py-0.5 text-xs text-slate-500 font-medium gap-1.5">
        <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
        <span>₹{formatNumber(result.inputs.avgMonthlyVolume)} avg monthly volume</span>
      </div>

      <div className="p-3 rounded-lg border border-app-border bg-slate-50/60 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-xs font-semibold text-ink-primary num shadow-subtle">4</span>
          <div>
            <span className="font-semibold text-ink-primary text-sm block">Trading volume</span>
            <span className="text-xs text-slate-500">Total cumulative flow (Year 1)</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-base font-bold text-ink-primary num">{formatCurrency(result.annualVolume)}</span>
          {renderVariance(result.annualVolume, baseline.annualVolume)}
        </div>
      </div>

      <div className="flex items-center px-4 py-0.5 text-xs text-slate-500 font-medium gap-1.5">
        <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
        <span>{result.effectiveFee.toFixed(4)}% effective take rate</span>
      </div>

      <div className="p-3.5 rounded-lg border border-teal-border bg-teal-subtle/50 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded bg-teal-brand text-white flex items-center justify-center text-xs font-semibold num shadow-subtle">5</span>
          <div>
            <span className="font-bold text-ink-primary text-sm block">Fee revenue</span>
            <span className="text-xs text-slate-500">Modeled Year-1 exchange gross revenue</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-teal-brand num">{formatCurrency(result.annualRevenue)}</span>
          {renderVariance(result.annualRevenue, baseline.annualRevenue)}
        </div>
      </div>
    </div>
  );
}
