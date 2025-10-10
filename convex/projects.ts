import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    organizationId: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.organizationId)
      )
      .collect();

    let filtered = projects;

    if (args.status) {
      filtered = filtered.filter(p => p.status === args.status);
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    projectName: v.string(),
    projectNumber: v.string(),
    customerId: v.id('customers'),
    serviceType: v.string(),
    scope: v.optional(v.string()),
    loadoutId: v.id('loadouts'),
    loadoutCostPerHour: v.number(),
    profitMargin: v.number(),
    billingRatePerHour: v.number(),
    projectSize: v.number(),
    sizeUnit: v.string(),
    workHours: v.number(),
    transportHours: v.number(),
    bufferHours: v.number(),
    totalHours: v.number(),
    totalCost: v.number(),
    totalPrice: v.number(),
    totalProfit: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const projectId = await ctx.db.insert('projects', {
      ...args,
      status: 'quoted',
      completionPercentage: 0,
      createdAt: now,
      updatedAt: now,
    });

    return projectId;
  },
});

export const update = mutation({
  args: {
    id: v.id('projects'),
    projectName: v.optional(v.string()),
    status: v.optional(v.string()),
    completionPercentage: v.optional(v.number()),
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
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
