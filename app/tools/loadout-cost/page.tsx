'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function LoadoutCostCalculator() {
  const [equipment, setEquipment] = useState([114.73, 38.43, 14.0, 0]);
  const [labor, setLabor] = useState([59.5, 59.5, 0, 0]);

  const totalEquipment = equipment.reduce((sum, val) => sum + val, 0);
  const totalLabor = labor.reduce((sum, val) => sum + val, 0);
  const totalLoadout = totalEquipment + totalLabor;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-8">
          <h1 className="text-4xl font-bold text-green-800 border-b-4 border-green-800 pb-4 mb-2">
            Loadout Cost Calculator
          </h1>
          <p className="text-gray-600 mb-8">Step 3 of 6 | Equipment + Labor = Total Loadout Cost</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Equipment Costs ($/hr)</h3>
              <div className="space-y-3">
                <Input
                  label="Primary Equipment ($/hr)"
                  type="number"
                  step="0.01"
                  value={equipment[0]}
                  onChange={(e) => setEquipment([Number(e.target.value), equipment[1], equipment[2], equipment[3]])}
                />
                <Input
                  label="Support Vehicle ($/hr)"
                  type="number"
                  step="0.01"
                  value={equipment[1]}
                  onChange={(e) => setEquipment([equipment[0], Number(e.target.value), equipment[2], equipment[3]])}
                />
                <Input
                  label="Additional Equipment ($/hr)"
                  type="number"
                  step="0.01"
                  value={equipment[2]}
                  onChange={(e) => setEquipment([equipment[0], equipment[1], Number(e.target.value), equipment[3]])}
                />
                <Input
                  label="Additional Equipment ($/hr)"
                  type="number"
                  step="0.01"
                  value={equipment[3]}
                  onChange={(e) => setEquipment([equipment[0], equipment[1], equipment[2], Number(e.target.value)])}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Labor Costs ($/hr)</h3>
              <div className="space-y-3">
                <Input
                  label="Employee #1 ($/hr)"
                  type="number"
                  step="0.01"
                  value={labor[0]}
                  onChange={(e) => setLabor([Number(e.target.value), labor[1], labor[2], labor[3]])}
                />
                <Input
                  label="Employee #2 ($/hr)"
                  type="number"
                  step="0.01"
                  value={labor[1]}
                  onChange={(e) => setLabor([labor[0], Number(e.target.value), labor[2], labor[3]])}
                />
                <Input
                  label="Employee #3 ($/hr)"
                  type="number"
                  step="0.01"
                  value={labor[2]}
                  onChange={(e) => setLabor([labor[0], labor[1], Number(e.target.value), labor[3]])}
                />
                <Input
                  label="Employee #4 ($/hr)"
                  type="number"
                  step="0.01"
                  value={labor[3]}
                  onChange={(e) => setLabor([labor[0], labor[1], labor[2], Number(e.target.value)])}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
              Total Equipment = ${totalEquipment.toFixed(2)}
            </div>
            <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
              Total Labor = ${totalLabor.toFixed(2)}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-8 rounded-xl text-center shadow-xl">
            <div className="text-sm uppercase tracking-wider opacity-90 mb-2">
              Total Loadout Cost (before markup)
            </div>
            <div className="text-6xl font-bold font-mono">${totalLoadout.toFixed(2)}</div>
          </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
