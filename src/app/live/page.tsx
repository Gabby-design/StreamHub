'use client';

import React, { useState } from 'react';
import { MOCK_LIVE_STREAMS } from '@/lib/mockData';
import { Video } from '@/types';
import { LivePlayerWithChat } from '@/components/live/LivePlayerWithChat';
import {
  Radio,
  Users,
  Flame,
  Sparkles,
  Tv,
  Gamepad2,
  Music,
  Film,
  Code2,
  Globe2,
  Calendar,
  Play,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function LiveHubPage() {
  const [selectedStream, setSelectedStream] = useState<Video>(MOCK_LIVE_STREAMS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    { label: 'All Channels', icon: Radio },
    { label: 'Anime', icon: Tv },
    { label: 'Gaming', icon: Gamepad2 },
    { label: 'Music', icon: Music },
    { label: 'Movies', icon: Film },
    { label: 'Tech', icon: Globe2 },
    { label: 'Coding', icon: Code2 },
  ];

  const filteredStreams = MOCK_LIVE_STREAMS.filter((stream) => {
    if (activeCategory === 'All' || activeCategory === 'All Channels') return true;
    return stream.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      stream.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()));
  });

  const totalLiveViewers = MOCK_LIVE_STREAMS.reduce(
    (acc, curr) => acc + (curr.liveViewers || 0),
    0
  );

  return (
    <div className="w-full min-h-screen bg-[#090a0f] text-slate-100 p-4 lg:p-8 space-y-10 max-w-[1920px] mx-auto">
      {/* Top Banner / Live Ticker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/50">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                StreamHub Live Broadcast
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                24/7 ON AIR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live marathons, esports arena, non-stop anime, and interactive community chat
            </p>
          </div>
        </div>

        {/* Global Live Telemetry */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 bg-[#11131a] px-3.5 py-1.5 rounded-xl border border-white/10 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-400">Live Channels:</span>
            <strong className="text-white font-mono">{MOCK_LIVE_STREAMS.length} Active</strong>
          </div>

          <div className="flex items-center gap-2 bg-[#11131a] px-3.5 py-1.5 rounded-xl border border-white/10 text-xs">
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-400">Global Viewers:</span>
            <strong className="text-rose-400 font-mono">
              {totalLiveViewers.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* Hero Featured Live Broadcast Stage with Real-Time Chat */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Featured Live Broadcast
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Direct 1080p 60FPS Low-Latency Feed
          </span>
        </div>

        <LivePlayerWithChat
          stream={selectedStream}
          allStreams={MOCK_LIVE_STREAMS}
          onSelectStream={(s) => setSelectedStream(s)}
        />
      </section>

      {/* Live Channels Directory Section */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>All 24/7 Live Channels</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10">
                {filteredStreams.length} Available
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Click any broadcast channel to switch the main stage or launch full player
            </p>
          </div>

          {/* Category Chips Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected =
                activeCategory === cat.label ||
                (cat.label === 'All Channels' && activeCategory === 'All');

              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40 border border-rose-400/30'
                      : 'bg-[#11131a] hover:bg-[#161924] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
          {filteredStreams.map((item) => {
            const isCurrent = selectedStream.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedStream(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group cursor-pointer rounded-2xl p-3 transition-all duration-200 flex flex-col ${
                  isCurrent
                    ? 'bg-gradient-to-b from-rose-600/15 to-[#11131a] border-2 border-rose-500 shadow-xl shadow-rose-950/40 scale-[1.02]'
                    : 'bg-[#11131a] hover:bg-[#161924] border border-white/5 hover:border-white/10'
                }`}
              >
                {/* Thumbnail Stage */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 mb-3 shadow-inner">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-2 inset-x-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-950/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                      LIVE
                    </span>

                    <span className="rounded-md bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-extrabold text-white border border-white/20">
                      {item.resolution || '1080p'}
                    </span>
                  </div>

                  {/* Bottom Viewers Ticker */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] font-bold text-rose-300 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-rose-500/20">
                    <Users className="h-3 w-3 text-rose-400" />
                    <span>{(item.liveViewers || 0).toLocaleString()} watching</span>
                  </div>

                  {/* Center Play Icon Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-2xs">
                    <div className="h-10 w-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl">
                      <Play className="h-5 w-5 ml-0.5 fill-white" />
                    </div>
                  </div>
                </div>

                {/* Content Info */}
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div className="flex items-start gap-2.5">
                    <img
                      src={item.channel.avatarUrl}
                      alt={item.channel.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-bold text-white line-clamp-2 group-hover:text-rose-400 transition">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.channel.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400">
                    <span className="rounded bg-white/5 px-2 py-0.5 text-slate-300 font-medium">
                      {item.category}
                    </span>
                    <span className="font-mono text-emerald-400">
                      {isCurrent ? 'Now Playing' : 'Click to Watch'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 24/7 Broadcast Schedule & Multi-Server Guarantee */}
      <section className="rounded-3xl bg-gradient-to-r from-rose-950/20 via-[#11131a] to-indigo-950/20 border border-white/10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400">
                Continuous 24/7 Global Infrastructure
              </h3>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Uninterrupted 1080p & 4K High Bitrate Broadcasts
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              StreamHub Live channels operate round-the-clock with multi-server failover redundant routing. If any stream server encounters latency, switch instantly via the player controls without missing a single second of the broadcast.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/browse"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition flex items-center gap-2"
            >
              <span>Explore Full VOD Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
