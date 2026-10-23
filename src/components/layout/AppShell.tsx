'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AuthModal } from './AuthModal';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isWatchPage = pathname.startsWith('/watch/');

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-zinc-100 flex flex-col">
      <Header />
      <AuthModal />
      <div className="flex flex-1 relative w-full max-w-full overflow-x-hidden">
        <Sidebar />

        <main className="flex-1 w-full max-w-full min-w-0 transition-all duration-300 ease-in-out pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0 md:ml-20">
          {children}
        </main>
      </div>
    </div>
  );
};
