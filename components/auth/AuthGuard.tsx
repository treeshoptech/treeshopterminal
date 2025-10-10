'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !userEmail) {
      router.push('/login');
    }
  }, [isAuthenticated, userEmail, router]);

  if (!isAuthenticated || !userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-canvas)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-green-500 border-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-tertiary)' }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
