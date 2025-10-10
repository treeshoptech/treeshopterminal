'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { FolderOpen, Calendar, DollarSign, Clock, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ActionMenu } from '@/components/ui/ActionMenu';
import styles from './ProjectCard.module.css';

interface Project {
  _id: string;
  projectName: string;
  projectNumber: string;
  status?: string;
  totalPrice?: number;
  totalHours?: number;
  completionPercentage?: number;
  estimatedStartDate?: number;
}

export function ProjectCard({ project }: { project: Project }) {
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
      label: 'Create Work Order',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => console.log('Create WO'),
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
          <FolderOpen className={styles.icon} />
        </div>
        <ActionMenu actions={actions} />
      </div>

      <Link href={`/projects/${project._id}`} className={styles.name}>
        {project.projectName}
      </Link>

      <div className={styles.projectNumber}>{project.projectNumber}</div>

      <div className={styles.details}>
        {project.estimatedStartDate && (
          <div className={styles.detailItem}>
            <Calendar className={styles.detailIcon} />
            <span>{format(project.estimatedStartDate, 'MMM d, yyyy')}</span>
          </div>
        )}

        {project.totalHours && (
          <div className={styles.detailItem}>
            <Clock className={styles.detailIcon} />
            <span>{project.totalHours.toFixed(1)} hours</span>
          </div>
        )}

        {project.totalPrice && (
          <div className={styles.detailItem}>
            <DollarSign className={styles.detailIcon} />
            <span>${project.totalPrice.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {project.status && (
          <div className={styles.status} data-status={project.status}>
            {project.status.replace('_', ' ')}
          </div>
        )}

        {typeof project.completionPercentage === 'number' && (
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${project.completionPercentage}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {project.completionPercentage}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
