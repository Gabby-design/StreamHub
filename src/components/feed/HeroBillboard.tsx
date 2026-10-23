'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Play,
  Plus,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  rating: string;
  releaseYear: string;
  duration: string;
  genres: string[];
  synopsis: string;
  characterImage: string;
  backdropUrl: string;
  watchUrl: string;
  previewThumbs: string[];
  photosCount: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'movie-the-batman',
    title: 'The Batman',
    rating: '4.6',
    releaseYear: '2022',
    duration: '176 min',
    genres: ['Action', 'Crime', 'Drama'],
    synopsis:
      "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    characterImage: '/images/batman-hero.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg',
    watchUrl: '/watch/movie-the-batman',
    previewThumbs: [
      'https://image.tmdb.org/t/p/w500/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg',
      'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
      'https://image.tmdb.org/t/p/w500/5P8SmMzSNYikXpxil6BYzJ16611.jpg',
    ],
    photosCount: '+99 photos',
  },
  {
    id: 'movie-tt15239678',
    title: 'Dune: Part Two',
    rating: '4.8',
    releaseYear: '2024',
    duration: '166 min',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    synopsis:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe.',
    characterImage: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    watchUrl: '/watch/movie-tt15239678',
    previewThumbs: [
      'https://image.tmdb.org/t/p/w500/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
      'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
      'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    ],
    photosCount: '+84 photos',
  },
  {
    id: 'movie-tt9362722',
    title: 'Spider-Man: Across the Spider-Verse',
    rating: '4.7',
    releaseYear: '2023',
    duration: '140 min',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    synopsis:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    characterImage: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg',
    watchUrl: '/watch/movie-tt9362722',
    previewThumbs: [
      'https://image.tmdb.org/t/p/w500/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg',
      'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      'https://image.tmdb.org/t/p/w500/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg',
    ],
    photosCount: '+99 photos',
  },
  {
    id: 'movie-oppenheimer',
    title: 'Oppenheimer',
    rating: '4.9',
    releaseYear: '2023',
    duration: '180 min',
    genres: ['Drama', 'History', 'Thriller'],
    synopsis:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb, sweeping 7 Academy Awards.',
    characterImage: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    watchUrl: '/watch/movie-oppenheimer',
    previewThumbs: [
      'https://image.tmdb.org/t/p/w500/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      'https://image.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    ],
    photosCount: '+72 photos',
  },
];

export const HeroBillboard: React.FC = () => {
  const { savedVideoIds, toggleWatchLater } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const current = HERO_SLIDES[currentIndex];
  const isSaved = savedVideoIds.includes(current.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Automatic slide transition every 5.5 seconds, pauses when user hovers or interacts
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#111114] shadow-2xl transition-all"
    >
      {/* Background Ambient Glow & Subtle Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-sm transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${current.backdropUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0c] via-[#0b0b0c]/90 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-transparent to-transparent pointer-events-none" />

      {/* Main Content Layout */}
      <div className="relative z-10 p-4 sm:p-8 md:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 min-h-[440px] sm:min-h-[480px]">
        {/* Left Column: Metadata & CTAs */}
        <div className="flex-1 max-w-xl flex flex-col justify-center space-y-4 sm:space-y-5">
          {/* Rating & Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* IMDb Star Rating */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-amber-400/30 text-amber-400 font-bold backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{current.rating}</span>
              <span className="text-zinc-500 font-normal">/ 5</span>
            </div>

            {/* Year Tag */}
            <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 font-medium">
              {current.releaseYear}
            </span>

            {/* Duration Tag */}
            <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 font-medium">
              {current.duration}
            </span>

            {/* Genre Tags */}
            {current.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400 font-medium"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {current.title}
          </h1>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-zinc-300/90 line-clamp-3 leading-relaxed max-w-lg">
            {current.synopsis}
          </p>

          {/* Action CTAs & Carousel Controls */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {/* Primary Red CTA ("Watch Now") */}
            <Link
              href={current.watchUrl}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E50914] hover:bg-[#b80710] text-white text-sm font-bold shadow-[0_0_25px_rgba(229,9,20,0.6)] hover:shadow-[0_0_35px_rgba(229,9,20,0.85)] transition-all duration-200 group"
            >
              <Play className="h-4 w-4 fill-white text-white transition-transform group-hover:scale-110" />
              <span>Watch Now</span>
            </Link>

            {/* Secondary '+' (Watchlist) Icon Button */}
            <button
              onClick={() => toggleWatchLater(current.id)}
              className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
                isSaved
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/15 hover:border-white/30'
              }`}
              title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
              aria-label="Add to Watchlist"
            >
              {isSaved ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </button>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={handlePrev}
                className="h-9 w-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition"
                aria-label="Previous featured movie"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="h-9 w-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition"
                aria-label="Next featured movie"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Carousel Indicators (Dashes / Dots) */}
          <div className="flex items-center gap-2 pt-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 bg-[#E50914] shadow-[0_0_10px_#E50914]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Center / Right: Focal Character Cutout & Glowing Red Circular Aura */}
        <div className="relative flex items-center justify-center flex-1 w-full max-w-md lg:max-w-lg min-h-[260px] sm:min-h-[360px] md:min-h-[380px]">
          {/* Stylized Glowing Red Circular Background Graphic */}
          <div className="absolute w-[220px] h-[220px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-tr from-[#E50914] via-[#FF1E44]/75 to-transparent blur-2xl sm:blur-3xl opacity-70 ring-2 ring-[#FF1E44]/40" />

          {/* Secondary Subtle Rotating Outer Ring */}
          <div className="absolute w-[240px] h-[240px] sm:w-[370px] sm:h-[370px] md:w-[450px] md:h-[450px] rounded-full border border-[#FF1E44]/30 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />

          {/* Large Focal Character Cutout */}
          <div className="relative z-10 flex items-center justify-center w-full h-[260px] sm:h-[360px] md:h-[420px] overflow-hidden">
            <img
              src={current.characterImage}
              alt={current.title}
              referrerPolicy="no-referrer"
              className="h-full w-auto max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transform transition-transform duration-500 hover:scale-[1.02]"
            />

            {/* Floating Circular Play Button Overlay */}
            <Link
              href={current.watchUrl}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-black/60 hover:bg-[#E50914] backdrop-blur-xl border border-white/20 hover:border-transparent flex items-center justify-center text-white shadow-[0_0_30px_rgba(229,9,20,0.5)] transition-all duration-300 hover:scale-110"
              aria-label={`Play ${current.title}`}
            >
              <span className="absolute inset-0 rounded-full border border-red-500/40 animate-ping pointer-events-none" />
              <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-white text-white ml-1 transition-transform group-hover:scale-110" />
            </Link>
          </div>
        </div>

        {/* Right Media Stack: Vertical Preview Thumbnail Strip */}
        <div className="hidden xl:flex flex-col items-center gap-2.5 w-24 flex-shrink-0 z-10 self-center">
          {current.previewThumbs.map((thumb, idx) => (
            <div
              key={idx}
              className="relative h-14 w-20 rounded-xl overflow-hidden border border-white/10 shadow-md group cursor-pointer hover:border-[#E50914]/50 transition"
            >
              <img
                src={thumb}
                alt="Scene Preview"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
          ))}

          {/* +99 photos indicator pill */}
          <div className="w-full py-1.5 px-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-center text-[10px] font-bold text-zinc-300 hover:text-white transition cursor-pointer">
            {current.photosCount}
          </div>
        </div>
      </div>
    </section>
  );
};
