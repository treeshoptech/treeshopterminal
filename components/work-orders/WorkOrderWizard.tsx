'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { calculateInchAcres, calculateStumpScore, PRODUCTION_RATES, DEFAULT_SETTINGS } from '@/lib/formulas/pricing';
import type { Id } from '@/convex/_generated/dataModel';
import styles from './WorkOrderWizard.module.css';

interface WorkOrderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

type ServiceType = 'forestry_mulching' | 'stump_grinding' | 'land_clearing';

interface QuoteData {
  serviceType: ServiceType;
  workAreaIds: Id<'workAreas'>[];
  totalAcres: number;
  dbh?: number;
  stumps?: Array<{ diameter: number; heightAbove: number; depthBelow: number }>;
  projectDays?: number;
  estimatedHours: number;
  lowPrice: number;
  highPrice: number;
  scopeOfWork: string[];
  whatsIncluded: string[];
}

export function WorkOrderWizard({ isOpen, onClose, organizationId }: WorkOrderWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedJobSiteId, setSelectedJobSiteId] = useState<string>('');
  const [selectedWorkAreaIds, setSelectedWorkAreaIds] = useState<Id<'workAreas'>[]>([]);
  const [serviceType, setServiceType] = useState<ServiceType>('forestry_mulching');
  const [dbhPackage, setDbhPackage] = useState(4);
  const [stumps, setStumps] = useState<Array<{ diameter: number; heightAbove: number; depthBelow: number }>>([
    { diameter: 15, heightAbove: 1, depthBelow: 1 }
  ]);
  const [landClearingDays, setLandClearingDays] = useState(2);
  const [quote, setQuote] = useState<QuoteData | null>(null);

  const jobSites = useQuery(api.jobSites.list, { organizationId });
  const workAreas = useQuery(api.workAreas.list, {
    organizationId,
    jobSiteId: selectedJobSiteId ? selectedJobSiteId as Id<'jobSites'> : undefined
  });
  const createQuote = useMutation(api.quotes.create);
  const createWorkOrder = useMutation(api.workOrders.create);

  const selectedWorkAreas = workAreas?.filter(wa => selectedWorkAreaIds.includes(wa._id)) || [];
  const totalAcres = selectedWorkAreas.reduce((sum, wa) => sum + wa.area, 0);

  const calculateQuote = () => {
    let estimatedHours = 0;
    let lowPrice = 0;
    let highPrice = 0;
    let scopeOfWork: string[] = [];
    let whatsIncluded = [
      'Professional equipment and operators',
      'Round-trip transport and logistics',
      'Site cleanup and restoration',
      'Safety compliance and insurance'
    ];

    if (serviceType === 'forestry_mulching') {
      const inchAcres = calculateInchAcres(totalAcres, dbhPackage);
      const mulchingHours = inchAcres / PRODUCTION_RATES.CAT_265_MULCHER;
      const transportHours = 1.5 * 0.5; // Assume 45min drive at 50% rate
      const bufferHours = (mulchingHours + transportHours) * DEFAULT_SETTINGS.BUFFER_PERCENT;
      estimatedHours = mulchingHours + transportHours + bufferHours;

      // Cost range: $312-$437/hr (30-50% margin on Cat 265 loadout)
      lowPrice = Math.round(estimatedHours * 312);
      highPrice = Math.round(estimatedHours * 437);

      scopeOfWork = [
        `${totalAcres.toFixed(2)} acres forestry mulching`,
        `All vegetation up to ${dbhPackage}" diameter`,
        `Estimated ${Math.round(mulchingHours)} hours on-site work`
      ];
    } else if (serviceType === 'stump_grinding') {
      const totalStumpScore = stumps.reduce((sum, stump) =>
        sum + calculateStumpScore(stump), 0
      );
      const grindingHours = Math.max(0.5, totalStumpScore / PRODUCTION_RATES.STUMP_GRINDER);
      const transportHours = 1.0 * 0.3; // 30% rate for smaller trailer
      const bufferHours = (grindingHours + transportHours) * DEFAULT_SETTINGS.BUFFER_PERCENT;
      estimatedHours = grindingHours + transportHours + bufferHours;

      // Cost range: $284-$397/hr (30-50% margin on stump grinder loadout)
      lowPrice = Math.round(estimatedHours * 284);
      highPrice = Math.round(estimatedHours * 397);

      scopeOfWork = [
        `${stumps.length} stump${stumps.length > 1 ? 's' : ''} ground below grade`,
        'Standard 12" grind depth',
        `Estimated ${Math.round(grindingHours)} hours grinding time`
      ];
    } else if (serviceType === 'land_clearing') {
      const workHours = landClearingDays * PRODUCTION_RATES.LAND_CLEARING_PER_DAY;
      const transportHours = 1.0 * 0.5;
      estimatedHours = workHours + transportHours;

      // Cost range: $605-$871/hr (land clearing loadout)
      lowPrice = Math.round(estimatedHours * 605);
      highPrice = Math.round(estimatedHours * 871);

      scopeOfWork = [
        'Complete land clearing',
        'Heavy equipment and professional operators',
        'All debris removal and site cleanup',
        `Estimated ${landClearingDays} days on-site (${workHours} hours)`
      ];
    }

    const quoteData: QuoteData = {
      serviceType,
      workAreaIds: selectedWorkAreaIds,
      totalAcres,
      dbh: serviceType === 'forestry_mulching' ? dbhPackage : undefined,
      stumps: serviceType === 'stump_grinding' ? stumps : undefined,
      projectDays: serviceType === 'land_clearing' ? landClearingDays : undefined,
      estimatedHours,
      lowPrice,
      highPrice,
      scopeOfWork,
      whatsIncluded
    };

    setQuote(quoteData);
    setStep(4);
  };

  const saveQuoteAndCreateWorkOrder = async () => {
    if (!quote) return;

    try {
      const quoteId = await createQuote({
        organizationId,
        serviceType: quote.serviceType,
        workAreaIds: quote.workAreaIds,
        lowPrice: quote.lowPrice,
        highPrice: quote.highPrice,
        estimatedHours: quote.estimatedHours,
        scopeOfWork: quote.scopeOfWork,
        whatsIncluded: quote.whatsIncluded,
        calculationDetails: {
          totalAcres: quote.totalAcres,
          dbh: quote.dbh,
          stumps: quote.stumps,
          projectDays: quote.projectDays
        }
      });

      await createWorkOrder({
        organizationId,
        workOrderNumber: `WO-${Date.now().toString().slice(-6)}`,
        jobSiteId: selectedJobSiteId as Id<'jobSites'>,
        status: 'scheduled',
      });

      alert('Work order created successfully!');
      handleClose();
    } catch (error) {
      console.error('Failed to create work order:', error);
      alert('Failed to create work order');
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedJobSiteId('');
    setSelectedWorkAreaIds([]);
    setServiceType('forestry_mulching');
    setQuote(null);
    onClose();
  };

  const toggleWorkArea = (waId: Id<'workAreas'>) => {
    setSelectedWorkAreaIds(prev =>
      prev.includes(waId) ? prev.filter(id => id !== waId) : [...prev, waId]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Work Order"
      size="large"
    >
      <div style={{ padding: '20px' }}>
        {/* Progress indicator */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                backgroundColor: s <= step ? 'var(--color-primary)' : 'var(--border)',
                borderRadius: '2px'
              }}
            />
          ))}
        </div>

        {/* Step 1: Select Job Site */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Select Job Site</h3>
            {jobSites?.map(site => (
              <div
                key={site._id}
                onClick={() => setSelectedJobSiteId(site._id)}
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  border: `2px solid ${selectedJobSiteId === site._id ? 'var(--color-primary)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedJobSiteId === site._id ? 'var(--surface-hover)' : 'var(--surface)'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{site.siteName}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {site.address}, {site.city}
                </div>
              </div>
            ))}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setStep(2)} disabled={!selectedJobSiteId}>
                Next: Select Work Areas
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Work Areas */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Select Work Areas</h3>
            {workAreas && workAreas.length > 0 ? (
              <div>
                {workAreas.map(wa => (
                  <div
                    key={wa._id}
                    onClick={() => toggleWorkArea(wa._id)}
                    style={{
                      padding: '16px',
                      marginBottom: '12px',
                      border: `2px solid ${selectedWorkAreaIds.includes(wa._id) ? 'var(--color-primary)' : 'var(--border)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedWorkAreaIds.includes(wa._id) ? 'var(--surface-hover)' : 'var(--surface)'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{wa.name}</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {wa.area.toFixed(2)} acres
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--surface)', borderRadius: '8px' }}>
                  <strong>Total Selected: {totalAcres.toFixed(2)} acres</strong>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No work areas defined for this job site. Please draw work areas on the map first.
              </div>
            )}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={selectedWorkAreaIds.length === 0}>
                Next: Select Service
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Service Details */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Service Details</h3>

            <Select
              label="Service Type"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as ServiceType)}
              options={[
                { value: 'forestry_mulching', label: 'Forestry Mulching' },
                { value: 'stump_grinding', label: 'Stump Grinding' },
                { value: 'land_clearing', label: 'Land Clearing' }
              ]}
            />

            {serviceType === 'forestry_mulching' && (
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  DBH Package (Tree Diameter)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { value: 4, label: 'Small (up to 4" DBH) - Light brush, saplings' },
                    { value: 6, label: 'Medium (up to 6" DBH) - Small trees, dense brush' },
                    { value: 8, label: 'Large (up to 8" DBH) - Mature understory, medium trees' }
                  ].map(pkg => (
                    <div
                      key={pkg.value}
                      onClick={() => setDbhPackage(pkg.value)}
                      style={{
                        padding: '12px',
                        border: `2px solid ${dbhPackage === pkg.value ? 'var(--color-primary)' : 'var(--border)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: dbhPackage === pkg.value ? 'var(--surface-hover)' : 'var(--surface)'
                      }}
                    >
                      {pkg.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {serviceType === 'land_clearing' && (
              <div style={{ marginTop: '20px' }}>
                <Input
                  label="Estimated Project Days"
                  type="number"
                  min="1"
                  value={landClearingDays}
                  onChange={(e) => setLandClearingDays(Number(e.target.value))}
                />
              </div>
            )}

            {serviceType === 'stump_grinding' && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontWeight: '600' }}>Stumps</label>
                  <Button
                    size="sm"
                    onClick={() => setStumps([...stumps, { diameter: 15, heightAbove: 1, depthBelow: 1 }])}
                  >
                    + Add Stump
                  </Button>
                </div>
                {stumps.map((stump, idx) => (
                  <div key={idx} style={{ padding: '12px', marginBottom: '8px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                      <Input
                        label="Diameter (inches)"
                        type="number"
                        value={stump.diameter}
                        onChange={(e) => {
                          const newStumps = [...stumps];
                          newStumps[idx].diameter = Number(e.target.value);
                          setStumps(newStumps);
                        }}
                      />
                      <Input
                        label="Height Above (ft)"
                        type="number"
                        step="0.5"
                        value={stump.heightAbove}
                        onChange={(e) => {
                          const newStumps = [...stumps];
                          newStumps[idx].heightAbove = Number(e.target.value);
                          setStumps(newStumps);
                        }}
                      />
                      <Input
                        label="Depth Below (ft)"
                        type="number"
                        step="0.5"
                        value={stump.depthBelow}
                        onChange={(e) => {
                          const newStumps = [...stumps];
                          newStumps[idx].depthBelow = Number(e.target.value);
                          setStumps(newStumps);
                        }}
                      />
                      {stumps.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setStumps(stumps.filter((_, i) => i !== idx))}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={calculateQuote}>Generate Quote</Button>
            </div>
          </div>
        )}

        {/* Step 4: Quote Review */}
        {step === 4 && quote && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Quote Summary</h3>

            <Card>
              <CardHeader>
                <CardTitle>PROJECT INVESTMENT</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '20px' }}>
                  ${quote.lowPrice.toLocaleString()} - ${quote.highPrice.toLocaleString()}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Scope of Work</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {quote.scopeOfWork.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>What's Included</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {quote.whatsIncluded.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '12px', backgroundColor: 'var(--surface)', borderRadius: '8px' }}>
                  <strong>Estimated Timeline:</strong> {Math.round(quote.estimatedHours)} hours on-site
                </div>
              </CardContent>
            </Card>

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={saveQuoteAndCreateWorkOrder}>Create Work Order</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
