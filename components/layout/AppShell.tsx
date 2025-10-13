'use client';

import { useState } from 'react';
import { MobileNav } from './MobileNav';
import { SlideNav } from './SlideNav';
import { NavButton } from './NavButton';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen p-0 pb-20 md:pb-0"
           style={{ background: '#000000' }}>
        {children}
      </div>
      <NavButton onClick={() => setNavOpen(true)} />
      <SlideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <MobileNav />
    </>
  );
}
