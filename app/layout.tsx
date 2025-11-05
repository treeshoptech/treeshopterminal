import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';
import { AppShell } from '@/components/layout/AppShell';
import '../styles/design-system.css';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TreeShop Pricing Calculator',
  description: 'Professional pricing for forestry mulching, stump grinding, and land clearing services',
  manifest: '/manifest.json',
  themeColor: '#2196F3',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TreeShop',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
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
        <body className={inter.className}>
          <ConvexClientProvider>
            <AppShell>
              {children}
            </AppShell>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}