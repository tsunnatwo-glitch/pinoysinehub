import React, { useState } from 'react';
import { Search, X, Play, Download, Sparkles, Film, ArrowRight } from 'lucide-react';
import { Movie } from '../types';
import { MOVIES_CATALOG, GENRE_CATEGORIES } from '../data/catalog';

interface SearchModalProps {
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  onStartDownload: (movie: Movie) => void;
  downloadedMovieIds: string[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  onClose,
  onSelectMovie,
  onPlayMovie,
  onStartDownload,
  downloadedMovieIds,
}) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Filter logic
  const filteredMovies = MOVIES_CATALOG.filter((movie) => {
    const matchesTag =
      selectedTag === 'All' ||
      movie.category === selectedTag ||
      movie.genres.some((g) => selectedTag.toLowerCase().includes(g.toLowerCase())) ||
      (selectedTag === 'Pinoy Movies' && movie.pinoyPick) ||
      (selectedTag === 'Tagalog Dubbed Movies' && movie.tags?.includes('Tagalog Dubbed') && movie.type === 'movie') ||
      (selectedTag === 'Tagalog Dubbed Tv Series' && movie.type === 'series' && !movie.genres?.includes('Anime')) ||
      (selectedTag === 'Tagalog Anime Movies' && movie.genres?.includes('Anime') && movie.type === 'movie') ||
      (selectedTag === 'Tagalog Anime Series' && movie.genres?.includes('Anime') && movie.type === 'series');

    if (!query.trim()) return matchesTag;

    const q = query.toLowerCase();
    const matchesText =
      movie.title.toLowerCase().includes(q) ||
      movie.description.toLowerCase().includes(q) ||
      movie.cast.some((c) => c.toLowerCase().includes(q)) ||
      movie.tags.some((t) => t.toLowerCase().includes(q)) ||
      movie.director.toLowerCase().includes(q);

    return matchesTag && matchesText;
  });

  const handleAiSmartSearch = async () => {
    if (!query.trim()) return;
    setIsAiSearching(true);
    try {
      const res = await fetch('/api/gemini/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.interpretation) {
        setAiInterpretation(data.interpretation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top Search Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Maghanap ng pelikula, serye, artista, o tema (e.g. 'Pinoy action sa Quiapo' o 'Sci-fi romance')..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setAiInterpretation(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSmartSearch()}
              autoFocus
              className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] shadow-xl"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setAiInterpretation(null);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={handleAiSmartSearch}
            disabled={!query.trim() || isAiSearching}
            className="hidden sm:flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md shrink-0 disabled:opacity-40"
            title="Ask Gemini AI to search intent"
          >
            <Sparkles className={`w-4 h-4 ${isAiSearching ? 'animate-spin' : ''}`} />
            <span>AI Search</span>
          </button>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 transition-colors shrink-0"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Interpretation Banner */}
        {aiInterpretation && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{aiInterpretation}</span>
          </div>
        )}

        {/* Quick Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
          {GENRE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedTag(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
                selectedTag === cat
                  ? 'bg-white text-black font-bold'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pb-20">
          {filteredMovies.map((movie) => {
            const isDownloaded = downloadedMovieIds.includes(movie.id);

            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 cursor-pointer hover:border-neutral-600 transition-all hover:scale-102 shadow-lg"
              >
                <div className="aspect-[2/3] w-full relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                  {movie.pinoyPick && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow">
                      🇵🇭 Pinoy
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{movie.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                    <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
                    <span>{movie.duration}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayMovie(movie);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      <span>Play</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartDownload(movie);
                      }}
                      className={`p-1.5 rounded-lg border text-xs ${
                        isDownloaded
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                      }`}
                      title="Download offline"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
