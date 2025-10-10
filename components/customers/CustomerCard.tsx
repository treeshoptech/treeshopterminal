'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ActionMenu } from '@/components/ui/ActionMenu';
import styles from './CustomerCard.module.css';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  totalProjects: number;
  totalRevenue: number;
}

export function CustomerCard({ customer }: { customer: Customer }) {
  const handleEdit = () => {
    // Navigate to edit
  };

  const handleDelete = () => {
    // Delete customer
  };

  const handleCreateProject = () => {
    // Create project for customer
  };

  const actions = [
    {
      label: 'View Details',
      icon: <Eye className="w-4 h-4" />,
      onClick: () => console.log('View'),
    },
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: handleEdit,
    },
    {
      label: 'Create Project',
      icon: <FileText className="w-4 h-4" />,
      onClick: handleCreateProject,
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      destructive: true,
    },
  ];

  return (
    <Card className={styles.card} hover>
      <div className={styles.header}>
        <Link href={`/customers/${customer._id}`} className={styles.name}>
          {customer.name}
        </Link>

        <ActionMenu actions={actions} />
      </div>

      <div className={styles.content}>
        <div className={styles.contactItem}>
          <Mail className={styles.icon} />
          <span className={styles.contactText}>{customer.email}</span>
        </div>

        <div className={styles.contactItem}>
          <Phone className={styles.icon} />
          <span className={styles.contactText}>{customer.phone}</span>
        </div>

        <div className={styles.contactItem}>
          <MapPin className={styles.icon} />
          <span className={styles.contactText}>{customer.address}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{customer.totalProjects}</div>
          <div className={styles.statLabel}>Projects</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statValue}>
            ${customer.totalRevenue.toLocaleString()}
          </div>
          <div className={styles.statLabel}>Revenue</div>
        </div>

        <div className={styles.status} data-status={customer.status}>
          {customer.status}
        </div>
      </div>
    </Card>
  );
}
