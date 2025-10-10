import Link from 'next/link';
import { Calculator, Truck, Users, Wrench, DollarSign, FolderOpen, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import styles from './page.module.css';

const calculators = [
  {
    name: 'Equipment Cost',
    href: '/calculators/equipment-cost',
    icon: Truck,
    description: 'Calculate true hourly equipment costs with ownership and operating expenses',
  },
  {
    name: 'Employee Cost',
    href: '/calculators/employee-cost',
    icon: Users,
    description: 'Determine actual labor costs with burden multipliers and benefits',
  },
  {
    name: 'Loadout Builder',
    href: '/calculators/loadout-builder',
    icon: Wrench,
    description: 'Configure crew loadouts with equipment and labor cost breakdowns',
  },
  {
    name: 'Profit Margin',
    href: '/calculators/profit-margin',
    icon: DollarSign,
    description: 'Convert target profit margins to billing rates',
  },
  {
    name: 'Project Pricing',
    href: '/calculators/project-pricing',
    icon: FolderOpen,
    description: 'Calculate complete project pricing with all formulas integrated',
  },
  {
    name: 'ROI Comparison',
    href: '/calculators/roi-comparison',
    icon: TrendingUp,
    description: 'Compare equipment return on investment and efficiency',
  },
];

export default function CalculatorsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Professional Toolkit</h1>
          <p className={styles.subtitle}>
            Scientific calculators based on your pricing formulas
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {calculators.map((calc) => {
          const Icon = calc.icon;
          return (
            <Link key={calc.href} href={calc.href} className={styles.cardLink}>
              <Card hover className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon className={styles.icon} />
                </div>
                <CardHeader>
                  <CardTitle>{calc.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={styles.description}>{calc.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
