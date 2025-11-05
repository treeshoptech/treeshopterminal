'use client';

import { useState } from 'react';
import Image from 'next/image';
import '@/styles/design-system.css';

export default function HomePage() {
  // Company Settings
  const [hourlyCost, setHourlyCost] = useState(267);
  const [margin, setMargin] = useState(40);
  const [productionRate, setProductionRate] = useState(1.5);

  // Project Inputs
  const [driveHours, setDriveHours] = useState<number | ''>('');
  const [driveMinutes, setDriveMinutes] = useState<number | ''>('');
  const [acreage, setAcreage] = useState<number | ''>('');
  const [dbh, setDbh] = useState(6);

  // UI State
  const [activeTab, setActiveTab] = useState<'calculator' | 'settings'>('calculator');
  const [calculated, setCalculated] = useState(false);

  // Calculation Results
  const [results, setResults] = useState<any>(null);

  // Calculate Price
  const calculatePrice = () => {
    if (driveHours === '' || driveMinutes === '' || acreage === '' || !dbh) {
      alert('Please fill in all project details');
      return;
    }

    const billingRate = hourlyCost / (1 - margin / 100);
    const score = dbh * Number(acreage);
    const productionTime = score / productionRate;
    const driveTimeHours = Number(driveHours) + Number(driveMinutes) / 60;
    const totalDriveTime = driveTimeHours * 2;
    const transportBillable = totalDriveTime * 0.5;
    const buffer = (productionTime + transportBillable) * 0.1;
    const totalHours = productionTime + transportBillable + buffer;
    const projectPrice = totalHours * billingRate;
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const dbhPackages = [
    { value: 2, label: 'X Small', description: '2" DBH' },
    { value: 4, label: 'Small', description: '4" DBH' },
    { value: 6, label: 'Medium', description: '6" DBH' },
    { value: 8, label: 'Large', description: '8" DBH' },
    { value: 10, label: 'X Large', description: '10" DBH' },
    { value: 12, label: 'MAX', description: '12" DBH' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#000000' }}>
      {/* Header with Logo and Tabs */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(10, 10, 10, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(33, 150, 243, 0.2)',
        }}
      >
        <div className="mx-auto px-8 py-4">
          {/* Logo */}
          <div className="mb-4">
            <div className="relative" style={{ width: '140px', height: '46px' }}>
              <Image
                src="/treeshop-logo.png"
                alt="TreeShop"
                fill
                style={{ objectFit: 'contain', objectPosition: 'left' }}
                priority
              />
            </div>
          </div>

          {/* Browser-style Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('calculator')}
              className="px-6 py-3 rounded-t-lg font-semibold text-sm transition-all"
              style={{
                background: activeTab === 'calculator' ? '#2196F3' : 'rgba(255,255,255,0.05)',
                color: activeTab === 'calculator' ? 'white' : 'rgba(255,255,255,0.6)',
                border: activeTab === 'calculator' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderBottom: 'none',
              }}
            >
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="px-6 py-3 rounded-t-lg font-semibold text-sm transition-all"
              style={{
                background: activeTab === 'settings' ? '#2196F3' : 'rgba(255,255,255,0.05)',
                color: activeTab === 'settings' ? 'white' : 'rgba(255,255,255,0.6)',
                border: activeTab === 'settings' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderBottom: 'none',
              }}
            >
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-8 pb-40">
        {/* Calculator Tab */}
        {activeTab === 'calculator' && !calculated && (
          <div>
            {/* Project Details Section */}
            <div
              className="p-8 rounded-xl mb-6"
              style={{
                background: 'rgba(10, 10, 10, 0.6)',
                border: '2px solid #2196F3',
                boxShadow: '0 4px 24px rgba(33, 150, 243, 0.15)',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#2196F3',
                  marginBottom: '24px',
                }}
              >
                Project Details
              </h3>

              <div className="space-y-8">
                {/* Drive Time */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '14px',
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
                          padding: '18px',
                          fontSize: '16px',
                          background: '#000000',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: '12px',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.5)',
                          marginTop: '8px',
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
                        placeholder="Min"
                        min="0"
                        max="59"
                        style={{
                          width: '100%',
                          padding: '18px',
                          fontSize: '16px',
                          background: '#000000',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: '12px',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.5)',
                          marginTop: '8px',
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
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '14px',
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
                      padding: '18px',
                      fontSize: '16px',
                      background: '#000000',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                    }}
                  />
                </div>

                {/* DBH Package Selection */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '14px',
                    }}
                  >
                    Package Size
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {dbhPackages.map((pkg) => (
                      <button
                        key={pkg.value}
                        onClick={() => setDbh(pkg.value)}
                        className="transition-all"
                        style={{
                          padding: '20px 16px',
                          borderRadius: '12px',
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
                        <div style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '6px' }}>
                          {pkg.label}
                        </div>
                        <div style={{ fontSize: '13px', opacity: 0.8 }}>{pkg.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculatePrice}
              className="w-full py-5 rounded-xl font-bold text-lg transition-all active:scale-98"
              style={{
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
              }}
            >
              CALCULATE PRICE
            </button>
          </div>
        )}

        {/* Calculator Results */}
        {activeTab === 'calculator' && calculated && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                Project Investment
              </h2>
              <button
                onClick={() => {
                  setCalculated(false);
                  setResults(null);
                }}
                style={{
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ← Back
              </button>
            </div>

            {/* Main Quote Box */}
            <div
              className="p-10 rounded-xl mb-8 text-center"
              style={{
                background: 'rgba(10, 10, 10, 0.8)',
                border: '3px solid #2196F3',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
              }}
            >
              <div style={{ fontSize: '52px', fontWeight: 'bold', color: '#2196F3', marginBottom: '28px' }}>
                {formatCurrency(results.projectPrice)}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                    On-Site Time
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>
                    {results.productionTime.toFixed(1)} hrs
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                    Total Billable
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>
                    {results.totalHours.toFixed(1)} hrs
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                    Your Profit
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#4ade80' }}>
                    {formatCurrency(results.profit)}
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Sections */}
            <details
              className="mb-5 rounded-xl"
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <summary
                className="p-5 cursor-pointer font-semibold"
                style={{ color: 'white', fontSize: '15px' }}
              >
                Project Breakdown
              </summary>
              <div className="p-5 pt-0 space-y-3" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
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
                  className="flex justify-between pt-3 mt-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.2)', fontWeight: 'bold' }}
                >
                  <span>Total Project Hours</span>
                  <span>{results.totalHours.toFixed(2)} hours</span>
                </div>
              </div>
            </details>

            <details
              className="mb-5 rounded-xl"
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <summary
                className="p-5 cursor-pointer font-semibold"
                style={{ color: 'white', fontSize: '15px' }}
              >
                Profit Analysis
              </summary>
              <div className="p-5 pt-0 space-y-3" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
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
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>
              Company Settings
            </h2>

            <div
              className="p-8 rounded-xl mb-6"
              style={{
                background: 'rgba(10, 10, 10, 0.6)',
                border: '2px solid #2196F3',
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196F3', marginBottom: '24px' }}>
                Pricing Configuration
              </h3>

              <div className="space-y-6">
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '10px' }}>
                    Hourly Cost ($)
                  </label>
                  <input
                    type="number"
                    value={hourlyCost}
                    onChange={(e) => setHourlyCost(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '16px',
                      background: '#000000',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '10px' }}>
                    Profit Margin (%)
                  </label>
                  <input
                    type="number"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '16px',
                      background: '#000000',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '10px' }}>
                    Production Rate (Points per Hour)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={productionRate}
                    onChange={(e) => setProductionRate(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '16px',
                      background: '#000000',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
