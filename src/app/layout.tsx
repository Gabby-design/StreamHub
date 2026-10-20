import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#090a0f',
};

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
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-src 'self' https://*.vidlink.pro https://vidlink.pro https://*.autoembed.co https://autoembed.co https://*.vidsrc.cc https://vidsrc.cc https://*.embed.su https://embed.su https://*.multiembed.mov https://multiembed.mov https://*.vidfast.pro https://vidfast.pro https://*.vidsrc.me https://vidsrc.me https://*.vidsrc.to https://vidsrc.to https://*.2embed.cc https://2embed.cc https://*.youtube-nocookie.com https://www.youtube-nocookie.com https://*.youtube.com https://www.youtube.com;"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var originalOpen = window.open;
                  window.open = function() {
                    var path = window.location.pathname || '';
                    if (path.indexOf('/watch') === 0 || path.indexOf('/series') === 0) {
                      console.warn('[StreamHub Shield] Neutralized popup window.open attempt on player page.');
                      return null;
                    }
                    return originalOpen ? originalOpen.apply(this, arguments) : null;
                  };
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[#090a0f] text-slate-100 selection:bg-indigo-500 selection:text-white">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
