'use client';

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetupPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn("password", {
        email,
        password,
        flow: "signUp"
      });

      // Redirect to admin applications after successful signup
      router.push('/admin/applications');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'var(--bg-canvas)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            Admin Setup
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            One-time admin account creation
          </p>
        </div>

        <form onSubmit={handleSubmit}
              className="p-8 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                backdropFilter: 'blur(40px)',
                border: '2px solid rgba(34, 197, 94, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}>
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
                placeholder="treeshoptech@icloud.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-lg"
              style={{
                background: loading ? '#666' : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </div>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-quaternary)' }}>
          This page will be removed after setup
        </p>
      </div>
    </div>
  );
}
