'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeCostCalculator() {
  const [formData, setFormData] = useState({
    employeeName: '',
    baseWage: 35,
    burdenMultiplier: 1.7,
  });

  const trueCost = formData.baseWage * formData.burdenMultiplier;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-green-800 border-b-4 border-green-800 pb-4 mb-2">
            Employee Cost Calculator
          </h1>
          <p className="text-gray-600 mb-8">Step 2 of 6 | Calculate true labor costs with burden multipliers</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              label="Employee Position/Name"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              placeholder="Operator"
            />
            <Input
              label="Base Hourly Wage ($)"
              type="number"
              value={formData.baseWage}
              onChange={(e) => setFormData({ ...formData, baseWage: Number(e.target.value) })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Burden Multiplier</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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

          <div className="bg-white border-l-4 border-green-800 p-3 mb-6 font-mono text-sm text-green-800">
            Employee Hourly Cost = ${formData.baseWage.toFixed(2)} × {formData.burdenMultiplier} = ${trueCost.toFixed(2)}
          </div>

          <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-8 rounded-xl text-center shadow-xl">
            <div className="text-sm uppercase tracking-wider opacity-90 mb-2">
              Employee True Labor Cost (per hour)
            </div>
            <div className="text-6xl font-bold font-mono">${trueCost.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
