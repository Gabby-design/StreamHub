'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  Tv,
  Check,
  Loader2,
  Server,
  AlertCircle,
  FastForward,
  Globe,
} from 'lucide-react';

const PLAYBACK_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ja', label: 'Japanese' },
];

interface StreamServerOption {
  name: string;
  url: string;
  isEmbed?: boolean;
  quality?: string;
}

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  isHls?: boolean;
  onEnded?: () => void;
  isTheater?: boolean;
  onToggleTheater?: () => void;
  streamServers?: StreamServerOption[];
  title?: string;
  resolution?: string;
  isUpcoming?: boolean;
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

interface QualityLevel {
  id: number;
  height: number;
  bitrate: number;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  poster,
  isHls = false,
  onEnded,
  isTheater = false,
  onToggleTheater,
  streamServers,
  title = 'Video Player',
  resolution: _resolution,
  isUpcoming = false,
  currentLanguage = 'en',
  onLanguageChange,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const isUpcomingTitle = Boolean(
    isUpcoming ||
      title?.toLowerCase().includes('brand new day') ||
      title?.toLowerCase().includes('upcoming')
  );

  // Auto-default to the first full 1080p/720p stream server, or trailer if upcoming/unreleased
  const getInitialSrc = useCallback(() => {
    if (streamServers && streamServers.length > 0) {
      if (isUpcomingTitle) {
        const trailer = streamServers.find(
          (s) => s.name.toLowerCase().includes('trailer') || s.url.includes('youtube')
        );
        if (trailer) return trailer.url;
      }

      const fullServer = streamServers.find(
        (s) => !s.name.toLowerCase().includes('trailer') && !s.url.includes('youtube')
      );
      if (fullServer) return fullServer.url;
      return streamServers[0].url;
    }
    return src;
  }, [src, streamServers, isUpcomingTitle]);

