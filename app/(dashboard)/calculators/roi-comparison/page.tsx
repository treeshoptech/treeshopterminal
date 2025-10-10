'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import styles from '../equipment-cost/page.module.css';

export default function ROIComparisonPage() {
  // Equipment A
  const [nameA, setNameA] = useState('Cat 265');
  const [costA, setCostA] = useState('246.43');
  const [rateA, setRateA] = useState('1.3');

  // Equipment B
  const [nameB, setNameB] = useState('SK200TR');
  const [costB, setCostB] = useState('286.16');
  const [rateB, setRateB] = useState('5.0');

  // Project sizes to compare
  const projectSizes = [8, 15, 40, 50];
  const margin = 0.5; // 50%

  const compareEquipment = (projectIA: number) => {
    const hoursA = projectIA / (parseFloat(rateA) || 1);
    const hoursB = projectIA / (parseFloat(rateB) || 1);

    const billingRateA = (parseFloat(costA) || 0) / (1 - margin);
    const billingRateB = (parseFloat(costB) || 0) / (1 - margin);

    const priceA = hoursA * billingRateA;
    const priceB = hoursB * billingRateB;

    const savings = priceA - priceB;
    const savingsPercent = (savings / priceA) * 100;

    return {
      hoursA,
      hoursB,
      priceA,
      priceB,
      savings,
      savingsPercent,
      winner: priceB < priceA ? nameB : nameA
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ROI Comparison</h1>
        <p className={styles.subtitle}>Compare equipment efficiency and profitability</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <Card>
            <CardHeader>
              <CardTitle>Equipment A</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.fields}>
                <Input
                  label="Equipment Name"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                />
                <Input
                  label="Cost/Hour ($)"
                  type="number"
                  step="0.01"
                  value={costA}
                  onChange={(e) => setCostA(e.target.value)}
                />
                <Input
                  label="Production Rate (IA/hr)"
                  type="number"
                  step="0.1"
                  value={rateA}
                  onChange={(e) => setRateA(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment B</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.fields}>
                <Input
                  label="Equipment Name"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                />
                <Input
                  label="Cost/Hour ($)"
                  type="number"
                  step="0.01"
                  value={costB}
                  onChange={(e) => setCostB(e.target.value)}
                />
                <Input
                  label="Production Rate (IA/hr)"
                  type="number"
                  step="0.1"
                  value={rateB}
                  onChange={(e) => setRateB(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={styles.results}>
          <Card>
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {projectSizes.map((projectIA) => {
                  const comparison = compareEquipment(projectIA);
                  return (
                    <div
                      key={projectIA}
                      style={{
                        padding: 'var(--space-4)',
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
                        {projectIA} Inch-Acres Project
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                        <div>
                          <div style={{ color: 'var(--text-secondary)' }}>{nameA}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>
                            ${comparison.priceA.toFixed(0)}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                            {comparison.hoursA.toFixed(1)} hrs
                          </div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-secondary)' }}>{nameB}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)', color: 'var(--brand-primary)' }}>
                            ${comparison.priceB.toFixed(0)}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                            {comparison.hoursB.toFixed(1)} hrs
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--divider)', fontSize: 'var(--text-sm)' }}>
                        <span style={{ color: 'var(--success)' }}>
                          {comparison.winner} saves ${comparison.savings.toFixed(0)} ({comparison.savingsPercent.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
