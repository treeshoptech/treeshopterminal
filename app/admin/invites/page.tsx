'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { useConvexAuth } from "@convex-dev/auth/react";
import { Copy, Check, X } from 'lucide-react';

export default function AdminInvitesPage() {
  const { isAuthenticated } = useConvexAuth();
  const invites = useQuery(api.invites.list, isAuthenticated ? {} : 'skip');
  const createInvite = useMutation(api.invites.create);
  const revokeInvite = useMutation(api.invites.revoke);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createInvite({
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        companyName: companyName || undefined,
      });

      // Reset form
      setEmail('');
      setFirstName('');
      setLastName('');
      setCompanyName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (inviteCode: string) => {
    const link = `${window.location.origin}/?invite=${inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopied(inviteCode);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isAuthenticated) {
    return <div className="p-8">Please sign in to access admin panel</div>;
  }

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--bg-canvas)' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-8" style={{ color: 'var(--text-primary)' }}>
          User Invites
        </h1>

        {/* Create Invite Form */}
        <div className="mb-12 p-8 rounded-2xl"
             style={{
               background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
               border: '2px solid rgba(34, 197, 94, 0.2)',
             }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Create New Invite
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email *
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
                  placeholder="user@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)'
                  }}
                  placeholder="TreeShop LLC"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)'
                  }}
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)'
                  }}
                  placeholder="Doe"
                />
              </div>
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
              {loading ? 'Creating...' : 'Create Invite'}
            </button>
          </form>
        </div>

        {/* Invites List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            All Invites
          </h2>

          {invites?.map((invite) => (
            <div
              key={invite._id}
              className="p-6 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {invite.email}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: invite.status === 'accepted'
                          ? 'rgba(34, 197, 94, 0.2)'
                          : invite.status === 'revoked'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(251, 191, 36, 0.2)',
                        color: invite.status === 'accepted'
                          ? '#22C55E'
                          : invite.status === 'revoked'
                          ? '#EF4444'
                          : '#FBB F24'
                      }}
                    >
                      {invite.status}
                    </span>
                  </div>

                  {(invite.firstName || invite.lastName) && (
                    <p className="text-gray-400 mb-1">
                      {invite.firstName} {invite.lastName}
                    </p>
                  )}

                  {invite.companyName && (
                    <p className="text-gray-500 text-sm mb-3">
                      Company: {invite.companyName}
                    </p>
                  )}

                  <p className="text-gray-500 text-sm">
                    Created: {new Date(invite.createdAt).toLocaleDateString()}
                    {' • '}
                    Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>

                  {invite.status === 'pending' && (
                    <div className="mt-4 flex items-center gap-2">
                      <code className="px-3 py-2 bg-black/40 rounded-lg text-green-400 text-sm font-mono">
                        {window.location.origin}/?invite={invite.inviteCode}
                      </code>
                      <button
                        onClick={() => copyInviteLink(invite.inviteCode)}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        {copied === invite.inviteCode ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {invite.status === 'pending' && (
                  <button
                    onClick={() => revokeInvite({ inviteId: invite._id })}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {invites?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No invites yet. Create one above to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
