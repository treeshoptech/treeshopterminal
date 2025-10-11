'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const login = useMutation(api.auth.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoggingIn(true);

    try {
      // Check whitelist
      const approved = await fetch('/api/check-whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then(r => r.json());

      if (!approved.isApproved) {
        setError('This email is not approved. Contact office@fltreeshop.com for access.');
        setLoggingIn(false);
        return;
      }

      const result = await login({ email });
      localStorage.setItem('userEmail', result.email);
      localStorage.setItem('orgId', result.orgId);
      window.location.reload(); // Force full page reload to re-check auth
    } catch (err: any) {
      setError(err.message || 'Login failed. Contact office@fltreeshop.com for access.');
    } finally {
      setLoggingIn(false);
    }
  };

  // Show login modal if not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ background: '#000' }}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                   style={{
                     background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                     boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)'
                   }}>
                <span className="text-white font-black text-2xl">T</span>
              </div>
              <h1 className="text-4xl font-black mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                Sign In Required
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                Enter your email to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="rounded-3xl overflow-hidden p-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                    border: '2px solid rgba(34, 197, 94, 0.2)',
                    backdropFilter: 'blur(60px)',
                    WebkitBackdropFilter: 'blur(60px)',
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.2)'
                  }}>
              <div className="space-y-5">
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input
                    className="input-field"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoFocus
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl"
                       style={{
                         background: 'rgba(239, 68, 68, 0.1)',
                         border: '1px solid rgba(239, 68, 68, 0.3)',
                         color: '#F87171'
                       }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'var(--gradient-brand)',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                  }}>
                  {loggingIn ? 'Signing in...' : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs" style={{ color: 'var(--text-quaternary)' }}>
                  Access is by invitation only.
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-quaternary)' }}>
                  Contact <span className="font-semibold" style={{ color: 'var(--brand-400)' }}>office@fltreeshop.com</span> for access
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-canvas)' }}>
        <div className="w-16 h-16 border-4 border-t-green-500 border-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
