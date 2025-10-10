'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, Edit, Trash2, Wrench, Users, Truck as TruckIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function LoadoutsPage() {
  const equipment = useQuery(api.userEquipment.list, { organizationId: 'org_demo' }) || [];
  const loadouts = useQuery(api.userLoadouts.list, { organizationId: 'org_demo' }) || [];
  const createLoadout = useMutation(api.userLoadouts.create);
  const deleteLoadout = useMutation(api.userLoadouts.remove);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    loadoutName: '',
    serviceType: 'mulching',
    selectedEquipment: [] as string[],
    employees: [
      { position: 'Operator', baseWage: 35, burdenMultiplier: 1.7 },
      { position: 'Ground Crew', baseWage: 30, burdenMultiplier: 1.6 },
    ],
    productionRate: 1.3,
    productionUnit: 'ia_per_hour',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const employeesWithCost = formData.employees.map((emp) => ({
      position: emp.position,
      baseWage: emp.baseWage,
      multiplier: emp.burdenMultiplier,
      trueCost: emp.baseWage * emp.burdenMultiplier,
    }));

    await createLoadout({
      organizationId: 'org_demo',
      loadoutName: formData.loadoutName,
      serviceType: formData.serviceType,
      equipmentIds: formData.selectedEquipment as any,
      employees: employeesWithCost,
      productionRate: formData.productionRate,
      productionUnit: formData.productionUnit,
      notes: formData.notes,
    });

    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      loadoutName: '',
      serviceType: 'mulching',
      selectedEquipment: [],
      employees: [
        { position: 'Operator', baseWage: 35, burdenMultiplier: 1.7 },
        { position: 'Ground Crew', baseWage: 30, burdenMultiplier: 1.6 },
      ],
      productionRate: 1.3,
      productionUnit: 'ia_per_hour',
      notes: '',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this loadout?')) {
      await deleteLoadout({ id: id as any });
    }
  };

  const toggleEquipment = (id: string) => {
    if (formData.selectedEquipment.includes(id)) {
      setFormData({
        ...formData,
        selectedEquipment: formData.selectedEquipment.filter((eqId) => eqId !== id),
      });
    } else {
      setFormData({
        ...formData,
        selectedEquipment: [...formData.selectedEquipment, id],
      });
    }
  };

  const addEmployee = () => {
    setFormData({
      ...formData,
      employees: [
        ...formData.employees,
        { position: '', baseWage: 0, burdenMultiplier: 1.7 },
      ],
    });
  };

  const removeEmployee = (index: number) => {
    setFormData({
      ...formData,
      employees: formData.employees.filter((_, i) => i !== index),
    });
  };

  const updateEmployee = (index: number, field: string, value: any) => {
    setFormData({
      ...formData,
      employees: formData.employees.map((emp, i) =>
        i === index ? { ...emp, [field]: value } : emp
      ),
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loadouts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{loadouts.length} configured loadouts</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Loadout
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-950 rounded-xl max-w-5xl w-full my-8">
              <div className="sticky top-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Loadout</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Loadout Name"
                    value={formData.loadoutName}
                    onChange={(e) => setFormData({ ...formData, loadoutName: e.target.value })}
                    placeholder="e.g., Cat 265 Standard Crew"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Service Type
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    >
                      <option value="mulching">Forestry Mulching</option>
                      <option value="clearing">Land Clearing</option>
                      <option value="stumps">Stump Grinding</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                {/* Equipment Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Select Equipment
                  </h3>
                  {equipment.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-400">
                        No equipment available. Add equipment first.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {equipment.map((eq) => (
                        <button
                          key={eq._id}
                          type="button"
                          onClick={() => toggleEquipment(eq._id)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            formData.selectedEquipment.includes(eq._id)
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {eq.equipmentName}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                ${eq.totalCostPerHour.toFixed(2)}/hr
                              </div>
                            </div>
                            {formData.selectedEquipment.includes(eq._id) && (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Employees */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Crew Members</h3>
                    <button
                      type="button"
                      onClick={addEmployee}
                      className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                    >
                      + Add Employee
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.employees.map((emp, idx) => (
                      <div key={idx} className="grid grid-cols-4 gap-3 items-end">
                        <Input
                          label="Position"
                          value={emp.position}
                          onChange={(e) => updateEmployee(idx, 'position', e.target.value)}
                        />
                        <Input
                          label="Base Wage ($)"
                          type="number"
                          value={emp.baseWage}
                          onChange={(e) => updateEmployee(idx, 'baseWage', Number(e.target.value))}
                        />
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Multiplier
                          </label>
                          <select
                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
                            value={emp.burdenMultiplier}
                            onChange={(e) => updateEmployee(idx, 'burdenMultiplier', Number(e.target.value))}
                          >
                            <option value={1.6}>1.6x</option>
                            <option value={1.7}>1.7x</option>
                            <option value={1.8}>1.8x</option>
                            <option value={1.9}>1.9x</option>
                            <option value={2.0}>2.0x</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-mono text-gray-900 dark:text-white">
                            ${(emp.baseWage * emp.burdenMultiplier).toFixed(2)}/hr
                          </div>
                          {formData.employees.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEmployee(idx)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Production Rate */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Production Rate"
                    type="number"
                    step="0.1"
                    value={formData.productionRate}
                    onChange={(e) => setFormData({ ...formData, productionRate: Number(e.target.value) })}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Unit
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={formData.productionUnit}
                      onChange={(e) => setFormData({ ...formData, productionUnit: e.target.value })}
                    >
                      <option value="ia_per_hour">IA per hour</option>
                      <option value="stumpscore_per_hour">StumpScore per hour</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save Loadout
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loadouts Grid */}
        {loadouts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Wrench className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No loadouts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first loadout configuration
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Loadout
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadouts.map((loadout) => (
              <div
                key={loadout._id}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {loadout.loadoutName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {loadout.serviceType?.replace('_', ' ')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(loadout._id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TruckIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {loadout.equipmentIds.length} equipment
                    </span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      ${loadout.totalEquipmentCostPerHour.toFixed(2)}/hr
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {loadout.employees?.length || 0} crew
                    </span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      ${loadout.totalLaborCostPerHour.toFixed(2)}/hr
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Total Loadout Cost
                    </span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${loadout.totalLoadoutCostPerHour.toFixed(2)}/hr
                    </span>
                  </div>
                  {loadout.productionRate && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Production: {loadout.productionRate} {loadout.productionUnit?.replace('_', ' ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
