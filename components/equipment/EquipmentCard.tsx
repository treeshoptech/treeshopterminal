'use client';

import Link from 'next/link';
import { Truck, Edit, Trash2, Eye, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ActionMenu } from '@/components/ui/ActionMenu';
import styles from './EquipmentCard.module.css';

interface Equipment {
  _id: string;
  equipmentName: string;
  category?: string;
  make?: string;
  model?: string;
  totalCostPerHour: number;
  status?: string;
}

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const actions = [
    {
      label: 'View Details',
      icon: <Eye className="w-4 h-4" />,
      onClick: () => console.log('View'),
    },
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
    <Card className={styles.card} hover>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Truck className={styles.icon} />
        </div>
        <ActionMenu actions={actions} />
      </div>

      <Link href={`/equipment/${equipment._id}`} className={styles.name}>
        {equipment.equipmentName}
      </Link>

      {(equipment.make || equipment.model) && (
        <div className={styles.details}>
          {equipment.make} {equipment.model}
        </div>
      )}

      <div className={styles.cost}>
        <DollarSign className={styles.costIcon} />
        <span className={styles.costValue}>
          ${equipment.totalCostPerHour.toFixed(2)}
        </span>
        <span className={styles.costLabel}>/hour</span>
      </div>

      <div className={styles.footer}>
        {equipment.category && (
          <div className={styles.category}>{equipment.category}</div>
        )}
        {equipment.status && (
          <div className={styles.status} data-status={equipment.status}>
            {equipment.status}
          </div>
        )}
      </div>
    </Card>
  );
}
