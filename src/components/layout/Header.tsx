'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Video } from '@/types';
import {
  Search,
  X,
  User,
  LogOut,
  Film,
  Loader2,
  ChevronDown,
  Bookmark,
  Crown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    logout,
    openAuthModal,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    addDiscoveredVideos,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState<Video[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [activeTab, setActiveTab] = useState<'movies' | 'series' | 'tv'>('movies');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setInputVal(searchQuery);
    });
  }, [searchQuery]);

  // Click outside listener for search suggestions & user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search debounced fetch across movies and anime
  useEffect(() => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      queueMicrotask(() => {
        setLiveSuggestions([]);
        setIsSearchingLive(false);
      });
      return;
    }

    let isCancelled = false;
    queueMicrotask(() => {
      setIsSearchingLive(true);
    });

    const timer = setTimeout(async () => {
      try {
        const [movieRes, animeRes] = await Promise.all([
          fetch(`/api/movies?q=${encodeURIComponent(trimmed)}`).then((r) =>
            r.ok ? r.json() : null
          ).catch(() => null),
          fetch(`/api/anime?q=${encodeURIComponent(trimmed)}`).then((r) =>
            r.ok ? r.json() : null
          ).catch(() => null),
        ]);

        if (!isCancelled) {
          const combined: Video[] = [];
          if (movieRes?.videos) combined.push(...movieRes.videos);
          if (animeRes?.videos) combined.push(...animeRes.videos);

          const uniqueMap = new Map<string, Video>();
          combined.forEach((v) => {
            if (!uniqueMap.has(v.id)) uniqueMap.set(v.id, v);
          });
          const uniqueList = Array.from(uniqueMap.values()).slice(0, 6);
          setLiveSuggestions(uniqueList);
          addDiscoveredVideos(uniqueList);
        }
      } catch {
        // Fallback
      } finally {
        if (!isCancelled) setIsSearchingLive(false);
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [inputVal, addDiscoveredVideos]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim();
    setSearchQuery(clean);
    setShowSuggestions(false);
    if (pathname !== '/') {
      router.push(`/?search=${encodeURIComponent(clean)}`);
    }
  };

  const handleTabClick = (tab: 'movies' | 'series' | 'tv') => {
    setActiveTab(tab);
    if (tab === 'movies') {
      setSelectedCategory('Movies');
      setSearchQuery('');
    } else if (tab === 'series') {
      setSelectedCategory('Anime');
      setSearchQuery('');
    } else {
      setSelectedCategory('Cartoons');
      setSearchQuery('');
    }
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-white/10 bg-[#0b0b0c]/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-full items-center justify-between relative max-w-7xl mx-auto">
        {/* Left-aligned text tabs: "Movies", "Series", "TV shows" */}
        <nav className="flex items-center gap-6 sm:gap-8 z-10">
          <button
            onClick={() => handleTabClick('movies')}
            className={`relative py-1 text-sm font-semibold transition-colors duration-150 ${
              activeTab === 'movies'
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Movies
            {activeTab === 'movies' && (
              <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('series')}
            className={`relative py-1 text-sm font-semibold transition-colors duration-150 ${
              activeTab === 'series'
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Series
            {activeTab === 'series' && (
              <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('tv')}
            className={`relative py-1 text-sm font-semibold transition-colors duration-150 ${
              activeTab === 'tv'
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            TV shows
            {activeTab === 'tv' && (
              <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" />
            )}
          </button>
        </nav>

        {/* Centered brand logo: "filmbox" (with red highlight) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Link
            href="/"
            onClick={() => {
              setInputVal('');
              setSearchQuery('');
              setSelectedCategory('All');
              setActiveTab('movies');
            }}
            className="group flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center">
              film<span className="text-[#E50914] drop-shadow-[0_0_12px_rgba(229,9,20,0.5)]">box</span>
            </span>
          </Link>
        </div>

        {/* Right utility group: Minimal search icon input bar + user profile pill */}
        <div className="flex items-center gap-3 sm:gap-4 z-10">
          {/* Minimal Search Bar */}
          <div ref={searchContainerRef} className="relative">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center rounded-full bg-white/[0.04] border border-white/10 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus-within:border-[#E50914]/60 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_18px_rgba(229,9,20,0.25)] transition-all w-36 sm:w-48 md:w-60 group"
            >
              <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-[#E50914] flex-shrink-0 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={inputVal}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full bg-transparent px-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="p-0.5 text-zinc-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (inputVal.trim() || liveSuggestions.length > 0) && (
              <div className="absolute right-0 top-11 w-72 sm:w-80 rounded-2xl glass-dropdown p-2.5 shadow-2xl z-50">
                <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 mb-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <span>Live Search Results</span>
                  {isSearchingLive && <Loader2 className="h-3 w-3 animate-spin text-[#E50914]" />}
                </div>

                <div className="space-y-1 max-h-72 overflow-y-auto no-scrollbar">
                  {liveSuggestions.length > 0 ? (
                    liveSuggestions.map((v) => (
                      <Link
                        key={v.id}
                        href={`/watch/${v.id}`}
                        onClick={() => setShowSuggestions(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.06] transition group"
                      >
                        <img
                          src={v.posterUrl || v.thumbnailUrl}
                          alt={v.title}
                          className="h-10 w-7 rounded object-cover flex-shrink-0 border border-white/10"
                        />
                        <div className="truncate flex-1">
                          <p className="text-xs font-medium text-white truncate group-hover:text-[#E50914] transition-colors">
                            {v.title}
                          </p>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {v.category} • {v.createdAt || 'HD'}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-zinc-400">
                      Press enter to search &quot;{inputVal}&quot;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill (avatar + name "Mark Paul") */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 p-1 pr-3 transition cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={
                    user?.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={user?.name || 'Mark Paul'}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-white/20 group-hover:ring-[#E50914] transition"
                />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-[#0b0b0c]" />
              </div>

              <span className="text-xs font-semibold text-zinc-200 hidden sm:inline truncate max-w-[90px]">
                {user?.name || 'Mark Paul'}
              </span>

              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white transition-transform" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-11 w-56 rounded-2xl glass-dropdown p-2 shadow-2xl z-50 animate-in fade-in-50 duration-150">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-white truncate">
                    {user?.name || 'Mark Paul'}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono truncate">
                    mark.paul@filmbox.vip
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 w-fit">
                    <Crown className="h-3 w-3 text-amber-400" />
                    Platinum Member
                  </div>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href="/liked"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-200 hover:bg-white/[0.06] rounded-xl transition"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-[#E50914]" />
                    My Watchlist
                  </Link>

                  <Link
                    href="/library"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-200 hover:bg-white/[0.06] rounded-xl transition"
                  >
                    <Film className="h-3.5 w-3.5 text-zinc-400" />
                    Watch History
                  </Link>

                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition mt-1 border-t border-white/5"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        openAuthModal();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.06] rounded-xl transition mt-1 border-t border-white/5"
                    >
                      <User className="h-3.5 w-3.5 text-[#E50914]" />
                      Switch Account
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
