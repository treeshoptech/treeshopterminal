'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import styles from './CreateEmployeeModal.module.css';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export function CreateEmployeeModal({
  isOpen,
  onClose,
  organizationId,
}: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    baseHourlyRate: '',
    burdenMultiplier: '1.7',
  });

  const createEmployee = useMutation(api.employees.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createEmployee({
        organizationId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        position: formData.position,
        baseHourlyRate: parseFloat(formData.baseHourlyRate),
        burdenMultiplier: parseFloat(formData.burdenMultiplier),
      });

      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        baseHourlyRate: '',
        burdenMultiplier: '1.7',
      });
    } catch (error) {
      console.error('Failed to create employee:', error);
      alert('Failed to create employee. Please try again.');
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

  const trueCostPerHour =
    parseFloat(formData.baseHourlyRate || '0') *
    parseFloat(formData.burdenMultiplier || '1');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Team Member"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Employee'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />

        <Select
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
          options={[
            { value: 'Ground Crew', label: 'Ground Crew' },
            { value: 'Climber', label: 'Climber' },
            { value: 'Crew Leader', label: 'Crew Leader' },
            { value: 'Certified Arborist', label: 'Certified Arborist' },
            { value: 'Equipment Operator', label: 'Equipment Operator' },
            { value: 'Foreman', label: 'Foreman' },
          ]}
        />

        <Input
          label="Base Hourly Rate"
          name="baseHourlyRate"
          type="number"
          step="0.01"
          value={formData.baseHourlyRate}
          onChange={handleChange}
          required
        />

        <Select
          label="Burden Multiplier"
          name="burdenMultiplier"
          value={formData.burdenMultiplier}
          onChange={handleChange}
          required
          options={[
            { value: '1.6', label: '1.6x - Entry Ground Crew' },
            { value: '1.7', label: '1.7x - Standard (Default)' },
            { value: '1.8', label: '1.8x - Crew Leader' },
            { value: '1.9', label: '1.9x - Certified Arborist' },
            { value: '2.0', label: '2.0x - Specialized Operator' },
          ]}
        />

        {trueCostPerHour > 0 && (
          <div className={styles.calculation}>
            <div className={styles.calculationLabel}>True Cost Per Hour</div>
            <div className={styles.calculationValue}>
              ${trueCostPerHour.toFixed(2)}/hr
            </div>
            <div className={styles.calculationDetail}>
              ${formData.baseHourlyRate} × {formData.burdenMultiplier}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
