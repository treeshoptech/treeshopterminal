'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, FolderOpen } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProjectCard } from '@/components/projects/ProjectCard';
import styles from './page.module.css';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const projects = useQuery(api.projects.list, {
    organizationId: 'org_mock123',
    status: statusFilter,
  });

  const statusFilters = [
    { label: 'All', value: undefined },
    { label: 'Quoted', value: 'quoted' },
    { label: 'Approved', value: 'approved' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            {projects?.length || 0} projects
          </p>
        </div>

        <Link href="/projects/new">
          <Button icon={<Plus className="w-4 h-4" />}>
            New Project
          </Button>
        </Link>
      </div>

      <div className={styles.controls}>
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />

        <div className={styles.statusFilters}>
          {statusFilters.map((filter) => (
            <button
              key={filter.label}
              className={`${styles.statusFilter} ${statusFilter === filter.value ? styles.active : ''}`}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className={styles.empty}>
          <FolderOpen className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No projects yet</h3>
          <p className={styles.emptyText}>
            Create your first project to start tracking work
          </p>
          <Link href="/projects/new">
            <Button>Create Project</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
