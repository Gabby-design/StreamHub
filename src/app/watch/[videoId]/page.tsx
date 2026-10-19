'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Video } from '@/types';
import { useApp } from '@/context/AppContext';
import { CustomVideoPlayer } from '@/components/player/CustomVideoPlayer';
import { VideoMeta } from '@/components/watch/VideoMeta';
import { CommentsSection } from '@/components/watch/CommentsSection';
import { UpNextSidebar } from '@/components/watch/UpNextSidebar';
import Link from 'next/link';
import { ArrowLeft, Film } from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params?.videoId as string;

  const { videos, addToHistory, addDiscoveredVideos, autoplay } = useApp();
  const [isTheater, setIsTheater] = useState(false);
  const [dynamicVideo, setDynamicVideo] = useState<Video | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const localVideo = videos.find((v) => v.id === videoId);
  const video = localVideo || dynamicVideo;
  const loggedHistoryRef = useRef<string | null>(null);

  // Fallback resolver for direct URLs to dynamic movies/anime
  useEffect(() => {
    if (localVideo) return;

    let isCancelled = false;
    const resolveVideo = async () => {
      setIsResolving(true);
      try {
        if (videoId.startsWith('movie-') || videoId.startsWith('tt') || videoId.startsWith('tvmaze-')) {
          const rawQuery = videoId.replace('movie-', '').replace('tvmaze-', '');
          const res = await fetch(`/api/movies?q=${encodeURIComponent(rawQuery)}`);
          if (res.ok) {
            const data = await res.json();
            const match = data.videos?.find((v: Video) => v.id === videoId || v.imdbId === rawQuery) || data.videos?.[0];
            if (!isCancelled && match) {
              setDynamicVideo(match);
              addDiscoveredVideos([match]);
              return;
            }
          }
        }

        if (videoId.startsWith('anime-') || videoId.includes('-')) {
          const rawQuery = videoId.replace('anime-', '');
          const res = await fetch(`/api/anime?q=${encodeURIComponent(rawQuery)}`);
          if (res.ok) {
            const data = await res.json();
            const match = data.videos?.find((v: Video) => v.id === videoId) || data.videos?.[0];
            if (!isCancelled && match) {
              setDynamicVideo(match);
              addDiscoveredVideos([match]);
            }
          }
        }
      } catch {
        // Unresolved
      } finally {
        if (!isCancelled) setIsResolving(false);
      }
    };

    resolveVideo();
    return () => {
      isCancelled = true;
    };
  }, [videoId, localVideo, addDiscoveredVideos]);

  // Automatically record in watch history once per video
  useEffect(() => {
    if (video && loggedHistoryRef.current !== video.id) {
      loggedHistoryRef.current = video.id;
      addToHistory(video);
    }
  }, [video?.id, addToHistory]);

  const handleVideoEnded = React.useCallback(() => {
    if (autoplay) {
      const currentIndex = videos.findIndex((v) => v.id === videoId);
      const nextIndex = (currentIndex + 1) % videos.length;
      const nextVideo = videos[nextIndex];
      if (nextVideo && nextVideo.id !== videoId) {
        router.push(`/watch/${nextVideo.id}`);
      }
    }
  }, [autoplay, videos, videoId, router]);

  if (isResolving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="h-12 w-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <h2 className="text-lg font-semibold text-white">Loading Video Stream...</h2>
        <p className="text-xs text-slate-400 mt-1">Connecting to global video catalog</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Film className="h-8 w-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Video Not Found</h2>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          The video stream you are looking for may have expired or is unavailable in the library.
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#090a0f] p-4 lg:p-6 max-w-[1920px] mx-auto">
      <div
        className={`flex flex-col ${
          isTheater ? 'space-y-6' : 'xl:flex-row gap-6'
        }`}
      >
        {/* Main Column: Player, Video Info, Comments */}
        <div className={`flex-1 min-w-0 ${isTheater ? 'w-full' : ''}`}>
          {/* Custom Branded Player with Multi-Server Switcher */}
          <CustomVideoPlayer
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            isHls={video.isHls}
            streamServers={video.streamServers}
            title={video.title || 'Video Player'}
            onEnded={handleVideoEnded}
            isTheater={isTheater}
            onToggleTheater={() => setIsTheater(!isTheater)}
          />

          {/* Video Metadata & Actions */}
          <VideoMeta video={video} />

          {/* Interactive Comments Section */}
          <CommentsSection videoId={video.id} />
        </div>

        {/* Right Sidebar: Up Next & Recommended */}
        <div className={`${isTheater ? 'w-full xl:max-w-md' : 'w-full xl:w-96 2xl:w-[420px] flex-shrink-0'}`}>
          <UpNextSidebar currentVideoId={video.id} />
        </div>
      </div>
    </div>
  );
}
