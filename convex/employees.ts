import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { getCurrentOrganizationId, verifyOrganizationAccess } from './auth';

export const list = query({
  args: {
    organizationId: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentOrgId = await getCurrentOrganizationId(ctx);
    const orgId = args.organizationId || currentOrgId;
    await verifyOrganizationAccess(ctx, orgId);

    const employees = await ctx.db
      .query('employees')
      .withIndex('by_organizationId', (q) => q.eq('organizationId', orgId))
      .collect();

    let filtered = employees;

    if (args.status) {
      filtered = filtered.filter(e => e.status === args.status);
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id('employees') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    organizationId: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    position: v.string(),
    baseHourlyRate: v.number(),
    burdenMultiplier: v.number(),
    trueCostPerHour: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentOrgId = await getCurrentOrganizationId(ctx);
    const orgId = args.organizationId || currentOrgId;
    await verifyOrganizationAccess(ctx, orgId);

    const now = Date.now();
    const trueCost = args.trueCostPerHour || (args.baseHourlyRate * args.burdenMultiplier);

    const employeeId = await ctx.db.insert('employees', {
      ...args,
      organizationId: orgId,
      trueCostPerHour: trueCost,
      status: args.status || 'active',
      createdAt: now,
      updatedAt: now,
    });

    return employeeId;
  },
});

export const remove = mutation({
  args: { id: v.id('employees') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
