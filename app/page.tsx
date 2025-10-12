'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { ArrowRight, Plus, CheckCircle2, Circle } from 'lucide-react';
import '@/styles/design-system.css';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const orgId = 'org_demo';
  const equipment = useQuery(api.equipment.list, { organizationId: orgId }) || [];
  const employees = useQuery(api.employees.list, { organizationId: orgId }) || [];
  const loadouts = useQuery(api.loadouts.list, { organizationId: orgId }) || [];

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
      color: '#00FF41',
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
      color: '#00BFFF',
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
      color: '#FFE500',
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
      color: '#00FF41',
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
                background: 'linear-gradient(135deg, #00FF41 0%, #00D938 100%)',
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
                background: 'linear-gradient(90deg, #00FF41 0%, #00D938 100%)',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
              }}
            />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <Link key={step.number} href={step.href}>
              <div
                className="group relative rounded-2xl p-8 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: step.complete
                    ? `linear-gradient(135deg, ${step.color}15 0%, ${step.color}08 100%)`
                    : 'rgba(255, 255, 255, 0.03)',
                  border: step.complete
                    ? `2px solid ${step.color}40`
                    : '2px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center gap-6">
                  {/* Left: Big Number */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0"
                    style={{
                      background: step.complete ? step.color : 'rgba(255,255,255,0.05)',
                      color: step.complete ? '#000' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{step.emoji}</span>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>
                      {step.description}
                    </p>
                    {step.stat && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg"
                           style={{
                             background: `${step.color}20`,
                             border: `1px solid ${step.color}40`,
                           }}>
                        <span className="text-sm font-bold" style={{ color: step.color }}>
                          {step.stat}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {step.complete ? (
                      <CheckCircle2 className="w-8 h-8" style={{ color: step.color }} />
                    ) : (
                      <Circle className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.2)' }} />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Settings - Separated at Bottom */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/settings">
            <div
              className="group rounded-2xl p-6 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
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
    </div>
  );
}
