import { SimulationResult } from '@/lib/model';
import AnimatedNumber from './AnimatedNumber';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrustPanel({ result, baseline }: { result: SimulationResult, baseline: SimulationResult }) {
  
  const actLift = result.finalActivationRate - baseline.finalActivationRate;
  const retLift = result.inputs.retention - baseline.inputs.retention;

  return (
    <div className="bg-app-subtle border border-app-border rounded-lg p-5 space-y-4 shadow-subtle relative overflow-hidden h-full">
      <AnimatePresence mode="wait">
        <motion.div 
          key={result.trustMultiplier}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-10 -right-10 w-24 h-24 bg-teal-brand/10 rounded-full blur-2xl pointer-events-none"
        />
      </AnimatePresence>

      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-teal-brand text-[18px]">verified</span>
          <span className="font-semibold text-ink-primary text-sm">Trust engine</span>
        </div>
        <span className="flex gap-1 text-xs font-semibold text-teal-brand bg-teal-subtle px-2 py-0.5 rounded border border-teal-border">
          <AnimatedNumber value={result.trustMultiplier} formatType="multiplier" /> Multiplier
        </span>
      </div>
      
      <div className="space-y-2 text-xs relative z-10">
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
      
      <div className="pt-2.5 border-t border-slate-200 space-y-2.5 relative z-10">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-subtle transition-colors hover:border-teal-border">
          <span className="text-xs text-slate-500 block">Activation impact</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="flex gap-1 text-xs font-semibold text-ink-primary num">
              {baseline.finalActivationRate.toFixed(1)}% → <AnimatedNumber value={result.finalActivationRate} formatType="percent" />
            </span>
            <span className={`text-xs font-semibold num flex gap-1 ${actLift >= 0 ? 'text-badge-pos' : 'text-badge-neg'}`}>
              {actLift > 0 ? '+' : ''}<AnimatedNumber value={actLift} formatType="percent" /> lift
            </span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-subtle transition-colors hover:border-teal-border">
          <span className="text-xs text-slate-500 block">Retention impact</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="flex gap-1 text-xs font-semibold text-ink-primary num">
              {baseline.inputs.retention.toFixed(1)}% → <AnimatedNumber value={result.inputs.retention} formatType="percent" />
            </span>
            <span className={`flex gap-1 text-xs font-semibold num ${retLift >= 0 ? 'text-badge-pos' : 'text-badge-neg'}`}>
              {retLift > 0 ? '+' : ''}<AnimatedNumber value={retLift} formatType="percent" /> sustained
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 leading-relaxed pt-1 relative z-10">
        Trust reduces onboarding friction and compounds trader longevity without relying on promotional trading credits.
      </p>
    </div>
  );
}
