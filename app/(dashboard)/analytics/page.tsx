'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  DollarSign,
  Users,
  Truck,
  FileText,
  TrendingUp,
  TrendingDown,
  Package,
  Calendar,
  CheckCircle
} from 'lucide-react';
import styles from './page.module.css';

export default function AnalyticsPage() {
  const organizationId = 'org_mock123';

  const projects = useQuery(api.projects.list, { organizationId });
  const employees = useQuery(api.employees.list, { organizationId });
  const equipment = useQuery(api.equipment.list, { organizationId });
  const workOrders = useQuery(api.workOrders.list, { organizationId });
  const loadouts = useQuery(api.loadouts.list, { organizationId });

  const totalProjects = projects?.length || 0;
  const totalEmployees = employees?.filter(e => e.status === 'active').length || 0;
  const totalEquipment = equipment?.filter(e => e.status === 'active').length || 0;
  const totalWorkOrders = workOrders?.length || 0;
  const activeWorkOrders = workOrders?.filter(wo => wo.status === 'in-progress').length || 0;
  const completedWorkOrders = workOrders?.filter(wo => wo.status === 'completed').length || 0;

  const totalRevenue = projects?.reduce((sum, p) => sum + (p.totalPrice || 0), 0) || 0;
  const totalCost = projects?.reduce((sum, p) => sum + (p.totalCost || 0), 0) || 0;
  const totalProfit = totalRevenue - totalCost;

  const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12%',
      positive: true,
      icon: DollarSign,
      color: 'var(--success)',
    },
    {
      label: 'Active Projects',
      value: totalProjects.toString(),
      change: '+3 this month',
      positive: true,
      icon: FileText,
      color: 'var(--brand-primary)',
    },
    {
      label: 'Team Members',
      value: totalEmployees.toString(),
      change: `${employees?.filter(e => e.status === 'inactive').length || 0} inactive`,
      positive: true,
      icon: Users,
      color: 'var(--info)',
    },
    {
      label: 'Equipment Units',
      value: totalEquipment.toString(),
      change: `${loadouts?.length || 0} loadouts`,
      positive: true,
      icon: Truck,
      color: 'var(--warning)',
    },
  ];

  const recentActivity = [
    {
      title: 'New work order created',
      description: `WO-${workOrders?.[0]?.workOrderNumber || 'N/A'}`,
      time: '2 hours ago',
      icon: Calendar,
      color: 'var(--brand-primary)',
    },
    {
      title: 'Work order completed',
      description: `${completedWorkOrders} total completed`,
      time: '5 hours ago',
      icon: CheckCircle,
      color: 'var(--success)',
    },
    {
      title: 'New loadout created',
      description: `${loadouts?.[0]?.loadoutName || 'Latest loadout'}`,
      time: '1 day ago',
      icon: Package,
      color: 'var(--warning)',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics Dashboard</h1>
        <p className={styles.subtitle}>
          Overview of your business performance
        </p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon} style={{ color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{stat.label}</p>
                <h2 className={styles.statValue}>{stat.value}</h2>
              </div>
            </div>
            <div className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
              {stat.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Revenue Overview</h3>
            <p className={styles.chartSubtitle}>Monthly revenue and profit trends</p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <DollarSign size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p>Chart visualization coming soon</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Total Profit: ${totalProfit.toLocaleString()} ({averageMargin.toFixed(1)}% margin)
              </p>
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Work Order Status</h3>
            <p className={styles.chartSubtitle}>Distribution of work order statuses</p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: 'var(--info-bg)',
              borderRadius: 'var(--radius-md)',
            }}>
              <span>Scheduled</span>
              <strong>{workOrders?.filter(wo => wo.status === 'scheduled').length || 0}</strong>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: 'var(--warning-bg)',
              borderRadius: 'var(--radius-md)',
            }}>
              <span>In Progress</span>
              <strong>{activeWorkOrders}</strong>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: 'var(--success-bg)',
              borderRadius: 'var(--radius-md)',
            }}>
              <span>Completed</span>
              <strong>{completedWorkOrders}</strong>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
            }}>
              <span>Cancelled</span>
              <strong>{workOrders?.filter(wo => wo.status === 'cancelled').length || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Recent Activity</h3>
          <p className={styles.chartSubtitle}>Latest updates from your operations</p>
        </div>
        <div className={styles.activityList}>
          {recentActivity.map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityIcon} style={{ color: activity.color }}>
                <activity.icon size={20} />
              </div>
              <div className={styles.activityContent}>
                <h4 className={styles.activityTitle}>{activity.title}</h4>
                <p className={styles.activityDescription}>{activity.description}</p>
              </div>
              <span className={styles.activityTime}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
