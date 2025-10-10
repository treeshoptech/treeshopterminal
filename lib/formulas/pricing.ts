/**
 * TreeShop Pricing Formula Engine
 * Based on CLAUDE.md comprehensive pricing system
 *
 * Complete 6-Step Formula System:
 * 1. Equipment Hourly Cost
 * 2. Employee True Labor Cost
 * 3. Loadout Cost (Equipment + Labor)
 * 4. Profit Margin to Billing Rate
 * 5. Project Inch-Acres / Work Volume
 * 6. Final Project Price
 */

// ============================================================================
// STEP 1: EQUIPMENT HOURLY COST
// ============================================================================

export interface EquipmentCostParams {
  purchasePrice: number;
  usefulLifeYears: number;
  annualFinanceCost: number;
  annualInsurance: number;
  annualRegistration: number;
  annualHours: number;
  fuelGallonsPerHour: number;
  fuelPricePerGallon: number;
  annualMaintenance: number;
  annualRepairs: number;
}

export interface EquipmentCostResult {
  ownershipCostPerHour: number;
  operatingCostPerHour: number;
  totalCostPerHour: number;
  breakdown: {
    depreciation: number;
    finance: number;
    insurance: number;
    registration: number;
    fuel: number;
    maintenance: number;
    repairs: number;
  };
}

export function calculateEquipmentCost(params: EquipmentCostParams): EquipmentCostResult {
  const {
    purchasePrice,
    usefulLifeYears,
    annualFinanceCost,
    annualInsurance,
    annualRegistration,
    annualHours,
    fuelGallonsPerHour,
    fuelPricePerGallon,
    annualMaintenance,
    annualRepairs,
  } = params;

  // Ownership cost per hour
  const annualDepreciation = purchasePrice / usefulLifeYears;
  const totalAnnualOwnershipCost = annualDepreciation + annualFinanceCost + annualInsurance + annualRegistration;
  const ownershipCostPerHour = totalAnnualOwnershipCost / annualHours;

  // Operating cost per hour
  const fuelCostPerHour = fuelGallonsPerHour * fuelPricePerGallon;
  const maintenancePerHour = annualMaintenance / annualHours;
  const repairsPerHour = annualRepairs / annualHours;
  const operatingCostPerHour = fuelCostPerHour + maintenancePerHour + repairsPerHour;

  // Total cost per hour
  const totalCostPerHour = ownershipCostPerHour + operatingCostPerHour;

  return {
    ownershipCostPerHour,
    operatingCostPerHour,
    totalCostPerHour,
    breakdown: {
      depreciation: annualDepreciation / annualHours,
      finance: annualFinanceCost / annualHours,
      insurance: annualInsurance / annualHours,
      registration: annualRegistration / annualHours,
      fuel: fuelCostPerHour,
      maintenance: maintenancePerHour,
      repairs: repairsPerHour,
    },
  };
}

// ============================================================================
// STEP 2: EMPLOYEE TRUE LABOR COST
// ============================================================================

export interface EmployeeCostParams {
  baseHourlyRate: number;
  burdenMultiplier: number; // 1.6 - 2.0 based on position
}

export interface EmployeeCostResult {
  baseHourlyRate: number;
  burdenMultiplier: number;
  trueCostPerHour: number;
}

export function calculateEmployeeCost(params: EmployeeCostParams): EmployeeCostResult {
  const { baseHourlyRate, burdenMultiplier } = params;
  const trueCostPerHour = baseHourlyRate * burdenMultiplier;

  return {
    baseHourlyRate,
    burdenMultiplier,
    trueCostPerHour,
  };
}

// Standard burden multipliers from CLAUDE.md
export const BURDEN_MULTIPLIERS = {
  ENTRY_GROUND_CREW: 1.6,
  EXPERIENCED_CLIMBER: 1.7,
  CREW_LEADER: 1.8,
  CERTIFIED_ARBORIST: 1.9,
  SPECIALIZED_OPERATOR: 2.0,
} as const;

// ============================================================================
// STEP 3: LOADOUT COST (Equipment + Labor)
// ============================================================================

export interface LoadoutCostParams {
  equipmentCosts: number[]; // Array of equipment hourly costs
  laborCosts: EmployeeCostResult[]; // Array of employee costs
}

export interface LoadoutCostResult {
  totalEquipmentCostPerHour: number;
  totalLaborCostPerHour: number;
  totalLoadoutCostPerHour: number;
  equipmentBreakdown: number[];
  laborBreakdown: EmployeeCostResult[];
}

