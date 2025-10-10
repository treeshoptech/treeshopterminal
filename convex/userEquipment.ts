/**
 * User Equipment Management
 * CRUD operations for equipment inventory
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all equipment for an organization
 */
export const list = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipment")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect();
  },
});

/**
 * Get a single equipment item
 */
export const get = query({
  args: {
    id: v.id("equipment"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get equipment by category
 */
export const listByCategory = query({
  args: {
    organizationId: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipment")
      .withIndex("by_category", (q) =>
        q.eq("category", args.category).eq("organizationId", args.organizationId)
      )
      .order("desc")
      .collect();
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create new equipment
 */
export const create = mutation({
  args: {
    organizationId: v.string(),
    equipmentName: v.string(),
    category: v.optional(v.string()),

    // Ownership Costs
    purchasePrice: v.number(),
    usefulLifeYears: v.number(),
    annualFinanceCost: v.number(),
    annualInsurance: v.number(),
    annualRegistration: v.number(),
    annualHours: v.number(),

    // Operating Costs
    fuelGallonsPerHour: v.number(),
    fuelPricePerGallon: v.number(),
    annualMaintenance: v.number(),
    annualRepairs: v.number(),

    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Calculate costs using the pricing formulas
    const annualDepreciation = args.purchasePrice / args.usefulLifeYears;
    const totalAnnualOwnershipCost =
      annualDepreciation +
      args.annualFinanceCost +
      args.annualInsurance +
      args.annualRegistration;
    const ownershipCostPerHour = totalAnnualOwnershipCost / args.annualHours;

    const fuelCostPerHour = args.fuelGallonsPerHour * args.fuelPricePerGallon;
    const maintenancePerHour = args.annualMaintenance / args.annualHours;
    const repairsPerHour = args.annualRepairs / args.annualHours;
    const operatingCostPerHour = fuelCostPerHour + maintenancePerHour + repairsPerHour;

    const totalCostPerHour = ownershipCostPerHour + operatingCostPerHour;

    const now = Date.now();

    return await ctx.db.insert("equipment", {
      organizationId: args.organizationId,
      equipmentName: args.equipmentName,
      category: args.category,

      purchasePrice: args.purchasePrice,
      usefulLifeYears: args.usefulLifeYears,
      annualFinanceCost: args.annualFinanceCost,
      annualInsurance: args.annualInsurance,
      annualRegistration: args.annualRegistration,
      annualHours: args.annualHours,

      fuelGallonsPerHour: args.fuelGallonsPerHour,
      fuelPricePerGallon: args.fuelPricePerGallon,
      annualMaintenance: args.annualMaintenance,
      annualRepairs: args.annualRepairs,

      ownershipCostPerHour,
      operatingCostPerHour,
      totalCostPerHour,

      notes: args.notes,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update equipment
 */
export const update = mutation({
  args: {
    id: v.id("userEquipment"),
    equipmentName: v.optional(v.string()),
    category: v.optional(v.string()),

    // Ownership Costs
    purchasePrice: v.optional(v.number()),
    usefulLifeYears: v.optional(v.number()),
    annualFinanceCost: v.optional(v.number()),
    annualInsurance: v.optional(v.number()),
    annualRegistration: v.optional(v.number()),
    annualHours: v.optional(v.number()),

    // Operating Costs
    fuelGallonsPerHour: v.optional(v.number()),
    fuelPricePerGallon: v.optional(v.number()),
    annualMaintenance: v.optional(v.number()),
    annualRepairs: v.optional(v.number()),

    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Equipment not found");
    }

    // Merge with existing values
    const updatedData = {
      equipmentName: args.equipmentName ?? existing.equipmentName,
      category: args.category ?? existing.category,
      purchasePrice: args.purchasePrice ?? existing.purchasePrice,
      usefulLifeYears: args.usefulLifeYears ?? existing.usefulLifeYears,
      annualFinanceCost: args.annualFinanceCost ?? existing.annualFinanceCost,
      annualInsurance: args.annualInsurance ?? existing.annualInsurance,
      annualRegistration: args.annualRegistration ?? existing.annualRegistration,
      annualHours: args.annualHours ?? existing.annualHours,
      fuelGallonsPerHour: args.fuelGallonsPerHour ?? existing.fuelGallonsPerHour,
      fuelPricePerGallon: args.fuelPricePerGallon ?? existing.fuelPricePerGallon,
      annualMaintenance: args.annualMaintenance ?? existing.annualMaintenance,
      annualRepairs: args.annualRepairs ?? existing.annualRepairs,
      notes: args.notes ?? existing.notes,
    };

    // Recalculate costs
    const annualDepreciation = updatedData.purchasePrice / updatedData.usefulLifeYears;
    const totalAnnualOwnershipCost =
      annualDepreciation +
      updatedData.annualFinanceCost +
      updatedData.annualInsurance +
      updatedData.annualRegistration;
    const ownershipCostPerHour = totalAnnualOwnershipCost / updatedData.annualHours;

    const fuelCostPerHour = updatedData.fuelGallonsPerHour * updatedData.fuelPricePerGallon;
    const maintenancePerHour = updatedData.annualMaintenance / updatedData.annualHours;
    const repairsPerHour = updatedData.annualRepairs / updatedData.annualHours;
    const operatingCostPerHour = fuelCostPerHour + maintenancePerHour + repairsPerHour;

    const totalCostPerHour = ownershipCostPerHour + operatingCostPerHour;

    await ctx.db.patch(args.id, {
      ...updatedData,
      ownershipCostPerHour,
      operatingCostPerHour,
      totalCostPerHour,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Delete equipment
 */
export const remove = mutation({
  args: {
    id: v.id("userEquipment"),
  },
  handler: async (ctx, args) => {
    // Check if equipment is used in any loadouts
    const loadouts = await ctx.db
      .query("userLoadouts")
      .filter((q) => q.eq(q.field("equipmentIds"), args.id))
      .collect();

    if (loadouts.length > 0) {
      throw new Error(
        `Cannot delete equipment. It is used in ${loadouts.length} loadout(s). Remove it from loadouts first.`
      );
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Duplicate equipment (for quick setup)
 */
export const duplicate = mutation({
  args: {
    id: v.id("userEquipment"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Equipment not found");
    }

    const now = Date.now();

    return await ctx.db.insert("userEquipment", {
      ...existing,
      equipmentName: args.newName,
      createdAt: now,
      updatedAt: now,
    });
  },
});
