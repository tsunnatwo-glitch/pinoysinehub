import React from 'react';
import {
  DownloadCloud,
  Play,
  Trash2,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { DownloadedItem, Movie } from '../types';
import { MOVIES_CATALOG } from '../data/catalog';

interface DownloadsViewProps {
  downloads: DownloadedItem[];
  onPlayDownloadedItem: (item: DownloadedItem) => void;
  onDeleteDownload: (id: string) => void;
  onClearAllDownloads: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onBrowseMore: () => void;
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({
  downloads,
  onPlayDownloadedItem,
  onDeleteDownload,
  onClearAllDownloads,
  isOfflineMode,
  onToggleOfflineMode,
  onBrowseMore,
}) => {
  // Calculate total download storage
  const totalDownloadedMB = downloads.reduce((acc, curr) => acc + curr.fileSizeMB, 0);
  const totalDownloadedGB = (totalDownloadedMB / 1024).toFixed(2);

  const deviceTotalGB = 128;
  const otherAppsGB = 48.5;
  const downloadedGBNum = parseFloat(totalDownloadedGB);
  const freeGB = (deviceTotalGB - otherAppsGB - downloadedGBNum).toFixed(1);

  const downloadedPercent = (downloadedGBNum / deviceTotalGB) * 100;
  const otherAppsPercent = (otherAppsGB / deviceTotalGB) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 text-white">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
            <DownloadCloud className="w-7 h-7 text-[#E50914]" />
            <span>Downloads & Offline Viewing</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manood ng paboritong pelikula at serye kahit walang internet o data connection (sa biyahe, probinsya, o eroplano).
          </p>
        </div>

        {/* Offline Mode Switch */}
        <button
          onClick={onToggleOfflineMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            isOfflineMode
              ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
          }`}
        >
          <WifiOff className="w-4 h-4" />
          <span>{isOfflineMode ? 'Offline Mode Active' : 'Subukan ang Offline Mode'}</span>
        </button>
      </div>

      {/* Internal Device Storage Breakdown Meter */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-neutral-200">
            <HardDrive className="w-4 h-4 text-neutral-400" />
            <span>Device Storage Manager</span>
          </div>
          <div className="text-neutral-400">
            <span className="text-white font-bold">{freeGB} GB</span> libre sa {deviceTotalGB} GB
          </div>
        </div>

        {/* Storage Bar */}
        <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden flex mb-3 p-0.5 border border-neutral-800">
          <div
            style={{ width: `${Math.max(downloadedPercent, 3)}%` }}
            className="bg-[#E50914] rounded-l-full transition-all duration-500"
            title={`Pinoysinehub: ${totalDownloadedGB} GB`}
          />
          <div
            style={{ width: `${otherAppsPercent}%` }}
            className="bg-neutral-600 transition-all duration-500"
            title={`Other Apps: ${otherAppsGB} GB`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E50914]" />
            <span>Pinoysinehub Downloads: <strong className="text-white">{totalDownloadedGB} GB</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            <span>Ibang Apps & System: <strong className="text-white">{otherAppsGB} GB</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            <span>Free Space: <strong className="text-emerald-400">{freeGB} GB</strong></span>
          </div>
        </div>
      </div>

      {/* Downloads List */}
      {downloads.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-bold uppercase tracking-wider">Mga Palabas na Handa nang Panoorin ({downloads.length})</span>
            <button
              onClick={onClearAllDownloads}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Burahin Lahat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 transition-all shadow-md group"
              >
                {/* Poster & Title Details */}
                <div
                  onClick={() => onPlayDownloadedItem(item)}
                  className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                >
                  <div className="relative w-20 sm:w-28 aspect-video rounded-xl overflow-hidden bg-black shrink-0">
                    <img
                      src={item.backdrop || item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h3>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 shrink-0">
                        {item.quality}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                      <span>{item.duration}</span>
                      <span>•</span>
                      <span>{item.fileSizeMB} MB</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Handa nang i-play
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onPlayDownloadedItem(item)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all active:scale-95 shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span className="hidden sm:inline">Play Offline</span>
                  </button>

                  <button
                    onClick={() => onDeleteDownload(item.id)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 transition-colors border border-neutral-700/60"
                    title="Delete download to free space"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <DownloadCloud className="w-8 h-8 text-[#E50914]" />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Wala pang na-download na palabas</h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-6">
            Pumili ng mga pelikula o episodes mula sa catalog at pindutin ang "Download" para mapanood kahit saan nang walang internet data!
          </p>
          <button
            onClick={onBrowseMore}
            className="px-6 py-2.5 rounded-xl bg-[#E50914] text-white text-xs font-bold hover:bg-[#ff202b] transition-all shadow-lg active:scale-95"
          >
            Mag-browse ng Palabas
          </button>
        </div>
      )}
    </div>
  );
};
