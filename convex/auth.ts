import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Simple Convex Authentication
 * Email-based signup and login
 */

// Sign up new user
export const signup = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    company: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Create user profile
    const userId = await ctx.db.insert('userProfiles', {
      clerkUserId: args.email, // Using email as ID
      email: args.email,
      firstName: args.name.split(' ')[0],
      lastName: args.name.split(' ').slice(1).join(' ') || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create organization for user
    const orgId = await ctx.db.insert('companies', {
      clerkOrgId: `org_${userId}`,
      name: args.company || `${args.name}'s Company`,
      slug: args.email.split('@')[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { userId, orgId: `org_${userId}`, email: args.email };
  },
});

// Login existing user
export const login = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (!user) {
      throw new Error('User not found. Please sign up first.');
    }

    return {
      userId: user._id,
      email: user.email,
      orgId: user.clerkUserId.replace('@', '_').replace('.', '_'), // Simple org ID from email
      name: `${user.firstName} ${user.lastName}`.trim(),
    };
  },
});

// Get current user by email
export const getCurrentUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});
