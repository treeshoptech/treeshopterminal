'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, Edit, Trash2, Truck, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function EquipmentLibraryPage() {
  const equipment = useQuery(api.userEquipment.list, { organizationId: 'org_demo' }) || [];
  const createEquipment = useMutation(api.userEquipment.create);
  const updateEquipment = useMutation(api.userEquipment.update);
  const deleteEquipment = useMutation(api.userEquipment.remove);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    equipmentName: '',
    category: 'truck',
    purchasePrice: 0,
    usefulLifeYears: 7,
    annualHours: 1500,
    apr: 0,
    annualInsurance: 0,
    annualRegistration: 0,
    fuelGallonsPerHour: 0,
    fuelPricePerGallon: 3.75,
    annualMaintenance: 0,
    annualRepairs: 0,
    notes: '',
  });

  const calculate = () => {
    const annualFinanceCost = formData.purchasePrice * (formData.apr / 100);
    const annualDepreciation = formData.purchasePrice / formData.usefulLifeYears;
    const totalAnnualOwnership =
      annualDepreciation + annualFinanceCost + formData.annualInsurance + formData.annualRegistration;
    const ownershipPerHour = totalAnnualOwnership / formData.annualHours;

    const fuelPerHour = formData.fuelGallonsPerHour * formData.fuelPricePerGallon;
    const maintenancePerHour = formData.annualMaintenance / formData.annualHours;
    const repairsPerHour = formData.annualRepairs / formData.annualHours;
    const operatingPerHour = fuelPerHour + maintenancePerHour + repairsPerHour;

    return ownershipPerHour + operatingPerHour;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const calculatedCost = calculate();

    if (editingId) {
      await updateEquipment({
        id: editingId as any,
        ...formData,
        annualFinanceCost: formData.purchasePrice * (formData.apr / 100),
      });
    } else {
      await createEquipment({
        organizationId: 'org_demo',
        ...formData,
        annualFinanceCost: formData.purchasePrice * (formData.apr / 100),
      });
    }

    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      equipmentName: '',
      category: 'truck',
      purchasePrice: 0,
      usefulLifeYears: 7,
      annualHours: 1500,
      apr: 0,
      annualInsurance: 0,
      annualRegistration: 0,
      fuelGallonsPerHour: 0,
      fuelPricePerGallon: 3.75,
      annualMaintenance: 0,
      annualRepairs: 0,
      notes: '',
    });
  };

  const handleEdit = (item: any) => {
    setFormData({
      equipmentName: item.equipmentName,
      category: item.category || 'truck',
      purchasePrice: item.purchasePrice,
      usefulLifeYears: item.usefulLifeYears,
      annualHours: item.annualHours,
      apr: (item.annualFinanceCost / item.purchasePrice) * 100 || 0,
      annualInsurance: item.annualInsurance,
      annualRegistration: item.annualRegistration,
      fuelGallonsPerHour: item.fuelGallonsPerHour,
      fuelPricePerGallon: item.fuelPricePerGallon,
      annualMaintenance: item.annualMaintenance,
      annualRepairs: item.annualRepairs,
      notes: item.notes || '',
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this equipment? This cannot be undone.')) {
      await deleteEquipment({ id: id as any });
    }
  };

  const filteredEquipment = equipment.filter((item) =>
    item.equipmentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Equipment Library</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {equipment.length} pieces of equipment
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Equipment
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-950 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingId ? 'Edit Equipment' : 'Add Equipment'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Equipment Name"
                      value={formData.equipmentName}
                      onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                      placeholder="e.g., Cat 265, Ford F450"
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <select
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="truck">Truck</option>
                        <option value="mulcher">Forestry Mulcher</option>
                        <option value="grinder">Stump Grinder</option>
                        <option value="skid_steer">Skid Steer</option>
                        <option value="excavator">Excavator</option>
                        <option value="chipper">Chipper</option>
                        <option value="trailer">Trailer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ownership Costs */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Ownership Costs
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Purchase Price ($)"
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    />
                    <Input
                      label="Useful Life (years)"
                      type="number"
                      value={formData.usefulLifeYears}
                      onChange={(e) => setFormData({ ...formData, usefulLifeYears: Number(e.target.value) })}
                    />
                    <Input
                      label="Annual Hours"
                      type="number"
                      value={formData.annualHours}
                      onChange={(e) => setFormData({ ...formData, annualHours: Number(e.target.value) })}
                    />
                    <Input
                      label="APR (%)"
                      type="number"
                      step="0.1"
                      value={formData.apr}
                      onChange={(e) => setFormData({ ...formData, apr: Number(e.target.value) })}
                    />
                    <Input
                      label="Insurance ($)"
                      type="number"
                      value={formData.annualInsurance}
                      onChange={(e) => setFormData({ ...formData, annualInsurance: Number(e.target.value) })}
                    />
                    <Input
                      label="Registration ($)"
                      type="number"
                      value={formData.annualRegistration}
                      onChange={(e) => setFormData({ ...formData, annualRegistration: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Operating Costs */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Operating Costs
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Fuel (gal/hr)"
                      type="number"
                      step="0.1"
                      value={formData.fuelGallonsPerHour}
                      onChange={(e) => setFormData({ ...formData, fuelGallonsPerHour: Number(e.target.value) })}
                    />
                    <Input
                      label="Fuel Price ($/gal)"
                      type="number"
                      step="0.01"
                      value={formData.fuelPricePerGallon}
                      onChange={(e) => setFormData({ ...formData, fuelPricePerGallon: Number(e.target.value) })}
                    />
                    <Input
                      label="Maintenance ($)"
                      type="number"
                      value={formData.annualMaintenance}
                      onChange={(e) => setFormData({ ...formData, annualMaintenance: Number(e.target.value) })}
                    />
                    <Input
                      label="Repairs ($)"
                      type="number"
                      value={formData.annualRepairs}
                      onChange={(e) => setFormData({ ...formData, annualRepairs: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Calculated Cost Preview */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Calculated Hourly Cost</div>
                  <div className="text-3xl font-bold text-green-800 dark:text-green-400">
                    ${calculate().toFixed(2)}/hr
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingId ? 'Update Equipment' : 'Save Equipment'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Equipment Grid */}
        {filteredEquipment.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Truck className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No equipment yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add your first piece of equipment to get started
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.equipmentName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {item.category?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Ownership</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      ${item.ownershipCostPerHour.toFixed(2)}/hr
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Operating</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      ${item.operatingCostPerHour.toFixed(2)}/hr
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        ${item.totalCostPerHour.toFixed(2)}/hr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
