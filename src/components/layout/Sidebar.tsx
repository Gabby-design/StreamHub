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
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, subscribedChannelIds } = useApp();

  const mainLinks = [
    { label: 'Home', href: '/', icon: Home },
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
    subscribedChannelIds.includes(ch.id)
  );

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 flex flex-col border-r border-white/5 bg-[#090a0f] transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-64' : 'w-20'
      } hidden md:flex`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Links */}
        <div className="space-y-1">
          {mainLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                } ${!sidebarOpen && 'justify-center px-0'}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-white/5 pt-4 space-y-1">
          {sidebarOpen && (
            <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Library
            </div>
          )}
          {libraryLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                } ${!sidebarOpen && 'justify-center px-0'}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Subscribed Channels */}
        {sidebarOpen && (
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

      {/* Footer Info & Dark Mode Indicator */}
      {sidebarOpen ? (
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
      ) : (
        <div className="border-t border-white/5 p-3 flex justify-center">
          <Moon className="h-4 w-4 text-slate-500" />
        </div>
      )}
    </aside>
  );
};
