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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 pb-32 md:pb-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2"
              style={{ color: 'var(--text-primary)' }}>
            Dashboard
          </h1>
          <p className="text-base" style={{ color: 'var(--text-tertiary)' }}>
            Overview of your business operations
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 mb-10">
          <div className="rounded-xl md:rounded-2xl p-5 md:p-7"
               style={{
                 background: 'rgba(0, 255, 65, 0.08)',
                 border: '1px solid rgba(0, 255, 65, 0.25)',
               }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Equipment</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold" style={{ color: '#00FF41' }}>{equipment.length}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {totalEquipmentValue > 0 ? formatCurrency(totalEquipmentValue) : 'Not configured'}
            </div>
          </div>

          <div className="rounded-xl md:rounded-2xl p-5 md:p-7"
               style={{
                 background: 'rgba(0, 191, 255, 0.08)',
                 border: '1px solid rgba(0, 191, 255, 0.25)',
               }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Team</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold" style={{ color: '#00BFFF' }}>{employees.length}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {totalLaborCost > 0 ? `${formatCurrency(totalLaborCost)}/hr` : 'Not configured'}
            </div>
          </div>

          <div className="rounded-xl md:rounded-2xl p-5 md:p-7"
               style={{
                 background: 'rgba(255, 229, 0, 0.08)',
                 border: '1px solid rgba(255, 229, 0, 0.25)',
               }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Loadouts</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold" style={{ color: '#FFE500' }}>{loadouts.length}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {loadouts.length > 0 ? 'Ready to price' : 'Not configured'}
            </div>
          </div>

          <div className="rounded-xl md:rounded-2xl p-5 md:p-7"
               style={{
                 background: 'rgba(255, 255, 255, 0.03)',
                 border: '1px solid rgba(255, 255, 255, 0.1)',
               }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Status</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {completedSteps}/4
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Setup complete</div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step) => (
              <Link key={step.number} href={step.href}>
                <div
                  className="relative rounded-xl p-6 transition-all duration-150 hover:brightness-110 active:scale-95"
                  style={{
                    background: step.complete ? `${step.color}15` : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${step.complete ? `${step.color}40` : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <div className="text-5xl mb-3">{step.emoji}</div>
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {step.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
