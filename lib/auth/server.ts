/**
 * Server-side auth functions
 */

import type { User, Organization } from './types';

const MOCK_USER_ID = 'user_mock123';
const MOCK_ORG_ID = 'org_mock123';

export async function getAuth() {
  return {
    userId: MOCK_USER_ID,
    orgId: MOCK_ORG_ID,
  };
}

export async function getUser() {
  return {
    id: MOCK_USER_ID,
    email: 'demo@treeshop.com',
    firstName: 'Demo',
    lastName: 'User',
    fullName: 'Demo User',
    avatar: null,
  } as User;
}

export async function getOrganization() {
  return {
    id: MOCK_ORG_ID,
    name: 'Demo Tree Service',
    slug: 'demo-tree-service',
    role: 'owner' as const,
  } as Organization;
}
