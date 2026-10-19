'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VideoGrid } from '@/components/feed/VideoGrid';
import { ThumbsUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LikedPage() {
  const { videos, likedVideoIds } = useApp();

  const likedVideos = videos.filter((v) => likedVideoIds.includes(v.id));

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
          <ThumbsUp className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Liked Videos</h1>
          <p className="text-xs text-slate-400">Streams you have upvoted and appreciated</p>
        </div>
      </div>

      {likedVideos.length > 0 ? (
        <VideoGrid videos={likedVideos} />
      ) : (
        <div className="text-center py-16">
          <ThumbsUp className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">No Liked Videos Yet</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Like videos while watching to build your personal favorite collection here.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition"
          >
            Explore Streams
          </Link>
        </div>
      )}
    </div>
  );
}