export function calculateLoadoutCost(params: LoadoutCostParams): LoadoutCostResult {
  const { equipmentCosts, laborCosts } = params;

  const totalEquipmentCostPerHour = equipmentCosts.reduce((sum, cost) => sum + cost, 0);
  const totalLaborCostPerHour = laborCosts.reduce((sum, emp) => sum + emp.trueCostPerHour, 0);
  const totalLoadoutCostPerHour = totalEquipmentCostPerHour + totalLaborCostPerHour;

  return {
    totalEquipmentCostPerHour,
    totalLaborCostPerHour,
    totalLoadoutCostPerHour,
    equipmentBreakdown: equipmentCosts,
    laborBreakdown: laborCosts,
  };
}

// ============================================================================
// STEP 4: PROFIT MARGIN TO BILLING RATE
// ============================================================================

export interface BillingRateParams {
  loadoutCostPerHour: number;
  targetMarginPercent: number; // 0.3 = 30%, 0.5 = 50%, etc.
}

export interface BillingRateResult {
  loadoutCostPerHour: number;
  targetMarginPercent: number;
  billingRatePerHour: number;
  profitPerHour: number;
  actualMargin: number;
}

export function calculateBillingRate(params: BillingRateParams): BillingRateResult {
  const { loadoutCostPerHour, targetMarginPercent } = params;

  // Formula: Billing Rate = Cost ÷ (1 - Margin%)
  const billingRatePerHour = loadoutCostPerHour / (1 - targetMarginPercent);
  const profitPerHour = billingRatePerHour - loadoutCostPerHour;
  const actualMargin = profitPerHour / billingRatePerHour;

  return {
    loadoutCostPerHour,
    targetMarginPercent,
    billingRatePerHour,
    profitPerHour,
    actualMargin,
  };
}

// ============================================================================
// STEP 5: SERVICE-SPECIFIC CALCULATIONS
// ============================================================================

// Forestry Mulching
export interface MulchingParams {
  acres: number;
  dbhPackage: number; // 4, 6, or 8 inches
  productionRate: number; // IA/hour (default 1.3 for Cat 265)
  difficultyMultiplier?: number; // Optional adjustment (default 1.0)
}

export interface MulchingResult {
  baseInchAcres: number;
  adjustedInchAcres: number;
  productionHours: number;
}

export function calculateMulchingWork(params: MulchingParams): MulchingResult {
  const { acres, dbhPackage, productionRate, difficultyMultiplier = 1.0 } = params;

  const baseInchAcres = dbhPackage * acres;
  const adjustedInchAcres = baseInchAcres * difficultyMultiplier;
  const productionHours = adjustedInchAcres / productionRate;

  return {
    baseInchAcres,
    adjustedInchAcres,
    productionHours,
  };
}

// Stump Grinding
export interface StumpParams {
  diameter: number; // inches
  heightAbove: number; // feet
  depthBelow: number; // feet
  modifiers: {
    largeRootFlare?: boolean; // +20%
    hardwood?: boolean; // +15%
    rotten?: boolean; // -15%
  };
}

export interface StumpGrindingParams {
  stumps: StumpParams[];
  productionRate: number; // StumpScore/hour (default 400)
}

export interface StumpGrindingResult {
  totalStumpScore: number;
  stumpBreakdown: Array<{
    baseScore: number;
    modifiedScore: number;
    modifiers: number;
  }>;
  productionHours: number;
}

export function calculateStumpGrinding(params: StumpGrindingParams): StumpGrindingResult {
  const { stumps, productionRate } = params;

  const stumpBreakdown = stumps.map(stump => {
    const baseScore = Math.pow(stump.diameter, 2) * (stump.heightAbove + stump.depthBelow);

    let modifierValue = 1.0;
    if (stump.modifiers.largeRootFlare) modifierValue *= 1.2;
    if (stump.modifiers.hardwood) modifierValue *= 1.15;
    if (stump.modifiers.rotten) modifierValue *= 0.85;

    const modifiedScore = baseScore * modifierValue;

    return {
      baseScore,
      modifiedScore,
      modifiers: modifierValue,
    };
  });

  const totalStumpScore = stumpBreakdown.reduce((sum, s) => sum + s.modifiedScore, 0);
  const productionHours = totalStumpScore / productionRate;

  return {
    totalStumpScore,
    stumpBreakdown,
    productionHours,
  };
}

// Land Clearing
export interface LandClearingParams {
  projectType: 'standard-lot' | 'large-lot' | 'multi-lot' | 'custom';
  clearingIntensity: 'light' | 'standard' | 'heavy';
  customDays?: number; // For custom projects
}

