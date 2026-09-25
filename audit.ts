import { runSimulation } from './src/lib/model';
import { DEFAULT_BITREBELS_SCENARIO } from './src/lib/scenarios';
import { formatCurrency, formatNumber } from './src/lib/formatting';

const result = runSimulation(DEFAULT_BITREBELS_SCENARIO);

console.log('--- RECONCILIATION AUDIT ---');
console.log('1. Signups:', result.inputs.signups);
console.log('2. Channel mix: Referral=' + result.inputs.referralShare + '%, Community=' + result.inputs.communityShare + '%, Paid=' + (100 - result.inputs.referralShare - result.inputs.communityShare) + '%');

const channelMultiplier = ((result.inputs.referralShare / 100) * 1.10) + ((result.inputs.communityShare / 100) * 1.00) + (((100 - result.inputs.referralShare - result.inputs.communityShare) / 100) * 0.85);
console.log('3. Channel multiplier:', channelMultiplier.toFixed(4));
console.log('4. Trust multiplier:', result.trustMultiplier.toFixed(4));
console.log('5. Final activation rate:', result.finalActivationRate.toFixed(4) + '%');
console.log('6. Activated users:', result.activatedUsers);
console.log('7. Active traders (M12):', result.activeTraders);

let volSum = 0;
let revSum = 0;
result.monthly.forEach((m) => {
  volSum += m.tradingVolume;
  revSum += m.feeRevenue;
});

console.log('8. Month 12 Trading volume:', result.monthly[11].tradingVolume);
console.log('9. Year-1 trading volume:', result.annualVolume);
console.log('   Sum of monthly volume:', volSum);
console.log('10. Effective fee:', result.effectiveFee.toFixed(4) + '%');
console.log('11. Year-1 fee revenue:', result.annualRevenue);
console.log('    Sum of monthly revenue:', revSum);
console.log('    Volume * (Effective Fee / 100):', result.annualVolume * (result.effectiveFee / 100));

console.log('\n--- FORMATTING AUDIT ---');
console.log('Volume formatted:', formatCurrency(result.annualVolume));
console.log('Revenue formatted:', formatCurrency(result.annualRevenue));
