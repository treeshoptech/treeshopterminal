'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Truck, Users, Wrench, FileText, Settings } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: LayoutDashboard, label: 'Home' },
    { href: '/equipment', icon: Truck, label: 'Equipment' },
    { href: '/employees', icon: Users, label: 'Team' },
    { href: '/loadouts', icon: Wrench, label: 'Loadouts' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom"
         style={{
           background: 'rgba(26, 26, 26, 0.98)',
           borderTop: '1px solid rgba(255,255,255,0.1)',
           backdropFilter: 'blur(20px)',
           WebkitBackdropFilter: 'blur(20px)',
           boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.8)'
         }}>
      <div className="flex items-center justify-around px-2 py-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
              style={{
                color: isActive ? '#00FF41' : '#999999',
                background: isActive ? 'rgba(0,255,65,0.15)' : 'transparent'
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
