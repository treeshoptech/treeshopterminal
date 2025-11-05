'use client';

import Image from 'next/image';
import Link from 'next/link';
import '@/styles/design-system.css';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
      <div className="text-center px-8 max-w-2xl">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <div className="relative" style={{ width: '280px', height: '92px' }}>
            <Image
              src="/treeshop-logo.png"
              alt="TreeShop"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
          Professional Pricing Calculator
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '48px' }}>
          Calculate accurate project estimates for forestry mulching services
        </p>

        {/* Big Button */}
        <Link href="/forestry-mulching">
          <button
            className="w-full max-w-md py-6 rounded-xl font-bold text-xl transition-all active:scale-98"
            style={{
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(33, 150, 243, 0.5)',
            }}
          >
            Open Forestry Mulching Calculator
          </button>
        </Link>
      </div>
    </div>
  );
}
