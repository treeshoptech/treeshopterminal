import { Mail, Phone, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import styles from './EmployeeCard.module.css';

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  baseHourlyRate?: number;
  trueCostPerHour?: number;
  status?: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusVariants: Record<string, 'success' | 'default' | 'error'> = {
  active: 'success',
  inactive: 'default',
  terminated: 'error',
};

export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(employee._id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      onDelete(employee._id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.name}>
            {employee.firstName} {employee.lastName}
          </h3>
          <p className={styles.position}>{employee.position || 'No position assigned'}</p>
        </div>
        <Badge variant={statusVariants[employee.status || 'active']}>
          {employee.status || 'Active'}
        </Badge>
      </div>

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <Mail size={16} />
          <span>{employee.email}</span>
        </div>

        {employee.phone && (
          <div className={styles.infoRow}>
            <Phone size={16} />
            <span>{employee.phone}</span>
          </div>
        )}

        {employee.baseHourlyRate && (
          <div className={styles.infoRow}>
            <DollarSign size={16} />
            <span>${employee.baseHourlyRate.toFixed(2)}/hr base rate</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.cost}>
          <span className={styles.costLabel}>True Cost</span>
          <span className={styles.costValue}>
            ${employee.trueCostPerHour?.toFixed(2) || '0.00'}/hr
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
