'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTreeShopAuth } from '@/lib/auth/useTreeShopAuth';
import '@/styles/design-system.css';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useTreeShopAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
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

  // Show the actual home page for authenticated users
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-3"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            TreeShop Terminal
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-tertiary)' }}>
            Professional pricing & project management for tree services
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/equipment" className="group">
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="text-4xl mb-4">🚜</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Equipment</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>Track fleet costs and calculate hourly rates</p>
            </div>
          </a>

          <a href="/employees" className="group">
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(59, 130, 246, 0.2)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Employees</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>Manage crew and calculate true labor costs</p>
            </div>
          </a>

          <a href="/loadouts" className="group">
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(245, 158, 11, 0.2)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Loadouts</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>Build equipment + crew configurations</p>
            </div>
          </a>

          <a href="/pricing" className="group">
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(139, 92, 246, 0.2)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Pricing</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>Calculate project quotes with margins</p>
            </div>
          </a>

          <a href="/projects" className="group">
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(236, 72, 153, 0.2)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Projects</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>Track jobs from quote to completion</p>
            </div>
          </a>

          <a href="/settings" className="group">
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(100, 116, 139, 0.2)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Settings</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>Account preferences and configuration</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
