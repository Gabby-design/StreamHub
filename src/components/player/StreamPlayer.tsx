'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Tv,
  Check,
  Loader2,
  Globe,
  Subtitles,
  ExternalLink,
} from 'lucide-react';

interface StreamPlayerProps {
  src: string;
  dubSrc?: string;
  title: string;
  englishTitle?: string;
  poster?: string;
  isHls?: boolean;
  subtitlesUrl?: string;
  onEnded?: () => void;
  isTheater?: boolean;
  onToggleTheater?: () => void;
  initialAudioTrack?: 'sub' | 'dub';
  onAudioTrackChange?: (track: 'sub' | 'dub') => void;
}

interface QualityLevel {
  id: number;
  height: number;
  bitrate: number;
}

export const StreamPlayer: React.FC<StreamPlayerProps> = ({
  src,
  dubSrc,
  title,
  englishTitle,
  poster,
  isHls = false,
  subtitlesUrl,
  onEnded,
  isTheater = false,
  onToggleTheater,
  initialAudioTrack = 'sub',
  onAudioTrackChange,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [audioTrack, setAudioTrack] = useState<'sub' | 'dub'>(initialAudioTrack);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Active stream URL based on Sub vs Dub
  const activeStreamUrl = audioTrack === 'dub' && dubSrc ? dubSrc : src;
  const isEmbedMode =
    activeStreamUrl.startsWith('youtube:') ||
    activeStreamUrl.includes('youtube.com') ||
    activeStreamUrl.includes('youtu.be') ||
    activeStreamUrl.includes('youtube-nocookie.com') ||
    /^[a-zA-Z0-9_-]{11}$/.test(activeStreamUrl.trim()) ||
    (activeStreamUrl.startsWith('http') && !activeStreamUrl.includes('.m3u8') && !activeStreamUrl.includes('.mp4'));

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  // Hover thumbnail preview
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState(0);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [availableLevels, setAvailableLevels] = useState<QualityLevel[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);

  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const handleAudioSwitch = (track: 'sub' | 'dub') => {
    setAudioTrack(track);
    if (onAudioTrackChange) onAudioTrackChange(track);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const clean = url.trim();
    if (clean.startsWith('youtube:')) {
      const id = clean.replace(/^youtube:/, '').trim();
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0`;
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return `https://www.youtube-nocookie.com/embed/${clean}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0`;
    }
    if (clean.includes('youtube-nocookie.com/embed') || clean.includes('youtube.com/embed')) {
      const glue = clean.includes('?') ? '&' : '?';
      if (!clean.includes('enablejsapi=1')) {
        return `${clean}${glue}autoplay=1&enablejsapi=1&modestbranding=1&rel=0`;
      }
      return clean;
    }
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0`;
    }
    return clean;
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const hrs = Math.floor(timeInSeconds / 3600);
    const mins = Math.floor((timeInSeconds % 3600) / 60);
    const secs = Math.floor(timeInSeconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Direct Stream & HLS player setup
  useEffect(() => {
    if (isEmbedMode) {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const checkHls = isHls || activeStreamUrl.includes('.m3u8');

    if (checkHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(activeStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLoading(false);
        const levels = data.levels.map((lvl, index) => ({
          id: index,
          height: lvl.height,
          bitrate: lvl.bitrate,
        }));
        setAvailableLevels(levels);
      });
    } else {
      video.src = activeStreamUrl;
    }

    const handleLoaded = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTime = () => setCurrentTime(video.currentTime);
    const handleWait = () => setIsLoading(true);
    const handlePlay = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnd = () => {
      setIsPlaying(false);
      if (onEndedRef.current) onEndedRef.current();
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('timeupdate', handleTime);
    video.addEventListener('waiting', handleWait);
    video.addEventListener('playing', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnd);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('timeupdate', handleTime);
      video.removeEventListener('waiting', handleWait);
      video.removeEventListener('playing', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnd);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeStreamUrl, isHls, isEmbedMode]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * duration;
  };

  if (!isMounted) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-neutral-900 select-none ${
          isTheater ? 'aspect-[21/9] max-h-[80vh]' : 'aspect-video rounded-2xl'
        } shadow-2xl border border-white/5 animate-pulse flex items-center justify-center`}
      >
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-black select-none group ${
        isTheater ? 'aspect-[21/9] max-h-[80vh]' : 'aspect-video rounded-2xl'
      } shadow-2xl border border-white/5`}
    >
      {/* Top Header Bar Overlay: Sub/Dub Switcher & Theater Mode */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Audio Track Toggle: SUB vs DUB */}
          <div className="flex items-center rounded-lg bg-black/60 p-0.5 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => handleAudioSwitch('sub')}
              className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase transition ${
                audioTrack === 'sub'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SUB
            </button>
            <button
              onClick={() => handleAudioSwitch('dub')}
              className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase transition ${
                audioTrack === 'dub'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DUB (English)
            </button>
          </div>

          <span className="hidden sm:inline-block text-xs font-semibold text-slate-200 truncate max-w-sm ml-2 drop-shadow">
            {audioTrack === 'dub' && englishTitle ? englishTitle : title}
          </span>
        </div>

        {onToggleTheater && (
          <button
            onClick={onToggleTheater}
            className="rounded-lg bg-black/60 hover:bg-black/90 p-2 text-white/80 hover:text-white transition backdrop-blur-md border border-white/10"
            title="Toggle Theater Mode"
          >
            <Tv className={`h-4 w-4 ${isTheater ? 'text-indigo-400' : ''}`} />
          </button>
        )}
      </div>

      {/* Mode 1: Trailer / External Embed Mode */}
      {isEmbedMode ? (
        <iframe
          src={getEmbedUrl(activeStreamUrl)}
          title={title || 'Video Player'}
          suppressHydrationWarning={true}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        /* Mode 2: HLS / Direct HTML5 Stream Mode with Full Custom Controls */
        <>
          <video
            ref={videoRef}
            poster={poster}
            onClick={togglePlay}
            playsInline
            className="h-full w-full object-contain cursor-pointer"
          >
            {subtitlesUrl && subtitlesEnabled && (
              <track
                kind="subtitles"
                src={subtitlesUrl}
                srcLang="en"
                label="English Subtitles"
                default
              />
            )}
          </video>

          {/* Buffering Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
            </div>
          )}

          {/* Big Center Play Icon */}
          {!isPlaying && !isLoading && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition group"
              aria-label="Play video"
            >
              <div className="h-20 w-20 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 ml-1 fill-white" />
              </div>
            </button>
          )}

          {/* Controls Bar */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Seek bar */}
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              className="relative h-2 w-full cursor-pointer rounded-full bg-white/20 group/bar hover:h-3 transition-all duration-150 mb-3"
            >
              <div
                className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 7px)` }}
              />
            </div>

            {/* Bottom Toolbar */}
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="hover:text-indigo-400 transition">
                  {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
                </button>

                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="hover:text-indigo-400 transition">
                    {isMuted || volume === 0 ? <VolumeX className="h-5 w-5 text-rose-400" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setVolume(val);
                      setIsMuted(val === 0);
                      if (videoRef.current) {
                        videoRef.current.volume = val;
                        videoRef.current.muted = val === 0;
                      }
                    }}
                    className="w-16 sm:w-20 h-1.5 rounded-lg appearance-none bg-white/20 cursor-pointer"
                  />
                </div>

                <div className="text-xs text-slate-300 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span className="mx-1 text-slate-500">/</span>
                  <span className="text-slate-400">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 relative">
                {subtitlesUrl && (
                  <button
                    onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    className={`p-1 hover:text-indigo-400 transition ${
                      subtitlesEnabled ? 'text-indigo-400 font-bold' : 'text-slate-500'
                    }`}
                    title="Toggle English Subtitles"
                  >
                    <Subtitles className="h-5 w-5" />
                  </button>
                )}

                <button
                  onClick={toggleFullscreen}
                  className="hover:text-indigo-400 transition"
                  aria-label="Fullscreen"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
