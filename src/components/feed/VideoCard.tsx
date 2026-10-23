'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Video } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  Star,
  Plus,
  Check,
  Play,
  Crown,
  Share2,
} from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { toggleWatchLater, savedVideoIds } = useApp();
  const [copied, setCopied] = useState(false);

  const isSaved = savedVideoIds.includes(video.id);
  const displayRating = video.rating || (video.mediaType === 'movie' ? '4.7' : '4.5');
  const displayYear =
    video.createdAt && video.createdAt.length === 4
      ? video.createdAt
      : video.releaseDate?.slice(0, 4) || '2024';

  const posterImage =
    video.posterUrl && !video.posterUrl.includes('splash.png')
      ? video.posterUrl
      : video.thumbnailUrl;

  const [hasError, setHasError] = useState(false);
  const [prevPoster, setPrevPoster] = useState(posterImage);
  if (prevPoster !== posterImage) {
    setPrevPoster(posterImage);
    setHasError(false);
  }

  const currentImgSrc = hasError
    ? video.thumbnailUrl && posterImage !== video.thumbnailUrl
      ? video.thumbnailUrl
      : 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg'
    : posterImage;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/watch/${video.id}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Watch ${video.title} on filmbox`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard if share modal was closed
      }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchLater(video.id);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#E50914]/40 p-2.5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/90">
      {/* Sleek Vertical 2:3 Aspect Ratio Poster */}
      <Link
        href={`/watch/${video.id}`}
        className="relative block aspect-[2/3] w-full overflow-hidden rounded-xl bg-zinc-900 shadow-md"
      >
        <img
          src={currentImgSrc}
          alt={video.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            setHasError(true);
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Bottom Gradient on Poster */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
          {/* Subscription pill on left */}
          <span className="flex items-center gap-1 rounded-full bg-black/65 backdrop-blur-md border border-amber-400/30 px-2 py-0.5 text-[10px] font-bold text-amber-400 shadow-sm pointer-events-auto">
            <Crown className="h-2.5 w-2.5" />
            Subscription
          </span>

          {/* '+' icon on top right */}
          <button
            onClick={handleWatchlist}
            className={`h-7 w-7 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 pointer-events-auto shadow-sm ${
              isSaved
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-black/65 hover:bg-[#E50914] text-white border-white/20 hover:border-transparent'
            }`}
            title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
            aria-label="Toggle Watchlist"
          >
            {isSaved ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Hover / Active Reveal Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/40 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <p className="text-[11px] text-zinc-300 line-clamp-3 leading-relaxed mb-3">
            {video.description}
          </p>

          <div className="flex items-center gap-2">
            {/* Mini Red CTA ("Watch Now") */}
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold shadow-[0_0_15px_rgba(229,9,20,0.5)] transition">
              <Play className="h-3 w-3 fill-white" />
              <span>Watch Now</span>
            </div>

            {/* Quick Share Icon */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition"
              title={copied ? 'Link Copied!' : 'Share Video'}
              aria-label="Share Video"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Link>

      {/* Bottom Card Metadata */}
      <div className="mt-2.5 flex flex-col flex-1 justify-between">
        {/* Rating & Release Year */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{displayRating}</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">{displayYear}</span>
        </div>

        {/* Movie Title */}
        <Link
          href={`/watch/${video.id}`}
          className="mt-1 text-sm font-bold text-white group-hover:text-[#E50914] transition-colors line-clamp-1"
          title={video.title}
        >
          {video.title}
        </Link>

        {/* Genre / Subtitle */}
        <span className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
          {video.genres?.slice(0, 2).join(', ') || video.category || 'Cinema'}
        </span>
      </div>
    </div>
  );
};
