import { VideoAd } from '../types';

export const SAMPLE_VIDEO_ADS: VideoAd[] = [
  {
    id: 'ad-shopee-mega-sale',
    brand: 'Shopee Mega 9.9 Super Sale',
    tagline: 'Maka-libre sa Free Shipping vouchers & 70% Off Deals ngayon!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSec: 15,
    skipAfterSec: 5,
    clickUrl: 'https://shopee.ph',
    ctaText: 'Claim Vouchers Now',
    sponsorBadge: 'Ad • Shopee Philippines',
    bannerImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ad-jollibee-chickenjoy',
    brand: 'Jollibee Crispylicious Chickenjoy',
    tagline: 'Ang sarap ng paboritong pambansang manok, delivered fresh in 30 mins!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    durationSec: 12,
    skipAfterSec: 5,
    clickUrl: 'https://jollibeedelivery.com',
    ctaText: 'Order Chickenjoy',
    sponsorBadge: 'Ad • Jollibee Delivery',
    bannerImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ad-galaxy-s26-ultra',
    brand: 'Galaxy Ultra 5G Cinema Edition',
    tagline: 'Stream in 8K HDR with 120Hz Dynamic AMOLED display.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    durationSec: 15,
    skipAfterSec: 5,
    clickUrl: 'https://samsung.com',
    ctaText: 'Explore Device',
    sponsorBadge: 'Ad • Samsung Mobile',
    bannerImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ad-cyber-vpn',
    brand: 'CyberShield Private VPN',
    tagline: 'Protect your mobile streaming connection anytime, anywhere in 1-click.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    durationSec: 10,
    skipAfterSec: 4,
    clickUrl: 'https://google.com',
    ctaText: 'Get 80% Off VPN',
    sponsorBadge: 'Ad • CyberShield Security',
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'
  }
];

export const AVOD_MONETIZATION_GUIDE = {
  title: 'Paano Kumikita ang Streaming App sa Pamamagitan ng Ads (AVOD / FAST)',
  description: 'Oo lods! Pwedeng-pwede kumita ang video streaming app sa pamamagitan ng Advertising-Based Video on Demand (AVOD) katulad ng YouTube, Tubi, Pluto TV, at Netflix with Ads.',
  models: [
    {
      name: '1. Pre-Roll Video Ads',
      desc: 'Nagpe-play ng 10-15 segundong video bago magsimula ang pelikula. May countdown timer (tulad ng "Skip in 5s") o non-skippable format.',
      cpmRange: '$8.00 - $25.00 CPM (bawat 1,000 views)'
    },
    {
      name: '2. Mid-Roll Cue Breaks',
      desc: 'Kusang nag-po-pause ang video sa mga cue-points (hal. sa 25% o 50% ng palabas) para mag-play ng 1-2 maiikling commercials tulad ng TV.',
      cpmRange: '$12.00 - $35.00 CPM'
    },
    {
      name: '3. Rewarded Video Ads',
      desc: 'Panoorin ng 30s ad ang user kapalit ng perk: tulad ng pag-unlock ng Ultra HD offline download, bonus episode pass, o 24-oras na walang ads!',
      cpmRange: '$20.00 - $45.00 eCPM'
    },
    {
      name: '4. Native Banner & In-Feed Ads',
      desc: 'Sponsored carousel banner sa homepage at search results habang nagba-browse ng movies ang user.',
      cpmRange: '$2.00 - $6.00 CPM'
    },
    {
      name: '5. Hybrid Freemium Tier',
      desc: 'Free Tier with Ads (libreng manood pero may commercials) vs VIP / Premium Subscription (₱149/mo na walang ads at 4K download).',
      cpmRange: 'Recurring Subscriptions + AVOD Revenue'
    }
  ],
  techStackIntegration: [
    'Google Ad Manager (GAM) / IMA SDK (Interactive Media Ads) para sa VAST / VPAID video tags',
    'Unity Ads / Google AdMob para sa native mobile apps (Android/iOS)',
    'Server-Side Ad Insertion (SSAI) para hindi ma-block ng adblockers at seamless ang transition'
  ]
};
