import type { Metadata } from 'next';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';
import { MobileNav } from '@/components/layout/MobileNav';
import '../styles/design-system.css';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'TreeShop Pricing System',
  description: 'Professional cost calculations for tree service operations',
  manifest: '/manifest.json',
  themeColor: '#22C55E',
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
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <div className="pb-20 md:pb-0">
            {children}
          </div>
          <MobileNav />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
