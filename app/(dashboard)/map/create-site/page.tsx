'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from '../../calculators/equipment-cost/page.module.css';

export default function CreateJobSitePage() {
  const router = useRouter();
  const createSite = useMutation(api.jobSites.create);

  const [formData, setFormData] = useState({
    siteName: '',
    address: '',
    city: '',
    state: 'FL',
    zipCode: '',
    lat: 28.5383,
    lng: -81.3792,
    acreage: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createSite({
      organizationId: 'org_mock123',
      siteName: formData.siteName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      coordinates: {
        lat: formData.lat,
        lng: formData.lng,
      },
      acreage: formData.acreage ? parseFloat(formData.acreage) : undefined,
    });

    router.push('/map');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Job Site</h1>
        <p className={styles.subtitle}>Create new location for mapping</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.fields}>
                <Input
                  label="Site Name"
                  value={formData.siteName}
                  onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                  required
                />
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required
                />
                <Input
                  label="Zip Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  required
                />
                <Input
                  label="Acreage"
                  type="number"
                  step="0.1"
                  value={formData.acreage}
                  onChange={(e) => setFormData({...formData, acreage: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={() => router.push('/map')}>
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Create Job Site
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
