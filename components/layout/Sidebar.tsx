'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Truck,
  Users,
  Wrench,
  FileText,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import '@/styles/design-system.css';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Equipment',
    href: '/equipment',
    icon: Truck,
    badge: '01'
  },
  {
    label: 'Employees',
    href: '/employees',
    icon: Users,
    badge: '02'
  },
  {
    label: 'Loadouts',
    href: '/loadouts',
    icon: Wrench,
    badge: '03'
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FileText,
    badge: '04'
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b"
           style={{ borderColor: 'var(--border-default)' }}>
        <Link href="/" className="flex items-center gap-3 transition-opacity duration-300"
              style={{ opacity: isCollapsed ? 0 : 1 }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{
                 background: 'var(--gradient-brand)',
                 boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
               }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-black"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.01em'
                  }}>
                TreeShop
              </h1>
              <p className="text-xs font-medium" style={{ color: 'var(--text-quaternary)' }}>
                Pricing Terminal
              </p>
            </div>
          )}
        </Link>

        {/* Desktop Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex icon-btn icon-btn-sm group"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
            border: '1px solid var(--border-default)'
          }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                          style={{ color: 'var(--text-secondary)' }} />
          ) : (
            <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                         style={{ color: 'var(--text-secondary)' }} />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden icon-btn icon-btn-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
            border: '1px solid var(--border-default)'
          }}
        >
          <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hardware-accelerated"
                style={{
                  background: active
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)'
                    : 'transparent',
                  border: active
                    ? '1px solid rgba(34, 197, 94, 0.3)'
                    : '1px solid transparent',
                  color: active ? 'var(--brand-400)' : 'var(--text-secondary)',
                  transform: isCollapsed ? 'translateX(0)' : 'translateX(0)',
                  boxShadow: active
                    ? '0 4px 12px rgba(34, 197, 94, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.08)'
                    : 'none'
                }}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                       style={{
                         background: 'var(--gradient-brand)',
                         boxShadow: '0 0 12px rgba(34, 197, 94, 0.6)'
                       }} />
                )}

                {/* Icon Container */}
                <div className={`flex items-center justify-center transition-all duration-300 ${
                  isCollapsed ? 'w-full' : 'w-auto'
                }`}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                       style={{
                         background: active
                           ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)'
                           : 'transparent',
                         transform: active ? 'scale(1.05)' : 'scale(1)'
                       }}>
                    <Icon className="w-5 h-5 transition-all duration-300"
                          style={{
                            color: active ? 'var(--brand-400)' : 'var(--text-tertiary)',
                            filter: active ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))' : 'none'
                          }} />
                  </div>
                </div>

                {/* Label and Badge */}
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="font-semibold text-sm truncate transition-colors duration-300"
                          style={{
                            color: active ? 'var(--brand-400)' : 'var(--text-secondary)',
                            textShadow: active ? '0 0 20px rgba(34, 197, 94, 0.3)' : 'none'
                          }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold"
                            style={{
                              background: active
                                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)'
                                : 'rgba(255, 255, 255, 0.05)',
                              border: active
                                ? '1px solid rgba(34, 197, 94, 0.4)'
                                : '1px solid rgba(255, 255, 255, 0.08)',
                              color: active ? 'var(--brand-400)' : 'var(--text-quaternary)'
                            }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                     style={{
                       background: active
                         ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, transparent 100%)'
                         : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)'
                     }} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
        {!isCollapsed && (
          <div className="px-3 py-3 rounded-xl"
               style={{
                 background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 100%)',
                 border: '1px solid rgba(34, 197, 94, 0.15)'
               }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: 'var(--brand-400)' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2"
                      style={{ background: 'var(--brand-400)' }}></span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--brand-400)' }}>
                System Active
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-quaternary)' }}>
              All pricing formulas operational
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl glass"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(10, 10, 10, 0.8) 100%)',
          border: '1px solid var(--border-default)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}
      >
        <Menu className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-40 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          width: '280px',
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(5, 5, 5, 0.98) 100%)',
          borderRight: '1px solid var(--border-default)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)'
        }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col z-30 transition-all duration-300 hardware-accelerated flex-shrink-0"
        style={{
          width: isCollapsed ? '80px' : '280px',
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(5, 5, 5, 0.95) 100%)',
          borderRight: '1px solid var(--border-default)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
          boxShadow: '2px 0 16px rgba(0, 0, 0, 0.3)',
          transform: 'translateZ(0)',
          height: '100vh',
          position: 'sticky',
          top: 0
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
