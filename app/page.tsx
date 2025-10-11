'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Truck, Users, Wrench, FileText, Lock, ArrowRight } from 'lucide-react';
import '@/styles/design-system.css';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to equipment if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/equipment');
    }
  }, [isAuthenticated, router]);

  const steps = [
    { title: 'Equipment', icon: Truck, step: '01' },
    { title: 'Employees', icon: Users, step: '02' },
    { title: 'Loadouts', icon: Wrench, step: '03' },
    { title: 'Projects', icon: FileText, step: '04' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center" style={{ background: '#000' }}>
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
               style={{
                 background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                 boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)'
               }}>
            <span className="text-white font-black text-3xl">T</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            TreeShop Pricing
          </h1>
          <p className="text-xl mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Professional cost calculations for tree service operations
          </p>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Sign in to build your pricing system
          </p>
        </div>

        {/* Locked Features Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative p-6 rounded-xl"
                style={{
                  background: 'rgba(34, 197, 94, 0.05)',
                  border: '2px solid rgba(34, 197, 94, 0.2)',
                  opacity: 0.6
                }}
              >
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </div>
                <Icon className="w-8 h-8 mb-3 mx-auto" style={{ color: '#22C55E' }} />
                <div className="text-sm font-semibold text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {step.title}
                </div>
                <div className="text-xs text-center mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Step {step.step}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              color: 'white',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)'
            }}
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.1)'
            }}
          >
            Sign In
          </Link>
        </div>

        <p className="text-center mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Free forever • No credit card required • Your data is private
        </p>
      </div>
    </div>
  );
}