export interface LandClearingResult {
  estimatedDays: number;
  productionHours: number;
}

export function calculateLandClearing(params: LandClearingParams): LandClearingResult {
  const { projectType, clearingIntensity, customDays } = params;

  let estimatedDays = 0;

  if (projectType === 'custom' && customDays) {
    estimatedDays = customDays;
  } else {
    // Base estimates from CLAUDE.md
    if (projectType === 'standard-lot') {
      if (clearingIntensity === 'light') estimatedDays = 1;
      else if (clearingIntensity === 'standard') estimatedDays = 1.5;
      else estimatedDays = 2;
    } else if (projectType === 'large-lot') {
      if (clearingIntensity === 'light') estimatedDays = 1.5;
      else if (clearingIntensity === 'standard') estimatedDays = 2;
      else estimatedDays = 2.5;
    } else if (projectType === 'multi-lot') {
      estimatedDays = 3; // Minimum
    }
  }

  const productionHours = estimatedDays * 8; // 8-hour workdays

  return {
    estimatedDays,
    productionHours,
  };
}

// ============================================================================
// STEP 6: COMPLETE PROJECT PRICING
// ============================================================================

export interface ProjectPricingParams {
  // Service-specific work calculation
  serviceType: 'mulching' | 'stumps' | 'clearing';
  productionHours: number;

  // Loadout costs
  loadoutCostPerHour: number;
  billingRatePerHour: number;

  // Transport
  transportHours: number;
  transportRate?: number; // Default 0.5 (50% of loadout cost)

  // Buffer
  bufferPercent?: number; // Default 0.1 (10%)
}

export interface ProjectPricingResult {
  // Hours breakdown
  productionHours: number;
  transportHours: number;
  bufferHours: number;
  totalHours: number;

  // Financial breakdown
  totalCost: number;
  totalPrice: number;
  totalProfit: number;
  profitMargin: number;

  // Detailed breakdown
  breakdown: {
    production: { hours: number; cost: number; revenue: number };
    transport: { hours: number; cost: number; revenue: number };
    buffer: { hours: number; cost: number; revenue: number };
  };
}

export function calculateProjectPricing(params: ProjectPricingParams): ProjectPricingResult {
  const {
    productionHours,
    loadoutCostPerHour,
    billingRatePerHour,
    transportHours,
    transportRate = 0.5,
    bufferPercent = 0.1,
  } = params;

  // Apply transport rate
  const adjustedTransportHours = transportHours * transportRate;

  // Calculate buffer
  const bufferHours = (productionHours + adjustedTransportHours) * bufferPercent;

  // Total hours
  const totalHours = productionHours + adjustedTransportHours + bufferHours;

  // Financial calculations
  const totalCost = totalHours * loadoutCostPerHour;
  const totalPrice = totalHours * billingRatePerHour;
  const totalProfit = totalPrice - totalCost;
  const profitMargin = totalProfit / totalPrice;

  return {
    productionHours,
    transportHours: adjustedTransportHours,
    bufferHours,
    totalHours,
    totalCost,
    totalPrice,
    totalProfit,
    profitMargin,
    breakdown: {
      production: {
        hours: productionHours,
        cost: productionHours * loadoutCostPerHour,
        revenue: productionHours * billingRatePerHour,
      },
      transport: {
        hours: adjustedTransportHours,
        cost: adjustedTransportHours * loadoutCostPerHour,
        revenue: adjustedTransportHours * billingRatePerHour,
      },
      buffer: {
        hours: bufferHours,
        cost: bufferHours * loadoutCostPerHour,
        revenue: bufferHours * billingRatePerHour,
      },
    },
  };
}

// ============================================================================
// PRODUCTION RATES (from CLAUDE.md)
// ============================================================================

export const PRODUCTION_RATES = {
  // Forestry Mulching
  CAT_265: 1.3, // IA/hour
  SUPERTRAK_SK200TR: 5.0, // IA/hour

  // Stump Grinding
  STUMP_GRINDER: 400, // StumpScore/hour
} as const;

// ============================================================================
// MARGIN PRESETS (from CLAUDE.md)
// ============================================================================

export const MARGIN_PRESETS = {
  LOW: 0.3, // 30%
  MODERATE: 0.4, // 40%
  STANDARD: 0.5, // 50%
  HIGH: 0.6, // 60%
  PREMIUM: 0.7, // 70%
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(2)} hrs`;
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
