'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Video } from '@/types';
import {
  Menu,
  Search,
  Upload,
  Bell,
  X,
  PlaySquare,
  User,
  LogOut,
  Sliders,
  CheckCircle2,
  Film,
  Loader2,
  Clock,
  History,
} from 'lucide-react';

const DEFAULT_RECENT_SEARCHES = [
  'Solo Leveling',
  'Attack on Titan',
  'Spider-Man',
  'Sakamoto Days',
  'Demon Slayer',
  'Oppenheimer',
];

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    user,
    logout,
    openAuthModal,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    videos,
    addDiscoveredVideos,
  } = useApp();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setInputVal('');
    setSearchQuery('');
    setSelectedCategory('All');
    setShowSuggestions(false);
    setShowMobileSearch(false);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    router.push('/');
  };

  const [inputVal, setInputVal] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [liveSuggestions, setLiveSuggestions] = useState<Video[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(DEFAULT_RECENT_SEARCHES);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('streamhub_recent_searches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentSearches(parsed);
        }
      }
    } catch {
      // Local storage unparsed or disabled
    }
  }, []);

  // Sync internal search input only when global query changes externally (e.g. reset)
  useEffect(() => {
    setInputVal(searchQuery);
  }, [searchQuery]);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('streamhub_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item.toLowerCase() !== term.toLowerCase());
      try {
        localStorage.setItem('streamhub_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('streamhub_recent_searches');
    } catch {}
  };

  // Live search debounced fetch for suggestions across movies and anime
  useEffect(() => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setLiveSuggestions([]);
      setIsSearchingLive(false);
      return;
    }

    let isCancelled = false;
    setIsSearchingLive(true);

    const timer = setTimeout(async () => {
      try {
        const [movieRes, animeRes] = await Promise.all([
          fetch(`/api/movies?q=${encodeURIComponent(trimmed)}`).then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch(`/api/anime?q=${encodeURIComponent(trimmed)}`).then((r) => (r.ok ? r.json() : null)).catch(() => null),
        ]);

        if (!isCancelled) {
          const combined: Video[] = [];
          if (Array.isArray(movieRes?.videos)) combined.push(...movieRes.videos);
          if (Array.isArray(animeRes?.videos)) combined.push(...animeRes.videos);
          if (combined.length > 0) {
            setLiveSuggestions(combined.slice(0, 10));
            addDiscoveredVideos(combined);
          }
        }
      } catch {
        // Silently handle
      } finally {
        if (!isCancelled) setIsSearchingLive(false);
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [inputVal, addDiscoveredVideos]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setShowMobileSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const executeSearch = (searchTerm: string) => {
    const clean = searchTerm.trim();
    if (!clean) return;
    saveRecentSearch(clean);
    setInputVal(clean);
    setSearchQuery(clean);
    setShowSuggestions(false);
    setShowMobileSearch(false);

    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        router.push('/');
      } else {
        window.history.replaceState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    executeSearch(inputVal);
  };

  const handleSelectSuggestion = (item: Video) => {
    saveRecentSearch(item.title);
    setInputVal(item.title);
    setShowSuggestions(false);
    setShowMobileSearch(false);
    addDiscoveredVideos([item]);
    router.push(`/watch/${item.id}`);
  };

  // Autocomplete matching: prioritizes titles starting with query for instant feedback
  const combinedSuggestions = React.useMemo(() => {
    const q = inputVal.trim().toLowerCase();
    if (!q) return [];

    const map = new Map<string, Video>();

    // Add live suggestions first
    liveSuggestions.forEach((v) => map.set(v.id, v));

    // Add local videos that match title, category, channel, or tags
    videos.forEach((v) => {
      if (
        v.title.toLowerCase().includes(q) ||
        v.channel.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.tags?.some((t) => t.toLowerCase().includes(q))
      ) {
        if (!map.has(v.id)) {
          map.set(v.id, v);
        }
      }
    });

    const list = Array.from(map.values());

    // Sort: titles starting with q first, then alphabetically
    list.sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(q);
      const bStarts = b.title.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.title.localeCompare(b.title);
    });

    return list.slice(0, 8);
  }, [inputVal, liveSuggestions, videos]);

  const renderDropdownContent = () => {
    if (inputVal.trim() === '') {
      return (
        <div>
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-indigo-400" />
              Recent Searches
            </span>
            {recentSearches.length > 0 && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={clearRecentSearches}
                className="text-[10px] text-slate-500 hover:text-rose-400 transition"
              >
                Clear all
              </button>
            )}
          </div>

          {recentSearches.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-slate-500">
              No recent searches
            </div>
          ) : (
            <div className="space-y-0.5 mt-1">
              {recentSearches.map((term) => (
                <div
                  key={term}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeSearch(term)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/10 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                    <Clock className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 transition flex-shrink-0" />
                    <span className="text-sm text-slate-300 group-hover:text-white truncate">
                      {term}
                    </span>
                  </div>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => removeRecentSearch(term, e)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-white/5 transition"
                    title="Remove from history"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        {/* Quick Search Action */}
        <div
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeSearch(inputVal)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 transition group cursor-pointer mb-1.5"
        >
          <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
            <Search className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="text-sm text-slate-200 group-hover:text-white truncate">
              Search for <strong className="text-indigo-400 font-semibold">&ldquo;{inputVal}&rdquo;</strong>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition flex-shrink-0">
            Press Enter
          </span>
        </div>

        {/* Suggestions List Header */}
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
          <span>Suggestions</span>
          {isSearchingLive && (
            <span className="flex items-center gap-1 text-indigo-400 font-normal normal-case">
              <Loader2 className="h-3 w-3 animate-spin" />
              Scanning catalog...
            </span>
          )}
        </div>

        {/* Suggestions items */}
        {combinedSuggestions.length === 0 && !isSearchingLive ? (
          <div className="px-3 py-4 text-center text-xs text-slate-500">
            No direct matches found. Press Enter to search all sources.
          </div>
        ) : (
          <div className="space-y-0.5 max-h-80 overflow-y-auto">
            {combinedSuggestions.map((item) => (
              <div
                key={item.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectSuggestion(item)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-white/10 transition group cursor-pointer"
              >
                <img
                  src={item.posterUrl || item.thumbnailUrl}
                  alt={item.title}
                  className="h-10 w-8 rounded-lg object-cover flex-shrink-0 bg-slate-800 border border-white/10 group-hover:border-indigo-500/50 transition"
                />
                <div className="truncate flex-1 min-w-0">
                  <p className="text-sm text-slate-200 group-hover:text-indigo-300 truncate font-medium">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="truncate">{item.channel.name}</span>
                    <span>•</span>
                    <span className="text-slate-500 flex-shrink-0">{item.createdAt}</span>
                    <span className="rounded bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 text-[9px] font-bold flex-shrink-0">
                      {item.resolution || '1080p'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const notifications = [
    {
      id: 'n1',
      title: 'Blender Open Studio premiered a new 4K film',
      time: '15m ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Your uploaded video has completed HLS transcoding',
      time: '2h ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Tech Frontier liked your comment in Tears of Steel',
      time: '1d ago',
      unread: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#090a0f]/90 backdrop-blur-xl px-2.5 sm:px-4 lg:px-6">
      <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Menu Toggle & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group cursor-pointer"
            title="StreamHub Home"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <PlaySquare className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Stream<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Hub</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Autocomplete Search Bar on Tablet/Desktop */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-2 hidden md:block min-w-0">
          <form
            action="javascript:void(0)"
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search movies, anime, cartoons..."
                value={inputVal}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputVal(val);
                  setShowSuggestions(true);
                }}
                className="w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-20 py-2 text-sm text-white placeholder-slate-400 focus:border-indigo-500/80 focus:bg-[#11131a] focus:outline-none transition shadow-inner"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <div className="absolute right-2.5 top-1.5 flex items-center gap-1">
                {inputVal && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputVal('');
                      setShowSuggestions(true);
                    }}
                    className="p-1 text-slate-400 hover:text-white transition"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-500 p-1.5 text-white transition shadow-sm"
                  aria-label="Search"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </form>

          {/* Autocomplete & Recent Searches Dropdown */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-12 rounded-2xl glass-dropdown p-2 shadow-2xl z-50 border border-white/10 bg-[#0e1017]/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
              {renderDropdownContent()}
            </div>
          )}
        </div>

        {/* Right Section: Actions & Auth */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Mobile Search Toggle (visible on < md) */}
          <button
            onClick={() => {
              setShowMobileSearch(!showMobileSearch);
              setShowSuggestions(!showMobileSearch);
            }}
            className="md:hidden flex items-center gap-1.5 rounded-full px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            aria-label="Toggle search"
          >
            <Search className="h-4 w-4 text-indigo-400" />
            <span className="text-xs text-slate-400 hidden xs:inline">Search</span>
          </button>

          {/* Upload Button (hidden on phone, visible on tablet+) */}
          <Link
            href="/upload"
            className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 text-sm font-medium text-slate-200 hover:text-white transition group"
          >
            <Upload className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Upload</span>
          </Link>

          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadNotifications(0);
              }}
              className="relative rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] sm:text-[10px] font-bold text-white ring-2 ring-[#090a0f]">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 rounded-2xl glass-dropdown p-3 shadow-2xl z-50">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/10 mb-2">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <span className="text-xs text-indigo-400">All caught up</span>
                </div>
                <div className="space-y-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl hover:bg-white/5 transition flex items-start gap-2.5"
                    >
                      <Film className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {mounted && user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full p-1 hover:ring-2 hover:ring-indigo-500/50 transition"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-white/20"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-64 rounded-2xl glass-dropdown p-2 shadow-2xl z-50">
                  <div className="flex items-center gap-3 p-3 border-b border-white/10">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-indigo-500/40"
                    />
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-indigo-400 font-mono truncate">{user.handle}</p>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href={`/channel/${user.handle.replace('@', '')}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 rounded-xl transition"
                    >
                      <User className="h-4 w-4 text-indigo-400" />
                      Your Channel
                    </Link>
                    <Link
                      href="/upload"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 rounded-xl transition"
                    >
                      <Upload className="h-4 w-4 text-indigo-400" />
                      Studio Upload
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : mounted ? (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition whitespace-nowrap"
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="h-8 w-16 sm:w-20 rounded-full bg-white/5 animate-pulse" />
          )}
        </div>
      </div>

      {/* Mobile Search Bar Expandable Drawer */}
      {showMobileSearch && (
        <div className="md:hidden pb-3 pt-1 border-t border-white/5 relative">
          <form
            action="javascript:void(0)"
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full"
          >
            <input
              type="text"
              placeholder="Search movies, anime, cartoons..."
              value={inputVal}
              autoFocus
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                const val = e.target.value;
                setInputVal(val);
                setShowSuggestions(true);
              }}
              className="w-full rounded-xl border border-white/10 bg-[#11131a] pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition shadow-inner"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <button
              type="button"
              onClick={() => {
                setInputVal('');
                setShowMobileSearch(false);
                setShowSuggestions(false);
              }}
              className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </form>

          {/* Mobile Dropdown */}
          {showSuggestions && (
            <div className="mt-2 rounded-2xl glass-dropdown p-2 shadow-2xl border border-white/10 bg-[#0e1017]/95 backdrop-blur-xl max-h-[65vh] overflow-y-auto">
              {renderDropdownContent()}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
