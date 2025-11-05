'use client';

import { useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import Image from 'next/image';

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn("password", { email, password, flow: "signIn" });
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="relative w-full max-w-md px-6">
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <div className="relative" style={{ width: '240px', height: '80px' }}>
              <Image
                src="/treeshop-logo.png"
                alt="TreeShop"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
          <p className="text-lg text-gray-400 mb-2">
            Professional pricing for tree service operations
          </p>
          <p className="text-sm text-gray-500">Sign in to continue</p>
        </div>

        <div
          className="p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
            backdropFilter: 'blur(40px)',
            border: '2px solid rgba(33, 150, 243, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '10px',
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '10px',
                }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '14px',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-98"
              style={{
                background: loading
                  ? 'rgba(33, 150, 243, 0.5)'
                  : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(33, 150, 243, 0.4)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo: Use any email and password to sign in
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
}
