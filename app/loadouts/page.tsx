import { NavBar } from '@/components/ui/NavBar';
'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, Trash2, Wrench, X, Users as UsersIcon, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function LoadoutsPage() {
  const equipment = useQuery(api.equipment.list, { organizationId: 'org_demo' }) || [];
  const employees = useQuery(api.employees.list, { organizationId: 'org_demo' }) || [];
  const loadouts = useQuery(api.loadouts.list, { organizationId: 'org_demo' }) || [];
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
      organizationId: 'org_demo',
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

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/" className="text-gray-400 hover:text-gray-600">←</Link>
              <h1 className="text-3xl font-bold">Loadouts</h1>
            </div>
            <p className="text-gray-600">{loadouts.length} configured loadouts</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Loadout
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-950 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-950 border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Create Loadout</h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Loadout Name"
                    value={formData.loadoutName}
                    onChange={(e) => setFormData({ ...formData, loadoutName: e.target.value })}
                    placeholder="e.g., Cat 265 Standard Crew"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    >
                      <option value="mulching">Forestry Mulching</option>
                      <option value="clearing">Land Clearing</option>
                      <option value="stumps">Stump Grinding</option>
                    </select>
                  </div>
                </div>

                {/* Equipment Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Select Equipment</h3>
                  {equipment.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-gray-500">No equipment available. <Link href="/equipment" className="text-green-600">Add equipment first</Link></p>
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
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.selectedEquipment.includes(eq._id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold">{eq.equipmentName}</div>
                          <div className="text-sm text-gray-600 font-mono">
                            ${eq.totalCostPerHour.toFixed(2)}/hr
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Employees */}
                <div>
                  <h3 className="font-semibold mb-3">Select Crew ({employees.length} available)</h3>
                  {employees.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-gray-500">
                        No employees available. <Link href="/employees" className="text-blue-600">Add employees first</Link>
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
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.selectedEmployees.includes(emp._id)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-sm">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-gray-500">{emp.position}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">
                            ${emp.trueCostPerHour?.toFixed(2) || '0.00'}/hr
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Production Rate */}
                <Input
                  label="Production Rate (IA/hr)"
                  type="number"
                  step="0.1"
                  value={formData.productionRate}
                  onChange={(e) => setFormData({ ...formData, productionRate: Number(e.target.value) })}
                  onFocus={(e: any) => e.target.select()}
                  helpText="e.g., 1.3 for Cat 265, 5.0 for SK200TR"
                />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-gray-600">Equipment</div>
                      <div className="text-lg font-bold">${totals.equipment.toFixed(2)}/hr</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Labor</div>
                      <div className="text-lg font-bold">${totals.labor.toFixed(2)}/hr</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Total</div>
                      <div className="text-xl font-bold text-green-600">${totals.total.toFixed(2)}/hr</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 border-t pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Save Loadout</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loadouts Grid */}
        {loadouts.length === 0 ? (
          <div className="text-center py-16">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No loadouts yet</h3>
            <p className="text-gray-600 mb-4">Create your first loadout</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Loadout
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadouts.map((loadout) => (
              <div key={loadout._id} className="bg-white dark:bg-gray-950 border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{loadout.loadoutName}</h3>
                    <p className="text-xs text-gray-500 capitalize">{loadout.serviceType}</p>
                  </div>
                  <button onClick={() => handleDelete(loadout._id)} className="p-2 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">${loadout.totalEquipmentCostPerHour.toFixed(2)}/hr</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">${loadout.totalLaborCostPerHour.toFixed(2)}/hr</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      ${loadout.totalLoadoutCostPerHour.toFixed(2)}/hr
                    </span>
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
