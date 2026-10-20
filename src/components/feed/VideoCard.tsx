'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Video } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  CheckCircle,
  MoreVertical,
  Clock,
  ListPlus,
  Share2,
  Check,
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { toggleWatchLater, savedVideoIds, addToQueue } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isSaved = savedVideoIds.includes(video.id);

  const isDirectMp4 =
    !video.isHls &&
    !video.videoUrl.startsWith('youtube:') &&
    !video.videoUrl.includes('youtube.com') &&
    !video.videoUrl.includes('youtu.be') &&
    (video.videoUrl.endsWith('.mp4') || video.videoUrl.includes('.mp4?'));

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && isDirectMp4) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowMenu(false);
    if (videoRef.current && isDirectMp4) {
      videoRef.current.pause();
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/watch/${video.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(0) + 'K';
    return count.toString();
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col rounded-2xl bg-[#11131a]/60 hover:bg-[#141722] border border-white/5 hover:border-indigo-500/30 p-2.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
    >
      {/* Thumbnail and Hover Preview */}
      <Link href={`/watch/${video.id}`} className="relative block aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            isHovered && isDirectMp4 ? 'opacity-0' : 'opacity-100 group-hover:scale-105 transition-transform duration-300'
          }`}
        />

        {/* Video short loop preview on hover for direct MP4 sources only */}
        {isDirectMp4 && (
          <video
            ref={videoRef}
            src={video.videoUrl}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 rounded-md bg-black/85 px-1.5 py-0.5 text-[11px] font-semibold text-white tracking-wider backdrop-blur-sm">
          {formatDuration(video.duration, video.durationSec)}
        </div>

        {/* Resolution badge (1080p / 720p / 4K) */}
        <div className="absolute top-2 right-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-2 py-0.5 text-[10px] font-bold text-white tracking-wider backdrop-blur-md shadow-lg shadow-indigo-950/50 flex items-center gap-1 border border-white/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {video.resolution || (video.mediaType === 'movie' || video.category === 'Movies' ? '1080p' : '720p')}
        </div>

        {/* Media Type / Format badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          {video.isLive ? (
            <div className="rounded-md bg-red-600/90 border border-red-400/40 px-2 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase backdrop-blur-sm flex items-center gap-1 shadow-lg shadow-red-950/60">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              LIVE
            </div>
          ) : video.isHls ? (
            <div className="rounded-md bg-indigo-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase backdrop-blur-sm">
              HLS 4K
            </div>
          ) : video.mediaType === 'movie' || video.category === 'Movies' ? (
            <div className="rounded-md bg-purple-600/90 border border-purple-400/30 px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase backdrop-blur-sm">
              Full Movie
            </div>
          ) : video.mediaType === 'anime' || video.category === 'Anime' ? (
            <div className="rounded-md bg-sky-600/90 border border-sky-400/30 px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase backdrop-blur-sm">
              Full Series
            </div>
          ) : video.mediaType === 'cartoon' || video.category === 'Cartoons' ? (
            <div className="rounded-md bg-emerald-600/90 border border-emerald-400/30 px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase backdrop-blur-sm">
              Full Show
            </div>
          ) : null}
        </div>
      </Link>

      {/* Video Metadata */}
      <div className="mt-3 flex items-start gap-3">
        {/* Channel Avatar */}
        <Link
          href={`/channel/${video.channel.handle.replace('@', '')}`}
          className="flex-shrink-0"
        >
          <img
            src={video.channel.avatarUrl}
            alt={video.channel.name}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 hover:ring-indigo-500 transition"
          />
        </Link>

        {/* Content details */}
        <div className="flex-1 min-w-0">
          <Link href={`/watch/${video.id}`} className="block">
            <h3 className="line-clamp-2 text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug">
              {video.title}
            </h3>
          </Link>

          <Link
            href={`/channel/${video.channel.handle.replace('@', '')}`}
            className="mt-1 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <span className="truncate">{video.channel.name}</span>
            {video.channel.isVerified && (
              <CheckCircle className="h-3 w-3 text-indigo-400 flex-shrink-0" />
            )}
          </Link>

          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.2 text-[10px] font-bold text-indigo-300">
              {video.resolution || '1080p'} Full HD
            </span>
            <span>•</span>
            <span className="text-slate-500">{formatViews(video.views)} views</span>
            <span>•</span>
            <span className="text-slate-500">{video.createdAt}</span>
          </div>
        </div>

        {/* Quick Actions Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white transition opacity-0 group-hover:opacity-100"
            aria-label="Video options"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-44 rounded-xl glass-dropdown p-1.5 shadow-2xl z-30 animate-in fade-in duration-150">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToQueue(video);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 rounded-lg transition"
              >
                <ListPlus className="h-3.5 w-3.5 text-indigo-400" />
                Add to Queue
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWatchLater(video.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 rounded-lg transition"
              >
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                {isSaved ? 'Remove Saved' : 'Save to Watch Later'}
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 rounded-lg transition"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-indigo-400" />
                    Share Video
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
