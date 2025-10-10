import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Equipment Management Functions
 */

export const list = query({
  args: {
    organizationId: v.string(),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db
      .query('equipment')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.organizationId)
      )
      .collect();

    let filtered = equipment;

    if (args.category) {
      filtered = filtered.filter(e => e.category === args.category);
    }

    if (args.status) {
      filtered = filtered.filter(e => e.status === args.status);
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id('equipment') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    equipmentName: v.string(),
    category: v.optional(v.string()),
    purchasePrice: v.number(),
    usefulLifeYears: v.number(),
    annualFinanceCost: v.number(),
    annualInsurance: v.number(),
    annualRegistration: v.number(),
    annualHours: v.number(),
    fuelGallonsPerHour: v.number(),
    fuelPricePerGallon: v.number(),
    annualMaintenance: v.number(),
    annualRepairs: v.number(),
    ownershipCostPerHour: v.number(),
    operatingCostPerHour: v.number(),
    totalCostPerHour: v.number(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const equipmentId = await ctx.db.insert('equipment', {
      ...args,
      status: args.status || 'active',
      category: args.category || 'general',
      createdAt: now,
      updatedAt: now,
    });

    return equipmentId;
  },
});

export const update = mutation({
  args: {
    id: v.id('equipment'),
    equipmentName: v.optional(v.string()),
    category: v.optional(v.string()),
    purchasePrice: v.optional(v.number()),
    ownershipCostPerHour: v.optional(v.number()),
    operatingCostPerHour: v.optional(v.number()),
    totalCostPerHour: v.optional(v.number()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id('equipment') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
