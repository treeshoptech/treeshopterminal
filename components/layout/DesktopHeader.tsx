'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export function DesktopHeader() {
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
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-10 h-10',
            },
            variables: {
              colorPrimary: '#22C55E',
            },
          }}
          afterSignOutUrl="/sign-in"
        />
      </div>
    </header>
  );
}
