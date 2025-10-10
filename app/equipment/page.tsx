'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, Edit, Trash2, Truck, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NavBar } from '@/components/ui/NavBar';
import Link from 'next/link';

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
    if (confirm('Delete this equipment?')) {
      await deleteEquipment({ id: id as any });
    }
  };

  const costs = calculate();

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/" className="text-gray-400 hover:text-gray-600">←</Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Equipment Library</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{equipment.length} pieces of equipment</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-950 rounded-xl max-w-4xl w-full h-[90vh] flex flex-col">
              <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4 md:p-6 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl md:text-2xl font-bold">Add Equipment</h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Equipment Name"
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="truck">Truck</option>
                      <option value="mulcher">Mulcher</option>
                      <option value="grinder">Grinder</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Purchase Price ($)"
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    onFocus={(e: any) => e.target.select()}
                  />
                  <Input
                    label="Useful Life (years)"
                    type="number"
                    value={formData.usefulLifeYears}
                    onChange={(e) => setFormData({ ...formData, usefulLifeYears: Number(e.target.value) })}
                    onFocus={(e) => e.target.select()}
                  />
                  <Input
                    label="Annual Hours"
                    type="number"
                    value={formData.annualHours}
                    onChange={(e) => setFormData({ ...formData, annualHours: Number(e.target.value) })}
                    onFocus={(e) => e.target.select()}
                  />
                  <Input
                    label="Annual Finance ($)"
                    type="number"
                    value={formData.annualFinanceCost}
                    onChange={(e) => setFormData({ ...formData, annualFinanceCost: Number(e.target.value) })}
                    onFocus={(e) => e.target.select()}
                  />
                  <Input
                    label="Annual Insurance ($)"
                    type="number"
                    value={formData.annualInsurance}
                    onChange={(e) => setFormData({ ...formData, annualInsurance: Number(e.target.value) })}
                    onFocus={(e) => e.target.select()}
                  />
                  <Input
                    label="Fuel (gal/hr)"
                    type="number"
                    step="0.1"
                    value={formData.fuelGallonsPerHour}
                    onChange={(e) => setFormData({ ...formData, fuelGallonsPerHour: Number(e.target.value) })}
                    onFocus={(e) => e.target.select()}
                  />
                  <Input
                    label="Fuel Price ($/gal)"
                    type="number"
                    step="0.01"
                    value={formData.fuelPricePerGallon}
                    onChange={(e) => setFormData({ ...formData, fuelPricePerGallon: Number(e.target.value) })}
                    onFocus={(e) => e.target.select()}
                  />
                  <Input
                    label="Maintenance ($)"
                    type="number"
                    value={formData.annualMaintenance}
                    onChange={(e) => setFormData({ ...formData, annualMaintenance: Number(e.target.value) })}
                    onFocus={(e) => e.target.select()}
                  />
                  <Input
                    label="Repairs ($)"
                    type="number"
                    value={formData.annualRepairs}
                    onChange={(e) => setFormData({ ...formData, annualRepairs: Number(e.target.value) })}
                    onFocus={(e) => e.target.select()}
                  />
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Calculated Hourly Cost</div>
                  <div className="text-3xl font-bold text-green-800 dark:text-green-400">
                    ${costs.totalCostPerHour.toFixed(2)}/hr
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Save Equipment</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Equipment Grid */}
        {equipment.length === 0 ? (
          <div className="text-center py-16">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No equipment yet</h3>
            <p className="text-gray-600 mb-4">Add your first piece of equipment</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{item.equipmentName}</h3>
                    <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ownership</span>
                    <span className="font-mono">${item.ownershipCostPerHour.toFixed(2)}/hr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Operating</span>
                    <span className="font-mono">${item.operatingCostPerHour.toFixed(2)}/hr</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-xl font-bold text-green-600">
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
    </div>
  );
}
