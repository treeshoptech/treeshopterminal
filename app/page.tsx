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
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2"
              style={{ color: '#111827', letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>
            Overview of your business operations
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10">
          <div className="rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6"
               style={{
                 background: '#FFFFFF',
                 border: '1px solid #E5E7EB',
                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
               }}>
            <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#6B7280' }}>Equipment</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1" style={{ color: '#00FF41', letterSpacing: '-0.02em' }}>{equipment.length}</div>
            <div className="text-xs sm:text-sm" style={{ color: '#9CA3AF' }}>
              {totalEquipmentValue > 0 ? formatCurrency(totalEquipmentValue).replace('.00', '') : 'Add equipment'}
            </div>
          </div>

          <div className="rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6"
               style={{
                 background: '#FFFFFF',
                 border: '1px solid #E5E7EB',
                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
               }}>
            <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#6B7280' }}>Team</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1" style={{ color: '#00BFFF', letterSpacing: '-0.02em' }}>{employees.length}</div>
            <div className="text-xs sm:text-sm" style={{ color: '#9CA3AF' }}>
              {totalLaborCost > 0 ? `${formatCurrency(totalLaborCost).replace('.00', '')}/hr` : 'Add employees'}
            </div>
          </div>

          <div className="rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6"
               style={{
                 background: '#FFFFFF',
                 border: '1px solid #E5E7EB',
                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
               }}>
            <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#6B7280' }}>Loadouts</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1" style={{ color: '#FFE500', letterSpacing: '-0.02em' }}>{loadouts.length}</div>
            <div className="text-xs sm:text-sm" style={{ color: '#9CA3AF' }}>
              {loadouts.length > 0 ? 'Ready to price' : 'Create loadouts'}
            </div>
          </div>

          <div className="rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6"
               style={{
                 background: '#FFFFFF',
                 border: '1px solid #E5E7EB',
                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
               }}>
            <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#6B7280' }}>Progress</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1" style={{ color: '#111827', letterSpacing: '-0.02em' }}>
              {completedSteps}/4
            </div>
            <div className="text-xs sm:text-sm" style={{ color: '#9CA3AF' }}>Steps complete</div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#111827', letterSpacing: '-0.01em' }}>Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {steps.map((step) => (
              <Link key={step.number} href={step.href}>
                <div
                  className="group relative rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="text-4xl sm:text-5xl mb-3 transition-transform duration-200 group-hover:scale-110">{step.emoji}</div>
                  <h3 className="text-sm sm:text-base font-bold mb-1" style={{ color: '#111827', letterSpacing: '-0.01em' }}>
                    {step.title}
                  </h3>
                  {step.count !== null && (
                    <p className="text-xs" style={{ color: '#6B7280' }}>
                      {step.count} {step.count === 1 ? 'item' : 'items'}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
