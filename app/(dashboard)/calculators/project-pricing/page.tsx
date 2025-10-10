'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateInchAcres, calculateStumpScore } from '@/lib/formulas/pricing';
import styles from '../equipment-cost/page.module.css';

type ServiceType = 'mulching' | 'stumps' | 'clearing';

export default function ProjectPricingPage() {
  const [serviceType, setServiceType] = useState<ServiceType>('mulching');
  const [loadoutCost, setLoadoutCost] = useState('246.43');
  const [profitMargin, setProfitMargin] = useState('50');
  const [driveTime, setDriveTime] = useState('30');

  // Mulching
  const [acres, setAcres] = useState('8');
  const [dbh, setDbh] = useState('6');
  const [productionRate, setProductionRate] = useState('1.3');

  // Stumps
  const [diameter, setDiameter] = useState('15');
  const [heightAbove, setHeightAbove] = useState('1');
  const [depthBelow, setDepthBelow] = useState('1');

  // Clearing
  const [days, setDays] = useState('2');

  const calculateProject = () => {
    const loadout = parseFloat(loadoutCost) || 0;
    const margin = parseFloat(profitMargin) || 50;
    const drive = parseFloat(driveTime) || 0;

    let workHours = 0;

    if (serviceType === 'mulching') {
      const inchAcres = calculateInchAcres(parseFloat(acres) || 0, parseFloat(dbh) || 0);
      workHours = inchAcres / (parseFloat(productionRate) || 1);
    } else if (serviceType === 'stumps') {
      const stumpScore = calculateStumpScore({
        diameter: parseFloat(diameter) || 0,
        heightAbove: parseFloat(heightAbove) || 1,
        depthBelow: parseFloat(depthBelow) || 1,
      });
      workHours = Math.max(stumpScore / 400, 0.5);
    } else {
      workHours = (parseFloat(days) || 0) * 8;
    }

    const transportRate = serviceType === 'stumps' ? 0.3 : 0.5;
    const transportHours = (drive / 60 * 2) * transportRate;
    const bufferHours = (workHours + transportHours) * 0.1;
    const totalHours = workHours + transportHours + bufferHours;

    const billingRate = loadout / (1 - margin / 100);
    const totalCost = totalHours * loadout;
    const totalPrice = totalHours * billingRate;
    const totalProfit = totalPrice - totalCost;

    return {
      workHours,
      transportHours,
      bufferHours,
      totalHours,
      billingRate,
      totalCost,
      totalPrice,
      totalProfit,
      profitMargin: (totalProfit / totalPrice) * 100
    };
  };

  const results = calculateProject();
  const hasInputs = parseFloat(loadoutCost) > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Project Pricing Calculator</h1>
        <p className={styles.subtitle}>Complete project pricing with all formulas</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <Card>
            <CardHeader>
              <CardTitle>Service Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.quickSelect}>
                {(['mulching', 'stumps', 'clearing'] as ServiceType[]).map((type) => (
                  <button
                    key={type}
                    className={serviceType === type ? styles.quickButton + ' active' : styles.quickButton}
                    onClick={() => setServiceType(type)}
                    style={serviceType === type ? { borderColor: 'var(--brand-primary)' } : {}}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.fields}>
                <Input
                  label="Loadout Cost ($/hr)"
                  type="number"
                  step="0.01"
                  value={loadoutCost}
                  onChange={(e) => setLoadoutCost(e.target.value)}
                />
                <Input
                  label="Profit Margin (%)"
                  type="number"
                  step="5"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                />
                <Input
                  label="Drive Time (min)"
                  type="number"
                  value={driveTime}
                  onChange={(e) => setDriveTime(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {serviceType === 'mulching' && 'Mulching Details'}
                {serviceType === 'stumps' && 'Stump Details'}
                {serviceType === 'clearing' && 'Clearing Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {serviceType === 'mulching' && (
                <div className={styles.fields}>
                  <Input
                    label="Acres"
                    type="number"
                    step="0.1"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                  />
                  <Input
                    label="DBH (inches)"
                    type="number"
                    value={dbh}
                    onChange={(e) => setDbh(e.target.value)}
                  />
                  <Input
                    label="Production Rate (IA/hr)"
                    type="number"
                    step="0.1"
                    value={productionRate}
                    onChange={(e) => setProductionRate(e.target.value)}
                    helpText="Cat 265: 1.3, SK200TR: 5.0"
                  />
                </div>
              )}

              {serviceType === 'stumps' && (
                <div className={styles.fields}>
                  <Input
                    label="Diameter (inches)"
                    type="number"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                  />
                  <Input
                    label="Height Above (ft)"
                    type="number"
                    step="0.5"
                    value={heightAbove}
                    onChange={(e) => setHeightAbove(e.target.value)}
                  />
                  <Input
                    label="Depth Below (ft)"
                    type="number"
                    step="0.5"
                    value={depthBelow}
                    onChange={(e) => setDepthBelow(e.target.value)}
                  />
                </div>
              )}

              {serviceType === 'clearing' && (
                <Input
                  label="Estimated Days"
                  type="number"
                  step="0.5"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  helpText="8 hours per day"
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className={styles.results}>
          <Card>
            <CardHeader>
              <CardTitle>Time Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.breakdown}>
                <div className={styles.breakdownItem}>
                  <span>Work Hours</span>
                  <span>{results.workHours.toFixed(2)} hrs</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span>Transport</span>
                  <span>{results.transportHours.toFixed(2)} hrs</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span>Buffer (10%)</span>
                  <span>{results.bufferHours.toFixed(2)} hrs</span>
                </div>
                <div className={styles.breakdownItem} style={{ borderTop: '1px solid var(--divider)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  <span style={{ fontWeight: 'var(--font-semibold)' }}>Total</span>
                  <span style={{ color: 'var(--brand-primary)', fontWeight: 'var(--font-bold)' }}>
                    {results.totalHours.toFixed(2)} hrs
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.resultTotal}>
                <div className={styles.resultLabel}>Quote to Customer</div>
                <div className={styles.resultValueLarge}>${results.totalPrice.toFixed(0)}</div>
              </div>
              <div className={styles.breakdown} style={{ marginTop: 'var(--space-4)' }}>
                <div className={styles.breakdownItem}>
                  <span>Your Cost</span>
                  <span>${results.totalCost.toFixed(0)}</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span>Your Profit</span>
                  <span style={{ color: 'var(--success)' }}>${results.totalProfit.toFixed(0)}</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span>Margin</span>
                  <span style={{ color: 'var(--brand-primary)' }}>{results.profitMargin.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
