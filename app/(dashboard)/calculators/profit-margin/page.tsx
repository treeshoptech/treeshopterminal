'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { calculateBillingRate } from '@/lib/formulas/pricing';
import styles from '../equipment-cost/page.module.css';

export default function ProfitMarginConverterPage() {
  const [cost, setCost] = useState('246.43');
  const [customMargin, setCustomMargin] = useState('');

  const costAmount = parseFloat(cost) || 0;
  const margins = [30, 40, 50, 60, 70];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profit Margin Converter</h1>
        <p className={styles.subtitle}>Convert costs to selling prices at target margins</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <Card>
            <CardHeader>
              <CardTitle>Your Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                label="Cost Amount ($)"
                type="number"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                helpText="Equipment + labor + overhead"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formula</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.breakdown}>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
                    Price = Cost ÷ (1 - Margin%)
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                    Ensures profit is a percentage of selling price
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                label="Custom Margin (%)"
                type="number"
                step="1"
                min="0"
                max="99"
                value={customMargin}
                onChange={(e) => setCustomMargin(e.target.value)}
              />
              {customMargin && parseFloat(customMargin) > 0 && parseFloat(customMargin) < 100 && costAmount > 0 && (
                <div className={styles.resultTotal} style={{ marginTop: 'var(--space-4)' }}>
                  <div className={styles.resultLabel}>{customMargin}% Margin Price</div>
                  <div className={styles.resultValueLarge}>
                    ${(costAmount / (1 - parseFloat(customMargin) / 100)).toFixed(2)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className={styles.results}>
          <Card>
            <CardHeader>
              <CardTitle>Selling Prices</CardTitle>
            </CardHeader>
            <CardContent>
              {costAmount > 0 ? (
                <div className={styles.breakdown}>
                  {margins.map((margin) => {
                    const result = calculateBillingRate(costAmount, margin / 100);
                    return (
                      <div key={margin} className={styles.breakdownItem}>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                            {margin}% Margin
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                            {margin === 50 && 'TreeShop Standard'}
                            {margin === 40 && 'Balanced'}
                            {margin === 30 && 'Conservative'}
                            {margin === 60 && 'Premium'}
                            {margin === 70 && 'High-End'}
                          </div>
                        </div>
                        <span style={{ fontSize: 'var(--text-xl)', color: margin === 50 ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                          ${result.billingRatePerHour.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-tertiary)' }}>
                  Enter cost to calculate
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.breakdown}>
                <div className={styles.breakdownItem}>
                  <span>30% margin</span>
                  <span>÷ 0.70</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span>40% margin</span>
                  <span>÷ 0.60</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span>50% margin</span>
                  <span>÷ 0.50</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span>60% margin</span>
                  <span>÷ 0.40</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span>70% margin</span>
                  <span>÷ 0.30</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
