import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import NavigationBar from '@/components/page-sections/navigation-bar/navigation-bar';

import './globals.css';

export const metadata: Metadata = {
  title: 'Token Manager',
  description: 'An app to manage your crypto tokens.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <AppRouterCacheProvider>
          <NavigationBar />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
