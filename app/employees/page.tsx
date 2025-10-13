'use client';

import { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Plus,
  Trash2,
  X,
  Users as UsersIcon,
  DollarSign,
  TrendingUp,
  Award,
  Briefcase,
  Mail,
  Phone,
  User,
  ChevronLeft,
  Activity,
  BarChart3,
  Shield,
  Sparkles,
  UserCheck,
  Coins,
  Building,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import '@/styles/design-system.css';


export default function EmployeesPage() {
  const { organizationId: orgId } = useOrganization();

  const employees = useQuery(api.employees.list, { organizationId: orgId }) || [];
  const createEmployee = useMutation(api.employees.create);
  const deleteEmployee = useMutation(api.employees.remove);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    baseHourlyRate: 35,
    burdenMultiplier: 1.7,
  });

  const trueCost = formData.baseHourlyRate * formData.burdenMultiplier;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createEmployee({
      organizationId: orgId,
      ...formData,
      trueCostPerHour: trueCost,
      status: 'active',
    });

    setShowForm(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      baseHourlyRate: 35,
      burdenMultiplier: 1.7,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this employee?')) {
      await deleteEmployee({ id: id as any });
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

  const getMultiplierLabel = (multiplier: number) => {
    switch (multiplier) {
      case 1.6: return 'Entry Ground Crew';
      case 1.7: return 'Experienced Climber';
      case 1.8: return 'Crew Leader';
      case 1.9: return 'Certified Arborist';
      case 2.0: return 'Specialized Operator';
      default: return 'Standard';
    }
  };

  const getPositionBadgeColor = (position: string) => {
    const lowerPos = position?.toLowerCase() || '';
    if (lowerPos.includes('operator')) return 'badge-warning';
    if (lowerPos.includes('lead') || lowerPos.includes('leader')) return 'badge-error';
    if (lowerPos.includes('arborist')) return 'badge-success';
    return 'badge-info';
  };

  const getPositionGradient = (position: string) => {
    const lowerPos = position?.toLowerCase() || '';
    if (lowerPos.includes('operator')) return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
    if (lowerPos.includes('lead') || lowerPos.includes('leader')) return 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
    if (lowerPos.includes('arborist')) return 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)';
    return 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)';
  };

  return (
    
    
      <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.04) 0%, transparent 40%),
                   radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.04) 0%, transparent 40%)
                 `
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
                    Team Management
                  </h1>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                       style={{
                         background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 100%)',
                         border: '1px solid rgba(34, 197, 94, 0.2)'
                       }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />
                    <span className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: '#22C55E' }}>
                      Step 02
                    </span>
                  </div>
                </div>
                <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                  Manage your employees and calculate true labor costs with burden multipliers
                </p>
              </div>
            </div>
          </div>

          {/* Premium Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(10, 10, 10, 0.95) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(40px)',
                   WebkitBackdropFilter: 'blur(40px)',
                   boxShadow: 'var(--shadow-lg)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at top left, rgba(34, 197, 94, 0.1), transparent 70%)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <UsersIcon className="w-5 h-5" style={{ color: '#22C55E' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Team
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {employees.length}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className="w-4 h-4" style={{ color: '#22C55E' }} />
                  <span style={{ color: '#22C55E' }}>Active members</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(10, 10, 10, 0.95) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(40px)',
                   WebkitBackdropFilter: 'blur(40px)',
                   boxShadow: 'var(--shadow-lg)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at top right, rgba(34, 197, 94, 0.1), transparent 70%)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Coins className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Base Rate
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {employees.length > 0
                    ? formatCurrency(employees.reduce((acc, e) => acc + (e.baseHourlyRate || 0), 0) / employees.length)
                    : '$0.00'}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Average per hour
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(10, 10, 10, 0.95) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(40px)',
                   WebkitBackdropFilter: 'blur(40px)',
                   boxShadow: 'var(--shadow-lg)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.1), transparent 70%)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Shield className="w-5 h-5" style={{ color: '#F59E0B' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    True Cost
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {employees.length > 0
                    ? formatCurrency(employees.reduce((acc, e) => acc + (e.trueCostPerHour || 0), 0) / employees.length)
                    : '$0.00'}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  With burden
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(10, 10, 10, 0.95) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(40px)',
                   WebkitBackdropFilter: 'blur(40px)',
                   boxShadow: 'var(--shadow-lg)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.1), transparent 70%)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <BarChart3 className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Total
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {formatCurrency(employees.reduce((acc, e) => acc + (e.trueCostPerHour || 0), 0))}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Labor cost per hour
                </div>
              </div>
            </div>
          </div>

          {/* Premium Action Bar */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Team Members
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {employees.length} {employees.length === 1 ? 'employee' : 'employees'} in your organization
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hardware-accelerated"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                color: 'white',
                boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
              }}
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>

          {/* Premium Form Modal */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '640px' }}>
                <div className="modal-header">
                  <div>
                    <h2 className="modal-title">Add New Employee</h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      Configure employee details and calculate true labor costs
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
                  {/* Personal Information */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%)',
                             border: '1px solid rgba(34, 197, 94, 0.3)'
                           }}>
                        <User className="w-4 h-4" style={{ color: '#22C55E' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Personal Information
                      </h3>
                    </div>
                    <div className="form-grid form-grid-2">
                      <div className="input-group">
                        <label className="input-label">First Name</label>
                        <input
                          className="input-field"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Last Name</label>
                        <input
                          className="input-field"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%)',
                             border: '1px solid rgba(34, 197, 94, 0.3)'
                           }}>
                        <Mail className="w-4 h-4" style={{ color: 'var(--brand-400)' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Contact Information
                      </h3>
                    </div>
                    <div className="form-grid form-grid-2">
                      <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                          className="input-field"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john.doe@example.com"
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Phone</label>
                        <input
                          className="input-field"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Position & Compensation */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
                             border: '1px solid rgba(245, 158, 11, 0.3)'
                           }}>
                        <Briefcase className="w-4 h-4" style={{ color: '#F59E0B' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Position & Compensation
                      </h3>
                    </div>
                    <div className="space-y-5">
                      <div className="input-group">
                        <label className="input-label">Position</label>
                        <input
                          className="input-field"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          placeholder="e.g., Equipment Operator, Ground Crew, Crew Leader"
                        />
                      </div>
                      <div className="form-grid form-grid-2">
                        <div className="input-group">
                          <label className="input-label">Base Hourly Rate</label>
                          <input
                            className="input-field"
                            type="number"
                            value={formData.baseHourlyRate}
                            onChange={(e) => setFormData({ ...formData, baseHourlyRate: Number(e.target.value) })}
                            onFocus={(e) => e.target.select()}
                            placeholder="35"
                          />
                        </div>
                        <div className="input-group">
                          <label className="input-label">Burden Multiplier</label>
                          <select
                            className="input-field select-field"
                            value={formData.burdenMultiplier}
                            onChange={(e) => setFormData({ ...formData, burdenMultiplier: Number(e.target.value) })}
                          >
                            <option value={1.6}>Entry Ground Crew (1.6x)</option>
                            <option value={1.7}>Experienced Climber (1.7x)</option>
                            <option value={1.8}>Crew Leader (1.8x)</option>
                            <option value={1.9}>Certified Arborist (1.9x)</option>
                            <option value={2.0}>Specialized Operator (2.0x)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Cost Summary */}
                  <div className="p-6 rounded-2xl mb-6"
                       style={{
                         background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.03) 100%)',
                         border: '1px solid rgba(34, 197, 94, 0.2)',
                         backdropFilter: 'blur(10px)',
                         WebkitBackdropFilter: 'blur(10px)'
                       }}>
                    <div className="flex items-center gap-2 mb-5">
                      <DollarSign className="w-5 h-5" style={{ color: '#4ADE80' }} />
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: '#4ADE80', letterSpacing: '0.1em' }}>
                        Calculated Labor Cost
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <div className="text-center p-4 rounded-xl"
                           style={{
                             background: 'rgba(0, 0, 0, 0.2)',
                             border: '1px solid var(--border-default)'
                           }}>
                        <div className="text-xs uppercase tracking-wider mb-2"
                             style={{ color: 'var(--text-quaternary)' }}>
                          Base Rate
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(formData.baseHourlyRate)}
                          <span className="text-sm font-normal">/hr</span>
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl"
                           style={{
                             background: 'rgba(0, 0, 0, 0.2)',
                             border: '1px solid var(--border-default)'
                           }}>
                        <div className="text-xs uppercase tracking-wider mb-2"
                             style={{ color: 'var(--text-quaternary)' }}>
                          Burden
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          {formData.burdenMultiplier}x
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl"
                           style={{
                             background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                             boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.35)'
                           }}>
                        <div className="text-xs uppercase tracking-wider mb-2"
                             style={{ color: 'rgba(255,255,255,0.8)' }}>
                          True Cost
                        </div>
                        <div className="text-3xl font-bold" style={{ color: 'white' }}>
                          {formatCurrency(trueCost)}
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
                    className="btn btn-primary btn-md"
                    style={{
                      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                    }}
                  >
                    Save Employee
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Premium Employee Grid */}
          {employees.length === 0 ? (
            <div className="empty-state glass rounded-3xl p-12"
                 style={{
                   background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0.4) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)'
                 }}>
              <UsersIcon className="empty-icon mx-auto mb-6" style={{ opacity: 0.3 }} />
              <h3 className="empty-title">No employees yet</h3>
              <p className="empty-description">
                Start building your team by adding your first employee.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary btn-lg mt-4"
                style={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                }}
              >
                <Plus className="w-5 h-5" />
                Add Your First Employee
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((emp) => (
                <div key={emp._id} className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hardware-accelerated"
                     style={{
                       background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(10, 10, 10, 0.98) 100%)',
                       border: '1px solid var(--border-default)',
                       backdropFilter: 'blur(40px)',
                       WebkitBackdropFilter: 'blur(40px)',
                       boxShadow: 'var(--shadow-lg)',
                       transform: 'translateZ(0)'
                     }}>
                  {/* Premium Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       style={{
                         background: 'radial-gradient(circle at top left, rgba(34, 197, 94, 0.1), transparent 70%)'
                       }} />

                  <div className="relative p-6">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg"
                             style={{
                               background: getPositionGradient(emp.position || ''),
                               color: 'white',
                               boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                             }}>
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-2"
                              style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                            {emp.firstName} {emp.lastName}
                          </h3>
                          <div className="flex items-center gap-2">
                            {emp.position && (
                              <span className={`badge ${getPositionBadgeColor(emp.position)}`}>
                                {emp.position}
                              </span>
                            )}
                            <span className="badge badge-success">
                              <UserCheck className="w-3 h-3" />
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="icon-btn icon-btn-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                          border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <Trash2 className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                      </button>
                    </div>

                    {/* Contact Info with Premium Styling */}
                    {(emp.email || emp.phone) && (
                      <div className="space-y-2 mb-5 p-3 rounded-xl"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                             border: '1px solid var(--border-default)'
                           }}>
                        {emp.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
                            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                              {emp.email}
                            </span>
                          </div>
                        )}
                        {emp.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
                            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                              {emp.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cost Breakdown with Premium Design */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-xl"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                             border: '1px solid var(--border-default)'
                           }}>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            Base Wage
                          </span>
                        </div>
                        <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(emp.baseHourlyRate || 0)}/hr
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-xl"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                             border: '1px solid var(--border-default)'
                           }}>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            Burden Rate
                          </span>
                        </div>
                        <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {emp.burdenMultiplier?.toFixed(1) || '1.7'}x
                        </span>
                      </div>

                      {/* Premium Total Cost Display */}
                      <div className="pt-4 mt-4"
                           style={{ borderTop: '1px solid var(--border-default)' }}>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-xs uppercase tracking-wider"
                                  style={{ color: 'var(--text-quaternary)' }}>
                              True Hourly Cost
                            </span>
                          </div>
                          <div className="text-3xl font-bold"
                               style={{
                                 background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                                 WebkitBackgroundClip: 'text',
                                 WebkitTextFillColor: 'transparent',
                                 backgroundClip: 'text'
                               }}>
                            {formatCurrency(emp.trueCostPerHour || 0)}
                            <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>
                              /hr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Employee Metadata */}
                    <div className="flex items-center justify-between mt-5 pt-4"
                         style={{ borderTop: '1px solid var(--border-default)' }}>
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-quaternary)' }}>
                          {getMultiplierLabel(emp.burdenMultiplier || 1.7)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-quaternary)' }}>
                          Full-time
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    
    
  );
}