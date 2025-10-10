'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateEquipmentCost } from '@/lib/formulas/pricing';
import styles from '../../calculators/equipment-cost/page.module.css';

const schema = z.object({
  equipmentName: z.string().min(1),
  category: z.string().min(1),
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

export default function NewEquipmentPage() {
  const router = useRouter();
  const createEquipment = useMutation(api.equipment.create);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      equipmentName: '',
      category: 'truck',
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

  const formData = watch();
  const costs = calculateEquipmentCost(formData as any);

  const onSubmit = async (data: FormData) => {
    await createEquipment({
      organizationId: 'org_mock123',
      ...data,
      ...costs,
      status: 'active',
    });

    router.push('/equipment');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Equipment</h1>
        <p className={styles.subtitle}>Calculate costs and save to library</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.layout}>
          <div className={styles.form}>
            <Card>
              <CardHeader>
                <CardTitle>Equipment Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fields}>
                  <Input
                    label="Equipment Name"
                    {...register('equipmentName')}
                    error={errors.equipmentName?.message}
                  />
                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', display: 'block', marginBottom: 'var(--space-2)' }}>
                      Category
                    </label>
                    <select
                      {...register('category')}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        fontSize: 'var(--text-base)',
                        color: 'var(--text-primary)',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid transparent',
                        boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <option value="truck">Truck</option>
                      <option value="mulcher">Mulcher</option>
                      <option value="grinder">Grinder</option>
                      <option value="skid_steer">Skid Steer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ownership Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fields}>
                  <Input label="Purchase Price ($)" type="number" step="0.01" {...register('purchasePrice', { valueAsNumber: true })} error={errors.purchasePrice?.message} />
                  <Input label="Useful Life (years)" type="number" {...register('usefulLifeYears', { valueAsNumber: true })} error={errors.usefulLifeYears?.message} />
                  <Input label="Annual Finance ($)" type="number" step="0.01" {...register('annualFinanceCost', { valueAsNumber: true })} error={errors.annualFinanceCost?.message} />
                  <Input label="Annual Insurance ($)" type="number" step="0.01" {...register('annualInsurance', { valueAsNumber: true })} error={errors.annualInsurance?.message} />
                  <Input label="Annual Registration ($)" type="number" step="0.01" {...register('annualRegistration', { valueAsNumber: true })} error={errors.annualRegistration?.message} />
                  <Input label="Annual Hours" type="number" {...register('annualHours', { valueAsNumber: true })} error={errors.annualHours?.message} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fields}>
                  <Input label="Fuel (gal/hr)" type="number" step="0.1" {...register('fuelGallonsPerHour', { valueAsNumber: true })} error={errors.fuelGallonsPerHour?.message} />
                  <Input label="Fuel Price ($/gal)" type="number" step="0.01" {...register('fuelPricePerGallon', { valueAsNumber: true })} error={errors.fuelPricePerGallon?.message} />
                  <Input label="Annual Maintenance ($)" type="number" step="0.01" {...register('annualMaintenance', { valueAsNumber: true })} error={errors.annualMaintenance?.message} />
                  <Input label="Annual Repairs ($)" type="number" step="0.01" {...register('annualRepairs', { valueAsNumber: true })} error={errors.annualRepairs?.message} />
                </div>
              </CardContent>
            </Card>

            <div className={styles.actions}>
              <Button type="button" variant="secondary" onClick={() => router.push('/equipment')}>
                Cancel
              </Button>
              <Button type="submit" size="lg" loading={isSubmitting}>
                Save Equipment
              </Button>
            </div>
          </div>

          <div className={styles.results}>
            <Card>
              <CardHeader>
                <CardTitle>Calculated Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.resultTotal}>
                  <div className={styles.resultLabel}>Total Cost/Hour</div>
                  <div className={styles.resultValueLarge}>${costs.totalCostPerHour.toFixed(2)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.breakdown}>
                  <div className={styles.breakdownItem}>
                    <span>Ownership</span>
                    <span>${costs.ownershipCostPerHour.toFixed(2)}/hr</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Operating</span>
                    <span>${costs.operatingCostPerHour.toFixed(2)}/hr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
