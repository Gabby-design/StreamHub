'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { MOCK_CHANNELS } from '@/lib/mockData';
import {
  Home,
  Compass,
  Tv,
  Film,
  History,
  ThumbsUp,
  Clock,
  Sparkles,
  Layers,
  Moon,
  Info,
  Shield,
  PlaySquare,
  Radio,
  X,
  Menu,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, subscribedChannelIds } = useApp();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isWatchPage = pathname.startsWith('/watch/');

  const mainLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Live Streams', href: '/live', icon: Radio, isLive: true },
    { label: 'Anime & Movies', href: '/browse', icon: Film },
    { label: 'Trending', href: '/trending', icon: Compass },
    { label: 'Subscriptions', href: '/subscriptions', icon: Tv },
  ];

  const libraryLinks = [
    { label: 'Library', href: '/library', icon: Layers },
    { label: 'History', href: '/history', icon: History },
    { label: 'Liked Videos', href: '/liked', icon: ThumbsUp },
    { label: 'Watch Later', href: '/saved', icon: Clock },
  ];

  const subscribedChannels = Object.values(MOCK_CHANNELS).filter((ch) =>
    mounted ? subscribedChannelIds.includes(ch.id) : ['ch_blender', 'ch_tech'].includes(ch.id)
  );

  const renderNavItems = (isDrawer: boolean) => (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {/* Main Links */}
      <div className="space-y-1">
        {mainLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const showLabel = isDrawer || sidebarOpen;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (isDrawer) setSidebarOpen(false);
              }}
              className={`flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-150 ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              } ${!showLabel && 'justify-center px-0'}`}
              title={!showLabel ? item.label : undefined}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? 'text-indigo-400' : item.isLive ? 'text-rose-500 animate-pulse' : 'text-slate-400'
                }`}
              />
              {showLabel && (
                <span className="flex items-center justify-between flex-1">
                  <span>{item.label}</span>
                  {item.isLive && (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                      LIVE
                    </span>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Library Section */}
      <div className="border-t border-white/5 pt-4 space-y-1">
        {(isDrawer || sidebarOpen) && (
          <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Library
          </div>
        )}
        {libraryLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const showLabel = isDrawer || sidebarOpen;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (isDrawer) setSidebarOpen(false);
              }}
              className={`flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-150 ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              } ${!showLabel && 'justify-center px-0'}`}
              title={!showLabel ? item.label : undefined}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {showLabel && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Subscribed Channels */}
      {(isDrawer || sidebarOpen) && (
        <div className="border-t border-white/5 pt-4 space-y-2">
          <div className="flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Subscriptions</span>
            <span className="text-[10px] text-indigo-400 font-mono">
              {subscribedChannels.length}
            </span>
          </div>
          <div className="space-y-1">
            {subscribedChannels.map((channel) => (
              <Link
                key={channel.id}
                href={`/channel/${channel.handle.replace('@', '')}`}
                onClick={() => {
                  if (isDrawer) setSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition group"
              >
                <img
                  src={channel.avatarUrl}
                  alt={channel.name}
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-indigo-500"
                />
                <span className="truncate text-xs font-medium">{channel.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFooter = (isDrawer: boolean) => {
    if (isDrawer || sidebarOpen) {
      return (
        <div className="border-t border-white/5 p-4 text-[11px] text-slate-500 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Moon className="h-3.5 w-3.5 text-indigo-400" />
              Dark Theme (Active)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              v1.0 Ready
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-slate-500">
            <Link href="/" className="hover:text-slate-300">About</Link>
            <Link href="/" className="hover:text-slate-300">Press</Link>
            <Link href="/" className="hover:text-slate-300">Terms</Link>
            <Link href="/" className="hover:text-slate-300">Privacy</Link>
          </div>
          <p className="text-[10px] text-slate-600">StreamHub Inc. All rights reserved.</p>
        </div>
      );
    }
    return (
      <div className="border-t border-white/5 p-3 flex justify-center">
        <Moon className="h-4 w-4 text-slate-500" />
      </div>
    );
  };

  // On watch page: Always render as floating slide-out drawer with backdrop
  if (isWatchPage) {
    return (
      <>
        {/* Backdrop overlay */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden="true"
        />

        {/* Floating Slide-out Drawer */}
        <aside
          suppressHydrationWarning
          className={`fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col border-r border-white/10 bg-[#090a0f] shadow-2xl transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
          }`}
        >
          {/* Drawer Top Header with Logo and Close */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
                aria-label="Toggle Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2 group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 shadow-md">
                  <PlaySquare className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold text-white">
                  Stream<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Hub</span>
                </span>
              </Link>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {renderNavItems(true)}
          {renderFooter(true)}
        </aside>
      </>
    );
  }

  // On browse pages: Desktop docked sidebar + mobile slide-out drawer
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside
        suppressHydrationWarning
        className={`md:hidden fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col border-r border-white/10 bg-[#090a0f] shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              aria-label="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 shadow-md">
                <PlaySquare className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-white">
                Stream<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Hub</span>
              </span>
            </Link>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {renderNavItems(true)}
        {renderFooter(true)}
      </aside>

      {/* Desktop Docked Sidebar */}
      <aside
        suppressHydrationWarning
        className={`hidden md:flex fixed left-0 top-16 bottom-0 z-30 flex-col border-r border-white/5 bg-[#090a0f] transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {renderNavItems(false)}
        {renderFooter(false)}
      </aside>
    </>
  );
};
