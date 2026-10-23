'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { HeroBillboard } from '@/components/feed/HeroBillboard';
import { VideoGrid } from '@/components/feed/VideoGrid';
import { PricingSection } from '@/components/feed/PricingSection';
import { Video } from '@/types';
import { Loader2, Search } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search');
  const { videos, selectedCategory, searchQuery, setSearchQuery, addDiscoveredVideos } = useApp();
  const [onlineVideos, setOnlineVideos] = useState<Video[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  // Clean home screen on manual reload; sync urlSearch on direct external deep links
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const navEntry =
        window.performance &&
        window.performance.getEntriesByType &&
        (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined);

      const isReload = navEntry?.type === 'reload';

      if (isReload) {
        setSearchQuery('');
        window.history.replaceState(null, '', '/');
      } else if (urlSearch) {
        setSearchQuery(urlSearch);
      }
    }
  }, [urlSearch, setSearchQuery]);

  // Dynamic online catalog search across movies, anime, cartoons
  useEffect(() => {
    let isCancelled = false;

    const fetchLiveCatalog = async () => {
      const isAnimeFilter =
        selectedCategory === 'Anime' ||
        selectedCategory === 'English Dub' ||
        selectedCategory === 'English Sub';

      const isMovieFilter = selectedCategory === 'Movies';
      const isCartoonFilter = selectedCategory === 'Cartoons' || selectedCategory === 'Animation';
      const cleanQ = searchQuery.trim();
      const hasSearch = Boolean(cleanQ);

      if (!isAnimeFilter && !isMovieFilter && !isCartoonFilter && !hasSearch) {
        setOnlineVideos([]);
        return;
      }

      setIsSearchingOnline(true);
      try {
        const fetched: Video[] = [];

        if (hasSearch) {
          const [movieRes, animeRes] = await Promise.all([
            fetch(`/api/movies?q=${encodeURIComponent(cleanQ)}`)
              .then((r) => r.json())
              .catch(() => null),
            fetch(`/api/anime?q=${encodeURIComponent(cleanQ)}`)
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
        // Fallback
      } finally {
        if (!isCancelled) setIsSearchingOnline(false);
      }
    };

    const timer = setTimeout(fetchLiveCatalog, 250);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery, addDiscoveredVideos]);

  // Merge local and live catalog
  const allVideos = React.useMemo(() => {
    if (searchQuery.trim()) {
      const onlineIds = new Set(onlineVideos.map((v) => v.id));
      const restVideos = videos.filter((v) => !onlineIds.has(v.id));
      return [...onlineVideos, ...restVideos];
    }
    const existingIds = new Set(videos.map((v) => v.id));
    const uniqueOnline = onlineVideos.filter((v) => !existingIds.has(v.id));
    return [...videos, ...uniqueOnline];
  }, [videos, onlineVideos, searchQuery]);

  // Filter based on active category & search query
  const filteredVideos = allVideos.filter((video) => {
    const hasSearch = Boolean(searchQuery.trim());
    const matchesCategory =
      hasSearch ||
      selectedCategory === 'All' ||
      video.category.toLowerCase() === selectedCategory.toLowerCase() ||
      video.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Animation' && video.category === 'Cartoons') ||
      (selectedCategory === 'Cartoons' && video.mediaType === 'cartoon');

    const cleanQ = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !hasSearch ||
      video.title.toLowerCase().includes(cleanQ) ||
      video.description.toLowerCase().includes(cleanQ) ||
      video.channel.name.toLowerCase().includes(cleanQ) ||
      video.tags.some((tag) => tag.toLowerCase().includes(cleanQ));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 3. Hero Feature Section (Billboard) */}
      {!searchQuery && <HeroBillboard />}

      {/* Online Search Progress Feedback */}
      {isSearchingOnline && (
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E50914] bg-[#E50914]/10 px-3.5 py-2 rounded-full border border-[#E50914]/25 w-fit animate-pulse">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Scanning global catalog for &quot;{searchQuery}&quot;...</span>
        </div>
      )}

      {/* 4. Recommendations & Card Grid */}
      <VideoGrid
        videos={filteredVideos}
        title={
          searchQuery
            ? `Search Results for "${searchQuery}"`
            : selectedCategory !== 'All'
            ? `${selectedCategory} Recommendations`
            : 'Recommendations'
        }
      />

      {/* 5. Pricing / Subscription Section ("Choose your plan") */}
      <PricingSection />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 text-[#E50914] animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
