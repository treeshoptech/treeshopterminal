'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Truck, Users, Wrench, FileText, Lock, ArrowRight } from 'lucide-react';
import '@/styles/design-system.css';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
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

  // Show nothing while redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000' }}>
        <div className="w-16 h-16 border-4 border-t-green-500 border-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return null;

}
