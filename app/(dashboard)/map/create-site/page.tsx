'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Building2, MapPin, AlertCircle } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import styles from '../../calculators/equipment-cost/page.module.css';

export default function CreateJobSitePage() {
  const router = useRouter();
  const createSite = useMutation(api.jobSites.create);

  const organizationId = 'org_mock123';
  const customers = useQuery(api.customers.list, { organizationId });

  const [selectedCustomerId, setSelectedCustomerId] = useState<Id<'customers'> | ''>('');
  const [useCustomerAddress, setUseCustomerAddress] = useState(false);
  const [formData, setFormData] = useState({
    siteName: '',
    address: '',
    city: '',
    state: 'FL',
    zipCode: '',
    lat: 29.0261,
    lng: -81.0726,
    acreage: '',
  });

  // Auto-populate from selected customer
  useEffect(() => {
    if (selectedCustomerId && customers) {
      const customer = customers.find(c => c._id === selectedCustomerId);
      if (customer && useCustomerAddress && customer.address) {
        setFormData(prev => ({
          ...prev,
          address: customer.address || '',
          city: customer.city || '',
          state: customer.state || 'FL',
          zipCode: customer.zipCode || '',
          lat: customer.coordinates?.lat || 29.0261,
          lng: customer.coordinates?.lng || -81.0726,
        }));
      }
    }
  }, [selectedCustomerId, useCustomerAddress, customers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      alert('Please select a customer for this job site');
      return;
    }

    await createSite({
      organizationId,
      customerId: selectedCustomerId as Id<'customers'>,
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

  const selectedCustomer = customers?.find(c => c._id === selectedCustomerId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Job Site</h1>
        <p className={styles.subtitle}>Create new location linked to customer</p>
      </div>

      {!customers || customers.length === 0 ? (
        <Card>
          <CardContent>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <AlertCircle size={48} style={{ color: 'var(--color-warning)', margin: '0 auto 16px' }} />
              <h3 style={{ marginBottom: '8px' }}>No Customers Yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                You need to create a customer before adding a job site.
              </p>
              <Button onClick={() => router.push('/customers')}>
                Go to Customers
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.form}>
            <Card>
              <CardHeader>
                <CardTitle>Customer Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fields}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                      Select Customer *
                    </label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => {
                        setSelectedCustomerId(e.target.value as Id<'customers'>);
                        setUseCustomerAddress(false);
                      }}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        fontSize: '14px',
                      }}
                    >
                      <option value="">-- Choose a customer --</option>
                      {customers.map((customer) => (
                        <option key={customer._id} value={customer._id}>
                          {customer.name} {customer.company ? `(${customer.company})` : ''} - {customer.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCustomer && selectedCustomer.address && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'var(--background)',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={useCustomerAddress}
                          onChange={(e) => setUseCustomerAddress(e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ fontSize: '14px' }}>
                          Use customer address: {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fields}>
                  <Input
                    label="Site Name"
                    placeholder="e.g., Smith Residence - Backyard"
                    value={formData.siteName}
                    onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                    required
                  />
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                    disabled={useCustomerAddress}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                      disabled={useCustomerAddress}
                    />
                    <Input
                      label="State"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      required
                      disabled={useCustomerAddress}
                    />
                    <Input
                      label="Zip Code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      required
                      disabled={useCustomerAddress}
                    />
                  </div>
                  <Input
                    label="Acreage (optional)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.5"
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
      )}
    </div>
  );
}
