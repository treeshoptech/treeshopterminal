'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTreeShopAuth } from '@/lib/auth/useTreeShopAuth';
import '@/styles/design-system.css';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useTreeShopAuth();
  const router = useRouter();

  // Redirect based on auth state
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/equipment');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000' }}>
        <div className="w-16 h-16 border-4 border-t-green-500 border-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return null;
}
