import { QueryCtx, MutationCtx } from './_generated/server';

/**
 * Authentication helper for Convex functions
 * Ensures user is authenticated before allowing data access
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error('Unauthorized: You must be signed in to perform this action');
  }

  return identity;
}

/**
 * Get the current user's organization ID from their Clerk token
 * Falls back to user ID for personal accounts
 */
export async function getCurrentOrganizationId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await requireAuth(ctx);

  // Clerk stores organization ID in the token claims
  // If user belongs to an organization, use org_id
  // Otherwise use user's subject (user ID) as their personal org
  const orgId = (identity as any).org_id || identity.subject;

  if (!orgId) {
    throw new Error('Unable to determine organization context');
  }

  return orgId;
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
