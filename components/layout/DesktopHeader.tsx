'use client';

import Link from 'next/link';
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from 'lucide-react';

export function DesktopHeader() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  return (
    <header
      className="hidden md:flex items-center justify-between px-8 py-4 border-b"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
        borderColor: 'var(--border-default)',
        backdropFilter: 'blur(60px)',
      }}
    >
      <Link href="/">
        <h1
          className="text-2xl font-black cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          TreeShop Terminal
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <LogOut className="w-4 h-4" style={{ color: '#EF4444' }} />
            <span className="text-sm font-semibold" style={{ color: '#EF4444' }}>
              Sign Out
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
