import React from 'react';
import { Home, Sparkles, Download, User, DollarSign } from 'lucide-react';
import { DownloadedItem } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  downloads: DownloadedItem[];
  onOpenMonetization: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  downloads,
  onOpenMonetization,
}) => {
  const completedDownloadsCount = downloads.filter((d) => d.status === 'completed').length;
  const isDownloadingAny = downloads.some((d) => d.status === 'downloading');

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          id="tab-home-btn"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
            activeTab === 'home' ? 'text-[#E50914] font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* AI Recommendations */}
        <button
          id="tab-aimatch-btn"
          onClick={() => setActiveTab('aimatch')}
          className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
            activeTab === 'aimatch' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
          </div>
          <span>AI Match</span>
        </button>

        {/* Downloads */}
        <button
          id="tab-downloads-btn"
          onClick={() => setActiveTab('downloads')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
            activeTab === 'downloads' ? 'text-[#E50914] font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Download className={`w-5 h-5 mb-0.5 ${isDownloadingAny ? 'animate-bounce text-[#E50914]' : ''}`} />
            {completedDownloadsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#E50914] text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                {completedDownloadsCount}
              </span>
            )}
          </div>
          <span>Downloads</span>
        </button>

        {/* Ads / Monetization Info */}
        <button
          id="tab-monetization-btn"
          onClick={onOpenMonetization}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <DollarSign className="w-5 h-5 mb-0.5 text-emerald-400" />
          <span>Ads & AVOD</span>
        </button>

        {/* Profile / Settings */}
        <button
          id="tab-profile-btn"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
            activeTab === 'profile' ? 'text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
};
