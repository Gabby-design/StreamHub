'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VideoCard } from '@/components/feed/VideoCard';
import Link from 'next/link';
import {
  Layers,
  History,
  ThumbsUp,
  Clock,
  ArrowRight,
  User,
} from 'lucide-react';

export default function LibraryPage() {
  const { user, watchHistory, videos, likedVideoIds, savedVideoIds } = useApp();

  const likedVideos = videos.filter((v) => likedVideoIds.includes(v.id));
  const savedVideos = videos.filter((v) => savedVideoIds.includes(v.id));

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-10">
      {/* Profile Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#11131a] to-pink-950/20 border border-white/5 p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {user ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-slate-400">
              <User className="h-8 w-8" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{user?.name || 'Guest Creator'}</h1>
            <p className="text-xs text-slate-400 font-mono">{user?.handle || '@guest'}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span>{watchHistory.length} History</span>
              <span>•</span>
              <span>{likedVideos.length} Liked</span>
              <span>•</span>
              <span>{savedVideos.length} Saved</span>
            </div>
          </div>
        </div>

        <Link
          href="/upload"
          className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition shadow-lg shadow-indigo-600/30"
        >
          Studio Upload
        </Link>
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">History</h2>
          </div>
          {watchHistory.length > 0 && (
            <Link
              href="/history"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>See all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {watchHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {watchHistory.slice(0, 4).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No recently played videos logged.</p>
        )}
      </div>

      {/* Watch Later Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Watch Later</h2>
          </div>
          {savedVideos.length > 0 && (
            <Link
              href="/saved"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>See all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {savedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {savedVideos.slice(0, 4).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No saved videos in queue.</p>
        )}
      </div>

      {/* Liked Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4 text-pink-400" />
            <h2 className="text-lg font-bold text-white">Liked Videos</h2>
          </div>
          {likedVideos.length > 0 && (
            <Link
              href="/liked"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>See all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {likedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {likedVideos.slice(0, 4).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No upvoted videos recorded.</p>
        )}
      </div>
    </div>
  );
}
