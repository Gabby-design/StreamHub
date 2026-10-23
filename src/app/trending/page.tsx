'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VideoGrid } from '@/components/feed/VideoGrid';
import { Flame } from 'lucide-react';

export default function TrendingPage() {
  const { videos } = useApp();

  // Sort by view count for trending
  const trendingVideos = [...videos].sort((a, b) => b.views - a.views);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Trending Now</h1>
          <p className="text-xs text-slate-400">Most viewed and fastest-growing video streams today</p>
        </div>
      </div>

      <VideoGrid videos={trendingVideos} />
    </div>
  );
}
