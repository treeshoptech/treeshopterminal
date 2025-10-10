'use client';

import Link from 'next/link';
import { Truck, Users, Wrench, FileText } from 'lucide-react';
import '@/styles/design-system.css';

export default function HomePage() {
  const steps = [
    { title: 'Equipment', href: '/equipment', icon: Truck, step: '01' },
    { title: 'Employees', href: '/employees', icon: Users, step: '02' },
    { title: 'Loadouts', href: '/loadouts', icon: Wrench, step: '03' },
    { title: 'Projects', href: '/projects', icon: FileText, step: '04' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: '#000' }}>
      <div className="max-w-4xl mx-auto">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-4"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            TreeShop Pricing
          </h1>
          <p className="text-xl" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Build your pricing in 4 steps
          </p>
        </div>

        {/* Simple Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.href}
                href={step.href}
                className="group p-8 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(0,0,0,0.5) 100%)',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                       style={{
                         background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                         boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)'
                       }}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold mb-1" style={{ color: '#22C55E' }}>
                      Step {step.step}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                  </div>
                </div>
                <div className="text-sm font-semibold transition-all group-hover:translate-x-2"
                     style={{ color: '#22C55E' }}>
                  Get Started →
                </div>
              </Link>
            );
          })}
        </div>

        {/* Auth Links */}
        <div className="flex justify-center gap-6 mt-8">
          <Link href="/login" className="text-sm font-semibold" style={{ color: '#22C55E' }}>
            Sign In
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
          <Link href="/signup" className="text-sm font-semibold" style={{ color: '#22C55E' }}>
            Create Account
          </Link>
        </div>
        <p className="text-center mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Sign in required to save equipment, employees, and loadouts
        </p>
      </div>
    </div>
  );
}
