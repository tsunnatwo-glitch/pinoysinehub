import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft,
  Settings,
  MessageSquare,
  Sparkles,
  ExternalLink,
  WifiOff,
  SkipForward,
  Lock,
  Unlock,
} from 'lucide-react';
import { Movie, Episode, VideoAd } from '../types';
import { SAMPLE_VIDEO_ADS } from '../data/ads';

interface VideoPlayerProps {
  movie: Movie;
  episode?: Episode;
  isOfflinePlayback?: boolean;
  isPremiumAdFree: boolean;
  onClose: () => void;
  onOpenMonetization: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  movie,
  episode,
  isOfflinePlayback = false,
  isPremiumAdFree,
  onClose,
  onOpenMonetization,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedSubtitle, setSelectedSubtitle] = useState('Filipino');
  const [selectedAudio, setSelectedAudio] = useState(movie.audioTracks[0] || 'Filipino (Original)');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [isScreenLocked, setIsScreenLocked] = useState(false);

  // AVOD Ad state
  const [activeAd, setActiveAd] = useState<VideoAd | null>(null);
  const [adTimeRemaining, setAdTimeRemaining] = useState(0);
  const [canSkipAd, setCanSkipAd] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState(5);
  const [midRollTriggered, setMidRollTriggered] = useState<number[]>([]);

  // Cue points for ads (in seconds)
  const adCuePoints = movie.midRollCuePoints || [45, 120];

  // Start with Pre-Roll Ad if not premium and not offline
  useEffect(() => {
    if (!isPremiumAdFree && !isOfflinePlayback) {
      // Pick a random realistic video ad
      const randomAd = SAMPLE_VIDEO_ADS[Math.floor(Math.random() * SAMPLE_VIDEO_ADS.length)];
      setActiveAd(randomAd);
      setAdTimeRemaining(randomAd.durationSec);
      setSkipCountdown(randomAd.skipAfterSec);
      setCanSkipAd(false);

      // Log ad impression to backend
      fetch('/api/ads/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'impression' }),
      }).catch(() => {});
    }
  }, [isPremiumAdFree, isOfflinePlayback]);

  // Handle Ad Countdown timer
  useEffect(() => {
    if (!activeAd) return;

    const timer = setInterval(() => {
      setAdTimeRemaining((prev) => {
        if (prev <= 1) {
          handleFinishAd();
          return 0;
        }
        return prev - 1;
      });

      setSkipCountdown((prev) => {
        if (prev <= 1) {
          setCanSkipAd(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAd]);

  const handleFinishAd = () => {
    setActiveAd(null);
    // Log ad completion to backend
    fetch('/api/ads/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'complete' }),
    }).catch(() => {});

    // Resume video
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 100);
  };

  const handleSkipAd = () => {
    if (canSkipAd) {
      handleFinishAd();
    }
  };

  const handleAdClick = () => {
    if (activeAd) {
      fetch('/api/ads/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'click' }),
      }).catch(() => {});
      window.open(activeAd.clickUrl, '_blank');
    }
  };

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: any;
    const resetControls = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isPlaying && !activeAd) {
        timeout = setTimeout(() => setShowControls(false), 3500);
      }
    };

    window.addEventListener('mousemove', resetControls);
    window.addEventListener('touchstart', resetControls);

    return () => {
      window.removeEventListener('mousemove', resetControls);
      window.removeEventListener('touchstart', resetControls);
      clearTimeout(timeout);
    };
  }, [isPlaying, activeAd]);

  // Video time update listener & mid-roll ad trigger
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    // Check if we hit a mid-roll cue point
    if (!isPremiumAdFree && !isOfflinePlayback && !activeAd) {
      for (const cue of adCuePoints) {
        if (Math.abs(current - cue) < 1 && !midRollTriggered.includes(cue)) {
          setMidRollTriggered((prev) => [...prev, cue]);
          videoRef.current.pause();
          setIsPlaying(false);
          const nextAd = SAMPLE_VIDEO_ADS[(midRollTriggered.length + 1) % SAMPLE_VIDEO_ADS.length];
          setActiveAd(nextAd);
          setAdTimeRemaining(nextAd.durationSec);
          setSkipCountdown(nextAd.skipAfterSec);
          setCanSkipAd(false);
          break;
        }
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current || activeAd) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current || activeAd) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (timeInSec: number) => {
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const videoSourceUrl = episode ? episode.videoUrl : movie.videoUrl;

  // Determine if videoSourceUrl is an embed link or iframe URL
  const isEmbed =
    videoSourceUrl.includes('iframe') ||
    videoSourceUrl.includes('/e/') ||
    videoSourceUrl.includes('embed') ||
    videoSourceUrl.includes('youtube.com') ||
    videoSourceUrl.includes('youtu.be') ||
    videoSourceUrl.includes('dailymotion.com') ||
    videoSourceUrl.includes('vimeo.com') ||
    videoSourceUrl.includes('doodstream') ||
    videoSourceUrl.includes('streamwish') ||
    videoSourceUrl.includes('filelions') ||
    videoSourceUrl.includes('streamtape') ||
    videoSourceUrl.includes('vidhide') ||
    videoSourceUrl.includes('mp4upload') ||
    !videoSourceUrl.endsWith('.mp4');

  // Extract clean embed url if it's wrapped in iframe
  const getEmbedSrc = (url: string) => {
    const trimmed = url.trim();
    if (trimmed.includes('<iframe')) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) return match[1];
    }
    return trimmed;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Active Video Element or iFrame Embed */}
      {isEmbed && !activeAd ? (
        <div className="w-full h-full flex flex-col bg-black relative">
          <iframe
            src={getEmbedSrc(videoSourceUrl)}
            className="w-full h-full border-0 bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            title={movie.title}
          />
          {/* Floating Back Button for Embed Player */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-40 p-2.5 rounded-full bg-black/80 hover:bg-neutral-800 text-white transition-colors border border-neutral-700 shadow-xl flex items-center gap-1.5 text-xs font-bold"
            aria-label="Back to browse"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bumalik sa Pinoysinehub</span>
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={activeAd ? activeAd.videoUrl : videoSourceUrl}
          className="w-full h-full object-contain cursor-pointer"
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration);
            }
          }}
          onEnded={() => {
            if (activeAd) {
              handleFinishAd();
            } else {
              setIsPlaying(false);
            }
          }}
          onClick={togglePlay}
        />
      )}

      {/* SUBTITLE OVERLAY (Simulated for Netflix feel on native video) */}
      {!isEmbed && !activeAd && selectedSubtitle !== 'Off' && (
        <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none z-20 px-4">
          <span className="bg-black/75 text-white font-semibold text-sm sm:text-base px-3 py-1 rounded shadow-md border border-neutral-800/60 font-sans">
            {selectedSubtitle === 'Filipino'
              ? 'Tandaan mo, walang aatras sa laban na ito.'
              : 'Remember, there is no turning back from this fight.'}
          </span>
        </div>
      )}

      {/* AD BREAK OVERLAY (AVOD Engine) */}
      {activeAd && (
        <div className="absolute inset-0 z-30 pointer-events-auto bg-black/30 flex flex-col justify-between p-4 sm:p-6">
          {/* Top Bar for Ad */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-lg border border-neutral-700">
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-yellow-500 text-black">
                Ad
              </span>
              <span className="text-xs font-bold text-white">{activeAd.sponsorBadge}</span>
            </div>

            <button
              onClick={onOpenMonetization}
              className="text-xs text-neutral-300 hover:text-white bg-black/70 px-3 py-1.5 rounded-lg border border-neutral-700 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Gusto mo bang walang Ads?</span>
            </button>
          </div>

          {/* Bottom Ad Action Banner & Skip Button */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3">
            {/* Clickable Sponsor CTA */}
            <div
              onClick={handleAdClick}
              className="bg-neutral-900/90 border border-neutral-700 rounded-xl p-3 max-w-sm flex items-center gap-3 cursor-pointer hover:border-yellow-400 transition-all shadow-xl"
            >
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{activeAd.brand}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </h4>
                <p className="text-[11px] text-neutral-300 line-clamp-1">{activeAd.tagline}</p>
              </div>
            </div>

            {/* Skip Button / Countdown */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSkipAd}
                disabled={!canSkipAd}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow-xl transition-all ${
                  canSkipAd
                    ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer active:scale-95'
                    : 'bg-black/80 text-neutral-400 border border-neutral-700 cursor-not-allowed'
                }`}
              >
                <span>{canSkipAd ? 'Skip Ad' : `Skip in ${skipCountdown}s`}</span>
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGULAR STREAMING PLAYER CONTROLS (For native video playback) */}
      {!isEmbed && !activeAd && (
        <div
          className={`absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-t from-black/90 via-transparent to-black/80 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                id="player-back-btn"
                onClick={onClose}
                className="p-2 rounded-full bg-black/60 hover:bg-neutral-800 text-white transition-colors border border-neutral-700"
                aria-label="Back to browse"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>{movie.title}</span>
                  {episode && <span className="text-neutral-400 font-normal">• {episode.title}</span>}
                </h3>
                {isOfflinePlayback && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> Offline Playback from Device Storage
                  </span>
                )}
              </div>
            </div>

            {/* Lock Screen & Audio/Subtitles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScreenLocked(!isScreenLocked)}
                className={`p-2 rounded-full text-xs font-semibold border transition-colors ${
                  isScreenLocked
                    ? 'bg-[#E50914] text-white border-[#E50914]'
                    : 'bg-black/60 text-neutral-300 border-neutral-700 hover:text-white'
                }`}
                title={isScreenLocked ? 'Unlock Screen Controls' : 'Lock Screen'}
              >
                {isScreenLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Center Play/Pause & 10s Skips (If not screen locked) */}
          {!isScreenLocked && (
            <div className="flex items-center justify-center gap-8 sm:gap-14">
              <button
                onClick={() => handleSkip(-10)}
                className="p-3 rounded-full bg-black/40 hover:bg-neutral-800/80 text-white transition-all active:scale-90"
                title="10 seconds backward"
              >
                <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <button
                onClick={togglePlay}
                className="p-4 sm:p-5 rounded-full bg-white/95 text-black hover:bg-white transition-all shadow-2xl active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-7 h-7 sm:w-9 sm:h-9 fill-black" /> : <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-black translate-x-0.5" />}
              </button>

              <button
                onClick={() => handleSkip(10)}
                className="p-3 rounded-full bg-black/40 hover:bg-neutral-800/80 text-white transition-all active:scale-90"
                title="10 seconds forward"
              >
                <RotateCw className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          )}

          {/* Bottom Bar: Timeline + Controls */}
          {!isScreenLocked && (
            <div className="space-y-2">
              {/* Timeline with Mid-Roll Cue markers */}
              <div className="relative flex items-center group">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 sm:h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#E50914] z-10"
                />

                {/* Yellow Mid-Roll Ad Markers on timeline (AVOD visual feature) */}
                {!isPremiumAdFree &&
                  !isOfflinePlayback &&
                  duration > 0 &&
                  adCuePoints.map((cue) => (
                    <div
                      key={cue}
                      style={{ left: `${(cue / duration) * 100}%` }}
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400 shadow-sm pointer-events-none z-20"
                      title={`Ad Break at ${formatTime(cue)}`}
                    />
                  ))}
              </div>

              {/* Time display & Additional controls */}
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                        setIsMuted(!isMuted);
                      }
                    }}
                    className="hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Speed Selector */}
                  <button
                    onClick={() => {
                      const speeds = [0.75, 1, 1.25, 1.5];
                      const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(nextSpeed);
                      if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
                    }}
                    className="font-bold hover:text-white px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700"
                  >
                    {playbackSpeed}x
                  </button>

                  {/* Subtitles & Audio Picker */}
                  <button
                    onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                    className={`hover:text-white flex items-center gap-1 ${selectedSubtitle !== 'Off' ? 'text-[#E50914] font-bold' : ''}`}
                    title="Audio & Subtitles"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">Audio & Subs</span>
                  </button>

                  {/* Fullscreen */}
                  <button onClick={toggleFullscreen} className="hover:text-white">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtitles / Audio Selection Modal */}
      {showSubtitleMenu && (
        <div className="absolute inset-0 z-40 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-white text-sm">Audio at Subtitles</h3>
              <button onClick={() => setShowSubtitleMenu(false)} className="text-neutral-400 hover:text-white text-xs">
                Tapos na (Done)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Audio Tracks */}
              <div>
                <h4 className="font-bold text-neutral-400 mb-2">Audio</h4>
                <div className="space-y-1.5">
                  {movie.audioTracks.map((track) => (
                    <button
                      key={track}
                      onClick={() => setSelectedAudio(track)}
                      className={`w-full text-left p-2 rounded-lg ${selectedAudio === track ? 'bg-[#E50914] text-white font-bold' : 'bg-neutral-800 text-neutral-300'}`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtitles */}
              <div>
                <h4 className="font-bold text-neutral-400 mb-2">Subtitles</h4>
                <div className="space-y-1.5">
                  {['Off', ...movie.subtitles].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubtitle(sub)}
                      className={`w-full text-left p-2 rounded-lg ${selectedSubtitle === sub ? 'bg-[#E50914] text-white font-bold' : 'bg-neutral-800 text-neutral-300'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
