import type { Metadata } from 'next';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { MobileNav } from '@/components/layout/MobileNav';
import '../styles/design-system.css';
import '../styles/globals.css';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
        <ConvexProvider client={convex}>
          <div className="pb-20 md:pb-0">
            {children}
          </div>
          <MobileNav />
        </ConvexProvider>
      </body>
    </html>
  );
}
