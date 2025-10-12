'use client';

import { useState } from 'react';
import { Settings, User, Bell, Palette, Shield, LogOut, Smartphone, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2"
              style={{
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em'
              }}>
            Settings
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-tertiary)' }}>
            Manage your account and app preferences
          </p>
        </div>

        {/* Account Section */}
        <div className="mb-6 rounded-2xl overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
               border: '2px solid var(--border-default)',
               backdropFilter: 'blur(60px)',
               boxShadow: 'var(--shadow-lg)'
             }}>
          <div className="p-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{
                     background: 'var(--gradient-brand)',
                     boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                   }}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Demo User
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  demo@treeshop.com
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* App Settings */}
        <div className="mb-6 rounded-2xl overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
               border: '2px solid var(--border-default)',
               backdropFilter: 'blur(60px)',
               boxShadow: 'var(--shadow-lg)'
             }}>
          <div className="p-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                App Preferences
              </h2>
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Notifications
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      Get updates about your projects
                    </div>
                  </div>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-full h-full rounded-full transition-colors peer-checked:bg-green-500 bg-gray-600"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                </label>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Theme
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      Dark mode enabled
                    </div>
                  </div>
                </div>
                <span className="badge badge-success">Default</span>
              </div>
            </div>
          </div>
        </div>

        {/* PWA Install */}
        <div className="rounded-2xl overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
               border: '2px solid rgba(34, 197, 94, 0.3)',
               backdropFilter: 'blur(60px)',
               boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)'
             }}>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{
                     background: 'var(--gradient-brand)',
                     boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                   }}>
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Install TreeShop App
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Add to your home screen for quick access and offline support
                </p>
                <button
                  onClick={handleInstall}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all"
                  style={{
                    background: 'white',
                    color: '#000',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <Download className="w-4 h-4" />
                  Install App
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
