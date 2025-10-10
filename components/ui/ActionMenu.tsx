'use client';

import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { MoreVertical } from 'lucide-react';
import styles from './ActionMenu.module.css';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void | Promise<void>;
  destructive?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

export interface ActionMenuProps {
  actions: ActionMenuItem[];
  align?: 'left' | 'right';
}

export function ActionMenu({ actions, align = 'right' }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleActionClick = async (action: ActionMenuItem) => {
    if (action.disabled) return;

    await action.onClick();
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <MoreVertical className={styles.triggerIcon} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />

          {/* Menu */}
          <div
            className={clsx(
              styles.menu,
              align === 'left' ? styles.alignLeft : styles.alignRight
            )}
          >
            {actions.map((action, index) => (
              <button
                key={index}
                className={clsx(
                  styles.menuItem,
                  action.destructive && styles.destructive,
                  action.disabled && styles.disabled
                )}
                onClick={() => handleActionClick(action)}
                disabled={action.disabled}
              >
                {action.icon && <span className={styles.menuIcon}>{action.icon}</span>}
                <span className={styles.menuLabel}>{action.label}</span>
                {action.shortcut && (
                  <kbd className={styles.shortcut}>{action.shortcut}</kbd>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
