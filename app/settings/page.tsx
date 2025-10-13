'use client';

import { useState, useEffect } from 'react';
import { Settings, User, Bell, Palette, Shield, LogOut, Smartphone, Download, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2"
              style={{
                color: '#111827',
                letterSpacing: '-0.02em'
              }}>
            Settings
          </h1>
          <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>
            Manage your account and app preferences
          </p>
        </div>

        {/* Account Section */}
        <div className="mb-6 rounded-2xl overflow-hidden"
             style={{
               background: '#FFFFFF',
               border: '1px solid #E5E7EB',
               boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
             }}>
          <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{
                     background: 'var(--gradient-brand)',
                     boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                   }}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#111827' }}>
                  Demo User
                </div>
                <div className="text-sm" style={{ color: '#6B7280' }}>
                  demo@treeshop.com
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* App Settings */}
        <div className="mb-6 rounded-2xl overflow-hidden"
             style={{
               background: '#FFFFFF',
               border: '1px solid #E5E7EB',
               boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
             }}>
          <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
              <h2 className="font-semibold" style={{ color: '#111827' }}>
                App Preferences
              </h2>
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" style={{ color: '#6B7280' }} />
                  <div>
                    <div className="font-medium" style={{ color: '#111827' }}>
                      Notifications
                    </div>
                    <div className="text-sm" style={{ color: '#6B7280' }}>
                      Get updates about your projects
                    </div>
                  </div>
                </div>
                <label className="relative inline-block w-12 h-6 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  />
                  <div
                    className="w-full h-full rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: notificationsEnabled ? 'var(--brand-500)' : 'rgba(255, 255, 255, 0.15)',
                      boxShadow: notificationsEnabled ? '0 0 12px rgba(34, 197, 94, 0.3)' : 'none'
                    }}
                  ></div>
                  <div
                    className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300"
                    style={{
                      transform: notificationsEnabled ? 'translateX(24px)' : 'translateX(0)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}
                  ></div>
                </label>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5" style={{ color: '#6B7280' }} />
                  <div>
                    <div className="font-medium" style={{ color: '#111827' }}>
                      Theme
                    </div>
                    <div className="text-sm" style={{ color: '#6B7280' }}>
                      {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, var(--bg-elevated) 0%, rgba(20, 20, 20, 0.95) 100%)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PWA Install */}
        <div className="rounded-2xl overflow-hidden"
             style={{
               background: '#FFFFFF',
               border: '1px solid #E5E7EB',
               boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
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
                <h3 className="font-semibold mb-1" style={{ color: '#111827' }}>
                  Install TreeShop App
                </h3>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                  Add to your home screen for quick access and offline support
                </p>
                <button
                  onClick={handleInstall}
                  disabled={!deferredPrompt}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all relative overflow-hidden"
                  style={{
                    background: deferredPrompt
                      ? 'var(--gradient-brand)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    color: deferredPrompt ? 'white' : 'var(--text-tertiary)',
                    boxShadow: deferredPrompt
                      ? '0 4px 12px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.2)'
                      : '0 2px 4px rgba(0, 0, 0, 0.2)',
                    cursor: deferredPrompt ? 'pointer' : 'not-allowed',
                    border: '1px solid',
                    borderColor: deferredPrompt ? 'transparent' : 'var(--border-default)'
                  }}
                  onMouseEnter={(e) => {
                    if (deferredPrompt) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (deferredPrompt) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.2)';
                    }
                  }}
                >
                  <Download className="w-4 h-4" />
                  {deferredPrompt ? 'Install App' : 'Already Installed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
