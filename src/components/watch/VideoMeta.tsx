'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Video } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Bookmark,
  CheckCircle,
  Check,
  X,
  Copy,
} from 'lucide-react';

interface VideoMetaProps {
  video: Video;
}

export const VideoMeta: React.FC<VideoMetaProps> = ({ video }) => {
  const {
    likedVideoIds,
    dislikedVideoIds,
    toggleLike,
    toggleDislike,
    savedVideoIds,
    toggleWatchLater,
    subscribedChannelIds,
    toggleSubscribe,
  } = useApp();

  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const isLiked = likedVideoIds.includes(video.id);
  const isDisliked = dislikedVideoIds.includes(video.id);
  const isSaved = savedVideoIds.includes(video.id);
  const isSubscribed = subscribedChannelIds.includes(video.channel.id);

  const currentLikes = video.likes + (isLiked ? 1 : 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = video.videoUrl;
    link.download = `${video.title.replace(/\s+/g, '_')}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  return (
    <div className="mt-4">
      {/* Title & Tagline */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
          {video.title}
        </h1>
        {video.tagline && (
          <p className="mt-1 text-sm italic text-indigo-300/80 font-medium tracking-wide">
            &ldquo;{video.tagline}&rdquo;
          </p>
        )}
      </div>

      {/* TMDB Quick Stats & Badges Bar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {video.rating && (
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-300">
            <span>★</span>
            <span>{video.rating}</span>
            <span className="text-[10px] text-amber-400/70 font-normal">/ 10 TMDB</span>
          </div>
        )}

        <div className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300">
          <span>{video.createdAt || video.releaseDate}</span>
        </div>

        {video.duration && (
          <div className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300">
            <span>{video.duration}</span>
          </div>
        )}

        <div className="rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-1 text-xs font-bold text-indigo-300">
          {video.resolution || '1080p'} Full HD
        </div>

        {video.status && (
          <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-300">
            {video.status}
          </div>
        )}

        {video.collectionName && (
          <div className="rounded-lg bg-purple-500/15 border border-purple-500/30 px-2.5 py-1 text-xs font-semibold text-purple-300">
            Part of {video.collectionName}
          </div>
        )}

        {video.revenue && video.revenue > 0 && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs text-emerald-400">
            Box Office: ${(video.revenue / 1000000).toFixed(0)}M
          </div>
        )}
      </div>

      {/* Genres Chips */}
      {video.genres && video.genres.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {video.genres.map((g) => (
            <span
              key={g}
              className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Cast & Director Strip */}
      {(video.director || (video.cast && video.cast.length > 0)) && (
        <div className="mt-4 rounded-2xl bg-[#11131a]/80 border border-white/5 p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Top Cast & Crew
            </h4>
            {video.director && (
              <span className="text-xs text-slate-400">
                Directed by <strong className="text-white">{video.director.name}</strong>
              </span>
            )}
          </div>
          {video.cast && video.cast.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
              {video.cast.map((actor, idx) => (
                <div key={idx} className="flex items-center gap-2 flex-shrink-0 bg-white/5 rounded-xl p-1.5 pr-3 border border-white/5">
                  {actor.avatarUrl ? (
                    <img
                      src={actor.avatarUrl}
                      alt={actor.name}
                      className="h-9 w-9 rounded-lg object-cover bg-slate-800"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-lg bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                      {actor.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{actor.name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Channel info and Action Buttons Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        {/* Channel Details & Subscribe Button */}
        <div className="flex items-center gap-3">
          <Link href={`/channel/${video.channel.handle.replace('@', '')}`}>
            <img
              src={video.channel.avatarUrl}
              alt={video.channel.name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10 hover:ring-indigo-500 transition"
            />
          </Link>
          <div>
            <Link
              href={`/channel/${video.channel.handle.replace('@', '')}`}
              className="flex items-center gap-1.5 font-semibold text-white hover:text-indigo-400 transition"
            >
              <span>{video.channel.name}</span>
              {video.channel.isVerified && (
                <CheckCircle className="h-4 w-4 text-indigo-400" />
              )}
            </Link>
            <p className="text-xs text-slate-400">
              {isSubscribed ? 'Subscribed' : `${video.channel.subscribers} subscribers`}
            </p>
          </div>

          <button
            onClick={() => toggleSubscribe(video.channel.id)}
            className={`ml-3 rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition duration-150 ${
              isSubscribed
                ? 'bg-white/10 text-slate-300 hover:bg-white/15 border border-white/10'
                : 'bg-white text-black hover:bg-slate-200 shadow-md'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* Action Buttons: Like, Dislike, Share, Download, Save */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Like / Dislike Pill */}
          <div className="flex items-center rounded-full bg-white/5 border border-white/10 p-0.5">
            <button
              onClick={() => toggleLike(video.id)}
              className={`flex items-center gap-1.5 rounded-l-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isLiked
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{currentLikes.toLocaleString()}</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <button
              onClick={() => toggleDislike(video.id)}
              className={`rounded-r-full px-3 py-1.5 text-xs font-semibold transition ${
                isDisliked
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ThumbsDown className={`h-3.5 w-3.5 ${isDisliked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{downloadStarted ? 'Downloading...' : 'Download'}</span>
          </button>

          {/* Save / Watch Later Button */}
          <button
            onClick={() => toggleWatchLater(video.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
              isSaved
                ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border-white/10'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Description Box with Expandable text and hashtags */}
      <div className="mt-4 rounded-2xl bg-[#11131a] p-4 border border-white/5 text-sm text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-white text-xs mb-2">
          <span>{video.views.toLocaleString()} views</span>
          <span>•</span>
          <span>Released {video.releaseDate || video.createdAt}</span>
          <div className="flex gap-1.5 ml-2">
            {video.tags.map((tag) => (
              <span key={tag} className="text-indigo-400 hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <p className={`whitespace-pre-line leading-relaxed ${!isDescExpanded ? 'line-clamp-3' : ''}`}>
          {video.description}
        </p>

        <button
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="mt-2 text-xs font-bold text-slate-400 hover:text-white transition uppercase tracking-wider"
        >
          {isDescExpanded ? 'Show less' : '...more'}
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl glass-dropdown p-6 shadow-2xl border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">Share Video</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">Copy link to share this stream:</p>

            <div className="flex items-center gap-2 rounded-xl bg-black/50 border border-white/10 p-2">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="flex-1 bg-transparent text-xs text-slate-300 focus:outline-none font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
