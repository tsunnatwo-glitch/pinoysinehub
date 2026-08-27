import React, { useState } from 'react';
import { X, Play, Download, Check, ThumbsUp, Heart, Plus, Sparkles, Trash2 } from 'lucide-react';
import { Movie, Episode, QualityTier } from '../types';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (movie: Movie, episode?: Episode) => void;
  onStartDownload: (movie: Movie, episode?: Episode, quality?: QualityTier) => void;
  downloadedItemIds: string[];
  isInWatchlist: boolean;
  onToggleWatchlist: (movieId: string) => void;
  onRateMovie: (movieId: string, rating: 'like' | 'love' | 'dislike') => void;
  onDeleteMovie?: (movieId: string) => void;
  userRating?: 'like' | 'love' | 'dislike';
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onPlay,
  onStartDownload,
  downloadedItemIds,
  isInWatchlist,
  onToggleWatchlist,
  onRateMovie,
  onDeleteMovie,
  userRating,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<QualityTier>('HD (720p)');
  const [showQualityPicker, setShowQualityPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!movie) return null;

  const isDownloaded = downloadedItemIds.includes(movie.id);

  const handleDownloadClick = (episode?: Episode) => {
    onStartDownload(movie, episode, selectedQuality);
    setShowQualityPicker(false);
  };

  const handleDelete = () => {
    if (confirmDelete && onDeleteMovie) {
      onDeleteMovie(movie.id);
      onClose();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Card */}
      <div
        className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col relative animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 text-white hover:bg-neutral-800 border border-neutral-700 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Banner Header */}
        <div className="relative aspect-video max-h-72 sm:max-h-80 w-full overflow-hidden bg-black">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

          {/* Quick Play Floating Action */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-white drop-shadow-md">{movie.title}</h2>
              {movie.category && (
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#E50914] text-white">
                  {movie.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="detail-play-btn"
              onClick={() => onPlay(movie)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-extrabold text-sm hover:bg-neutral-200 transition-all shadow-md active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>I-play Ngayon</span>
            </button>

            {/* Download Button */}
            <div className="relative">
              <button
                id="detail-download-btn"
                onClick={() => setShowQualityPicker(!showQualityPicker)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-xs sm:text-sm transition-all ${
                  isDownloaded
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                    : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                {isDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                <span>{isDownloaded ? 'Downloaded Offline' : 'I-download Offline'}</span>
              </button>

              {/* Quality Picker Dropdown */}
              {showQualityPicker && (
                <div className="absolute top-full mt-2 left-0 z-40 w-56 bg-neutral-950 border border-neutral-700 rounded-xl p-3 shadow-2xl space-y-2">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Pumili ng Download Quality
                  </div>
                  {movie.qualityAvailable.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => {
                        setSelectedQuality(quality);
                        handleDownloadClick();
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedQuality === quality
                          ? 'bg-[#E50914] text-white'
                          : 'bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                      }`}
                    >
                      <span>{quality}</span>
                      <span className="text-[10px] opacity-80">
                        {quality.includes('4K') ? '~1.2 GB' : quality.includes('1080p') ? '~650 MB' : '~350 MB'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Watchlist Toggle */}
            <button
              onClick={() => onToggleWatchlist(movie.id)}
              className="p-2.5 rounded-lg bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 transition-colors"
              title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
            >
              {isInWatchlist ? <Check className="w-4 h-4 text-red-500" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Rating Buttons */}
            <div className="flex items-center gap-1 bg-neutral-800/90 rounded-lg p-1 border border-neutral-700">
              <button
                onClick={() => onRateMovie(movie.id, 'like')}
                className={`p-1.5 rounded-md transition-colors ${userRating === 'like' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
                title="Like"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRateMovie(movie.id, 'love')}
                className={`p-1.5 rounded-md transition-colors ${userRating === 'love' ? 'bg-red-950/80 text-red-400 border border-red-500/40' : 'text-neutral-400 hover:text-red-400'}`}
                title="Love this!"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Delete / Remove Movie Option */}
            {onDeleteMovie && (
              <div className="ml-auto">
                <button
                  onClick={handleDelete}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                    confirmDelete
                      ? 'bg-red-600 text-white border-red-500 shadow-md animate-pulse'
                      : 'bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border-neutral-700'
                  }`}
                  title="Burahin ang palabas na ito sa Pinoysinehub"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{confirmDelete ? 'Kumpirmahing Burahin?' : 'Burahin'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Metadata Specs */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300">
            <span className="font-bold text-emerald-400">{movie.matchScore}% Match</span>
            <span>{movie.year}</span>
            <span className="border border-neutral-700 px-1.5 py-0.5 rounded text-[11px] font-semibold">{movie.maturityRating}</span>
            <span>{movie.duration}</span>
            <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">HD Streaming</span>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Kuwento / Synopsis</h3>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">{movie.description}</p>
          </div>

          {/* Episodes List (If Series) */}
          {movie.type === 'series' && movie.episodes && (
            <div className="border-t border-neutral-800 pt-4">
              <h3 className="text-sm font-bold text-white mb-3">Episodes (Season 1)</h3>
              <div className="space-y-3">
                {movie.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 transition-colors"
                  >
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      className="w-24 h-16 rounded-lg object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{ep.title}</h4>
                        <span className="text-[11px] text-neutral-400">{ep.duration}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{ep.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onPlay(movie, ep)}
                        className="p-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-all"
                        title="Play Episode"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                      </button>
                      <button
                        onClick={() => handleDownloadClick(ep)}
                        className="p-2 rounded-full bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700"
                        title="Download Episode"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
