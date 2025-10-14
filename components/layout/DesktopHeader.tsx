'use client';

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
          Pricing System
        </h1>
      </Link>
    </header>
  );
}
