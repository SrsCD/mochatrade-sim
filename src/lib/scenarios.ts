import { SimulatorInputs } from './model';

export const BASE_ACTIVATION = 12.0;

export const DEFAULT_BITREBELS_SCENARIO: SimulatorInputs = {
  signups: 150000,
  referralShare: 40,
  communityShare: 35,
  
  onboardingLevel: 'high',
  riskTransparencyLevel: 'high',
  firstTradeGuidanceLevel: 'high',
  
  baseActivation: BASE_ACTIVATION,
  retention: 55,
  
  makerFee: 0.020,
  takerFee: 0.050,
  takerMix: 85,
  
  avgMonthlyVolume: 20000
};

export const BASELINE_SCENARIO: SimulatorInputs = {
  signups: 150000,
  referralShare: 10,
  communityShare: 20,
  
  onboardingLevel: 'medium', // Maps to 1.0x
  riskTransparencyLevel: 'medium',
  firstTradeGuidanceLevel: 'medium',
  
  baseActivation: BASE_ACTIVATION,
  retention: 45, 
  
  avgMonthlyVolume: 18000,
  
  makerFee: 0.020,
  takerFee: 0.055,
  takerMix: 85,
};
