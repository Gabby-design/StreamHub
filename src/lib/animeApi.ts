import { AnimeSeries, AnimeEpisode } from '@/types/anime';

// Curated canonical anime records for instant fallback and high-speed delivery
const CURATED_ANIME: AnimeSeries[] = [
  {
    id: 'sakamoto-days',
    malId: 58943,
    title: 'SAKAMOTO DAYS',
    titleEnglish: 'Sakamoto Days',
    titleJapanese: 'サカモトデイズ',
    synopsis: 'Taro Sakamoto was once hailed as the greatest hitman of all time, feared by villains and admired by peers. One day, he fell in love with a convenience store clerk named Aoi, retired from the underworld, married, had a child, and gained some weight. Now living a quiet life running a local neighborhood market, former colleagues and lethal assassins come to disturb his domestic peace.',
    score: 8.7,
    episodesCount: 12,
    episodes: [
      {
        id: 'sakamoto-ep-1',
        number: 1,
        title: 'The Legendary Hitman',
        thumbnailUrl: 'https://media.kitsu.app/anime/48915/poster_image/large-37aa395d6e0fbd2e6cbce7f3f6c77347.jpeg',
        duration: '23:40',
        streamUrl: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE',
        isHls: false,
        synopsis: 'Taro Sakamoto defends his grocery store against an assassin strike team while keeping his promise to his wife.',
      },
      {
        id: 'sakamoto-ep-2',
        number: 2,
        title: 'Rules of the Sakamoto Family',
        thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
        duration: '24:10',
        streamUrl: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE',
        isHls: false,
        synopsis: 'Shin the telepathic assassin is sent to eliminate Sakamoto, only to find himself inspired by his peaceful home life.',
      },
      {
        id: 'sakamoto-ep-3',
        number: 3,
        title: 'Amusement Park Showdown',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
        duration: '23:55',
        streamUrl: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE',
        isHls: false,
        synopsis: 'A family trip to the theme park turns into an acrobatic roller coaster brawl against sniper operatives.',
      },
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://media.kitsu.app/anime/48915/poster_image/large-37aa395d6e0fbd2e6cbce7f3f6c77347.jpeg',
    genres: ['Action', 'Comedy', 'Shonen'],
    studio: 'TMS Entertainment',
    status: 'Currently Airing',
    year: 2025,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE',
    trailerYoutubeId: '9TbmxbckSjE',
    hasSub: true,
    hasDub: true,
    rating: 'PG-13',
  },
  {
    id: 'attack-on-titan',
    malId: 16498,
    title: 'Shingeki no Kyojin',
    titleEnglish: 'Attack on Titan',
    titleJapanese: '進撃の巨人',
    synopsis: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. Eren Jaeger vows to cleanse the earth of Titans after tragedy strikes his hometown.',
    score: 9.1,
    episodesCount: 87,
    episodes: [
      {
        id: 'aot-ep-1',
        number: 1,
        title: 'To You, in 2000 Years: The Fall of Shiganshina, Part 1',
        thumbnailUrl: 'https://media.kitsu.app/anime/poster_images/7442/large.jpg',
        duration: '24:00',
        streamUrl: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8',
        isHls: false,
        synopsis: 'The Colossal Titan breaches Wall Maria, ending one hundred years of fragile peace.',
      },
      {
        id: 'aot-ep-2',
        number: 2,
        title: 'That Day: The Fall of Shiganshina, Part 2',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=80',
        duration: '24:00',
        streamUrl: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8',
        isHls: false,
        synopsis: 'Eren, Mikasa, and Armin join the refugee evacuation as the Armored Titan smashes the inner gate.',
      },
      {
        id: 'aot-ep-3',
        number: 3,
        title: 'A Dim Light Amid Despair: Humanity Rebirth',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1080&auto=format&fit=crop&q=80',
        duration: '24:00',
        streamUrl: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8',
        isHls: false,
        synopsis: 'The cadets begin their grueling military training under Instructor Keith Shadis.',
      },
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://media.kitsu.app/anime/poster_images/7442/large.jpg',
    genres: ['Action', 'Dark Fantasy', 'Military', 'Mystery'],
    studio: 'Wit Studio / MAPPA',
    status: 'Finished Airing',
    year: 2013,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8',
    trailerYoutubeId: 'M_OauHnAFc8',
    hasSub: true,
    hasDub: true,
    rating: 'R - 17+',
  },
  {
    id: 'solo-leveling',
    malId: 52299,
    title: 'Ore dake Level Up na Ken',
    titleEnglish: 'Solo Leveling',
    titleJapanese: '俺だけレベルアップな件',
    synopsis: 'In a world where dimensional gates connect our world to dungeons filled with monsters, human awakeners known as hunters battle for survival. Sung Jinwoo, notoriously known as the weakest hunter of all mankind, is trapped inside a lethal double dungeon and awakens with a singular player status interface.',
    score: 8.6,
    episodesCount: 24,
    episodes: [
      {
        id: 'sl-ep-1',
        number: 1,
        title: 'I am Used to It',
        thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
        duration: '23:45',
        streamUrl: 'https://www.youtube-nocookie.com/embed/LrNvF8gcJPM',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/LrNvF8gcJPM',
        isHls: false,
        synopsis: 'Sung Jinwoo undertakes a standard D-rank raid that leads into a hidden catastrophic chamber.',
      },
      {
        id: 'sl-ep-2',
        number: 2,
        title: 'If I Had One More Chance',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
        duration: '23:50',
        streamUrl: 'https://www.youtube-nocookie.com/embed/LrNvF8gcJPM',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/LrNvF8gcJPM',
        isHls: false,
        synopsis: 'Faced with the stone statues and the Commandments of the Temple, Jinwoo solves the deadly trial.',
      },
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    studio: 'A-1 Pictures',
    status: 'Currently Airing',
    year: 2024,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/LrNvF8gcJPM',
    trailerYoutubeId: 'LrNvF8gcJPM',
    hasSub: true,
    hasDub: true,
    rating: 'R - 17+',
  },
  {
    id: 'jujutsu-kaisen',
    malId: 40748,
    title: 'Jujutsu Kaisen',
    titleEnglish: 'Jujutsu Kaisen',
    titleJapanese: '呪術廻戦',
    synopsis: 'Idly indulging in paranormal activities with the Occult Club, high schooler Yuji Itadori swallows the cursed finger of Ryomen Sukuna, king of curses, plunging into the realm of Jujutsu Sorcery.',
    score: 8.8,
    episodesCount: 47,
    episodes: [
      {
        id: 'jjk-ep-1',
        number: 1,
        title: 'Ryomen Sukuna',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
        duration: '24:12',
        streamUrl: 'https://www.youtube-nocookie.com/embed/9OhV3IWUsxE',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/9OhV3IWUsxE',
        isHls: false,
        synopsis: 'Yuji Itadori encounters Megumi Fushiguro and ingests a special grade cursed object.',
      },
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
    genres: ['Action', 'Supernatural', 'Dark Fantasy'],
    studio: 'MAPPA',
    status: 'Finished Airing',
    year: 2020,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/9OhV3IWUsxE',
    trailerYoutubeId: '9OhV3IWUsxE',
    hasSub: true,
    hasDub: true,
    rating: 'R - 17+',
  },
  {
    id: 'demon-slayer',
    malId: 38000,
    title: 'Kimetsu no Yaiba',
    titleEnglish: 'Demon Slayer: Kimetsu no Yaiba',
    titleJapanese: '鬼滅の刃',
    synopsis: 'Ever since the death of his father, Tanjiro Kamado has taken on the burden of supporting his family. One fateful day, his family is slaughtered by a demon and his sister Nezuko is transformed into one.',
    score: 8.9,
    episodesCount: 55,
    episodes: [
      {
        id: 'ds-ep-1',
        number: 1,
        title: 'Cruelty',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=80',
        duration: '23:50',
        streamUrl: 'https://www.youtube-nocookie.com/embed/PraFso1sVIc',
        dubStreamUrl: 'https://www.youtube-nocookie.com/embed/PraFso1sVIc',
        isHls: false,
        synopsis: 'Tanjiro returns home through snowy mountains to discover an unfathomable tragedy.',
      },
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=80',
    genres: ['Action', 'Historical', 'Supernatural'],
    studio: 'ufotable',
    status: 'Finished Airing',
    year: 2019,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/PraFso1sVIc',
    trailerYoutubeId: 'PraFso1sVIc',
    hasSub: true,
    hasDub: true,
    rating: 'R - 17+',
  },
];

// In-memory cache to prevent duplicate fetches
const apiCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * 1. Fetch Trending & Airing Anime
 */
export async function getTrendingAnime(limit = 16): Promise<AnimeSeries[]> {
  const cacheKey = `trending_${limit}`;
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(`https://kitsu.io/api/edge/anime?sort=-userCount&page[limit]=${limit}`, {
      headers: {
        Accept: 'application/vnd.api+json',
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const json = await res.json();
      const mapped = json.data.map(mapKitsuToAnimeSeries);
      const combined = mergeWithCurated(mapped);
      apiCache.set(cacheKey, { timestamp: Date.now(), data: combined });
      return combined;
    }
  } catch {
    // Return curated anime if network fails
  }

  return CURATED_ANIME;
}

/**
 * 2. Search Anime by title (English or Romaji)
 */
export async function searchAnime(query: string, language = 'en'): Promise<AnimeSeries[]> {
  if (!query || !query.trim()) {
    return getTrendingAnime();
  }

  const cleanQuery = query.trim().toLowerCase();
  const cacheKey = `search_${cleanQuery}_${language}`;
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Check curated first
  const curatedMatches = CURATED_ANIME.filter(
    (a) =>
      a.title.toLowerCase().includes(cleanQuery) ||
      a.titleEnglish.toLowerCase().includes(cleanQuery) ||
      a.genres.some((g) => g.toLowerCase().includes(cleanQuery))
  );

  try {
    const res = await fetch(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(cleanQuery)}&page[limit]=16`,
      {
        headers: { Accept: 'application/vnd.api+json' },
        next: { revalidate: 3600 },
      }
    );

    if (res.ok) {
      const json = await res.json();
      const mapped = json.data.map(mapKitsuToAnimeSeries);
      const merged = [...curatedMatches, ...mapped.filter((m: AnimeSeries) => !curatedMatches.some((c) => c.id === m.id))];
      apiCache.set(cacheKey, { timestamp: Date.now(), data: merged });
      return merged;
    }
  } catch {
    // fallback
  }

  return curatedMatches.length > 0 ? curatedMatches : CURATED_ANIME;
}

/**
 * 3. Get Anime Series Details by ID
 */
export async function getAnimeDetails(id: string): Promise<AnimeSeries | null> {
  // Check curated
  const curated = CURATED_ANIME.find((a) => a.id === id);
  if (curated) return curated;

  const kitsuId = id.replace('anime-', '');
  try {
    const res = await fetch(`https://kitsu.io/api/edge/anime/${kitsuId}`, {
      headers: { Accept: 'application/vnd.api+json' },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const json = await res.json();
      return mapKitsuToAnimeSeries(json.data);
    }
  } catch {}

  return null;
}

function mapKitsuToAnimeSeries(item: any): AnimeSeries {
  const attr = item.attributes;
  const ytId = attr.youtubeVideoId;
  const title = attr.canonicalTitle || attr.titles?.en_jp || 'Anime';
  const titleEnglish = attr.titles?.en || attr.canonicalTitle || title;
  const epCount = attr.episodeCount || 12;

  // Generate synthetic episode list for episode selector carousel
  const episodes: AnimeEpisode[] = Array.from({ length: Math.min(epCount, 24) }).map((_, idx) => ({
    id: `ep-${item.id}-${idx + 1}`,
    number: idx + 1,
    title: `Episode ${idx + 1}: ${titleEnglish}`,
    thumbnailUrl: attr.posterImage?.medium || attr.coverImage?.small || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
    duration: '24:00',
    streamUrl: ytId ? `https://www.youtube-nocookie.com/embed/${ytId}` : 'https://vjs.zencdn.net/v/oceans.mp4',
    dubStreamUrl: ytId ? `https://www.youtube-nocookie.com/embed/${ytId}` : 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
    isHls: false,
    synopsis: `Official broadcast episode ${idx + 1} of ${titleEnglish}. Available with dual audio English Sub and English Dub.`,
  }));

  return {
    id: `anime-${item.id}`,
    malId: item.id ? parseInt(item.id, 10) : undefined,
    title,
    titleEnglish,
    titleJapanese: attr.titles?.ja_jp || undefined,
    synopsis: attr.synopsis || 'No synopsis available.',
    score: attr.averageRating ? parseFloat((attr.averageRating / 10).toFixed(1)) : 8.0,
    episodesCount: epCount,
    episodes,
    bannerUrl: attr.coverImage?.large || attr.posterImage?.large || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    posterUrl: attr.posterImage?.large || attr.posterImage?.medium || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
    genres: [attr.subtype || 'TV', attr.ageRating || 'PG-13', 'Action'],
    studio: attr.ageRatingGuide || 'Animation Studio',
    status: attr.status === 'current' ? 'Currently Airing' : 'Finished Airing',
    year: attr.startDate ? parseInt(attr.startDate.split('-')[0], 10) : 2024,
    trailerUrl: ytId ? `https://www.youtube.com/watch?v=${ytId}` : undefined,
    trailerYoutubeId: ytId || undefined,
    hasSub: true,
    hasDub: true,
    rating: attr.ageRating || 'PG-13',
  };
}

function mergeWithCurated(fetched: AnimeSeries[]): AnimeSeries[] {
  const existingIds = new Set(CURATED_ANIME.map((c) => c.id));
  const filtered = fetched.filter((f) => !existingIds.has(f.id));
  return [...CURATED_ANIME, ...filtered];
}
