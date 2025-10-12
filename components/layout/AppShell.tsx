'use client';

import { useState } from 'react';
import { MobileNav } from './MobileNav';
import { SlideNav } from './SlideNav';
import { NavButton } from './NavButton';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen p-6 md:p-10 pb-24 md:pb-10"
           style={{ background: '#0D0D0D' }}>
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl p-8 md:p-12"
               style={{
                 background: 'linear-gradient(135deg, rgba(25, 25, 25, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%)',
                 border: '1px solid rgba(255, 255, 255, 0.15)',
                 boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
               }}>
            {children}
          </div>
        </div>
      </div>
      <NavButton onClick={() => setNavOpen(true)} />
      <SlideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <MobileNav />
    </>
  );
}
