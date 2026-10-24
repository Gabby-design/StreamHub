import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0b0b0c',
};

export const metadata: Metadata = {
  title: 'filmbox - Modern Dark Streaming Dashboard',
  description: 'High-performance cinema and series streaming dashboard with 4K HDR playback and personalized recommendations.',
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
          content="frame-src 'self' https://*.vidlink.pro https://vidlink.pro https://*.vidzee.wtf https://player.vidzee.wtf https://vidzee.wtf https://*.vidfast.pro https://vidfast.pro https://*.vidfast.vc https://vidfast.vc https://*.vidrock.to https://vidrock.to https://*.viduki.net https://www.viduki.net https://api.viduki.net https://viduki.net https://*.vidy.st https://www.vidy.st https://vidy.st https://*.autoembed.co https://autoembed.co https://*.player.autoembed.co https://player.autoembed.co https://*.vidsrc.to https://vidsrc.to https://*.vidsrc.me https://vidsrc.me https://*.vidsrc.sh https://vidsrc.sh https://*.vidsrc.cc https://vidsrc.cc https://*.embed.su https://embed.su https://*.multiembed.mov https://multiembed.mov https://*.streamingnow.mov https://streamingnow.mov https://*.2embed.cc https://2embed.cc https://*.youtube-nocookie.com https://www.youtube-nocookie.com https://*.youtube.com https://www.youtube.com;"
        />
        <link rel="preconnect" href="https://vidlink.pro" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vidlink.pro" />
        <link rel="preconnect" href="https://autoembed.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://autoembed.co" />
        <link rel="preconnect" href="https://vidfast.pro" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vidfast.pro" />
        <link rel="preconnect" href="https://vidsrc.cc" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vidsrc.cc" />
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
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
      <body className="antialiased bg-[#0b0b0c] text-zinc-100 selection:bg-[#E50914] selection:text-white">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
