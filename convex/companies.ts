import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: { clerkOrgId: v.string() },
  handler: async (ctx, args) => {
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkOrgId', (q) => q.eq('clerkOrgId', args.clerkOrgId))
      .first();

    return company;
  },
});

export const create = mutation({
  args: {
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const companyId = await ctx.db.insert('companies', {
      ...args,
      subscriptionTier: 'free',
      billingStatus: 'active',
      onboardingComplete: false,
      defaultSettings: {
        profitMargin: 0.5,        // 50%
        travelRate: 0.5,          // 50%
        bufferPercent: 0.1,       // 10%
        burdenMultiplier: 1.7,    // Standard
        timezone: 'America/New_York',
        currency: 'USD',
      },
      businessHours: {
        monday: { start: '07:00', end: '17:00', enabled: true },
        tuesday: { start: '07:00', end: '17:00', enabled: true },
        wednesday: { start: '07:00', end: '17:00', enabled: true },
        thursday: { start: '07:00', end: '17:00', enabled: true },
        friday: { start: '07:00', end: '17:00', enabled: true },
        saturday: { start: '08:00', end: '14:00', enabled: false },
        sunday: { start: '08:00', end: '14:00', enabled: false },
      },
      usage: {
        currentProjects: 0,
        currentEmployees: 0,
        currentEquipment: 0,
        currentLoadouts: 0,
        storageUsedGB: 0,
        mapViewsThisMonth: 0,
      },
      setupSteps: {
        companyInfo: false,
        firstEquipment: false,
        firstLoadout: false,
        firstEmployee: false,
        firstProject: false,
      },
      createdAt: now,
      updatedAt: now,
    });

    return companyId;
  },
});

export const updateSettings = mutation({
  args: {
    clerkOrgId: v.string(),
    defaultSettings: v.object({
      profitMargin: v.number(),
      travelRate: v.number(),
      bufferPercent: v.number(),
      burdenMultiplier: v.number(),
      timezone: v.string(),
      currency: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkOrgId', (q) => q.eq('clerkOrgId', args.clerkOrgId))
      .first();

    if (!company) {
      throw new Error('Company not found');
    }

    await ctx.db.patch(company._id, {
      defaultSettings: args.defaultSettings,
      updatedAt: Date.now(),
    });

    return company._id;
  },
});

export const updateBusinessHours = mutation({
  args: {
    clerkOrgId: v.string(),
    businessHours: v.object({
      monday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      tuesday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      wednesday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      thursday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      friday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      saturday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      sunday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
    }),
  },
  handler: async (ctx, args) => {
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkOrgId', (q) => q.eq('clerkOrgId', args.clerkOrgId))
      .first();

    if (!company) {
      throw new Error('Company not found');
    }

    await ctx.db.patch(company._id, {
      businessHours: args.businessHours,
      updatedAt: Date.now(),
    });

    return company._id;
  },
});
