'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Plus,
  Edit,
  Trash2,
  Truck,
  X,
  DollarSign,
  Clock,
  TrendingUp,
  Fuel,
  Wrench,
  Shield,
  Calculator,
  ChevronLeft,
  Activity,
  BarChart3,
  Zap,
  Package,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NavBar } from '@/components/ui/NavBar';
import Link from 'next/link';
import '@/styles/design-system.css';

export default function EquipmentLibraryPage() {
  const equipment = useQuery(api.equipment.list, { organizationId: 'org_demo' }) || [];
  const createEquipment = useMutation(api.equipment.create);
  const deleteEquipment = useMutation(api.equipment.remove);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    equipmentName: '',
    category: 'truck',
    purchasePrice: 0,
    usefulLifeYears: 7,
    annualHours: 1500,
    annualFinanceCost: 0,
    annualInsurance: 0,
    annualRegistration: 0,
    fuelGallonsPerHour: 0,
    fuelPricePerGallon: 3.75,
    annualMaintenance: 0,
    annualRepairs: 0,
  });

  const calculate = () => {
    const annualDepreciation = formData.purchasePrice / formData.usefulLifeYears;
    const totalOwnership =
      annualDepreciation + formData.annualFinanceCost + formData.annualInsurance + formData.annualRegistration;
    const ownershipPerHour = totalOwnership / formData.annualHours;

    const fuelPerHour = formData.fuelGallonsPerHour * formData.fuelPricePerGallon;
    const maintenancePerHour = formData.annualMaintenance / formData.annualHours;
    const repairsPerHour = formData.annualRepairs / formData.annualHours;
    const operatingPerHour = fuelPerHour + maintenancePerHour + repairsPerHour;

    return {
      ownershipCostPerHour: ownershipPerHour,
      operatingCostPerHour: operatingPerHour,
      totalCostPerHour: ownershipPerHour + operatingPerHour,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const costs = calculate();

    await createEquipment({
      organizationId: 'org_demo',
      ...formData,
      ...costs,
      status: 'active',
    });

    setShowForm(false);
    setFormData({
      equipmentName: '',
      category: 'truck',
      purchasePrice: 0,
      usefulLifeYears: 7,
      annualHours: 1500,
      annualFinanceCost: 0,
      annualInsurance: 0,
      annualRegistration: 0,
      fuelGallonsPerHour: 0,
      fuelPricePerGallon: 3.75,
      annualMaintenance: 0,
      annualRepairs: 0,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      await deleteEquipment({ id: id as any });
    }
  };

  const costs = calculate();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'truck': return <Truck className="w-5 h-5" />;
      case 'mulcher': return <Wrench className="w-5 h-5" />;
      case 'grinder': return <Shield className="w-5 h-5" />;
      default: return <Calculator className="w-5 h-5" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'truck': return 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)';
      case 'mulcher': return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      case 'grinder': return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
      default: return 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)';
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
    <>
      <NavBar />
      <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.04) 0%, transparent 40%),
                   radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 40%)
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
                    Equipment Library
                  </h1>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                       style={{
                         background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 100%)',
                         border: '1px solid rgba(34, 197, 94, 0.2)'
                       }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--brand-400)' }} />
                    <span className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--brand-400)' }}>
                      Step 01
                    </span>
                  </div>
                </div>
                <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                  Track your fleet costs with precision and calculate hourly operating expenses
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
                     background: 'radial-gradient(circle at top left, rgba(34, 197, 94, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Fleet
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {equipment.length}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--brand-400)' }} />
                  <span style={{ color: 'var(--brand-400)' }}>Active equipment</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(59, 130, 246, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(59, 130, 246, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <BarChart3 className="w-5 h-5" style={{ color: '#3B82F6' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Avg Cost
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {equipment.length > 0
                    ? formatCurrency(equipment.reduce((acc, e) => acc + e.totalCostPerHour, 0) / equipment.length)
                    : '$0.00'}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Per equipment hour
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(245, 158, 11, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(245, 158, 11, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(245, 158, 11, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-5 h-5" style={{ color: '#F59E0B' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Value
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {formatCurrency(equipment.reduce((acc, e) => acc + (e.purchasePrice || 0), 0))}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Total investment
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
                  <Activity className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Hours
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {equipment.reduce((acc, e) => acc + (e.annualHours || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Annual capacity
                </div>
              </div>
            </div>
          </div>

          {/* Premium Action Bar */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Equipment Fleet
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {equipment.length} {equipment.length === 1 ? 'item' : 'items'} in your library
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hardware-accelerated"
              style={{
                background: 'var(--gradient-brand)',
                color: 'white',
                boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
              }}
            >
              <Plus className="w-5 h-5" />
              Add Equipment
            </button>
          </div>

          {/* Premium Form Modal */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '768px' }}>
                <div className="modal-header">
                  <div>
                    <h2 className="modal-title">Add New Equipment</h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      Configure equipment details and calculate hourly costs
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
                  {/* Basic Information Section */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%)',
                             border: '1px solid rgba(34, 197, 94, 0.3)'
                           }}>
                        <Truck className="w-4 h-4" style={{ color: 'var(--brand-400)' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Basic Information
                      </h3>
                    </div>
                    <div className="form-grid form-grid-2">
                      <div className="input-group">
                        <label className="input-label">Equipment Name</label>
                        <input
                          className="input-field"
                          value={formData.equipmentName}
                          onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                          placeholder="e.g., Ford F450"
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Category</label>
                        <select
                          className="input-field select-field"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="truck">Truck</option>
                          <option value="mulcher">Mulcher</option>
                          <option value="grinder">Grinder</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Purchase & Depreciation Section */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
                             border: '1px solid rgba(59, 130, 246, 0.3)'
                           }}>
                        <Calculator className="w-4 h-4" style={{ color: '#3B82F6' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Purchase & Depreciation
                      </h3>
                    </div>
                    <div className="form-grid form-grid-3">
                      <div className="input-group">
                        <label className="input-label">Purchase Price</label>
                        <input
                          className="input-field"
                          type="number"
                          value={formData.purchasePrice}
                          onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                          onFocus={(e: any) => e.target.select()}
                          placeholder="65000"
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Useful Life (years)</label>
                        <input
                          className="input-field"
                          type="number"
                          value={formData.usefulLifeYears}
                          onChange={(e) => setFormData({ ...formData, usefulLifeYears: Number(e.target.value) })}
                          onFocus={(e) => e.target.select()}
                          placeholder="7"
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Annual Hours</label>
                        <input
                          className="input-field"
                          type="number"
                          value={formData.annualHours}
                          onChange={(e) => setFormData({ ...formData, annualHours: Number(e.target.value) })}
                          onFocus={(e) => e.target.select()}
                          placeholder="1500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fixed Costs Section */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
                             border: '1px solid rgba(245, 158, 11, 0.3)'
                           }}>
                        <Shield className="w-4 h-4" style={{ color: '#F59E0B' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Annual Fixed Costs
                      </h3>
                    </div>
                    <div className="form-grid form-grid-3">
                      <div className="input-group">
                        <label className="input-label">Finance Cost</label>
                        <input
                          className="input-field"
                          type="number"
                          value={formData.annualFinanceCost}
                          onChange={(e) => setFormData({ ...formData, annualFinanceCost: Number(e.target.value) })}
                          onFocus={(e) => e.target.select()}
                          placeholder="3250"
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Insurance</label>
                        <input
                          className="input-field"
                          type="number"
                          value={formData.annualInsurance}
                          onChange={(e) => setFormData({ ...formData, annualInsurance: Number(e.target.value) })}
                          onFocus={(e) => e.target.select()}
                          placeholder="3000"
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Registration</label>
                        <input
                          className="input-field"
                          type="number"
                          value={formData.annualRegistration}
                          onChange={(e) => setFormData({ ...formData, annualRegistration: Number(e.target.value) })}
                          onFocus={(e) => e.target.select()}
                          placeholder="600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operating Costs Section */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                             border: '1px solid rgba(139, 92, 246, 0.3)'
                           }}>
                        <Fuel className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                        Operating Costs
                      </h3>
                    </div>
                    <div className="form-grid form-grid-2">
                      <div className="input-group">
                        <label className="input-label">Fuel Consumption (gal/hr)</label>
                        <input
                          className="input-field"
                          type="number"
                          step="0.1"
                          value={formData.fuelGallonsPerHour}
                          onChange={(e) => setFormData({ ...formData, fuelGallonsPerHour: Number(e.target.value) })}
                          onFocus={(e) => e.target.select()}
                          placeholder="6"
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Fuel Price ($/gal)</label>
                        <input
                          className="input-field"
                          type="number"
                          step="0.01"
                          value={formData.fuelPricePerGallon}
                          onChange={(e) => setFormData({ ...formData, fuelPricePerGallon: Number(e.target.value) })}
                          onFocus={(e) => e.target.select()}
                          placeholder="3.75"
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Annual Maintenance</label>
                        <input
                          className="input-field"
                          type="number"
                          value={formData.annualMaintenance}
                          onChange={(e) => setFormData({ ...formData, annualMaintenance: Number(e.target.value) })}
                          onFocus={(e) => e.target.select()}
                          placeholder="8500"
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Annual Repairs</label>
                        <input
                          className="input-field"
                          type="number"
                          value={formData.annualRepairs}
                          onChange={(e) => setFormData({ ...formData, annualRepairs: Number(e.target.value) })}
                          onFocus={(e) => e.target.select()}
                          placeholder="3500"
                        />
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
                      <Zap className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
                      <h3 className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--brand-400)', letterSpacing: '0.1em' }}>
                        Calculated Hourly Cost
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
                          Ownership
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(costs.ownershipCostPerHour)}
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
                          Operating
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(costs.operatingCostPerHour)}
                          <span className="text-sm font-normal">/hr</span>
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl"
                           style={{
                             background: 'var(--gradient-brand)',
                             boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.35)'
                           }}>
                        <div className="text-xs uppercase tracking-wider mb-2"
                             style={{ color: 'rgba(255,255,255,0.8)' }}>
                          Total
                        </div>
                        <div className="text-3xl font-bold" style={{ color: 'white' }}>
                          {formatCurrency(costs.totalCostPerHour)}
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
                  >
                    Save Equipment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Premium Equipment Grid */}
          {equipment.length === 0 ? (
            <div className="empty-state glass rounded-3xl p-12"
                 style={{
                   background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0.4) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)'
                 }}>
              <Truck className="empty-icon mx-auto mb-6" style={{ opacity: 0.3 }} />
              <h3 className="empty-title">No equipment yet</h3>
              <p className="empty-description">
                Start building your equipment library by adding your first piece of equipment.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary btn-lg mt-4"
              >
                <Plus className="w-5 h-5" />
                Add Your First Equipment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((item) => (
                <div key={item._id} className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hardware-accelerated"
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
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                             style={{
                               background: getCategoryGradient(item.category),
                               boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                             }}>
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-2"
                              style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                            {item.equipmentName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="badge badge-info">
                              {item.category}
                            </span>
                            <span className="badge badge-success">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="icon-btn icon-btn-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                          border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <Trash2 className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                      </button>
                    </div>

                    {/* Cost Breakdown with Premium Styling */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-xl"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                             border: '1px solid var(--border-default)'
                           }}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            Ownership
                          </span>
                        </div>
                        <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(item.ownershipCostPerHour)}/hr
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-xl"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                             border: '1px solid var(--border-default)'
                           }}>
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            Operating
                          </span>
                        </div>
                        <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(item.operatingCostPerHour)}/hr
                        </span>
                      </div>

                      {/* Premium Total Cost Display */}
                      <div className="pt-4 mt-4"
                           style={{ borderTop: '1px solid var(--border-default)' }}>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-xs uppercase tracking-wider"
                                  style={{ color: 'var(--text-quaternary)' }}>
                              Total Hourly
                            </span>
                          </div>
                          <div className="text-3xl font-bold"
                               style={{
                                 background: 'var(--gradient-brand)',
                                 WebkitBackgroundClip: 'text',
                                 WebkitTextFillColor: 'transparent',
                                 backgroundClip: 'text'
                               }}>
                            {formatCurrency(item.totalCostPerHour)}
                            <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>
                              /hr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Equipment Metadata */}
                    <div className="flex justify-between items-center mt-5 pt-4"
                         style={{ borderTop: '1px solid var(--border-default)' }}>
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-quaternary)' }}>
                          {item.annualHours} hrs/year
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-quaternary)' }}>
                          {item.usefulLifeYears} year lifespan
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
    </>
  );
}