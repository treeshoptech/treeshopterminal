import { convexAuth } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from './_generated/server';
import { query } from './_generated/server';

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [],
});

/**
 * Get the current authenticated user
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

/**
 * Authentication helper for Convex functions
 * Ensures user is authenticated before allowing data access
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await auth.getUserId(ctx);

  if (!userId) {
    throw new Error('Unauthorized: You must be signed in to perform this action');
  }

  return userId;
}

/**
 * Get the current user's organization ID
 * For now, use user ID as their organization (single-user mode)
 * TODO: Add proper organization support later
 */
export async function getCurrentOrganizationId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const userId = await requireAuth(ctx);

  // For now, each user has their own organization (user ID = org ID)
  // This can be extended later to support teams/companies
  return userId;
}

/**
 * Verify the user has access to a specific organization
 */
export async function verifyOrganizationAccess(
  ctx: QueryCtx | MutationCtx,
  organizationId: string
): Promise<void> {
  const currentOrgId = await getCurrentOrganizationId(ctx);

  if (currentOrgId !== organizationId) {
    throw new Error('Unauthorized: You do not have access to this organization');
  }
}
