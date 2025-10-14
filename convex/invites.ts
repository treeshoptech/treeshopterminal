import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAuth, getCurrentUser } from './helpers/auth';

/**
 * Admin-only user invite management
 */

// Check if user is admin (for now, just check if they exist)
async function requireAdmin(ctx: any) {
  const user = await requireAuth(ctx);
  // TODO: Add proper admin role check
  return user;
}

export const create = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    companyName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Check if invite already exists
    const existing = await ctx.db
      .query('userInvites')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existing) {
      throw new Error('Invite already sent to this email');
    }

    // Generate random invite code
    const inviteCode = Math.random().toString(36).substring(2, 15) +
                       Math.random().toString(36).substring(2, 15);

    const inviteId = await ctx.db.insert('userInvites', {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      companyName: args.companyName,
      inviteCode,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { inviteId, inviteCode };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const invites = await ctx.db
      .query('userInvites')
      .order('desc')
      .collect();

    return invites;
  },
});

export const get = query({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query('userInvites')
      .withIndex('by_inviteCode', (q) => q.eq('inviteCode', args.inviteCode))
      .first();

    if (!invite) {
      throw new Error('Invalid invite code');
    }

    if (invite.status === 'accepted') {
      throw new Error('This invite has already been used');
    }

    if (invite.expiresAt < Date.now()) {
      throw new Error('This invite has expired');
    }

    return invite;
  },
});

export const accept = mutation({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error('You must be signed in to accept an invite');
    }

    const invite = await ctx.db
      .query('userInvites')
      .withIndex('by_inviteCode', (q) => q.eq('inviteCode', args.inviteCode))
      .first();

    if (!invite) {
      throw new Error('Invalid invite code');
    }

    if (invite.status === 'accepted') {
      throw new Error('This invite has already been used');
    }

    if (invite.expiresAt < Date.now()) {
      throw new Error('This invite has expired');
    }

    // Mark invite as accepted
    await ctx.db.patch(invite._id, {
      status: 'accepted',
      acceptedAt: Date.now(),
      acceptedByUserId: user.subject,
    });

    // Create user profile
    await ctx.db.insert('userProfiles', {
      userId: user.subject as any,
      email: invite.email,
      firstName: invite.firstName,
      lastName: invite.lastName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastLoginAt: Date.now(),
    });

    // Create company if specified
    if (invite.companyName) {
      await ctx.db.insert('companies', {
        userId: user.subject as any,
        name: invite.companyName,
        slug: invite.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

export const revoke = mutation({
  args: { inviteId: v.id('userInvites') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    await ctx.db.patch(args.inviteId, {
      status: 'revoked',
    });
  },
});
