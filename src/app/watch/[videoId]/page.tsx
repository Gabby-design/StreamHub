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
import { ArrowLeft, Film, Tv, Loader2 } from 'lucide-react';
import { buildStreamServers } from '@/lib/movieApi';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params?.videoId as string;

  const { videos, addToHistory, addDiscoveredVideos, autoplay } = useApp();
  const [isTheater, setIsTheater] = useState(false);
  const [dynamicVideo, setDynamicVideo] = useState<Video | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [activeEpisode, setActiveEpisode] = useState(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<any[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  const localVideo = videos.find((v) => v.id === videoId);
  const video = localVideo || dynamicVideo;
  const loggedHistoryRef = useRef<string | null>(null);

  const isTvShow = Boolean(
    video && (
      video.numberOfSeasons ||
      video.episodes?.length ||
      video.mediaType === 'cartoon' ||
      video.mediaType === 'anime' ||
      video.category === 'Anime' ||
      video.id.startsWith('tv-') ||
      video.id.startsWith('anime-')
    )
  );

  // Sync initial episodes from video object
  useEffect(() => {
    if (video?.episodes && video.episodes.length > 0) {
      setSeasonEpisodes(video.episodes);
    } else if (video && (video.numberOfEpisodes || isTvShow)) {
      const epCount = video.numberOfEpisodes || 24;
      const count = Math.min(epCount, 100);
      setSeasonEpisodes(
        Array.from({ length: count }, (_, i) => ({
          id: `${video.id}-s1-e${i + 1}`,
          episodeNumber: i + 1,
          seasonNumber: 1,
          title: `Episode ${i + 1}`,
          overview: `Official 1080p high-definition stream for episode ${i + 1} with English Dub and Sub.`,
          stillUrl: video.thumbnailUrl,
          runtime: 24,
        }))
      );
    }
  }, [video?.episodes, video, isTvShow]);

  // Fetch episodes on season switch
  useEffect(() => {
    if (!video || !video.numberOfSeasons) return;
    if (selectedSeason === 1 && video.episodes && video.episodes.length > 0) {
      setSeasonEpisodes(video.episodes);
      return;
    }

    let isCancelled = false;
    setIsLoadingEpisodes(true);
    fetch(`/api/movies?id=${encodeURIComponent(video.tmdbId || video.id)}&season=${selectedSeason}`)
      .then((r) => r.json())
      .then((data) => {
        if (!isCancelled) {
          if (Array.isArray(data?.episodes) && data.episodes.length > 0) {
            setSeasonEpisodes(data.episodes);
          } else {
            const count = Math.min(video.numberOfEpisodes || 24, 50);
            setSeasonEpisodes(
              Array.from({ length: count }, (_, i) => ({
                id: `${video.id}-s${selectedSeason}-e${i + 1}`,
                episodeNumber: i + 1,
                seasonNumber: selectedSeason,
                title: `Episode ${i + 1}`,
                overview: `Official 1080p high-definition stream for episode ${i + 1} with English Dub and Sub.`,
                stillUrl: video.thumbnailUrl,
                runtime: 24,
              }))
            );
          }
        }
      })
      .catch(() => {
        if (!isCancelled) {
          const count = Math.min(video.numberOfEpisodes || 24, 50);
          setSeasonEpisodes(
            Array.from({ length: count }, (_, i) => ({
              id: `${video.id}-s${selectedSeason}-e${i + 1}`,
              episodeNumber: i + 1,
              seasonNumber: selectedSeason,
              title: `Episode ${i + 1}`,
              overview: `Official 1080p high-definition stream for episode ${i + 1} with English Dub and Sub.`,
              stillUrl: video.thumbnailUrl,
              runtime: 24,
            }))
          );
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingEpisodes(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedSeason, video]);

  // Fallback resolver for direct URLs to dynamic movies/anime
  useEffect(() => {
    if (localVideo) return;

    let isCancelled = false;
    const resolveVideo = async () => {
      setIsResolving(true);
      try {
        // 1. Try direct exact ID lookup first (supports movie-tmdb-*, tv-tmdb-*, anime-tmdb-*, movie-tt*, tt*, and numeric TMDB IDs)
        if (
          videoId.startsWith('movie-') ||
          videoId.startsWith('tv-') ||
          videoId.startsWith('anime-') ||
          videoId.startsWith('tt') ||
          videoId.startsWith('tvmaze-') ||
          /^\d+$/.test(videoId)
        ) {
          const idRes = await fetch(`/api/movies?id=${encodeURIComponent(videoId)}`);
          if (idRes.ok) {
            const data = await idRes.json();
            if (!isCancelled && data.video) {
              setDynamicVideo(data.video);
              addDiscoveredVideos([data.video]);
              return;
            }
          }

          // If direct ID lookup didn't find it, attempt title search
          const cleanQuery = videoId
            .replace(/^movie-tmdb-/, '')
            .replace(/^tv-tmdb-/, '')
            .replace(/^anime-tmdb-/, '')
            .replace(/^movie-/, '')
            .replace(/^tv-/, '')
            .replace(/^anime-/, '')
            .replace(/^tvmaze-/, '')
            .replace(/[-_]+/g, ' ')
            .trim();

          if (cleanQuery && isNaN(Number(cleanQuery))) {
            const res = await fetch(`/api/movies?q=${encodeURIComponent(cleanQuery)}`);
            if (res.ok) {
              const data = await res.json();
              const match = data.videos?.find((v: Video) =>
                v.id === videoId ||
                v.imdbId === videoId ||
                v.title.toLowerCase().includes(cleanQuery.toLowerCase()) ||
                cleanQuery.toLowerCase().includes(v.title.toLowerCase())
              );
              if (!isCancelled && match) {
                setDynamicVideo(match);
                addDiscoveredVideos([match]);
                return;
              }
            }
          }
        }

        // 2. Check anime catalog if not resolved
        if (videoId.startsWith('anime-') || videoId.includes('-')) {
          const rawQuery = videoId.replace('anime-', '').replace(/[-_]+/g, ' ').trim();
          const res = await fetch(`/api/anime?q=${encodeURIComponent(rawQuery)}`);
          if (res.ok) {
            const data = await res.json();
            const match = data.videos?.find((v: Video) =>
              v.id === videoId ||
              v.title.toLowerCase().includes(rawQuery.toLowerCase())
            );
            if (!isCancelled && match) {
              setDynamicVideo(match);
              addDiscoveredVideos([match]);
              return;
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

  const currentStreamServers = React.useMemo(() => {
    if (!video) return undefined;
    if (isTvShow && (video.tmdbId || video.id)) {
      return buildStreamServers(
        video.tmdbId || video.id,
        true,
        video.imdbId,
        video.title,
        selectedSeason,
        activeEpisode
      );
    }
    return video.streamServers;
  }, [isTvShow, video, selectedSeason, activeEpisode]);

  const currentVideoUrl = currentStreamServers?.[0]?.url || video?.videoUrl || '';

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
    <div className="w-full min-h-screen bg-[#090a0f] p-2.5 sm:p-4 lg:p-6 max-w-[1920px] mx-auto overflow-x-hidden min-w-0">
      <div
        className={`flex flex-col ${
          isTheater ? 'space-y-6' : 'xl:flex-row gap-4 sm:gap-6'
        }`}
      >
        {/* Main Column: Player, Video Info, Comments */}
        <div className={`flex-1 min-w-0 ${isTheater ? 'w-full' : ''}`}>
          {/* Custom Branded Player with Multi-Server Switcher */}
          <CustomVideoPlayer
            src={currentVideoUrl}
            poster={video.thumbnailUrl}
            isHls={video.isHls}
            streamServers={currentStreamServers}
            resolution={video.resolution}
            isUpcoming={video.isUpcoming}
            title={
              isTvShow
                ? `${video.title} (S${selectedSeason} E${activeEpisode})`
                : video.title || 'Video Player'
            }
            onEnded={handleVideoEnded}
            isTheater={isTheater}
            onToggleTheater={() => setIsTheater(!isTheater)}
          />

          {/* Episode Browser for TV Series & Cartoons */}
          {isTvShow && (
            <div className="mt-4 rounded-2xl bg-[#11131a] border border-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Tv className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-bold text-white">Episodes & Seasons</span>
                  <span className="text-xs text-indigo-400 font-mono">
                    Playing S{selectedSeason} E{activeEpisode}
                  </span>
                </div>

                {video.numberOfSeasons && video.numberOfSeasons > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {Array.from({ length: video.numberOfSeasons }, (_, i) => i + 1).map((sNum) => (
                      <button
                        key={sNum}
                        onClick={() => {
                          setSelectedSeason(sNum);
                          setActiveEpisode(1);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          selectedSeason === sNum
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        Season {sNum}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isLoadingEpisodes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                </div>
              ) : seasonEpisodes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
                  {seasonEpisodes.map((ep) => {
                    const isEpActive = ep.episodeNumber === activeEpisode;
                    return (
                      <button
                        key={ep.id || ep.episodeNumber}
                        onClick={() => setActiveEpisode(ep.episodeNumber)}
                        className={`flex flex-col text-left rounded-xl p-2 transition group ${
                          isEpActive
                            ? 'bg-indigo-600/20 border border-indigo-500/50 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                            : 'bg-white/5 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-900 mb-2">
                          {ep.stillUrl ? (
                            <img
                              src={ep.stillUrl}
                              alt={ep.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
                              Episode {ep.episodeNumber}
                            </div>
                          )}
                          <div className="absolute top-1.5 left-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            EP {ep.episodeNumber}
                          </div>
                          {isEpActive && (
                            <div className="absolute inset-0 bg-indigo-600/30 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                                NOW PLAYING
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-white truncate leading-tight group-hover:text-indigo-300">
                          {ep.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                          {ep.overview || 'Streaming in 1080p Full HD resolution.'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-3 text-center">
                  Full show streaming on Server 1 to Server 7 above.
                </div>
              )}
            </div>
          )}

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
