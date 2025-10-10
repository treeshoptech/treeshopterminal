'use client';

import { useAuth } from '@/lib/auth';
import { Bell, User } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  const auth = useAuth();
  const user = auth?.user;
  const organization = auth?.organization;

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.orgInfo}>
            <div className={styles.orgName}>{organization?.name || 'Demo Tree Service'}</div>
            <div className={styles.orgRole}>{organization?.role || 'owner'}</div>
          </div>
        </div>

        <div className={styles.right}>
          <button className={styles.iconButton} aria-label="Notifications">
            <Bell className={styles.icon} />
            <span className={styles.badge}>3</span>
          </button>

          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.fullName || 'Demo User'}</div>
            <User className={styles.userIcon} />
          </div>
        </div>
      </div>
    </header>
  );
}
