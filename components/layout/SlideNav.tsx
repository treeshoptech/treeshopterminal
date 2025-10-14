'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
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
} from 'lucide-react';

interface SlideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SlideNav({ isOpen, onClose }: SlideNavProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  const links = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard', color: '#00FF41' },
    { href: '/equipment', icon: Truck, label: 'Equipment', color: '#00FF41' },
    { href: '/employees', icon: Users, label: 'Employees', color: '#00BFFF' },
    { href: '/loadouts', icon: Wrench, label: 'Loadouts', color: '#FFE500' },
    { href: '/projects', icon: FileText, label: 'Projects', color: '#00FF41' },
    { href: '/admin/invites', icon: Users, label: 'Invites', color: '#9333EA' },
    { href: '/settings', icon: Settings, label: 'Settings', color: '#999' },
  ];

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

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

            {/* Sign Out Button */}
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 active:scale-95"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  marginTop: '2rem',
                }}
              >
                <LogOut className="w-6 h-6" style={{ color: '#EF4444' }} />
                <span className="text-lg font-semibold" style={{ color: '#EF4444' }}>
                  Sign Out
                </span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
