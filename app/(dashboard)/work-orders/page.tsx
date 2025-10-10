'use client';

import { useState } from 'react';
import { Plus, FileText, Search } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WorkOrderCard } from '@/components/work-orders/WorkOrderCard';
import { WorkOrderWizard } from '@/components/work-orders/WorkOrderWizard';
import styles from './page.module.css';

export default function WorkOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const organizationId = 'org_mock123';
  const workOrders = useQuery(api.workOrders.list, {
    organizationId,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const deleteWorkOrder = useMutation(api.workOrders.remove);

  const handleEdit = (id: string) => {
    console.log('Edit work order:', id);
    // TODO: Implement edit modal
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWorkOrder({ id: id as any });
    } catch (error) {
      console.error('Failed to delete work order:', error);
    }
  };

  const handleClick = (id: string) => {
    console.log('View work order:', id);
    // TODO: Navigate to work order detail page
  };

  const filteredWorkOrders = workOrders?.filter((wo) =>
    wo.workOrderNumber.toLowerCase().includes(search.toLowerCase())
  );

  const statusCounts = {
    all: workOrders?.length || 0,
    scheduled: workOrders?.filter((wo) => wo.status === 'scheduled').length || 0,
    'in-progress': workOrders?.filter((wo) => wo.status === 'in-progress').length || 0,
    completed: workOrders?.filter((wo) => wo.status === 'completed').length || 0,
    cancelled: workOrders?.filter((wo) => wo.status === 'cancelled').length || 0,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Work Orders</h1>
          <p className={styles.subtitle}>
            {workOrders?.length || 0} total work orders
          </p>
        </div>

        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>
          Create Work Order
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="Search work orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className={styles.statusTabs}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            className={`${styles.statusTab} ${statusFilter === status ? styles.active : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} ({count})
          </button>
        ))}
      </div>

      {!filteredWorkOrders || filteredWorkOrders.length === 0 ? (
        <div className={styles.empty}>
          <FileText className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No work orders yet</h3>
          <p className={styles.emptyText}>
            Create your first work order to start tracking jobs
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Work Order</Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredWorkOrders.map((workOrder) => (
            <WorkOrderCard
              key={workOrder._id}
              workOrder={workOrder}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={handleClick}
            />
          ))}
        </div>
      )}

      <WorkOrderWizard
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        organizationId={organizationId}
      />
    </div>
  );
}