  const [activeSrc, setActiveSrc] = useState(() => getInitialSrc());

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    const next = getInitialSrc();
    queueMicrotask(() => {
      setActiveSrc((prev) => (prev !== next ? next : prev));
    });
  }, [getInitialSrc]);

  // Shield state: Neutralizes popups when enabled
  const [isSandboxed, setIsSandboxed] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsSandboxed(false);
    });
  }, [activeSrc]);

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

  // Hover thumbnail preview
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState(0);

  // Settings menu states
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [availableLevels, setAvailableLevels] = useState<QualityLevel[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1); // -1 is Auto

  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Format time (mm:ss or hh:mm:ss)
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

  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setHasVideoError(false);
    });
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
        activeSrc.includes('vidrock') ||
        activeSrc.includes('vidy') ||
        activeSrc.includes('vidzee') ||
        activeSrc.includes('viduki') ||
        activeSrc.includes('embed.su') ||
        activeSrc.includes('autoembed') ||
        activeSrc.includes('/embed/') ||
        /^[a-zA-Z0-9_-]{11}$/.test(activeSrc.trim()))
  );

  const isEmbed =
    hasVideoError ||
    Boolean(
      activeServer?.isEmbed ??
      (isExplicitEmbedDomain || !isDirectMedia)
    );

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const clean = url.trim();

    // Strip youtube: prefix
    if (clean.startsWith('youtube:')) {
      const cleanId = clean.replace(/^youtube:/, '').trim();
      return `https://www.youtube-nocookie.com/embed/${cleanId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
    }

    // Direct 11-character video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return `https://www.youtube-nocookie.com/embed/${clean}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
    }

    // Standard YouTube embed link
    if (clean.includes('youtube-nocookie.com/embed') || clean.includes('youtube.com/embed')) {
      const glue = clean.includes('?') ? '&' : '?';
      if (!clean.includes('enablejsapi=1')) {
        return `${clean}${glue}autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
      }
      return clean;
    }

    // Streaming server iframe embeds (VidSrc, MultiEmbed, VidLink, VidFast, VidRock, Vidy, VidZee, EmbedSu, etc.)
    if (
      clean.includes('vidsrc') ||
      clean.includes('multiembed') ||
      clean.includes('2embed') ||
      clean.includes('vidlink') ||
      clean.includes('vidfast') ||
      clean.includes('vidrock') ||
      clean.includes('vidy') ||
      clean.includes('vidzee') ||
      clean.includes('viduki') ||
      clean.includes('embed.su') ||
      clean.includes('autoembed')
    ) {
      return clean;
    }

    // Regex extract 11-char ID from YouTube URLs
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match) {
      const id = match[1];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
    }

    return clean;
  };

  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const clean = url.trim();
    if (clean.startsWith('youtube:')) {
      const id = clean.replace(/^youtube:/, '').trim();
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return clean;
    }
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // Initialize Video & HLS
  useEffect(() => {
    if (isEmbed) {
      queueMicrotask(() => setIsLoading(false));
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    queueMicrotask(() => setIsLoading(true));

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const checkHls = isHls || activeSrc.includes('.m3u8');

    if (checkHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        capLevelToPlayerSize: true,
        startFragPrefetch: true,
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

      hls.on(Hls.Events.ERROR, (_, err) => {
        if (err.fatal) {
          switch (err.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setIsLoading(false);
              setHasVideoError(true);
              break;
          }
        }
      });
    } else if (checkHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = activeSrc;
    } else {
      if (!isEmbed && (activeSrc.startsWith('http://') || activeSrc.startsWith('https://') || activeSrc.startsWith('/'))) {
        video.src = activeSrc;
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleVideoEnd = () => {
      setIsPlaying(false);
      if (onEndedRef.current) onEndedRef.current();
    };
    const handleVideoError = () => {
      setIsLoading(false);
      setHasVideoError(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('error', handleVideoError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeSrc, isHls, isEmbed]);

  // Controls auto-hide on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        if (!showSettings) {
          setShowControls(false);
        }
      }, 3500);
    }
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, []);

  const seekRelative = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), video.duration || 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
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

  // Mobile & Screen Gestures: Double-tap seek, Hold for 2X Speed, Single tap toggle
  const [doubleTapFeedback, setDoubleTapFeedback] = useState<{
    side: 'left' | 'right';
    count: number;
  } | null>(null);
  const [isHoldingFastForward, setIsHoldingFastForward] = useState(false);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });
  const singleTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const doubleTapFeedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startHoldSpeed = useCallback(() => {
    isHoldingRef.current = true;
    setIsHoldingFastForward(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch {
        // no-op
      }
    }
  }, []);

  const endHoldSpeed = useCallback(() => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      setIsHoldingFastForward(false);
      if (videoRef.current) {
        videoRef.current.playbackRate = playbackSpeed;
      }
      return true;
    }
    return false;
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
        // Double tap
        if (singleTapTimeoutRef.current) {
          clearTimeout(singleTapTimeoutRef.current);
          singleTapTimeoutRef.current = null;
        }

        if (relX < 0.38) {
          // Left: rewind 10s
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
          // Right: forward 10s
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
          // Middle tap: toggle play/pause
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
        // Single tap: toggle controls after 280ms
        lastTapRef.current = { time: now, x: relX };
        if (singleTapTimeoutRef.current) clearTimeout(singleTapTimeoutRef.current);
        singleTapTimeoutRef.current = setTimeout(() => {
          setShowControls((prev) => !prev);
        }, 280);
      }
    },
    [endHoldSpeed, seekRelative, togglePlay]
  );

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyJ':
        case 'ArrowLeft':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'KeyL':
        case 'ArrowRight':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.min(volume + 0.1, 1);
            videoRef.current.volume = nextVol;
            setVolume(nextVol);
            setIsMuted(false);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.max(volume - 0.1, 0);
            videoRef.current.volume = nextVol;
            setVolume(nextVol);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, toggleFullscreen, seekRelative, volume]);

  // Handle Seekbar Scrubbing
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = ratio * duration;
  };

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, hoverX / rect.width));
    setHoverPosition(hoverX);
    setHoverTime(ratio * duration);
  };

  const handleQualityChange = (levelIndex: number) => {
    setSelectedQuality(levelIndex);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
    }
    setShowSettings(false);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const isCurrentTrailer =
    activeSrc.includes('youtube') ||
    activeServer?.name.toLowerCase().includes('trailer') ||
    activeServer?.quality === 'HD';

  const upcomingBanner = isUpcomingTitle && (
    <div className="mb-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-200 shadow-xl">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
        </span>
        <div>
          <p className="font-bold text-amber-300 text-sm">Upcoming Theatrical Release</p>
          <p className="text-slate-300 text-xs mt-0.5">
            <strong>{title}</strong> is scheduled for release and is currently unreleased in movie theatres and streaming platforms. Currently streaming official 4K preview. Full 1080p movie servers will activate when the film premieres.
          </p>
        </div>
      </div>
      <Link
        href="/watch/movie-tt9362722"
        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition text-center flex-shrink-0 shadow-lg shadow-indigo-600/30"
      >
        Watch Released Spider-Man (1080p)
      </Link>
    </div>
  );

  if (!isMounted) {
    return (
      <div className="w-full">
        {upcomingBanner}
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

  if (isEmbed) {
    const cleanEmbedUrl = getEmbedUrl(activeSrc);
    const youtubeId = getYouTubeId(activeSrc);

    return (
      <div className="w-full">
        {upcomingBanner}
        <div
          ref={containerRef}
          className={`relative w-full overflow-hidden bg-black select-none ${
            isTheater ? 'aspect-[21/9] max-h-[80vh]' : 'aspect-video rounded-2xl'
          } shadow-2xl border border-white/5`}
        >
          <iframe
            src={cleanEmbedUrl}
            title={title || 'Video Player'}
            suppressHydrationWarning={true}
            loading="eager"
            sandbox={isSandboxed ? 'allow-scripts allow-same-origin allow-forms allow-presentation' : undefined}
            allow="accelerometer *; autoplay *; clipboard-write *; encrypted-media *; fullscreen *; gyroscope *; picture-in-picture *; web-share *"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full border-0"
          />

          {onToggleTheater && (
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={onToggleTheater}
                className="rounded-xl bg-black/60 hover:bg-black/90 p-2 text-white/80 hover:text-white transition backdrop-blur-sm border border-white/10"
                title="Toggle Theater Mode"
              >
                <Tv className={`h-4 w-4 ${isTheater ? 'text-indigo-400' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Stream Status & Mirror Switcher */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#11131a] border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-emerald-400 text-xs">
              Cinema Stream Active
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-[11px]">
              {activeServer?.name || '1080p Stream'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onLanguageChange && (
              <div className="flex items-center gap-1 mr-1">
                <Globe className="h-3.5 w-3.5 text-indigo-400" />
                <select
                  value={currentLanguage || 'en'}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-md px-1.5 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  aria-label="Playback Audio Language"
                >
                  {PLAYBACK_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#11131a] text-white">
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={() => setIsSandboxed(!isSandboxed)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium transition"
              title="Toggle if an embed provider displays a sandbox warning"
            >
              {isSandboxed ? 'Bypass Sandbox' : 'Enable Sandbox'}
            </button>
            {streamServers && streamServers.length > 1 && (
              <button
                onClick={() => {
                  const srvs = streamServers.filter((s) => !s.name.toLowerCase().includes('trailer'));
                  const currentIdx = srvs.findIndex((s) => s.url === activeSrc);
                  const nextSrv = srvs[(currentIdx + 1) % srvs.length];
                  if (nextSrv) {
                    setActiveSrc(nextSrv.url);
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

        {youtubeId && isCurrentTrailer ? (
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent rounded-2xl border border-amber-500/30 text-xs text-slate-200 shadow-lg">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping inline-block flex-shrink-0" />
              <span>
                {isUpcomingTitle
                  ? 'Official Preview: Streaming 4K trailer for this upcoming release.'
                  : 'Currently previewing trailer. Switch to the 1080p Complete Film:'}
              </span>
            </span>
            {!isUpcomingTitle && streamServers && streamServers.find((s) => !s.name.toLowerCase().includes('trailer')) && (
              <button
                onClick={() => {
                  const full = streamServers.find((s) => !s.name.toLowerCase().includes('trailer'));
                  if (full) setActiveSrc(full.url);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                Watch 1080p Full Movie
              </button>
            )}
          </div>
        ) : !isDirectMedia ? (
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span>Server mirror notice: If this mirror shows Error 224003 or is unreleased:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {streamServers?.filter((s) => s.url !== activeSrc && !s.name.toLowerCase().includes('trailer')).slice(0, 2).map((srv, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSrc(srv.url)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition"
                >
                  Switch to {srv.name.split(' ')[1] || srv.name}
                </button>
              ))}
              <button
                onClick={() => {
                  const trailer = streamServers?.find((s) => s.name.toLowerCase().includes('trailer') || s.url.includes('youtube'));
                  if (trailer) setActiveSrc(trailer.url);
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition"
              >
                Play Official Trailer
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full">
      {upcomingBanner}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (isPlaying) setShowControls(false);
          endHoldSpeed();
        }}
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
        className={`relative w-full overflow-hidden bg-black select-none group touch-none ${
          isTheater ? 'aspect-[21/9] max-h-[80vh]' : 'aspect-video rounded-2xl'
        } shadow-2xl border border-white/5`}
      >
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        className="h-full w-full object-contain cursor-pointer"
      />

      {/* 2X Speed YouTube-style Hold Indicator */}
      {isHoldingFastForward && (
        <div className="absolute top-5 inset-x-0 flex items-center justify-center pointer-events-none z-40 animate-in fade-in zoom-in-90 duration-150">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 border border-white/20 backdrop-blur-md shadow-2xl text-white text-xs font-bold tracking-wider uppercase">
            <span>2X Speed</span>
            <FastForward className="h-4 w-4 text-indigo-400 fill-indigo-400 animate-pulse" />
          </div>
        </div>
      )}

      {/* Double Tap Left Ripple (-10s / Rewind) */}
      {doubleTapFeedback?.side === 'left' && (
        <div className="absolute inset-y-0 left-0 w-2/5 flex items-center justify-center pointer-events-none z-30 overflow-hidden">
          <div className="flex flex-col items-center justify-center w-36 h-36 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 shadow-2xl text-white animate-in zoom-in-75 fade-in duration-150">
            <RotateCcw className="h-8 w-8 text-white -rotate-12 transition-transform" />
            <span className="text-white text-xs font-black mt-1 tracking-tight">
              -{doubleTapFeedback.count} seconds
            </span>
          </div>
        </div>
      )}

      {/* Double Tap Right Ripple (+10s / Forward) */}
      {doubleTapFeedback?.side === 'right' && (
        <div className="absolute inset-y-0 right-0 w-2/5 flex items-center justify-center pointer-events-none z-30 overflow-hidden">
          <div className="flex flex-col items-center justify-center w-36 h-36 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 shadow-2xl text-white animate-in zoom-in-75 fade-in duration-150">
            <RotateCw className="h-8 w-8 text-white rotate-12 transition-transform" />
            <span className="text-white text-xs font-black mt-1 tracking-tight">
              +{doubleTapFeedback.count} seconds
            </span>
          </div>
        </div>
      )}

      {/* Buffering Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
        </div>
      )}

      {/* Center Big Play Button Overlay when Paused */}
      {!isPlaying && !isLoading && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition group"
          aria-label="Play video"
        >
          <div className="h-20 w-20 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 group-hover:scale-110 transition-transform">
            <Play className="h-8 w-8 ml-1 fill-white" />
          </div>
        </button>
      )}

      {/* Controls Overlay */}
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Seek Bar with Hover Preview Thumbnail */}
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          onMouseMove={handleProgressBarMouseMove}
          onMouseLeave={() => setHoverPosition(null)}
          className="relative h-2 w-full cursor-pointer rounded-full bg-white/20 group/bar hover:h-3 transition-all duration-150 mb-3"
        >
          {/* Progress bar filled */}
          <div
            className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Scrubbing scrubber knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />

          {/* Hover timestamp tooltip */}
          {hoverPosition !== null && (
            <div
              className="absolute -top-8 -translate-x-1/2 rounded bg-[#0f1219] px-2 py-0.5 text-[11px] font-mono font-medium text-white shadow-lg border border-white/10 pointer-events-none"
              style={{ left: `${hoverPosition}px` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center justify-between text-white text-sm">
          {/* Left Controls: Play, Jump, Volume, Time */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="hover:text-indigo-400 transition"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>

            <button
              onClick={() => seekRelative(-10)}
              className="hover:text-indigo-400 transition hidden sm:block"
              title="Seek backward 10s (J)"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => seekRelative(10)}
              className="hover:text-indigo-400 transition hidden sm:block"
              title="Seek forward 10s (L)"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {/* Volume Controls */}
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="hover:text-indigo-400 transition" aria-label="Mute toggle">
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5 text-rose-400" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
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

            {/* Timestamps */}
            <div className="text-xs text-slate-300 font-mono font-medium">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-slate-500">/</span>
              <span className="text-slate-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Quality/Speed Settings, Theater Mode, Fullscreen */}
          <div className="flex items-center gap-3 sm:gap-4 relative">
            {/* Settings Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1 hover:text-indigo-400 transition ${showSettings ? 'text-indigo-400' : ''}`}
                aria-label="Playback Settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute right-0 bottom-10 w-52 rounded-xl glass-dropdown p-2 shadow-2xl z-50 text-xs text-slate-200">
                  <div className="font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider text-[10px] border-b border-white/10">
                    Playback Speed
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-1">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`rounded px-1.5 py-1 font-mono transition ${
                          playbackSpeed === speed
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  {availableLevels.length > 0 && (
                    <>
                      <div className="font-semibold text-slate-400 px-2 py-1 mt-2 uppercase tracking-wider text-[10px] border-b border-white/10">
                        Resolution (HLS)
                      </div>
                      <div className="p-1 space-y-0.5">
                        <button
                          onClick={() => handleQualityChange(-1)}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded transition ${
                            selectedQuality === -1
                              ? 'bg-indigo-600 text-white font-semibold'
                              : 'hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          <span>Auto (Adaptive)</span>
                          {selectedQuality === -1 && <Check className="h-3.5 w-3.5" />}
                        </button>
                        {availableLevels.map((lvl) => (
                          <button
                            key={lvl.id}
                            onClick={() => handleQualityChange(lvl.id)}
                            className={`w-full flex items-center justify-between px-2 py-1 rounded transition ${
                              selectedQuality === lvl.id
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'hover:bg-white/10 text-slate-300'
                            }`}
                          >
                            <span>{lvl.height}p</span>
                            {selectedQuality === lvl.id && <Check className="h-3.5 w-3.5" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Theater Mode Toggle */}
            {onToggleTheater && (
              <button
                onClick={onToggleTheater}
                className="hover:text-indigo-400 transition hidden md:block"
                title="Toggle Theater Mode"
              >
                <Tv className={`h-5 w-5 ${isTheater ? 'text-indigo-400' : ''}`} />
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="hover:text-indigo-400 transition"
              aria-label={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
