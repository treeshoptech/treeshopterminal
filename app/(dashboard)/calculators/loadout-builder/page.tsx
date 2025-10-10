'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateLoadoutCost } from '@/lib/formulas/pricing';
import styles from '../equipment-cost/page.module.css';

interface Employee {
  id: number;
  wage: string;
  position: string;
  multiplier: number;
}

export default function LoadoutBuilderPage() {
  const [primaryEquipment, setPrimaryEquipment] = useState('75.00');
  const [truck, setTruck] = useState('38.43');
  const [support, setSupport] = useState('14.00');

  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, wage: '35.00', position: 'Operator', multiplier: 1.7 },
    { id: 2, wage: '35.00', position: 'Ground Crew', multiplier: 1.7 },
  ]);

  const addEmployee = () => {
    setEmployees([...employees, {
      id: Date.now(),
      wage: '',
      position: 'Crew Member',
      multiplier: 1.7
    }]);
  };

  const removeEmployee = (id: number) => {
    if (employees.length > 1) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const updateEmployee = (id: number, field: string, value: string | number) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const equipmentCost = (parseFloat(primaryEquipment) || 0) +
                        (parseFloat(truck) || 0) +
                        (parseFloat(support) || 0);

  const laborCost = employees.reduce((sum, emp) => {
    const wage = parseFloat(emp.wage) || 0;
    return sum + (wage * emp.multiplier);
  }, 0);

  const totalLoadoutCost = equipmentCost + laborCost;

  const margins = [
    { percent: 30, label: 'Conservative', divisor: 0.70 },
    { percent: 40, label: 'Balanced', divisor: 0.60 },
    { percent: 50, label: 'Recommended', divisor: 0.50 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Loadout Builder</h1>
        <p className={styles.subtitle}>Configure crew with equipment and labor</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.fields}>
                <Input
                  label="Primary Equipment ($/hr)"
                  type="number"
                  step="0.01"
                  value={primaryEquipment}
                  onChange={(e) => setPrimaryEquipment(e.target.value)}
                  helpText="Cat 265, SK200TR, etc."
                />
                <Input
                  label="Truck ($/hr)"
                  type="number"
                  step="0.01"
                  value={truck}
                  onChange={(e) => setTruck(e.target.value)}
                  helpText="Ford F450, etc."
                />
                <Input
                  label="Support Equipment ($/hr)"
                  type="number"
                  step="0.01"
                  value={support}
                  onChange={(e) => setSupport(e.target.value)}
                  helpText="Trailers, tools"
                />
              </div>
              <div className={styles.resultItem} style={{ marginTop: 'var(--space-4)' }}>
                <span>Equipment Total</span>
                <span>${equipmentCost.toFixed(2)}/hr</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardTitle>Labor</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={addEmployee}
                >
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {employees.map((emp, index) => (
                  <div key={emp.id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
                    <Input
                      label={`Employee ${index + 1} Wage ($/hr)`}
                      type="number"
                      step="0.50"
                      value={emp.wage}
                      onChange={(e) => updateEmployee(emp.id, 'wage', e.target.value)}
                      helpText={emp.wage ? `True cost: $${(parseFloat(emp.wage) * emp.multiplier).toFixed(2)}/hr` : ''}
                    />
                    {employees.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmployee(emp.id)}
                        icon={<Trash2 className="w-4 h-4" />}
                      />
                    )}
                  </div>
                ))}
                <div className={styles.resultItem}>
                  <span>Labor Total</span>
                  <span>${laborCost.toFixed(2)}/hr</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={styles.results}>
          <Card>
            <CardHeader>
              <CardTitle>Loadout Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.resultTotal}>
                <div className={styles.resultLabel}>Total Cost/Hour</div>
                <div className={styles.resultValueLarge}>${totalLoadoutCost.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.breakdown}>
                {margins.map(({ percent, label, divisor }) => {
                  const rate = totalLoadoutCost / divisor;
                  return (
                    <div key={percent} className={styles.breakdownItem}>
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                          {percent}% Margin
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                          {label}
                        </div>
                      </div>
                      <span style={{ fontSize: 'var(--text-xl)', color: 'var(--brand-primary)' }}>
                        ${rate.toFixed(2)}/hr
                      </span>
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
