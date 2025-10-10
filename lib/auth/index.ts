/**
 * Auth Module - Mock for now (Clerk breaks Next 15 build)
 */

// Client exports
export { MockAuthProvider as AuthProvider } from './MockAuthProvider';
export { useAuth } from './MockAuthProvider';

// Server exports
export { getAuth, getUser, getOrganization } from './server';

// Types
export type { AuthContext, User, Organization } from './types';
