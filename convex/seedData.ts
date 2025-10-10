import { mutation } from './_generated/server';

export const seedAll = mutation({
  handler: async (ctx) => {
    const orgId = 'org_mock123';
    const now = Date.now();

    // Create equipment
    const cat265 = await ctx.db.insert('equipment', {
      organizationId: orgId,
      equipmentName: 'Cat 265 Forestry Mulcher',
      category: 'mulcher',
      purchasePrice: 65000,
      usefulLifeYears: 5,
      salvageValue: 0,
      annualFinanceCost: 3250,
      annualInsurance: 3000,
      annualRegistration: 600,
      annualHours: 2000,
      fuelType: 'diesel',
      fuelGallonsPerHour: 6,
      fuelPricePerGallon: 3.75,
      annualMaintenance: 8500,
      annualRepairs: 3500,
      ownershipCostPerHour: 9.93,
      operatingCostPerHour: 28.50,
      totalCostPerHour: 38.43,
      make: 'Caterpillar',
      model: '265',
      year: 2020,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    const f450 = await ctx.db.insert('equipment', {
      organizationId: orgId,
      equipmentName: 'Ford F450 Truck',
      category: 'truck',
      purchasePrice: 65000,
      usefulLifeYears: 5,
      salvageValue: 0,
      annualFinanceCost: 3250,
      annualInsurance: 3000,
      annualRegistration: 600,
      annualHours: 2000,
      fuelType: 'diesel',
      fuelGallonsPerHour: 6,
      fuelPricePerGallon: 3.75,
      annualMaintenance: 8500,
      annualRepairs: 3500,
      ownershipCostPerHour: 9.93,
      operatingCostPerHour: 28.50,
      totalCostPerHour: 38.43,
      make: 'Ford',
      model: 'F450',
      year: 2019,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    // Create employees
    const emp1 = await ctx.db.insert('employees', {
      organizationId: orgId,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@treeshop.com',
      phone: '(555) 123-4567',
      position: 'Operator',
      department: 'field_operations',
      employeeId: 'EMP001',
      hireDate: now - 365 * 24 * 60 * 60 * 1000,
      baseHourlyRate: 35,
      payType: 'hourly',
      burdenMultiplier: 1.7,
      trueCostPerHour: 59.50,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    const emp2 = await ctx.db.insert('employees', {
      organizationId: orgId,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike@treeshop.com',
      phone: '(555) 987-6543',
      position: 'Ground Crew',
      department: 'field_operations',
      employeeId: 'EMP002',
      hireDate: now - 180 * 24 * 60 * 60 * 1000,
      baseHourlyRate: 30,
      payType: 'hourly',
      burdenMultiplier: 1.6,
      trueCostPerHour: 48,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    // Create loadout
    await ctx.db.insert('loadouts', {
      organizationId: orgId,
      loadoutName: 'Cat 265 Standard Crew',
      serviceType: 'mulching',
      equipmentIds: [cat265, f450],
      crewSize: 2,
      employees: [
        { position: 'Operator', baseWage: 35, burdenMultiplier: 1.7, trueCostPerHour: 59.50 },
        { position: 'Ground Crew', baseWage: 30, burdenMultiplier: 1.6, trueCostPerHour: 48 },
      ],
      totalEquipmentCostPerHour: 76.93,
      totalLaborCostPerHour: 107.50,
      totalLoadoutCostPerHour: 184.43,
      productionRate: 1.3,
      productionUnit: 'ia_per_hour',
      isActive: true,
      isDefault: true,
      createdAt: now,
      updatedAt: now,
    });

    // Create customer
    const customer = await ctx.db.insert('customers', {
      organizationId: orgId,
      name: 'Smith Property Management',
      email: 'contact@smithproperties.com',
      phone: '(555) 444-5555',
      address: '123 Oak Street',
      city: 'Orlando',
      state: 'FL',
      zipCode: '32801',
      coordinates: { lat: 28.5383, lng: -81.3792 },
      customerType: 'commercial',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    return { success: true };
  },
});
