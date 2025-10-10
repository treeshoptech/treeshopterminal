'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';


export default function ProfitMarginCalculator() {
  const [loadoutCost, setLoadoutCost] = useState(286.16);
  const [profitMargin, setProfitMargin] = useState(50);

  const divisor = 1 - profitMargin / 100;
  const billingRate = divisor !== 0 ? loadoutCost / divisor : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-8">
          <h1 className="text-4xl font-bold text-green-800 border-b-4 border-green-800 pb-4 mb-2">
            Profit Margin Converter
          </h1>
          <p className="text-gray-600 mb-8">Step 4 of 6 | Convert loadout cost to billing rate with profit margin</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Loadout Cost from Step 3 ($/hour)"
              type="number"
              step="0.01"
              value={loadoutCost}
              onChange={(e) => setLoadoutCost(Number(e.target.value))}
            />
            <Input
              label="Desired Profit Margin (%)"
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(Number(e.target.value))}
              helperText="30%, 40%, 50%, 60%, or 70%"
            />
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
              Divisor = 1 - ({profitMargin} ÷ 100) = {divisor.toFixed(2)}
            </div>
            <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
              Hourly Billing Rate = ${loadoutCost.toFixed(2)} ÷ {divisor.toFixed(2)} = ${billingRate.toFixed(2)}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-8 rounded-xl text-center shadow-xl">
            <div className="text-sm uppercase tracking-wider opacity-90 mb-2">
              Hourly Billing Rate
            </div>
            <div className="text-6xl font-bold font-mono">${billingRate.toFixed(2)}</div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
