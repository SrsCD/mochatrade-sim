import { SimulationResult } from '@/lib/model';

export default function TrustPanel({ result, baseline }: { result: SimulationResult, baseline: SimulationResult }) {
  
  const actLift = result.finalActivationRate - baseline.finalActivationRate;
  const retLift = result.inputs.retention - baseline.inputs.retention;

  return (
    <div className="md:col-span-5 bg-slate-50/70 border border-slate-200 rounded-lg p-4 space-y-3.5 text-xs shadow-subtle">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-teal-brand text-[18px]">verified</span>
          <span className="font-semibold text-ink-primary text-sm">Trust engine</span>
        </div>
        <span className="text-xs font-semibold text-teal-brand bg-teal-subtle px-2 py-0.5 rounded border border-teal-border">
          {result.trustMultiplier.toFixed(2)}× Multiplier
        </span>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-500">
          <span>Guided onboarding</span>
          <span className="font-medium text-ink-primary capitalize">{result.inputs.onboardingLevel}</span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span>Risk transparency</span>
          <span className="font-medium text-ink-primary capitalize">{result.inputs.riskTransparencyLevel}</span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span>First-trade guidance</span>
          <span className="font-medium text-ink-primary capitalize">{result.inputs.firstTradeGuidanceLevel}</span>
        </div>
      </div>
      
      <div className="pt-2.5 border-t border-slate-200 space-y-2.5">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <span className="text-xs text-slate-500 block">Activation impact</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xs font-semibold text-ink-primary num">
              {baseline.finalActivationRate.toFixed(1)}% → {result.finalActivationRate.toFixed(1)}%
            </span>
            <span className={`text-xs font-semibold num ${actLift >= 0 ? 'text-badge-pos' : 'text-badge-neg'}`}>
              {actLift > 0 ? '+' : ''}{actLift.toFixed(1)}% lift
            </span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <span className="text-xs text-slate-500 block">Retention impact</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xs font-semibold text-ink-primary num">
              {baseline.inputs.retention.toFixed(1)}% → {result.inputs.retention.toFixed(1)}%
            </span>
            <span className={`text-xs font-semibold num ${retLift >= 0 ? 'text-badge-pos' : 'text-badge-neg'}`}>
              {retLift > 0 ? '+' : ''}{retLift.toFixed(1)}% sustained
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 leading-relaxed pt-1">
        Trust reduces onboarding friction and compounds trader longevity without relying on promotional trading credits.
      </p>
    </div>
  );
}
