import { runSimulation, SimulatorInputs } from './src/lib/model';
import { DEFAULT_BITREBELS_SCENARIO, BASELINE_SCENARIO } from './src/lib/scenarios';

console.log("=== TESTS AFTER FIXING ===");

// Helper to simulate React clamping logic from ControlPanel.tsx
const clampFee = (val: any) => {
  let v = parseFloat(val);
  if (isNaN(v) || !isFinite(v)) v = 0;
  return Math.max(0, v);
};

const clampRetention = (val: any) => {
  let v = parseFloat(val);
  if (isNaN(v) || !isFinite(v)) v = 0;
  return Math.min(100, Math.max(0, v));
};

console.log("\n1. Maker fee = -0.05%");
console.log("Expected: clamped to 0. Actual:", clampFee("-0.05"));

console.log("\n2. Taker fee = -0.05%");
console.log("Expected: clamped to 0. Actual:", clampFee("-0.05"));

console.log("\n3. Retention = 999");
console.log("Expected: clamped to 100. Actual:", clampRetention("999"));

console.log("\n4. Retention = -20");
console.log("Expected: clamped to 0. Actual:", clampRetention("-20"));

const defaultInputs = { ...DEFAULT_BITREBELS_SCENARIO };
const baseResult = runSimulation(defaultInputs);

console.log("\n5. Referral = 40%, Community = 35%, Paid = 25%");
console.log("Activation:", baseResult.finalActivationRate.toFixed(2) + "%");
console.log("Volume:", baseResult.annualVolume);
console.log("Revenue:", baseResult.annualRevenue);

console.log("\n6. Change Referral = 60%, Community = 20%, Paid = 20%");
const t6Inputs = { ...defaultInputs, referralShare: 60, communityShare: 20 };
const t6Result = runSimulation(t6Inputs);
console.log("Activation:", t6Result.finalActivationRate.toFixed(2) + "%");
console.log("Active Traders changed?", t6Result.activeTraders !== baseResult.activeTraders);
console.log("Volume changed?", t6Result.annualVolume !== baseResult.annualVolume);
console.log("Revenue changed?", t6Result.annualRevenue !== baseResult.annualRevenue);

console.log("\n7. Change Taker Fee");
const t7Inputs = { ...defaultInputs, takerFee: 0.080 };
const t7Result = runSimulation(t7Inputs);
console.log("Effective fee changed?", t7Result.effectiveFee !== baseResult.effectiveFee);
console.log("Revenue changed?", t7Result.annualRevenue !== baseResult.annualRevenue);
console.log("Volume did NOT change?", t7Result.annualVolume === baseResult.annualVolume);

console.log("\n8. Change Trust from High to Low");
const t8Inputs: SimulatorInputs = { ...defaultInputs, onboardingLevel: 'low', riskTransparencyLevel: 'low', firstTradeGuidanceLevel: 'low' };
const t8Result = runSimulation(t8Inputs);
console.log("Trust multiplier:", t8Result.trustMultiplier);
console.log("Activation changed?", t8Result.finalActivationRate !== baseResult.finalActivationRate);
console.log("Volume changed?", t8Result.annualVolume !== baseResult.annualVolume);

console.log("\n9. Change retention");
const t9Inputs = { ...defaultInputs, retention: clampRetention("85") };
const t9Result = runSimulation(t9Inputs);
console.log("Active traders changed?", t9Result.activeTraders !== baseResult.activeTraders);
console.log("Volume changed?", t9Result.annualVolume !== baseResult.annualVolume);

console.log("\n10. Baseline vs BITREBELS");
const baselineResult = runSimulation(BASELINE_SCENARIO);
console.log("Are they different?", baseResult.annualVolume !== baselineResult.annualVolume);

