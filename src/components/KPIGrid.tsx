import { SimulationResult } from '@/lib/model';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/formatting';
import AnimatedNumber from './AnimatedNumber';

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
    <section className="grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-6">
      <div className="space-y-1.5 md:border-r md:border-app-border">
        <span className="text-[11px] text-ink-secondary block font-semibold uppercase tracking-wider">Year-1 trading volume</span>
        <div className="flex items-baseline gap-2">
          <AnimatedNumber value={result.annualVolume} formatType="currency" className="text-[26px] font-bold tracking-tight text-ink-primary num" />
        </div>
        {renderVariance(result.annualVolume, baseline.annualVolume)}
      </div>

      <div className="space-y-1.5 md:border-r md:border-app-border md:pl-4">
        <span className="text-[11px] text-ink-secondary block font-semibold uppercase tracking-wider">Year-1 fee revenue</span>
        <div className="flex items-baseline gap-2">
          <AnimatedNumber value={result.annualRevenue} formatType="currency" className="text-[26px] font-bold tracking-tight text-ink-primary num" />
        </div>
        {renderVariance(result.annualRevenue, baseline.annualRevenue)}
      </div>

      <div className="space-y-1.5 md:border-r md:border-app-border md:pl-4">
        <span className="text-[11px] text-ink-secondary block font-semibold uppercase tracking-wider">Active traders (M12)</span>
        <div className="flex items-baseline gap-2">
          <AnimatedNumber value={result.activeTraders} formatType="number" className="text-[26px] font-bold tracking-tight text-ink-primary num whitespace-nowrap" />
        </div>
        {renderVariance(result.activeTraders, baseline.activeTraders)}
      </div>

      <div className="space-y-1.5 md:border-r md:border-app-border md:pl-4">
        <span className="text-[11px] text-ink-secondary block font-semibold uppercase tracking-wider">Activation rate</span>
        <div className="flex items-baseline gap-2">
          <AnimatedNumber value={result.finalActivationRate} formatType="percent" className="text-[26px] font-bold tracking-tight text-ink-primary num" />
        </div>
        <span className="text-xs text-badge-pos font-semibold bg-badge-posBg border border-badge-posBorder px-2 py-0.5 rounded inline-block num">
          {result.finalActivationRate > baseline.finalActivationRate ? '+' : ''}
          {(result.finalActivationRate - baseline.finalActivationRate).toFixed(1)}% vs base
        </span>
      </div>

      <div className="space-y-1.5 md:pl-4 col-span-2 md:col-span-1">
        <span className="text-[11px] text-ink-secondary block font-semibold uppercase tracking-wider">Effective fee</span>
        <div className="flex items-baseline gap-2">
          <AnimatedNumber value={result.effectiveFee} formatType="bps" className="text-[26px] font-bold tracking-tight text-ink-primary num" />
        </div>
        {renderVariance(result.effectiveFee, baseline.effectiveFee, true)}
      </div>
    </section>
  );
}
