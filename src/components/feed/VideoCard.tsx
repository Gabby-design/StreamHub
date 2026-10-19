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
          {video.duration}
        </div>

        {/* HLS Stream badge if applicable */}
        {video.isHls && (
          <div className="absolute top-2 left-2 rounded-md bg-indigo-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase backdrop-blur-sm">
            HLS
          </div>
        )}
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

          <div className="mt-1 flex items-center text-xs text-slate-500 gap-1.5">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{video.createdAt}</span>
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
