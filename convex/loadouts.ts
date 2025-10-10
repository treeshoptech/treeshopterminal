import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    organizationId: v.string(),
    serviceType: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const loadouts = await ctx.db
      .query('loadouts')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.organizationId)
      )
      .collect();

    let filtered = loadouts;

    if (args.serviceType) {
      filtered = filtered.filter(l => l.serviceType === args.serviceType);
    }

    if (args.isActive !== undefined) {
      filtered = filtered.filter(l => l.isActive === args.isActive);
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id('loadouts') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    loadoutName: v.string(),
    serviceType: v.optional(v.string()),
    equipmentIds: v.array(v.id('equipment')),
    employees: v.optional(v.array(v.object({
      position: v.string(),
      baseWage: v.number(),
      burdenMultiplier: v.number(),
      trueCostPerHour: v.number(),
    }))),
    totalEquipmentCostPerHour: v.number(),
    totalLaborCostPerHour: v.number(),
    totalLoadoutCostPerHour: v.number(),
    productionRate: v.optional(v.number()),
    productionUnit: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const loadoutId = await ctx.db.insert('loadouts', {
      ...args,
      crewSize: args.employees?.length || 0,
      isActive: true,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    });

    return loadoutId;
  },
});

export const update = mutation({
  args: {
    id: v.id('loadouts'),
    loadoutName: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    equipmentIds: v.optional(v.array(v.id('equipment'))),
    employees: v.optional(v.array(v.object({
      position: v.string(),
      baseWage: v.number(),
      burdenMultiplier: v.number(),
      trueCostPerHour: v.number(),
    }))),
    totalEquipmentCostPerHour: v.optional(v.number()),
    totalLaborCostPerHour: v.optional(v.number()),
    totalLoadoutCostPerHour: v.optional(v.number()),
    productionRate: v.optional(v.number()),
    productionUnit: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
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
  args: { id: v.id('loadouts') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const setDefault = mutation({
  args: {
    id: v.id('loadouts'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    // First, unset all other defaults
    const loadouts = await ctx.db
      .query('loadouts')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.organizationId)
      )
      .collect();

    for (const loadout of loadouts) {
      if (loadout.isDefault) {
        await ctx.db.patch(loadout._id, { isDefault: false });
      }
    }

    // Set this one as default
    await ctx.db.patch(args.id, {
      isDefault: true,
      updatedAt: Date.now(),
    });
  },
});
