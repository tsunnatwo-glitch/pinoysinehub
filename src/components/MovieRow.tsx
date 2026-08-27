import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  isTop10?: boolean;
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  onStartDownload: (movie: Movie) => void;
  downloadedMovieIds: string[];
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  subtitle,
  movies,
  isTop10,
  onSelectMovie,
  onPlayMovie,
  onStartDownload,
  downloadedMovieIds,
  watchlist,
  onToggleWatchlist,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="my-6 sm:my-8 px-4 max-w-6xl mx-auto relative group/row">
      {/* Row Header */}
      <div className="mb-2 sm:mb-3 flex items-baseline justify-between">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            {isTop10 && (
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-[#E50914] text-white">
                PH Top 10
              </span>
            )}
          </h2>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 items-center justify-center rounded-full bg-black/80 text-white border border-neutral-700 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-neutral-800"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={rowRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              rank={isTop10 ? index + 1 : undefined}
              onSelect={onSelectMovie}
              onPlay={onPlayMovie}
              onStartDownload={onStartDownload}
              isDownloaded={downloadedMovieIds.includes(movie.id)}
              isInWatchlist={watchlist.includes(movie.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 items-center justify-center rounded-full bg-black/80 text-white border border-neutral-700 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-neutral-800"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
