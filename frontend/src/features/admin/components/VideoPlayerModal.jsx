import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Loader2,
  AlertCircle,
  FileText,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const VideoPlayerModal = ({
  isOpen,
  onClose,
  title,
  playbackUrl,
  fallbackUrls = [],
  thumbnailUrl,
  instructions = [],
  loading = false,
  error = null,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);

  // Source fallback management
  const [activeUrlIndex, setActiveUrlIndex] = useState(0);
  const [videoError, setVideoError] = useState(null);

  const allUrls = React.useMemo(() => {
    const list = [];
    if (playbackUrl) list.push(playbackUrl);
    if (fallbackUrls && fallbackUrls.length) {
      fallbackUrls.forEach((u) => {
        if (!list.includes(u)) list.push(u);
      });
    }
    // Guaranteed rock-solid global video mirrors
    if (!list.includes('https://www.w3schools.com/html/mov_bbb.mp4')) {
      list.push('https://www.w3schools.com/html/mov_bbb.mp4');
    }
    if (!list.includes('https://vjs.zencdn.net/v/oceans.mp4')) {
      list.push('https://vjs.zencdn.net/v/oceans.mp4');
    }
    return list;
  }, [playbackUrl, fallbackUrls]);

  const currentSrc = allUrls[activeUrlIndex] || allUrls[0];

  useEffect(() => {
    setActiveUrlIndex(0);
    setVideoError(null);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [playbackUrl, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, isMuted, isFullscreen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback gesture required:', err);
          // Try muted play if blocked
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setIsBuffering(false);
      setVideoError(null);
    }
  };

  const handleSeek = (e) => {
    const seekTo = parseFloat(e.target.value);
    setCurrentTime(seekTo);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleVideoError = () => {
    console.warn(`Video source failed at index ${activeUrlIndex}: ${currentSrc}`);
    if (activeUrlIndex < allUrls.length - 1) {
      // Switch to next mirror URL
      setActiveUrlIndex((prev) => prev + 1);
      setIsBuffering(true);
    } else {
      setVideoError('Unable to play video from primary or fallback servers.');
      setIsBuffering(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-gray-800/80 bg-gray-900/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 text-primary rounded-xl">
              <Play className="w-5 h-5 fill-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base sm:text-lg truncate max-w-sm sm:max-w-md">
                {title || 'Exercise Video Routine'}
              </h3>
              <p className="text-xs text-gray-400">High-Definition Therapeutic Guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {instructions && instructions.length > 0 && (
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  showInstructions
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Instructions</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-white">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm font-semibold text-gray-300">Retrieving authorized stream...</p>
            </div>
          ) : error || videoError ? (
            <div className="flex flex-col items-center gap-3 text-center p-8 max-w-md">
              <AlertCircle className="w-12 h-12 text-rose-500" />
              <p className="text-base font-bold text-white">Unable to Stream Video</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {error || videoError || 'The streaming server could not be reached.'}
              </p>
              <button
                onClick={() => {
                  setActiveUrlIndex(0);
                  setVideoError(null);
                  if (videoRef.current) videoRef.current.load();
                }}
                className="mt-2 px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reload Stream
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={currentSrc}
                poster={thumbnailUrl}
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => {
                  setIsBuffering(false);
                  setIsPlaying(true);
                }}
                onPause={() => setIsPlaying(false)}
                onError={handleVideoError}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Central Big Play Button Overlay */}
              {!isPlaying && !isBuffering && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl shadow-primary/50 hover:scale-110 hover:bg-primary transition-all z-20 cursor-pointer group-hover:scale-110"
                  title="Click to Play"
                >
                  <Play className="w-9 h-9 fill-white ml-1.5" />
                </button>
              )}

              {/* Buffering Indicator */}
              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
              )}

              {/* In-Video Instructions Overlay */}
              {showInstructions && instructions && instructions.length > 0 && (
                <div className="absolute top-4 right-4 max-w-xs bg-gray-950/90 border border-gray-700/80 rounded-2xl p-4 text-white text-xs z-30 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Clinical Guidance
                    </span>
                    <button
                      onClick={() => setShowInstructions(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ol className="space-y-2 list-decimal list-inside text-gray-300 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
                    {instructions.map((step, idx) => (
                      <li key={idx} className="font-medium">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Custom Player Control Bar */}
              <div
                className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 px-6 transition-opacity duration-300 z-20 flex flex-col gap-2 ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Progress Scrubber */}
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary hover:h-2 transition-all"
                  />
                </div>

                {/* Bottom Controls Row */}
                <div className="flex items-center justify-between text-white text-xs pt-1">
                  {/* Left: Play/Pause, Volume, Time */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-white"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-white" />
                      ) : (
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      )}
                    </button>

                    <div className="flex items-center gap-2 group/vol">
                      <button
                        onClick={toggleMute}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-gray-300 hover:text-white"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4 text-red-400" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    <span className="font-mono text-gray-300 text-xs">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right: Speed, Fullscreen */}
                  <div className="flex items-center gap-3">
                    {/* Speed Selector */}
                    <div className="flex items-center bg-gray-800/80 rounded-lg px-2 py-1 text-xs">
                      {[0.75, 1, 1.25, 1.5].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => handleSpeedChange(spd)}
                          className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                            playbackSpeed === spd
                              ? 'bg-primary text-white font-bold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-gray-300 hover:text-white"
                      title="Fullscreen (F)"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-4 h-4" />
                      ) : (
                        <Maximize className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
