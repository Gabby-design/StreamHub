'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AuthModal } from './AuthModal';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { sidebarOpen } = useApp();

  const isWatchPage = pathname.startsWith('/watch/');

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col">
      <Header />
      <AuthModal />
      <div className="flex flex-1 relative">
        {/* Do not show standard sidebar on watch page for maximum player screen real estate, unless user toggles */}
        {!isWatchPage && <Sidebar />}

        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            !isWatchPage ? (sidebarOpen ? 'md:ml-64' : 'md:ml-20') : 'ml-0'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
