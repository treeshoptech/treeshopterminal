'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage() {
  const submit = useMutation(api.applications.submit);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    businessType: '',
    businessTypeOther: '',
    referralSource: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await submit(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
           style={{ background: 'var(--bg-canvas)' }}>
        <div className="max-w-lg w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
                 style={{
                   background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                   boxShadow: '0 20px 60px rgba(34, 197, 94, 0.4)'
                 }}>
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-black mb-4"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            Application Received!
          </h1>

          <p className="text-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
            Thank you for applying to TreeShop Terminal
          </p>

          <p className="text-lg mb-8" style={{ color: 'var(--text-tertiary)' }}>
            We'll review your application and get back to you within 24-48 hours via email.
          </p>

          <Link href="/">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                      color: 'white',
                      boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)'
                    }}>
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
         style={{ background: 'var(--bg-canvas)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full"
             style={{
               background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 40%, transparent 70%)',
               filter: 'blur(80px)'
             }} />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
             style={{
               background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.1) 40%, transparent 70%)',
               filter: 'blur(80px)'
             }} />
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                 style={{
                   background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                   boxShadow: '0 20px 60px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                 }}>
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-black mb-3"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
            Join TreeShop Terminal
          </h1>

          <p className="text-xl mb-2" style={{ color: 'var(--text-secondary)' }}>
            Apply for Founding Membership
          </p>

          <p className="text-base" style={{ color: 'var(--text-tertiary)' }}>
            Professional pricing software for tree service operations
          </p>
        </div>

        {/* Application Form */}
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

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              Business Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="ABC Tree Service"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Business Type *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                >
                  <option value="">Select business type...</option>
                  <option value="tree_service">Tree Service</option>
                  <option value="landscaping">Landscaping</option>
                  <option value="arborist">Arborist / Tree Care</option>
                  <option value="land_clearing">Land Clearing</option>
                  <option value="forestry">Forestry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {formData.businessType === 'other' && (
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Please Specify
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    value={formData.businessTypeOther}
                    onChange={(e) => setFormData({ ...formData, businessTypeOther: e.target.value })}
                    placeholder="Describe your business type"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              Tell Us More
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  How did you hear about us?
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                  value={formData.referralSource}
                  onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                >
                  <option value="">Select one...</option>
                  <option value="google">Google Search</option>
                  <option value="social">Social Media</option>
                  <option value="referral">Referral</option>
                  <option value="industry">Industry Event</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Why do you want to join TreeShop Terminal?
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl resize-none"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your pricing challenges, what you're looking for in software, etc."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
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
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-tertiary)' }}>
            Already have an account?{' '}
            <Link href="/" className="text-green-500 hover:text-green-400 font-semibold">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
