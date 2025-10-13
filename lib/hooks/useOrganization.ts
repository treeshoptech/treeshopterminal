'use client';

import { useOrganization as useClerkOrganization, useUser } from '@clerk/nextjs';

/**
 * Custom hook to get the current organization ID
 * Returns the Clerk organization ID for multi-tenant data isolation
 */
export function useOrganization() {
  const { organization, isLoaded: orgLoaded } = useClerkOrganization();
  const { user, isLoaded: userLoaded } = useUser();

  const isLoaded = orgLoaded && userLoaded;

  // Use organization ID if user belongs to an org
  // Otherwise use user ID as fallback for personal accounts
  const organizationId = organization?.id || user?.id || null;

  return {
    organizationId,
    organization,
    user,
    isLoaded,
    hasOrganization: !!organization,
  };
}
