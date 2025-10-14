import { useConvexAuth } from "convex/react";

/**
 * Hook to get current user's organization
 * Now using Convex Auth instead of Clerk
 */
export function useOrganization() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // For now, each user is their own organization
  // Later: fetch from userProfiles.currentCompanyId
  return {
    organizationId: isAuthenticated ? 'user-org' : null,
    isLoaded: !isLoading,
  };
}
