import React, { useState } from 'react';
import { Sparkles, Play, Download, ThumbsUp, RefreshCw, Film, Compass, Heart } from 'lucide-react';
import { Movie, AiRecommendationResult, DownloadedItem } from '../types';
import { MOVIES_CATALOG } from '../data/catalog';

interface AiRecommendationsViewProps {
  onPlayMovie: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
  onStartDownload: (movie: Movie) => void;
  downloadedMovieIds: string[];
}

const PRESET_MOODS = [
  '🔥 Pinoy Action at Barilan sa Quiapo',
  '💖 Umiyak sa Hugot at Romantic Drama',
  '🚀 Mind-Bending Space at Sci-Fi',
  '😂 Tawanan kasama ang Barkada',
  '🍙 High-Octane Anime Sword Battles',
  '👻 Takutan at Philippine Folklore Horror',
  '🌿 Relaxing 4K Nature at Palawan',
];

export const AiRecommendationsView: React.FC<AiRecommendationsViewProps> = ({
  onPlayMovie,
  onSelectMovie,
  onStartDownload,
  downloadedMovieIds,
}) => {
  const [selectedMood, setSelectedMood] = useState(PRESET_MOODS[0]);
  const [customMoodInput, setCustomMoodInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>(
    'Base sa iyong panonood at piniling mood, ito ang pinaka-angkop na mga pelikula at serye na swak sa iyong panlasa.'
  );
  const [recommendations, setRecommendations] = useState<AiRecommendationResult[]>([
    {
      movieId: 'film-manila-heist',
      title: 'Manila Syndicate: Midnight Run',
      matchPercentage: 99,
      reasonTagalog: 'Perpekto para sa gusto mong maaksyon, gritty, at fast-paced na Pinoy chase scenes na may high stakes.',
      reasonEnglish: 'High octane Manila crime thriller with intense pacing.',
      moodTag: 'Adrenaline Rush',
      highlightScene: 'Quiapo Rooftop Shootout',
    },
    {
      movieId: 'film-cyber-tadhana',
      title: 'Cyber Tadhana (Neon Love 2099)',
      matchPercentage: 96,
      reasonTagalog: 'Bagay sa mood mo dahil sa halo ng futuristic metaverse visuals at nakakaantig na kwento ng pag-ibig.',
      reasonEnglish: 'Futuristic sci-fi romance with cyberpunk aesthetic.',
      moodTag: 'Romantic Sci-Fi',
      highlightScene: 'Metaverse hologram rendezvous',
    },
    {
      movieId: 'film-anime-shinigami-blade',
      title: 'Kurogane: Blade of the Eclipse',
      matchPercentage: 94,
      reasonTagalog: 'Top-tier animation at Japanese orchestral combat para sa relaxing yet intense evening binge.',
      reasonEnglish: 'Visually stunning celestial sword combats.',
      moodTag: 'Epic Battles',
      highlightScene: 'Eclipse realm katana duel',
    },
  ]);

  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    const activeMood = customMoodInput.trim() || selectedMood;

    try {
      const response = await fetch('/api/gemini/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferredGenres: ['Action', 'Sci-Fi', 'Pinoy Blockbusters', 'Anime'],
          watchedTitles: ['Manila Syndicate', 'Cyber Tadhana'],
          currentMood: activeMood,
          language: 'tl',
        }),
      });

      const data = await response.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        if (data.aiSummaryTagalog) {
          setAiSummary(data.aiSummaryTagalog);
        }
      }
    } catch (err) {
      console.error('Failed to get Gemini recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 text-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.7 Flash AI Recommendation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
          Personalized AI Streaming Matchmaker
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Sabihin sa AI kung anong nararamdaman o hinahanap mong vibes ngayon, at susuriin ng aming AI model ang pinakabagay na pelikula para sa'yo.
        </p>
      </div>

      {/* Mood Selector Interactive Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
          1. Pumili o I-type ang Mood mo Ngayon:
        </h2>

        {/* Preset Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => {
                setSelectedMood(mood);
                setCustomMoodInput('');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedMood === mood && !customMoodInput
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750 border border-neutral-700/60'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="O mag-type ng sariling trip (e.g. 'Gusto ko ng nakaka-touch na family film na may twist')..."
            value={customMoodInput}
            onChange={(e) => setCustomMoodInput(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
          <button
            id="generate-ai-recs-btn"
            onClick={handleGenerateRecommendations}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Nag-iisip ang AI...' : 'Hanapan Ako'}</span>
          </button>
        </div>
      </div>

      {/* AI Summary Banner */}
      <div className="bg-gradient-to-r from-amber-950/30 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 mb-6 flex items-start gap-3.5 shadow-md">
        <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </span>
        <div className="flex-1">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            Gemini AI Curated Insights
          </h3>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">{aiSummary}</p>
        </div>
      </div>

      {/* Recommended Titles Grid */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const matchedMovie = MOVIES_CATALOG.find((m) => m.id === rec.movieId) || MOVIES_CATALOG[0];
          const isDownloaded = downloadedMovieIds.includes(matchedMovie.id);

          return (
            <div
              key={rec.movieId}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-md group"
            >
              {/* Thumbnail & Title */}
              <div
                onClick={() => onSelectMovie(matchedMovie)}
                className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
              >
                <div className="relative w-24 sm:w-32 aspect-video rounded-xl overflow-hidden bg-black shrink-0">
                  <img
                    src={matchedMovie.backdrop}
                    alt={matchedMovie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 fill-white text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {rec.matchPercentage}% Match
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {rec.moodTag}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                    {matchedMovie.title}
                  </h3>

                  <p className="text-xs text-neutral-300 line-clamp-2 mt-1 italic">
                    "{rec.reasonTagalog}"
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 border-t sm:border-t-0 border-neutral-800 pt-3 sm:pt-0">
                <button
                  onClick={() => onPlayMovie(matchedMovie)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all active:scale-95 shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>I-play</span>
                </button>

                <button
                  onClick={() => onStartDownload(matchedMovie)}
                  className={`p-2 rounded-xl border transition-all ${
                    isDownloaded
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
                  }`}
                  title={isDownloaded ? 'Downloaded Offline' : 'Download for Offline Watching'}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
