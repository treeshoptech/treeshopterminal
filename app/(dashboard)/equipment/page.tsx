'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Truck } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import styles from './page.module.css';

export default function EquipmentPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock org ID - replace with real auth
  const equipment = useQuery(api.equipment.list, {
    organizationId: 'org_mock123',
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Equipment Library</h1>
          <p className={styles.subtitle}>
            {equipment?.length || 0} pieces of equipment
          </p>
        </div>

        <Link href="/equipment/new">
          <Button icon={<Plus className="w-4 h-4" />}>
            Add Equipment
          </Button>
        </Link>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />

        <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
          Filter
        </Button>
      </div>

      {!equipment || equipment.length === 0 ? (
        <div className={styles.empty}>
          <Truck className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No equipment yet</h3>
          <p className={styles.emptyText}>
            Add your first piece of equipment to start calculating costs
          </p>
          <Link href="/equipment/new">
            <Button>Add Equipment</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {equipment.map((item) => (
            <EquipmentCard key={item._id} equipment={item} />
          ))}
        </div>
      )}
    </div>
  );
}
