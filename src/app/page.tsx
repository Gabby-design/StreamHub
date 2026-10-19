'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { CategoryPills } from '@/components/feed/CategoryPills';
import { VideoGrid } from '@/components/feed/VideoGrid';
import { Video } from '@/types';
import { Sparkles, Loader2 } from 'lucide-react';

export default function HomePage() {
  const { videos, selectedCategory, searchQuery, addDiscoveredVideos } = useApp();
  const [onlineVideos, setOnlineVideos] = useState<Video[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  // Dynamic online catalog search across anime, movies, and cartoons
  useEffect(() => {
    let isCancelled = false;

    const fetchLiveCatalog = async () => {
      const isAnimeFilter =
        selectedCategory === 'Anime' ||
        selectedCategory === 'English Dub' ||
        selectedCategory === 'English Sub';

      const isMovieFilter = selectedCategory === 'Movies';
      const isCartoonFilter = selectedCategory === 'Cartoons' || selectedCategory === 'Animation';
      const hasSearch = Boolean(searchQuery.trim());

      if (!isAnimeFilter && !isMovieFilter && !isCartoonFilter && !hasSearch) {
        setOnlineVideos([]);
        return;
      }

      setIsSearchingOnline(true);
      try {
        const fetched: Video[] = [];

        if (hasSearch) {
          // Query both movie and anime APIs in parallel
          const [movieRes, animeRes] = await Promise.all([
            fetch(`/api/movies?q=${encodeURIComponent(searchQuery.trim())}`)
              .then((r) => r.json())
              .catch(() => null),
            fetch(`/api/anime?q=${encodeURIComponent(searchQuery.trim())}`)
              .then((r) => r.json())
              .catch(() => null),
          ]);
          if (movieRes?.videos) fetched.push(...movieRes.videos);
          if (animeRes?.videos) fetched.push(...animeRes.videos);
        } else if (isAnimeFilter) {
          const res = await fetch(`/api/anime?limit=20`);
          if (res.ok) {
            const data = await res.json();
            if (data.videos) fetched.push(...data.videos);
          }
        } else if (isMovieFilter) {
          const res = await fetch(`/api/movies?category=Movies`);
          if (res.ok) {
            const data = await res.json();
            if (data.videos) fetched.push(...data.videos);
          }
        } else if (isCartoonFilter) {
          const res = await fetch(`/api/movies?category=Cartoons`);
          if (res.ok) {
            const data = await res.json();
            if (data.videos) fetched.push(...data.videos);
          }
        }

        if (!isCancelled && fetched.length > 0) {
          setOnlineVideos(fetched);
          addDiscoveredVideos(fetched);
        }
      } catch {
        // Fallback to local catalog
      } finally {
        if (!isCancelled) setIsSearchingOnline(false);
      }
    };

    const timer = setTimeout(fetchLiveCatalog, 300);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery, addDiscoveredVideos]);

  // Combine local videos with live online videos without duplicates
  const allVideos = React.useMemo(() => {
    const existingIds = new Set(videos.map((v) => v.id));
    const uniqueOnline = onlineVideos.filter((v) => !existingIds.has(v.id));
    return [...videos, ...uniqueOnline];
  }, [videos, onlineVideos]);

  // Filter videos based on category and search query
  const filteredVideos = allVideos.filter((video) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      video.category.toLowerCase() === selectedCategory.toLowerCase() ||
      video.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Animation' && video.category === 'Cartoons') ||
      (selectedCategory === 'Cartoons' && video.mediaType === 'cartoon');

    const matchesSearch =
      !searchQuery.trim() ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Category Filter Pills */}
      <CategoryPills />

      {/* Main Video Feed */}
      <div className="p-4 lg:p-6 flex-1">
        {isSearchingOnline && (
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 w-fit animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Scanning live global catalog (Movies, Cartoons & Anime)...</span>
          </div>
        )}

        <VideoGrid
          videos={filteredVideos}
          title={
            searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategory !== 'All'
              ? `${selectedCategory} Streams`
              : undefined
          }
        />
      </div>
    </div>
  );
}
