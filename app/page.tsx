'use client';

import '@/styles/design-system.css';

export const dynamic = 'force-dynamic';

export default function HomePage() {

  // Show the actual home page for authenticated users
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `
                 radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.04) 0%, transparent 40%),
                 radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 40%)
               `
             }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 pb-28 md:pb-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-4"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
            TreeShop Terminal
          </h1>
          <p className="text-xl md:text-2xl" style={{ color: 'var(--text-tertiary)' }}>
            Professional pricing & project management for tree services
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Step 01: Equipment */}
          <a href="/equipment" className="group">
            <div className="rounded-3xl p-8 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.3)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.15)'
                 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl">🚜</div>
                <span className="badge badge-success text-xs">Step 01</span>
              </div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Equipment</h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Track fleet costs and calculate hourly operating rates
              </p>
            </div>
          </a>

          {/* Step 02: Employees */}
          <a href="/employees" className="group">
            <div className="rounded-3xl p-8 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(59, 130, 246, 0.3)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.15)'
                 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl">👥</div>
                <span className="badge badge-info text-xs">Step 02</span>
              </div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Employees</h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Manage crew members and calculate true labor costs with burden
              </p>
            </div>
          </a>

          {/* Step 03: Loadouts */}
          <a href="/loadouts" className="group">
            <div className="rounded-3xl p-8 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(245, 158, 11, 0.3)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(245, 158, 11, 0.15)'
                 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl">🔧</div>
                <span className="badge badge-warning text-xs">Step 03</span>
              </div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Loadouts</h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Combine equipment and crew into job-ready configurations
              </p>
            </div>
          </a>

          {/* Step 04: Projects (NEW PRICING SYSTEM) */}
          <a href="/projects" className="group">
            <div className="rounded-3xl p-8 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.4)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 60px rgba(34, 197, 94, 0.25)'
                 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl">💰</div>
                <span className="badge badge-success text-xs font-bold">Step 04 • Pricing</span>
              </div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Price Projects
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Calculate accurate project quotes using inch-acres and profit margins
              </p>
            </div>
          </a>

          {/* Settings */}
          <a href="/settings" className="group">
            <div className="rounded-3xl p-8 transition-all duration-300 hover:scale-105"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(100, 116, 139, 0.3)',
                   backdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)'
                 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl">⚙️</div>
              </div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Settings</h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                App preferences and configuration
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
