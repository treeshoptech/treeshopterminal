import { Truck, Users, Zap, Edit, Trash2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import styles from './LoadoutCard.module.css';

interface Loadout {
  _id: string;
  loadoutName: string;
  serviceType?: string;
  crewSize?: number;
  totalEquipmentCostPerHour: number;
  totalLaborCostPerHour: number;
  totalLoadoutCostPerHour: number;
  productionRate?: number;
  productionUnit?: string;
  isActive?: boolean;
  isDefault?: boolean;
  equipmentIds: any[];
}

interface LoadoutCardProps {
  loadout: Loadout;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function LoadoutCard({ loadout, onEdit, onDelete }: LoadoutCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(loadout._id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${loadout.loadoutName}?`)) {
      onDelete(loadout._id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.name}>
            {loadout.isDefault && <Star size={16} fill="currentColor" style={{ display: 'inline', marginRight: '8px', color: 'var(--warning)' }} />}
            {loadout.loadoutName}
          </h3>
          <p className={styles.serviceType}>{loadout.serviceType || 'General Service'}</p>
        </div>
        <Badge variant={loadout.isActive ? 'success' : 'default'}>
          {loadout.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Equipment</div>
          <div className={styles.statValue}>${loadout.totalEquipmentCostPerHour.toFixed(2)}/hr</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Labor</div>
          <div className={styles.statValue}>${loadout.totalLaborCostPerHour.toFixed(2)}/hr</div>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <Truck size={16} />
          <span>{loadout.equipmentIds.length} pieces of equipment</span>
        </div>

        <div className={styles.infoRow}>
          <Users size={16} />
          <span>{loadout.crewSize || 0} crew members</span>
        </div>

        {loadout.productionRate && (
          <div className={styles.infoRow}>
            <Zap size={16} />
            <span>{loadout.productionRate} {loadout.productionUnit || 'units'}/hr</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.totalCost}>
          <span className={styles.totalCostLabel}>Total Cost</span>
          <span className={styles.totalCostValue}>
            ${loadout.totalLoadoutCostPerHour.toFixed(2)}/hr
          </span>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleEdit}>
            <Edit size={16} />
          </button>
          <button className={styles.actionButton} onClick={handleDelete}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
