import React, { useState } from 'react';
import { ExternalLink, Info, X } from 'lucide-react';
import { SAMPLE_VIDEO_ADS } from '../data/ads';

interface AdBannerProps {
  isPremiumAdFree: boolean;
  onOpenMonetization: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ isPremiumAdFree, onOpenMonetization }) => {
  const [dismissed, setDismissed] = useState(false);
  const [adIndex] = useState(() => Math.floor(Math.random() * SAMPLE_VIDEO_ADS.length));

  if (isPremiumAdFree || dismissed) return null;

  const ad = SAMPLE_VIDEO_ADS[adIndex] || SAMPLE_VIDEO_ADS[0];

  const handleAdClick = () => {
    // Log impression & click to backend
    fetch('/api/ads/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'click' }),
    }).catch(() => {});
    window.open(ad.clickUrl, '_blank');
  };

  return (
    <div className="my-6 px-4 max-w-6xl mx-auto">
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-neutral-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        {/* Ad Tag badge */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {ad.bannerImage && (
            <img
              src={ad.bannerImage}
              alt={ad.brand}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-neutral-700/60 shrink-0"
              referrerPolicy="no-referrer"
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                Sponsored Ad
              </span>
              <span className="text-xs font-semibold text-neutral-400 truncate">{ad.brand}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-neutral-200 line-clamp-2">
              {ad.tagline}
            </p>
          </div>
        </div>

        {/* Action Button & Why Ad */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={onOpenMonetization}
            title="Why am I seeing ads? Learn about AVOD monetization"
            className="p-2 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={handleAdClick}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#E50914] text-white text-xs font-bold hover:bg-[#ff202b] transition-all shadow-md active:scale-95"
          >
            <span>{ad.ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-neutral-500 hover:text-neutral-300 transition-colors"
            title="Hide this ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
