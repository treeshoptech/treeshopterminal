'use client';

import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function SignInModal() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Only used for invite flow
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  // Check for invite code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite');
    if (code) {
      setInviteCode(code);
      setIsSignUp(true); // Auto-switch to sign-up mode
    }
  }, []);

  const invite = useQuery(
    api.invites.get,
    inviteCode ? { inviteCode } : 'skip'
  );

  // Pre-fill email from invite
  useEffect(() => {
    if (invite?.email && !email) {
      setEmail(invite.email);
    }
  }, [invite, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn("password", {
        email,
        password,
        flow: isSignUp ? "signUp" : "signIn"
      });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
         style={{
           background: 'rgba(0, 0, 0, 0.95)',
           backdropFilter: 'blur(20px)'
         }}>
      <div className="relative w-full max-w-md px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full animate-pulse"
               style={{
                 background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)',
                 filter: 'blur(80px)',
                 animationDuration: '4s'
               }} />
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full animate-pulse"
               style={{
                 background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.15) 40%, transparent 70%)',
                 filter: 'blur(80px)',
                 animationDuration: '6s',
                 animationDelay: '2s'
               }} />
        </div>

        {/* Header */}
        <div className="relative text-center mb-12">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                 style={{
                   background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                   boxShadow: '0 20px 60px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                 }}>
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <h1
            className="text-5xl font-black mb-3"
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}
          >
            TreeShop Terminal
          </h1>
          <p className="text-lg text-gray-400 mb-2">
            Professional pricing for tree service operations
          </p>
          {inviteCode && invite ? (
            <p className="text-sm text-green-500">
              You've been invited by {invite.companyName || 'TreeShop'}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              {isSignUp ? 'Create your account' : 'Sign in to continue'}
            </p>
          )}
        </div>

        {/* Sign In Form */}
        <div className="relative">
          <form onSubmit={handleSubmit}
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                  backdropFilter: 'blur(40px)',
                  border: '2px solid rgba(34, 197, 94, 0.2)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(34, 197, 94, 0.15)',
                  borderRadius: '24px',
                  padding: '48px 40px'
                }}>
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-white"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)'
                  }}
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-white"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)'
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
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </div>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mb-3">
              Protected by enterprise-grade security
            </p>
            {!inviteCode && (
              <a
                href="/apply"
                className="text-sm text-green-500 hover:text-green-400 font-semibold inline-block transition-colors"
              >
                Apply for Founding Membership →
              </a>
            )}
            {inviteCode && (
              <p className="text-xs text-gray-600">
                Welcome! Complete your account setup below
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
