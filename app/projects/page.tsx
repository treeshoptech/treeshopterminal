'use client';

import { useState } from 'react';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Plus,
  FileText,
  ChevronLeft,
  DollarSign,
  TrendingUp,
  Activity,
  Sparkles,
  BarChart3,
  Calculator,
  Target,
  Zap,
  Settings,
  Package,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import '@/styles/design-system.css';

import { useAuth } from '@/hooks/useAuth';

export default function ProjectsPage() {
  const { orgId } = useAuth();

  const loadouts = useQuery(api.loadouts.list, { organizationId: orgId }) || [];
  const [selectedLoadout, setSelectedLoadout] = useState('');
  const [projectData, setProjectData] = useState({
    projectName: '',
    acres: 0,
    dbhPackage: 8,
    profitMargin: 40,
  });

  const loadout = loadouts.find((l) => l._id === selectedLoadout);
  const loadoutCost = loadout?.totalLoadoutCostPerHour || 0;
  const billingRate = loadoutCost / (1 - projectData.profitMargin / 100);
  const inchAcres = projectData.acres * projectData.dbhPackage;
  const productionRate = loadout?.productionRate || 1.3;
  const hours = inchAcres / productionRate;
  const totalPrice = hours * billingRate;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                   radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.25) 0%, transparent 50%)
                 `
               }} />
          {/* BOLD Animated Gradient Orbs */}
               style={{
                 background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)',
                 filter: 'blur(80px)',
                 transform: 'translate3d(0, 0, 0)',
                 animationDelay: '0.5s'
               }} />
               style={{
                 background: 'radial-gradient(circle, rgba(34, 197, 94, 0.35) 0%, rgba(34, 197, 94, 0.15) 40%, transparent 70%)',
                 filter: 'blur(80px)',
                 animationDelay: '1.5s',
                 transform: 'translate3d(0, 0, 0)'
               }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Premium Header Section */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-8">
              <Link
                href="/"
                className="group mt-1 p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
                  border: '1px solid var(--border-default)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                             style={{ color: 'var(--text-secondary)' }} />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl sm:text-5xl font-black"
                      style={{
                        background: 'linear-gradient(180deg, var(--text-primary) 0%, rgba(255,255,255,0.8) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.02em'
                      }}>
                    Price Projects
                  </h1>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                       style={{
                         background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%)',
                         border: '2px solid rgba(34, 197, 94, 0.5)',
                         backdropFilter: 'blur(30px)',
                         WebkitBackdropFilter: 'blur(30px)',
                         boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.15)'
                       }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: '#22C55E', filter: '' }} />
                    <span className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: '#22C55E', letterSpacing: '0.1em', textShadow: 'none' }}>
                      Step 04
                    </span>
                  </div>
                </div>
                <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                  Calculate project pricing with confidence using your configured loadouts
                </p>
              </div>
            </div>
          </div>

          {/* ULTRA-Premium Stats Cards with BOLD Glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at top left, rgba(34, 197, 94, 0.3), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-5 h-5" style={{ color: '#22C55E' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Loadouts
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {loadouts.length}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className="w-4 h-4" style={{ color: '#22C55E' }} />
                  <span style={{ color: '#22C55E' }}>Available configs</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at top right, rgba(34, 197, 94, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Calculator className="w-5 h-5" style={{ color: '#22C55E' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Margin
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {projectData.profitMargin}%
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Target profit
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Activity className="w-5 h-5" style={{ color: '#16A34A' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Acres
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {projectData.acres}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Project size
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Price
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {selectedLoadout && !isNaN(totalPrice) ? formatCurrency(totalPrice) : '$0'}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Total estimate
                </div>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          {loadouts.length === 0 ? (
            <div className="empty-state glass rounded-3xl p-12"
                 style={{
                   background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0.4) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)'
                 }}>
              <FileText className="empty-icon mx-auto mb-6" style={{ opacity: 0.3 }} />
              <h3 className="empty-title">No loadouts available</h3>
              <p className="empty-description">
                Create a loadout first to start pricing projects
              </p>
              <Link href="/loadouts">
                <button
                  className="btn btn-lg mt-4"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    color: 'white',
                    boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Plus className="w-5 h-5" />
                  Go to Loadouts
                </button>
              </Link>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 60px rgba(34, 197, 94, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              {/* Premium Glow Effect */}
              <div className="absolute inset-0"
                   style={{
                     background: 'radial-gradient(circle at top center, rgba(34, 197, 94, 0.15), transparent 60%)',
                     pointerEvents: 'none'
                   }} />

              <div className="relative p-6 md:p-8 space-y-8 md:space-y-10">
                {/* Project Details Section */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{
                           background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%)',
                           border: '2px solid rgba(34, 197, 94, 0.5)',
                           boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)'
                         }}>
                      <Settings className="w-5 h-5" style={{ color: '#22C55E' }} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                      Project Details
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="input-group">
                      <label className="input-label">Project Name</label>
                      <input
                        className="input-field"
                        value={projectData.projectName}
                        onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                        placeholder="Smith Property - New Smyrna Beach"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Select Loadout</label>
                      <select
                        className="input-field select-field"
                        value={selectedLoadout}
                        onChange={(e) => setSelectedLoadout(e.target.value)}
                      >
                        <option value="">Choose a loadout...</option>
                        {loadouts.map((l) => (
                          <option key={l._id} value={l._id}>
                            {l.loadoutName} - {formatCurrency(l.totalLoadoutCostPerHour)}/hr
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {selectedLoadout && (
                  <>
                    {/* Project Parameters Section */}
                    <div className="space-y-6">
                      {/* LARGE Acreage Input */}
                      <div>
                        <label className="block text-sm font-semibold mb-3 uppercase tracking-wider"
                               style={{ color: 'var(--text-secondary)' }}>
                          Project Acreage
                        </label>
                        <input
                          className="w-full text-center px-6 py-8 rounded-2xl font-mono text-6xl font-black"
                          style={{
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
                            border: '2px solid rgba(34, 197, 94, 0.4)',
                            color: '#22C55E',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                          }}
                          type="number"
                          step="0.1"
                          value={projectData.acres || ''}
                          onChange={(e) => setProjectData({ ...projectData, acres: Number(e.target.value) || 0 })}
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                        />
                      </div>

                      {/* DBH Package */}
                      <div>
                        <label className="block text-sm font-semibold mb-3 uppercase tracking-wider"
                               style={{ color: 'var(--text-secondary)' }}>
                          DBH Package
                        </label>
                        <select
                          className="w-full px-6 py-5 rounded-xl font-semibold text-xl text-center"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                            border: '2px solid var(--border-default)',
                            color: 'var(--text-primary)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                          }}
                          value={projectData.dbhPackage}
                          onChange={(e) => setProjectData({ ...projectData, dbhPackage: Number(e.target.value) })}
                        >
                          <option value={4}>Small (4")</option>
                          <option value={6}>Medium (6")</option>
                          <option value={8}>Large (8")</option>
                          <option value={10}>XLarge (10")</option>
                          <option value={12}>Max (12")</option>
                        </select>
                      </div>
                    </div>

                    {/* Profit Margin Section */}
                    <div>
                      <label className="block text-sm font-semibold mb-3 uppercase tracking-wider"
                             style={{ color: 'var(--text-secondary)' }}>
                        Profit Margin (%)
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setProjectData({ ...projectData, profitMargin: Math.max(0, projectData.profitMargin - 5) })}
                          className="w-16 h-16 rounded-xl transition-all duration-200 active:scale-95"
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '2px solid rgba(34, 197, 94, 0.3)',
                            color: '#22C55E'
                          }}
                        >
                          <Minus className="w-6 h-6 mx-auto" />
                        </button>
                        <input
                          type="number"
                          className="flex-1 text-center px-4 py-6 rounded-xl font-mono text-4xl font-bold"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '2px solid var(--border-default)',
                            color: '#22C55E'
                          }}
                          value={projectData.profitMargin}
                          onChange={(e) => setProjectData({ ...projectData, profitMargin: Number(e.target.value) })}
                        />
                        <button
                          type="button"
                          onClick={() => setProjectData({ ...projectData, profitMargin: Math.min(100, projectData.profitMargin + 5) })}
                          className="w-16 h-16 rounded-xl transition-all duration-200 active:scale-95"
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '2px solid rgba(34, 197, 94, 0.3)',
                            color: '#22C55E'
                          }}
                        >
                          <Plus className="w-6 h-6 mx-auto" />
                        </button>
                      </div>
                    </div>

                    {/* Calculation Breakdown */}
                    <div className="p-5 md:p-6 rounded-2xl"
                         style={{
                           background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
                           border: '1px solid rgba(34, 197, 94, 0.3)',
                           backdropFilter: 'blur(30px)',
                           WebkitBackdropFilter: 'blur(30px)'
                         }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Calculator className="w-5 h-5" style={{ color: '#22C55E' }} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider"
                            style={{ color: '#22C55E', letterSpacing: '0.1em' }}>
                          Calculation Breakdown
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-3 rounded-xl"
                             style={{
                               background: 'rgba(0, 0, 0, 0.2)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Inch-Acres</span>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {inchAcres.toFixed(2)} IA
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl"
                             style={{
                               background: 'rgba(0, 0, 0, 0.2)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Production Hours</span>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {hours.toFixed(2)} hrs
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl"
                             style={{
                               background: 'rgba(0, 0, 0, 0.2)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loadout Cost</span>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {formatCurrency(loadoutCost)}/hr
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl"
                             style={{
                               background: 'rgba(0, 0, 0, 0.2)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Billing Rate</span>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {formatCurrency(billingRate)}/hr
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Clean Final Price Display */}
                    <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 text-center"
                         style={{
                           background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.15) 100%)',
                           border: '2px solid rgba(34, 197, 94, 0.4)',
                           backdropFilter: 'blur(40px)',
                           WebkitBackdropFilter: 'blur(40px)',
                           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                         }}>

                      <div className="relative">
                        <div className="text-sm uppercase tracking-wider font-semibold mb-4"
                             style={{
                               color: 'rgba(255,255,255,0.7)',
                               letterSpacing: '0.15em'
                             }}>
                          Total Project Price
                        </div>
                        <div className="text-6xl md:text-7xl font-black font-mono mb-3"
                             style={{
                               color: 'white',
                               letterSpacing: '-0.02em'
                             }}>
                          {formatCurrency(totalPrice)}
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                             style={{
                               background: 'rgba(0, 0, 0, 0.3)',
                               backdropFilter: 'blur(10px)',
                               WebkitBackdropFilter: 'blur(10px)',
                               border: '1px solid rgba(255, 255, 255, 0.2)'
                             }}>
                          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {projectData.profitMargin}% profit margin • {hours.toFixed(1)} hours • {inchAcres.toFixed(1)} IA
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
