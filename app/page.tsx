'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { SignedOut, SignIn, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import '@/styles/design-system.css';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { organizationId } = useOrganization();
  const { isSignedIn } = useUser();
  const createQuote = useMutation(api.quotes.create);

  // Company Settings (from sidebar)
  const [hourlyCost, setHourlyCost] = useState(267);
  const [margin, setMargin] = useState(40);
  const [productionRate, setProductionRate] = useState(1.5);

  // Customer Fields (optional, in sidebar)
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Project Inputs
  const [driveHours, setDriveHours] = useState<number | ''>('');
  const [driveMinutes, setDriveMinutes] = useState<number | ''>('');
  const [acreage, setAcreage] = useState<number | ''>('');
  const [dbh, setDbh] = useState(6);

  // UI State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [saving, setSaving] = useState(false);

  // Calculation Results
  const [results, setResults] = useState<any>(null);

  // Settings Sidebar Toggle
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  // Calculate Price
  const calculatePrice = () => {
    if (
      driveHours === '' ||
      driveMinutes === '' ||
      acreage === '' ||
      !dbh
    ) {
      alert('Please fill in all project details');
      return;
    }

    // Step 1: Calculate Billing Rate
    const billingRate = hourlyCost / (1 - margin / 100);

    // Step 2: TreeShop Score
    const score = dbh * acreage;

    // Step 3: Production Time
    const productionTime = score / productionRate;

    // Step 4: Transport Time
    const driveTimeHours = Number(driveHours) + Number(driveMinutes) / 60;
    const totalDriveTime = driveTimeHours * 2;
    const transportBillable = totalDriveTime * 0.5;

    // Step 5: Buffer
    const buffer = (productionTime + transportBillable) * 0.1;

    // Step 6: Total Hours
    const totalHours = productionTime + transportBillable + buffer;

    // Step 7: Project Price
    const projectPrice = totalHours * billingRate;

    // Profit Calculations
    const totalCost = totalHours * hourlyCost;
    const profit = projectPrice - totalCost;
    const profitMargin = (profit / projectPrice) * 100;

    setResults({
      billingRate,
      score,
      productionTime,
      driveTimeHours,
      totalDriveTime,
      transportBillable,
      buffer,
      totalHours,
      projectPrice,
      totalCost,
      profit,
      profitMargin,
    });

    setCalculated(true);
  };

  // Save Quote to Convex
  const saveQuote = async () => {
    if (!organizationId) {
      alert('Please sign in to save quotes');
      return;
    }

    if (!results) return;

    setSaving(true);
    try {
      await createQuote({
        organizationId,
        serviceType: 'forestry-mulching',
        workAreaIds: [], // Empty for now, can add later
        lowPrice: results.projectPrice * 0.9, // 10% lower for range
        highPrice: results.projectPrice * 1.1, // 10% higher for range
        estimatedHours: results.totalHours,
        scopeOfWork: [
          `${acreage} acres forestry mulching`,
          `All vegetation up to ${dbh}" diameter`,
          'Equipment, labor, and transport included',
          'Professional site cleanup',
        ],
        whatsIncluded: [
          'Round-trip transport and logistics',
          'Professional cleanup and site restoration',
          `${results.productionTime.toFixed(1)} hours on-site work`,
        ],
        calculationDetails: {
          customerName: customerName || 'Not provided',
          customerAddress: customerAddress || 'Not provided',
          customerNotes: customerNotes || 'None',
          driveTime: `${driveHours}h ${driveMinutes}m`,
          acreage,
          dbh,
          hourlyCost,
          margin,
          productionRate,
          ...results,
        },
      });

      alert('Quote saved successfully!');

      // Reset form
      setCustomerName('');
      setCustomerAddress('');
      setCustomerNotes('');
      setDriveHours('');
      setDriveMinutes('');
      setAcreage('');
      setDbh(6);
      setCalculated(false);
      setResults(null);
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Failed to save quote. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // DBH Package Data
  const dbhPackages = [
    { value: 2, label: 'X Small', description: '2" DBH' },
    { value: 4, label: 'Small', description: '4" DBH' },
    { value: 6, label: 'Medium', description: '6" DBH' },
    { value: 8, label: 'Large', description: '8" DBH' },
    { value: 10, label: 'X Large', description: '10" DBH' },
    { value: 12, label: 'MAX', description: '12" DBH' },
  ];

  return (
    <>
      <div className="min-h-screen" style={{ background: '#000000', paddingBottom: '100px' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header with Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative" style={{ width: '180px', height: '60px' }}>
              <Image
                src="/treeshop-logo.png"
                alt="TreeShop"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <button
              onClick={toggleSettings}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: '#2196F3',
                color: 'white',
                border: 'none',
              }}
            >
              SETTINGS
            </button>
          </div>

          {/* Settings Sidebar */}
          <aside
            className="fixed top-0 right-0 h-full transition-transform duration-300 z-50"
            style={{
              width: settingsOpen ? '100%' : '0',
              maxWidth: '400px',
              background: '#0a0a0a',
              transform: settingsOpen ? 'translateX(0)' : 'translateX(100%)',
              overflowY: 'auto',
              borderLeft: '2px solid #2196F3',
            }}
          >
            {settingsOpen && (
              <>
                <div
                  className="sticky top-0 flex items-center justify-between p-4"
                  style={{
                    background: '#0a0a0a',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    zIndex: 10,
                  }}
                >
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                    Settings
                  </div>
                  <button
                    onClick={toggleSettings}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: '24px',
                      cursor: 'pointer',
                      padding: '0 8px',
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Company Settings Section */}
                  <div>
                    <h3 style={{ color: '#2196F3', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
                      Company Settings
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="hourlyCost"
                          style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '8px',
                          }}
                        >
                          Hourly Cost ($)
                        </label>
                        <input
                          type="number"
                          id="hourlyCost"
                          value={hourlyCost}
                          onChange={(e) => setHourlyCost(Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            background: '#000000',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="margin"
                          style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '8px',
                          }}
                        >
                          Profit Margin (%)
                        </label>
                        <input
                          type="number"
                          id="margin"
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            background: '#000000',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="productionRate"
                          style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '8px',
                          }}
                        >
                          Production Rate (PpH)
                        </label>
                        <input
                          type="number"
                          id="productionRate"
                          value={productionRate}
                          onChange={(e) => setProductionRate(Number(e.target.value))}
                          step="0.1"
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            background: '#000000',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Section */}
                  <div>
                    <h3 style={{ color: '#2196F3', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
                      Customer Information (Optional)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="customerName"
                          style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '8px',
                          }}
                        >
                          Customer Name
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="John Doe"
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            background: '#000000',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="customerAddress"
                          style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '8px',
                          }}
                        >
                          Property Address
                        </label>
                        <input
                          type="text"
                          id="customerAddress"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="123 Main St, City, State"
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            background: '#000000',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="customerNotes"
                          style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '8px',
                          }}
                        >
                          Notes
                        </label>
                        <textarea
                          id="customerNotes"
                          value={customerNotes}
                          onChange={(e) => setCustomerNotes(e.target.value)}
                          placeholder="Additional notes or special requirements..."
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            background: '#000000',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            resize: 'vertical',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* Main Calculator */}
          {!calculated ? (
            <div>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '24px',
                }}
              >
                Forestry Mulching Calculator
              </h2>

              {/* Project Details Section */}
              <div
                className="p-6 rounded-lg mb-6"
                style={{
                  background: '#0a0a0a',
                  border: '2px solid #2196F3',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2196F3',
                    marginBottom: '20px',
                  }}
                >
                  Project Details
                </h3>

                <div className="space-y-6">
                  {/* Drive Time */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '12px',
                      }}
                    >
                      Drive Time (One-Way)
                    </label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={driveHours}
                          onChange={(e) =>
                            setDriveHours(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          placeholder="Hours"
                          min="0"
                          style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            background: '#000000',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '8px',
                          }}
                        />
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.5)',
                            marginTop: '4px',
                            textAlign: 'center',
                          }}
                        >
                          Hours
                        </div>
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={driveMinutes}
                          onChange={(e) =>
                            setDriveMinutes(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          placeholder="Minutes"
                          min="0"
                          max="59"
                          style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            background: '#000000',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '8px',
                          }}
                        />
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.5)',
                            marginTop: '4px',
                            textAlign: 'center',
                          }}
                        >
                          Minutes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Acreage */}
                  <div>
                    <label
                      htmlFor="acreage"
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '12px',
                      }}
                    >
                      Project Acreage
                    </label>
                    <input
                      type="number"
                      id="acreage"
                      value={acreage}
                      onChange={(e) =>
                        setAcreage(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      placeholder="Enter acres"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '14px',
                        fontSize: '16px',
                        background: '#000000',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '8px',
                      }}
                    />
                  </div>

                  {/* DBH Package Selection */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '12px',
                      }}
                    >
                      Package Size
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {dbhPackages.map((pkg) => (
                        <button
                          key={pkg.value}
                          onClick={() => setDbh(pkg.value)}
                          className="transition-all"
                          style={{
                            padding: '16px 12px',
                            borderRadius: '8px',
                            background: dbh === pkg.value ? '#2196F3' : '#000000',
                            border:
                              dbh === pkg.value
                                ? '2px solid #2196F3'
                                : '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {pkg.label}
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>{pkg.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculatePrice}
                className="w-full py-4 rounded-lg font-bold text-lg transition-all"
                style={{
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                CALCULATE PRICE
              </button>
            </div>
          ) : (
            // Results View
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                  Project Investment
                </h2>
                <button
                  onClick={() => {
                    setCalculated(false);
                    setResults(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ← Back
                </button>
              </div>

              {/* Main Quote Box */}
              <div
                className="p-8 rounded-lg mb-6 text-center"
                style={{
                  background: '#0a0a0a',
                  border: '3px solid #2196F3',
                }}
              >
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2196F3', marginBottom: '24px' }}>
                  {formatCurrency(results.projectPrice)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                      On-Site Time
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                      {results.productionTime.toFixed(1)} hrs
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                      Total Billable
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                      {results.totalHours.toFixed(1)} hrs
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                      Your Profit
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80' }}>
                      {formatCurrency(results.profit)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Sections */}
              <details
                className="mb-4 rounded-lg"
                style={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <summary
                  className="p-4 cursor-pointer font-semibold"
                  style={{ color: 'white' }}
                >
                  Project Breakdown
                </summary>
                <div className="p-4 pt-0 space-y-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <div className="flex justify-between">
                    <span>TreeShop Score</span>
                    <span>{results.score.toFixed(2)} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Production Time</span>
                    <span>{results.productionTime.toFixed(2)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Round Trip Drive Time</span>
                    <span>{results.totalDriveTime.toFixed(2)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport Billable (50% of drive)</span>
                    <span>{results.transportBillable.toFixed(2)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Buffer (10%)</span>
                    <span>{results.buffer.toFixed(2)} hours</span>
                  </div>
                  <div
                    className="flex justify-between pt-2"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.2)', fontWeight: 'bold' }}
                  >
                    <span>Total Project Hours</span>
                    <span>{results.totalHours.toFixed(2)} hours</span>
                  </div>
                </div>
              </details>

              <details
                className="mb-4 rounded-lg"
                style={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <summary
                  className="p-4 cursor-pointer font-semibold"
                  style={{ color: 'white' }}
                >
                  Profit Analysis
                </summary>
                <div className="p-4 pt-0 space-y-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <div className="flex justify-between">
                    <span>Revenue</span>
                    <span>{formatCurrency(results.projectPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Costs</span>
                    <span>{formatCurrency(results.totalCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Profit</span>
                    <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
                      {formatCurrency(results.profit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin</span>
                    <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
                      {results.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </details>

              <details
                className="mb-6 rounded-lg"
                style={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <summary
                  className="p-4 cursor-pointer font-semibold"
                  style={{ color: 'white' }}
                >
                  Calculation Details
                </summary>
                <div className="p-4 pt-0 space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <div>
                    <strong>Step 1:</strong> Billing Rate = ${hourlyCost} ÷ (1 - {margin}%) = {formatCurrency(results.billingRate)}/hr
                  </div>
                  <div>
                    <strong>Step 2:</strong> TreeShop Score = {dbh}" × {acreage} acres = {results.score.toFixed(2)} points
                  </div>
                  <div>
                    <strong>Step 3:</strong> Production = {results.score.toFixed(2)} ÷ {productionRate} PpH = {results.productionTime.toFixed(2)} hrs
                  </div>
                  <div>
                    <strong>Step 4:</strong> Transport = {results.driveTimeHours.toFixed(2)}h × 2 × 0.50 = {results.transportBillable.toFixed(2)} hrs
                  </div>
                  <div>
                    <strong>Step 5:</strong> Buffer = ({results.productionTime.toFixed(2)} + {results.transportBillable.toFixed(2)}) × 0.10 = {results.buffer.toFixed(2)} hrs
                  </div>
                  <div>
                    <strong>Step 6:</strong> Total = {results.productionTime.toFixed(2)} + {results.transportBillable.toFixed(2)} + {results.buffer.toFixed(2)} = {results.totalHours.toFixed(2)} hrs
                  </div>
                  <div>
                    <strong>Step 7:</strong> Price = {results.totalHours.toFixed(2)} × {formatCurrency(results.billingRate)} = {formatCurrency(results.projectPrice)}
                  </div>
                </div>
              </details>

              {/* Save Quote Button */}
              {isSignedIn && (
                <button
                  onClick={saveQuote}
                  disabled={saving}
                  className="w-full py-4 rounded-lg font-bold text-lg transition-all"
                  style={{
                    background: saving ? 'rgba(33, 150, 243, 0.5)' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'SAVING...' : 'SAVE QUOTE'}
                </button>
              )}

              {!isSignedIn && (
                <div
                  className="p-4 rounded-lg text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Sign in to save quotes to your account
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sign-In Modal */}
      <SignedOut>
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="relative w-full max-w-md px-6">
            <div className="text-center mb-12">
              <div className="mb-4 flex justify-center">
                <div className="relative" style={{ width: '240px', height: '80px' }}>
                  <Image
                    src="/treeshop-logo.png"
                    alt="TreeShop"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </div>
              <p className="text-lg text-gray-400 mb-2">
                Professional pricing for tree service operations
              </p>
              <p className="text-sm text-gray-500">Sign in to continue</p>
            </div>

            <div className="relative">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: 'mx-auto',
                    card: {
                      background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                      backdropFilter: 'blur(40px)',
                      border: '2px solid rgba(33, 150, 243, 0.3)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                      borderRadius: '24px',
                      padding: '48px 40px',
                    },
                    headerTitle: { display: 'none' },
                    headerSubtitle: { display: 'none' },
                    formButtonPrimary: {
                      background: '#2196F3',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '700',
                      padding: '16px',
                      borderRadius: '12px',
                      border: 'none',
                    },
                  },
                  variables: {
                    colorPrimary: '#2196F3',
                    colorBackground: 'transparent',
                    borderRadius: '12px',
                  },
                }}
                redirectUrl="/"
              />
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
