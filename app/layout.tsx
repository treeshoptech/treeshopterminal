import type { Metadata } from 'next';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';
import '../styles/design-system.css';
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
    <html lang="en">
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
