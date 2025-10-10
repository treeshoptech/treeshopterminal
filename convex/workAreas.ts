import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    organizationId: v.string(),
    jobSiteId: v.optional(v.id('jobSites')),
  },
  handler: async (ctx, args) => {
    let workAreas = await ctx.db
      .query('workAreas')
      .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
      .collect();

    if (args.jobSiteId) {
      workAreas = workAreas.filter(wa => wa.jobSiteId === args.jobSiteId);
    }

    return workAreas.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    jobSiteId: v.id('jobSites'),
    name: v.string(),
    polygon: v.array(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    area: v.number(),
    perimeter: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const workAreaId = await ctx.db.insert('workAreas', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return workAreaId;
  },
});

export const remove = mutation({
  args: { id: v.id('workAreas') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
