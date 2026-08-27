import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Code,
  Plus,
  AlertCircle,
  X,
  Tv,
  Film,
  CheckCircle2,
  FileImage,
} from 'lucide-react';
import { Movie, AppCategory, ContentType } from '../types';
import { APP_CATEGORIES } from '../data/catalog';

interface AddMovieFormProps {
  onAddMovie: (newMovie: Movie) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AddMovieForm: React.FC<AddMovieFormProps> = ({ onAddMovie, isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AppCategory>('Tagalog Dubbed Movies');
  const [videoUrl, setVideoUrl] = useState('');
  const [posterData, setPosterData] = useState<string>('');
  const [backdropData, setBackdropData] = useState<string>('');
  const [duration, setDuration] = useState('1h 45m');
  const [maturityRating, setMaturityRating] = useState<'G' | 'PG' | 'PG-13' | 'R-16' | 'R-18'>('PG-13');
  const [episodeCount, setEpisodeCount] = useState<number>(8);

  const [posterMode, setPosterMode] = useState<'upload' | 'url'>('upload');
  const [posterUrlInput, setPosterUrlInput] = useState('');
  const [isDraggingPoster, setIsDraggingPoster] = useState(false);
  const [isDraggingBackdrop, setIsDraggingBackdrop] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const posterFileInputRef = useRef<HTMLInputElement>(null);
  const backdropFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Helper to extract clean embed src URL if user pasted full <iframe ... src="...">
  const cleanEmbedUrl = (input: string): string => {
    const trimmed = input.trim();
    if (trimmed.startsWith('<iframe') || trimmed.includes('<iframe')) {
      const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1];
      }
    }
    return trimmed;
  };

