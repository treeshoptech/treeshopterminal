'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { ArrowRight, Plus, CheckCircle2, Circle } from 'lucide-react';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { SignedOut, SignIn, useUser } from '@clerk/nextjs';
import '@/styles/design-system.css';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { organizationId, isLoaded } = useOrganization();
  const { isSignedIn } = useUser();
  const equipment = useQuery(
    api.equipment.list,
    organizationId ? {} : 'skip'
  ) || [];
  const employees = useQuery(
    api.employees.list,
    organizationId ? {} : 'skip'
  ) || [];
  const loadouts = useQuery(
    api.loadouts.list,
    organizationId ? {} : 'skip'
  ) || [];

  const totalEquipmentValue = equipment.reduce((sum, e) => sum + (e.purchasePrice || 0), 0);
  const totalEquipmentCost = equipment.reduce((sum, e) => sum + (e.totalCostPerHour || 0), 0);
  const totalLaborCost = employees.reduce((sum, e) => sum + (e.trueCostPerHour || 0), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const steps = [
    {
      number: 1,
      title: 'Equipment',
      href: '/equipment',
      emoji: '🚜',
      count: equipment.length,
      stat: totalEquipmentValue > 0 ? formatCurrency(totalEquipmentValue) : null,
      statLabel: 'Fleet Value',
      description: 'Add your trucks, mulchers, and equipment to calculate hourly costs',
      complete: equipment.length > 0,
      color: '#22C55E',
    },
    {
      number: 2,
      title: 'Employees',
      href: '/employees',
      emoji: '👥',
      count: employees.length,
      stat: employees.length > 0 ? `${employees.length} crew` : null,
      statLabel: 'Team Size',
      description: 'Add crew members and calculate true labor costs with burden multiplier',
      complete: employees.length > 0,
      color: '#3B82F6',
    },
    {
      number: 3,
      title: 'Loadouts',
      href: '/loadouts',
      emoji: '🔧',
      count: loadouts.length,
      stat: loadouts.length > 0 ? `${loadouts.length} configs` : null,
      statLabel: 'Ready',
      description: 'Combine equipment and crew into complete job configurations',
      complete: loadouts.length > 0,
      color: '#F59E0B',
    },
    {
      number: 4,
      title: 'Price Projects',
      href: '/projects',
      emoji: '💰',
      count: null,
      stat: null,
      statLabel: null,
      description: 'Calculate project quotes using inch-acres, loadouts, and profit margins',
      complete: loadouts.length > 0,
      color: '#22C55E',
    },
  ];

  const completedSteps = steps.filter(s => s.complete).length;
  const nextStep = steps.find(s => !s.complete);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 pb-32 md:pb-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-3"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
            TreeShop Terminal
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
            Build your pricing system in 4 steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Setup Progress
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--brand-400)' }}>
              {completedSteps}/4 Complete
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(completedSteps / 4) * 100}%`,
                background: 'linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
              }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <Link key={step.number} href={step.href}>
              <div
                className="group relative rounded-2xl p-8 transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
                  border: step.complete
                    ? `2px solid ${step.color}40`
                    : '2px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(60px)',
                  boxShadow: step.complete
                    ? `0 8px 32px ${step.color}20`
                    : '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                <div className="flex items-start gap-6">
                  {/* Step Number & Status */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
                      style={{
                        background: step.complete
                          ? `linear-gradient(135deg, ${step.color} 0%, ${step.color}CC 100%)`
                          : 'rgba(255,255,255,0.05)',
                        color: step.complete ? 'white' : 'rgba(255,255,255,0.3)',
                        border: step.complete ? 'none' : '2px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{step.emoji}</span>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {step.title}
                      </h3>
                      {step.complete ? (
                        <CheckCircle2 className="w-6 h-6" style={{ color: step.color }} />
                      ) : (
                        <Circle className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.2)' }} />
                      )}
                    </div>
                    <p className="text-base mb-4" style={{ color: 'var(--text-tertiary)' }}>
                      {step.description}
                    </p>

                    {/* Stats */}
                    {step.stat && (
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-2xl font-bold" style={{ color: step.color }}>
                            {step.stat}
                          </div>
                          <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-quaternary)' }}>
                            {step.statLabel}
                          </div>
                        </div>
                      </div>
                    )}

                    {!step.complete && step === nextStep && (
                      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                           style={{
                             background: `${step.color}15`,
                             border: `1px solid ${step.color}40`,
                             color: step.color
                           }}>
                        <span className="text-sm font-semibold">Start Here</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ArrowRight
                      className="w-6 h-6 transition-transform group-hover:translate-x-1"
                      style={{ color: 'var(--text-quaternary)' }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Settings at Bottom */}
        <div className="mt-12">
          <Link href="/settings">
            <div
              className="group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
                border: '2px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(60px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">⚙️</span>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h3>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>App preferences</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-quaternary)' }} />
              </div>
            </div>
          </Link>
        </div>

      </div>

      {/* Sign-In Modal Overlay */}
      <SignedOut>
        <div className="fixed inset-0 z-[100] flex items-center justify-center"
             style={{
               background: 'rgba(0, 0, 0, 0.95)',
               backdropFilter: 'blur(20px)'
             }}>
          <div className="relative w-full max-w-md px-6">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full animate-pulse"
                   style={{
                     background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)',
                     filter: 'blur(80px)',
                     animationDuration: '4s'
                   }} />
              <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full animate-pulse"
                   style={{
                     background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.15) 40%, transparent 70%)',
                     filter: 'blur(80px)',
                     animationDuration: '6s',
                     animationDelay: '2s'
                   }} />
            </div>

            {/* Header */}
            <div className="relative text-center mb-12">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                     style={{
                       background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                       boxShadow: '0 20px 60px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                     }}>
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <h1
                className="text-5xl font-black mb-3"
                style={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em'
                }}
              >
                TreeShop Terminal
              </h1>
              <p className="text-lg text-gray-400 mb-2">
                Professional pricing for tree service operations
              </p>
              <p className="text-sm text-gray-500">
                Sign in to continue
              </p>
            </div>

            {/* Sign In Component */}
            <div className="relative">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: 'mx-auto',
                    card: {
                      background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                      backdropFilter: 'blur(40px)',
                      border: '2px solid rgba(34, 197, 94, 0.2)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(34, 197, 94, 0.15)',
                      borderRadius: '24px',
                      padding: '48px 40px'
                    },
                    headerTitle: {
                      display: 'none'
                    },
                    headerSubtitle: {
                      display: 'none'
                    },
                    socialButtonsBlockButton: {
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '600',
                      padding: '14px',
                      borderRadius: '12px'
                    },
                    formFieldLabel: {
                      color: '#e5e7eb',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px'
                    },
                    formFieldInput: {
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '15px',
                      padding: '14px 16px',
                      borderRadius: '12px'
                    },
                    formButtonPrimary: {
                      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '700',
                      padding: '16px',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                    },
                    footerActionLink: {
                      display: 'none'
                    },
                    footer: {
                      display: 'none'
                    },
                    footerActionText: {
                      display: 'none'
                    },
                    identityPreviewEditButton: {
                      display: 'none'
                    }
                  },
                  variables: {
                    colorPrimary: '#22C55E',
                    colorBackground: 'transparent',
                    colorInputBackground: 'rgba(0, 0, 0, 0.4)',
                    colorInputText: '#ffffff',
                    colorText: '#ffffff',
                    colorTextSecondary: '#9ca3af',
                    borderRadius: '12px'
                  },
                }}
                routing="hash"
                afterSignInUrl="/"
                signUpUrl={undefined}
              />

              <div className="text-center mt-8">
                <p className="text-sm text-gray-500 mb-3">
                  Protected by enterprise-grade security
                </p>
                <p className="text-xs text-gray-600">
                  Need access? Apply at{' '}
                  <a href="https://treeshop.app/tech" target="_blank" rel="noopener noreferrer"
                     className="text-green-500 hover:text-green-400 font-semibold">
                    treeshop.app/tech
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
