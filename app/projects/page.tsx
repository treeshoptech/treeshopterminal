'use client';

import { useState } from 'react';
import { NavBar } from '@/components/ui/NavBar';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function ProjectsPage() {
  const loadouts = useQuery(api.loadouts.list, { organizationId: 'org_demo' }) || [];
  const [selectedLoadout, setSelectedLoadout] = useState('');
  const [projectData, setProjectData] = useState({
    projectName: '',
    acres: 10,
    dbhPackage: 6,
    profitMargin: 40,
  });

  const loadout = loadouts.find((l) => l._id === selectedLoadout);
  const loadoutCost = loadout?.totalLoadoutCostPerHour || 0;
  const billingRate = loadoutCost / (1 - projectData.profitMargin / 100);
  const inchAcres = projectData.acres * projectData.dbhPackage;
  const productionRate = loadout?.productionRate || 1.3;
  const hours = inchAcres / productionRate;
  const totalPrice = hours * billingRate;

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Price Projects</h1>
        </div>

        {loadouts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-950 rounded-xl border">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No loadouts available</h3>
            <p className="text-gray-600 mb-4">
              Create a loadout first to price projects
            </p>
            <Link href="/loadouts">
              <Button>Go to Loadouts</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-950 border rounded-xl p-8">
            <div className="space-y-6">
              <Input
                label="Project Name"
                value={projectData.projectName}
                onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                placeholder="Smith Property - New Smyrna Beach"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Select Loadout</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                  value={selectedLoadout}
                  onChange={(e) => setSelectedLoadout(e.target.value)}
                >
                  <option value="">Choose a loadout...</option>
                  {loadouts.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.loadoutName} - ${l.totalLoadoutCostPerHour.toFixed(2)}/hr
                    </option>
                  ))}
                </select>
              </div>

              {selectedLoadout && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Project Acreage"
                      type="number"
                      step="0.1"
                      value={projectData.acres}
                      onChange={(e) => setProjectData({ ...projectData, acres: Number(e.target.value) })}
                      onFocus={(e) => e.target.select()}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">DBH Package</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg"
                        value={projectData.dbhPackage}
                        onChange={(e) => setProjectData({ ...projectData, dbhPackage: Number(e.target.value) })}
                      >
                        <option value={4}>Small (4" DBH)</option>
                        <option value={6}>Medium (6" DBH)</option>
                        <option value={8}>Large (8" DBH)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Profit Margin (%)</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setProjectData({ ...projectData, profitMargin: Math.max(0, projectData.profitMargin - 5) })}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg font-bold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="flex-1 text-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 font-mono text-lg font-bold"
                        value={projectData.profitMargin}
                        onChange={(e) => setProjectData({ ...projectData, profitMargin: Number(e.target.value) })}
                      />
                      <button
                        type="button"
                        onClick={() => setProjectData({ ...projectData, profitMargin: Math.min(100, projectData.profitMargin + 5) })}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Click +/− to adjust by 5%</div>
                  </div>

                  <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Inch-Acres</span>
                      <span className="font-mono font-semibold">{inchAcres.toFixed(2)} IA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Production Hours</span>
                      <span className="font-mono font-semibold">{hours.toFixed(2)} hrs</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Loadout Cost</span>
                      <span className="font-mono font-semibold">${loadoutCost.toFixed(2)}/hr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Billing Rate</span>
                      <span className="font-mono font-semibold">${billingRate.toFixed(2)}/hr</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-8 rounded-xl text-center">
                    <div className="text-sm uppercase tracking-wider opacity-90 mb-2">
                      Total Project Price
                    </div>
                    <div className="text-6xl font-bold font-mono">${totalPrice.toFixed(2)}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
