import Link from 'next/link';
import { BarChart3, Map, Clock, Building2 } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.badge}>PRODUCTION READY</div>
        <h1 className={styles.title}>TreeShopTerminal</h1>
        <p className={styles.subtitle}>
          Enterprise tree service operations platform
        </p>

        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.buttonPrimary}>
            Launch Terminal
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <BarChart3 className={styles.icon} />
          </div>
          <h3 className={styles.featureTitle}>Scientific Pricing</h3>
          <p className={styles.featureDescription}>
            Formula-driven cost calculations with transparent breakdowns
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Map className={styles.icon} />
          </div>
          <h3 className={styles.featureTitle}>Map-First Interface</h3>
          <p className={styles.featureDescription}>
            Real-time job site management with polygon geofencing
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Clock className={styles.icon} />
          </div>
          <h3 className={styles.featureTitle}>Time Tracking</h3>
          <p className={styles.featureDescription}>
            Validated time entries with automated timesheet generation
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Building2 className={styles.icon} />
          </div>
          <h3 className={styles.featureTitle}>Multi-Tenant</h3>
          <p className={styles.featureDescription}>
            Organization-level isolation with role-based access control
          </p>
        </div>
      </div>
    </main>
  );
}
