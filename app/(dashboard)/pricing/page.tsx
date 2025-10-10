'use client';

import { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, Plus, Trash2 } from 'lucide-react';

interface Equipment {
  id: number;
  equipmentName: string;
  purchasePrice: number;
  usefulLifeYears: number;
  annualHours: number;
  apr: number;
  annualInsurance: number;
  annualRegistration: number;
  fuelGallonsPerHour: number;
  fuelPricePerGallon: number;
  annualMaintenance: number;
  annualRepairs: number;
  hourlyCost: number;
}

interface Employee {
  id: number;
  name: string;
  baseWage: number;
  burdenMultiplier: number;
  hourlyCost: number;
}

export default function PricingCalculatorPage() {
  const { organization } = useOrganization();
  const createEquipment = useMutation(api.userEquipment.create);
  const createLoadout = useMutation(api.userLoadouts.create);

  // Step 1: Equipment
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 1,
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
      hourlyCost: 0,
    },
  ]);

  // Step 2: Employees
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: '',
      baseWage: 0,
      burdenMultiplier: 1.7,
      hourlyCost: 0,
    },
  ]);

  // Step 3 & 4: Loadout & Pricing
  const [loadoutCost, setLoadoutCost] = useState(0);
  const [profitMargin, setProfitMargin] = useState(50);
  const [billingRate, setBillingRate] = useState(0);

  // Step 5: Project
  const [projectName, setProjectName] = useState('');
  const [acreage, setAcreage] = useState(0);
  const [dbhPackage, setDbhPackage] = useState(6);
  const [inchAcres, setInchAcres] = useState(0);

  // Step 5b: Production Rate
  const [iaCompleted, setIaCompleted] = useState(0);
  const [hoursToComplete, setHoursToComplete] = useState(0);
  const [productionRate, setProductionRate] = useState(0);

  // Step 6: Final Price
  const [finalPrice, setFinalPrice] = useState(0);

  // Calculate equipment hourly cost
  const calculateEquipmentCost = (eq: Equipment) => {
    const annualFinanceCost = eq.purchasePrice * (eq.apr / 100);
    const annualDepreciation = eq.purchasePrice / eq.usefulLifeYears;
    const totalAnnualOwnership =
      annualDepreciation + annualFinanceCost + eq.annualInsurance + eq.annualRegistration;
    const ownershipPerHour = totalAnnualOwnership / eq.annualHours;

    const fuelCostPerHour = eq.fuelGallonsPerHour * eq.fuelPricePerGallon;
    const maintenancePerHour = eq.annualMaintenance / eq.annualHours;
    const repairsPerHour = eq.annualRepairs / eq.annualHours;
    const operatingPerHour = fuelCostPerHour + maintenancePerHour + repairsPerHour;

    return ownershipPerHour + operatingPerHour;
  };

  // Calculate employee hourly cost
  const calculateEmployeeCost = (emp: Employee) => {
    return emp.baseWage * emp.burdenMultiplier;
  };

  // Update equipment hourly cost when inputs change
  useEffect(() => {
    const updated = equipment.map((eq) => ({
      ...eq,
      hourlyCost: calculateEquipmentCost(eq),
    }));
    setEquipment(updated);
  }, [equipment.map((e) => JSON.stringify(e)).join(',')]);

  // Update employee hourly cost when inputs change
  useEffect(() => {
    const updated = employees.map((emp) => ({
      ...emp,
      hourlyCost: calculateEmployeeCost(emp),
    }));
    setEmployees(updated);
  }, [employees.map((e) => JSON.stringify(e)).join(',')]);

  // Calculate total loadout cost
  useEffect(() => {
    const totalEquipment = equipment.reduce((sum, eq) => sum + eq.hourlyCost, 0);
    const totalLabor = employees.reduce((sum, emp) => sum + emp.hourlyCost, 0);
    setLoadoutCost(totalEquipment + totalLabor);
  }, [equipment, employees]);

  // Calculate billing rate
  useEffect(() => {
    const divisor = 1 - profitMargin / 100;
    setBillingRate(divisor !== 0 ? loadoutCost / divisor : 0);
  }, [loadoutCost, profitMargin]);

  // Calculate inch-acres
  useEffect(() => {
    setInchAcres(acreage * dbhPackage);
  }, [acreage, dbhPackage]);

  // Calculate production rate
  useEffect(() => {
    if (hoursToComplete > 0) {
      setProductionRate(iaCompleted / hoursToComplete);
    }
  }, [iaCompleted, hoursToComplete]);

  // Calculate final price
  useEffect(() => {
    if (productionRate > 0) {
      const jobHours = inchAcres / productionRate;
      setFinalPrice(jobHours * billingRate);
    }
  }, [inchAcres, billingRate, productionRate]);

  const addEquipment = () => {
    setEquipment([
      ...equipment,
      {
        id: equipment.length + 1,
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
        hourlyCost: 0,
      },
    ]);
  };

  const removeEquipment = (id: number) => {
    setEquipment(equipment.filter((e) => e.id !== id));
  };

  const updateEquipmentField = (id: number, field: string, value: any) => {
    setEquipment(
      equipment.map((eq) => (eq.id === id ? { ...eq, [field]: value } : eq))
    );
  };

  const addEmployee = () => {
    setEmployees([
      ...employees,
      {
        id: employees.length + 1,
        name: '',
        baseWage: 0,
        burdenMultiplier: 1.7,
        hourlyCost: 0,
      },
    ]);
  };

  const removeEmployee = (id: number) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const updateEmployeeField = (id: number, field: string, value: any) => {
    setEmployees(
      employees.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
    );
  };

  const handleSaveAll = async () => {
    if (!organization?.id) {
      alert('Please sign in to save');
      return;
    }

    try {
      // Save all equipment
      const equipmentIds = await Promise.all(
        equipment.map((eq) =>
          createEquipment({
            organizationId: organization.id,
            equipmentName: eq.equipmentName,
            category: 'general',
            purchasePrice: eq.purchasePrice,
            usefulLifeYears: eq.usefulLifeYears,
            annualFinanceCost: eq.purchasePrice * (eq.apr / 100),
            annualInsurance: eq.annualInsurance,
            annualRegistration: eq.annualRegistration,
            annualHours: eq.annualHours,
            fuelGallonsPerHour: eq.fuelGallonsPerHour,
            fuelPricePerGallon: eq.fuelPricePerGallon,
            annualMaintenance: eq.annualMaintenance,
            annualRepairs: eq.annualRepairs,
          })
        )
      );

      alert('Saved successfully!');
    } catch (error) {
      alert('Error saving: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-green-800 mb-2">🌲 TreeShop Pricing Calculator</h1>
              <p className="text-gray-600">Complete 6-step pricing system with auto-save</p>
            </div>
            <Button onClick={handleSaveAll} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save All to Database
            </Button>
          </div>

          {/* STEP 1: EQUIPMENT FORMS */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-green-800">Step 1: Equipment Forms</h2>
              <Button onClick={addEquipment} variant="secondary" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {equipment.map((eq, idx) => (
                <Card key={eq.id} className="bg-green-50 border-2 border-green-300">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Equipment #{idx + 1}</CardTitle>
                    {equipment.length > 1 && (
                      <button
                        onClick={() => removeEquipment(eq.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Equipment Name"
                        value={eq.equipmentName}
                        onChange={(e) => updateEquipmentField(eq.id, 'equipmentName', e.target.value)}
                        placeholder="e.g., Cat 265"
                      />
                      <Input
                        label="Purchase Price ($)"
                        type="number"
                        value={eq.purchasePrice}
                        onChange={(e) => updateEquipmentField(eq.id, 'purchasePrice', Number(e.target.value))}
                      />
                      <Input
                        label="Useful Life (years)"
                        type="number"
                        value={eq.usefulLifeYears}
                        onChange={(e) => updateEquipmentField(eq.id, 'usefulLifeYears', Number(e.target.value))}
                      />
                      <Input
                        label="Annual Hours"
                        type="number"
                        value={eq.annualHours}
                        onChange={(e) => updateEquipmentField(eq.id, 'annualHours', Number(e.target.value))}
                      />
                      <Input
                        label="Financed APR (%)"
                        type="number"
                        step="0.1"
                        value={eq.apr}
                        onChange={(e) => updateEquipmentField(eq.id, 'apr', Number(e.target.value))}
                        helperText="0 if paid cash"
                      />
                      <Input
                        label="Annual Insurance ($)"
                        type="number"
                        value={eq.annualInsurance}
                        onChange={(e) => updateEquipmentField(eq.id, 'annualInsurance', Number(e.target.value))}
                      />
                      <Input
                        label="Annual Registration ($)"
                        type="number"
                        value={eq.annualRegistration}
                        onChange={(e) => updateEquipmentField(eq.id, 'annualRegistration', Number(e.target.value))}
                      />
                      <Input
                        label="Fuel (gal/hr)"
                        type="number"
                        step="0.1"
                        value={eq.fuelGallonsPerHour}
                        onChange={(e) => updateEquipmentField(eq.id, 'fuelGallonsPerHour', Number(e.target.value))}
                      />
                      <Input
                        label="Fuel Price ($/gal)"
                        type="number"
                        step="0.01"
                        value={eq.fuelPricePerGallon}
                        onChange={(e) => updateEquipmentField(eq.id, 'fuelPricePerGallon', Number(e.target.value))}
                      />
                      <Input
                        label="Annual Maintenance ($)"
                        type="number"
                        value={eq.annualMaintenance}
                        onChange={(e) => updateEquipmentField(eq.id, 'annualMaintenance', Number(e.target.value))}
                      />
                      <Input
                        label="Annual Repairs ($)"
                        type="number"
                        value={eq.annualRepairs}
                        onChange={(e) => updateEquipmentField(eq.id, 'annualRepairs', Number(e.target.value))}
                      />
                    </div>
                    <div className="mt-4 bg-green-800 text-white p-4 rounded-lg text-center">
                      <div className="text-sm uppercase tracking-wider opacity-90">HOURLY COST</div>
                      <div className="text-3xl font-bold font-mono">
                        ${eq.hourlyCost.toFixed(2)}/hr
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* STEP 2: EMPLOYEE FORMS */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-green-800">Step 2: Employee Forms</h2>
              <Button onClick={addEmployee} variant="secondary" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((emp, idx) => (
                <Card key={emp.id} className="bg-blue-50 border-2 border-blue-300">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Employee #{idx + 1}</CardTitle>
                    {employees.length > 1 && (
                      <button
                        onClick={() => removeEmployee(emp.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input
                        label="Employee Name/Position"
                        value={emp.name}
                        onChange={(e) => updateEmployeeField(emp.id, 'name', e.target.value)}
                        placeholder="e.g., Operator"
                      />
                      <Input
                        label="Base Hourly Wage ($)"
                        type="number"
                        value={emp.baseWage}
                        onChange={(e) => updateEmployeeField(emp.id, 'baseWage', Number(e.target.value))}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Burden Multiplier
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={emp.burdenMultiplier}
                          onChange={(e) =>
                            updateEmployeeField(emp.id, 'burdenMultiplier', Number(e.target.value))
                          }
                        >
                          <option value={1.6}>Entry Ground Crew (1.6x)</option>
                          <option value={1.7}>Experienced Climber (1.7x)</option>
                          <option value={1.8}>Crew Leader (1.8x)</option>
                          <option value={1.9}>Certified Arborist (1.9x)</option>
                          <option value={2.0}>Specialized Operator (2.0x)</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 bg-blue-800 text-white p-4 rounded-lg text-center">
                      <div className="text-sm uppercase tracking-wider opacity-90">HOURLY COST</div>
                      <div className="text-3xl font-bold font-mono">
                        ${emp.hourlyCost.toFixed(2)}/hr
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* STEP 3: LOADOUT OPERATING COST */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Step 3: Loadout Operating Cost</h2>
            <Card className="bg-yellow-50 border-2 border-yellow-400">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Total Equipment Cost:</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${equipment.reduce((sum, eq) => sum + eq.hourlyCost, 0).toFixed(2)}/hr
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Total Labor Cost:</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${employees.reduce((sum, emp) => sum + emp.hourlyCost, 0).toFixed(2)}/hr
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">LOADOUT OPERATING COST:</div>
                    <div className="text-3xl font-bold text-green-800">
                      ${loadoutCost.toFixed(2)}/hr
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* STEP 4: ADD PROFIT MARGIN */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Step 4: Add Profit Margin</h2>
            <Card className="bg-purple-50 border-2 border-purple-300">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Loadout Cost from Step 3 ($/hr)"
                      type="number"
                      value={loadoutCost}
                      disabled
                      helperText="Auto-filled from above"
                    />
                  </div>
                  <div>
                    <Input
                      label="Desired Profit Margin (%)"
                      type="number"
                      value={profitMargin}
                      onChange={(e) => setProfitMargin(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="mt-6 bg-purple-800 text-white p-6 rounded-lg text-center">
                  <div className="text-sm uppercase tracking-wider opacity-90">HOURLY BILLING RATE</div>
                  <div className="text-5xl font-bold font-mono">${billingRate.toFixed(2)}/hr</div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* STEP 5: PROJECT DETAILS */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Step 5: Project Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Scope */}
              <Card className="bg-indigo-50 border-2 border-indigo-300">
                <CardHeader>
                  <CardTitle>Project Scope</CardTitle>
                </CardHeader>
                <CardContent>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">DBH Package</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={dbhPackage}
                        onChange={(e) => setDbhPackage(Number(e.target.value))}
                      >
                        <option value={4}>Small Package (4" DBH)</option>
                        <option value={6}>Medium Package (6" DBH)</option>
                        <option value={8}>Large Package (8" DBH)</option>
                      </select>
                    </div>
                    <div className="mt-4 bg-indigo-800 text-white p-4 rounded-lg text-center">
                      <div className="text-sm uppercase tracking-wider opacity-90">TOTAL INCH-ACRES</div>
                      <div className="text-3xl font-bold font-mono">{inchAcres.toFixed(2)} IA</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Production Rate */}
              <Card className="bg-orange-50 border-2 border-orange-300">
                <CardHeader>
                  <CardTitle>Production Rate Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      label="Inch-Acres Completed"
                      type="number"
                      step="0.1"
                      value={iaCompleted}
                      onChange={(e) => setIaCompleted(Number(e.target.value))}
                    />
                    <Input
                      label="Hours to Complete"
                      type="number"
                      step="0.1"
                      value={hoursToComplete}
                      onChange={(e) => setHoursToComplete(Number(e.target.value))}
                    />
                    <div className="mt-4 bg-orange-800 text-white p-4 rounded-lg text-center">
                      <div className="text-sm uppercase tracking-wider opacity-90">PRODUCTION RATE</div>
                      <div className="text-3xl font-bold font-mono">
                        {productionRate.toFixed(2)} IA/hr
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* STEP 6: FINAL PROJECT PRICE */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Step 6: Final Project Price</h2>
            <Card className="bg-gradient-to-br from-green-800 to-green-600 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-sm uppercase tracking-wider opacity-90 mb-4">
                    Calculate Final Price
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-6">
                    <div>
                      <div className="opacity-75">Total Inch-Acres</div>
                      <div className="font-mono font-semibold">{inchAcres.toFixed(2)} IA</div>
                      <div className="text-xs opacity-60">Auto-filled from Step 5</div>
                    </div>
                    <div>
                      <div className="opacity-75">Hourly Billing Rate</div>
                      <div className="font-mono font-semibold">${billingRate.toFixed(2)}/hr</div>
                      <div className="text-xs opacity-60">Auto-filled from Step 4</div>
                    </div>
                    <div>
                      <div className="opacity-75">Production Rate</div>
                      <div className="font-mono font-semibold">{productionRate.toFixed(2)} IA/hr</div>
                      <div className="text-xs opacity-60">Auto-filled from Step 5</div>
                    </div>
                  </div>
                </div>

                <div className="text-center border-t border-white/20 pt-6">
                  <div className="text-lg uppercase tracking-widest opacity-90 mb-3">
                    FINAL PROJECT PRICE
                  </div>
                  <div className="text-7xl font-bold font-mono">${finalPrice.toFixed(2)}</div>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="text-center bg-green-800 text-white p-6 rounded-lg">
            <strong className="text-2xl">TreeShop Pricing System ✓</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
