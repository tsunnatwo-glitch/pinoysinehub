export type ContentType = 'movie' | 'series';
export type QualityTier = 'SD (480p)' | 'HD (720p)' | 'FHD (1080p)' | '4K Ultra HD';

export type AppCategory =
  | 'Tagalog Dubbed Movies'
  | 'Tagalog Dubbed Tv Series'
  | 'Tagalog Anime Movies'
  | 'Tagalog Anime Series'
  | 'Pinoy Movies';

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  fileSizeMB: number;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  description: string;
  poster: string;
  backdrop: string;
  duration: string;
  year: number;
  rating: string;
  matchScore: number;
  genres: string[];
  tags: string[];
  type: ContentType;
  category?: AppCategory;
  trailerUrl?: string;
  videoUrl: string;
  cast: string[];
  director: string;
  maturityRating: 'G' | 'PG' | 'PG-13' | 'R-16' | 'R-18';
  qualityAvailable: QualityTier[];
  audioTracks: string[];
  subtitles: string[];
  episodes?: Episode[];
  fileSizeMB: number;
  isTop10?: boolean;
  rank?: number;
  isFeatured?: boolean;
  pinoyPick?: boolean;
  midRollCuePoints?: number[]; // In seconds
}

export interface DownloadedItem {
  id: string;
  movieId: string;
  episodeId?: string;
  title: string;
  subTitle?: string;
  poster: string;
  backdrop: string;
  duration: string;
  quality: QualityTier;
  fileSizeMB: number;
  downloadedAt: number;
  progress: number;
  status: 'downloading' | 'completed' | 'paused' | 'failed';
  videoUrl: string;
  type: ContentType;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  preferredGenres: string[];
  watchlist: string[]; // movie IDs
  likedIds: string[]; // movie IDs
  lovedIds: string[]; // movie IDs
  history: {
    movieId: string;
    watchedAt: number;
    progressPercentage: number;
    lastPositionSec: number;
  }[];
  isPremiumAdFree: boolean;
  language: 'tl' | 'en';
}

export interface VideoAd {
  id: string;
  brand: string;
  tagline: string;
  videoUrl: string;
  durationSec: number;
  skipAfterSec: number;
  clickUrl: string;
  ctaText: string;
  sponsorBadge: string;
  bannerImage?: string;
}

export interface AiRecommendationResult {
  movieId: string;
  title: string;
  matchPercentage: number;
  reasonTagalog: string;
  reasonEnglish: string;
  moodTag: string;
  highlightScene?: string;
}

export interface AdMetrics {
  impressions: number;
  clicks: number;
  revenueEstUSD: number;
  videoAdsCompleted: number;
}
