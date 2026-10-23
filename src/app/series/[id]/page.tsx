'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AnimeSeries, AnimeEpisode } from '@/types/anime';
import { getAnimeDetails } from '@/lib/animeApi';
import { StreamPlayer } from '@/components/player/StreamPlayer';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import {
  Star,
  Tv,
  Bookmark,
  Share2,
  Check,
  Play,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

export default function SeriesDetailPage() {
  const params = useParams();
  const seriesId = params?.id as string;

  const { savedVideoIds, toggleWatchLater } = useApp();

  const [series, setSeries] = useState<AnimeSeries | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<AnimeEpisode | null>(null);
  const [activeAudioTrack, setActiveAudioTrack] = useState<'sub' | 'dub'>('dub');
  const [isTheater, setIsTheater] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    queueMicrotask(() => {
      setIsLoading(true);
    });

    const loadSeries = async () => {
      try {
        const data = await getAnimeDetails(seriesId);
        if (!isCancelled) {
          if (data) {
            setSeries(data);
            if (data.episodes && data.episodes.length > 0) {
              setSelectedEpisode(data.episodes[0]);
            }
          }
        }
      } catch {
        // Handle error
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadSeries();
    return () => {
      isCancelled = true;
    };
  }, [seriesId]);

  // Window beforeunload guard against third-party ad script navigations
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h2 className="text-xl font-bold text-white mb-2">Anime Series Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          The requested anime catalog series is unavailable or does not exist.
        </p>
        <Link
          href="/browse"
          className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition"
        >
          Browse Anime Catalog
        </Link>
      </div>
    );
  }

  const isBookmarked = savedVideoIds.includes(series.id);

  return (
    <div className="w-full min-h-screen bg-[#090a0f] pb-16">
      {/* Player Section */}
      <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/browse"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Anime Catalog</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Playing: <strong className="text-white">{selectedEpisode ? `Episode ${selectedEpisode.number}` : 'Stream'}</strong>
            </span>
          </div>
        </div>

        {/* StreamPlayer Integration with Dual-Mode (HLS / Embed), Multi-Server & Sub/Dub Switcher */}
        {selectedEpisode && (
          <StreamPlayer
            src={selectedEpisode.streamUrl}
            dubSrc={selectedEpisode.dubStreamUrl}
            title={`${series.title} - ${selectedEpisode.title}`}
            englishTitle={`${series.titleEnglish} - ${selectedEpisode.title}`}
            poster={series.bannerUrl || selectedEpisode.thumbnailUrl}
            isHls={selectedEpisode.isHls}
            streamServers={selectedEpisode.streamServers}
            resolution={selectedEpisode.resolution || series.resolution || '1080p'}
            isTheater={isTheater}
            onToggleTheater={() => setIsTheater(!isTheater)}
            initialAudioTrack={activeAudioTrack}
            onAudioTrackChange={(track) => setActiveAudioTrack(track)}
          />
        )}
      </div>

      {/* Episode Selector Carousel */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mt-6">
        <div className="border-b border-white/5 pb-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tv className="h-4 w-4 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Episodes ({series.episodes.length})
            </h2>
          </div>
          <span className="text-xs text-indigo-400 font-mono">
            {activeAudioTrack === 'dub' ? 'English Dub Active' : 'English Sub Active'}
          </span>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {series.episodes.map((ep) => {
            const isSelected = selectedEpisode?.id === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => setSelectedEpisode(ep)}
                className={`group cursor-pointer rounded-xl p-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-2 border-indigo-500 shadow-lg shadow-indigo-950/40'
                    : 'bg-[#11131a] hover:bg-[#161924] border border-white/5'
                }`}
              >
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-900 mb-2">
                  <img
                    src={ep.thumbnailUrl}
                    alt={ep.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-5 w-5 text-white fill-white" />
                  </div>
                  {/* Resolution Badge */}
                  <span className="absolute top-1 right-1 rounded bg-indigo-600/90 backdrop-blur-md px-1.5 py-0.2 text-[9px] font-extrabold text-white tracking-wider border border-white/20 shadow-md">
                    {ep.resolution || series.resolution || '1080p'}
                  </span>
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 text-[9px] font-semibold text-white">
                    {ep.duration}
                  </span>
                </div>
                <h4 className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                  Ep. {ep.number}: {ep.title}
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* Series Detail & Synopsis */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mt-10">
        <div className="rounded-3xl bg-[#11131a] border border-white/5 p-6 sm:p-8 flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 sm:w-56 flex-shrink-0 mx-auto md:mx-0">
            <img
              src={series.posterUrl}
              alt={series.titleEnglish}
              className="w-full aspect-[3/4] rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {series.titleEnglish}
                </h1>
                {series.titleJapanese && (
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{series.titleJapanese}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWatchLater(series.id)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border transition ${
                    isBookmarked
                      ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 rounded-md bg-amber-500/20 text-amber-400 px-2 py-0.5 font-bold border border-amber-500/30">
                <Star className="h-3 w-3 fill-amber-400" />
                {series.score} Rating
              </span>
              <span className="rounded-md bg-emerald-500/15 text-emerald-400 px-2 py-0.5 font-bold border border-emerald-500/30">
                {series.resolution || '1080p'} Full HD
              </span>
              <span className="rounded-md bg-indigo-500/15 text-indigo-400 px-2 py-0.5 font-bold border border-indigo-500/30">
                Dual Audio (Sub & Dub)
              </span>
              <span className="rounded-md bg-white/5 text-slate-300 px-2 py-0.5 border border-white/10">
                {series.studio}
              </span>
              <span className="rounded-md bg-white/5 text-slate-300 px-2 py-0.5 border border-white/10">
                {series.year}
              </span>
              <span className="rounded-md bg-white/5 text-slate-300 px-2 py-0.5 border border-white/10">
                {series.status}
              </span>
              {series.genres.map((g) => (
                <span key={g} className="rounded-md bg-indigo-600/20 text-indigo-300 px-2 py-0.5 font-medium border border-indigo-500/30">
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Synopsis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {series.synopsis}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
