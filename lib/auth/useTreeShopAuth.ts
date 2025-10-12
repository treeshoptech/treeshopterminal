'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";

/**
 * TreeShop-specific auth hook with simple session tokens
 * Provides a clean API for authentication throughout the app
 */
export function useTreeShopAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signinMutation = useMutation(api.auth.signin);
  const signupMutation = useMutation(api.auth.signup);
  const signoutMutation = useMutation(api.auth.signout);

  const currentUser = useQuery(
    api.auth.getCurrentUser,
    token ? { token } : 'skip'
  );

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('session_token');
    console.log('useTreeShopAuth: Loaded token from localStorage:', storedToken ? 'EXISTS' : 'NULL');
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  // Debug current user state
  useEffect(() => {
    console.log('useTreeShopAuth: Auth state:', {
      hasToken: !!token,
      currentUser: currentUser ? 'EXISTS' : 'NULL',
      isAuthenticated: !!currentUser,
      isLoading: isLoading || currentUser === undefined
    });
  }, [token, currentUser, isLoading]);

  return {
    // User state
    user: currentUser ?? null,
    isAuthenticated: !!currentUser,
    isLoading: isLoading || currentUser === undefined,

    // User details
    email: currentUser?.email ?? null,
    orgId: currentUser?.orgId ?? null,
    userId: currentUser?.userId ?? null,
    name: currentUser?.name ?? null,

    // Auth actions
    signIn: async (email: string, password: string) => {
      const result = await signinMutation({ email, password });
      localStorage.setItem('session_token', result.token);
      setToken(result.token);
      return result;
    },

    signUp: async (email: string, password: string, name: string, company?: string) => {
      const result = await signupMutation({ email, password, name, company });
      localStorage.setItem('session_token', result.token);
      setToken(result.token);
      return result;
    },

    signOut: async () => {
      if (token) {
        await signoutMutation({ token });
      }
      localStorage.removeItem('session_token');
      setToken(null);
    },
  };
}
