import { SimulationResult } from '@/lib/model';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatting';

export default function ScenarioComparison({ result, baseline }: { result: SimulationResult, baseline: SimulationResult }) {
  
  const renderRow = (
    label: string, 
    baseVal: number, 
    resVal: number, 
    formatter: (v: number) => string, 
    inverse: boolean = false, 
    isAbsolute: boolean = false,
    highlight: boolean = false
  ) => {
    let diff = 0;
    if (isAbsolute) {
      diff = resVal - baseVal;
    } else {
      diff = baseVal === 0 ? 0 : ((resVal - baseVal) / baseVal) * 100;
    }
    
    const isPositive = diff > 0;
    const isGood = inverse ? !isPositive : isPositive;
    const sign = diff > 0 ? '+' : '';
    
    let formattedDiff = '';
    if (Math.abs(diff) < 0.01) {
      formattedDiff = '-';
    } else {
      formattedDiff = `${sign}${diff.toFixed(1)}${isAbsolute ? (label.includes('fee') ? '' : '%') : '%'}`;
    }
    
    return (
      <tr className={`hover:bg-slate-50/70 transition-colors ${highlight ? 'bg-teal-subtle/20' : ''}`}>
        <td className={`py-2.5 px-3 font-medium text-ink-primary ${highlight ? 'font-bold' : ''}`}>{label}</td>
        <td className="py-2.5 px-3 text-right text-ink-secondary num">{formatter(baseVal)}</td>
        <td className={`py-2.5 px-3 text-right num ${highlight ? 'text-teal-brand bg-teal-subtle/60 font-bold' : 'text-ink-primary bg-teal-subtle/30 font-medium'}`}>
          {formatter(resVal)}
        </td>
        <td className={`py-2.5 px-3 text-right font-semibold num ${Math.abs(diff) < 0.01 ? 'text-slate-400' : (isGood ? 'text-badge-pos' : 'text-badge-neg')}`}>
          {formattedDiff}
        </td>
      </tr>
    );
  };

  return (
    <div id="scenarios" className="bg-white border border-app-border rounded-lg shadow-subtle p-5 space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-app-border">
        <div>
          <h3 className="font-serif-display text-[17px] font-semibold text-ink-primary">Scenario comparison</h3>
          <p className="text-xs text-ink-secondary mt-0.5">See how the BITREBELS strategy differs from the baseline.</p>
        </div>
        <span className="text-[11px] text-ink-secondary">Full Model Reconciliation</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-app-border text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3">Metric</th>
              <th className="py-2.5 px-3 text-right">Baseline</th>
              <th className="py-2.5 px-3 text-right text-teal-brand bg-teal-subtle/50 font-semibold rounded-t">BITREBELS</th>
              <th className="py-2.5 px-3 text-right">Variance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border/70">
            {renderRow('Signups', baseline.inputs.signups, result.inputs.signups, formatNumber)}
            {renderRow('Activation', baseline.finalActivationRate, result.finalActivationRate, formatPercent, false, true)}
            {renderRow('Activated users', baseline.activatedUsers, result.activatedUsers, formatNumber)}
            {renderRow('Active traders (M12)', baseline.activeTraders, result.activeTraders, formatNumber)}
            {renderRow('Year-1 trading volume', baseline.annualVolume, result.annualVolume, formatCurrency)}
            {renderRow('Effective fee', baseline.effectiveFee, result.effectiveFee, (v) => v.toFixed(4) + '%', true)}
            {renderRow('Year-1 fee revenue', baseline.annualRevenue, result.annualRevenue, formatCurrency, false, false, true)}
            {renderRow('Referral share', baseline.inputs.referralShare, result.inputs.referralShare, (v) => v.toFixed(0) + '%', false, true)}
            {renderRow('Community share', baseline.inputs.communityShare, result.inputs.communityShare, (v) => v.toFixed(0) + '%', false, true)}
            {renderRow('Paid share', 100 - baseline.inputs.referralShare - baseline.inputs.communityShare, 100 - result.inputs.referralShare - result.inputs.communityShare, (v) => v.toFixed(0) + '%', true, true)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
