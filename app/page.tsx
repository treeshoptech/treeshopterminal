import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>TreeShopTerminal</h1>
        <p className={styles.subtitle}>
          Production-grade tree service operations platform
        </p>

        <div className={styles.actions}>
          <Link href="/sign-in" className={styles.buttonPrimary}>
            Sign In
          </Link>
          <Link href="/sign-up" className={styles.buttonSecondary}>
            Get Started
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📊</div>
          <h3>Scientific Pricing</h3>
          <p>Your legendary formulas, automated</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🗺️</div>
          <h3>Map-First Interface</h3>
          <p>Every job, every crew, on Google Maps</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>⏱️</div>
          <h3>Automated Time Tracking</h3>
          <p>Geofence-based clock in/out</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>👥</div>
          <h3>Multi-Tenant</h3>
          <p>Companies manage teams seamlessly</p>
        </div>
      </div>
    </main>
  );
}
