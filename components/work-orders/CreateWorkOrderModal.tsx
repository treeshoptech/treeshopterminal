'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import styles from './CreateWorkOrderModal.module.css';

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export function CreateWorkOrderModal({
  isOpen,
  onClose,
  organizationId,
}: CreateWorkOrderModalProps) {
  const [formData, setFormData] = useState({
    workOrderNumber: `WO-${Date.now().toString().slice(-6)}`,
    projectId: '',
    customerId: '',
    scheduledDate: '',
    scheduledStartTime: '',
    estimatedDuration: '',
    status: 'scheduled',
  });

  const createWorkOrder = useMutation(api.workOrders.create);
  const projects = useQuery(api.projects.list, { organizationId });
  const customers = useQuery(api.customers.list, { organizationId });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createWorkOrder({
        organizationId,
        workOrderNumber: formData.workOrderNumber,
        projectId: formData.projectId as any,
        customerId: formData.customerId as any,
        scheduledDate: formData.scheduledDate
          ? new Date(formData.scheduledDate).getTime()
          : undefined,
        status: formData.status,
      });

      onClose();
      setFormData({
        workOrderNumber: `WO-${Date.now().toString().slice(-6)}`,
        projectId: '',
        customerId: '',
        scheduledDate: '',
        scheduledStartTime: '',
        estimatedDuration: '',
        status: 'scheduled',
      });
    } catch (error) {
      console.error('Failed to create work order:', error);
      alert('Failed to create work order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Work Order"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Work Order'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Work Order Number"
          name="workOrderNumber"
          value={formData.workOrderNumber}
          onChange={handleChange}
          required
        />

        <Select
          label="Project"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          required
          options={
            projects?.map((p) => ({
              value: p._id,
              label: p.projectName,
            })) || []
          }
        />

        <Select
          label="Customer"
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          required
          options={
            customers?.map((c) => ({
              value: c._id,
              label: c.name,
            })) || []
          }
        />

        <Input
          label="Scheduled Date"
          name="scheduledDate"
          type="date"
          value={formData.scheduledDate}
          onChange={handleChange}
        />

        <Input
          label="Start Time"
          name="scheduledStartTime"
          type="time"
          value={formData.scheduledStartTime}
          onChange={handleChange}
        />

        <Input
          label="Estimated Duration (hours)"
          name="estimatedDuration"
          type="number"
          step="0.5"
          value={formData.estimatedDuration}
          onChange={handleChange}
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          options={[
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </form>
    </Modal>
  );
}
