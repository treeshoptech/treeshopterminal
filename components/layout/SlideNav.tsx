'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Truck,
  Users,
  Wrench,
  FileText,
  Settings,
  X,
  ChevronRight
} from 'lucide-react';

interface SlideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SlideNav({ isOpen, onClose }: SlideNavProps) {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard', color: '#00FF41' },
    { href: '/equipment', icon: Truck, label: 'Equipment', color: '#00FF41' },
    { href: '/employees', icon: Users, label: 'Employees', color: '#00BFFF' },
    { href: '/loadouts', icon: Wrench, label: 'Loadouts', color: '#FFE500' },
    { href: '/projects', icon: FileText, label: 'Projects', color: '#00FF41' },
    { href: '/settings', icon: Settings, label: 'Settings', color: '#999' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(0, 0, 0, 0.98) 100%)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <X className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 active:scale-95"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${link.color}20 0%, ${link.color}10 100%)`
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isActive
                      ? `1px solid ${link.color}40`
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className="w-6 h-6"
                      style={{ color: isActive ? link.color : 'var(--text-secondary)' }}
                    />
                    <span
                      className="text-lg font-semibold"
                      style={{ color: isActive ? link.color : 'var(--text-primary)' }}
                    >
                      {link.label}
                    </span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-5 h-5" style={{ color: link.color }} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
