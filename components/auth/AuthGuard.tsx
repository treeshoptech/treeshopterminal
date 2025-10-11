'use client';

import { useEffect } from 'react';
import { useTreeShopAuth } from '@/lib/auth/useTreeShopAuth';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useTreeShopAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-canvas)' }}>
        <div className="w-16 h-16 border-4 border-t-green-500 border-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
