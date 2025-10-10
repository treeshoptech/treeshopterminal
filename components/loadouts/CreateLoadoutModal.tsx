'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import styles from './CreateLoadoutModal.module.css';

interface CreateLoadoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export function CreateLoadoutModal({
  isOpen,
  onClose,
  organizationId,
}: CreateLoadoutModalProps) {
  const [formData, setFormData] = useState({
    loadoutName: '',
    serviceType: '',
    productionRate: '',
    productionUnit: 'IA',
    notes: '',
  });

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Array<{
    position: string;
    baseWage: string;
    burdenMultiplier: string;
  }>>([]);

  const createLoadout = useMutation(api.loadouts.create);
  const equipment = useQuery(api.equipment.list, { organizationId, status: 'active' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEquipment.length === 0) {
      alert('Please select at least one piece of equipment');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate equipment cost
      const equipmentCost = selectedEquipment.reduce((total, eqId) => {
        const eq = equipment?.find((e) => e._id === eqId);
        return total + (eq?.totalCostPerHour || 0);
      }, 0);

      // Calculate labor cost
      const employeesData = employees.map((emp) => ({
        position: emp.position,
        baseWage: parseFloat(emp.baseWage),
        burdenMultiplier: parseFloat(emp.burdenMultiplier),
        trueCostPerHour: parseFloat(emp.baseWage) * parseFloat(emp.burdenMultiplier),
      }));

      const laborCost = employeesData.reduce((total, emp) => total + emp.trueCostPerHour, 0);
      const totalCost = equipmentCost + laborCost;

      await createLoadout({
        organizationId,
        loadoutName: formData.loadoutName,
        serviceType: formData.serviceType || undefined,
        equipmentIds: selectedEquipment as any,
        employees: employeesData.length > 0 ? employeesData : undefined,
        totalEquipmentCostPerHour: equipmentCost,
        totalLaborCostPerHour: laborCost,
        totalLoadoutCostPerHour: totalCost,
        productionRate: formData.productionRate ? parseFloat(formData.productionRate) : undefined,
        productionUnit: formData.productionUnit || undefined,
        notes: formData.notes || undefined,
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to create loadout:', error);
      alert('Failed to create loadout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      loadoutName: '',
      serviceType: '',
      productionRate: '',
      productionUnit: 'IA',
      notes: '',
    });
    setSelectedEquipment([]);
    setEmployees([]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleEquipment = (eqId: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(eqId) ? prev.filter((id) => id !== eqId) : [...prev, eqId]
    );
  };

  const addEmployee = () => {
    setEmployees((prev) => [
      ...prev,
      { position: '', baseWage: '', burdenMultiplier: '1.7' },
    ]);
  };

  const removeEmployee = (index: number) => {
    setEmployees((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEmployee = (index: number, field: string, value: string) => {
    setEmployees((prev) =>
      prev.map((emp, i) => (i === index ? { ...emp, [field]: value } : emp))
    );
  };

  const totalEquipmentCost = selectedEquipment.reduce((total, eqId) => {
    const eq = equipment?.find((e) => e._id === eqId);
    return total + (eq?.totalCostPerHour || 0);
  }, 0);

  const totalLaborCost = employees.reduce((total, emp) => {
    return total + (parseFloat(emp.baseWage || '0') * parseFloat(emp.burdenMultiplier || '1'));
  }, 0);

  const totalLoadoutCost = totalEquipmentCost + totalLaborCost;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Build New Loadout"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Loadout'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Loadout Name"
          name="loadoutName"
          value={formData.loadoutName}
          onChange={handleChange}
          placeholder="e.g., Cat 265 Standard Crew"
          required
        />

        <Select
          label="Service Type"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          options={[
            { value: 'Forestry Mulching', label: 'Forestry Mulching' },
            { value: 'Land Clearing', label: 'Land Clearing' },
            { value: 'Stump Grinding', label: 'Stump Grinding' },
            { value: 'Tree Removal', label: 'Tree Removal' },
            { value: 'General', label: 'General' },
          ]}
        />

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Equipment</h4>
          <div className={styles.equipmentList}>
            {equipment?.map((eq) => (
              <label key={eq._id} className={styles.equipmentItem}>
                <input
                  type="checkbox"
                  checked={selectedEquipment.includes(eq._id)}
                  onChange={() => toggleEquipment(eq._id)}
                />
                <span className={styles.equipmentName}>{eq.equipmentName}</span>
                <span className={styles.equipmentCost}>
                  ${eq.totalCostPerHour.toFixed(2)}/hr
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>Crew Members</h4>
            <Button type="button" variant="secondary" onClick={addEmployee}>
              Add Employee
            </Button>
          </div>
          {employees.map((emp, index) => (
            <div key={index} className={styles.employeeRow}>
              <Input
                placeholder="Position"
                value={emp.position}
                onChange={(e) => updateEmployee(index, 'position', e.target.value)}
              />
              <Input
                placeholder="Wage"
                type="number"
                step="0.01"
                value={emp.baseWage}
                onChange={(e) => updateEmployee(index, 'baseWage', e.target.value)}
              />
              <Input
                placeholder="Burden"
                type="number"
                step="0.1"
                value={emp.burdenMultiplier}
                onChange={(e) => updateEmployee(index, 'burdenMultiplier', e.target.value)}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeEmployee(index)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.row}>
          <Input
            label="Production Rate"
            name="productionRate"
            type="number"
            step="0.1"
            value={formData.productionRate}
            onChange={handleChange}
            placeholder="e.g., 1.3"
          />
          <Input
            label="Production Unit"
            name="productionUnit"
            value={formData.productionUnit}
            onChange={handleChange}
            placeholder="e.g., IA, acres, stumps"
          />
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Equipment Cost:</span>
            <span>${totalEquipmentCost.toFixed(2)}/hr</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Labor Cost:</span>
            <span>${totalLaborCost.toFixed(2)}/hr</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total Loadout Cost:</span>
            <span>${totalLoadoutCost.toFixed(2)}/hr</span>
          </div>
        </div>
      </form>
    </Modal>
  );
}
