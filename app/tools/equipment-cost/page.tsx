'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';

export default function EquipmentCostCalculator() {
  const [formData, setFormData] = useState({
    equipmentName: '',
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
  });

  const [result, setResult] = useState({
    annualFinanceCost: 0,
    ownershipPerHour: 0,
    annualFuel: 0,
    operatingPerHour: 0,
    totalPerHour: 0,
  });

  const calculate = () => {
    const annualFinanceCost = formData.purchasePrice * (formData.apr / 100);
    const annualDepreciation = formData.purchasePrice / formData.usefulLifeYears;
    const totalAnnualOwnership =
      annualDepreciation + annualFinanceCost + formData.annualInsurance + formData.annualRegistration;
    const ownershipPerHour = totalAnnualOwnership / formData.annualHours;

    const annualFuel = formData.fuelGallonsPerHour * formData.fuelPricePerGallon * formData.annualHours;
    const fuelPerHour = formData.fuelGallonsPerHour * formData.fuelPricePerGallon;
    const maintenancePerHour = formData.annualMaintenance / formData.annualHours;
    const repairsPerHour = formData.annualRepairs / formData.annualHours;
    const operatingPerHour = fuelPerHour + maintenancePerHour + repairsPerHour;

    const totalPerHour = ownershipPerHour + operatingPerHour;

    setResult({
      annualFinanceCost,
      ownershipPerHour,
      annualFuel,
      operatingPerHour,
      totalPerHour,
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-8">
          <h1 className="text-4xl font-bold text-green-800 border-b-4 border-green-800 pb-4 mb-2">
            Equipment Cost Calculator
          </h1>
          <p className="text-gray-600 mb-8">Step 1 of 6 | Calculate true hourly equipment costs</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Equipment Name"
              value={formData.equipmentName}
              onChange={(e) => {
                setFormData({ ...formData, equipmentName: e.target.value });
                calculate();
              }}
              placeholder="e.g., Cat 265"
            />
            <Input
              label="Purchase Price ($)"
              type="number"
              value={formData.purchasePrice}
              onChange={(e) => {
                setFormData({ ...formData, purchasePrice: Number(e.target.value) });
                calculate();
              }}
            />
            <Input
              label="Useful Life (years)"
              type="number"
              value={formData.usefulLifeYears}
              onChange={(e) => {
                setFormData({ ...formData, usefulLifeYears: Number(e.target.value) });
                calculate();
              }}
            />
            <Input
              label="Annual Operating Hours"
              type="number"
              value={formData.annualHours}
              onChange={(e) => {
                setFormData({ ...formData, annualHours: Number(e.target.value) });
                calculate();
              }}
            />
            <Input
              label="Financed APR (%)"
              type="number"
              step="0.1"
              value={formData.apr}
              onChange={(e) => {
                setFormData({ ...formData, apr: Number(e.target.value) });
                calculate();
              }}
              helperText="Leave 0 if paid in cash"
            />
            <Input
              label="Annual Insurance ($)"
              type="number"
              value={formData.annualInsurance}
              onChange={(e) => {
                setFormData({ ...formData, annualInsurance: Number(e.target.value) });
                calculate();
              }}
            />
            <Input
              label="Annual Registration ($)"
              type="number"
              value={formData.annualRegistration}
              onChange={(e) => {
                setFormData({ ...formData, annualRegistration: Number(e.target.value) });
                calculate();
              }}
            />
            <Input
              label="Fuel Consumption (gal/hr)"
              type="number"
              step="0.1"
              value={formData.fuelGallonsPerHour}
              onChange={(e) => {
                setFormData({ ...formData, fuelGallonsPerHour: Number(e.target.value) });
                calculate();
              }}
            />
            <Input
              label="Fuel Price ($/gal)"
              type="number"
              step="0.01"
              value={formData.fuelPricePerGallon}
              onChange={(e) => {
                setFormData({ ...formData, fuelPricePerGallon: Number(e.target.value) });
                calculate();
              }}
            />
            <Input
              label="Annual Maintenance ($)"
              type="number"
              value={formData.annualMaintenance}
              onChange={(e) => {
                setFormData({ ...formData, annualMaintenance: Number(e.target.value) });
                calculate();
              }}
            />
            <Input
              label="Annual Repairs ($)"
              type="number"
              value={formData.annualRepairs}
              onChange={(e) => {
                setFormData({ ...formData, annualRepairs: Number(e.target.value) });
                calculate();
              }}
            />
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
              Annual Finance Cost = ${result.annualFinanceCost.toFixed(2)}
            </div>
            <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
              Ownership/Hour = ${result.ownershipPerHour.toFixed(2)}
            </div>
            <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
              Annual Fuel = ${result.annualFuel.toFixed(2)}
            </div>
            <div className="bg-white border-l-4 border-green-800 p-3 font-mono text-sm text-green-800">
              Operating/Hour = ${result.operatingPerHour.toFixed(2)}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-8 rounded-xl text-center shadow-xl">
            <div className="text-sm uppercase tracking-wider opacity-90 mb-2">
              Equipment Hourly Cost
            </div>
            <div className="text-6xl font-bold font-mono">${result.totalPerHour.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}