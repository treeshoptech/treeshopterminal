'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CustomerCard } from '@/components/customers/CustomerCard';
import styles from './page.module.css';

// Mock data - will be replaced with Convex queries
const mockCustomers = [
  {
    _id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Orlando, FL 32801',
    status: 'active',
    totalProjects: 5,
    totalRevenue: 12500,
  },
  {
    _id: '2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Winter Park, FL 32789',
    status: 'lead',
    totalProjects: 0,
    totalRevenue: 0,
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.subtitle}>{mockCustomers.length} total customers</p>
        </div>

        <Link href="/customers/new">
          <Button icon={<Plus className="w-4 h-4" />}>
            New Customer
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />

        <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
          Filter
        </Button>
      </div>

      {/* Customer Grid */}
      <div className={styles.grid}>
        {mockCustomers.map((customer) => (
          <CustomerCard key={customer._id} customer={customer} />
        ))}
      </div>
    </div>
  );
}
