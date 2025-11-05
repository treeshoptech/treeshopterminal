'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MobileNav } from './MobileNav';
import { SlideNav } from './SlideNav';
import { NavButton } from './NavButton';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  // Hide old navigation on homepage (calculator page)
  const isHomePage = pathname === '/';

  return (
    <>
      <div className="min-h-screen p-0 pb-20 md:pb-0"
           style={{ background: '#000000' }}>
        {children}
      </div>
      {!isHomePage && <NavButton onClick={() => setNavOpen(true)} />}
      {!isHomePage && <SlideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />}
      {!isHomePage && <MobileNav />}
    </>
  );
}
