'use client';

import { useUser, useOrganization } from '@clerk/nextjs';
import { NavBar } from '@/components/ui/NavBar';
import { User, Building, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const { organization } = useOrganization();

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile & Settings</h1>

          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold">User Information</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{user?.fullName || 'Not set'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{user?.primaryEmailAddress?.emailAddress}</div>
                </div>
              </div>
            </div>

            {/* Organization Info */}
            {organization && (
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold">Organization</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Company Name</div>
                    <div className="font-medium">{organization.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Organization ID</div>
                    <div className="font-mono text-sm text-gray-600">{organization.id}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Default Settings */}
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold">Pricing Defaults</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Default Profit Margin</div>
                  <div className="font-medium">40%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Default Burden Multiplier</div>
                  <div className="font-medium">1.7x</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fuel Price</div>
                  <div className="font-medium">$3.75/gal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
