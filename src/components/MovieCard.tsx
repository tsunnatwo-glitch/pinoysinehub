import React from 'react';
import { Play, Plus, Check, Download, Info, Sparkles } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  onSelect: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  onStartDownload: (movie: Movie) => void;
  isDownloaded: boolean;
  isInWatchlist: boolean;
  onToggleWatchlist: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  rank,
  onSelect,
  onPlay,
  onStartDownload,
  isDownloaded,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  return (
    <div className="relative group shrink-0 flex items-end">
      {/* Giant Stylized Rank Number for Top 10 */}
      {rank !== undefined && (
        <div className="text-6xl sm:text-7xl md:text-8xl font-black font-sans leading-none select-none text-neutral-800 text-stroke -mr-3 sm:-mr-4 z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          {rank}
        </div>
      )}

      {/* Main Poster Container */}
      <div
        onClick={() => onSelect(movie)}
        className="w-32 sm:w-40 md:w-48 aspect-[2/3] rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800/80 cursor-pointer transition-all duration-300 transform group-hover:scale-105 group-hover:z-20 group-hover:shadow-2xl group-hover:border-neutral-600 relative"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Quality / Pinoy Badge */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
          {movie.pinoyPick && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600/90 text-white shadow-sm">
              🇵🇭 Pinoy
            </span>
          )}
          {isDownloaded && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow-sm flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> Offline
            </span>
          )}
        </div>

        {/* Hover / Overlay Details */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2.5 flex flex-col justify-end">
          <div className="flex items-center gap-1.5 mb-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(movie);
              }}
              className="p-1.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-transform active:scale-90"
              title="Play Now"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(movie.id);
              }}
              className="p-1.5 rounded-full bg-neutral-800/80 text-white border border-neutral-600 hover:border-white transition-colors"
              title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
            >
              {isInWatchlist ? <Check className="w-3.5 h-3.5 text-red-500" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartDownload(movie);
              }}
              className={`p-1.5 rounded-full border transition-colors ${
                isDownloaded
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                  : 'bg-neutral-800/80 text-white border-neutral-600 hover:border-white'
              }`}
              title={isDownloaded ? 'Downloaded Offline' : 'Download for Offline Watching'}
            >
              {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-[11px] font-bold text-white line-clamp-1 leading-tight">{movie.title}</p>
          <div className="flex items-center gap-1.5 text-[9px] text-neutral-300 mt-0.5">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> {movie.matchScore}%
            </span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <span className="border border-neutral-600 px-0.5 rounded">{movie.maturityRating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
