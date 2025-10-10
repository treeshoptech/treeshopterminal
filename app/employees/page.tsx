'use client';

import { useState } from 'react';
import { NavBar } from '@/components/ui/NavBar';
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
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import '@/styles/design-system.css';

export default function EmployeesPage() {
  const orgId = 'org_demo';

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

  return (
    <>
      <NavBar />
      <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/"
                className="icon-btn icon-btn-sm"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Team Management
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Manage your employees and calculate labor costs
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stat-card">
              <div className="stat-label">Total Employees</div>
              <div className="stat-value">{employees.length}</div>
              <div className="stat-change stat-change-positive">
                <TrendingUp className="w-4 h-4" />
                Active team
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Base Rate</div>
              <div className="stat-value">
                {employees.length > 0
                  ? formatCurrency(employees.reduce((acc, e) => acc + (e.baseHourlyRate || 0), 0) / employees.length)
                  : '$0.00'}
              </div>
              <div className="stat-change" style={{ color: 'var(--text-tertiary)' }}>
                Per hour
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg True Cost</div>
              <div className="stat-value">
                {employees.length > 0
                  ? formatCurrency(employees.reduce((acc, e) => acc + (e.trueCostPerHour || 0), 0) / employees.length)
                  : '$0.00'}
              </div>
              <div className="stat-change" style={{ color: 'var(--text-tertiary)' }}>
                With burden
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Labor Cost</div>
              <div className="stat-value">
                {formatCurrency(employees.reduce((acc, e) => acc + (e.trueCostPerHour || 0), 0))}
              </div>
              <div className="stat-change" style={{ color: 'var(--text-tertiary)' }}>
                Per hour
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Team Members
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {employees.length} {employees.length === 1 ? 'employee' : 'employees'} in your organization
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary btn-md"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                  <div>
                    <h2 className="modal-title">Add New Employee</h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      Configure employee details and burden rates
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="icon-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                  {/* Personal Information */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{ color: 'var(--text-tertiary)' }}>
                      Personal Information
                    </h3>
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
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{ color: 'var(--text-tertiary)' }}>
                      Contact Information
                    </h3>
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
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{ color: 'var(--text-tertiary)' }}>
                      Position & Compensation
                    </h3>
                    <div className="space-y-4">
                      <div className="input-group">
                        <label className="input-label">Position</label>
                        <input
                          className="input-field"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          placeholder="e.g., Equipment Operator, Ground Crew"
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

                  {/* Cost Summary */}
                  <div className="p-6 rounded-xl mb-6"
                       style={{
                         background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                         border: '1px solid rgba(59, 130, 246, 0.2)'
                       }}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{ color: '#60A5FA' }}>
                      Calculated Labor Cost
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          Base Rate
                        </div>
                        <div className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(formData.baseHourlyRate)}/hr
                        </div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          Burden
                        </div>
                        <div className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                          {formData.burdenMultiplier}x
                        </div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          True Cost
                        </div>
                        <div className="text-2xl font-bold mt-1" style={{ color: '#60A5FA' }}>
                          {formatCurrency(trueCost)}/hr
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
                  >
                    Save Employee
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Employees Grid */}
          {employees.length === 0 ? (
            <div className="empty-state">
              <UsersIcon className="empty-icon" />
              <h3 className="empty-title">No employees yet</h3>
              <p className="empty-description">
                Start building your team by adding your first employee.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary btn-md"
              >
                <Plus className="w-4 h-4" />
                Add Your First Employee
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((emp) => (
                <div key={emp._id} className="card group">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                           style={{
                             background: 'linear-gradient(135deg, var(--brand-500), var(--brand-600))',
                             color: 'white'
                           }}>
                        {emp.firstName?.[0]}{emp.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                          {emp.firstName} {emp.lastName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {emp.position && (
                            <span className={`badge ${getPositionBadgeColor(emp.position)}`}>
                              {emp.position}
                            </span>
                          )}
                          <span className="badge badge-success">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="icon-btn icon-btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--color-error)' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {emp.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {emp.email}
                        </span>
                      </div>
                    )}
                    {emp.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {emp.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b"
                         style={{ borderColor: 'var(--border-default)' }}>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          Base Wage
                        </span>
                      </div>
                      <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(emp.baseHourlyRate || 0)}/hr
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b"
                         style={{ borderColor: 'var(--border-default)' }}>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          Burden Rate
                        </span>
                      </div>
                      <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                        {emp.burdenMultiplier?.toFixed(1) || '1.7'}x
                      </span>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-xs uppercase tracking-wider"
                                style={{ color: 'var(--text-quaternary)' }}>
                            True Hourly Cost
                          </span>
                        </div>
                        <div className="text-2xl font-bold" style={{ color: '#60A5FA' }}>
                          {formatCurrency(emp.trueCostPerHour || 0)}
                          <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>
                            /hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employee Details */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-quaternary)' }}>
                        {getMultiplierLabel(emp.burdenMultiplier || 1.7)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}