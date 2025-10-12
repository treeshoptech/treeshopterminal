'use client';

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(event.currentTarget);

    signIn("password", formData)
      .then(() => {
        // Redirect to home on success
        window.location.href = '/';
      })
      .catch((err) => {
        console.error('Auth error:', err);
        const message = flow === "signIn"
          ? "Could not sign in - check your email and password"
          : "Could not sign up - email may already be registered";
        setError(message);
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-canvas)' }}>
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full animate-pulse"
             style={{
               background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
               filter: 'blur(80px)'
             }} />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full animate-pulse"
             style={{
               background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
               filter: 'blur(80px)',
               animationDelay: '1s'
             }} />
      </div>

      <div className="relative max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
               style={{
                 background: 'var(--gradient-brand)',
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
            {flow === 'signIn' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
            {flow === 'signIn' ? 'Sign in to your TreeShop account' : 'Join TreeShop Terminal'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl overflow-hidden p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                border: '2px solid rgba(34, 197, 94, 0.2)',
                backdropFilter: 'blur(60px)',
                WebkitBackdropFilter: 'blur(60px)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.2)'
              }}>
          <div className="space-y-5">
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <input
                className="input-field"
                type="email"
                name="email"
                id="email"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input
                className="input-field"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required
                autoComplete={flow === "signIn" ? "current-password" : "new-password"}
              />
            </div>

            <input name="flow" value={flow} type="hidden" />

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
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--gradient-brand)',
                color: 'white',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
              }}>
              {submitting ? (flow === 'signUp' ? 'Creating account...' : 'Signing in...') : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{flow === 'signIn' ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setFlow(flow === "signIn" ? "signUp" : "signIn");
                setError('');
              }}
              className="text-sm hover:underline"
              style={{ color: 'var(--brand-400)' }}
            >
              {flow === "signIn"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
            <p className="text-xs mt-4" style={{ color: 'var(--text-quaternary)' }}>
              Access is by invitation only.
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-quaternary)' }}>
              Contact <span className="font-semibold" style={{ color: 'var(--brand-400)' }}>office@fltreeshop.com</span> to request access
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
