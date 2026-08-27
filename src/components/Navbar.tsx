import React from 'react';
import { Search, Wifi, WifiOff, Sparkles, DollarSign, Bell, ShieldCheck, PlusCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  userProfile: UserProfile;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onOpenSearch: () => void;
  onOpenMonetization: () => void;
  onOpenProfile: () => void;
  onOpenAddMovie?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  isOfflineMode,
  onToggleOfflineMode,
  onOpenSearch,
  onOpenMonetization,
  onOpenProfile,
  onOpenAddMovie,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-md px-4 py-3 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 focus:outline-none group text-left"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#E50914] drop-shadow-sm font-sans flex items-center">
              PINOY<span className="text-white">SINE</span><span className="text-yellow-400">HUB</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#E50914]/20 text-[#ff4b55] border border-[#E50914]/40">
              PH
            </span>
          </button>

          {/* Quick Category Pills on Tablet/Desktop */}
          <div className="hidden md:flex items-center gap-5 ml-4 text-xs font-medium text-neutral-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`hover:text-white transition-colors ${activeTab === 'home' ? 'text-white font-bold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('aimatch')}
              className={`flex items-center gap-1 hover:text-white transition-colors ${activeTab === 'aimatch' ? 'text-amber-400 font-bold' : ''}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AI Recommendations
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`hover:text-white transition-colors ${activeTab === 'downloads' ? 'text-white font-bold' : ''}`}
            >
              Downloads & Offline
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline Mode Switcher */}
          <button
            id="offline-toggle-btn"
            onClick={onToggleOfflineMode}
            title={isOfflineMode ? 'Switch to Online Mode' : 'Simulate Offline / Airplane Mode'}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full transition-all border ${
              isOfflineMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-semibold">Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            )}
          </button>

          {/* Monetization & Ads Explainer Button */}
          <button
            id="ad-monetization-btn"
            onClick={onOpenMonetization}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-gradient-to-r from-red-950/70 to-neutral-900 text-red-300 border border-red-500/40 hover:border-red-400 transition-all shadow-sm"
            title="Tingnan kung paano kumikita sa Ads (AVOD)"
          >
            <DollarSign className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Ad Monetization (AVOD)</span>
            <span className="sm:hidden">Ads</span>
          </button>

          {/* Add Movie / Video Link Button */}
          {onOpenAddMovie && (
            <button
              id="add-movie-btn"
              onClick={onOpenAddMovie}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-[#E50914] hover:bg-[#ff202b] text-white shadow-md shadow-red-950 transition-all active:scale-95"
              title="Magdagdag ng Video Link at Image Poster"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Video</span>
              <span className="sm:hidden">+</span>
            </button>
          )}

          {/* Search Button */}
          <button
            id="search-btn"
            onClick={onOpenSearch}
            className="p-2 rounded-full bg-neutral-800/80 text-neutral-200 hover:text-white hover:bg-neutral-700 transition-colors border border-neutral-700"
            aria-label="Search movies and series"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <button
            id="profile-btn"
            onClick={onOpenProfile}
            className="relative flex items-center justify-center p-0.5 rounded-lg border-2 border-neutral-700 hover:border-red-500 transition-colors focus:outline-none overflow-hidden"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-7 h-7 rounded-md object-cover"
              referrerPolicy="no-referrer"
            />
            {userProfile.isPremiumAdFree && (
              <span
                title="VIP Ad-Free Active"
                className="absolute -top-1 -right-1 bg-amber-500 text-black text-[8px] font-black px-1 rounded-full shadow"
              >
                VIP
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
