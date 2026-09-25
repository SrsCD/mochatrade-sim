import { SimulatorInputs, TrustLevel } from '@/lib/model';
import { motion } from 'framer-motion';

export default function ControlPanel({
  inputs,
  onChange
}: {
  inputs: SimulatorInputs,
  onChange: (inputs: SimulatorInputs) => void
}) {
  
  const updateInput = (key: keyof SimulatorInputs, value: any) => {
    onChange({ ...inputs, [key]: value });
  };
  
  const handleReferralChange = (val: number) => {
    let newRef = val;
    let newCom = inputs.communityShare;
    if (newRef + newCom > 100) {
      newCom = 100 - newRef;
    }
    onChange({ ...inputs, referralShare: newRef, communityShare: newCom });
  };

  const handleCommunityChange = (val: number) => {
    let newCom = val;
    let newRef = inputs.referralShare;
    if (newRef + newCom > 100) {
      newRef = 100 - newCom;
    }
    onChange({ ...inputs, referralShare: newRef, communityShare: newCom });
  };

  const paidShare = Math.max(0, 100 - inputs.referralShare - inputs.communityShare);
  const nonPaidShare = inputs.referralShare + inputs.communityShare;

  return (
    <section className="col-span-12 lg:col-span-5 bg-white border border-app-border rounded-lg shadow-subtle divide-y divide-app-border text-xs">
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-serif-display text-[17px] font-semibold text-ink-primary">Model inputs</h2>
          <p className="text-[11px] text-ink-secondary mt-0.5">Parameters influencing user conversion & economics</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-primary">Acquisition</span>
          <span className="text-[11px] text-ink-secondary">Year-1 projection</span>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-ink-secondary font-medium">Year-1 signups</label>
            <div className="flex items-center gap-1.5">
              <input 
                type="number" 
                min="50000" max="300000" step="5000"
                value={inputs.signups}
                onChange={e => updateInput('signups', Number(e.target.value))}
                className="w-24 text-right py-0.5 px-2 border border-app-border rounded text-xs font-semibold text-ink-primary num focus:outline-none focus:border-teal-brand"
              />
            </div>
          </div>
          <input 
            type="range" min="50000" max="300000" step="5000" 
            value={inputs.signups}
            onChange={e => updateInput('signups', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-ink-tertiary num">
            <span>50k</span>
            <span className="text-teal-brand font-medium">{(inputs.signups/1000).toFixed(0)}k (Active)</span>
            <span>300k</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-ink-secondary text-[11px]">
            <span className="font-medium text-ink-primary">Acquisition channel mix</span>
            <span>Non-paid acquisition: <strong className="text-badge-pos font-semibold">{nonPaidShare}%</strong></span>
          </div>
          <div className="w-full h-2 rounded bg-slate-100 overflow-hidden flex">
            <motion.div className="bg-teal-brand h-full" animate={{ width: `${inputs.referralShare}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
            <motion.div className="bg-indigo-500 h-full" animate={{ width: `${inputs.communityShare}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
            <motion.div className="bg-slate-300 h-full" animate={{ width: `${paidShare}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-ink-secondary">
                <span className="w-2 h-2 rounded-full bg-teal-brand"></span>
                <span>Referral</span>
              </div>
              <input type="number" min="0" max="100" value={inputs.referralShare} onChange={e => handleReferralChange(Number(e.target.value))} className="w-full mt-1 bg-transparent border-b border-slate-300 focus:border-teal-brand focus:outline-none font-semibold text-ink-primary num" />
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-ink-secondary">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>Community</span>
              </div>
              <input type="number" min="0" max="100" value={inputs.communityShare} onChange={e => handleCommunityChange(Number(e.target.value))} className="w-full mt-1 bg-transparent border-b border-slate-300 focus:border-teal-brand focus:outline-none font-semibold text-ink-primary num" />
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-ink-secondary">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Paid</span>
              </div>
              <span className="font-semibold text-ink-primary block mt-1 num">{paidShare}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-primary">Trust levers</span>
        </div>
        
        {[
          { label: 'Guided onboarding', key: 'onboardingLevel' as const, desc: 'Step-by-step verified walkthrough' },
          { label: 'Risk transparency', key: 'riskTransparencyLevel' as const, desc: 'Fee schedule and reserve disclosure' },
          { label: 'First-trade guidance', key: 'firstTradeGuidanceLevel' as const, desc: 'Assisted execution & paper simulator' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-ink-primary block">{item.label}</span>
              <span className="text-[11px] text-ink-secondary">{item.desc}</span>
            </div>
            <div className="inline-flex rounded p-0.5 bg-slate-100 border border-slate-200">
              <button 
                onClick={() => updateInput(item.key, 'low')}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${inputs[item.key] === 'low' ? 'bg-white text-teal-brand shadow-subtle border border-slate-200/80 font-semibold' : 'text-slate-500 hover:text-ink-primary'}`}
              >Low</button>
              <button 
                onClick={() => updateInput(item.key, 'medium')}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${inputs[item.key] === 'medium' ? 'bg-white text-teal-brand shadow-subtle border border-slate-200/80 font-semibold' : 'text-slate-500 hover:text-ink-primary'}`}
              >Medium</button>
              <button 
                onClick={() => updateInput(item.key, 'high')}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${inputs[item.key] === 'high' ? 'bg-white text-teal-brand shadow-subtle border border-slate-200/80 font-semibold' : 'text-slate-500 hover:text-ink-primary'}`}
              >High</button>
            </div>
          </div>
        ))}
        <p className="text-[11px] text-ink-secondary bg-slate-50 border border-slate-200/70 p-2.5 rounded leading-relaxed">
          Active trust levers apply up to 1.15× multiplier to top-of-funnel activation and retention.
        </p>
      </div>

      <div className="p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-primary">Pricing schedule</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] text-ink-secondary block">Maker fee (%)</span>
            <input 
              type="number" min="0" step="0.001" 
              value={inputs.makerFee} 
              onChange={e => {
                let val = parseFloat(e.target.value);
                if (isNaN(val) || !isFinite(val)) val = 0;
                updateInput('makerFee', Math.max(0, val));
              }} 
              className="mt-0.5 w-full bg-transparent border-b border-slate-300 focus:border-teal-brand focus:outline-none text-sm font-semibold text-ink-primary num" 
            />
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] text-ink-secondary block">Taker fee (%)</span>
            <input 
              type="number" min="0" step="0.001" 
              value={inputs.takerFee} 
              onChange={e => {
                let val = parseFloat(e.target.value);
                if (isNaN(val) || !isFinite(val)) val = 0;
                updateInput('takerFee', Math.max(0, val));
              }} 
              className="mt-0.5 w-full bg-transparent border-b border-slate-300 focus:border-teal-brand focus:outline-none text-sm font-semibold text-ink-primary num" 
            />
          </div>
        </div>
        
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-ink-secondary">
            <span>Taker volume mix</span>
            <span className="font-semibold text-ink-primary num">{inputs.takerMix}%</span>
          </div>
          <input 
            type="range" min="50" max="100" step="1" 
            value={inputs.takerMix}
            onChange={e => updateInput('takerMix', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-primary">Retention & activity</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200/70">
            <div>
              <span className="text-xs font-medium text-ink-primary block">Monthly retention (%)</span>
              <span className="text-[11px] text-ink-secondary">Active traders after 90 days</span>
            </div>
            <div className="w-16">
              <input 
                type="number" min="0" max="100" step="1" 
                value={inputs.retention} 
                onChange={e => {
                  let val = parseFloat(e.target.value);
                  if (isNaN(val) || !isFinite(val)) val = 0;
                  updateInput('retention', Math.min(100, Math.max(0, val)));
                }} 
                className="w-full text-right bg-transparent border-b border-slate-300 focus:border-teal-brand focus:outline-none text-sm font-semibold text-ink-primary num" 
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200/70">
            <div>
              <span className="text-xs font-medium text-ink-primary block">Avg monthly volume (₹)</span>
              <span className="text-[11px] text-ink-secondary">Per active trader</span>
            </div>
            <div className="w-24">
              <input type="number" min="1000" step="1000" value={inputs.avgMonthlyVolume} onChange={e => updateInput('avgMonthlyVolume', Number(e.target.value))} className="w-full text-right bg-transparent border-b border-slate-300 focus:border-teal-brand focus:outline-none text-sm font-semibold text-ink-primary num" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
