'use client';

import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';
import { Bell } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox: {
                  padding: '8px 12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                },
              },
            }}
          />
        </div>

        <div className={styles.right}>
          <button className={styles.iconButton} aria-label="Notifications">
            <Bell className={styles.icon} />
            <span className={styles.badge}>3</span>
          </button>

          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: '40px',
                  height: '40px',
                },
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
