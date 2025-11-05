'use client';

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Custom hook to get the current organization ID
 * Uses Convex Auth - for now user ID = organization ID
 */
export function useOrganization() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.auth.currentUser);

  const isLoaded = user !== undefined;
  const isSignedIn = !!user;

  // For now, each user has their own organization (user ID = org ID)
  // This can be extended later to support teams/companies
  const organizationId = user?._id || null;

  return {
    organizationId,
    user,
    isLoaded,
    isSignedIn,
    signOut,
  };
}
