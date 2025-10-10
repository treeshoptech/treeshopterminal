'use client';

import { useState } from 'react';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Plus,
  Trash2,
  Wrench,
  X,
  Users as UsersIcon,
  Truck,
  ChevronLeft,
  Package,
  TrendingUp,
  Activity,
  DollarSign,
  Zap,
  Sparkles,
  BarChart3,
  Target,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import '@/styles/design-system.css';

import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function LoadoutsPage() {
  const { orgId } = useAuth();

  const equipment = useQuery(api.equipment.list, { organizationId: orgId }) || [];
  const employees = useQuery(api.employees.list, { organizationId: orgId }) || [];
  const loadouts = useQuery(api.loadouts.list, { organizationId: orgId }) || [];
  const createLoadout = useMutation(api.loadouts.create);
  const deleteLoadout = useMutation(api.loadouts.remove);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    loadoutName: '',
    serviceType: 'mulching',
    selectedEquipment: [] as string[],
    selectedEmployees: [] as string[],
    productionRate: 1.3,
  });

  const calculateTotals = () => {
    const equipmentCost = formData.selectedEquipment.reduce((sum, eqId) => {
      const eq = equipment.find((e) => e._id === eqId);
      return sum + (eq?.totalCostPerHour || 0);
    }, 0);

    const laborCost = formData.selectedEmployees.reduce((sum, empId) => {
      const emp = employees.find((e) => e._id === empId);
      return sum + (emp?.trueCostPerHour || 0);
    }, 0);

    return {
      equipment: equipmentCost,
      labor: laborCost,
      total: equipmentCost + laborCost,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totals = calculateTotals();

    const selectedEmps = employees.filter((e) => formData.selectedEmployees.includes(e._id));

    await createLoadout({
      organizationId: orgId,
      loadoutName: formData.loadoutName,
      serviceType: formData.serviceType,
      equipmentIds: formData.selectedEquipment as any,
      employees: selectedEmps.map((emp) => ({
        position: emp.position || '',
        baseWage: emp.baseHourlyRate || 0,
        burdenMultiplier: emp.burdenMultiplier || 1.7,
        trueCostPerHour: emp.trueCostPerHour || 0,
      })),
      totalEquipmentCostPerHour: totals.equipment,
      totalLaborCostPerHour: totals.labor,
      totalLoadoutCostPerHour: totals.total,
      productionRate: formData.productionRate,
    });

    setShowForm(false);
    setFormData({
      loadoutName: '',
      serviceType: 'mulching',
      selectedEquipment: [],
      selectedEmployees: [],
      productionRate: 1.3,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this loadout?')) {
      await deleteLoadout({ id: id as any });
    }
  };

  const totals = calculateTotals();

  const getServiceTypeGradient = (serviceType: string) => {
    switch (serviceType) {
      case 'mulching': return 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)';
      case 'clearing': return 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)';
      case 'stumps': return 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)';
      default: return 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)';
    }
  };

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'mulching': return '#22C55E';
      case 'clearing': return '#8B5CF6';
      case 'stumps': return '#22C55E';
      default: return '#22C55E';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <AuthGuard>
    <>
      <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.25) 0%, transparent 50%),
                   radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.25) 0%, transparent 50%)
                 `
               }} />
          {/* BOLD Animated Gradient Orbs */}
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full animate-pulse"
               style={{
                 background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)',
                 filter: 'blur(80px)',
                 transform: 'translate3d(0, 0, 0)',
                 animationDelay: '1s'
               }} />
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full animate-pulse"
               style={{
                 background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 70%)',
                 filter: 'blur(80px)',
                 animationDelay: '2s',
                 transform: 'translate3d(0, 0, 0)'
               }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    Loadouts
                  </h1>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                       style={{
                         background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)',
                         border: '2px solid rgba(34, 197, 94, 0.4)',
                         backdropFilter: 'blur(30px)',
                         WebkitBackdropFilter: 'blur(30px)',
                         boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)'
                       }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: '#22C55E', filter: '' }} />
                    <span className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: '#22C55E', letterSpacing: '0.1em', textShadow: 'none' }}>
                      Step 03
                    </span>
                  </div>
                </div>
                <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                  Build profitable crew configurations by combining equipment and labor
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
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at top left, rgba(34, 197, 94, 0.3), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Settings className="w-5 h-5" style={{ color: '#22C55E' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Total
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {loadouts.length}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className="w-4 h-4" style={{ color: '#22C55E' }} />
                  <span style={{ color: '#22C55E' }}>Configured loadouts</span>
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
                  <DollarSign className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Avg Cost
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {loadouts.length > 0
                    ? formatCurrency(loadouts.reduce((acc, l) => acc + l.totalLoadoutCostPerHour, 0) / loadouts.length)
                    : '$0.00'}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Per loadout hour
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
                  <Truck className="w-5 h-5" style={{ color: '#22C55E' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Equipment
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {equipment.length}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Available pieces
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(139, 92, 246, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(139, 92, 246, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <UsersIcon className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Crew
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {employees.length}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Available workers
                </div>
              </div>
            </div>
          </div>

          {/* Premium Action Bar */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Configured Loadouts
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {loadouts.length} {loadouts.length === 1 ? 'loadout' : 'loadouts'} ready for projects
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hardware-accelerated"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                color: 'white',
                boxShadow: `
                  0 8px 24px 0 rgba(34, 197, 94, 0.5),
                  0 0 40px rgba(34, 197, 94, 0.3),
                  inset 0 2px 4px rgba(255, 255, 255, 0.2),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                `
              }}
            >
              <Plus className="w-5 h-5" />
              Create Loadout
            </button>
          </div>

          {/* Premium Form Modal */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '900px' }}>
                <div className="modal-header">
                  <div>
                    <h2 className="modal-title">Create New Loadout</h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      Configure equipment and crew for your next project
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="icon-btn glass"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
                      border: '1px solid var(--border-default)'
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                  {/* Basic Configuration Section */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)',
                             border: '2px solid rgba(34, 197, 94, 0.4)',
                             boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
                           }}>
                        <Settings className="w-4 h-4" style={{ color: '#22C55E' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Configuration
                      </h3>
                    </div>
                    <div className="form-grid form-grid-2">
                      <div className="input-group">
                        <label className="input-label">Loadout Name</label>
                        <input
                          className="input-field"
                          value={formData.loadoutName}
                          onChange={(e) => setFormData({ ...formData, loadoutName: e.target.value })}
                          placeholder="e.g., Cat 265 Standard Crew"
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Service Type</label>
                        <select
                          className="input-field select-field"
                          value={formData.serviceType}
                          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        >
                          <option value="mulching">Forestry Mulching</option>
                          <option value="clearing">Land Clearing</option>
                          <option value="stumps">Stump Grinding</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Selection Section */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)',
                             border: '2px solid rgba(34, 197, 94, 0.4)',
                             boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
                           }}>
                        <Truck className="w-4 h-4" style={{ color: 'var(--brand-400)' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Select Equipment ({formData.selectedEquipment.length} selected)
                      </h3>
                    </div>
                    {equipment.length === 0 ? (
                      <div className="text-center py-8 rounded-2xl"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                             border: '2px dashed var(--border-default)'
                           }}>
                        <p style={{ color: 'var(--text-tertiary)' }}>
                          No equipment available.{' '}
                          <Link href="/equipment" className="font-semibold" style={{ color: 'var(--brand-400)' }}>
                            Add equipment first
                          </Link>
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {equipment.map((eq) => (
                          <button
                            key={eq._id}
                            type="button"
                            onClick={() => {
                              if (formData.selectedEquipment.includes(eq._id)) {
                                setFormData({
                                  ...formData,
                                  selectedEquipment: formData.selectedEquipment.filter((id) => id !== eq._id),
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedEquipment: [...formData.selectedEquipment, eq._id],
                                });
                              }
                            }}
                            className="group p-4 rounded-xl text-left transition-all duration-300 hardware-accelerated"
                            style={{
                              background: formData.selectedEquipment.includes(eq._id)
                                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)'
                                : 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                              border: formData.selectedEquipment.includes(eq._id)
                                ? '2px solid rgba(34, 197, 94, 0.4)'
                                : '2px solid var(--border-default)',
                              backdropFilter: 'blur(30px)',
                              WebkitBackdropFilter: 'blur(30px)',
                              boxShadow: formData.selectedEquipment.includes(eq._id)
                                ? '0 8px 24px rgba(34, 197, 94, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                                : '0 4px 12px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                              {eq.equipmentName}
                            </div>
                            <div className="text-sm font-mono font-semibold"
                                 style={{ color: formData.selectedEquipment.includes(eq._id) ? 'var(--brand-400)' : 'var(--text-tertiary)' }}>
                              ${eq.totalCostPerHour.toFixed(2)}/hr
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Employees Section */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)',
                             border: '2px solid rgba(34, 197, 94, 0.4)',
                             boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
                           }}>
                        <UsersIcon className="w-4 h-4" style={{ color: '#22C55E' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Select Crew ({formData.selectedEmployees.length} selected)
                      </h3>
                    </div>
                    {employees.length === 0 ? (
                      <div className="text-center py-8 rounded-2xl"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                             border: '2px dashed var(--border-default)'
                           }}>
                        <p style={{ color: 'var(--text-tertiary)' }}>
                          No employees available.{' '}
                          <Link href="/employees" className="font-semibold" style={{ color: '#22C55E' }}>
                            Add employees first
                          </Link>
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {employees.map((emp) => (
                          <button
                            key={emp._id}
                            type="button"
                            onClick={() => {
                              if (formData.selectedEmployees.includes(emp._id)) {
                                setFormData({
                                  ...formData,
                                  selectedEmployees: formData.selectedEmployees.filter((id) => id !== emp._id),
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedEmployees: [...formData.selectedEmployees, emp._id],
                                });
                              }
                            }}
                            className="group p-4 rounded-xl text-left transition-all duration-300 hardware-accelerated"
                            style={{
                              background: formData.selectedEmployees.includes(emp._id)
                                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)'
                                : 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                              border: formData.selectedEmployees.includes(emp._id)
                                ? '2px solid rgba(34, 197, 94, 0.4)'
                                : '2px solid var(--border-default)',
                              backdropFilter: 'blur(30px)',
                              WebkitBackdropFilter: 'blur(30px)',
                              boxShadow: formData.selectedEmployees.includes(emp._id)
                                ? '0 8px 24px rgba(34, 197, 94, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                                : '0 4px 12px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                              {emp.firstName} {emp.lastName}
                            </div>
                            <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                              {emp.position}
                            </div>
                            <div className="text-sm font-mono font-semibold"
                                 style={{ color: formData.selectedEmployees.includes(emp._id) ? '#22C55E' : 'var(--text-tertiary)' }}>
                              ${emp.trueCostPerHour?.toFixed(2) || '0.00'}/hr
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Production Rate */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
                             border: '2px solid rgba(139, 92, 246, 0.4)',
                             boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
                           }}>
                        <Zap className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Production Rate
                      </h3>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Inch-Acres per Hour</label>
                      <input
                        className="input-field"
                        type="number"
                        step="0.1"
                        value={formData.productionRate}
                        onChange={(e) => setFormData({ ...formData, productionRate: Number(e.target.value) })}
                        onFocus={(e: any) => e.target.select()}
                        placeholder="1.3"
                      />
                      <p className="text-xs mt-2" style={{ color: 'var(--text-quaternary)' }}>
                        e.g., 1.3 for Cat 265, 5.0 for SK200TR
                      </p>
                    </div>
                  </div>

                  {/* Premium Cost Summary */}
                  <div className="p-6 rounded-2xl"
                       style={{
                         background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)',
                         border: '2px solid rgba(34, 197, 94, 0.4)',
                         backdropFilter: 'blur(60px)',
                         WebkitBackdropFilter: 'blur(60px)',
                         boxShadow: '0 16px 48px rgba(34, 197, 94, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.15)'
                       }}>
                    <div className="flex items-center gap-2 mb-5">
                      <BarChart3 className="w-5 h-5" style={{ color: '#22C55E' }} />
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: '#22C55E', letterSpacing: '0.1em' }}>
                        Loadout Cost Breakdown
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <div className="text-center p-4 rounded-xl"
                           style={{
                             background: 'rgba(0, 0, 0, 0.3)',
                             border: '1px solid rgba(255, 255, 255, 0.1)'
                           }}>
                        <div className="text-xs uppercase tracking-wider mb-2"
                             style={{ color: 'rgba(255,255,255,0.6)' }}>
                          Equipment
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'white' }}>
                          ${totals.equipment.toFixed(2)}
                          <span className="text-sm font-normal">/hr</span>
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl"
                           style={{
                             background: 'rgba(0, 0, 0, 0.3)',
                             border: '1px solid rgba(255, 255, 255, 0.1)'
                           }}>
                        <div className="text-xs uppercase tracking-wider mb-2"
                             style={{ color: 'rgba(255,255,255,0.6)' }}>
                          Labor
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'white' }}>
                          ${totals.labor.toFixed(2)}
                          <span className="text-sm font-normal">/hr</span>
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl"
                           style={{
                             background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                             boxShadow: '0 8px 24px rgba(34, 197, 94, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                           }}>
                        <div className="text-xs uppercase tracking-wider mb-2"
                             style={{ color: 'rgba(255,255,255,0.8)' }}>
                          Total Cost
                        </div>
                        <div className="text-3xl font-bold" style={{ color: 'white' }}>
                          ${totals.total.toFixed(2)}
                          <span className="text-sm font-normal">/hr</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-md"
                    style={{
                      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                      color: 'white',
                      boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    Save Loadout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loadouts Grid */}
          {loadouts.length === 0 ? (
            <div className="empty-state glass rounded-3xl p-12"
                 style={{
                   background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0.4) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)'
                 }}>
              <Wrench className="empty-icon mx-auto mb-6" style={{ opacity: 0.3 }} />
              <h3 className="empty-title">No loadouts configured</h3>
              <p className="empty-description">
                Create your first loadout by combining equipment and crew members.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-lg mt-4"
                style={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  color: 'white',
                  boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                }}
              >
                <Plus className="w-5 h-5" />
                Create Your First Loadout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadouts.map((loadout) => {
                const serviceColor = getServiceTypeColor(loadout.serviceType);
                const serviceGradient = getServiceTypeGradient(loadout.serviceType);
                return (
    <AuthGuard>
                  <div key={loadout._id} className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hardware-accelerated"
                       style={{
                         background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                         border: `2px solid ${serviceColor}33`,
                         backdropFilter: 'blur(60px)',
                         WebkitBackdropFilter: 'blur(60px)',
                         boxShadow: `0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px ${serviceColor}20, inset 0 2px 4px rgba(255, 255, 255, 0.08)`,
                         transform: 'translateZ(0)'
                       }}>
                    {/* BOLD Background Gradient */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         style={{
                           background: `radial-gradient(circle at top left, ${serviceColor}40, transparent 70%)`,
                           boxShadow: `inset 0 0 80px ${serviceColor}30`
                         }} />

                    <div className="relative p-6">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2"
                              style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                            {loadout.loadoutName}
                          </h3>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold capitalize"
                                style={{
                                  background: `linear-gradient(135deg, ${serviceColor}30, ${serviceColor}20)`,
                                  color: serviceColor,
                                  border: `1px solid ${serviceColor}40`
                                }}>
                            {loadout.serviceType}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(loadout._id)}
                          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                          style={{
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}
                        >
                          <Trash2 className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                        </button>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between p-3 rounded-xl"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Equipment</span>
                          </div>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            ${loadout.totalEquipmentCostPerHour.toFixed(2)}/hr
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <div className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Labor</span>
                          </div>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            ${loadout.totalLaborCostPerHour.toFixed(2)}/hr
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Production</span>
                          </div>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {loadout.productionRate.toFixed(1)} IA/hr
                          </span>
                        </div>
                      </div>

                      {/* Premium Total Display */}
                      <div className="pt-4 mt-4"
                           style={{ borderTop: '1px solid var(--border-default)' }}>
                        <div className="flex justify-between items-end">
                          <span className="text-xs uppercase tracking-wider"
                                style={{ color: 'var(--text-quaternary)' }}>
                            Total Cost
                          </span>
                          <div className="text-3xl font-bold"
                               style={{
                                 background: serviceGradient,
                                 WebkitBackgroundClip: 'text',
                                 WebkitTextFillColor: 'transparent',
                                 backgroundClip: 'text',
                                 filter: `drop-shadow(0 0 20px ${serviceColor}60)`
                               }}>
                            ${loadout.totalLoadoutCostPerHour.toFixed(2)}
                            <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>
                              /hr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
    </AuthGuard>
  );
}
