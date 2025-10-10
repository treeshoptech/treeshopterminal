import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const quotes = await ctx.db
      .query('quotes')
      .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
      .collect();

    return quotes.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id('quotes') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    serviceType: v.string(),
    workAreaIds: v.array(v.id('workAreas')),
    lowPrice: v.number(),
    highPrice: v.number(),
    estimatedHours: v.number(),
    scopeOfWork: v.array(v.string()),
    whatsIncluded: v.array(v.string()),
    calculationDetails: v.any(),
  },
  handler: async (ctx, args) => {
    const quoteId = await ctx.db.insert('quotes', {
      ...args,
      createdAt: Date.now(),
    });

    return quoteId;
  },
});

export const remove = mutation({
  args: { id: v.id('quotes') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
