'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Check } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateEquipmentCost } from '@/lib/formulas/pricing';
import type { EquipmentCostParams } from '@/lib/formulas/pricing';
import styles from './page.module.css';

const schema = z.object({
  equipmentName: z.string().min(1, 'Equipment name is required'),
  purchasePrice: z.number().positive(),
  usefulLifeYears: z.number().positive(),
  annualFinanceCost: z.number().min(0),
  annualInsurance: z.number().min(0),
  annualRegistration: z.number().min(0),
  annualHours: z.number().positive(),
  fuelGallonsPerHour: z.number().min(0),
  fuelPricePerGallon: z.number().positive(),
  annualMaintenance: z.number().min(0),
  annualRepairs: z.number().min(0),
});

type FormData = z.infer<typeof schema>;

export default function EquipmentCostCalculatorPage() {
  const [result, setResult] = useState<ReturnType<typeof calculateEquipmentCost> | null>(null);
  const [saved, setSaved] = useState(false);
  const createEquipment = useMutation(api.equipment.create);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      equipmentName: 'Ford F450',
      purchasePrice: 65000,
      usefulLifeYears: 5,
      annualFinanceCost: 3250,
      annualInsurance: 3000,
      annualRegistration: 600,
      annualHours: 2000,
      fuelGallonsPerHour: 6,
      fuelPricePerGallon: 3.75,
      annualMaintenance: 8500,
      annualRepairs: 3500,
    },
  });

  const onSubmit = (data: FormData) => {
    const { equipmentName, ...costParams } = data;
    const calculated = calculateEquipmentCost(costParams as EquipmentCostParams);
    setResult(calculated);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!result) {
      alert('Please calculate equipment cost first');
      return;
    }

    const data = getValues();
    const { equipmentName, ...costParams } = data;

    await createEquipment({
      organizationId: 'org_mock123',
      equipmentName,
      ...costParams,
      ...result,
      status: 'active',
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Equipment Cost Calculator</h1>
        <p className={styles.subtitle}>Calculate true hourly equipment costs</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Equipment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fields}>
                  <Input
                    label="Equipment Name"
                    placeholder="e.g., Ford F450, Cat 265"
                    {...register('equipmentName')}
                    error={errors.equipmentName?.message}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ownership Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fields}>
                  <Input
                    label="Purchase Price ($)"
                    type="number"
                    step="0.01"
                    {...register('purchasePrice', { valueAsNumber: true })}
                    error={errors.purchasePrice?.message}
                  />
                  <Input
                    label="Useful Life (years)"
                    type="number"
                    {...register('usefulLifeYears', { valueAsNumber: true })}
                    error={errors.usefulLifeYears?.message}
                  />
                  <Input
                    label="Annual Finance Cost ($)"
                    type="number"
                    step="0.01"
                    {...register('annualFinanceCost', { valueAsNumber: true })}
                    error={errors.annualFinanceCost?.message}
                  />
                  <Input
                    label="Annual Insurance ($)"
                    type="number"
                    step="0.01"
                    {...register('annualInsurance', { valueAsNumber: true })}
                    error={errors.annualInsurance?.message}
                  />
                  <Input
                    label="Annual Registration ($)"
                    type="number"
                    step="0.01"
                    {...register('annualRegistration', { valueAsNumber: true })}
                    error={errors.annualRegistration?.message}
                  />
                  <Input
                    label="Annual Hours"
                    type="number"
                    {...register('annualHours', { valueAsNumber: true })}
                    error={errors.annualHours?.message}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fields}>
                  <Input
                    label="Fuel (gallons/hour)"
                    type="number"
                    step="0.1"
                    {...register('fuelGallonsPerHour', { valueAsNumber: true })}
                    error={errors.fuelGallonsPerHour?.message}
                  />
                  <Input
                    label="Fuel Price ($/gallon)"
                    type="number"
                    step="0.01"
                    {...register('fuelPricePerGallon', { valueAsNumber: true })}
                    error={errors.fuelPricePerGallon?.message}
                  />
                  <Input
                    label="Annual Maintenance ($)"
                    type="number"
                    step="0.01"
                    {...register('annualMaintenance', { valueAsNumber: true })}
                    error={errors.annualMaintenance?.message}
                  />
                  <Input
                    label="Annual Repairs ($)"
                    type="number"
                    step="0.01"
                    {...register('annualRepairs', { valueAsNumber: true })}
                    error={errors.annualRepairs?.message}
                  />
                </div>
              </CardContent>
            </Card>

            <div className={styles.actions}>
              <Button type="submit" size="lg">
                Calculate
              </Button>
              {result && (
                <Button
                  type="button"
                  variant={saved ? 'default' : 'secondary'}
                  size="lg"
                  onClick={handleSave}
                  disabled={saved}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" style={{ marginRight: '8px' }} />
                      Saved to Equipment Library
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" style={{ marginRight: '8px' }} />
                      Save to Equipment Library
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        {result && (
          <div className={styles.results}>
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <div className={styles.resultLabel}>Ownership Cost/Hour</div>
                    <div className={styles.resultValue}>${result.ownershipCostPerHour.toFixed(2)}</div>
                  </div>
                  <div className={styles.resultItem}>
                    <div className={styles.resultLabel}>Operating Cost/Hour</div>
                    <div className={styles.resultValue}>${result.operatingCostPerHour.toFixed(2)}</div>
                  </div>
                  <div className={styles.resultTotal}>
                    <div className={styles.resultLabel}>Total Cost/Hour</div>
                    <div className={styles.resultValueLarge}>${result.totalCostPerHour.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.breakdown}>
                  <div className={styles.breakdownItem}>
                    <span>Depreciation</span>
                    <span>${result.breakdown.depreciation.toFixed(2)}/hr</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Finance</span>
                    <span>${result.breakdown.finance.toFixed(2)}/hr</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Insurance</span>
                    <span>${result.breakdown.insurance.toFixed(2)}/hr</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Registration</span>
                    <span>${result.breakdown.registration.toFixed(2)}/hr</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Fuel</span>
                    <span>${result.breakdown.fuel.toFixed(2)}/hr</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Maintenance</span>
                    <span>${result.breakdown.maintenance.toFixed(2)}/hr</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Repairs</span>
                    <span>${result.breakdown.repairs.toFixed(2)}/hr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
