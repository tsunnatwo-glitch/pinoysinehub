import React, { useState } from 'react';
import {
  User,
  X,
  Shield,
  Wifi,
  HardDrive,
  Sparkles,
  DollarSign,
  Download,
  Trash2,
  Check,
} from 'lucide-react';
import { UserProfile, QualityTier } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenMonetization: () => void;
  onClearDownloads: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onOpenMonetization,
  onClearDownloads,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [downloadWifiOnly, setDownloadWifiOnly] = useState(true);
  const [smartDownloads, setSmartDownloads] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState<QualityTier>('HD (720p)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile({
      ...userProfile,
      name,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-white relative animate-in fade-in zoom-in-95 duration-200 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-[#E50914]" />
            <span>Profile at Mga Setting</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-14 h-14 rounded-xl object-cover border-2 border-neutral-700"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent border-b border-neutral-700 font-bold text-sm text-white focus:outline-none focus:border-[#E50914] w-full"
            />
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  userProfile.isPremiumAdFree
                    ? 'bg-amber-500 text-black'
                    : 'bg-neutral-800 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {userProfile.isPremiumAdFree ? 'VIP Ad-Free Plan' : 'Free Ad-Supported Plan (AVOD)'}
              </span>
            </div>
          </div>
        </div>

        {/* Streaming & Download Settings */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-neutral-400 uppercase tracking-wider">
            Download at Offline Setting
          </h3>

          {/* Wi-Fi Only */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-850 border border-neutral-800">
            <div>
              <span className="font-semibold block text-neutral-200">I-download sa Wi-Fi Lamang</span>
              <span className="text-[11px] text-neutral-400">Proteksyon laban sa mobile data charges</span>
            </div>
            <button
              onClick={() => setDownloadWifiOnly(!downloadWifiOnly)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                downloadWifiOnly ? 'bg-[#E50914]' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  downloadWifiOnly ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Smart Downloads */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-850 border border-neutral-800">
            <div>
              <span className="font-semibold block text-neutral-200">Smart Downloads</span>
              <span className="text-[11px] text-neutral-400">Kusang buburahin ang natapos na episode at ida-download ang susunod</span>
            </div>
            <button
              onClick={() => setSmartDownloads(!smartDownloads)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                smartDownloads ? 'bg-[#E50914]' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  smartDownloads ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Default Download Quality */}
          <div className="p-3 rounded-xl bg-neutral-850 border border-neutral-800">
            <span className="font-semibold block text-neutral-200 mb-2">Default Download Quality</span>
            <div className="grid grid-cols-3 gap-2">
              {(['SD (480p)', 'HD (720p)', 'FHD (1080p)'] as QualityTier[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setDefaultQuality(q)}
                  className={`p-2 rounded-lg font-bold text-center transition-colors ${
                    defaultQuality === q
                      ? 'bg-[#E50914] text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {q.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Upgrade & Monetization */}
        <div className="border-t border-neutral-800 pt-4 space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenMonetization();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <DollarSign className="w-4 h-4" />
            <span>Alamin ang Ad Monetization & Plan Upgrade</span>
          </button>

          <button
            onClick={onClearDownloads}
            className="w-full py-2.5 rounded-xl bg-neutral-850 hover:bg-red-950/60 text-red-400 hover:text-red-300 font-bold text-xs flex items-center justify-center gap-2 border border-neutral-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Linisin ang Lahat ng Offline Downloads</span>
          </button>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-white text-black font-extrabold text-xs sm:text-sm hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : null}
          <span>{savedSuccess ? 'Na-save na!' : 'I-save ang mga Pagbabago'}</span>
        </button>
      </div>
    </div>
  );
};
