import { SimulationResult } from '@/lib/model';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/formatting';

export default function KPIGrid({ result, baseline }: { result: SimulationResult, baseline: SimulationResult }) {
  // Helpers
  const calcPercentDiff = (val: number, base: number) => {
    if (base === 0) return 0;
    return ((val - base) / base) * 100;
  };
  
  const renderVariance = (val: number, base: number, inverse: boolean = false, isAbsolute: boolean = false) => {
    const diff = isAbsolute ? (val - base) : calcPercentDiff(val, base);
    const positiveIsGood = !inverse;
    const isGood = diff > 0 ? positiveIsGood : (diff < 0 ? !positiveIsGood : true);
    const sign = diff > 0 ? '+' : '';
    const formattedDiff = isAbsolute ? diff.toFixed(1) : diff.toFixed(1) + '%';
    
    if (Math.abs(diff) < 0.01) {
      return <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded inline-block num">Flat vs baseline</span>;
    }
    
    return (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded inline-block num ${
        isGood 
          ? 'text-badge-pos bg-badge-posBg border border-badge-posBorder'
          : 'text-badge-neg bg-badge-negBg border border-badge-negBorder'
      }`}>
        {sign}{formattedDiff} vs baseline
      </span>
    );
  };

  return (
    <section className="bg-white border border-app-border rounded-lg shadow-subtle grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-app-border">
      <div className="p-4 space-y-1.5">
        <span className="text-xs text-slate-500 block font-medium">Year-1 trading volume</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-ink-primary num">{formatCurrency(result.annualVolume)}</span>
        </div>
        {renderVariance(result.annualVolume, baseline.annualVolume)}
      </div>

      <div className="p-4 space-y-1.5">
        <span className="text-xs text-slate-500 block font-medium">Year-1 fee revenue</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-ink-primary num">{formatCurrency(result.annualRevenue)}</span>
        </div>
        {renderVariance(result.annualRevenue, baseline.annualRevenue)}
      </div>

      <div className="p-4 space-y-1.5">
        <span className="text-xs text-slate-500 block font-medium">Active traders (M12)</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-ink-primary num whitespace-nowrap">{formatNumber(result.activeTraders)}</span>
        </div>
        {renderVariance(result.activeTraders, baseline.activeTraders)}
      </div>

      <div className="p-4 space-y-1.5">
        <span className="text-xs text-slate-500 block font-medium">Activation rate</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-ink-primary num">{formatPercent(result.finalActivationRate)}</span>
        </div>
        <span className="text-xs text-badge-pos font-semibold bg-badge-posBg border border-badge-posBorder px-2 py-0.5 rounded inline-block num">
          {result.finalActivationRate > baseline.finalActivationRate ? '+' : ''}
          {(result.finalActivationRate - baseline.finalActivationRate).toFixed(1)}% vs base ({formatPercent(baseline.finalActivationRate)})
        </span>
      </div>

      <div className="p-4 space-y-1.5 col-span-2 md:col-span-1">
        <span className="text-xs text-slate-500 block font-medium">Effective fee</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-ink-primary num">{result.effectiveFee.toFixed(4)}%</span>
        </div>
        {renderVariance(result.effectiveFee, baseline.effectiveFee, true)}
      </div>
    </section>
  );
}
