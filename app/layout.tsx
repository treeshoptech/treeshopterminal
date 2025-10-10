import type { Metadata } from 'next';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';
import { Sidebar } from '@/components/layout/Sidebar';
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
      <body style={{ margin: 0, padding: 0 }}>
        <ConvexClientProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
