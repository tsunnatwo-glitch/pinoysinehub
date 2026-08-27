import React, { useState } from 'react';
import { Play, Info, Download, Check, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onStartDownload: (movie: Movie) => void;
  isDownloaded: boolean;
  isInWatchlist: boolean;
  onToggleWatchlist: (movieId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onPlay,
  onOpenDetails,
  onStartDownload,
  isDownloaded,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full h-[65vh] sm:h-[75vh] max-h-[700px] overflow-hidden">
      {/* Background Image / Video Backdrop */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover object-center scale-105 filter brightness-90 transform transition-transform duration-10000 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {/* Gradients to blend seamlessly into Netflix black */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/40 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col justify-end pb-12 sm:pb-16">
        <div className="max-w-2xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
            {movie.isTop10 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#E50914] text-white text-[11px] font-black tracking-wide uppercase shadow">
                Top 1 in PH Today
              </span>
            )}
            {movie.pinoyPick && (
              <span className="px-2 py-0.5 rounded bg-blue-600/80 text-white text-[11px] font-bold">
                🇵🇭 Pinoy Cinema
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              <Sparkles className="w-3 h-3" />
              {movie.matchScore}% Match for you
            </span>
            <span className="text-[11px] font-medium text-neutral-300 border border-neutral-700 px-1.5 py-0.5 rounded bg-neutral-900/60">
              {movie.maturityRating}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-2 sm:mb-3 font-sans drop-shadow-md">
            {movie.title}
          </h1>

          {/* Tagline / Description */}
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 font-normal leading-relaxed text-shadow max-w-xl">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Play Button */}
            <button
              id="hero-play-btn"
              onClick={() => onPlay(movie)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-extrabold text-sm hover:bg-neutral-200 transition-all shadow-lg active:scale-95"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>I-play Ngayon</span>
            </button>

            {/* More Info Button */}
            <button
              id="hero-info-btn"
              onClick={() => onOpenDetails(movie)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-800/80 text-white font-semibold text-sm hover:bg-neutral-700/80 transition-all backdrop-blur-sm border border-neutral-700 active:scale-95"
            >
              <Info className="w-4 h-4" />
              <span>More Info</span>
            </button>

            {/* Quick Download Button */}
            <button
              id="hero-download-btn"
              onClick={() => onStartDownload(movie)}
              className={`p-2.5 rounded-lg border transition-all active:scale-95 ${
                isDownloaded
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-neutral-850/80 text-neutral-300 border-neutral-700 hover:text-white hover:bg-neutral-700'
              }`}
              title={isDownloaded ? 'Downloaded in offline storage' : 'Download for offline viewing'}
            >
              {isDownloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
