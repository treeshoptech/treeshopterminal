import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from '@/lib/auth';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'TreeShopTerminal - Professional Tree Service Management',
  description: 'Production-grade tree service operations platform with automated intelligence',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AuthProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
