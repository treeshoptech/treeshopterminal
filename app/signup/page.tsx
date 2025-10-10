'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const signup = useMutation(api.auth.signup);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signup(formData);
      localStorage.setItem('userEmail', result.email);
      localStorage.setItem('orgId', result.orgId);
      router.push('/equipment');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            TreeShop Pricing
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSignup} className="rounded-3xl overflow-hidden p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                border: '2px solid rgba(34, 197, 94, 0.2)',
                backdropFilter: 'blur(60px)',
                WebkitBackdropFilter: 'blur(60px)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.2)'
              }}>
          <div className="space-y-5">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="input-field"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Company Name (Optional)</label>
              <input
                className="input-field"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="TreeShop Services"
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
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--gradient-brand)',
                color: 'white',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
              }}>
              {loading ? 'Creating account...' : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold" style={{ color: 'var(--brand-400)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
