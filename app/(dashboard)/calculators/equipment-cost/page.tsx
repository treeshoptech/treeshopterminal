'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateEquipmentCost } from '@/lib/formulas/pricing';
import type { EquipmentCostParams } from '@/lib/formulas/pricing';
import styles from './page.module.css';

const schema = z.object({
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

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
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
    const calculated = calculateEquipmentCost(data as EquipmentCostParams);
    setResult(calculated);
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
              <Button type="button" variant="secondary" size="lg" icon={<Save className="w-4 h-4" />}>
                Save to Library
              </Button>
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
