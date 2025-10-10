import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    organizationId: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const jobSites = await ctx.db
      .query('jobSites')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.organizationId)
      )
      .collect();

    let filtered = jobSites;

    if (args.status) {
      filtered = filtered.filter(js => js.status === args.status);
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id('jobSites') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    siteName: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    coordinates: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    customerId: v.optional(v.id('customers')),
    acreage: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const jobSiteId = await ctx.db.insert('jobSites', {
      ...args,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    return jobSiteId;
  },
});

export const update = mutation({
  args: {
    id: v.id('jobSites'),
    siteName: v.optional(v.string()),
    address: v.optional(v.string()),
    status: v.optional(v.string()),
    acreage: v.optional(v.number()),
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
  args: { id: v.id('jobSites') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
