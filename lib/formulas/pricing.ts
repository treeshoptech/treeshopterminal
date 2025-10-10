/**
 * TreeShopTerminal Pricing Formulas
 *
 * The legendary formulas - transparent, auditable, deterministic
 * Every calculation shows its work.
 */

// ============================================
// TYPES
// ============================================

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

export interface EmployeeCostParams {
  baseHourlyRate: number;
  annualHours?: number;
  burdenMultiplier?: number;
}

export interface EmployeeCostResult {
  trueCostPerHour: number;
  annualBaseCost: number;
  annualBurdenCost: number;
  annualTrueCost: number;
  burdenMultiplier: number;
}

export interface LoadoutCostParams {
  equipment: EquipmentCostParams[];
  employees: EmployeeCostParams[];
}

export interface LoadoutCostResult {
  totalEquipmentCostPerHour: number;
  totalLaborCostPerHour: number;
  totalLoadoutCostPerHour: number;
  equipmentBreakdown: EquipmentCostResult[];
  laborBreakdown: EmployeeCostResult[];
}

export interface BillingRateResult {
  loadoutCostPerHour: number;
  targetMarginPercent: number;
  billingRatePerHour: number;
  profitPerHour: number;
  actualMargin: number;
}

export interface ProjectPricingParams {
  serviceType: 'forestry_mulching' | 'stump_grinding' | 'land_clearing';
  projectSize: any; // Service-specific
  loadout: LoadoutCostParams;
  targetMargin: number;
  companyLocation: { lat: number; lng: number };
  jobSiteLocation: { lat: number; lng: number };
  transportRate?: number;
  bufferPercent?: number;
}

export interface ProjectPricingResult {
  productionHours: number;
  transportHours: number;
  bufferHours: number;
  totalHours: number;
  loadoutCostPerHour: number;
  billingRatePerHour: number;
  totalCost: number;
  totalPrice: number;
  totalProfit: number;
  profitMargin: number;
  distanceMiles?: number;
  oneWayMinutes?: number;
  breakdown: {
    equipment: EquipmentCostResult[];
    labor: EmployeeCostResult[];
    production: {
      hours: number;
      cost: number;
      revenue: number;
    };
    transport: {
      hours: number;
      cost: number;
      revenue: number;
    };
    buffer: {
      hours: number;
      cost: number;
      revenue: number;
    };
  };
}

// ============================================
// FORMULA 1: EQUIPMENT HOURLY COST
// ============================================

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

  // Ownership costs
  const annualDepreciation = purchasePrice / usefulLifeYears;
  const totalAnnualOwnershipCost =
    annualDepreciation +
    annualFinanceCost +
    annualInsurance +
    annualRegistration;

  const ownershipCostPerHour = totalAnnualOwnershipCost / annualHours;

  // Operating costs
  const fuelCostPerHour = fuelGallonsPerHour * fuelPricePerGallon;
  const maintenancePerHour = annualMaintenance / annualHours;
  const repairsPerHour = annualRepairs / annualHours;
  const operatingCostPerHour = fuelCostPerHour + maintenancePerHour + repairsPerHour;

  // Total
  const totalCostPerHour = ownershipCostPerHour + operatingCostPerHour;

  return {
    ownershipCostPerHour: Number(ownershipCostPerHour.toFixed(2)),
    operatingCostPerHour: Number(operatingCostPerHour.toFixed(2)),
    totalCostPerHour: Number(totalCostPerHour.toFixed(2)),
    breakdown: {
      depreciation: Number((annualDepreciation / annualHours).toFixed(2)),
      finance: Number((annualFinanceCost / annualHours).toFixed(2)),
      insurance: Number((annualInsurance / annualHours).toFixed(2)),
      registration: Number((annualRegistration / annualHours).toFixed(2)),
      fuel: Number(fuelCostPerHour.toFixed(2)),
      maintenance: Number(maintenancePerHour.toFixed(2)),
      repairs: Number(repairsPerHour.toFixed(2)),
    },
  };
}

// ============================================
// FORMULA 2: EMPLOYEE TRUE COST
// ============================================

export function calculateEmployeeCost(params: EmployeeCostParams): EmployeeCostResult {
  const {
    baseHourlyRate,
    annualHours = 2080,
    burdenMultiplier = 1.7,
  } = params;

  const trueCostPerHour = baseHourlyRate * burdenMultiplier;
  const annualBaseCost = baseHourlyRate * annualHours;
  const annualTrueCost = trueCostPerHour * annualHours;
  const annualBurdenCost = annualTrueCost - annualBaseCost;

  return {
    trueCostPerHour: Number(trueCostPerHour.toFixed(2)),
    annualBaseCost: Number(annualBaseCost.toFixed(2)),
    annualBurdenCost: Number(annualBurdenCost.toFixed(2)),
    annualTrueCost: Number(annualTrueCost.toFixed(2)),
    burdenMultiplier,
  };
}

