'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthContext, AuthActions, User, Organization } from './types';

// Mock user data
const MOCK_USER: User = {
  id: 'user_mock123',
  email: 'demo@treeshop.com',
  firstName: 'Demo',
  lastName: 'User',
  fullName: 'Demo User',
  avatar: null,
};

const MOCK_ORG: Organization = {
  id: 'org_mock123',
  name: 'Demo Tree Service',
  slug: 'demo-tree-service',
  role: 'owner',
};

type AuthContextType = AuthContext & AuthActions;

const AuthContext = createContext<AuthContextType | null>(null);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true); // Auto signed in for development
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [organization, setOrganization] = useState<Organization | null>(MOCK_ORG);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const signIn = async (email: string, password: string) => {
    setUser(MOCK_USER);
    setOrganization(MOCK_ORG);
    setIsSignedIn(true);
  };

  const signOut = async () => {
    setUser(null);
    setOrganization(null);
    setIsSignedIn(false);
  };

  const switchOrganization = async (orgId: string) => {
    // In real implementation, this would switch Clerk org
    console.log('Switching to org:', orgId);
  };

  const value: AuthContextType = {
    userId: user?.id || null,
    user,
    orgId: organization?.id || null,
    organization,
    isLoaded,
    isSignedIn,
    signIn,
    signOut,
    switchOrganization,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within MockAuthProvider');
  }
  return context;
}
