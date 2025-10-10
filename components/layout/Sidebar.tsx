'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  MapPin,
  Clock,
  FileText,
  Settings,
  Calculator,
  BarChart3,
  Truck,
  Wrench,
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Map', href: '/map', icon: MapPin },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Work Orders', href: '/work-orders', icon: FileText },
  { name: 'Time Tracking', href: '/time', icon: Clock },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Equipment', href: '/equipment', icon: Truck },
  { name: 'Loadouts', href: '/loadouts', icon: Wrench },
  { name: 'Calculators', href: '/calculators', icon: Calculator },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.logo}>TreeShop</h1>
        <span className={styles.logoSub}>Terminal</span>
      </div>

      <nav className={styles.nav}>
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                styles.navItem,
                isActive && styles.active
              )}
            >
              <Icon className={styles.navIcon} />
              <span className={styles.navLabel}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
