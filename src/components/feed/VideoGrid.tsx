'use client';

import React, { useState, useMemo } from 'react';
import { Video } from '@/types';
import { VideoCard } from './VideoCard';
import {
  Film,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  title?: string;
}

const YEARS = ['All Years', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];
const CATEGORIES = ['All Categories', 'Movies', 'Series', 'Cartoons', 'Anime'];
const GENRES = [
  'All Genres',
  'Action',
  'Sci-Fi',
  'Drama',
  'Crime',
  'Comedy',
  'Adventure',
  'Animation',
  'Fantasy',
  'Superhero',
];

const ITEMS_PER_PAGE = 15; // 5 columns x 3 rows = 15 poster cards per page

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  title = 'Recommendations',
}) => {
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [inlineSearch, setInlineSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter videos based on dropdowns and inline search
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      // Year filter
      if (selectedYear !== 'All Years') {
        const itemYear = v.createdAt?.slice(0, 4) || v.releaseDate?.slice(0, 4) || '';
        if (itemYear !== selectedYear) return false;
      }

      // Category filter
      if (selectedCategory !== 'All Categories') {
        const cat = v.category.toLowerCase();
        const sel = selectedCategory.toLowerCase();
        if (sel === 'series' && !(cat === 'anime' || cat === 'series' || v.mediaType === 'series')) {
          return false;
        } else if (sel !== 'series' && cat !== sel) {
          return false;
        }
      }

      // Genre filter
      if (selectedGenre !== 'All Genres') {
        const genreLower = selectedGenre.toLowerCase();
        const hasGenre =
          v.genres?.some((g) => g.toLowerCase().includes(genreLower)) ||
          v.tags?.some((t) => t.toLowerCase().includes(genreLower)) ||
          v.description.toLowerCase().includes(genreLower);
        if (!hasGenre) return false;
      }

      // Inline quick search filter
      if (inlineSearch.trim()) {
        const q = inlineSearch.toLowerCase().trim();
        const matchTitle = v.title.toLowerCase().includes(q);
        const matchDesc = v.description.toLowerCase().includes(q);
        const matchTags = v.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      return true;
    });
  }, [videos, selectedYear, selectedCategory, selectedGenre, inlineSearch]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / ITEMS_PER_PAGE));
  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedVideos = useMemo(() => {
    const start = (effectivePage - 1) * ITEMS_PER_PAGE;
    return filteredVideos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVideos, effectivePage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('recommendations-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetAllFilters = () => {
    setSelectedYear('All Years');
    setSelectedCategory('All Categories');
    setSelectedGenre('All Genres');
    setInlineSearch('');
    setCurrentPage(1);
  };

  return (
    <div id="recommendations-section" className="w-full mt-10 scroll-mt-20">
      {/* Top Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Section Title */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="h-2 w-2 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" />
          </h2>
          <span className="text-xs font-mono text-zinc-500 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5">
            {filteredVideos.length} titles
          </span>
        </div>

        {/* Filter Controls: Pill Dropdowns & Inline Quick Search (horizontal scroll on mobile) */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0 flex-nowrap sm:flex-wrap">
          {/* Year Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-300 pl-3.5 pr-8 py-2 focus:outline-none focus:border-[#E50914]/60 transition cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-[#121216] text-white">
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-300 pl-3.5 pr-8 py-2 focus:outline-none focus:border-[#E50914]/60 transition cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#121216] text-white">
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>

          {/* Genre Dropdown */}
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-300 pl-3.5 pr-8 py-2 focus:outline-none focus:border-[#E50914]/60 transition cursor-pointer"
            >
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-[#121216] text-white">
                  {g}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>

          {/* Inline Quick Search Bar */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Quick filter..."
              value={inlineSearch}
              onChange={(e) => {
                setInlineSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-36 sm:w-44 rounded-full bg-white/[0.04] border border-white/10 pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]/60 focus:bg-white/[0.07] transition"
            />
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>

          {/* Reset Filters button if any filter active */}
          {(selectedYear !== 'All Years' ||
            selectedCategory !== 'All Categories' ||
            selectedGenre !== 'All Genres' ||
            inlineSearch) && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.05] hover:bg-[#E50914]/20 text-[#E50914] text-xs font-semibold transition"
              title="Reset all filters"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {paginatedVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center rounded-3xl bg-white/[0.02] border border-white/5 my-6">
          <div className="h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 text-zinc-500">
            <Film className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No movies or series found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-5">
            No recommendations match your current selection of filters. Try resetting to see the entire catalog.
          </p>
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-2 rounded-full bg-[#E50914] hover:bg-[#b80710] px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(229,9,20,0.5)] transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Sleek 5-Column Vertical 2:3 Movie Cards Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {paginatedVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {/* Centered Bottom Pagination Controls with red active circle state (< 1 2 3 4 ... 25 >) */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2">
          {/* Previous '<' */}
          <button
            onClick={() => handlePageChange(Math.max(1, effectivePage - 1))}
            disabled={effectivePage === 1}
            className="h-9 w-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] disabled:opacity-30 disabled:hover:bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-semibold transition"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {(() => {
            const displayPages: (number | string)[] = [];
            const maxVisible = 5;

            if (totalPages <= maxVisible + 2) {
              for (let i = 1; i <= totalPages; i++) displayPages.push(i);
            } else {
              displayPages.push(1);
              if (effectivePage > 3) displayPages.push('...');

              const start = Math.max(2, effectivePage - 1);
              const end = Math.min(totalPages - 1, effectivePage + 1);

              for (let i = start; i <= end; i++) {
                if (!displayPages.includes(i)) displayPages.push(i);
              }

              if (effectivePage < totalPages - 2) displayPages.push('...');
              if (!displayPages.includes(totalPages)) displayPages.push(totalPages);
            }

            return displayPages.map((p, idx) => {
              if (p === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="h-9 w-7 flex items-center justify-center text-xs text-zinc-500 font-mono"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = pageNum === effectivePage;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`h-9 w-9 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E50914] text-white shadow-[0_0_18px_rgba(229,9,20,0.6)] scale-105'
                      : 'bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            });
          })()}

          {/* Next '>' */}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, effectivePage + 1))}
            disabled={effectivePage === totalPages}
            className="h-9 w-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] disabled:opacity-30 disabled:hover:bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-semibold transition"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
