'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VideoGrid } from '@/components/feed/VideoGrid';
import { Clock, Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function WatchLaterPage() {
  const { videos, savedVideoIds } = useApp();

  const savedVideos = videos.filter((v) => savedVideoIds.includes(v.id));

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Watch Later</h1>
          <p className="text-xs text-slate-400">Bookmarked videos queued for your upcoming viewing sessions</p>
        </div>
      </div>

      {savedVideos.length > 0 ? (
        <VideoGrid videos={savedVideos} />
      ) : (
        <div className="text-center py-16">
          <Bookmark className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Your Queue is Empty</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Click Save on any video card to keep track of content you want to view later.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition"
          >
            Discover Videos
          </Link>
        </div>
      )}
    </div>
  );
}
