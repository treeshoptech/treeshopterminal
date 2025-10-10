/**
 * Project Pricing Calculations
 * Server-side pricing engine using Convex
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================================
// PROJECT PRICING CALCULATIONS
// ============================================================================

/**
 * Calculate complete project pricing
 * This combines loadout costs, service-specific work calculations,
 * transport time, and applies profit margins
 */
export const calculateProject = mutation({
  args: {
    userId: v.string(),

    // Project basics
    projectName: v.string(),
    serviceType: v.string(), // 'mulching', 'stumps', 'clearing'

    // Loadout
    loadoutId: v.id("userLoadouts"),

    // Location
    jobSiteAddress: v.string(),

    // Service-specific params
    serviceParams: v.any(), // Different for each service type

    // Pricing params
    profitMargin: v.number(), // 0.5 = 50%
    transportRate: v.optional(v.number()), // Default 0.5
    bufferPercent: v.optional(v.number()), // Default 0.1
  },
  handler: async (ctx, args) => {
    // Get loadout
    const loadout = await ctx.db.get(args.loadoutId);
    if (!loadout) {
      throw new Error("Loadout not found");
    }

    const loadoutCostPerHour = loadout.totalLoadoutCost;
    const billingRatePerHour = loadoutCostPerHour / (1 - args.profitMargin);

    // Calculate transport time (placeholder - would call Google Maps API in real implementation)
    // For now, using a simple estimate
    const transportHours = 1.0; // This would come from Google Maps Distance Matrix API

    // Calculate production hours based on service type
    let productionHours = 0;

    switch (args.serviceType) {
      case 'mulching':
        const mulchingParams = args.serviceParams as {
          acres: number;
          dbhPackage: number;
          difficultyMultiplier?: number;
        };
        const inchAcres = mulchingParams.acres * mulchingParams.dbhPackage;
        const adjustedIA = inchAcres * (mulchingParams.difficultyMultiplier || 1.0);
        const productionRate = loadout.productionRate || 1.3;
        productionHours = adjustedIA / productionRate;
        break;

      case 'stumps':
        const stumpParams = args.serviceParams as {
          stumps: Array<{
            diameter: number;
            heightAbove: number;
            depthBelow: number;
            modifiers: number;
          }>;
        };
        const totalStumpScore = stumpParams.stumps.reduce((sum, stump) => {
          const baseScore = Math.pow(stump.diameter, 2) * (stump.heightAbove + stump.depthBelow);
          return sum + (baseScore * stump.modifiers);
        }, 0);
        const stumpProductionRate = loadout.productionRate || 400;
        productionHours = totalStumpScore / stumpProductionRate;
        break;

      case 'clearing':
        const clearingParams = args.serviceParams as {
          estimatedDays: number;
        };
        productionHours = clearingParams.estimatedDays * 8; // 8-hour days
        break;
    }

    // Apply transport rate and buffer
    const transportRate = args.transportRate || 0.5;
    const bufferPercent = args.bufferPercent || 0.1;

    const adjustedTransportHours = transportHours * transportRate;
    const bufferHours = (productionHours + adjustedTransportHours) * bufferPercent;
    const totalHours = productionHours + adjustedTransportHours + bufferHours;

    // Calculate financials
    const totalCost = totalHours * loadoutCostPerHour;
    const totalPrice = totalHours * billingRatePerHour;
    const totalProfit = totalPrice - totalCost;
    const actualMargin = totalProfit / totalPrice;

    // Save project
    const now = Date.now();
    const projectId = await ctx.db.insert("userProjects", {
      userId: args.userId,
      projectName: args.projectName,
      serviceType: args.serviceType,

      address: args.jobSiteAddress,

      projectSize: 0, // Would be calculated based on service type

      loadoutId: args.loadoutId,
      loadoutCost: loadoutCostPerHour,
      profitMargin: args.profitMargin,
      billingRate: billingRatePerHour,

      workHours: productionHours,
      transportHours: adjustedTransportHours,
      bufferHours,
      totalHours,

      totalCost,
      totalPrice,
      totalProfit,

      status: 'quoted',

      createdAt: now,
      updatedAt: now,
    });

    return {
      projectId,
      pricing: {
        productionHours,
        transportHours: adjustedTransportHours,
        bufferHours,
        totalHours,
        loadoutCostPerHour,
        billingRatePerHour,
        totalCost,
        totalPrice,
        totalProfit,
        profitMargin: actualMargin,
      },
    };
  },
});

/**
 * Get pricing estimate without saving
 * For real-time calculator updates
 */
export const estimatePrice = query({
  args: {
    loadoutId: v.id("userLoadouts"),
    serviceType: v.string(),
    serviceParams: v.any(),
    profitMargin: v.number(),
    transportHours: v.optional(v.number()),
    transportRate: v.optional(v.number()),
    bufferPercent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get loadout
    const loadout = await ctx.db.get(args.loadoutId);
    if (!loadout) {
      throw new Error("Loadout not found");
    }

    const loadoutCostPerHour = loadout.totalLoadoutCost;
    const billingRatePerHour = loadoutCostPerHour / (1 - args.profitMargin);

    // Calculate production hours based on service type
    let productionHours = 0;

    switch (args.serviceType) {
      case 'mulching':
        const mulchingParams = args.serviceParams as {
          acres: number;
          dbhPackage: number;
          difficultyMultiplier?: number;
        };
        const inchAcres = mulchingParams.acres * mulchingParams.dbhPackage;
        const adjustedIA = inchAcres * (mulchingParams.difficultyMultiplier || 1.0);
        const productionRate = loadout.productionRate || 1.3;
        productionHours = adjustedIA / productionRate;
        break;

      case 'stumps':
        const stumpParams = args.serviceParams as {
          stumps: Array<{
            diameter: number;
            heightAbove: number;
            depthBelow: number;
            modifiers: number;
          }>;
        };
        const totalStumpScore = stumpParams.stumps.reduce((sum, stump) => {
          const baseScore = Math.pow(stump.diameter, 2) * (stump.heightAbove + stump.depthBelow);
          return sum + (baseScore * stump.modifiers);
        }, 0);
        const stumpProductionRate = loadout.productionRate || 400;
        productionHours = totalStumpScore / stumpProductionRate;
        break;

      case 'clearing':
        const clearingParams = args.serviceParams as {
          estimatedDays: number;
        };
        productionHours = clearingParams.estimatedDays * 8;
        break;
    }

    // Apply transport rate and buffer
    const transportHours = args.transportHours || 1.0;
    const transportRate = args.transportRate || 0.5;
    const bufferPercent = args.bufferPercent || 0.1;

    const adjustedTransportHours = transportHours * transportRate;
    const bufferHours = (productionHours + adjustedTransportHours) * bufferPercent;
    const totalHours = productionHours + adjustedTransportHours + bufferHours;

    // Calculate financials
    const totalCost = totalHours * loadoutCostPerHour;
    const totalPrice = totalHours * billingRatePerHour;
    const totalProfit = totalPrice - totalCost;
    const actualMargin = totalProfit / totalPrice;

    return {
      productionHours,
      transportHours: adjustedTransportHours,
      bufferHours,
      totalHours,
      loadoutCostPerHour,
      billingRatePerHour,
      totalCost,
      totalPrice,
      totalProfit,
      profitMargin: actualMargin,
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
  },
});
