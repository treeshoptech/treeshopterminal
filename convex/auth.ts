import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Simple Convex Auth - Username/Email Login
 */

// Create or get user
export const getOrCreateUser = mutation({
  args: {
    email: v.string(),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new user
    const userId = await ctx.db.insert('userProfiles', {
      email: args.email,
      firstName: args.username || args.email.split('@')[0],
      clerkUserId: args.email, // Using email as ID for simplicity
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});
