'use client';

import { Authenticated, Unauthenticated } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <RedirectToLogin />
      </Unauthenticated>
    </>
  );
}

function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-canvas)' }}>
      <div className="w-16 h-16 border-4 border-t-green-500 border-gray-800 rounded-full animate-spin"></div>
    </div>
  );
}
