'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VideoGrid } from '@/components/feed/VideoGrid';
import { History, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { watchHistory, clearHistory } = useApp();

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Watch History</h1>
            <p className="text-xs text-slate-400">Chronological record of videos played in this session</p>
          </div>
        </div>

        {watchHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-400 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear History
          </button>
        )}
      </div>

      {watchHistory.length > 0 ? (
        <VideoGrid videos={watchHistory} />
      ) : (
        <div className="text-center py-16">
          <History className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">No Watch History</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Videos you watch will automatically be logged here for convenient resume and reference.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition"
          >
            Browse Videos
          </Link>
        </div>
      )}
    </div>
  );
}
