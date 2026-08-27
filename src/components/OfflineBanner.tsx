import React from 'react';
import { WifiOff, DownloadCloud, ArrowRight } from 'lucide-react';

interface OfflineBannerProps {
  isOfflineMode: boolean;
  onToggleOnline: () => void;
  onGoToDownloads: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOfflineMode,
  onToggleOnline,
  onGoToDownloads,
}) => {
  if (!isOfflineMode) return null;

  return (
    <div className="bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-neutral-900 border-b border-amber-500/40 px-4 py-2.5 text-amber-200 text-xs font-medium flex items-center justify-between shadow-md relative z-30">
      <div className="flex items-center gap-2">
        <span className="p-1 rounded bg-amber-500/20 text-amber-400">
          <WifiOff className="w-4 h-4" />
        </span>
        <div>
          <span className="font-bold text-amber-300">Offline Mode Active:</span>{' '}
          <span className="text-amber-100/90">Naka-disconnect sa internet. Ang mga na-download na palabas lang ang pwedeng i-play nang walang data.</span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-3 shrink-0">
        <button
          id="offline-view-downloads-btn"
          onClick={onGoToDownloads}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors text-[11px]"
        >
          <DownloadCloud className="w-3 h-3" />
          <span>My Downloads</span>
        </button>
        <button
          id="offline-reconnect-btn"
          onClick={onToggleOnline}
          className="px-2 py-1 rounded-md bg-neutral-800 text-neutral-300 hover:text-white transition-colors text-[11px] border border-neutral-700"
        >
          Go Online
        </button>
      </div>
    </div>
  );
};