  // Helper to compress and convert image file to Base64
  const processImageFile = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Paki-upload ang wastong image file (JPEG, PNG, WEBP, etc).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          callback(compressedDataUrl);
          setErrorMsg('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePosterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        setPosterData(dataUrl);
      });
    }
  };

  const handleBackdropFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        setBackdropData(dataUrl);
      });
    }
  };

  const handlePosterDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPoster(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        setPosterData(dataUrl);
      });
    }
  };

  const handleBackdropDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingBackdrop(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        setBackdropData(dataUrl);
      });
    }
  };

  const isSeries = category === 'Tagalog Dubbed Tv Series' || category === 'Tagalog Anime Series';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPoster = posterData || (posterMode === 'url' ? posterUrlInput.trim() : '');
    const finalEmbed = cleanEmbedUrl(videoUrl);

    if (!title.trim()) {
      setErrorMsg('Kailangan may Pamagat (Title) ang pelikula/series.');
      return;
    }
    if (!finalEmbed) {
      setErrorMsg('Kailangan maglagay ng Video Embed Link o iframe code.');
      return;
    }
    if (!finalPoster) {
      setErrorMsg('Paki-upload ang Poster Image mula sa iyong device.');
      return;
    }

    const contentType: ContentType = isSeries ? 'series' : 'movie';
    const isPinoy = category === 'Pinoy Movies';

    const newMovie: Movie = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      tagline: `Panoorin sa ${category} - Pinoysinehub`,
      description: description.trim() || `Mapapanood ang ${title} sa Pinoysinehub. Mag-enjoy sa pinakamalinaw na HD streaming.`,
      poster: finalPoster,
      backdrop: backdropData || finalPoster,
      duration: isSeries ? `${episodeCount} Episodes` : duration.trim() || '1h 45m',
      year: new Date().getFullYear(),
      rating: '9.2',
      matchScore: 98,
      genres: [category, isSeries ? 'TV Series' : 'Pelikula', isPinoy ? 'Pinoy Blockbuster' : 'Tagalog Dubbed'],
      tags: [category, 'Bagong Upload', 'HD Streaming', 'Tagalog Audio'],
      type: contentType,
      category: category,
      videoUrl: finalEmbed,
      cast: [],
      director: '',
      maturityRating: maturityRating,
      qualityAvailable: ['FHD (1080p)', 'HD (720p)', 'SD (480p)'],
      audioTracks: ['Tagalog Audio'],
      subtitles: [],
      fileSizeMB: isSeries ? 1200 : 650,
      isTop10: false,
      pinoyPick: isPinoy,
      midRollCuePoints: [45, 120],
      ...(isSeries
        ? {
            episodes: Array.from({ length: Math.min(Math.max(episodeCount, 1), 24) }, (_, i) => ({
              id: `ep-custom-${Date.now()}-${i + 1}`,
              episodeNumber: i + 1,
              seasonNumber: 1,
              title: `Kabanata ${i + 1}: ${title}`,
              duration: '45m',
              description: `Panoorin ang episode ${i + 1} ng ${title} sa Pinoysinehub.`,
              thumbnail: backdropData || finalPoster,
              videoUrl: finalEmbed,
              fileSizeMB: 250,
            })),
          }
        : {}),
    };

    onAddMovie(newMovie);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[94vh] overflow-y-auto p-4 sm:p-6 shadow-2xl text-white relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5 pr-8">
          <div className="p-3 rounded-2xl bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40 shrink-0">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 mb-1">
              Upload Poster & Embed Link
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Maglagay ng Pelikula o Series
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Pumili ng kategorya, mag-upload ng Poster Image file mula sa device, at i-paste ang Embed Code / Link.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* CATEGORY SELECTOR (The 5 requested categories) */}
          <div>
            <label className="block text-neutral-200 font-bold mb-2 flex items-center gap-1.5">
              <span>Pumili ng Kategorya (Category) *</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {APP_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#E50914]/20 border-[#E50914] text-white shadow-sm ring-1 ring-[#E50914]'
                        : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-[#E50914] text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {cat.includes('Series') ? <Tv className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs block truncate">{cat}</span>
                      <span className="text-[10px] text-neutral-400">
                        {cat.includes('Series') ? 'Multi-Episode Series' : 'Full Movie'}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E50914] ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-neutral-300 font-bold mb-1.5">
              Pamagat / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Solo Leveling (Tagalog Dub) o One Piece"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* POSTER IMAGE UPLOAD SECTION */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-neutral-200 font-bold flex items-center gap-1.5">
                <FileImage className="w-4 h-4 text-yellow-400" />
                <span>Poster Image (Mag-Upload ng Larawan) *</span>
              </label>
              <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setPosterMode('upload')}
                  className={`px-2 py-1 rounded-md font-bold transition-colors ${
                    posterMode === 'upload' ? 'bg-[#E50914] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPosterMode('url')}
                  className={`px-2 py-1 rounded-md font-bold transition-colors ${
                    posterMode === 'url' ? 'bg-[#E50914] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {posterMode === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={posterFileInputRef}
                  accept="image/*"
                  onChange={handlePosterFileChange}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingPoster(true);
                  }}
                  onDragLeave={() => setIsDraggingPoster(false)}
                  onDrop={handlePosterDrop}
                  onClick={() => posterFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDraggingPoster
                      ? 'border-[#E50914] bg-[#E50914]/10'
                      : posterData
                      ? 'border-emerald-500/50 bg-neutral-950'
                      : 'border-neutral-700 hover:border-neutral-500 bg-neutral-950/60'
                  }`}
                >
                  {posterData ? (
                    <div className="flex items-center gap-4 w-full">
                      <img
                        src={posterData}
                        alt="Poster uploaded"
                        className="w-14 h-20 object-cover rounded-lg border border-emerald-500/40 shadow-md shrink-0 bg-black"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Matagumpay na Na-upload ang Poster!</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate">
                          Handa na ang poster para sa feed at playback screen.
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            posterFileInputRef.current?.click();
                          }}
                          className="mt-2 text-[10px] text-neutral-300 hover:text-white underline"
                        >
                          Palitan ang image file
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="w-10 h-10 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-yellow-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-neutral-200">
                        Pindutin dito para pumili ng larawan mula sa device
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        o i-drag at i-drop ang image file (JPG, PNG, WEBP)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  placeholder="https://example.com/poster.jpg"
                  value={posterUrlInput}
                  onChange={(e) => setPosterUrlInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                />
              </div>
            )}
          </div>

          {/* BACKDROP BANNER UPLOAD (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-neutral-300 font-bold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Backdrop Banner (Opsyonal - Landscape)</span>
              </label>
              <span className="text-[10px] text-neutral-400">Para sa wide player banner</span>
            </div>

            <input
              type="file"
              ref={backdropFileInputRef}
              accept="image/*"
              onChange={handleBackdropFileChange}
              className="hidden"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingBackdrop(true);
              }}
              onDragLeave={() => setIsDraggingBackdrop(false)}
              onDrop={handleBackdropDrop}
              onClick={() => backdropFileInputRef.current?.click()}
              className={`border border-dashed rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                isDraggingBackdrop
                  ? 'border-sky-500 bg-sky-950/20'
                  : backdropData
                  ? 'border-sky-500/50 bg-neutral-950'
                  : 'border-neutral-700 hover:border-neutral-600 bg-neutral-950/40'
              }`}
            >
              {backdropData ? (
                <div className="flex items-center gap-3 w-full">
                  <img
                    src={backdropData}
                    alt="Backdrop"
                    className="w-20 h-10 object-cover rounded border border-sky-500/40"
                  />
                  <span className="text-xs text-sky-300 font-medium">Na-upload ang backdrop banner</span>
                  <span className="text-[10px] text-neutral-400 underline ml-auto">Palitan</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-neutral-400">
                  <Upload className="w-3.5 h-3.5" />
                  <span className="text-xs">Pindutin para mag-upload ng landscape banner (Opsyonal)</span>
                </div>
              )}
            </div>
          </div>

          {/* EMBED LINK / IFRAME CODE */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-neutral-200 font-bold flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Video Embed Link o Embed Code *</span>
              </label>
              <span className="text-[10px] text-neutral-400">Suportado ang iframe o embed URL mula sa video host</span>
            </div>
            <textarea
              rows={2}
              required
              placeholder='I-paste ang Embed URL o buong <iframe> code (hal. https://doodstream.com/e/... o https://streamwish.to/e/...)'
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] font-mono text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-neutral-300 font-bold mb-1.5">
              Kwento / Buod (Synopsis)
            </label>
            <textarea
              rows={2}
              placeholder="Maikling kwento o buod ng palabas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Series Episode Options or Duration */}
          <div>
            {isSeries ? (
              <div>
                <label className="block text-neutral-300 font-bold mb-1.5">
                  Bilang ng Episodes (Season 1)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={episodeCount}
                  onChange={(e) => setEpisodeCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            ) : (
              <div>
                <label className="block text-neutral-300 font-bold mb-1.5">
                  Haba ng Pelikula (Duration)
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700 transition-colors"
            >
              Kanselahin
            </button>
            <button
              id="submit-new-movie-btn"
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#E50914] hover:bg-[#ff202b] text-white font-extrabold shadow-lg shadow-red-950 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>I-save at I-play sa Pinoysinehub</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
