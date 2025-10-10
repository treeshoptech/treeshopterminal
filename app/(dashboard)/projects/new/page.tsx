'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Building2, MapPin, Settings, Calculator } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import styles from '../../calculators/equipment-cost/page.module.css';

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useMutation(api.projects.create);

  const organizationId = 'org_mock123';
  const customers = useQuery(api.customers.list, { organizationId });
  const jobSites = useQuery(api.jobSites.list, { organizationId });
  const loadouts = useQuery(api.loadouts.list, { organizationId, isActive: true });

  const [selectedCustomerId, setSelectedCustomerId] = useState<Id<'customers'> | ''>('');
  const [selectedJobSiteId, setSelectedJobSiteId] = useState<Id<'jobSites'> | ''>('');
  const [selectedLoadoutId, setSelectedLoadoutId] = useState<Id<'loadouts'> | ''>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  const [formData, setFormData] = useState({
    projectName: '',
    projectSize: '',
    sizeUnit: 'acres',
    profitMargin: '0.5',
    scope: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Filter job sites by selected customer
  const customerJobSites = jobSites?.filter(
    site => site.customerId === selectedCustomerId
  );

  // Filter loadouts by selected service type
  const serviceLoadouts = selectedServiceType
    ? loadouts?.filter(l => l.serviceType === selectedServiceType)
    : loadouts;

  // Validation
  useEffect(() => {
    const newErrors: string[] = [];

    if (!customers || customers.length === 0) {
      newErrors.push('You need to create at least one customer first');
    }

    if (!loadouts || loadouts.length === 0) {
      newErrors.push('You need to create at least one loadout first');
    }

    if (selectedServiceType === 'stump_grinding') {
      const stumpLoadouts = loadouts?.filter(l =>
        l.serviceType === 'stump_grinding' &&
        l.productionUnit === 'stumpscore/hour'
      );
      if (!stumpLoadouts || stumpLoadouts.length === 0) {
        newErrors.push('Stump grinding requires a loadout with production rate in StumpScore/hour');
      }
    }

    setErrors(newErrors);
  }, [customers, loadouts, selectedServiceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.length > 0) {
      alert('Please fix the errors before creating a project');
      return;
    }

    if (!selectedCustomerId || !selectedLoadoutId) {
      alert('Please select a customer and loadout');
      return;
    }

    const selectedLoadout = loadouts?.find(l => l._id === selectedLoadoutId);
    if (!selectedLoadout) return;

    const projectSize = parseFloat(formData.projectSize);
    const profitMargin = parseFloat(formData.profitMargin);

    // Simple calculation (you can expand this with full pricing formulas)
    const productionRate = selectedLoadout.productionRate || 1;
    const workHours = projectSize / productionRate;
    const transportHours = 0.5; // Placeholder
    const bufferHours = workHours * 0.1;
    const totalHours = workHours + transportHours + bufferHours;

    const loadoutCost = selectedLoadout.totalLoadoutCostPerHour;
    const billingRate = loadoutCost / (1 - profitMargin);

    const totalCost = totalHours * loadoutCost;
    const totalPrice = totalHours * billingRate;
    const totalProfit = totalPrice - totalCost;

    const projectNumber = `PRJ-${Date.now().toString().slice(-6)}`;

    await createProject({
      organizationId,
      projectName: formData.projectName,
      projectNumber,
      customerId: selectedCustomerId as Id<'customers'>,
      jobSiteId: selectedJobSiteId || undefined,
      serviceType: selectedServiceType,
      scope: formData.scope,
      loadoutId: selectedLoadoutId as Id<'loadouts'>,
      loadoutCostPerHour: loadoutCost,
      profitMargin,
      billingRatePerHour: billingRate,
      projectSize,
      sizeUnit: formData.sizeUnit,
      workHours,
      transportHours,
      bufferHours,
      totalHours,
      totalCost,
      totalPrice,
      totalProfit,
    });

    router.push('/projects');
  };

  // Show blocking errors
  if (errors.length > 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Project</h1>
          <p className={styles.subtitle}>Setup required before creating projects</p>
        </div>

        <Card>
          <CardContent>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <AlertCircle size={48} style={{ color: 'var(--color-warning)', margin: '0 auto 16px' }} />
              <h3 style={{ marginBottom: '16px' }}>Setup Required</h3>
              <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto 24px' }}>
                {errors.map((error, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--background)',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {error}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                {(!customers || customers.length === 0) && (
                  <Button onClick={() => router.push('/customers')}>
                    <Building2 size={16} style={{ marginRight: '8px' }} />
                    Go to Customers
                  </Button>
                )}
                {(!loadouts || loadouts.length === 0) && (
                  <Button onClick={() => router.push('/loadouts')}>
                    <Settings size={16} style={{ marginRight: '8px' }} />
                    Go to Loadouts
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create New Project</h1>
        <p className={styles.subtitle}>Configure project details and pricing</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <Card>
            <CardHeader>
              <CardTitle>Customer & Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.fields}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Customer *
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      setSelectedCustomerId(e.target.value as Id<'customers'>);
                      setSelectedJobSiteId('');
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
                    <option value="">-- Select customer --</option>
                    {customers?.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name} {customer.company ? `(${customer.company})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCustomerId && customerJobSites && customerJobSites.length > 0 && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                      Job Site (optional)
                    </label>
                    <select
                      value={selectedJobSiteId}
                      onChange={(e) => setSelectedJobSiteId(e.target.value as Id<'jobSites'>)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        fontSize: '14px',
                      }}
                    >
                      <option value="">-- Select job site --</option>
                      {customerJobSites.map((site) => (
                        <option key={site._id} value={site._id}>
                          {site.siteName} - {site.city}, {site.state}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedCustomerId && (!customerJobSites || customerJobSites.length === 0) && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--background)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      No job sites for this customer yet
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => router.push('/map/create-site')}
                    >
                      <MapPin size={14} style={{ marginRight: '6px' }} />
                      Add Site
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service & Loadout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.fields}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Service Type *
                  </label>
                  <select
                    value={selectedServiceType}
                    onChange={(e) => {
                      setSelectedServiceType(e.target.value);
                      setSelectedLoadoutId('');
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
                    <option value="">-- Select service --</option>
                    <option value="forestry_mulching">Forestry Mulching</option>
                    <option value="stump_grinding">Stump Grinding</option>
                    <option value="land_clearing">Land Clearing</option>
                  </select>
                </div>

                {selectedServiceType && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                      Loadout *
                    </label>
                    <select
                      value={selectedLoadoutId}
                      onChange={(e) => setSelectedLoadoutId(e.target.value as Id<'loadouts'>)}
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
                      <option value="">-- Select loadout --</option>
                      {serviceLoadouts?.map((loadout) => (
                        <option key={loadout._id} value={loadout._id}>
                          {loadout.loadoutName} (${loadout.totalLoadoutCostPerHour.toFixed(2)}/hr)
                        </option>
                      ))}
                    </select>
                    {serviceLoadouts && serviceLoadouts.length === 0 && (
                      <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-warning)' }}>
                        No loadouts available for {selectedServiceType}. Create one first.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.fields}>
                <Input
                  label="Project Name"
                  placeholder="e.g., Smith Residence - Backyard Clearing"
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  required
                />

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <Input
                    label="Project Size"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.5"
                    value={formData.projectSize}
                    onChange={(e) => setFormData({...formData, projectSize: e.target.value})}
                    required
                  />
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                      Unit
                    </label>
                    <select
                      value={formData.sizeUnit}
                      onChange={(e) => setFormData({...formData, sizeUnit: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        fontSize: '14px',
                      }}
                    >
                      <option value="acres">Acres</option>
                      <option value="inch-acres">Inch-Acres</option>
                      <option value="stumpscore">StumpScore</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Profit Margin
                  </label>
                  <select
                    value={formData.profitMargin}
                    onChange={(e) => setFormData({...formData, profitMargin: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--surface)',
                      fontSize: '14px',
                    }}
                  >
                    <option value="0.3">30% Margin</option>
                    <option value="0.4">40% Margin</option>
                    <option value="0.5">50% Margin</option>
                    <option value="0.6">60% Margin</option>
                    <option value="0.7">70% Margin</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Scope of Work (optional)
                  </label>
                  <textarea
                    value={formData.scope}
                    onChange={(e) => setFormData({...formData, scope: e.target.value})}
                    placeholder="Describe the work to be done..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--surface)',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={() => router.push('/projects')}>
              Cancel
            </Button>
            <Button type="submit" size="lg">
              <Calculator size={18} style={{ marginRight: '8px' }} />
              Create Project
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
