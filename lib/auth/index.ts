/**
 * Auth Module - Abstraction Layer
 *
 * Client components: import from '@/lib/auth/client'
 * Server components: import from '@/lib/auth/server'
 */

// Client exports (use in 'use client' components)
export { MockAuthProvider as AuthProvider } from './MockAuthProvider';
export { useAuth } from './MockAuthProvider';

// Server exports (use in server components)
export { getAuth, getUser, getOrganization } from './server';

// Types
export type { AuthContext, User, Organization } from './types';

// When ready for Clerk:
// Client: export { ClerkProvider as AuthProvider, useAuth } from '@clerk/nextjs';
// Server: export { auth as getAuth, currentUser as getUser } from '@clerk/nextjs/server';
