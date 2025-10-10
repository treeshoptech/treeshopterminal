import { Calendar, MapPin, Users, Clock, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import styles from './WorkOrderCard.module.css';

interface WorkOrder {
  _id: string;
  workOrderNumber: string;
  scheduledDate?: number;
  scheduledStartTime?: string;
  estimatedDuration?: number;
  status?: string;
  assignedCrew?: any[];
}

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

const statusVariants: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
  scheduled: 'info',
  'in-progress': 'warning',
  completed: 'success',
  cancelled: 'default',
};

export function WorkOrderCard({ workOrder, onEdit, onDelete, onClick }: WorkOrderCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(workOrder._id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this work order?')) {
      onDelete(workOrder._id);
    }
  };

  return (
    <div className={styles.card} onClick={() => onClick(workOrder._id)}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.workOrderNumber}>{workOrder.workOrderNumber}</h3>
          <p className={styles.projectName}>Project Name</p>
        </div>
        <Badge variant={statusVariants[workOrder.status || 'scheduled']}>
          {workOrder.status || 'Scheduled'}
        </Badge>
      </div>

      <div className={styles.info}>
        {workOrder.scheduledDate && (
          <div className={styles.infoRow}>
            <Calendar size={16} />
            <span>{format(new Date(workOrder.scheduledDate), 'MMM d, yyyy')}</span>
            {workOrder.scheduledStartTime && (
              <span> at {workOrder.scheduledStartTime}</span>
            )}
          </div>
        )}

        <div className={styles.infoRow}>
          <MapPin size={16} />
          <span>Job Site Address</span>
        </div>

        {workOrder.estimatedDuration && (
          <div className={styles.infoRow}>
            <Clock size={16} />
            <span>{workOrder.estimatedDuration} hours estimated</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.crew}>
          <Users size={16} />
          <span>{workOrder.assignedCrew?.length || 0} crew members</span>
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
