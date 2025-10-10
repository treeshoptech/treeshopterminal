'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const getOrCreateUser = useMutation(api.auth.getOrCreateUser);
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await getOrCreateUser({ email });
      localStorage.setItem('userEmail', email);
      router.push('/equipment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TreeShop Pricing</h1>
          <p className="text-gray-400">Enter your email to continue</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white dark:bg-gray-950 rounded-xl p-8 shadow-2xl">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
          <Button type="submit" className="w-full mt-6">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
