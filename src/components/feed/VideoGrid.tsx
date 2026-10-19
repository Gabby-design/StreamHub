'use client';

import React from 'react';
import { Video } from '@/types';
import { VideoCard } from './VideoCard';
import { Film, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface VideoGridProps {
  videos: Video[];
  title?: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, title }) => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useApp();

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Film className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No videos found</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          {searchQuery
            ? `No results matching "${searchQuery}". Try searching for different keywords or categories.`
            : `No videos available in category "${selectedCategory}".`}
        </p>
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <span className="text-xs text-slate-400 font-mono">{videos.length} videos</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
