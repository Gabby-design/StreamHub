'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AuthModal } from './AuthModal';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useApp();

  const isWatchPage = pathname.startsWith('/watch/');

  // Ensure sidebar drawer starts closed when navigating to watch page
  React.useEffect(() => {
    if (isWatchPage) {
      setSidebarOpen(false);
    }
  }, [isWatchPage, setSidebarOpen]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col">
      <Header />
      <AuthModal />
      <div className="flex flex-1 relative w-full max-w-full overflow-x-hidden">
        <Sidebar />

        <main
          className={`flex-1 w-full max-w-full min-w-0 transition-all duration-300 ease-in-out ${
            !isWatchPage ? (sidebarOpen ? 'md:ml-64' : 'md:ml-20') : 'ml-0'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
