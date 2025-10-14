'use client';

import { useConvexAuth } from 'convex/react';
import { SignInModal } from './SignInModal';
import { ReactNode } from 'react';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return null;
  }

  // Show sign-in modal if not authenticated
  if (!isAuthenticated) {
    return <SignInModal />;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}
