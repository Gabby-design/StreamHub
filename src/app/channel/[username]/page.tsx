'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { MOCK_CHANNELS } from '@/lib/mockData';
import { VideoGrid } from '@/components/feed/VideoGrid';
import {
  CheckCircle,
  Eye,
  Video as VideoIcon,
  Users,
  Calendar,
  Layers,
  MessageSquare,
  Info,
  ArrowUpDown,
} from 'lucide-react';

export default function ChannelPage() {
  const params = useParams();
  const username = params?.username as string;

  const {
    videos,
    user,
    subscribedChannelIds,
    toggleSubscribe,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'videos' | 'playlists' | 'community' | 'about'>('videos');
  const [sortOrder, setSortOrder] = useState<'latest' | 'popular' | 'oldest'>('latest');

  // Match channel by handle or username
  const matchedChannelKey = Object.keys(MOCK_CHANNELS).find((key) => {
    const ch = MOCK_CHANNELS[key];
    return ch.handle.replace('@', '').toLowerCase() === username?.toLowerCase();
  });

  const channel = matchedChannelKey
    ? MOCK_CHANNELS[matchedChannelKey]
    : user && user.handle.replace('@', '').toLowerCase() === username?.toLowerCase()
    ? {
        id: 'ch_' + user.id,
        name: user.name,
        handle: user.handle,
        avatarUrl: user.avatarUrl,
        subscribers: '1.2K',
        subscriberCount: 1200,
        isVerified: true,
        bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
        description: 'Personal creative studio and experimental media streaming repository.',
        joinedDate: 'Oct 2024',
      }
    : {
        id: 'ch_unknown',
        name: username ? `@${username}` : 'Creator',
        handle: `@${username}`,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        subscribers: '450',
        subscriberCount: 450,
        isVerified: false,
        bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80',
        description: 'Video creator and streamer on StreamHub.',
        joinedDate: 'Jan 2025',
      };

  const isSubscribed = subscribedChannelIds.includes(channel.id);

  // Filter videos for this channel
  const channelVideos = videos.filter(
    (v) =>
      v.channel.handle.replace('@', '').toLowerCase() === username?.toLowerCase() ||
      v.channel.id === channel.id
  );

  const totalViews = channelVideos.reduce((acc, v) => acc + v.views, 0);

  // Sort videos
  const sortedVideos = [...channelVideos].sort((a, b) => {
    if (sortOrder === 'popular') return b.views - a.views;
    if (sortOrder === 'oldest') return a.durationSec - b.durationSec;
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="w-full min-h-screen pb-12">
      {/* Channel Banner Cover */}
      <div className="relative h-44 sm:h-64 lg:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={channel.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80'}
          alt={`${channel.name} Banner`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-black/30" />
      </div>

      {/* Channel Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <img
              src={channel.avatarUrl}
              alt={channel.name}
              className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl object-cover ring-4 ring-[#090a0f] shadow-2xl bg-[#11131a]"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {channel.name}
                </h1>
                {channel.isVerified && (
                  <CheckCircle className="h-5 w-5 text-indigo-400" />
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">{channel.handle}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-medium text-slate-200">
                  <Users className="h-3.5 w-3.5 text-indigo-400" />
                  {channel.subscribers} Subscribers
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <VideoIcon className="h-3.5 w-3.5 text-indigo-400" />
                  {channelVideos.length} Videos
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-indigo-400" />
                  {totalViews.toLocaleString()} Views
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => toggleSubscribe(channel.id)}
            className={`rounded-full px-6 py-2.5 text-xs font-semibold tracking-wide transition duration-150 ${
              isSubscribed
                ? 'bg-white/10 text-slate-300 hover:bg-white/15 border border-white/10'
                : 'bg-white text-black hover:bg-slate-200 shadow-lg'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/5 my-4">
          <div className="flex items-center gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('videos')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'videos'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('playlists')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'playlists'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'community'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'about'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              About
            </button>
          </div>

          {activeTab === 'videos' && channelVideos.length > 0 && (
            <div className="flex items-center gap-1.5 pb-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="latest" className="bg-[#11131a] text-white">Latest</option>
                <option value="popular" className="bg-[#11131a] text-white">Most Popular</option>
                <option value="oldest" className="bg-[#11131a] text-white">Oldest</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'videos' && (
          <div className="mt-6">
            <VideoGrid videos={sortedVideos} />
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="py-12 text-center text-slate-400">
            <Layers className="h-10 w-10 mx-auto mb-3 text-slate-600" />
            <h3 className="text-base font-semibold text-white">No Public Playlists</h3>
            <p className="text-xs text-slate-500 mt-1">This creator has not organized videos into public collections yet.</p>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="py-12 text-center text-slate-400">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-slate-600" />
            <h3 className="text-base font-semibold text-white">Community Updates</h3>
            <p className="text-xs text-slate-500 mt-1">Recent posts and production announcements will appear here.</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl bg-[#11131a] rounded-2xl p-6 border border-white/5 space-y-4 text-sm text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-400" />
              About {channel.name}
            </h3>
            <p className="leading-relaxed whitespace-pre-line text-slate-300">
              {channel.description || 'Welcome to the official video broadcast channel.'}
            </p>
            <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span>Joined {channel.joinedDate || '2023'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-slate-500" />
                <span>{totalViews.toLocaleString()} total video views</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
