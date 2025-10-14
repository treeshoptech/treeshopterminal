import { QueryCtx, MutationCtx } from '../_generated/server';

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  return await ctx.auth.getUserIdentity();
}

/**
 * Require authentication - throws if user is not signed in
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new Error('Unauthorized: You must be signed in to perform this action');
  }

  return user;
}

/**
 * Get the current user's company/organization ID
 * For now, use the user ID as the organization ID (single-user companies)
 * Later: fetch from userProfiles.currentCompanyId
 */
export async function getCurrentOrganizationId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const user = await requireAuth(ctx);

  // Use the user's subject (ID) as organization ID
  // This makes each user their own organization by default
  return user.subject;
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
