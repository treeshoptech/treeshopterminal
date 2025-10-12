'use client';

import { useState } from 'react';
import { MobileNav } from './MobileNav';
import { SlideNav } from './SlideNav';
import { NavButton } from './NavButton';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider, useTheme } from './ThemeProvider';

function AppContent({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <div className="min-h-screen p-0 pb-20 md:pb-0"
           style={{ background: theme === 'dark' ? '#000000' : '#F5F5F5' }}>
        {children}
      </div>
      <ThemeToggle />
      <NavButton onClick={() => setNavOpen(true)} />
      <SlideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <MobileNav />
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppContent>{children}</AppContent>
    </ThemeProvider>
  );
}
