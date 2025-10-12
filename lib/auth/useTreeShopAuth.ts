'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

/**
 * TreeShop auth hook wrapping Convex Auth
 */
export function useTreeShopAuth() {
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.auth.getCurrentUser);

  return {
    // User state
    user: currentUser ?? null,
    isAuthenticated: !!currentUser,
    isLoading: currentUser === undefined,

    // User details
    email: currentUser?.email ?? null,
    orgId: currentUser?.orgId ?? null,
    userId: currentUser?.userId ?? null,
    name: currentUser?.name ?? null,

    // Auth actions
    signOut,
  };
}
