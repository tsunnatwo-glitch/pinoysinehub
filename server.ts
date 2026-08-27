import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory ad metrics simulation
let adMetrics = {
  impressions: 1420,
  clicks: 89,
  videoAdsCompleted: 980,
  revenueEstUSD: 24.65,
};

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// API: Track and fetch ad metrics
app.get('/api/ads/metrics', (req, res) => {
  res.json(adMetrics);
});

app.post('/api/ads/event', (req, res) => {
  const { eventType } = req.body; // 'impression' | 'click' | 'complete'
  if (eventType === 'impression') {
    adMetrics.impressions += 1;
    adMetrics.revenueEstUSD += 0.015;
  } else if (eventType === 'click') {
    adMetrics.clicks += 1;
    adMetrics.revenueEstUSD += 0.08;
  } else if (eventType === 'complete') {
    adMetrics.videoAdsCompleted += 1;
    adMetrics.revenueEstUSD += 0.025;
  }
  res.json({ success: true, metrics: adMetrics });
});

// API: AI-Powered Personalized Recommendations using Gemini 3.7 Flash
app.post('/api/gemini/recommendations', async (req, res) => {
  try {
    const { preferredGenres, watchedTitles, currentMood, language = 'tl' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback recommendation if no API key is provided
      return res.json({
        recommendations: [
          {
            movieId: 'film-manila-heist',
            title: 'Manila Syndicate: Midnight Run',
            matchPercentage: 99,
            reasonTagalog: 'Swak na swak sa gusto mong maaksyon at adrenaline-packed na Pinoy setting na may high stakes!',
            reasonEnglish: 'Perfect match for your high-octane action preferences with a gritty Manila nightlife atmosphere.',
            moodTag: 'Adrenaline Rush',
            highlightScene: 'Quiapo Rooftop Chase with neon lighting',
          },
          {
            movieId: 'film-cyber-tadhana',
            title: 'Cyber Tadhana (Neon Love 2099)',
            matchPercentage: 96,
            reasonTagalog: 'Bagay sa mood mo kung hanap mo ay kakaibang sci-fi na may nakakakilig at emotional na Pinoy hugot.',
            reasonEnglish: 'Tailored for your sci-fi and romance fusion mood with deep futuristic aesthetic.',
            moodTag: 'Romantic Sci-Fi',
            highlightScene: 'Metaverse hologram reunion in BGC ruins',
          },
          {
            movieId: 'film-anime-shinigami-blade',
            title: 'Kurogane: Blade of the Eclipse',
            matchPercentage: 94,
            reasonTagalog: 'Top-tier animation at Japanese orchestral battles para sa relaxing yet intense evening viewing.',
            reasonEnglish: 'Visually stunning anime battles with mystical celestial swordsmanship.',
            moodTag: 'Epic Visuals',
            highlightScene: 'Eclipse realm sword standoff',
          },
        ],
        aiSummaryTagalog: 'Base sa paborito mong genres at panonood kamakailan, nag-curate ang AI ng high-energy action, sci-fi hugot, at anime masterpieces na perfect para sa mobile binge watching mo.',
      });
    }

    const prompt = `You are the StreamFlix AI Recommendation Engine for a mobile streaming app like Netflix.
Analyze the user's preferences:
- Preferred Genres: ${JSON.stringify(preferredGenres || ['Action', 'Sci-Fi', 'Pinoy Blockbusters'])}
- Recently Watched / Liked Titles: ${JSON.stringify(watchedTitles || ['Manila Syndicate', 'Cyber Tadhana'])}
- Current Mood: "${currentMood || 'Gusto ko ng nakaka-excite at relaxing na panoorin bago matulog'}"
- Language: ${language}

Recommend 3 to 4 matching titles from this catalog list:
1. "film-manila-heist" (Manila Syndicate: Midnight Run - Action, Crime, Manila)
2. "film-cyber-tadhana" (Cyber Tadhana - Cyberpunk Sci-Fi Romance)
3. "series-poblacion-nights" (Poblacion After Dark - Mystery Drama Series)
4. "film-anime-shinigami-blade" (Kurogane: Blade of the Eclipse - Anime, Supernatural Action)
5. "film-kdrama-seoul-breeze" (Seoul Autumn Rain - K-Drama, Romance, Comfort)
6. "film-quantum-drift" (Quantum Drift: Interstellar Gate - Space Sci-Fi Adventure)
7. "film-pinoy-tawa-overload" (Barkada Trip: Sagada Roadtrip - Comedy, Barkada, Hugot)
8. "film-tadhana-horror" (Gabi ng Lagim: San Isidro High - Pinoy Folklore Horror)
9. "film-wild-islands" (Wild Coral Archipelago - 4K Nature Documentary)
10. "film-street-turbo" (Makati Drift: Underground 8 - Fast Cars, High Octane)

Return JSON adhering to schema with matchPercentage (80-99), custom reason in Tagalog and English, moodTag, and highlightScene.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  movieId: { type: Type.STRING },
                  title: { type: Type.STRING },
                  matchPercentage: { type: Type.INTEGER },
                  reasonTagalog: { type: Type.STRING },
                  reasonEnglish: { type: Type.STRING },
                  moodTag: { type: Type.STRING },
                  highlightScene: { type: Type.STRING },
                },
                required: ['movieId', 'title', 'matchPercentage', 'reasonTagalog', 'reasonEnglish', 'moodTag'],
              },
            },
            aiSummaryTagalog: { type: Type.STRING },
          },
          required: ['recommendations', 'aiSummaryTagalog'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    // Return friendly fallback
    res.json({
      recommendations: [
        {
          movieId: 'film-manila-heist',
          title: 'Manila Syndicate: Midnight Run',
          matchPercentage: 98,
          reasonTagalog: 'Action-packed Pinoy thriller na may fast-paced chase scenes.',
          reasonEnglish: 'Action-packed Pinoy thriller with intense thrill.',
          moodTag: 'Action Thriller',
        },
        {
          movieId: 'film-cyber-tadhana',
          title: 'Cyber Tadhana',
          matchPercentage: 95,
          reasonTagalog: 'Futuristic romance na may halo ng cyberpunk at deep emotion.',
          reasonEnglish: 'Futuristic romance blending cyberpunk visuals with emotion.',
          moodTag: 'Cyberpunk Romance',
        },
      ],
      aiSummaryTagalog: 'Pumili ang AI ng mga pelikulang tugma sa iyong panlasa at paboritong kategorya.',
    });
  }
});

// API: Natural Language Smart Search with Gemini
app.post('/api/gemini/smart-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Basic text search fallback
      return res.json({
        matchedMovieIds: ['film-manila-heist', 'film-cyber-tadhana', 'film-pinoy-tawa-overload'],
        interpretation: `Nahanap ang mga palabas na may kinalaman sa "${query}".`,
      });
    }

    const searchPrompt = `The user is searching on a Netflix-like streaming app using natural language in Tagalog, Taglish, or English: "${query}".
Match this query against our movie catalog:
1. "film-manila-heist" (Manila Syndicate - Action, Police, Quiapo, Gunfight, Heist, Crime, Tagalog)
2. "film-cyber-tadhana" (Cyber Tadhana - Sci-Fi, Metaverse, Future Manila, AI, Romance, Love Story)
3. "series-poblacion-nights" (Poblacion After Dark - Mystery, Nightlife, Bars, Disappearance, Series)
4. "film-anime-shinigami-blade" (Kurogane: Blade of the Eclipse - Anime, Katana, Sword fight, Supernatural, Spirits)
5. "film-kdrama-seoul-breeze" (Seoul Autumn Rain - K-Drama, Korean romance, Bakery, Cozy, Feel Good)
6. "film-quantum-drift" (Quantum Drift - Interstellar space, Wormhole, Black hole, Astronauts, Sci-Fi)
7. "film-pinoy-tawa-overload" (Barkada Trip: Sagada - Comedy, Barkada, Laughs, Tawa, Roadtrip, Funny)
8. "film-tadhana-horror" (Gabi ng Lagim - Horror, Takot, Multo, Folklore, Ghost, High school, Jumpscares)
9. "film-wild-islands" (Wild Coral Archipelago - Ocean, Nature, Palawan, Coral reefs, Relaxing documentary)
10. "film-street-turbo" (Makati Drift - Fast cars, Drag racing, Nitrous, Drift, Sports cars)

Return JSON with matchedMovieIds (array of strings, ordered by relevance) and interpretation (1 sentence in conversational Taglish explaining what was found).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: searchPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedMovieIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            interpretation: { type: Type.STRING },
          },
          required: ['matchedMovieIds', 'interpretation'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err) {
    console.error('Error in smart search:', err);
    res.json({
      matchedMovieIds: ['film-manila-heist', 'film-cyber-tadhana'],
      interpretation: 'Narito ang mga resulta para sa iyong paghahanap.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StreamFlix server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
