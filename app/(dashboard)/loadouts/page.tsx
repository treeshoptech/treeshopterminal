'use client';

import { useState } from 'react';
import { Plus, Package, Search } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadoutCard } from '@/components/loadouts/LoadoutCard';
import { CreateLoadoutModal } from '@/components/loadouts/CreateLoadoutModal';
import styles from './page.module.css';

export default function LoadoutsPage() {
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const organizationId = 'org_mock123';
  const loadouts = useQuery(api.loadouts.list, { organizationId });
  const deleteLoadout = useMutation(api.loadouts.remove);

  const handleEdit = (id: string) => {
    console.log('Edit loadout:', id);
    // TODO: Implement edit modal
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLoadout({ id: id as any });
    } catch (error) {
      console.error('Failed to delete loadout:', error);
    }
  };

  const filteredLoadouts = loadouts?.filter((loadout) =>
    loadout.loadoutName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Loadouts</h1>
          <p className={styles.subtitle}>
            {loadouts?.length || 0} equipment configurations
          </p>
        </div>

        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>
          Build Loadout
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="Search loadouts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {!filteredLoadouts || filteredLoadouts.length === 0 ? (
        <div className={styles.empty}>
          <Package className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No loadouts yet</h3>
          <p className={styles.emptyText}>
            Build your first loadout by combining equipment and crew
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>Build Loadout</Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredLoadouts.map((loadout) => (
            <LoadoutCard
              key={loadout._id}
              loadout={loadout}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateLoadoutModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        organizationId={organizationId}
      />
    </div>
  );
}
