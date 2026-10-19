import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'StreamHub - Modern Video Streaming and Sharing Platform',
  description: 'High-performance video streaming with HLS adaptive bitrate, interactive channels, and studio upload.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#090a0f] text-slate-100 selection:bg-indigo-500 selection:text-white">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
