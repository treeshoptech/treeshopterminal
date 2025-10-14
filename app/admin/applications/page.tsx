'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { RequireAuth } from '@/components/auth/RequireAuth';
import type { Id } from '@/convex/_generated/dataModel';
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Building,
  Briefcase,
  MessageSquare,
  Copy,
  ExternalLink,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminApplicationsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const applications = useQuery(api.applications.list, { status: selectedStatus }) || [];
  const approve = useMutation(api.applications.approve);
  const deny = useMutation(api.applications.deny);
  const remove = useMutation(api.applications.remove);

  const [expandedId, setExpandedId] = useState<Id<"applications"> | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<Id<"applications"> | null>(null);

  const handleApprove = async (id: Id<"applications">) => {
    setProcessing(id);
    try {
      const result = await approve({ id, reviewNotes: reviewNotes[id] });

      // Get application email
      const app = applications.find(a => a._id === id);
      if (app) {
        // Copy invite link to clipboard
        const inviteUrl = `${window.location.origin}?invite=${result.inviteCode}`;
        await navigator.clipboard.writeText(inviteUrl);
        alert(`Approved! Invite link copied to clipboard:\n${inviteUrl}\n\nSend this to ${app.email}`);
      }

      setExpandedId(null);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleDeny = async (id: Id<"applications">) => {
    if (!confirm('Are you sure you want to deny this application?')) return;

    setProcessing(id);
    try {
      await deny({ id, reviewNotes: reviewNotes[id] });
      setExpandedId(null);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: Id<"applications">) => {
    if (!confirm('Are you sure you want to permanently delete this application?')) return;

    try {
      await remove({ id });
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', color: '#F59E0B', icon: Clock },
      approved: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', color: '#22C55E', icon: CheckCircle },
      denied: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#EF4444', icon: XCircle },
    };

    const style = styles[status as keyof typeof styles];
    const Icon = style.icon;

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase"
            style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}>
        <Icon className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  return (
    <RequireAuth>
      <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-8">
              <Link
                href="/"
                className="group mt-1 p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
                  border: '1px solid var(--border-default)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                             style={{ color: 'var(--text-secondary)' }} />
              </Link>
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-black mb-2"
                    style={{
                      background: 'linear-gradient(180deg, var(--text-primary) 0%, rgba(255,255,255,0.8) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '-0.02em'
                    }}>
                  Membership Applications
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                  Review and approve founding member applications
                </p>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-3 mb-8">
            {['pending', 'approved', 'denied'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: selectedStatus === status ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)',
                  border: selectedStatus === status ? '2px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                  color: selectedStatus === status ? '#22C55E' : 'var(--text-secondary)'
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({applications.filter(a => a.status === status).length})
              </button>
            ))}
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
                 style={{
                   background: 'rgba(255,255,255,0.02)',
                   border: '1px solid var(--border-default)'
                 }}>
              <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-quaternary)', opacity: 0.5 }} />
              <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                No {selectedStatus} applications
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id}
                     className="rounded-2xl overflow-hidden transition-all"
                     style={{
                       background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                       border: '2px solid rgba(34, 197, 94, 0.2)',
                       boxShadow: expandedId === app._id ? '0 8px 32px rgba(34, 197, 94, 0.3)' : 'none'
                     }}>
                  {/* Application Header */}
                  <div className="p-6 cursor-pointer"
                       onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            {app.name}
                          </h3>
                          {getStatusBadge(app.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            <Mail className="w-4 h-4" />
                            {app.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            <Phone className="w-4 h-4" />
                            {app.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            <Building className="w-4 h-4" />
                            {app.companyName}
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            <Briefcase className="w-4 h-4" />
                            {app.businessType.replace('_', ' ')}
                          </div>
                        </div>

                        <p className="text-xs" style={{ color: 'var(--text-quaternary)' }}>
                          Applied {new Date(app.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === app._id && (
                    <div className="border-t px-6 py-5"
                         style={{ borderColor: 'var(--border-default)' }}>
                      {app.message && (
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                              Message
                            </h4>
                          </div>
                          <p className="text-sm p-3 rounded-lg"
                             style={{
                               background: 'rgba(0,0,0,0.3)',
                               color: 'var(--text-tertiary)'
                             }}>
                            {app.message}
                          </p>
                        </div>
                      )}

                      {app.referralSource && (
                        <div className="mb-5">
                          <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                            Referral Source
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            {app.referralSource}
                          </p>
                        </div>
                      )}

                      {app.status === 'pending' && (
                        <div className="mb-5">
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Review Notes (optional)
                          </label>
                          <textarea
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{
                              background: 'rgba(0,0,0,0.3)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'white'
                            }}
                            value={reviewNotes[app._id] || ''}
                            onChange={(e) => setReviewNotes({...reviewNotes, [app._id]: e.target.value})}
                            placeholder="Internal notes about this application..."
                          />
                        </div>
                      )}

                      {app.reviewNotes && (
                        <div className="mb-5 p-3 rounded-lg"
                             style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                          <h4 className="text-sm font-semibold mb-1" style={{ color: '#22C55E' }}>
                            Review Notes
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            {app.reviewNotes}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app._id)}
                              disabled={processing === app._id}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all"
                              style={{
                                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                                color: 'white',
                                opacity: processing === app._id ? 0.5 : 1,
                                cursor: processing === app._id ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <CheckCircle className="w-5 h-5" />
                              {processing === app._id ? 'Processing...' : 'Approve & Send Invite'}
                            </button>

                            <button
                              onClick={() => handleDeny(app._id)}
                              disabled={processing === app._id}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all"
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#EF4444',
                                opacity: processing === app._id ? 0.5 : 1,
                                cursor: processing === app._id ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <XCircle className="w-5 h-5" />
                              Deny
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(app._id)}
                          className="px-4 py-3 rounded-xl transition-all"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'var(--text-tertiary)'
                          }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
