'use client';

import React from 'react';
import Link from 'next/link';
import { Video } from '@/types';
import { useApp } from '@/context/AppContext';
import { CheckCircle } from 'lucide-react';

interface UpNextSidebarProps {
  currentVideoId: string;
}

export const UpNextSidebar: React.FC<UpNextSidebarProps> = ({ currentVideoId }) => {
  const { videos, autoplay, setAutoplay } = useApp();

  const relatedVideos = videos.filter((v) => v.id !== currentVideoId);

  const formatViews = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(0) + 'K';
    return count.toString();
  };

  return (
    <div className="w-full">
      {/* Autoplay Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
        <h3 className="text-sm font-bold text-white tracking-tight">Up Next</h3>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-xs text-slate-400">Autoplay</span>
          <div
            onClick={() => setAutoplay(!autoplay)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              autoplay ? 'bg-indigo-600' : 'bg-white/20'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                autoplay ? 'translate-x-4.5' : 'translate-x-1'
              }`}
            />
          </div>
        </label>
      </div>

      {/* Recommended Videos List */}
      <div className="space-y-3">
        {relatedVideos.map((video) => (
          <Link
            key={video.id}
            href={`/watch/${video.id}`}
            className="flex gap-3 group rounded-xl p-1.5 hover:bg-white/5 transition"
          >
            {/* Compact Thumbnail */}
            <div className="relative aspect-video w-36 sm:w-40 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 text-[10px] font-semibold text-white">
                {video.duration}
              </span>
              <span className="absolute top-1 right-1 rounded bg-indigo-600/90 border border-white/20 px-1 py-0.2 text-[9px] font-bold text-white shadow-sm">
                {video.resolution || (video.mediaType === 'movie' || video.category === 'Movies' ? '1080p' : '720p')}
              </span>
              {video.isHls && (
                <span className="absolute top-1 left-1 rounded bg-indigo-600/90 px-1 py-0.2 text-[9px] font-bold text-white uppercase">
                  HLS
                </span>
              )}
            </div>

            {/* Video Meta */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 line-clamp-2 leading-snug">
                {video.title}
              </h4>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                <span className="truncate">{video.channel.name}</span>
                {video.channel.isVerified && (
                  <CheckCircle className="h-3 w-3 text-indigo-400 flex-shrink-0" />
                )}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                <span className="text-emerald-400 font-semibold">{video.resolution || '1080p'}</span>
                <span>•</span>
                <span>{formatViews(video.views)} views</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
