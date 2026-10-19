'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
} from 'lucide-react';

interface StreamServerOption {
  name: string;
  url: string;
  isEmbed?: boolean;
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
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setActiveSrc(src);
  }, [src]);

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

  const isEmbed =
    activeSrc.startsWith('youtube:') ||
    activeSrc.includes('youtube.com') ||
    activeSrc.includes('youtu.be') ||
    activeSrc.includes('vidsrc') ||
    activeSrc.includes('multiembed') ||
    activeSrc.includes('2embed') ||
    activeSrc.includes('youtube-nocookie.com') ||
    /^[a-zA-Z0-9_-]{11}$/.test(activeSrc.trim());

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

    // Streaming server iframe embeds (VidSrc, MultiEmbed, etc.)
    if (clean.includes('vidsrc') || clean.includes('multiembed') || clean.includes('2embed')) {
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
        backBufferLength: 90,
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

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleVideoEnd);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, isHls]);

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

  const serverSelectorBar = streamServers && streamServers.length > 1 && (
    <div className="flex items-center gap-2 mb-3 overflow-x-auto py-1 px-1 no-scrollbar">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
        <Server className="h-3.5 w-3.5 text-indigo-400" />
        Source Server:
      </span>
      {streamServers.map((srv, idx) => {
        const isSelected = activeSrc === srv.url;
        return (
          <button
            key={idx}
            onClick={() => setActiveSrc(srv.url)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition flex-shrink-0 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            {srv.name}
          </button>
        );
      })}
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

  if (isEmbed) {
    const cleanEmbedUrl = getEmbedUrl(activeSrc);
    const youtubeId = getYouTubeId(activeSrc);

    return (
      <div className="w-full">
        {serverSelectorBar}
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
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-full w-full border-0"
          />
          {onToggleTheater && (
            <button
              onClick={onToggleTheater}
              className="absolute top-3 right-3 rounded-xl bg-black/60 hover:bg-black/90 p-2 text-white/80 hover:text-white transition z-20 backdrop-blur-sm border border-white/10"
              title="Toggle Theater Mode"
            >
              <Tv className={`h-4 w-4 ${isTheater ? 'text-indigo-400' : ''}`} />
            </button>
          )}
        </div>

        {youtubeId && (
          <div className="mt-3 flex items-center justify-between px-3.5 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] transition rounded-xl border border-white/5 text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping inline-block" />
              If video fails to embed or is restricted by studio copyright:
            </span>
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition inline-flex items-center gap-1.5 shrink-0 shadow-md"
            >
              Watch on YouTube
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {serverSelectorBar}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className={`relative w-full overflow-hidden bg-black select-none group ${
          isTheater ? 'aspect-[21/9] max-h-[80vh]' : 'aspect-video rounded-2xl'
        } shadow-2xl border border-white/5`}
      >
      <video
        ref={videoRef}
        poster={poster}
        onClick={togglePlay}
        playsInline
        className="h-full w-full object-contain cursor-pointer"
      />

      {/* Buffering Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
        </div>
      )}

      {/* Center Big Play Button Overlay when Paused */}
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

      {/* Controls Overlay */}
      <div
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
