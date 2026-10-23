'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Home,
  LayoutGrid,
  Users,
  Folder,
  Heart,
  Share2,
  MessageSquare,
  Clapperboard,
  Check,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { setSelectedCategory, setSearchQuery } = useApp();
  const [copiedShare, setCopiedShare] = useState(false);

  const isWatchPage = pathname.startsWith('/watch/');

  const handleShareClick = async () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: 'filmbox - Premium Streaming',
            url,
          });
          return;
        } catch {
          // Fallback to clipboard if share cancelled
        }
      }
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
      onClick: () => {
        setSearchQuery('');
        setSelectedCategory('All');
      },
    },
    {
      label: 'Browse / Grid',
      href: '/browse',
      icon: LayoutGrid,
      isActive: pathname === '/browse',
    },
    {
      label: 'Community',
      href: '/subscriptions',
      icon: Users,
      isActive: pathname === '/subscriptions',
    },
    {
      label: 'Library',
      href: '/library',
      icon: Folder,
      isActive: pathname === '/library' || pathname === '/history',
    },
    {
      label: 'Favorites',
      href: '/liked',
      icon: Heart,
      isActive: pathname === '/liked' || pathname === '/saved',
    },
    {
      label: 'Share',
      icon: Share2,
      isAction: true,
      onClick: handleShareClick,
      badgeText: copiedShare ? 'Copied!' : undefined,
    },
    {
      label: 'Live Chat',
      href: '/live',
      icon: MessageSquare,
      isActive: pathname === '/live',
    },
  ];

  return (
    <>
      {/* Desktop Slim Icon Sidebar (Left, w-20 fixed) */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-20 flex-col items-center justify-between py-5 bg-[#0b0b0c] border-r border-white/10 transition-transform duration-300 ${
          isWatchPage ? 'md:translate-x-0' : ''
        }`}
      >
        {/* Brand Logo Icon at Top */}
        <div className="flex flex-col items-center">
          <Link
            href="/"
            className="group flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E50914] to-[#990000] text-white shadow-[0_0_20px_rgba(229,9,20,0.45)] hover:scale-105 transition-all duration-200"
            title="filmbox - Home"
          >
            <Clapperboard className="h-5 w-5 text-white transition-transform group-hover:rotate-6" />
          </Link>
        </div>

        {/* Vertical Icon Navigation Stack */}
        <nav className="flex flex-col items-center gap-3 w-full px-3">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = item.isActive;

            if (item.isAction) {
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                    copiedShare
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                  aria-label={item.label}
                >
                  {copiedShare ? (
                    <Check className="h-5 w-5 text-emerald-400 animate-pulse" />
                  ) : (
                    <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  )}

                  {/* Tooltip on hover */}
                  <span className="pointer-events-none absolute left-full ml-3 rounded-lg bg-[#18181b] border border-white/10 px-2.5 py-1 text-xs font-semibold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                    {item.badgeText || item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.href || idx}
                href={item.href || '/'}
                onClick={item.onClick}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                  active
                    ? 'bg-white/[0.08] text-[#E50914] border border-[#E50914]/40 shadow-[0_0_18px_rgba(229,9,20,0.35)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
                aria-label={item.label}
              >
                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? 'text-[#E50914]' : ''}`} />

                {/* Active indicator dot */}
                {active && (
                  <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#E50914] rounded-r-full shadow-[0_0_8px_#E50914]" />
                )}

                {/* Tooltip on hover */}
                <span className="pointer-events-none absolute left-full ml-3 rounded-lg bg-[#18181b] border border-white/10 px-2.5 py-1 text-xs font-semibold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Dot or Status */}
        <div className="flex flex-col items-center">
          <div
            className="h-9 w-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-300 hover:border-[#E50914]/50 transition cursor-pointer"
            title="filmbox v2.0"
          >
            <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Fixed for phone screens with iOS safe-area) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0b0c]/95 backdrop-blur-xl border-t border-white/10 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around">
        {navItems.slice(0, 5).map((item, idx) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={idx}
              href={item.href || '/'}
              onClick={item.onClick}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs ${
                active ? 'text-[#E50914]' : 'text-zinc-400'
              }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>
    </>
  );
};
