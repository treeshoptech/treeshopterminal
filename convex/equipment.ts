import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { getCurrentOrganizationId, verifyOrganizationAccess } from './auth';

/**
 * Equipment Management Functions
 * All functions require authentication
 */

export const list = query({
  args: {
    organizationId: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get current user's organization ID
    const currentOrgId = await getCurrentOrganizationId(ctx);

    // Use provided organizationId or fall back to current user's org
    const orgId = args.organizationId || currentOrgId;

    // Verify user has access to this organization
    await verifyOrganizationAccess(ctx, orgId);

    const equipment = await ctx.db
      .query('equipment')
      .withIndex('by_organizationId', (q) => q.eq('organizationId', orgId))
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
    await getCurrentOrganizationId(ctx); // Ensure authenticated
    const equipment = await ctx.db.get(args.id);

    if (!equipment) {
      throw new Error('Equipment not found');
    }

    // Verify user has access to this equipment's organization
    await verifyOrganizationAccess(ctx, equipment.organizationId);

    return equipment;
  },
});

export const create = mutation({
  args: {
    organizationId: v.optional(v.string()),
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
    // Get current user's organization ID
    const currentOrgId = await getCurrentOrganizationId(ctx);

    // Use provided organizationId or current user's org
    const orgId = args.organizationId || currentOrgId;

    // Verify user has access to create in this organization
    await verifyOrganizationAccess(ctx, orgId);

    const now = Date.now();

    const equipmentId = await ctx.db.insert('equipment', {
      ...args,
      organizationId: orgId,
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

    // Get existing equipment to verify ownership
    const equipment = await ctx.db.get(id);
    if (!equipment) {
      throw new Error('Equipment not found');
    }

    // Verify user has access to this equipment's organization
    await verifyOrganizationAccess(ctx, equipment.organizationId);

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
    // Get existing equipment to verify ownership
    const equipment = await ctx.db.get(args.id);
    if (!equipment) {
      throw new Error('Equipment not found');
    }

    // Verify user has access to delete this equipment
    await verifyOrganizationAccess(ctx, equipment.organizationId);

    await ctx.db.delete(args.id);
  },
});
