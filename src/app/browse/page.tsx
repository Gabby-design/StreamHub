'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Sparkles,
  Star,
  Film,
  Play,
  Tv,
  Clapperboard,
  Loader2,
} from 'lucide-react';

interface UnifiedMediaItem {
  id: string;
  title: string;
  posterUrl: string;
  year?: string | number;
  type: 'movie' | 'anime' | 'cartoon';
  score?: string | number;
  episodesCount?: number | string;
  genres?: string[];
  watchUrl: string;
  badge?: string;
}

const TYPE_TABS = [
  { id: 'all', label: 'All Media', icon: Sparkles },
  { id: 'movie', label: 'Movies', icon: Film },
  { id: 'anime', label: 'Anime', icon: Tv },
  { id: 'cartoon', label: 'Cartoons', icon: Clapperboard },
];

const GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Adventure',
  'Animation',
  'Comedy',
  'Fantasy',
  'Superhero',
  'Drama',
];

export default function BrowsePage() {
  const { addDiscoveredVideos } = useApp();
  const [items, setItems] = useState<UnifiedMediaItem[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'anime' | 'cartoon'>('all');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const results: UnifiedMediaItem[] = [];

        // 1. Fetch Anime from /api/anime
        const shouldFetchAnime = selectedType === 'all' || selectedType === 'anime';
        // 2. Fetch Movies from /api/movies
        const shouldFetchMovies = selectedType === 'all' || selectedType === 'movie';
        // 3. Fetch Cartoons from /api/movies
        const shouldFetchCartoons = selectedType === 'all' || selectedType === 'cartoon';

        const promises: Promise<any>[] = [];

        if (shouldFetchAnime) {
          const animeQuery = searchQuery.trim() ? `q=${encodeURIComponent(searchQuery.trim())}` : 'limit=18';
          promises.push(
            fetch(`/api/anime?${animeQuery}`)
              .then((r) => r.json())
              .then((data) => {
                if (data.videos) {
                  addDiscoveredVideos(data.videos);
                  return data.videos.map((v: any) => ({
                    id: v.id,
                    title: v.title.replace(' (English Sub/Dub)', ''),
                    posterUrl: v.thumbnailUrl,
                    year: v.createdAt,
                    type: 'anime' as const,
                    score: '8.8',
                    episodesCount: v.duration,
                    genres: ['Anime', 'Action', 'Shonen'],
                    watchUrl: v.id.startsWith('anime-') ? `/series/${v.id.replace('anime-', '')}` : `/watch/${v.id}`,
                    badge: 'SUB / DUB',
                  }));
                }
                return [];
              })
              .catch(() => [])
          );
        }

        if (shouldFetchMovies) {
          const movieParam = searchQuery.trim() ? `q=${encodeURIComponent(searchQuery.trim())}` : 'category=Movies';
          promises.push(
            fetch(`/api/movies?${movieParam}`)
              .then((r) => r.json())
              .then((data) => {
                if (data.videos) {
                  addDiscoveredVideos(data.videos);
                  return data.videos
                    .filter((v: any) => v.category === 'Movies')
                    .map((v: any) => ({
                      id: v.id,
                      title: v.title,
                      posterUrl: v.thumbnailUrl,
                      year: v.createdAt,
                      type: 'movie' as const,
                      score: v.rating || '8.2',
                      episodesCount: v.duration,
                      genres: v.tags || ['Movie', 'Action'],
                      watchUrl: `/watch/${v.id}`,
                      badge: 'HD 4K',
                    }));
                }
                return [];
              })
              .catch(() => [])
          );
        }

        if (shouldFetchCartoons) {
          const cartoonParam = searchQuery.trim() ? `q=${encodeURIComponent(searchQuery.trim())}` : 'category=Cartoons';
          promises.push(
            fetch(`/api/movies?${cartoonParam}`)
              .then((r) => r.json())
              .then((data) => {
                if (data.videos) {
                  addDiscoveredVideos(data.videos);
                  return data.videos
                    .filter((v: any) => v.category === 'Cartoons')
                    .map((v: any) => ({
                      id: v.id,
                      title: v.title,
                      posterUrl: v.thumbnailUrl,
                      year: v.createdAt,
                      type: 'cartoon' as const,
                      score: v.rating || '8.5',
                      episodesCount: v.duration,
                      genres: v.tags || ['Cartoons', 'Animation'],
                      watchUrl: `/watch/${v.id}`,
                      badge: 'ANIMATION',
                    }));
                }
                return [];
              })
              .catch(() => [])
          );
        }

        const resolvedArrays = await Promise.all(promises);
        const merged = resolvedArrays.flat();

        if (!isCancelled) {
          // Deduplicate by ID
          const seen = new Set<string>();
          const unique = merged.filter((item) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
          setItems(unique);
        }
      } catch {
        // Fallback
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    const timer = setTimeout(loadData, 300);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedType, searchQuery, addDiscoveredVideos]);

  const filteredItems = items.filter((item) => {
    if (selectedGenre === 'All') return true;
    return item.genres?.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()));
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            Global Streaming Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Browse Movies, Anime & Cartoons
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover Hollywood blockbusters, Saturday morning cartoons, and hit anime series in English Sub & Dub.
          </p>
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search movie, cartoon, or anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-[#11131a] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Main Filter Toolbar: Type Tabs + Genre Chips */}
      <div className="space-y-4">
        {/* Media Type Segmented Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TYPE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-[#11131a] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedGenre === genre
                  ? 'bg-white/20 text-white font-semibold'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/5'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading catalog from global media servers...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={item.watchUrl}
              className="group flex flex-col rounded-2xl bg-[#11131a]/60 hover:bg-[#141722] border border-white/5 hover:border-indigo-500/40 p-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
            >
              {/* Poster Card */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-900">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Score badge */}
                {item.score && (
                  <div className="absolute top-2 right-2 rounded-md bg-black/80 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    <span>{item.score}</span>
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-sm ${
                      item.type === 'anime'
                        ? 'bg-purple-600/90'
                        : item.type === 'cartoon'
                        ? 'bg-emerald-600/90'
                        : 'bg-indigo-600/90'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Audio or Format Badge */}
                {item.badge && (
                  <div className="absolute bottom-2 left-2">
                    <span className="rounded bg-black/80 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold text-slate-200 uppercase tracking-wider border border-white/10">
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Play Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="h-4 w-4 ml-0.5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="mt-2.5 flex-1 flex flex-col justify-between">
                <h3 className="line-clamp-2 text-xs font-semibold text-slate-200 group-hover:text-indigo-300 leading-snug">
                  {item.title}
                </h3>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{item.year || '2024'}</span>
                  <span>{item.episodesCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Film className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white">No Titles Found</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, genre filter, or media type tab.
          </p>
        </div>
      )}
    </div>
  );
}
