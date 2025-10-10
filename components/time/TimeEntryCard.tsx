'use client';

import { format } from 'date-fns';
import { Clock, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ActionMenu } from '@/components/ui/ActionMenu';
import styles from './TimeEntryCard.module.css';

interface TimeEntry {
  _id: string;
  date: number;
  clockIn: number;
  clockOut: number;
  totalHours: number;
  projectName?: string;
  approved: boolean;
}

export function TimeEntryCard({ entry }: { entry: TimeEntry }) {
  const actions = [
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: () => console.log('Edit'),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => console.log('Delete'),
      destructive: true,
    },
  ];

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.info}>
          <div className={styles.date}>
            {format(entry.date, 'MMM d, yyyy')}
          </div>
          {entry.projectName && (
            <div className={styles.project}>{entry.projectName}</div>
          )}
        </div>

        <ActionMenu actions={actions} />
      </div>

      <div className={styles.times}>
        <div className={styles.timeItem}>
          <Clock className={styles.icon} />
          <div className={styles.timeLabel}>In</div>
          <div className={styles.timeValue}>
            {format(entry.clockIn, 'h:mm a')}
          </div>
        </div>

        <div className={styles.separator}>→</div>

        <div className={styles.timeItem}>
          <Clock className={styles.icon} />
          <div className={styles.timeLabel}>Out</div>
          <div className={styles.timeValue}>
            {format(entry.clockOut, 'h:mm a')}
          </div>
        </div>

        <div className={styles.total}>
          <div className={styles.totalLabel}>Total</div>
          <div className={styles.totalValue}>{entry.totalHours.toFixed(2)} hrs</div>
        </div>
      </div>

      <div className={styles.footer}>
        {entry.approved ? (
          <div className={styles.approved}>
            <CheckCircle className={styles.approvedIcon} />
            Approved
          </div>
        ) : (
          <div className={styles.pending}>Pending Approval</div>
        )}
      </div>
    </Card>
  );
}