// ============================================
// FORMULA 3: LOADOUT COST
// ============================================

export function calculateLoadoutCost(params: LoadoutCostParams): LoadoutCostResult {
  const { equipment, employees } = params;

  // Calculate equipment costs
  const equipmentCosts = equipment.map(e => calculateEquipmentCost(e));
  const totalEquipmentCostPerHour = equipmentCosts.reduce(
    (sum, e) => sum + e.totalCostPerHour,
    0
  );

  // Calculate labor costs
  const laborCosts = employees.map(e => calculateEmployeeCost(e));
  const totalLaborCostPerHour = laborCosts.reduce(
    (sum, e) => sum + e.trueCostPerHour,
    0
  );

  // Total loadout cost
  const totalLoadoutCostPerHour = totalEquipmentCostPerHour + totalLaborCostPerHour;

  return {
    totalEquipmentCostPerHour: Number(totalEquipmentCostPerHour.toFixed(2)),
    totalLaborCostPerHour: Number(totalLaborCostPerHour.toFixed(2)),
    totalLoadoutCostPerHour: Number(totalLoadoutCostPerHour.toFixed(2)),
    equipmentBreakdown: equipmentCosts,
    laborBreakdown: laborCosts,
  };
}

// ============================================
// FORMULA 4: PROFIT MARGIN TO BILLING RATE
// ============================================

export function calculateBillingRate(
  loadoutCostPerHour: number,
  targetMarginPercent: number
): BillingRateResult {
  // Formula: Billing Rate = Cost / (1 - Margin%)
  const billingRatePerHour = loadoutCostPerHour / (1 - targetMarginPercent);
  const profitPerHour = billingRatePerHour - loadoutCostPerHour;
  const actualMargin = profitPerHour / billingRatePerHour;

  return {
    loadoutCostPerHour: Number(loadoutCostPerHour.toFixed(2)),
    targetMarginPercent,
    billingRatePerHour: Number(billingRatePerHour.toFixed(2)),
    profitPerHour: Number(profitPerHour.toFixed(2)),
    actualMargin: Number(actualMargin.toFixed(4)),
  };
}

// ============================================
// FORMULA 5: INCH-ACRES CALCULATION
// ============================================

export function calculateInchAcres(acres: number, dbh: number): number {
  return acres * dbh;
}

// ============================================
// FORMULA 6: STUMP SCORE CALCULATION
// ============================================

export interface StumpParams {
  diameter: number;              // inches
  heightAbove: number;          // feet
  depthBelow: number;           // feet
  modifiers?: {
    largeRootFlare?: boolean;   // +20%
    hardwood?: boolean;          // +15%
    rotten?: boolean;            // -15%
  };
}

export function calculateStumpScore(stump: StumpParams): number {
  const baseScore = Math.pow(stump.diameter, 2) * (stump.heightAbove + stump.depthBelow);

  let modifiedScore = baseScore;

  if (stump.modifiers) {
    if (stump.modifiers.largeRootFlare) modifiedScore *= 1.2;
    if (stump.modifiers.hardwood) modifiedScore *= 1.15;
    if (stump.modifiers.rotten) modifiedScore *= 0.85;
  }

  return Number(modifiedScore.toFixed(2));
}

// ============================================
// CONSTANTS
// ============================================

export const PRODUCTION_RATES = {
  CAT_265_MULCHER: 1.3,        // IA per hour
  SK200TR_MULCHER: 5.0,        // IA per hour
  STUMP_GRINDER: 400,          // StumpScore per hour
  LAND_CLEARING_PER_DAY: 8,    // hours per day
} as const;

export const BURDEN_MULTIPLIERS = {
  ENTRY_GROUND_CREW: 1.6,
  EXPERIENCED_CLIMBER: 1.7,
  CREW_LEADER: 1.8,
  CERTIFIED_ARBORIST: 1.9,
  SPECIALIZED_OPERATOR: 2.0,
} as const;

export const DEFAULT_SETTINGS = {
  PROFIT_MARGIN: 0.5,          // 50%
  TRANSPORT_RATE: 0.5,         // 50% of loadout cost
  BUFFER_PERCENT: 0.1,         // 10%
  BURDEN_MULTIPLIER: 1.7,      // Standard
} as const;
