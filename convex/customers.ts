import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Customer Management Functions
 * Multi-tenant with organization isolation
 */

// List customers for organization
export const list = query({
  args: {
    organizationId: v.optional(v.string()),
    status: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const customers = args.organizationId
      ? await ctx.db
          .query('customers')
          .withIndex('by_organizationId', (q) =>
            q.eq('organizationId', args.organizationId!)
          )
          .collect()
      : await ctx.db.query('customers').collect();

    // Apply filters
    let filtered = customers;

    if (args.status) {
      filtered = filtered.filter(c => c.status === args.status);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(args.search!)
      );
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get single customer
export const get = query({
  args: { id: v.id('customers') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create customer
export const create = mutation({
  args: {
    organizationId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    company: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    customerType: v.optional(v.string()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const customerId = await ctx.db.insert('customers', {
      ...args,
      status: args.status || 'lead',
      customerType: args.customerType || 'residential',
      createdAt: now,
      updatedAt: now,
    });

    return customerId;
  },
});

// Update customer
export const update = mutation({
  args: {
    id: v.id('customers'),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    customerType: v.optional(v.string()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
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

// Delete customer
export const remove = mutation({
  args: { id: v.id('customers') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get customer statistics
export const getStats = query({
  args: { customerId: v.id('customers') },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) return null;

    // Get all projects for this customer
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_customerId', (q) => q.eq('customerId', args.customerId))
      .collect();

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'in_progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;

    const totalRevenue = projects.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
    const totalProfit = projects.reduce((sum, p) => sum + (p.totalProfit || 0), 0);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalRevenue,
      totalProfit,
      averageProjectValue: totalProjects > 0 ? totalRevenue / totalProjects : 0,
    };
  },
});
