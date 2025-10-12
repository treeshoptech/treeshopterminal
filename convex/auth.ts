import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
});

// Export additional auth queries/mutations
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * TreeShop Auth Helpers
 */

// Check if email is whitelisted
export const checkWhitelist = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const whitelisted = await ctx.db
      .query('whitelist')
      .withIndex('by_email', (q) => q.eq('email', email.toLowerCase()))
      .first();

    return {
      isApproved: whitelisted?.approved === true,
      email: whitelisted?.email,
    };
  },
});

// Add email to whitelist
export const addToWhitelist = mutation({
  args: {
    email: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { email, notes }) => {
    const existing = await ctx.db
      .query('whitelist')
      .withIndex('by_email', (q) => q.eq('email', email.toLowerCase()))
      .first();

    if (existing) {
      throw new Error('Email already in whitelist');
    }

    const whitelistId = await ctx.db.insert('whitelist', {
      email: email.toLowerCase(),
      approved: true,
      approvedAt: Date.now(),
      notes,
      createdAt: Date.now(),
    });

    return whitelistId;
  },
});

// Get current user (uses Convex Auth's built-in user system)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    // Try to find matching userProfile
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', user.email ?? ''))
      .first();

    return {
      userId: user._id,
      email: user.email,
      name: user.name,
      orgId: profile?.currentOrgId ?? null,
    };
  },
});
