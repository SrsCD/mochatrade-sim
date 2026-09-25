import { SimulationResult } from '@/lib/model';
import AnimatedNumber from './AnimatedNumber';
import { motion } from 'framer-motion';

export default function Funnel({ result, baseline }: { result: SimulationResult, baseline: SimulationResult }) {
  
  const renderVariance = (val: number, base: number) => {
    if (base === 0) return null;
    const diff = ((val - base) / base) * 100;
    if (Math.abs(diff) < 0.01) return null;
    
    return (
      <motion.span 
        layout 
        className={`text-xs font-semibold block num ${diff > 0 ? 'text-badge-pos' : 'text-badge-neg'}`}
      >
        {diff > 0 ? '+' : ''}{diff.toFixed(1)}% vs base
      </motion.span>
    );
  };

  return (
    <div className="text-[13px] relative">
      <motion.div layout className="py-3 flex items-center justify-between">
        <div>
          <span className="font-semibold text-ink-primary text-sm block">Signups</span>
          <span className="text-[11px] text-ink-secondary">Top-of-funnel acquisition</span>
        </div>
        <div className="text-right">
          <AnimatedNumber value={result.inputs.signups} formatType="number" className="text-base font-bold text-ink-primary num block" />
        </div>
      </motion.div>
      
      <motion.div layout className="py-1.5 flex items-center text-[11px] text-teal-brand font-medium border-l-2 border-teal-brand/20 ml-2 pl-4">
        <span>↓ <AnimatedNumber value={result.finalActivationRate} formatType="percent" /> activation</span>
      </motion.div>

      <motion.div layout className="py-3 flex items-center justify-between">
        <div>
          <span className="font-semibold text-ink-primary text-sm block">Activated users</span>
          <span className="text-[11px] text-ink-secondary">Completed KYC & first wallet load</span>
        </div>
        <div className="text-right">
          <AnimatedNumber value={result.activatedUsers} formatType="number" className="text-base font-bold text-ink-primary num block" />
          {renderVariance(result.activatedUsers, baseline.activatedUsers)}
        </div>
      </motion.div>

      <motion.div layout className="py-1.5 flex items-center text-[11px] text-teal-brand font-medium border-l-2 border-teal-brand/20 ml-2 pl-4">
        <span>↓ <AnimatedNumber value={result.inputs.retention} formatType="percent" /> active trader conversion</span>
      </motion.div>

      <motion.div layout className="py-3 flex items-center justify-between">
        <div>
          <span className="font-semibold text-ink-primary text-sm block">Active traders</span>
          <span className="text-[11px] text-ink-secondary">Sustained monthly transacting pool (M12)</span>
        </div>
        <div className="text-right">
          <AnimatedNumber value={result.activeTraders} formatType="number" className="text-base font-bold text-ink-primary num block" />
          {renderVariance(result.activeTraders, baseline.activeTraders)}
        </div>
      </motion.div>

      <motion.div layout className="py-1.5 flex items-center text-[11px] text-ink-secondary font-medium border-l-2 border-app-border ml-2 pl-4">
        <span>↓ ₹<AnimatedNumber value={result.inputs.avgMonthlyVolume} formatType="number" /> avg monthly volume</span>
      </motion.div>

      <motion.div layout className="py-3 flex items-center justify-between">
        <div>
          <span className="font-semibold text-ink-primary text-sm block">Trading volume</span>
          <span className="text-[11px] text-ink-secondary">Total cumulative flow (Year 1)</span>
        </div>
        <div className="text-right">
          <AnimatedNumber value={result.annualVolume} formatType="currency" className="text-base font-bold text-ink-primary num block" />
          {renderVariance(result.annualVolume, baseline.annualVolume)}
        </div>
      </motion.div>

      <motion.div layout className="py-1.5 flex items-center text-[11px] text-ink-secondary font-medium border-l-2 border-app-border ml-2 pl-4">
        <span>↓ <AnimatedNumber value={result.effectiveFee} formatType="bps" /> effective take rate</span>
      </motion.div>

      <motion.div layout className="mt-2 py-4 border-t border-app-border flex items-center justify-between">
        <div>
          <span className="font-bold text-ink-primary text-[15px] block">Fee revenue</span>
          <span className="text-[11px] text-ink-secondary">Modeled Year-1 exchange gross revenue</span>
        </div>
        <div className="text-right">
          <AnimatedNumber value={result.annualRevenue} formatType="currency" className="text-lg font-bold text-teal-brand num block" />
          {renderVariance(result.annualRevenue, baseline.annualRevenue)}
        </div>
      </motion.div>
    </div>
  );
}
