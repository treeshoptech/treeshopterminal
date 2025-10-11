import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Simple Custom Authentication
 * Email/Password with session tokens
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

// Sign up new user
export const signup = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    company: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();

    // Check whitelist
    const whitelisted = await ctx.db
      .query('whitelist')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (!whitelisted?.approved) {
      throw new Error('This email is not approved. Contact office@fltreeshop.com for access.');
    }

    // Check if user already exists
    const existing = await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Hash password (we'll do client-side hashing for simplicity since Convex runs in edge)
    // In production, you'd want proper server-side hashing
    const passwordHash = args.password; // For now, store as-is (NOT secure for production!)

    // Create user profile
    const userId = await ctx.db.insert('userProfiles', {
      clerkUserId: `user_${Date.now()}`,
      email: email,
      passwordHash,
      firstName: args.name.split(' ')[0],
      lastName: args.name.split(' ').slice(1).join(' ') || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastLoginAt: Date.now(),
    });

    // Create organization
    const orgId = await ctx.db.insert('companies', {
      clerkOrgId: `org_${userId}`,
      name: args.company || `${args.name}'s Company`,
      slug: email.split('@')[0].replace(/[^a-z0-9]/g, '-'),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user with org
    await ctx.db.patch(userId, {
      currentOrgId: `org_${userId}`,
    });

    // Create session
    const token = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    await ctx.db.insert('sessions', {
      userId,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return {
      token,
      userId,
      email,
      name: args.name,
      orgId: `org_${userId}`,
    };
  },
});

// Sign in existing user
export const signin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    const user = await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', email.toLowerCase()))
      .first();

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    if (user.passwordHash !== password) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });

    // Create session
    const token = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    await ctx.db.insert('sessions', {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return {
      token,
      userId: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      orgId: user.currentOrgId,
    };
  },
});

// Sign out (invalidate session)
export const signout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_token', (q) => q.eq('token', token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

// Get current user from session token
export const getCurrentUser = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, { token }) => {
    if (!token) return null;

    const session = await ctx.db
      .query('sessions')
      .withIndex('by_token', (q) => q.eq('token', token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);

    if (!user) return null;

    return {
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      orgId: user.currentOrgId,
      name: `${user.firstName} ${user.lastName}`.trim(),
    };
  },
});
