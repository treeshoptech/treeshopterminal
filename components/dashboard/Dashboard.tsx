'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import {
  Truck,
  Users,
  Wrench,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  Package,
  ArrowRight,
  Plus,
  Zap,
  Target,
  BarChart3,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import '@/styles/design-system.css';
import { useAuth } from '@/hooks/useAuth';

export function Dashboard() {
  const { orgId } = useAuth();

  const equipment = useQuery(api.equipment.list, { organizationId: orgId }) || [];
  const employees = useQuery(api.employees.list, { organizationId: orgId }) || [];
  const loadouts = useQuery(api.loadouts.list, { organizationId: orgId }) || [];
  const projects = useQuery(api.projects.list, { organizationId: orgId }) || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate KPIs
  const totalEquipmentValue = equipment.reduce((acc, e) => acc + (e.purchasePrice || 0), 0);
  const avgEquipmentCost = equipment.length > 0
    ? equipment.reduce((acc, e) => acc + e.totalCostPerHour, 0) / equipment.length
    : 0;

  const totalLaborCost = employees.reduce((acc, e) => acc + (e.trueLaborCost || 0), 0);
  const avgBurdenMultiplier = employees.length > 0
    ? employees.reduce((acc, e) => acc + (e.burdenMultiplier || 1.7), 0) / employees.length
    : 1.7;

  const avgLoadoutCost = loadouts.length > 0
    ? loadouts.reduce((acc, l) => acc + (l.totalLoadoutCost || 0), 0) / loadouts.length
    : 0;

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalProjectValue = projects.reduce((acc, p) => acc + (p.finalPrice || 0), 0);

  const stats = [
    {
      label: 'Total Equipment',
      value: equipment.length.toString(),
      subValue: formatCurrency(totalEquipmentValue),
      icon: Truck,
      color: 'var(--brand-400)',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
      href: '/equipment',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Total Employees',
      value: employees.length.toString(),
      subValue: `${formatCurrency(totalLaborCost)}/hr total`,
      icon: Users,
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      href: '/employees',
      trend: '+8%',
      trendUp: true
    },
    {
      label: 'Active Loadouts',
      value: loadouts.length.toString(),
      subValue: `${formatCurrency(avgLoadoutCost)}/hr avg`,
      icon: Wrench,
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      href: '/loadouts',
      trend: '+15%',
      trendUp: true
    },
    {
      label: 'Total Projects',
      value: projects.length.toString(),
      subValue: `${activeProjects} active`,
      icon: FileText,
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      href: '/projects',
      trend: '+23%',
      trendUp: true
    }
  ];

  const quickActions = [
    {
      label: 'Add Equipment',
      description: 'Track new fleet asset',
      icon: Truck,
      href: '/equipment',
      color: 'var(--brand-400)',
      gradient: 'var(--gradient-brand)'
    },
    {
      label: 'Add Employee',
      description: 'Register new team member',
      icon: Users,
      href: '/employees',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
    },
    {
      label: 'Create Loadout',
      description: 'Configure crew setup',
      icon: Wrench,
      href: '/loadouts',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    },
    {
      label: 'New Project',
      description: 'Price a new job',
      icon: FileText,
      href: '/projects',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    }
  ];

  const recentActivity = [
    { type: 'equipment', label: 'Equipment added', time: '2 hours ago', icon: Truck },
    { type: 'loadout', label: 'Loadout configured', time: '5 hours ago', icon: Wrench },
    { type: 'project', label: 'Project created', time: '1 day ago', icon: FileText },
    { type: 'employee', label: 'Employee registered', time: '2 days ago', icon: Users },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `
                 radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 40%),
                 radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 40%),
                 radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)
               `
             }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl sm:text-5xl font-black"
                    style={{
                      background: 'linear-gradient(180deg, var(--text-primary) 0%, rgba(255,255,255,0.8) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '-0.02em'
                    }}>
                  Dashboard
                </h1>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full animate-pulse"
                     style={{
                       background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
                       border: '1px solid rgba(34, 197, 94, 0.3)',
                       boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
                     }}>
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          style={{ background: 'var(--brand-400)' }}></span>
                    <span className="relative inline-flex rounded-full h-2 w-2"
                          style={{ background: 'var(--brand-400)' }}></span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--brand-400)' }}>
                    Live
                  </span>
                </div>
              </div>
              <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                Your complete pricing operations at a glance
              </p>
            </div>

            {/* System Status */}
            <div className="p-4 rounded-xl"
                 style={{
                   background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, transparent 100%)',
                   border: '1px solid rgba(34, 197, 94, 0.2)'
                 }}>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--brand-400)' }}>
                    All Systems Go
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-quaternary)' }}>
                    Pricing ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                  border: `2px solid ${stat.borderColor}`,
                  backdropFilter: 'blur(60px)',
                  WebkitBackdropFilter: 'blur(60px)',
                  boxShadow: `0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px ${stat.color}15, inset 0 2px 4px rgba(255, 255, 255, 0.08)`,
                  animationDelay: `${index * 50}ms`,
                  opacity: 0,
                  animation: 'fadeInUp 0.5s ease-out forwards'
                }}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       background: `radial-gradient(circle at top left, ${stat.color}25, transparent 70%)`,
                       boxShadow: `inset 0 0 60px ${stat.color}20`
                     }} />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                         style={{
                           background: stat.gradient,
                           boxShadow: `0 4px 16px ${stat.color}40, inset 0 1px 2px rgba(255, 255, 255, 0.15)`
                         }}>
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    {stat.trend && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                           style={{
                             background: stat.trendUp
                               ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)'
                               : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
                             border: stat.trendUp
                               ? '1px solid rgba(34, 197, 94, 0.3)'
                               : '1px solid rgba(239, 68, 68, 0.3)'
                           }}>
                        <TrendingUp className="w-3 h-3"
                                    style={{ color: stat.trendUp ? 'var(--brand-400)' : 'var(--color-error)' }} />
                        <span className="text-xs font-bold"
                              style={{ color: stat.trendUp ? 'var(--brand-400)' : 'var(--color-error)' }}>
                          {stat.trend}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Value */}
                  <div className="mb-3">
                    <div className="text-4xl font-black mb-1"
                         style={{
                           color: 'var(--text-primary)',
                           letterSpacing: '-0.02em'
                         }}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium"
                         style={{ color: 'var(--text-tertiary)' }}>
                      {stat.subValue}
                    </div>
                  </div>

                  {/* Label */}
                  <div className="flex items-center justify-between pt-3"
                       style={{ borderTop: '1px solid var(--border-default)' }}>
                    <span className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-quaternary)' }}>
                      {stat.label}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                style={{ color: stat.color }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Quick Actions - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Quick Actions
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Jump into your workflow
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                      border: '1px solid var(--border-default)',
                      backdropFilter: 'blur(40px)',
                      WebkitBackdropFilter: 'blur(40px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                      animationDelay: `${index * 75}ms`,
                      opacity: 0,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    {/* Hover Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         style={{
                           background: `radial-gradient(circle at top right, ${action.color}15, transparent 70%)`
                         }} />

                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{
                             background: action.gradient,
                             boxShadow: `0 4px 16px ${action.color}40, inset 0 1px 2px rgba(255, 255, 255, 0.15)`
                           }}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold mb-1"
                            style={{ color: 'var(--text-primary)' }}>
                          {action.label}
                        </h3>
                        <p className="text-sm mb-3"
                           style={{ color: 'var(--text-tertiary)' }}>
                          {action.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4" style={{ color: action.color }} />
                          <span className="text-xs font-semibold"
                                style={{ color: action.color }}>
                            Get Started
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity - 1/3 width */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Recent Activity
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Latest updates
              </p>
            </div>

            <div className="rounded-2xl p-6"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(40px)',
                   WebkitBackdropFilter: 'blur(40px)',
                   boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="space-y-4">
                {recentActivity.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index}
                         className="flex items-start gap-3 pb-4"
                         style={{
                           borderBottom: index < recentActivity.length - 1 ? '1px solid var(--border-default)' : 'none'
                         }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                           style={{
                             background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 100%)',
                             border: '1px solid rgba(34, 197, 94, 0.2)'
                           }}>
                        <Icon className="w-4 h-4" style={{ color: 'var(--brand-400)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-1"
                           style={{ color: 'var(--text-secondary)' }}>
                          {item.label}
                        </p>
                        <p className="text-xs"
                           style={{ color: 'var(--text-quaternary)' }}>
                          {item.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30"
                            style={{ color: 'var(--text-quaternary)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-quaternary)' }}>
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Overview Banner */}
        <div className="rounded-2xl p-8"
             style={{
               background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.03) 100%)',
               border: '1px solid rgba(34, 197, 94, 0.2)',
               backdropFilter: 'blur(20px)',
               WebkitBackdropFilter: 'blur(20px)'
             }}>
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                   style={{
                     background: 'var(--gradient-brand)',
                     boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                   }}>
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1"
                    style={{ color: 'var(--brand-400)' }}>
                  Complete 4-Step System
                </h3>
                <p className="text-sm"
                   style={{ color: 'var(--text-tertiary)' }}>
                  Equipment → Employees → Loadouts → Projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-black mb-1"
                     style={{
                       background: 'var(--gradient-brand)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       backgroundClip: 'text'
                     }}>
                  {formatCurrency(totalProjectValue)}
                </div>
                <div className="text-xs uppercase tracking-wider"
                     style={{ color: 'var(--text-quaternary)' }}>
                  Total Pipeline
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
