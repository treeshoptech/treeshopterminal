/**
 * Auth Types - Designed for Clerk but works with mock
 */

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatar: string | null;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role: 'owner' | 'admin' | 'manager' | 'member';
}

export interface AuthContext {
  userId: string | null;
  user: User | null;
  orgId: string | null;
  organization: Organization | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
}
