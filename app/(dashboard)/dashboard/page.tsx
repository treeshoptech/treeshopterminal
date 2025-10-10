import { getAuth } from '@/lib/auth/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import styles from './page.module.css';

export default async function DashboardPage() {
  const { orgId } = await getAuth();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome to TreeShopTerminal</p>
      </div>

      <div className={styles.grid}>
        <Card hover>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.stat}>
              <div className={styles.statValue}>12</div>
              <div className={styles.statLabel}>In Progress</div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Revenue This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.stat}>
              <div className={styles.statValue}>$45,230</div>
              <div className={styles.statLabel}>+18% from last month</div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.stat}>
              <div className={styles.statValue}>8</div>
              <div className={styles.statLabel}>4 clocked in</div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Avg Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.stat}>
              <div className={styles.statValue}>52%</div>
              <div className={styles.statLabel}>Above 50% target</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <Card>
          <CardContent>
            <p className={styles.placeholder}>
              Recent activity will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
