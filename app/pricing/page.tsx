'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, ArrowRight, CheckCircle, Truck, Users, Wrench, FileText } from 'lucide-react';
import Link from 'next/link';

type WizardStep = 'equipment' | 'employees' | 'loadouts' | 'pricing';

export default function CompletePricingSystem() {
  const equipment = useQuery(api.equipment.list, { organizationId: 'org_demo' }) || [];
  const loadouts = useQuery(api.loadouts.list, { organizationId: 'org_demo' }) || [];
  const createEquipment = useMutation(api.equipment.create);
  const createLoadout = useMutation(api.loadouts.create);

  const [currentStep, setCurrentStep] = useState<WizardStep>('equipment');
  const [equipmentList, setEquipmentList] = useState([
    {
      id: 1,
      equipmentName: '',
      category: 'truck',
      purchasePrice: 0,
      usefulLifeYears: 7,
      annualHours: 1500,
      annualFinanceCost: 0,
      annualInsurance: 0,
      annualRegistration: 0,
      fuelGallonsPerHour: 0,
      fuelPricePerGallon: 3.75,
      annualMaintenance: 0,
      annualRepairs: 0,
    },
  ]);

  const [employeeList, setEmployeeList] = useState([
    { id: 1, position: '', baseWage: 0, multiplier: 1.7 },
  ]);

  const [loadoutForm, setLoadoutForm] = useState({
    loadoutName: '',
    serviceType: 'mulching',
    selectedEquipment: [] as string[],
    selectedEmployees: [] as number[],
    productionRate: 1.3,
  });

  const calculateEquipmentCost = (eq: typeof equipmentList[0]) => {
    const annualDepreciation = eq.purchasePrice / eq.usefulLifeYears;
    const totalOwnership = annualDepreciation + eq.annualFinanceCost + eq.annualInsurance + eq.annualRegistration;
    const ownershipPerHour = totalOwnership / eq.annualHours;
    const fuelPerHour = eq.fuelGallonsPerHour * eq.fuelPricePerGallon;
    const maintenancePerHour = eq.annualMaintenance / eq.annualHours;
    const repairsPerHour = eq.annualRepairs / eq.annualHours;
    const operatingPerHour = fuelPerHour + maintenancePerHour + repairsPerHour;
    return ownershipPerHour + operatingPerHour;
  };

  const saveAllEquipment = async () => {
    for (const eq of equipmentList) {
      if (eq.equipmentName) {
        const cost = calculateEquipmentCost(eq);
        await createEquipment({
          organizationId: 'org_demo',
          equipmentName: eq.equipmentName,
          category: eq.category,
          purchasePrice: eq.purchasePrice,
          usefulLifeYears: eq.usefulLifeYears,
          annualFinanceCost: eq.annualFinanceCost,
          annualInsurance: eq.annualInsurance,
          annualRegistration: eq.annualRegistration,
          annualHours: eq.annualHours,
          fuelGallonsPerHour: eq.fuelGallonsPerHour,
          fuelPricePerGallon: eq.fuelPricePerGallon,
          annualMaintenance: eq.annualMaintenance,
          annualRepairs: eq.annualRepairs,
          ownershipCostPerHour: cost * 0.4,
          operatingCostPerHour: cost * 0.6,
          totalCostPerHour: cost,
          status: 'active',
        });
      }
    }
    setCurrentStep('employees');
  };

  const saveAllLoadouts = async () => {
    const selectedEq = equipment.filter((e) => loadoutForm.selectedEquipment.includes(e._id));
    const selectedEmp = employeeList.filter((e) => loadoutForm.selectedEmployees.includes(e.id));

    const equipmentCost = selectedEq.reduce((sum, eq) => sum + eq.totalCostPerHour, 0);
    const laborCost = selectedEmp.reduce((sum, emp) => sum + emp.baseWage * emp.multiplier, 0);

    await createLoadout({
      organizationId: 'org_demo',
      loadoutName: loadoutForm.loadoutName,
      serviceType: loadoutForm.serviceType,
      equipmentIds: loadoutForm.selectedEquipment as any,
      employees: selectedEmp.map((emp) => ({
        position: emp.position,
        baseWage: emp.baseWage,
        burdenMultiplier: emp.multiplier,
        trueCostPerHour: emp.baseWage * emp.multiplier,
      })),
      totalEquipmentCostPerHour: equipmentCost,
      totalLaborCostPerHour: laborCost,
      totalLoadoutCostPerHour: equipmentCost + laborCost,
      productionRate: loadoutForm.productionRate,
    });

    setCurrentStep('pricing');
  };

  const steps = [
    { key: 'equipment', label: 'Equipment', icon: Truck },
    { key: 'employees', label: 'Employees', icon: Users },
    { key: 'loadouts', label: 'Loadouts', icon: Wrench },
    { key: 'pricing', label: 'Pricing', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.key;
              const isComplete = steps.findIndex((s) => s.key === currentStep) > idx;

              return (
                <div key={step.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isComplete
                          ? 'bg-green-600 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isComplete ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-1 flex-1 ${isComplete ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-8">
          {/* STEP 1: EQUIPMENT */}
          {currentStep === 'equipment' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Your Equipment</h1>
              <p className="text-gray-600 mb-8">Add all pieces of equipment in your inventory</p>

              {equipmentList.map((eq, idx) => (
                <div key={eq.id} className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Equipment #{idx + 1}</h3>
                    {equipmentList.length > 1 && (
                      <button
                        onClick={() => setEquipmentList(equipmentList.filter((e) => e.id !== eq.id))}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Equipment Name"
                      value={eq.equipmentName}
                      onChange={(e) => {
                        const updated = [...equipmentList];
                        updated[idx].equipmentName = e.target.value;
                        setEquipmentList(updated);
                      }}
                    />
                    <Input
                      label="Purchase Price ($)"
                      type="number"
                      value={eq.purchasePrice}
                      onChange={(e) => {
                        const updated = [...equipmentList];
                        updated[idx].purchasePrice = Number(e.target.value);
                        setEquipmentList(updated);
                      }}
                    />
                    <Input
                      label="Useful Life (years)"
                      type="number"
                      value={eq.usefulLifeYears}
                      onChange={(e) => {
                        const updated = [...equipmentList];
                        updated[idx].usefulLifeYears = Number(e.target.value);
                        setEquipmentList(updated);
                      }}
                    />
                    <Input
                      label="Annual Hours"
                      type="number"
                      value={eq.annualHours}
                      onChange={(e) => {
                        const updated = [...equipmentList];
                        updated[idx].annualHours = Number(e.target.value);
                        setEquipmentList(updated);
                      }}
                    />
                    <Input
                      label="Insurance ($)"
                      type="number"
                      value={eq.annualInsurance}
                      onChange={(e) => {
                        const updated = [...equipmentList];
                        updated[idx].annualInsurance = Number(e.target.value);
                        setEquipmentList(updated);
                      }}
                    />
                    <Input
                      label="Fuel (gal/hr)"
                      type="number"
                      step="0.1"
                      value={eq.fuelGallonsPerHour}
                      onChange={(e) => {
                        const updated = [...equipmentList];
                        updated[idx].fuelGallonsPerHour = Number(e.target.value);
                        setEquipmentList(updated);
                      }}
                    />
                  </div>
                  <div className="mt-3 text-right text-lg font-bold text-green-800">
                    ${calculateEquipmentCost(eq).toFixed(2)}/hr
                  </div>
                </div>
              ))}

              <Button
                onClick={() =>
                  setEquipmentList([
                    ...equipmentList,
                    {
                      id: equipmentList.length + 1,
                      equipmentName: '',
                      category: 'truck',
                      purchasePrice: 0,
                      usefulLifeYears: 7,
                      annualHours: 1500,
                      annualFinanceCost: 0,
                      annualInsurance: 0,
                      annualRegistration: 0,
                      fuelGallonsPerHour: 0,
                      fuelPricePerGallon: 3.75,
                      annualMaintenance: 0,
                      annualRepairs: 0,
                    },
                  ])
                }
                variant="secondary"
                className="mb-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Equipment
              </Button>

              <div className="flex gap-3">
                <Button onClick={saveAllEquipment} className="flex-1">
                  Save Equipment & Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: EMPLOYEES */}
          {currentStep === 'employees' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Your Crew</h1>
              <p className="text-gray-600 mb-8">Add all employees in your organization</p>

              {employeeList.map((emp, idx) => (
                <div key={emp.id} className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Employee #{idx + 1}</h3>
                    {employeeList.length > 1 && (
                      <button
                        onClick={() => setEmployeeList(employeeList.filter((e) => e.id !== emp.id))}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Position/Name"
                      value={emp.position}
                      onChange={(e) => {
                        const updated = [...employeeList];
                        updated[idx].position = e.target.value;
                        setEmployeeList(updated);
                      }}
                    />
                    <Input
                      label="Base Wage ($)"
                      type="number"
                      value={emp.baseWage}
                      onChange={(e) => {
                        const updated = [...employeeList];
                        updated[idx].baseWage = Number(e.target.value);
                        setEmployeeList(updated);
                      }}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Multiplier</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg"
                        value={emp.multiplier}
                        onChange={(e) => {
                          const updated = [...employeeList];
                          updated[idx].multiplier = Number(e.target.value);
                          setEmployeeList(updated);
                        }}
                      >
                        <option value={1.6}>Entry (1.6x)</option>
                        <option value={1.7}>Experienced (1.7x)</option>
                        <option value={1.8}>Crew Leader (1.8x)</option>
                        <option value={1.9}>Arborist (1.9x)</option>
                        <option value={2.0}>Specialist (2.0x)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 text-right text-lg font-bold text-blue-800">
                    ${(emp.baseWage * emp.multiplier).toFixed(2)}/hr
                  </div>
                </div>
              ))}

              <Button
                onClick={() =>
                  setEmployeeList([
                    ...employeeList,
                    { id: employeeList.length + 1, position: '', baseWage: 0, multiplier: 1.7 },
                  ])
                }
                variant="secondary"
                className="mb-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Employee
              </Button>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setCurrentStep('equipment')}>
                  ← Back
                </Button>
                <Button onClick={() => setCurrentStep('loadouts')} className="flex-1">
                  Continue to Loadouts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: LOADOUTS */}
          {currentStep === 'loadouts' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Loadouts</h1>
              <p className="text-gray-600 mb-8">
                Select equipment and crew to create loadout configurations
              </p>

              <div className="space-y-6">
                <Input
                  label="Loadout Name"
                  value={loadoutForm.loadoutName}
                  onChange={(e) => setLoadoutForm({ ...loadoutForm, loadoutName: e.target.value })}
                  placeholder="e.g., Cat 265 Standard Crew"
                />

                <div>
                  <h3 className="font-semibold mb-3">Select Equipment ({equipment.length} available)</h3>
                  {equipment.length === 0 ? (
                    <div className="text-gray-500">No equipment saved yet. Go back to add equipment.</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {equipment.map((eq) => (
                        <button
                          key={eq._id}
                          type="button"
                          onClick={() => {
                            if (loadoutForm.selectedEquipment.includes(eq._id)) {
                              setLoadoutForm({
                                ...loadoutForm,
                                selectedEquipment: loadoutForm.selectedEquipment.filter((id) => id !== eq._id),
                              });
                            } else {
                              setLoadoutForm({
                                ...loadoutForm,
                                selectedEquipment: [...loadoutForm.selectedEquipment, eq._id],
                              });
                            }
                          }}
                          className={`p-4 rounded-lg border-2 text-left ${
                            loadoutForm.selectedEquipment.includes(eq._id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="font-semibold">{eq.equipmentName}</div>
                          <div className="text-sm text-gray-600">${eq.totalCostPerHour.toFixed(2)}/hr</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Select Crew ({employeeList.length} available)</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {employeeList.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          if (loadoutForm.selectedEmployees.includes(emp.id)) {
                            setLoadoutForm({
                              ...loadoutForm,
                              selectedEmployees: loadoutForm.selectedEmployees.filter((id) => id !== emp.id),
                            });
                          } else {
                            setLoadoutForm({
                              ...loadoutForm,
                              selectedEmployees: [...loadoutForm.selectedEmployees, emp.id],
                            });
                          }
                        }}
                        className={`p-4 rounded-lg border-2 text-left ${
                          loadoutForm.selectedEmployees.includes(emp.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="font-semibold">{emp.position || 'Employee'}</div>
                        <div className="text-sm text-gray-600">${(emp.baseWage * emp.multiplier).toFixed(2)}/hr</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Production Rate"
                  type="number"
                  step="0.1"
                  value={loadoutForm.productionRate}
                  onChange={(e) => setLoadoutForm({ ...loadoutForm, productionRate: Number(e.target.value) })}
                  helperText="e.g., 1.3 IA/hr for Cat 265"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="secondary" onClick={() => setCurrentStep('employees')}>
                  ← Back
                </Button>
                <Button onClick={saveAllLoadouts} className="flex-1">
                  Save Loadout & Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: PRICING */}
          {currentStep === 'pricing' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Complete!</h1>
              <p className="text-gray-600 mb-8">
                Your equipment, employees, and loadouts are saved. Start pricing projects!
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Link href="/equipment" className="p-6 bg-green-50 border border-green-200 rounded-lg hover:shadow-lg">
                  <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold">Equipment Library</div>
                  <div className="text-sm text-gray-600">{equipment.length} items</div>
                </Link>
                <Link href="/loadouts" className="p-6 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg">
                  <Wrench className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">Loadouts</div>
                  <div className="text-sm text-gray-600">{loadouts.length} configured</div>
                </Link>
              </div>

              <Button onClick={() => setCurrentStep('equipment')} variant="secondary" className="mt-8">
                Start Over
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
