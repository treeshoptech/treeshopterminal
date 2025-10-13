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
    projectNumber: v.optional(v.string()),
    customerId: v.optional(v.id('customers')),
    customerName: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    scope: v.optional(v.string()),
    loadoutId: v.optional(v.id('loadouts')),
    loadoutName: v.optional(v.string()),
    loadoutCostPerHour: v.optional(v.number()),
    profitMargin: v.optional(v.number()),
    billingRatePerHour: v.optional(v.number()),
    projectSize: v.optional(v.number()),
    sizeUnit: v.optional(v.string()),
    dbhPackage: v.optional(v.number()),
    workHours: v.optional(v.number()),
    transportHours: v.optional(v.number()),
    bufferHours: v.optional(v.number()),
    totalHours: v.optional(v.number()),
    totalCost: v.optional(v.number()),
    totalPrice: v.optional(v.number()),
    totalProfit: v.optional(v.number()),
    inchAcres: v.optional(v.number()),
    productionRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Generate project number if not provided
    const projectNumber = args.projectNumber || `Q-${Date.now().toString().slice(-8)}`;

    // Create a temporary customer if none provided
    let customerId = args.customerId;
    if (!customerId && args.customerName) {
      customerId = await ctx.db.insert('customers', {
        organizationId: args.organizationId,
        name: args.customerName,
        email: '',
        phone: '',
        status: 'lead',
        createdAt: now,
        updatedAt: now,
      });
    }

    const projectId = await ctx.db.insert('projects', {
      organizationId: args.organizationId,
      projectName: args.projectName,
      projectNumber,
      customerId: customerId!,
      serviceType: args.serviceType,
      scope: args.scope,
      loadoutId: args.loadoutId,
      loadoutCostPerHour: args.loadoutCostPerHour,
      profitMargin: args.profitMargin,
      billingRatePerHour: args.billingRatePerHour,
      projectSize: args.projectSize,
      sizeUnit: args.sizeUnit,
      workHours: args.workHours,
      transportHours: args.transportHours,
      bufferHours: args.bufferHours,
      totalHours: args.totalHours,
      totalCost: args.totalCost,
      totalPrice: args.totalPrice,
      totalProfit: args.totalProfit,
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
