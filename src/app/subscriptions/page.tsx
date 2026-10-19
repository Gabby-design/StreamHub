'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VideoGrid } from '@/components/feed/VideoGrid';
import { Tv, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const { videos, subscribedChannelIds } = useApp();

  const subbedVideos = videos.filter((v) => subscribedChannelIds.includes(v.channel.id));

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Tv className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Subscriptions</h1>
          <p className="text-xs text-slate-400">Latest uploads from channels you follow</p>
        </div>
      </div>

      {subbedVideos.length > 0 ? (
        <VideoGrid videos={subbedVideos} />
      ) : (
        <div className="text-center py-16">
          <Sparkles className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">No Subscription Videos Yet</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Subscribe to your favorite creators to see their newest releases highlighted here.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition"
          >
            Explore Channels
          </Link>
        </div>
      )}
    </div>
  );
}
