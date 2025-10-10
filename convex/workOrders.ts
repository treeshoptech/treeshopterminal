import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    organizationId: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workOrders = await ctx.db
      .query('workOrders')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.organizationId)
      )
      .collect();

    let filtered = workOrders;

    if (args.status) {
      filtered = filtered.filter(wo => wo.status === args.status);
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id('workOrders') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    workOrderNumber: v.string(),
    projectId: v.id('projects'),
    customerId: v.id('customers'),
    scheduledDate: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const workOrderId = await ctx.db.insert('workOrders', {
      ...args,
      status: args.status || 'scheduled',
      createdAt: now,
      updatedAt: now,
    });

    return workOrderId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('workOrders'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
