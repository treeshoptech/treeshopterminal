/**
 * Auth Module - REAL Clerk Authentication
 */

// Client exports
export { ClerkProvider as AuthProvider } from '@clerk/nextjs';
export { useAuth, useOrganization, useUser } from '@clerk/nextjs';

// Server exports
export { auth as getAuth, currentUser as getUser } from '@clerk/nextjs/server';

// Types
export type { AuthContext, User, Organization } from './types';
