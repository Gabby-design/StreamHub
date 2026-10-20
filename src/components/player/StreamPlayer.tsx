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
  Server,
  RotateCcw,
  RotateCw,
  FastForward,
} from 'lucide-react';

interface StreamServerOption {
  name: string;
  url: string;
  isEmbed?: boolean;
  quality?: string;
}

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
  streamServers?: StreamServerOption[];
  resolution?: string;
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
  streamServers,
  resolution,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [audioTrack, setAudioTrack] = useState<'sub' | 'dub'>(initialAudioTrack);

  // Auto-default to the first full 1080p/720p stream server instead of trailer
  const getInitialSrc = useCallback(() => {
    if (audioTrack === 'dub' && dubSrc) return dubSrc;
    if (streamServers && streamServers.length > 0) {
      const fullServer = streamServers.find(
        (s) => !s.name.toLowerCase().includes('trailer') && !s.url.includes('youtube')
      );
      if (fullServer) return fullServer.url;
      return streamServers[0].url;
    }
    return src;
  }, [src, dubSrc, audioTrack, streamServers]);

  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setActiveSrc(getInitialSrc());
  }, [getInitialSrc]);

  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    setHasVideoError(false);
  }, [activeSrc]);

  // Shield state: Absorbs first ad-trigger click & neutralizes popups
  const isVidLinkHost = Boolean(activeSrc?.includes('vidlink.pro'));
  const [absorbClick, setAbsorbClick] = useState(true);
  const [isSandboxed, setIsSandboxed] = useState(!isVidLinkHost);
  const [directTouchMode, setDirectTouchMode] = useState(false);

  useEffect(() => {
    setAbsorbClick(true);
    const isVl = Boolean(activeSrc?.includes('vidlink.pro'));
    setIsSandboxed(!isVl);
    setDirectTouchMode(false);
  }, [activeSrc]);

  const activeServer = streamServers?.find((s) => s.url === activeSrc);

  const isDirectMedia = Boolean(
    activeSrc &&
      (activeSrc.endsWith('.mp4') ||
        activeSrc.includes('.mp4?') ||
        activeSrc.endsWith('.m3u8') ||
        activeSrc.includes('.m3u8?') ||
        activeSrc.endsWith('.webm') ||
        activeSrc.includes('.webm?') ||
        activeSrc.endsWith('.ogg') ||
        activeSrc.includes('.ogg?') ||
        activeSrc.startsWith('blob:') ||
        activeSrc.startsWith('data:video'))
  );

  const isExplicitEmbedDomain = Boolean(
    activeSrc &&
      (activeSrc.startsWith('youtube:') ||
        activeSrc.includes('youtube.com') ||
        activeSrc.includes('youtu.be') ||
        activeSrc.includes('youtube-nocookie.com') ||
        activeSrc.includes('vidsrc') ||
        activeSrc.includes('multiembed') ||
        activeSrc.includes('2embed') ||
        activeSrc.includes('vidlink') ||
        activeSrc.includes('vidfast') ||
        activeSrc.includes('viduki') ||
        activeSrc.includes('embed.su') ||
        activeSrc.includes('autoembed') ||
        activeSrc.includes('/embed/') ||
        /^[a-zA-Z0-9_-]{11}$/.test(activeSrc.trim()))
  );

  const isEmbedMode =
    hasVideoError ||
    Boolean(
      activeServer?.isEmbed ??
      (isExplicitEmbedDomain || !isDirectMedia)
    );

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
    if (track === 'dub' && dubSrc) {
      setActiveSrc(dubSrc);
    } else if (track === 'sub') {
      if (streamServers && streamServers.length > 0) {
        const full = streamServers.find(
          (s) => !s.name.toLowerCase().includes('trailer') && !s.url.includes('youtube')
        );
        setActiveSrc(full ? full.url : streamServers[0].url);
      } else {
        setActiveSrc(src);
      }
    }
  };

  const activeResolution =
    activeServer?.quality ||
    (activeSrc.includes('1080')
      ? '1080p'
      : activeSrc.includes('720')
      ? '720p'
      : resolution || '1080p');

  const isCurrentTrailer =
    activeSrc.includes('youtube') ||
    activeServer?.name.toLowerCase().includes('trailer') ||
    activeServer?.quality === 'HD';

  const handleResolutionSelect = (targetRes: '1080p' | '720p') => {
    if (streamServers && streamServers.length > 0) {
      const match = streamServers.find(
        (s) =>
          (s.quality === targetRes || s.name.includes(targetRes)) &&
          !s.name.toLowerCase().includes('trailer')
      );
      if (match) {
        setActiveSrc(match.url);
        return;
      }
    }
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

    const checkHls = isHls || activeSrc.includes('.m3u8');

    if (checkHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(activeSrc);
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
      video.src = activeSrc;
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
    const handleVideoError = () => {
      setIsLoading(false);
      setHasVideoError(true);
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('timeupdate', handleTime);
    video.addEventListener('waiting', handleWait);
    video.addEventListener('playing', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnd);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('timeupdate', handleTime);
      video.removeEventListener('waiting', handleWait);
      video.removeEventListener('playing', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnd);
      video.removeEventListener('error', handleVideoError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeSrc, isHls, isEmbedMode]);

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

  const [doubleTapFeedback, setDoubleTapFeedback] = useState<{
    side: 'left' | 'right';
    count: number;
  } | null>(null);
  const [isHoldingFastForward, setIsHoldingFastForward] = useState(false);

  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });
  const singleTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const doubleTapFeedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const seekRelative = useCallback(
    (seconds: number) => {
      if (videoRef.current) {
        const target = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
        videoRef.current.currentTime = target;
        setCurrentTime(target);
      }
      try {
        const iframe = containerRef.current?.querySelector('iframe');
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({ method: 'seek', offset: seconds }, '*');
          iframe.contentWindow.postMessage({ type: 'seek', offset: seconds }, '*');
        }
      } catch {
        // cross-origin
      }
    },
    [duration]
  );

  const startHoldSpeed = useCallback(() => {
    setIsHoldingFastForward(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([20, 30, 20]);
      } catch {
        // no-op
      }
    }
  }, []);

  const endHoldSpeed = useCallback(() => {
    let wasHolding = false;
    setIsHoldingFastForward((prev) => {
      wasHolding = prev;
      return false;
    });
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
    return wasHolding;
  }, [playbackSpeed]);

  const handlePointerStart = useCallback(
    (clientX: number, clientY: number) => {
      touchStartPosRef.current = { x: clientX, y: clientY };
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = setTimeout(() => {
        startHoldSpeed();
      }, 350);
    },
    [startHoldSpeed]
  );

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    const dx = Math.abs(clientX - touchStartPosRef.current.x);
    const dy = Math.abs(clientY - touchStartPosRef.current.y);
    if (dx > 15 || dy > 15) {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
    }
  }, []);

  const handlePointerEnd = useCallback(
    (clientX: number) => {
      const wasHolding = endHoldSpeed();
      if (wasHolding) return;

      const now = Date.now();
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width;
      const timeDiff = now - lastTapRef.current.time;

      if (timeDiff < 320) {
        if (singleTapTimeoutRef.current) {
          clearTimeout(singleTapTimeoutRef.current);
          singleTapTimeoutRef.current = null;
        }

        if (relX < 0.38) {
          seekRelative(-10);
          if (doubleTapFeedbackTimeoutRef.current) clearTimeout(doubleTapFeedbackTimeoutRef.current);
          setDoubleTapFeedback((prev) => ({
            side: 'left',
            count: prev?.side === 'left' ? prev.count + 10 : 10,
          }));
          doubleTapFeedbackTimeoutRef.current = setTimeout(() => {
            setDoubleTapFeedback(null);
          }, 750);
        } else if (relX > 0.62) {
          seekRelative(10);
          if (doubleTapFeedbackTimeoutRef.current) clearTimeout(doubleTapFeedbackTimeoutRef.current);
          setDoubleTapFeedback((prev) => ({
            side: 'right',
            count: prev?.side === 'right' ? prev.count + 10 : 10,
          }));
          doubleTapFeedbackTimeoutRef.current = setTimeout(() => {
            setDoubleTapFeedback(null);
          }, 750);
        } else {
          togglePlay();
        }

        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(30);
          } catch {
            // no-op
          }
        }

        lastTapRef.current = { time: 0, x: 0 };
      } else {
        lastTapRef.current = { time: now, x: relX };
        if (singleTapTimeoutRef.current) clearTimeout(singleTapTimeoutRef.current);
        singleTapTimeoutRef.current = setTimeout(() => {
          setShowControls((prev) => !prev);
        }, 280);
      }
    },
    [endHoldSpeed, seekRelative, togglePlay]
  );

  const serverSelectorBar = (
    <div className="mb-3 rounded-2xl bg-[#11131a]/85 border border-white/10 p-3 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Live Stream Status & Current Resolution Indicator */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/30 text-xs shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-extrabold text-emerald-400 uppercase tracking-wider">
            {activeResolution} Full HD
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-200 font-medium truncate max-w-[160px] sm:max-w-xs">
            {activeServer?.name || (isCurrentTrailer ? 'Official Preview' : 'Complete 1080p Episode')}
          </span>
        </div>

        {/* Quick Resolution Switcher Buttons (1080p / 720p) */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <span className="text-[10px] font-bold text-slate-400 uppercase px-1.5 tracking-wider">
            Quality:
          </span>
          {(['1080p', '720p'] as const).map((res) => {
            const isResActive = activeResolution === res;
            return (
              <button
                key={res}
                onClick={() => handleResolutionSelect(res)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  isResActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/40 ring-1 ring-white/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title={`Switch playback to ${res}`}
              >
                {res}
                {isResActive && <Check className="h-3 w-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stream Servers Carousel */}
      {streamServers && streamServers.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 flex-shrink-0 mr-1">
            <Server className="h-3.5 w-3.5 text-indigo-400" />
            Servers:
          </span>
          {streamServers.map((srv, idx) => {
            const isSelected = activeSrc === srv.url;
            const isTrailerSrv = srv.name.toLowerCase().includes('trailer');

            return (
              <button
                key={idx}
                onClick={() => setActiveSrc(srv.url)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex-shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-1 ring-white/20'
                    : isTrailerSrv
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <span>{srv.name}</span>
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  if (!isMounted) {
    return (
      <div className="w-full">
        {serverSelectorBar}
        <div
          className={`relative w-full overflow-hidden bg-neutral-900 select-none ${
            isTheater ? 'aspect-[21/9] max-h-[80vh]' : 'aspect-video rounded-2xl'
          } shadow-2xl border border-white/5 animate-pulse flex items-center justify-center`}
        >
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full">
      {serverSelectorBar}

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
          <div className="relative w-full h-full">
            <iframe
              src={getEmbedUrl(activeSrc)}
              title={title || 'Video Player'}
              suppressHydrationWarning={true}
              sandbox={isSandboxed ? 'allow-scripts allow-same-origin allow-forms allow-presentation' : undefined}
              allow="autoplay; fullscreen; picture-in-picture"
              referrerPolicy="no-referrer"
              allowFullScreen
              className="h-full w-full border-0"
            />

            {/* Mobile Touch Gesture Overlay */}
            {!directTouchMode && (
              <div
                className="absolute inset-0 z-10 select-none touch-none"
                onTouchStart={(e) => {
                  if (e.touches.length > 0) {
                    handlePointerStart(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length > 0) {
                    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchEnd={(e) => {
                  if (e.changedTouches.length > 0) {
                    handlePointerEnd(e.changedTouches[0].clientX);
                  }
                }}
                onMouseDown={(e) => {
                  if (e.button === 0) {
                    handlePointerStart(e.clientX, e.clientY);
                  }
                }}
                onMouseUp={(e) => {
                  if (e.button === 0) {
                    handlePointerEnd(e.clientX);
                  }
                }}
              />
            )}

            {/* 2X Speed YouTube-style Hold Indicator */}
            {isHoldingFastForward && (
              <div className="absolute top-5 inset-x-0 flex items-center justify-center pointer-events-none z-40 animate-in fade-in zoom-in-90 duration-150">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 border border-white/20 backdrop-blur-md shadow-2xl text-white text-xs font-bold tracking-wider uppercase">
                  <span>2X Speed</span>
                  <FastForward className="h-4 w-4 text-indigo-400 fill-indigo-400 animate-pulse" />
                </div>
              </div>
            )}

            {/* Double Tap Visual Ripple Feedback */}
            {doubleTapFeedback && (
              <div
                className={`absolute inset-y-0 ${
                  doubleTapFeedback.side === 'left' ? 'left-0' : 'right-0'
                } w-1/3 flex items-center justify-center pointer-events-none z-30`}
              >
                <div className="flex flex-col items-center gap-2 px-5 py-4 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white animate-in zoom-in-50 duration-200">
                  {doubleTapFeedback.side === 'left' ? (
                    <RotateCcw className="h-8 w-8 text-indigo-400 animate-spin-reverse" />
                  ) : (
                    <RotateCw className="h-8 w-8 text-indigo-400 animate-spin" />
                  )}
                  <span className="text-xs font-black tracking-wider">
                    {doubleTapFeedback.side === 'left' ? '-' : '+'}
                    {doubleTapFeedback.count}s
                  </span>
                </div>
              </div>
            )}

            {/* Floating Navigation Player Controls HUD */}
            <div
              className={`absolute bottom-3 inset-x-3 z-20 flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 transition-opacity duration-200 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => seekRelative(-10)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition"
                  title="Rewind 10s (Double tap left side)"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-indigo-400" />
                  <span>-10s</span>
                </button>
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                  title="Play / Pause"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => seekRelative(10)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition"
                  title="Fast Forward 10s (Double tap right side)"
                >
                  <span>+10s</span>
                  <RotateCw className="h-3.5 w-3.5 text-indigo-400" />
                </button>
                <button
                  onMouseDown={startHoldSpeed}
                  onMouseUp={endHoldSpeed}
                  onTouchStart={startHoldSpeed}
                  onTouchEnd={endHoldSpeed}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition"
                  title="Hold for 2X Speed"
                >
                  <FastForward className="h-3 w-3 text-indigo-400" />
                  <span>2X</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                  {activeResolution} Full HD
                </span>
                <button
                  onClick={() => setDirectTouchMode(!directTouchMode)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition ${
                    directTouchMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                  title="Toggle between gesture shield mode and direct embed interaction"
                >
                  {directTouchMode ? 'Direct Touch' : 'Shield Mode'}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                  title="Toggle Fullscreen"
                >
                  <Maximize className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
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

      {/* Quick Switch to 1080p Episode Banner if on trailer */}
      {isCurrentTrailer && (
        <div className="mt-3 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent rounded-2xl border border-amber-500/30 text-xs text-slate-200 shadow-lg">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>
              Currently previewing trailer. Switch to the <strong>1080p Complete Episode</strong>:
            </span>
          </span>
          {streamServers && streamServers.find((s) => !s.name.toLowerCase().includes('trailer')) && (
            <button
              onClick={() => {
                const full = streamServers.find((s) => !s.name.toLowerCase().includes('trailer'));
                if (full) setActiveSrc(full.url);
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              Watch 1080p Full Episode
            </button>
          )}
        </div>
      )}

      {/* Stream Shield Status & Switch Server Bar */}
      {isEmbedMode && (
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#11131a] border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-emerald-400 text-xs">
              Stream Shield Active
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-[11px]">
              {isSandboxed ? 'Strict sandbox mode active' : 'Click-shield active • Popups & redirects blocked'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSandboxed(!isSandboxed)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium transition"
              title="Toggle sandbox mode if provider requests it"
            >
              {isSandboxed ? 'Disable Sandbox' : 'Enable Sandbox'}
            </button>
            {streamServers && streamServers.length > 1 && (
              <button
                onClick={() => {
                  const srvs = streamServers.filter((s) => !s.name.toLowerCase().includes('trailer'));
                  const currentIdx = srvs.findIndex((s) => s.url === activeSrc);
                  const nextSrv = srvs[(currentIdx + 1) % srvs.length];
                  if (nextSrv) {
                    setActiveSrc(nextSrv.url);
                    setAbsorbClick(true);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-[11px] border border-indigo-500/30 transition flex items-center gap-1.5"
              >
                <Server className="h-3 w-3" />
                <span>Switch Server</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
