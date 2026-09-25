export default function AssumptionsPanel() {
  return (
    <div className="border border-app-border rounded-lg bg-white shadow-subtle overflow-hidden">
      <details className="group" id="assumptions">
        <summary className="px-5 py-3.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-[18px] group-open:rotate-90 transition-transform">chevron_right</span>
            <span className="font-serif-display text-[15px] font-semibold text-ink-primary">Model assumptions & methodology</span>
          </div>
          <span className="text-[11px] text-ink-secondary">Click to view calculation logic</span>
        </summary>
        <div className="p-5 border-t border-app-border bg-slate-50/40 text-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded bg-white border border-app-border">
              <span className="font-semibold text-ink-primary block">Base activation</span>
              <p className="text-[11px] text-ink-secondary mt-1 leading-normal">
                Standard baseline KYC and funding completion rate set at 12.0% based on historical control benchmarks.
              </p>
            </div>
            <div className="p-3.5 rounded bg-white border border-app-border">
              <span className="font-semibold text-ink-primary block">Trust multiplier compounding</span>
              <p className="text-[11px] text-ink-secondary mt-1 leading-normal">
                Active trust levers (guided onboarding, risk transparency, sandbox) provide a combined up to 1.15× multiplier on activation rate.
              </p>
            </div>
            <div className="p-3.5 rounded bg-white border border-app-border">
              <span className="font-semibold text-ink-primary block">Retention curves</span>
              <p className="text-[11px] text-ink-secondary mt-1 leading-normal">
                Exponential decay model where community guild anchors reduce monthly churn, increasing D90 sustained retention dynamically based on settings.
              </p>
            </div>
            <div className="p-3.5 rounded bg-white border border-app-border">
              <span className="font-semibold text-ink-primary block">Fee schedule formula</span>
              <p className="text-[11px] text-ink-secondary mt-1 leading-normal">
                Effective fee = (Maker Fee × Maker Share) + (Taker Fee × Taker Share). E.g. (0.020% × 15%) + (0.050% × 85%) = 0.0455%.
              </p>
            </div>
            <div className="p-3.5 rounded bg-white border border-app-border">
              <span className="font-semibold text-ink-primary block">Channel effectiveness</span>
              <p className="text-[11px] text-ink-secondary mt-1 leading-normal">
                Referral multiplier (1.10x), Community (1.00x), and Paid (0.85x) proportionally weight the final activation rate.
              </p>
            </div>
          </div>
          
          <div className="p-3 rounded bg-white border border-app-border text-[11px] text-ink-secondary leading-relaxed">
            <strong className="text-ink-primary font-medium">Disclaimer:</strong> All conversion, retention, volume and growth assumptions are illustrative scenario inputs for internal planning and do not constitute actual forecasts. Bybit's public non-VIP perpetual/futures fees are used as a pricing benchmark.
          </div>
        </div>
      </details>
    </div>
  );
}
