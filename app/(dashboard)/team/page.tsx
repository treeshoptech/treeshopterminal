'use client';

import { useState } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmployeeCard } from '@/components/team/EmployeeCard';
import { CreateEmployeeModal } from '@/components/team/CreateEmployeeModal';
import styles from './page.module.css';

export default function TeamPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const organizationId = 'org_mock123';
  const employees = useQuery(api.employees.list, {
    organizationId,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const deleteEmployee = useMutation(api.employees.remove);

  const handleEdit = (id: string) => {
    console.log('Edit employee:', id);
    // TODO: Implement edit modal
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee({ id: id as any });
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const filteredEmployees = employees?.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const searchLower = search.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.position?.toLowerCase().includes(searchLower)
    );
  });

  const statusCounts = {
    all: employees?.length || 0,
    active: employees?.filter((e) => e.status === 'active').length || 0,
    inactive: employees?.filter((e) => e.status === 'inactive').length || 0,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Team</h1>
          <p className={styles.subtitle}>
            {employees?.length || 0} team members
          </p>
        </div>

        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>
          Add Team Member
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className={styles.statusFilter}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            className={`${styles.statusButton} ${statusFilter === status ? styles.active : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
          </button>
        ))}
      </div>

      {!filteredEmployees || filteredEmployees.length === 0 ? (
        <div className={styles.empty}>
          <Users className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No team members yet</h3>
          <p className={styles.emptyText}>
            Add your first team member to start building your crew
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>Add Team Member</Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        organizationId={organizationId}
      />
    </div>
  );
}
