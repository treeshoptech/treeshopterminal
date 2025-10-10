'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, Trash2, X, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function EmployeesPage() {
  const employees = useQuery(api.employees.list, { organizationId: 'org_demo' }) || [];
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
      organizationId: 'org_demo',
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
    if (confirm('Delete this employee?')) {
      await deleteEmployee({ id: id as any });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/" className="text-gray-400 hover:text-gray-600">←</Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{employees.length} employees</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-950 rounded-xl max-w-2xl w-full">
              <div className="border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add Employee</h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="Position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g., Operator, Ground Crew"
                  />
                  <Input
                    label="Base Hourly Rate ($)"
                    type="number"
                    value={formData.baseHourlyRate}
                    onChange={(e) => setFormData({ ...formData, baseHourlyRate: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Burden Multiplier</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
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

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">True Hourly Cost</div>
                  <div className="text-3xl font-bold text-blue-800 dark:text-blue-400">
                    ${trueCost.toFixed(2)}/hr
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Save Employee</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Employees Grid */}
        {employees.length === 0 ? (
          <div className="text-center py-16">
            <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employees yet</h3>
            <p className="text-gray-600 mb-4">Add your first employee</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <div
                key={emp._id}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">{emp.position}</p>
                  </div>
                  <button onClick={() => handleDelete(emp._id)} className="p-2 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Wage</span>
                    <span className="font-mono">${emp.baseHourlyRate?.toFixed(2) || '0.00'}/hr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Multiplier</span>
                    <span className="font-mono">{emp.burdenMultiplier?.toFixed(1) || '1.7'}x</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">True Cost</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${emp.trueCostPerHour?.toFixed(2) || '0.00'}/hr
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
