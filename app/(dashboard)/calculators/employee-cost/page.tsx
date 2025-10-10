'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateEmployeeCost, BURDEN_MULTIPLIERS } from '@/lib/formulas/pricing';
import styles from '../equipment-cost/page.module.css';

const schema = z.object({
  baseHourlyRate: z.number().positive(),
  annualHours: z.number().positive(),
  burdenMultiplier: z.number().min(1),
});

type FormData = z.infer<typeof schema>;

export default function EmployeeCostCalculatorPage() {
  const [result, setResult] = useState<ReturnType<typeof calculateEmployeeCost> | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      baseHourlyRate: 35,
      annualHours: 2080,
      burdenMultiplier: 1.7,
    },
  });

  const onSubmit = (data: FormData) => {
    const calculated = calculateEmployeeCost(data);
    setResult(calculated);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Employee Cost Calculator</h1>
        <p className={styles.subtitle}>Calculate true labor costs with burden</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Employee Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fields}>
                  <Input
                    label="Base Hourly Rate ($)"
                    type="number"
                    step="0.01"
                    {...register('baseHourlyRate', { valueAsNumber: true })}
                    error={errors.baseHourlyRate?.message}
                  />
                  <Input
                    label="Annual Hours"
                    type="number"
                    {...register('annualHours', { valueAsNumber: true })}
                    error={errors.annualHours?.message}
                    helpText="Default: 2080 (40hrs/week × 52 weeks)"
                  />
                  <Input
                    label="Burden Multiplier"
                    type="number"
                    step="0.1"
                    {...register('burdenMultiplier', { valueAsNumber: true })}
                    error={errors.burdenMultiplier?.message}
                    helpText="1.7 = standard (payroll + benefits + overhead)"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Select Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.quickSelect}>
                  <button
                    type="button"
                    className={styles.quickButton}
                    onClick={() => setValue('burdenMultiplier', BURDEN_MULTIPLIERS.ENTRY_GROUND_CREW)}
                  >
                    Entry Ground Crew ({BURDEN_MULTIPLIERS.ENTRY_GROUND_CREW}x)
                  </button>
                  <button
                    type="button"
                    className={styles.quickButton}
                    onClick={() => setValue('burdenMultiplier', BURDEN_MULTIPLIERS.EXPERIENCED_CLIMBER)}
                  >
                    Experienced Climber ({BURDEN_MULTIPLIERS.EXPERIENCED_CLIMBER}x)
                  </button>
                  <button
                    type="button"
                    className={styles.quickButton}
                    onClick={() => setValue('burdenMultiplier', BURDEN_MULTIPLIERS.CREW_LEADER)}
                  >
                    Crew Leader ({BURDEN_MULTIPLIERS.CREW_LEADER}x)
                  </button>
                  <button
                    type="button"
                    className={styles.quickButton}
                    onClick={() => setValue('burdenMultiplier', BURDEN_MULTIPLIERS.CERTIFIED_ARBORIST)}
                  >
                    Certified Arborist ({BURDEN_MULTIPLIERS.CERTIFIED_ARBORIST}x)
                  </button>
                  <button
                    type="button"
                    className={styles.quickButton}
                    onClick={() => setValue('burdenMultiplier', BURDEN_MULTIPLIERS.SPECIALIZED_OPERATOR)}
                  >
                    Specialized Operator ({BURDEN_MULTIPLIERS.SPECIALIZED_OPERATOR}x)
                  </button>
                </div>
              </CardContent>
            </Card>

            <div className={styles.actions}>
              <Button type="submit" size="lg">Calculate</Button>
            </div>
          </form>
        </div>

        {result && (
          <div className={styles.results}>
            <Card>
              <CardHeader>
                <CardTitle>Cost Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.resultGrid}>
                  <div className={styles.resultTotal}>
                    <div className={styles.resultLabel}>True Cost/Hour</div>
                    <div className={styles.resultValueLarge}>${result.trueCostPerHour.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annual Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.breakdown}>
                  <div className={styles.breakdownItem}>
                    <span>Base Wages</span>
                    <span>${result.annualBaseCost.toLocaleString()}</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Burden Costs</span>
                    <span>${result.annualBurdenCost.toLocaleString()}</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Total Annual Cost</span>
                    <span>${result.annualTrueCost.toLocaleString()}</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Burden Multiplier</span>
                    <span>{result.burdenMultiplier}x</span>
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
