/**
 * User Loadout Management
 * CRUD operations for loadout configurations
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all loadouts for a user
 */
export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const loadouts = await ctx.db
      .query("userLoadouts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    // Fetch equipment details for each loadout
    const loadoutsWithEquipment = await Promise.all(
      loadouts.map(async (loadout) => {
        const equipment = await Promise.all(
          loadout.equipmentIds.map((id) => ctx.db.get(id))
        );

        return {
          ...loadout,
          equipmentDetails: equipment.filter((e) => e !== null),
        };
      })
    );

    return loadoutsWithEquipment;
  },
});

/**
 * Get a single loadout with equipment details
 */
export const get = query({
  args: {
    id: v.id("userLoadouts"),
  },
  handler: async (ctx, args) => {
    const loadout = await ctx.db.get(args.id);
    if (!loadout) return null;

    // Fetch equipment details
    const equipment = await Promise.all(
      loadout.equipmentIds.map((id) => ctx.db.get(id))
    );

    return {
      ...loadout,
      equipmentDetails: equipment.filter((e) => e !== null),
    };
  },
});

/**
 * Get loadouts by service type
 */
export const listByServiceType = query({
  args: {
    userId: v.string(),
    serviceType: v.string(),
  },
  handler: async (ctx, args) => {
    const loadouts = await ctx.db
      .query("userLoadouts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("serviceType"), args.serviceType))
      .order("desc")
      .collect();

    // Fetch equipment details for each loadout
    const loadoutsWithEquipment = await Promise.all(
      loadouts.map(async (loadout) => {
        const equipment = await Promise.all(
          loadout.equipmentIds.map((id) => ctx.db.get(id))
        );

        return {
          ...loadout,
          equipmentDetails: equipment.filter((e) => e !== null),
        };
      })
    );

    return loadoutsWithEquipment;
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create new loadout
 */
export const create = mutation({
  args: {
    userId: v.string(),
    loadoutName: v.string(),
    serviceType: v.optional(v.string()),

    // Equipment Selection
    equipmentIds: v.array(v.id("userEquipment")),

    // Labor
    employees: v.array(
      v.object({
        position: v.string(),
        baseWage: v.number(),
        multiplier: v.number(),
        trueCost: v.number(),
      })
    ),

    // Production Rates
    productionRate: v.optional(v.number()),
    productionUnit: v.optional(v.string()),

    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Fetch equipment to calculate total cost
    const equipment = await Promise.all(
      args.equipmentIds.map((id) => ctx.db.get(id))
    );

    const totalEquipmentCost = equipment.reduce(
      (sum, eq) => sum + (eq?.totalCostPerHour || 0),
      0
    );

    const totalLaborCost = args.employees.reduce((sum, emp) => sum + emp.trueCost, 0);

    const totalLoadoutCost = totalEquipmentCost + totalLaborCost;

    const now = Date.now();

    return await ctx.db.insert("userLoadouts", {
      userId: args.userId,
      loadoutName: args.loadoutName,
      serviceType: args.serviceType,

      equipmentIds: args.equipmentIds,
      employees: args.employees,

      totalEquipmentCost,
      totalLaborCost,
      totalLoadoutCost,

      productionRate: args.productionRate,
      productionUnit: args.productionUnit,

      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update loadout
 */
export const update = mutation({
  args: {
    id: v.id("userLoadouts"),
    loadoutName: v.optional(v.string()),
    serviceType: v.optional(v.string()),

    // Equipment Selection
    equipmentIds: v.optional(v.array(v.id("userEquipment"))),

    // Labor
    employees: v.optional(
      v.array(
        v.object({
          position: v.string(),
          baseWage: v.number(),
          multiplier: v.number(),
          trueCost: v.number(),
        })
      )
    ),

    // Production Rates
    productionRate: v.optional(v.number()),
    productionUnit: v.optional(v.string()),

    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Loadout not found");
    }

    // Merge with existing values
    const updatedEquipmentIds = args.equipmentIds ?? existing.equipmentIds;
    const updatedEmployees = args.employees ?? existing.employees;

    // Recalculate costs
    const equipment = await Promise.all(
      updatedEquipmentIds.map((id) => ctx.db.get(id))
    );

    const totalEquipmentCost = equipment.reduce(
      (sum, eq) => sum + (eq?.totalCostPerHour || 0),
      0
    );

    const totalLaborCost = updatedEmployees.reduce((sum, emp) => sum + emp.trueCost, 0);

    const totalLoadoutCost = totalEquipmentCost + totalLaborCost;

    await ctx.db.patch(args.id, {
      loadoutName: args.loadoutName ?? existing.loadoutName,
      serviceType: args.serviceType ?? existing.serviceType,
      equipmentIds: updatedEquipmentIds,
      employees: updatedEmployees,
      totalEquipmentCost,
      totalLaborCost,
      totalLoadoutCost,
      productionRate: args.productionRate ?? existing.productionRate,
      productionUnit: args.productionUnit ?? existing.productionUnit,
      notes: args.notes ?? existing.notes,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Delete loadout
 */
export const remove = mutation({
  args: {
    id: v.id("userLoadouts"),
  },
  handler: async (ctx, args) => {
    // Check if loadout is used in any projects
    const projects = await ctx.db
      .query("userProjects")
      .filter((q) => q.eq(q.field("loadoutId"), args.id))
      .collect();

    if (projects.length > 0) {
      throw new Error(
        `Cannot delete loadout. It is used in ${projects.length} project(s).`
      );
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Duplicate loadout
 */
export const duplicate = mutation({
  args: {
    id: v.id("userLoadouts"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Loadout not found");
    }

    const now = Date.now();

    return await ctx.db.insert("userLoadouts", {
      ...existing,
      loadoutName: args.newName,
      createdAt: now,
      updatedAt: now,
    });
  },
});
