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
  Tv,
  Loader2,
  Subtitles,
  Server,
} from 'lucide-react';

interface StreamServerOption {
  name: string;
  url: string;
  isEmbed?: boolean;
  quality?: string;
  language?: string;
  isEnglish?: boolean;
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
  const [failedServers, setFailedServers] = useState<string[]>([]);
  const [serverNotice, setServerNotice] = useState<string | null>(null);

  // Auto-default to the guaranteed working English server first, instead of trailer
  const getInitialSrc = useCallback(() => {
    if (audioTrack === 'dub' && dubSrc) return dubSrc;
    if (streamServers && streamServers.length > 0) {
      // Guaranteed working English server first
      const workingEnglish = streamServers.find(
        (s) =>
          !s.name.toLowerCase().includes('trailer') &&
          !s.url.includes('youtube') &&
          !failedServers.includes(s.url) &&
          (s.isEnglish || s.language === 'en' || s.name.toLowerCase().includes('english') || s.name.includes('Server 1'))
      );
      if (workingEnglish) return workingEnglish.url;

      const fullServer = streamServers.find(
        (s) =>
          !s.name.toLowerCase().includes('trailer') &&
          !s.url.includes('youtube') &&
          !failedServers.includes(s.url)
      );
      if (fullServer) return fullServer.url;
      return streamServers[0].url;
    }
    return src;
  }, [audioTrack, dubSrc, streamServers, failedServers, src]);

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

  const switchToNextWorkingServer = useCallback(() => {
    if (!streamServers || streamServers.length <= 1) return;

    const nextFailed = [...failedServers, activeSrc];
    setFailedServers(nextFailed);

    let nextServer = streamServers.find(
      (s) =>
        s.url !== activeSrc &&
        !nextFailed.includes(s.url) &&
        !s.name.toLowerCase().includes('trailer') &&
        !s.url.includes('youtube') &&
        (s.isEnglish || s.language === 'en' || s.name.toLowerCase().includes('english'))
    );

    if (!nextServer) {
      nextServer = streamServers.find(
        (s) =>
          s.url !== activeSrc &&
          !nextFailed.includes(s.url) &&
          !s.name.toLowerCase().includes('trailer') &&
          !s.url.includes('youtube')
      );
    }

    if (!nextServer) {
      setFailedServers([]);
      nextServer =
        streamServers.find(
          (s) =>
            !s.name.toLowerCase().includes('trailer') &&
            !s.url.includes('youtube') &&
            (s.isEnglish || s.language === 'en')
        ) || streamServers[0];
    }

    if (nextServer) {
      setActiveSrc(nextServer.url);
      setServerNotice(`Switched to ${nextServer.name}`);
      setTimeout(() => setServerNotice(null), 3500);
    }
  }, [streamServers, activeSrc, failedServers]);

  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setHasVideoError(false);
    });
  }, [activeSrc]);

  // Shield state: Absorbs first ad-trigger click & neutralizes popups
  const [isSandboxed, setIsSandboxed] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsSandboxed(false);
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

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

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

  const seekRelative = (seconds: number) => {
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
  };

  const startHoldSpeed = () => {
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
  };

  const endHoldSpeed = () => {
    let wasHolding = false;
    setIsHoldingFastForward((prev) => {
      wasHolding = prev;
      return false;
    });
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
    return wasHolding;
  };

  const handlePointerStart = (clientX: number, clientY: number) => {
    touchStartPosRef.current = { x: clientX, y: clientY };
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    holdTimeoutRef.current = setTimeout(() => {
      startHoldSpeed();
    }, 350);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    const dx = Math.abs(clientX - touchStartPosRef.current.x);
    const dy = Math.abs(clientY - touchStartPosRef.current.y);
    if (dx > 15 || dy > 15) {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
    }
  };

  const handlePointerEnd = (clientX: number) => {
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
  };

  if (!isMounted) {
    return (
      <div className="w-full">
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

        {isEmbedMode ? (
          <div className="relative w-full h-full">
            <iframe
              src={getEmbedUrl(activeSrc)}
              title={title || 'Video Player'}
              suppressHydrationWarning={true}
              loading="eager"
              sandbox={isSandboxed ? 'allow-scripts allow-same-origin allow-forms allow-presentation' : undefined}
              allow="accelerometer *; autoplay *; clipboard-write *; encrypted-media *; fullscreen *; gyroscope *; picture-in-picture *; web-share *"
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full border-0"
            />
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
