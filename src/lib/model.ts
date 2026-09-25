export type TrustLevel = 'low' | 'medium' | 'high';

export type SimulatorInputs = {
  signups: number;
  referralShare: number;
  communityShare: number;
  
  onboardingLevel: TrustLevel;
  riskTransparencyLevel: TrustLevel;
  firstTradeGuidanceLevel: TrustLevel;
  
  baseActivation: number;
  retention: number;
  
  makerFee: number;
  takerFee: number;
  takerMix: number;
  
  avgMonthlyVolume: number;
};

export type MonthlyResult = {
  month: number;
  signups: number;
  activated: number;
  activeTraders: number;
  tradingVolume: number;
  feeRevenue: number;
};

export type SimulationResult = {
  finalActivationRate: number;
  trustMultiplier: number;
  annualVolume: number;
  annualRevenue: number;
  activatedUsers: number;
  activeTraders: number;
  effectiveFee: number;
  monthly: MonthlyResult[];
  inputs: SimulatorInputs;
};

const MONTHLY_SIGNUP_DISTRIBUTION = [
  0.05, 0.06, 0.07, 0.08, 0.08, 0.09,
  0.09, 0.09, 0.10, 0.10, 0.10, 0.09
];

export function runSimulation(inputs: SimulatorInputs): SimulationResult {
  const getMultiplier = (level: TrustLevel) => {
    if (level === 'high') return 1.15;
    if (level === 'low') return 0.85;
    return 1.0;
  };
  
  const onboardingMult = getMultiplier(inputs.onboardingLevel);
  const riskMult = getMultiplier(inputs.riskTransparencyLevel);
  const guidanceMult = getMultiplier(inputs.firstTradeGuidanceLevel);
  
  const trustMultiplier = (onboardingMult + riskMult + guidanceMult) / 3;

  const paidShare = Math.max(0, 100 - inputs.referralShare - inputs.communityShare);
  const channelMultiplier = 
    ((inputs.referralShare / 100) * 1.10) +
    ((inputs.communityShare / 100) * 1.00) +
    ((paidShare / 100) * 0.85);

  // Convert baseActivation from 12 (percentage) to 0.12 (decimal)
  const finalActivationRate = (inputs.baseActivation / 100) * trustMultiplier * channelMultiplier;
  
  let currentActive = 0;
  const monthly: MonthlyResult[] = [];
  
  let totalVolume = 0;
  let totalRevenue = 0;
  let totalActivated = 0;
  
  const makerMix = Math.max(0, 100 - inputs.takerMix) / 100;
  const takerMix = inputs.takerMix / 100;
  const effectiveFeePercent = (inputs.takerFee * takerMix) + (inputs.makerFee * makerMix);
  
  for (let m = 0; m < 12; m++) {
    const monthSignups = inputs.signups * MONTHLY_SIGNUP_DISTRIBUTION[m];
    const activated = monthSignups * finalActivationRate;
    
    currentActive = activated + (currentActive * (inputs.retention / 100));
    
    const monthlyVolume = currentActive * inputs.avgMonthlyVolume;
    // Volume is in INR, effectiveFeePercent is e.g. 0.0455. So revenue = volume * (0.0455 / 100)
    const monthlyRevenue = monthlyVolume * (effectiveFeePercent / 100);
    
    monthly.push({
      month: m + 1,
      signups: monthSignups,
      activated,
      activeTraders: currentActive,
      tradingVolume: monthlyVolume,
      feeRevenue: monthlyRevenue
    });
    
    totalVolume += monthlyVolume;
    totalRevenue += monthlyRevenue;
    totalActivated += activated;
  }
  
  return {
    finalActivationRate: finalActivationRate * 100, // return as percentage
    trustMultiplier,
    annualVolume: totalVolume,
    annualRevenue: totalRevenue,
    activatedUsers: totalActivated,
    activeTraders: currentActive, // active traders at end of year
    effectiveFee: effectiveFeePercent,
    monthly,
    inputs
  };
}
