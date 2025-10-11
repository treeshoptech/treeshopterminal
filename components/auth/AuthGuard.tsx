'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userEmail, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!isLoading && (!isAuthenticated || !userEmail)) {
      console.log('Not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, userEmail, router]);

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-canvas)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-green-500 border-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-tertiary)' }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Block access if not authenticated
  if (!isAuthenticated || !userEmail) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
