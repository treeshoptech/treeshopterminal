'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';


export default function ProjectPricingCalculator() {
  const [projectName, setProjectName] = useState('');
  const [acreage, setAcreage] = useState(10);
  const [dbh, setDbh] = useState(6);
  const [diffMultiplier, setDiffMultiplier] = useState(1.0);
  const [billingRate, setBillingRate] = useState(572.32);
  const [productionRate, setProductionRate] = useState(5.0);

  const baseIA = dbh * acreage;
  const adjustedIA = baseIA * diffMultiplier;
  const jobHours = adjustedIA / productionRate;
  const projectPrice = jobHours * billingRate;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-8">
          <h1 className="text-4xl font-bold text-green-800 border-b-4 border-green-800 pb-4 mb-2">
            Project Pricing Calculator
          </h1>
          <p className="text-gray-600 mb-8">Steps 5 & 6 | Complete project pricing from inch-acres to final price</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Step 5: Inch-Acres */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">Project Definition & Inch-Acres</h2>
              <div className="space-y-4">
                <Input
                  label="Project Name/Location"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Smith Property - New Smyrna Beach"
                />
                <Input
                  label="Total Project Acreage"
                  type="number"
                  step="0.1"
                  value={acreage}
                  onChange={(e) => setAcreage(Number(e.target.value))}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Average DBH (inches)</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    value={dbh}
                    onChange={(e) => setDbh(Number(e.target.value))}
                  >
                    <option value={4}>Small Package (4" DBH)</option>
                    <option value={6}>Medium Package (6" DBH)</option>
                    <option value={8}>Large Package (8" DBH)</option>
                  </select>
                </div>
                <Input
                  label="Difficulty Multiplier (Optional)"
                  type="number"
                  step="0.01"
                  value={diffMultiplier}
                  onChange={(e) => setDiffMultiplier(Number(e.target.value))}
                  helperText="1.0 = easy, 1.15-1.3 = difficult"
                />
              </div>

              <div className="mt-4 space-y-2">
                <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
                  Base Inch-Acres = {dbh} × {acreage} = {baseIA.toFixed(2)}
                </div>
                <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
                  Adjusted Inch-Acres = {baseIA.toFixed(2)} × {diffMultiplier} = {adjustedIA.toFixed(2)}
                </div>
              </div>

              <div className="mt-4 bg-green-800 text-white p-6 rounded-lg text-center">
                <div className="text-sm uppercase tracking-wider opacity-90">Total Project Inch-Acres</div>
                <div className="text-4xl font-bold font-mono">{adjustedIA.toFixed(2)} IA</div>
              </div>
            </div>

            {/* Step 6: Final Price */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
              <h2 className="text-xl font-bold text-purple-800 mb-4">Final Project Price</h2>
              <div className="space-y-4">
                <Input
                  label="Total Inch-Acres (from left)"
                  type="number"
                  step="0.01"
                  value={adjustedIA}
                  disabled
                />
                <Input
                  label="Hourly Billing Rate (from Step 4)"
                  type="number"
                  step="0.01"
                  value={billingRate}
                  onChange={(e) => setBillingRate(Number(e.target.value))}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Production Rate (IA/hour)</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={productionRate}
                    onChange={(e) => setProductionRate(Number(e.target.value))}
                  >
                    <option value={1.3}>Cat 265 Forestry Mulcher (1.3 IA/hr)</option>
                    <option value={5.0}>Supertrak SK200TR (5.0 IA/hr)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="bg-white border-l-4 border-purple-800 p-3 font-mono text-sm text-purple-800">
                  Job Hours = {adjustedIA.toFixed(2)} ÷ {productionRate} = {jobHours.toFixed(2)} hours
                </div>
                <div className="bg-white border-l-4 border-purple-800 p-3 font-mono text-sm text-purple-800">
                  Project Price = {jobHours.toFixed(2)} × ${billingRate.toFixed(2)} = ${projectPrice.toFixed(2)}
                </div>
              </div>

              <div className="mt-4 bg-gradient-to-r from-purple-800 to-purple-700 text-white p-6 rounded-lg text-center">
                <div className="text-sm uppercase tracking-wider opacity-90">Final Project Price</div>
                <div className="text-4xl font-bold font-mono">${projectPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
