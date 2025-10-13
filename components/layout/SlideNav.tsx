'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Truck,
  Users,
  Wrench,
  FileText,
  Settings,
  X,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';

interface SlideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SlideNav({ isOpen, onClose }: SlideNavProps) {
  const pathname = usePathname();
  const { user } = useUser();

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
          className="fixed inset-0 z-[80] transition-opacity duration-300"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        />
      )}

      {/* Slide-out Menu */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '320px',
          zIndex: 90,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s',
          background: '#1A1A1A',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div className="p-6">
          {/* User Profile Section */}
          <SignedIn>
            <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12",
                      userButtonTrigger: "focus:shadow-none",
                    },
                    baseTheme: "dark"
                  }}
                  afterSignOutUrl="/sign-in"
                />
                {user && (
                  <div className="flex-1">
                    <div className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm" style={{ color: '#999999' }}>
                      {user.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SignedIn>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <X className="w-6 h-6" style={{ color: '#CCCCCC' }} />
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
                    background: isActive ? `${link.color}20` : 'rgba(255,255,255,0.05)',
                    border: isActive ? `2px solid ${link.color}` : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className="w-6 h-6"
                      style={{ color: isActive ? link.color : '#999999' }}
                    />
                    <span
                      className="text-lg font-semibold"
                      style={{ color: isActive ? link.color : '#FFFFFF' }}
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
