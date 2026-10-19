'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
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
} from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    user,
    logout,
    openAuthModal,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    videos,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync internal search input with global query
  useEffect(() => {
    setInputVal(searchQuery);
  }, [searchQuery]);

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(inputVal);
    setShowSuggestions(false);
    if (window.location.pathname !== '/') {
      router.push(`/?search=${encodeURIComponent(inputVal)}`);
    }
  };

  const filteredSuggestions = inputVal.trim()
    ? videos
        .filter((v) =>
          v.title.toLowerCase().includes(inputVal.toLowerCase()) ||
          v.channel.name.toLowerCase().includes(inputVal.toLowerCase()) ||
          v.category.toLowerCase().includes(inputVal.toLowerCase())
        )
        .slice(0, 5)
    : [];

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
    <header className="sticky top-0 z-40 h-16 w-full border-b border-white/5 bg-[#090a0f]/90 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex h-full items-center justify-between gap-4">
        {/* Left Section: Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <PlaySquare className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Stream<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Hub</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Autocomplete Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-2 hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search videos, channels, topics..."
                value={inputVal}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-10 py-2 text-sm text-white placeholder-slate-400 focus:border-indigo-500/80 focus:bg-[#11131a] focus:outline-none transition shadow-inner"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    setSearchQuery('');
                  }}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-12 rounded-2xl glass-dropdown p-2 shadow-2xl z-50">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                Suggestions
              </div>
              {filteredSuggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setInputVal(item.title);
                    setSearchQuery(item.title);
                    setShowSuggestions(false);
                    router.push(`/watch/${item.id}`);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-white/10 transition group"
                >
                  <Search className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-sm text-slate-200 group-hover:text-white truncate font-medium">
                      {item.title}
                    </p>
                    <span className="text-xs text-slate-400">
                      {item.channel.name} • {item.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Actions & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Upload Button */}
          <Link
            href="/upload"
            className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 text-sm font-medium text-slate-200 hover:text-white transition group"
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
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white ring-2 ring-[#090a0f]">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl glass-dropdown p-3 shadow-2xl z-50">
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
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full p-1 hover:ring-2 hover:ring-indigo-500/50 transition"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border border-white/20"
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
                      <p className="text-xs text-slate-400 truncate">{user.handle}</p>
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
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
