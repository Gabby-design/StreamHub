'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Video, LiveChatMessage } from '@/types';
import { MOCK_LIVE_CHAT } from '@/lib/mockData';
import { CustomVideoPlayer } from '@/components/player/CustomVideoPlayer';
import {
  Users,
  Radio,
  Send,
  Heart,
  Share2,
  Bookmark,
  Sparkles,
  Shield,
  MessageSquare,
  Flame,
  Check,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

interface LivePlayerWithChatProps {
  stream: Video;
  allStreams?: Video[];
  onSelectStream?: (stream: Video) => void;
}

export const LivePlayerWithChat: React.FC<LivePlayerWithChatProps> = ({
  stream,
  allStreams = [],
  onSelectStream,
}) => {
  const [messages, setMessages] = useState<LiveChatMessage[]>(MOCK_LIVE_CHAT);
  const [inputText, setInputText] = useState('');
  const [viewerCount, setViewerCount] = useState(stream.liveViewers || 42890);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(stream.likes || 94200);
  const [copied, setCopied] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [isSuperChatOpen, setIsSuperChatOpen] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState('5.00');

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Fluctuating viewer count simulation for realism
  useEffect(() => {
    setViewerCount(stream.liveViewers || 42890);
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 25) - 12;
        return Math.max(100, prev + delta);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [stream.id, stream.liveViewers]);

  // Simulated active incoming chat messages
  useEffect(() => {
    const automatedPool = [
      { sender: 'NovaHunter', message: 'The 1080p stream is crystal clear tonight!', badge: 'VIP' },
      { sender: 'Kai_R', message: 'LETS GOOOOO! Huge plays on stream right now' },
      { sender: 'RinTohsaka', message: 'Soundtrack is legendary on this channel', badge: 'Sub 1yr' },
      { sender: 'MechaDev', message: 'Zero frame drops on Server 1. Peak optimization.' },
      { sender: 'ZeroTwo_02', message: 'StreamHub live layout is so clean' },
      { sender: 'ShadowBlade', message: 'Is this 60fps? Looks ultra smooth' },
      { sender: 'Hikari99', message: 'Sending love from Canada! Keep the 24/7 stream alive' },
      { sender: 'BitMaster', message: 'Dropped a like! Best live stream today' },
    ];

    const chatInterval = setInterval(() => {
      const randomItem = automatedPool[Math.floor(Math.random() * automatedPool.length)];
      const newMsg: LiveChatMessage = {
        id: `auto-${Date.now()}-${Math.random()}`,
        sender: randomItem.sender,
        avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 1000000)}?w=100&auto=format&fit=crop&q=80`,
        badge: randomItem.badge,
        message: randomItem.message,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev.slice(-40), newMsg]);
    }, 3500);

    return () => clearInterval(chatInterval);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: LiveChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      badge: 'Member',
      message: inputText.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
  };

  const handleSendSuperChat = () => {
    if (!inputText.trim()) return;
    const scMsg: LiveChatMessage = {
      id: `sc-${Date.now()}`,
      sender: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      badge: 'SuperChat',
      message: inputText.trim(),
      timestamp: 'Just now',
      isSuperChat: true,
      amount: `$${superChatAmount}`,
    };
    setMessages((prev) => [...prev, scMsg]);
    setInputText('');
    setIsSuperChatOpen(false);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Broadcast Studio Stage: Player + Live Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Live Stream Player & Broadcast Meta */}
        <div className={`space-y-4 ${showChat ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}`}>
          {/* Branded Player with Multi-Server Switcher */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
            <CustomVideoPlayer
              src={stream.videoUrl}
              poster={stream.thumbnailUrl}
              isHls={stream.isHls}
              streamServers={stream.streamServers}
              resolution={stream.resolution || '1080p'}
              title={stream.title}
            />
          </div>

          {/* Broadcast Header & Stats */}
          <div className="rounded-2xl bg-[#11131a] border border-white/5 p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 rounded-full bg-rose-600/20 text-rose-400 px-3 py-1 text-xs font-black uppercase tracking-wider border border-rose-500/30 shadow-lg shadow-rose-950/40">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    LIVE BROADCAST
                  </span>
                  <span className="rounded-full bg-indigo-600/20 text-indigo-300 px-2.5 py-0.5 text-xs font-bold border border-indigo-500/30">
                    {stream.resolution || '1080p'} 60FPS
                  </span>
                  <span className="rounded-full bg-white/5 text-slate-300 px-2.5 py-0.5 text-xs font-medium border border-white/10">
                    {stream.category}
                  </span>
                </div>

                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                  {stream.title}
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    liked
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{likesCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                    showChat
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
                  }`}
                  title={showChat ? 'Hide Live Chat' : 'Show Live Chat'}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">{showChat ? 'Hide Chat' : 'Show Chat'}</span>
                </button>
              </div>
            </div>

            {/* Channel Details & Live Viewers Count */}
            <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Link
                href={`/channel/${stream.channel.handle}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={stream.channel.avatarUrl}
                  alt={stream.channel.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                      {stream.channel.name}
                    </h3>
                    {stream.channel.isVerified && (
                      <Check className="h-3.5 w-3.5 rounded-full bg-indigo-600 text-white p-0.5" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{stream.channel.subscribers} subscribers</p>
                </div>
              </Link>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-300 bg-black/40 px-3.5 py-2 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-rose-400">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                  </span>
                  <span className="font-extrabold font-mono text-sm">
                    {viewerCount.toLocaleString()}
                  </span>
                  <span className="text-slate-400">watching</span>
                </div>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{stream.liveStartedAt || 'Streaming 24/7'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Real-Time Live Chat */}
        {showChat && (
          <div className="lg:col-span-4 xl:col-span-3 h-[580px] sm:h-[620px] rounded-2xl bg-[#11131a] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Stream Chat
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Users className="h-3.5 w-3.5 text-indigo-400" />
                <span>{Math.floor(viewerCount * 0.42).toLocaleString()} chatting</span>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-3.5 space-y-3 font-sans text-xs scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-xl p-2.5 transition-all ${
                    msg.isSuperChat
                      ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 shadow-lg'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="h-5 w-5 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
                    />
                    <span className="font-bold text-slate-200 truncate max-w-[110px]">
                      {msg.sender}
                    </span>
                    {msg.badge && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                        {msg.badge}
                      </span>
                    )}
                    {msg.isSuperChat && msg.amount && (
                      <span className="ml-auto text-[11px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                        {msg.amount}
                      </span>
                    )}
                  </div>
                  <p className={`text-slate-300 break-words leading-relaxed pl-7 ${msg.isSuperChat ? 'text-amber-100 font-semibold' : ''}`}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            {/* SuperChat Donation Drawer */}
            {isSuperChatOpen && (
              <div className="p-3 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-transparent border-t border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    Send a SuperChat Spotlight
                  </span>
                  <button
                    onClick={() => setIsSuperChatOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {['2.00', '5.00', '10.00', '50.00'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setSuperChatAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        superChatAmount === amt
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'bg-black/50 text-amber-200 border border-amber-500/20'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                  <button
                    onClick={handleSendSuperChat}
                    className="ml-auto px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs rounded-lg shadow-lg"
                  >
                    Send ${superChatAmount}
                  </button>
                </div>
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSuperChatOpen(!isSuperChatOpen)}
                  className={`p-2 rounded-xl transition ${
                    isSuperChatOpen
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/5 hover:bg-white/10 text-amber-400 border border-amber-500/30'
                  }`}
                  title="Send SuperChat"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  placeholder="Chat as community member..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition shadow-md"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
