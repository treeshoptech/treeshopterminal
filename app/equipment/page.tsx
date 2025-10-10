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
  Calculator
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
                  Equipment Library
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Manage your equipment and calculate hourly costs
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stat-card">
              <div className="stat-label">Total Equipment</div>
              <div className="stat-value">{equipment.length}</div>
              <div className="stat-change stat-change-positive">
                <TrendingUp className="w-4 h-4" />
                Active fleet
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Hourly Cost</div>
              <div className="stat-value">
                {equipment.length > 0
                  ? formatCurrency(equipment.reduce((acc, e) => acc + e.totalCostPerHour, 0) / equipment.length)
                  : '$0.00'}
              </div>
              <div className="stat-change" style={{ color: 'var(--text-tertiary)' }}>
                Per equipment
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Fleet Value</div>
              <div className="stat-value">
                {formatCurrency(equipment.reduce((acc, e) => acc + (e.purchasePrice || 0), 0))}
              </div>
              <div className="stat-change" style={{ color: 'var(--text-tertiary)' }}>
                Investment
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Operational Hours</div>
              <div className="stat-value">
                {equipment.reduce((acc, e) => acc + (e.annualHours || 0), 0).toLocaleString()}
              </div>
              <div className="stat-change" style={{ color: 'var(--text-tertiary)' }}>
                Annual capacity
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Equipment Fleet
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {equipment.length} {equipment.length === 1 ? 'item' : 'items'} in your library
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary btn-md"
            >
              <Plus className="w-4 h-4" />
              Add Equipment
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '720px' }}>
                <div className="modal-header">
                  <div>
                    <h2 className="modal-title">Add New Equipment</h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      Configure equipment details and costs
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
                  {/* Basic Information Section */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{ color: 'var(--text-tertiary)' }}>
                      Basic Information
                    </h3>
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
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{ color: 'var(--text-tertiary)' }}>
                      Purchase & Depreciation
                    </h3>
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
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{ color: 'var(--text-tertiary)' }}>
                      Annual Fixed Costs
                    </h3>
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
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{ color: 'var(--text-tertiary)' }}>
                      Operating Costs
                    </h3>
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

                  {/* Cost Summary */}
                  <div className="p-6 rounded-xl mb-6"
                       style={{
                         background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                         border: '1px solid rgba(16, 185, 129, 0.2)'
                       }}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{ color: 'var(--brand-400)' }}>
                      Calculated Hourly Cost
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          Ownership
                        </div>
                        <div className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(costs.ownershipCostPerHour)}/hr
                        </div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          Operating
                        </div>
                        <div className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(costs.operatingCostPerHour)}/hr
                        </div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          Total
                        </div>
                        <div className="text-2xl font-bold mt-1" style={{ color: 'var(--brand-400)' }}>
                          {formatCurrency(costs.totalCostPerHour)}/hr
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

          {/* Equipment Grid */}
          {equipment.length === 0 ? (
            <div className="empty-state">
              <Truck className="empty-icon" />
              <h3 className="empty-title">No equipment yet</h3>
              <p className="empty-description">
                Start building your equipment library by adding your first piece of equipment.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary btn-md"
              >
                <Plus className="w-4 h-4" />
                Add Your First Equipment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map((item) => (
                <div key={item._id} className="card group">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                           style={{
                             background: 'var(--bg-elevated)',
                             border: '1px solid var(--border-default)'
                           }}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                          {item.equipmentName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
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
                      className="icon-btn icon-btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--color-error)' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b"
                         style={{ borderColor: 'var(--border-default)' }}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          Ownership Cost
                        </span>
                      </div>
                      <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(item.ownershipCostPerHour)}/hr
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b"
                         style={{ borderColor: 'var(--border-default)' }}>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4" style={{ color: 'var(--text-quaternary)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          Operating Cost
                        </span>
                      </div>
                      <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(item.operatingCostPerHour)}/hr
                      </span>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-xs uppercase tracking-wider"
                                style={{ color: 'var(--text-quaternary)' }}>
                            Total Hourly Cost
                          </span>
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--brand-400)' }}>
                          {formatCurrency(item.totalCostPerHour)}
                          <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>
                            /hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Details (expandable in future) */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-quaternary)' }}>
                        {item.annualHours} hrs/year
                      </span>
                      <span style={{ color: 'var(--text-quaternary)' }}>
                        {item.usefulLifeYears} year lifespan
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