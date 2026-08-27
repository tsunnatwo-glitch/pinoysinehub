import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  X,
  Tv,
  Film,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  Play,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AVOD_MONETIZATION_GUIDE } from '../data/ads';

interface AdMonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremiumAdFree: boolean;
  onToggleAdFreeTier: () => void;
}

export const AdMonetizationModal: React.FC<AdMonetizationModalProps> = ({
  isOpen,
  onClose,
  isPremiumAdFree,
  onToggleAdFreeTier,
}) => {
  // Live AVOD Revenue Calculator state
  const [dailyActiveUsers, setDailyActiveUsers] = useState(25000);
  const [adsPerUserDay, setAdsPerUserDay] = useState(4);
  const [averageCpmUSD, setAverageCpmUSD] = useState(15); // $15 CPM is standard for video streaming

  // Rewarded Ad Simulation state
  const [isWatchingRewardAd, setIsWatchingRewardAd] = useState(false);
  const [rewardSecondsLeft, setRewardSecondsLeft] = useState(5);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);

  // Live Metrics from backend
  const [metrics, setMetrics] = useState({
    impressions: 1420,
    clicks: 89,
    videoAdsCompleted: 980,
    revenueEstUSD: 24.65,
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/ads/metrics')
        .then((res) => res.json())
        .then((data) => setMetrics(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Monthly Revenue Formula: (DAU * AdsPerUser * 30 days / 1000) * CPM
  const totalMonthlyAdImpressions = dailyActiveUsers * adsPerUserDay * 30;
  const estimatedMonthlyRevenueUSD = (totalMonthlyAdImpressions / 1000) * averageCpmUSD;
  const USD_TO_PHP = 58.5;
  const estimatedMonthlyRevenuePHP = estimatedMonthlyRevenueUSD * USD_TO_PHP;

  const handleStartRewardAd = () => {
    setIsWatchingRewardAd(true);
    setRewardSecondsLeft(5);
    setRewardUnlocked(false);

    const timer = setInterval(() => {
      setRewardSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsWatchingRewardAd(false);
          setRewardUnlocked(true);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl text-white relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-6 pr-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 text-emerald-400 border border-emerald-500/40 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-1">
              Monetization Architecture (AVOD & FAST)
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Oo Lods! Pwedeng Kumita ang Streaming App sa Ads
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1">
              Ang modelong ito ay tinatawag na <strong className="text-emerald-400">AVOD (Advertising-Based Video on Demand)</strong> — ang mismong ginagamit ng YouTube, Tubi, Pluto TV, at Netflix Standard with Ads.
            </p>
          </div>
        </div>

        {/* Live Current Tier Switcher */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Kasalukuyang App Tier:</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                  isPremiumAdFree
                    ? 'bg-amber-500 text-black'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isPremiumAdFree ? 'VIP Ad-Free (Subscription)' : 'Free Ad-Supported (AVOD)'}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isPremiumAdFree
                ? 'Walang video ads bago o habang nanonood. May access sa 4K offline downloads.'
                : 'Libreng manood ang lahat ng users, ngunit may 10-15s commercial ads bawat video.'}
            </p>
          </div>

          <button
            onClick={onToggleAdFreeTier}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 shrink-0 ${
              isPremiumAdFree
                ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
          >
            {isPremiumAdFree ? 'Lumipat sa Free Ad-Tier' : 'I-activate ang Ad-Free VIP'}
          </button>
        </div>

        {/* 5 Core Ad Monetization Strategies */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-neutral-400" />
            <span>5 Paraan Kung Paano Kumikita ang Streaming App:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AVOD_MONETIZATION_GUIDE.models.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-neutral-850/80 border border-neutral-800 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">{m.name}</h4>
                </div>
                <p className="text-xs text-neutral-300 mb-2 leading-relaxed">{m.desc}</p>
                <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded inline-block">
                  {m.cpmRange}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Earnings Calculator */}
        <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-emerald-500/40 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                Interactive AVOD Revenue Calculator
              </h3>
            </div>
            <span className="text-[11px] text-neutral-400">Tantiya sa Kita / Buwan</span>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-neutral-300">Daily Active Viewers (DAU):</span>
                <span className="font-bold text-white">{dailyActiveUsers.toLocaleString()} users</span>
              </div>
              <input
                type="range"
                min="1000"
                max="200000"
                step="2000"
                value={dailyActiveUsers}
                onChange={(e) => setDailyActiveUsers(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded appearance-none accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-neutral-300">Ads bawat User bawat Araw:</span>
                <span className="font-bold text-white">{adsPerUserDay} ad breaks</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={adsPerUserDay}
                onChange={(e) => setAdsPerUserDay(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded appearance-none accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Revenue Output Highlight */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs text-neutral-400 block">Tinatayang Buwanang Kita (Monthly Gross):</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">
                ₱{Math.round(estimatedMonthlyRevenuePHP).toLocaleString()}
                <span className="text-xs font-normal text-neutral-400 ml-2">
                  (~${Math.round(estimatedMonthlyRevenueUSD).toLocaleString()} USD)
                </span>
              </div>
            </div>

            <div className="text-xs text-neutral-400 bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-800">
              <span className="text-neutral-300 font-bold block">
                {(totalMonthlyAdImpressions / 1000000).toFixed(1)} Milyong
              </span>
              monthly ad impressions @ ${averageCpmUSD} CPM
            </div>
          </div>
        </div>

        {/* Rewarded Video Ad Interactive Demo */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Subukan ang "Rewarded Video Ad" Perk
              </h4>
            </div>
            {rewardUnlocked && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Perk Unlocked!
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mb-4">
            Panoorin ang 5-segundong sponsor video para ma-unlock ang "Ultra HD 4K Offline Download Pass".
          </p>

          {isWatchingRewardAd ? (
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-700 text-center space-y-2 animate-pulse">
              <div className="text-xs font-bold text-amber-400">
                Nagpe-play ang Sponsor Video... ({rewardSecondsLeft}s natitira)
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${((5 - rewardSecondsLeft) / 5) * 100}%` }}
                  className="bg-amber-400 h-full transition-all duration-1000"
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleStartRewardAd}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{rewardUnlocked ? 'Panoorin Muli para sa Bonus Reward' : 'Manood ng 5s Ad para sa 4K Download Perk'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
