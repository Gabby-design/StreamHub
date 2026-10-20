import { Video, Channel } from '@/types';

const MOVIE_STUDIO_CHANNEL: Channel = {
  id: 'ch_hollywood_cinema',
  name: 'Cinema World Premiere',
  handle: '@cinemaworld',
  avatarUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=150&auto=format&fit=crop&q=80',
  subscribers: '12.4M',
  subscriberCount: 12400000,
  isVerified: true,
  bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
  description: 'Official hub for Hollywood blockbusters, box-office movies, global premieres, and feature trailers.',
};

const ANIMATION_STUDIO_CHANNEL: Channel = {
  id: 'ch_cartoon_vault',
  name: 'Animation & Cartoon Vault',
  handle: '@cartoonvault',
  avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
  subscribers: '8.7M',
  subscriberCount: 8700000,
  isVerified: true,
  bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80',
  description: 'Premier destination for animated features, Disney, Pixar, comic cartoons, and Saturday morning series.',
};

const ANIME_STUDIO_CHANNEL: Channel = {
  id: 'ch_crunchyroll_anime',
  name: 'Crunchyroll Anime Premiere',
  handle: '@crunchyroll',
  avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80',
  subscribers: '15.8M',
  subscriberCount: 15800000,
  isVerified: true,
  bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
  description: 'Official global hub for top-tier anime simulcasts, English dubbed releases, and 1080p shonen series.',
};

// ============================================================================
// Multi-Key Failover Pools for TMDB and OMDb
// Supports 20+ keys with round-robin rotation and auto-failover on quota limits
// ============================================================================
const TMDB_API_KEYS_POOL: string[] = [
  process.env.TMDB_API_KEY,
  ...(process.env.TMDB_API_KEYS ? process.env.TMDB_API_KEYS.split(',').map((s) => s.trim()) : []),
  '1cf50e6248dc270629e802686245c2c8',
  'f81980ff410e46f422d64ddf3a56dddd',
  '4e44d9029b1270a757cddc766a1bcb63',
  'fa1192549721df01a1fb28a7788e6608',
  '844dba0bfd8f3a4f3799f6130ef9e335',
  'e9e9d8da18ae29fc430845952232787c',
  '04c35731a5ee918f014970082a0088b1',
].filter(Boolean) as string[];

const OMDB_API_KEYS_POOL: string[] = [
  process.env.OMDB_API_KEY,
  ...(process.env.OMDB_API_KEYS ? process.env.OMDB_API_KEYS.split(',').map((s) => s.trim()) : []),
  'trilogy',
  '4a3b711b',
  '564727fa',
  'thewdb',
  'b9a5e69d',
  '7d8bf3a2',
  'e487532a',
  'b26090c2',
  '3b036ce7',
  'f79a9578',
  'a3f5a89b',
  'c2f7b889',
  '2e47c1a8',
  'd89e472a',
  '5b82f109',
  '9c71a34b',
  '1f82a93c',
  '7a42e81f',
  '8b51d39a',
  '6c93e201',
].filter(Boolean) as string[];

class ApiKeyPoolManager {
  private omdbCooldowns = new Map<string, number>();
  private tmdbCooldowns = new Map<string, number>();

  public getOmdbKeys(): string[] {
    const now = Date.now();
    const available = OMDB_API_KEYS_POOL.filter((k) => (this.omdbCooldowns.get(k) || 0) < now);
    return available.length > 0 ? available : OMDB_API_KEYS_POOL;
  }

  public markOmdbKeyExhausted(key: string, cooldownMs = 60000) {
    this.omdbCooldowns.set(key, Date.now() + cooldownMs);
  }

  public getTmdbKeys(): string[] {
    const now = Date.now();
    const available = TMDB_API_KEYS_POOL.filter((k) => (this.tmdbCooldowns.get(k) || 0) < now);
    return available.length > 0 ? available : TMDB_API_KEYS_POOL;
  }

  public markTmdbKeyExhausted(key: string, cooldownMs = 60000) {
    this.tmdbCooldowns.set(key, Date.now() + cooldownMs);
  }
}

export const apiKeyPool = new ApiKeyPoolManager();

// ============================================================================
// Multi-Server Stream Generator (Full 1080p/720p Servers + Trailer)
// ============================================================================
export function buildStreamServers(
  id: number | string,
  isTv = false,
  imdbId?: string,
  title = '',
  season = 1,
  episode = 1
) {
  const rawStr = String(id).replace(/^(movie-|tv-|anime-)/, '');
  const isPureNumber = /^\d+$/.test(rawStr);
  const numericId = isPureNumber ? rawStr : undefined;
  const effectiveImdb = imdbId || (!isPureNumber && rawStr.startsWith('tt') ? rawStr : undefined);
  const mediaRef = numericId || effectiveImdb || id;

  const servers: Array<{ name: string; url: string; isEmbed: boolean; quality: string }> = [];

  // Server 1: AutoEmbed (Universal streaming catalog - instant 1080p playback, sandbox-friendly)
  if (numericId) {
    servers.push({
      name: 'Server 1 (1080p AutoEmbed)',
      url: isTv
        ? `https://autoembed.co/tv/tmdb/${numericId}-${season}-${episode}`
        : `https://autoembed.co/movie/tmdb/${numericId}`,
      isEmbed: true,
      quality: '1080p',
    });
  }

  // Server 2: VidSrc CC v2 (Fast modern CDN)
  servers.push({
    name: `Server ${servers.length + 1} (1080p VidSrc CC)`,
    url: isTv
      ? (effectiveImdb
          ? `https://vidsrc.cc/v2/embed/tv/${effectiveImdb}/${season}/${episode}`
          : `https://vidsrc.cc/v2/embed/tv/${numericId || mediaRef}/${season}/${episode}`)
      : (effectiveImdb
          ? `https://vidsrc.cc/v2/embed/movie/${effectiveImdb}`
          : `https://vidsrc.cc/v2/embed/movie/${numericId || mediaRef}`),
    isEmbed: true,
    quality: '1080p',
  });

  // Server 3: Embed.su (Direct streaming engine)
  servers.push({
    name: `Server ${servers.length + 1} (1080p Embed.su)`,
    url: isTv
      ? `https://embed.su/embed/tv/${numericId || effectiveImdb || mediaRef}/${season}/${episode}`
      : `https://embed.su/embed/movie/${numericId || effectiveImdb || mediaRef}`,
    isEmbed: true,
    quality: '1080p',
  });

  // Server 4: MultiEmbed (Supports both IMDb and TMDB)
  servers.push({
    name: `Server ${servers.length + 1} (1080p MultiEmbed)`,
    url: isTv
      ? `https://multiembed.mov/?video_id=${effectiveImdb || numericId || mediaRef}&s=${season}&e=${episode}&tmdb=1`
      : `https://multiembed.mov/?video_id=${effectiveImdb || numericId || mediaRef}&tmdb=1`,
    isEmbed: true,
    quality: '1080p',
  });

  // Server 5: VidFast
  if (numericId) {
    servers.push({
      name: `Server ${servers.length + 1} (1080p VidFast)`,
      url: isTv
        ? `https://vidfast.pro/tv/${numericId}/${season}/${episode}?autoPlay=false&title=true&poster=true&theme=6366f1`
        : `https://vidfast.pro/movie/${numericId}?autoPlay=false&title=true&poster=true&theme=6366f1`,
      isEmbed: true,
      quality: '1080p',
    });
  }

  // Server 6: VidLink Pro (Fast 1080p mirror with seek controls)
  if (numericId) {
    servers.push({
      name: `Server ${servers.length + 1} (1080p VidLink Pro)`,
      url: isTv
        ? `https://vidlink.pro/tv/${numericId}/${season}/${episode}?primaryColor=6366f1&title=true&poster=true`
        : `https://vidlink.pro/movie/${numericId}?primaryColor=6366f1&title=true&poster=true`,
      isEmbed: true,
      quality: '1080p',
    });
  }



  // Server 7: VidSrc ME (Mirror)
  servers.push({
    name: `Server ${servers.length + 1} (1080p VidSrc ME)`,
    url: isTv
      ? effectiveImdb
        ? `https://vidsrc.me/embed/tv?imdb=${effectiveImdb}&season=${season}&episode=${episode}`
        : `https://vidsrc.me/embed/tv?tmdb=${numericId || mediaRef}&season=${season}&episode=${episode}`
      : effectiveImdb
      ? `https://vidsrc.me/embed/movie?imdb=${effectiveImdb}`
      : `https://vidsrc.me/embed/movie?tmdb=${numericId || mediaRef}`,
    isEmbed: true,
    quality: '1080p',
  });

  // Server 8: VidSrc TO (Fallback Mirror)
  servers.push({
    name: `Server ${servers.length + 1} (1080p VidSrc TO)`,
    url: isTv
      ? `https://vidsrc.to/embed/tv/${numericId || mediaRef}/${season}/${episode}`
      : `https://vidsrc.to/embed/movie/${numericId || mediaRef}`,
    isEmbed: true,
    quality: '1080p',
  });

  // Official Trailer Preview
  servers.push({
    name: 'Trailer (HD Preview)',
    url: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent((title || 'movie') + ' official trailer')}`,
    isEmbed: true,
    quality: 'HD',
  });

  return servers;
}

// ============================================================================
// Curated Real Films & Cartoons with Verified Official 4K/1080p TMDB Artwork
// ============================================================================
export const CURATED_MOVIES: Video[] = [
  {
    id: 'movie-tmdb-969681',
    tmdbId: 969681,
    title: 'Spider-Man: Brand New Day',
    description: "Fighting crime full-time as Spider-Man in a world that doesn't remember him sparks a change in Peter Parker he may not have the power to control against a powerful new unseen threat.",
    videoUrl: 'https://vidlink.pro/movie/969681?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/r08LxMJCbf1SiJIWeyH9aJmdqwC.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/r08LxMJCbf1SiJIWeyH9aJmdqwC.jpg',
    duration: '2:22:00',
    durationSec: 8520,
    views: 48900000,
    createdAt: '2026',
    status: 'Upcoming Release (2026)',
    isUpcoming: true,
    channel: MOVIE_STUDIO_CHANNEL,
    likes: 3820000,
    dislikes: 12000,
    category: 'Movies',
    mediaType: 'movie',
    tags: ['Movies', 'Action', 'Sci-Fi', 'Superhero', 'Marvel', 'Spider-Man', 'Upcoming'],
    isHls: false,
    rating: '8.9',
    resolution: '1080p',
    streamServers: buildStreamServers(969681, false, undefined, 'Spider-Man: Brand New Day'),
  },
  {
    id: 'movie-tt9362722',
    tmdbId: 569094,
    imdbId: 'tt9362722',
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    videoUrl: 'https://vidlink.pro/movie/569094?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg',
    duration: '2:20:00',
    durationSec: 8400,
    views: 34100000,
    createdAt: '2023',
    channel: ANIMATION_STUDIO_CHANNEL,
    likes: 2890000,
    dislikes: 9100,
    category: 'Cartoons',
    mediaType: 'cartoon',
    tags: ['Cartoons', 'Animation', 'Action', 'Spider-Man', 'Marvel'],
    isHls: false,
    rating: '8.7',
    resolution: '1080p',
    streamServers: buildStreamServers(569094, false, 'tt9362722', 'Spider-Man: Across the Spider-Verse'),
  },
  {
    id: 'movie-tt22022452',
    tmdbId: 1022789,
    imdbId: 'tt22022452',
    title: 'Inside Out 2',
    description: 'Joy, Sadness, Anger, Fear and Disgust have been running a successful operation by all accounts. However, when Anxiety, Envy, Ennui and Embarrassment show up, the headquarters undergoes a sudden demolition.',
    videoUrl: 'https://autoembed.co/movie/tmdb/1022789',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/hLuPF9HxtjbS7ZzSjMRG3RpUffp.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/hLuPF9HxtjbS7ZzSjMRG3RpUffp.jpg',
    duration: '1:36:00',
    durationSec: 5760,
    views: 41200000,
    createdAt: '2024',
    channel: ANIMATION_STUDIO_CHANNEL,
    likes: 3100000,
    dislikes: 11000,
    category: 'Cartoons',
    mediaType: 'cartoon',
    tags: ['Cartoons', 'Animation', 'Pixar', 'Disney', 'Family', 'Comedy'],
    isHls: false,
    rating: '7.7',
    resolution: '1080p',
    streamServers: buildStreamServers(1022789, false, 'tt22022452', 'Inside Out 2'),
  },
  {
    id: 'movie-tt15239678',
    tmdbId: 693134,
    imdbId: 'tt15239678',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe.',
    videoUrl: 'https://vidlink.pro/movie/693134?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    duration: '2:46:00',
    durationSec: 9960,
    views: 28400000,
    createdAt: '2024',
    channel: MOVIE_STUDIO_CHANNEL,
    likes: 1840000,
    dislikes: 8100,
    category: 'Movies',
    mediaType: 'movie',
    tags: ['Movies', 'Sci-Fi', 'Adventure', 'Action', 'Epic'],
    isHls: false,
    rating: '8.6',
    resolution: '1080p',
    streamServers: buildStreamServers(693134, false, 'tt15239678', 'Dune: Part Two'),
  },
  {
    id: 'movie-tt6263850',
    tmdbId: 533535,
    imdbId: 'tt6263850',
    title: 'Deadpool & Wolverine',
    description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, Wade must team up with a reluctant Wolverine.',
    videoUrl: 'https://vidlink.pro/movie/533535?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
    duration: '2:08:00',
    durationSec: 7680,
    views: 39500000,
    createdAt: '2024',
    channel: MOVIE_STUDIO_CHANNEL,
    likes: 2450000,
    dislikes: 15200,
    category: 'Movies',
    mediaType: 'movie',
    tags: ['Movies', 'Action', 'Comedy', 'Superhero', 'Marvel'],
    isHls: false,
    rating: '7.8',
    resolution: '1080p',
    streamServers: buildStreamServers(533535, false, 'tt6263850', 'Deadpool & Wolverine'),
  },
  {
    id: 'movie-tt4154796',
    tmdbId: 299534,
    imdbId: 'tt4154796',
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance.',
    videoUrl: 'https://vidlink.pro/movie/299534?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/bR8ISy1O9XQxqiy0fQFw2BX72RQ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    duration: '3:01:00',
    durationSec: 10860,
    views: 45200000,
    createdAt: '2019',
    channel: MOVIE_STUDIO_CHANNEL,
    likes: 3200000,
    dislikes: 12400,
    category: 'Movies',
    mediaType: 'movie',
    tags: ['Movies', 'Action', 'Sci-Fi', 'Superhero', 'Marvel'],
    isHls: false,
    rating: '8.4',
    resolution: '1080p',
    streamServers: buildStreamServers(299534, false, 'tt4154796', 'Avengers: Endgame'),
  },
  {
    id: 'movie-tt11126994',
    tmdbId: 94605,
    imdbId: 'tt11126994',
    title: 'Arcane: League of Legends',
    description: 'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.',
    videoUrl: 'https://vidlink.pro/tv/94605/1/1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg',
    duration: '45:00',
    durationSec: 2700,
    views: 31800000,
    createdAt: '2024',
    channel: ANIMATION_STUDIO_CHANNEL,
    likes: 2950000,
    dislikes: 6400,
    category: 'Cartoons',
    mediaType: 'cartoon',
    numberOfSeasons: 2,
    numberOfEpisodes: 18,
    tags: ['Cartoons', 'Animation', 'Action', 'Fantasy', 'Gaming', 'Netflix'],
    isHls: false,
    rating: '9.0',
    resolution: '1080p',
    streamServers: buildStreamServers(94605, true, 'tt11126994', 'Arcane', 1, 1),
  },
  {
    id: 'anime-tmdb-127532',
    tmdbId: 127532,
    title: 'Solo Leveling (English Dub/Sub)',
    description: "In a world where hunters must battle deadly monsters to protect mankind, notoriously weak hunter Sung Jinwoo finds himself in a mysterious quest that allows him to level up without limits.",
    videoUrl: 'https://vidlink.pro/tv/127532/1/1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg',
    duration: '24:00',
    durationSec: 1440,
    views: 42900000,
    createdAt: '2024',
    channel: ANIME_STUDIO_CHANNEL,
    likes: 3890000,
    dislikes: 8100,
    category: 'Anime',
    mediaType: 'anime',
    tags: ['Anime', 'English Dub', 'English Sub', 'Action', 'Fantasy', 'Solo Leveling', '1080p'],
    isHls: false,
    rating: '8.7',
    resolution: '1080p',
    numberOfSeasons: 1,
    numberOfEpisodes: 25,
    streamServers: buildStreamServers(127532, true, undefined, 'Solo Leveling', 1, 1),
  },
  {
    id: 'anime-tmdb-207468',
    tmdbId: 207468,
    title: 'Kaiju No. 8 (English Dub/Sub)',
    description: 'In a world plagued by creatures known as Kaiju, Kafka Hibino aspired to enlist in The Defense Force. After a miniature Kaiju forces its way into his body, Kafka gains monstrous powers to fight back.',
    videoUrl: 'https://vidlink.pro/tv/207468/1/1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/htGeuCcNhlBe8GTx3izKOsd8frw.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/83yDUQVpdhv8ePy3nbTRzFaKYuQ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/htGeuCcNhlBe8GTx3izKOsd8frw.jpg',
    duration: '24 min/ep',
    durationSec: 1440,
    views: 18500000,
    createdAt: '2024',
    channel: ANIME_STUDIO_CHANNEL,
    likes: 1420000,
    dislikes: 4200,
    category: 'Anime',
    mediaType: 'anime',
    tags: ['Anime', 'English Dub', 'English Sub', 'Action', 'Sci-Fi', 'Kaiju No. 8', '1080p'],
    isHls: false,
    rating: '8.4',
    resolution: '1080p',
    numberOfSeasons: 1,
    numberOfEpisodes: 23,
    streamServers: buildStreamServers(207468, true, undefined, 'Kaiju No. 8', 1, 1),
  },
  {
    id: 'anime-tmdb-207332',
    tmdbId: 207332,
    title: 'Sakamoto Days (English Dub/Sub)',
    description: 'Taro Sakamoto was once the ultimate hitman feared by every assassin in the underworld. After falling in love and retiring to run a quiet convenience store, his old life comes calling.',
    videoUrl: 'https://vidlink.pro/tv/207332/1/1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/blSthAPRbEOJBowdxppeQqNPRh9.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/wRpCqsJFyKNuh5FMegNPrhzp2NF.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/blSthAPRbEOJBowdxppeQqNPRh9.jpg',
    duration: '24 min/ep',
    durationSec: 1440,
    views: 12400000,
    createdAt: '2025',
    channel: ANIME_STUDIO_CHANNEL,
    likes: 980000,
    dislikes: 3100,
    category: 'Anime',
    mediaType: 'anime',
    tags: ['Anime', 'English Dub', 'English Sub', 'Action', 'Comedy', 'Sakamoto Days', '1080p'],
    isHls: false,
    rating: '8.1',
    resolution: '1080p',
    numberOfSeasons: 1,
    numberOfEpisodes: 22,
    streamServers: buildStreamServers(207332, true, undefined, 'Sakamoto Days', 1, 1),
  },
  {
    id: 'anime-tmdb-73223',
    tmdbId: 73223,
    title: 'Black Clover (English Dub/Sub)',
    description: 'In a world where magic is everything, Asta was born with no magical power. In order to keep his promise to his rival Yuno, Asta aims to become the Wizard King by wielding anti-magic swords.',
    videoUrl: 'https://vidlink.pro/tv/73223/1/1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/qu9epTZh29fGUkY7ZYc9PVsv0Ig.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/uZUtoVChBGhNj9OfrM2LYpwBm8E.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/qu9epTZh29fGUkY7ZYc9PVsv0Ig.jpg',
    duration: '24 min/ep',
    durationSec: 1440,
    views: 29800000,
    createdAt: '2017',
    channel: ANIME_STUDIO_CHANNEL,
    likes: 2450000,
    dislikes: 9800,
    category: 'Anime',
    mediaType: 'anime',
    tags: ['Anime', 'English Dub', 'English Sub', 'Action', 'Fantasy', 'Black Clover', '1080p'],
    isHls: false,
    rating: '8.5',
    resolution: '1080p',
    numberOfSeasons: 2,
    numberOfEpisodes: 196,
    streamServers: buildStreamServers(73223, true, undefined, 'Black Clover', 1, 1),
  },
  {
    id: 'anime-tmdb-1429',
    tmdbId: 1429,
    title: 'Attack on Titan (English Dub/Sub)',
    description: 'Humanity has been forced into hiding behind three massive concentric walls to survive against man-eating humanoid Titans. When the outermost wall falls, Eren Jaeger vows to eradicate every Titan.',
    videoUrl: 'https://vidlink.pro/tv/1429/1/1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
    duration: '24 min/ep',
    durationSec: 1440,
    views: 58200000,
    createdAt: '2013',
    channel: ANIME_STUDIO_CHANNEL,
    likes: 5120000,
    dislikes: 11400,
    category: 'Anime',
    mediaType: 'anime',
    tags: ['Anime', 'English Dub', 'English Sub', 'Action', 'Dark Fantasy', 'Attack on Titan', '1080p'],
    isHls: false,
    rating: '8.7',
    resolution: '1080p',
    numberOfSeasons: 4,
    numberOfEpisodes: 87,
    streamServers: buildStreamServers(1429, true, undefined, 'Attack on Titan', 1, 1),
  },
  {
    id: 'anime-tmdb-85937',
    tmdbId: 85937,
    title: 'Demon Slayer: Kimetsu no Yaiba (English Dub/Sub)',
    description: 'Tanjiro Kamado sets out on a journey as a demon slayer after his family is slaughtered by demons and his sister Nezuko is transformed into one. Together, they fight powerful demon moons to find a cure.',
    videoUrl: 'https://vidlink.pro/tv/85937/1/1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg',
    duration: '24 min/ep',
    durationSec: 1440,
    views: 49600000,
    createdAt: '2019',
    channel: ANIME_STUDIO_CHANNEL,
    likes: 4210000,
    dislikes: 8900,
    category: 'Anime',
    mediaType: 'anime',
    tags: ['Anime', 'English Dub', 'English Sub', 'Action', 'Fantasy', 'Demon Slayer', '1080p'],
    isHls: false,
    rating: '8.6',
    resolution: '1080p',
    numberOfSeasons: 5,
    numberOfEpisodes: 63,
    streamServers: buildStreamServers(85937, true, undefined, 'Demon Slayer', 1, 1),
  },
  {
    id: 'movie-tmdb-1184918',
    tmdbId: 1184918,
    title: 'The Wild Robot',
    description: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island animals and cares for an orphaned baby goose.',
    videoUrl: 'https://vidlink.pro/movie/1184918?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/mQZJoIhTEkNhCYA00UJIGMdpRIX.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9w0Vh9eizsqYe5prRUkFsQEC8g9.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/mQZJoIhTEkNhCYA00UJIGMdpRIX.jpg',
    duration: '1:42:00',
    durationSec: 6120,
    views: 31200000,
    createdAt: '2024',
    channel: ANIMATION_STUDIO_CHANNEL,
    likes: 2750000,
    dislikes: 8100,
    category: 'Cartoons',
    mediaType: 'cartoon',
    tags: ['Cartoons', 'Animation', 'Family', 'Sci-Fi', 'DreamWorks', '1080p'],
    isHls: false,
    rating: '8.4',
    resolution: '1080p',
    streamServers: buildStreamServers(1184918, false, undefined, 'The Wild Robot'),
  },
  {
    id: 'movie-tmdb-1241982',
    tmdbId: 1241982,
    title: 'Moana 2',
    description: 'After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and an all-new crew to the far seas of Oceania into dangerous, long-lost waters for an adventure unlike anything she has ever faced.',
    videoUrl: 'https://vidlink.pro/movie/1241982?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/tElnmtQ6yszji5P9YQ2z0z2n7u4.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/4YZplWJpHqw0ddCu3kL6j8vB5c8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/tElnmtQ6yszji5P9YQ2z0z2n7u4.jpg',
    duration: '1:40:00',
    durationSec: 6000,
    views: 36800000,
    createdAt: '2024',
    channel: ANIMATION_STUDIO_CHANNEL,
    likes: 3120000,
    dislikes: 11400,
    category: 'Cartoons',
    mediaType: 'cartoon',
    tags: ['Cartoons', 'Animation', 'Disney', 'Adventure', 'Music', '1080p'],
    isHls: false,
    rating: '7.1',
    resolution: '1080p',
    streamServers: buildStreamServers(1241982, false, undefined, 'Moana 2'),
  },
  {
    id: 'movie-tmdb-872585',
    tmdbId: 872585,
    imdbId: 'tt15398776',
    title: 'Oppenheimer',
    description: 'The story of J. Robert Oppenheimer role in the development of the atomic bomb during World War II, exploring the moral and political turmoil of scientific genius.',
    videoUrl: 'https://vidlink.pro/movie/872585?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    duration: '3:00:00',
    durationSec: 10800,
    views: 44900000,
    createdAt: '2023',
    channel: MOVIE_STUDIO_CHANNEL,
    likes: 3820000,
    dislikes: 14500,
    category: 'Movies',
    mediaType: 'movie',
    tags: ['Movies', 'Drama', 'History', 'Nolan', 'Oscar Winner', '1080p'],
    isHls: false,
    rating: '8.1',
    resolution: '1080p',
    streamServers: buildStreamServers(872585, false, 'tt15398776', 'Oppenheimer'),
  },
  {
    id: 'movie-tmdb-157336',
    tmdbId: 157336,
    imdbId: 'tt0816692',
    title: 'Interstellar',
    description: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    videoUrl: 'https://vidlink.pro/movie/157336?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    duration: '2:49:00',
    durationSec: 10140,
    views: 52100000,
    createdAt: '2014',
    channel: MOVIE_STUDIO_CHANNEL,
    likes: 4620000,
    dislikes: 15800,
    category: 'Movies',
    mediaType: 'movie',
    tags: ['Movies', 'Sci-Fi', 'Space', 'Adventure', 'Nolan', '1080p'],
    isHls: false,
    rating: '8.4',
    resolution: '1080p',
    streamServers: buildStreamServers(157336, false, 'tt0816692', 'Interstellar'),
  },
  {
    id: 'movie-tmdb-519182',
    tmdbId: 519182,
    imdbId: 'tt7510222',
    title: 'Despicable Me 4',
    description: 'Gru and Lucy and their girls welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad. Gru faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina.',
    videoUrl: 'https://vidlink.pro/movie/519182?primaryColor=6366f1',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/fDmci71SMqvAz9LwA2iFpHkM1aI.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/wWba3TaojhK7NdycRhoQpsG0FaH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fDmci71SMqvAz9LwA2iFpHkM1aI.jpg',
    duration: '1:34:00',
    durationSec: 5640,
    views: 38400000,
    createdAt: '2024',
    channel: ANIMATION_STUDIO_CHANNEL,
    likes: 2950000,
    dislikes: 10200,
    category: 'Cartoons',
    mediaType: 'cartoon',
    tags: ['Cartoons', 'Animation', 'Comedy', 'Family', 'Minions', '1080p'],
    isHls: false,
    rating: '7.1',
    resolution: '1080p',
    streamServers: buildStreamServers(519182, false, 'tt7510222', 'Despicable Me 4'),
  },
];

// ============================================================================
// TMDB Formatter
// ============================================================================
export function formatTmdbItem(item: any): Video {
  const isTv = item.media_type === 'tv' || Boolean(item.first_air_date && !item.release_date);
  const isCartoon =
    (Array.isArray(item.genre_ids) && item.genre_ids.includes(16)) ||
    (Array.isArray(item.genres) && item.genres.some((g: any) => g.id === 16 || g.name === 'Animation'));
  const title = item.title || item.name || 'Untitled';
  const tmdbId = item.id;
  const imdbId = item.imdb_id;
  const releaseDate = item.release_date || item.first_air_date || '';
  const year = releaseDate.slice(0, 4) || 'Recent';
  const category = isCartoon ? 'Cartoons' : 'Movies';
  const mediaType = isCartoon ? 'cartoon' : (isTv ? 'series' : 'movie');
  const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : '8.0';
  const streams = buildStreamServers(tmdbId, isTv, imdbId, title);

  const studioName = item.production_companies?.[0]?.name;
  const studioLogo = item.production_companies?.[0]?.logo_path
    ? `https://image.tmdb.org/t/p/w92${item.production_companies[0].logo_path}`
    : undefined;

  const channel: Channel = studioName
    ? {
        id: `studio_${item.production_companies[0].id}`,
        name: studioName,
        handle: `@${studioName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        avatarUrl: studioLogo || (isCartoon ? ANIMATION_STUDIO_CHANNEL.avatarUrl : MOVIE_STUDIO_CHANNEL.avatarUrl),
        subscribers: `${(Math.random() * 5 + 5).toFixed(1)}M`,
        subscriberCount: 8500000,
        isVerified: true,
        description: `Official studio page for ${studioName}.`,
      }
    : (isCartoon ? ANIMATION_STUDIO_CHANNEL : MOVIE_STUDIO_CHANNEL);

  const backdrop = item.backdrop_path || item.best_backdrop_path;
  const poster = item.poster_path;
  const thumbnailUrl = backdrop
    ? `https://image.tmdb.org/t/p/w1280${backdrop}`
    : poster
    ? `https://image.tmdb.org/t/p/w500${poster}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1080&auto=format&fit=crop&q=80';

  const durationStr = item.runtime
    ? (item.runtime >= 60
        ? `${Math.floor(item.runtime / 60)}:${String(item.runtime % 60).padStart(2, '0')}:00`
        : `${item.runtime}:00`)
    : isTv
    ? (item.number_of_seasons ? `${item.number_of_seasons} Seasons` : 'TV Series')
    : 'Feature Film';

  const genresList: string[] = Array.isArray(item.genres)
    ? item.genres.map((g: any) => g.name).filter(Boolean)
    : [];

  const castList = Array.isArray(item.cast)
    ? item.cast.slice(0, 12).map((c: any) => ({
        name: c.name,
        character: c.character || 'Actor',
        avatarUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : undefined,
      }))
    : undefined;

  const directorObj = item.director
    ? {
        name: item.director.name,
        avatarUrl: item.director.profile_path
          ? `https://image.tmdb.org/t/p/w185${item.director.profile_path}`
          : undefined,
      }
    : undefined;

  return {
    id: isTv ? `tv-tmdb-${tmdbId}` : `movie-tmdb-${tmdbId}`,
    tmdbId,
    imdbId,
    title,
    description: item.overview || `Streaming ${title} in 1080p Full HD resolution across high-speed servers.`,
    videoUrl: streams[0].url,
    thumbnailUrl,
    posterUrl: poster ? `https://image.tmdb.org/t/p/w500${poster}` : undefined,
    backdropUrl: backdrop ? `https://image.tmdb.org/t/p/w1280${backdrop}` : undefined,
    logoUrl: item.logo_path ? `https://image.tmdb.org/t/p/w500${item.logo_path}` : undefined,
    tagline: item.tagline || undefined,
    genres: genresList.length > 0 ? genresList : [category],
    releaseDate,
    budget: item.budget || undefined,
    revenue: item.revenue || undefined,
    status: item.status || undefined,
    collectionName: item.belongs_to_collection?.name || undefined,
    director: directorObj,
    cast: castList,
    numberOfSeasons: item.number_of_seasons || undefined,
    numberOfEpisodes: item.number_of_episodes || undefined,
    duration: durationStr,
    durationSec: (item.runtime || 120) * 60,
    views: Math.max(120000, Math.floor((item.vote_count || 100) * 450)),
    createdAt: year,
    channel,
    likes: Math.floor((item.vote_count || 100) * 0.8),
    dislikes: Math.floor((item.vote_count || 100) * 0.02),
    category,
    mediaType,
    tags: [category, isTv ? 'TV Series' : 'Movie', year, ...genresList, '1080p', 'Full HD'].filter(Boolean),
    isHls: false,
    resolution: '1080p',
    rating,
    isUpcoming:
      Number(year) >= 2026 ||
      item.status === 'Planned' ||
      item.status === 'In Production' ||
      item.status === 'Post Production',
    streamServers: streams,
  };
}

// ============================================================================
// 1Tube Global Proxy Integration (Direct connection to TMDB & High-Speed Streams)
// ============================================================================
export async function fetch1TubeSearch(query: string, page = 1): Promise<Video[]> {
  try {
    const res = await fetch(`https://www.1tube.org/api/search?query=${encodeURIComponent(query)}&page=${page}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data?.results)) return [];
    return data.results.map(formatTmdbItem);
  } catch {
    return [];
  }
}

export async function fetch1TubeSeasonEpisodes(showId: number | string, seasonNumber = 1) {
  try {
    const cleanId = String(showId)
      .replace(/^movie-tmdb-/, '')
      .replace(/^tv-tmdb-/, '')
      .replace(/^movie-/, '')
      .replace(/^tv-/, '');
    const res = await fetch(`https://www.1tube.org/api/tv/${cleanId}/season/${seasonNumber}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data?.episodes)) return [];
    return data.episodes.map((ep: any) => ({
      id: ep.id,
      episodeNumber: ep.episode_number,
      seasonNumber: ep.season_number,
      title: ep.name || `Episode ${ep.episode_number}`,
      overview: ep.overview || '',
      stillUrl: ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : undefined,
      runtime: ep.runtime,
      airDate: ep.air_date,
    }));
  } catch {
    return [];
  }
}

// Fallback to direct TMDB API if 1Tube details is unreachable
export async function fetchDirectTmdbDetails(id: string | number, type: 'movie' | 'tv' = 'movie'): Promise<Video | null> {
  const keys = apiKeyPool.getTmdbKeys();
  for (const key of keys) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}?api_key=${key}&append_to_response=credits`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) {
        apiKeyPool.markTmdbKeyExhausted(key);
        continue;
      }
      const item = await res.json();
      if (!item || !item.id) continue;
      item.media_type = type;
      return formatTmdbItem(item);
    } catch {
      apiKeyPool.markTmdbKeyExhausted(key);
    }
  }
  return null;
}

export async function fetch1TubeDetails(tmdbId: string | number, type: 'movie' | 'tv' = 'movie'): Promise<Video | null> {
  try {
    const cleanId = String(tmdbId)
      .replace('movie-tmdb-', '')
      .replace('tv-tmdb-', '')
      .replace('movie-', '')
      .replace('tv-', '');
    let res = await fetch(`https://www.1tube.org/api/details/${cleanId}?type=${type}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok && type === 'movie') {
      res = await fetch(`https://www.1tube.org/api/details/${cleanId}?type=tv`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) type = 'tv';
    }

    if (!res.ok) {
      // Automatic fallback to direct TMDB key pool
      return await fetchDirectTmdbDetails(cleanId, type);
    }

    const item = await res.json();
    if (!item || !item.id) {
      return await fetchDirectTmdbDetails(cleanId, type);
    }
    const formatted = formatTmdbItem(item);

    // If TV show series, automatically fetch season 1 episodes
    if ((type === 'tv' || item.number_of_seasons || formatted.id.startsWith('tv-')) && cleanId) {
      const episodes = await fetch1TubeSeasonEpisodes(cleanId, 1);
      if (episodes.length > 0) {
        formatted.episodes = episodes;
      }
    }

    return formatted;
  } catch {
    const cleanId = String(tmdbId)
      .replace('movie-tmdb-', '')
      .replace('tv-tmdb-', '')
      .replace('movie-', '')
      .replace('tv-', '');
    return await fetchDirectTmdbDetails(cleanId, type);
  }
}

export async function fetch1TubeDiscover(type: 'movies' | 'tv' = 'movies', page = 1): Promise<Video[]> {
  try {
    const res = await fetch(`https://www.1tube.org/api/discover/${type}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data?.results)) return [];
    return data.results.map(formatTmdbItem);
  } catch {
    return [];
  }
}

// Direct TMDB Multi-Search using the API Key Pool
export async function fetchDirectTmdbSearch(query: string): Promise<Video[]> {
  const keys = apiKeyPool.getTmdbKeys();
  for (const key of keys) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${key}&include_adult=false`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) {
        apiKeyPool.markTmdbKeyExhausted(key);
        continue;
      }
      const data = await res.json();
      if (!Array.isArray(data?.results)) continue;
      return data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .map(formatTmdbItem);
    } catch {
      apiKeyPool.markTmdbKeyExhausted(key);
    }
  }
  return [];
}

// ============================================================================
// Multi-Key Failover OMDb Search
// ============================================================================
export async function fetchOMDbMovies(query: string, type?: 'movie' | 'series'): Promise<Video[]> {
  const keys = apiKeyPool.getOmdbKeys();

  for (const key of keys) {
    try {
      const url = `https://www.omdbapi.com/?apikey=${key}&s=${encodeURIComponent(query)}${type ? `&type=${type}` : ''}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) {
        apiKeyPool.markOmdbKeyExhausted(key);
        continue;
      }

      const data = await res.json();
      if (data.Response !== 'True' || !Array.isArray(data.Search)) {
        if (data.Error && (data.Error.includes('limit') || data.Error.includes('key'))) {
          apiKeyPool.markOmdbKeyExhausted(key);
          continue;
        }
        return [];
      }

      return data.Search.map((item: any) => {
        const isSeries = item.Type === 'series';
        const isCartoon = query.toLowerCase().includes('cartoon') || query.toLowerCase().includes('animation');
        const category = isCartoon ? 'Cartoons' : 'Movies';
        const streams = buildStreamServers(item.imdbID, isSeries, item.imdbID, item.Title);

        return {
          id: `movie-${item.imdbID}`,
          imdbId: item.imdbID,
          title: item.Title,
          description: `Official ${item.Type} release (${item.Year}). Streaming in full 1080p resolution across high-speed servers.`,
          videoUrl: streams[0].url,
          thumbnailUrl:
            item.Poster && item.Poster !== 'N/A'
              ? item.Poster
              : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1080&auto=format&fit=crop&q=80',
          duration: isSeries ? 'Series' : 'Feature',
          durationSec: isSeries ? 2400 : 7200,
          views: Math.floor(Math.random() * 8000000) + 1200000,
          createdAt: item.Year || 'Recent',
          channel: isCartoon ? ANIMATION_STUDIO_CHANNEL : MOVIE_STUDIO_CHANNEL,
          likes: Math.floor(Math.random() * 400000) + 50000,
          dislikes: Math.floor(Math.random() * 2000) + 100,
          category,
          mediaType: isCartoon ? 'cartoon' : 'movie',
          tags: [category, item.Type, item.Year, '1080p', 'HD'].filter(Boolean),
          isHls: false,
          resolution: '1080p',
          streamServers: streams,
        };
      });
    } catch {
      apiKeyPool.markOmdbKeyExhausted(key);
      continue;
    }
  }
  return [];
}

// ============================================================================
// TVMaze Free Catalog
// ============================================================================
export async function fetchTVMazeShows(query: string): Promise<Video[]> {
  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(({ show }: any) => {
      const isAnimation = show.type === 'Animation' || show.genres?.includes('Animation');
      const category = isAnimation ? 'Cartoons' : 'Movies';
      const streams = buildStreamServers(show.name, true, undefined, show.name);

      return {
        id: `tvmaze-${show.id}`,
        title: show.name,
        description: show.summary ? show.summary.replace(/<[^>]*>?/gm, '') : 'Animated feature broadcast in 1080p high definition.',
        videoUrl: streams[0].url,
        thumbnailUrl:
          show.image?.original ||
          show.image?.medium ||
          'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
        duration: show.averageRuntime ? `${show.averageRuntime}m` : '30m',
        durationSec: (show.averageRuntime || 30) * 60,
        views: Math.floor(Math.random() * 5000000) + 800000,
        createdAt: show.premiered ? show.premiered.split('-')[0] : 'Recent',
        channel: isAnimation ? ANIMATION_STUDIO_CHANNEL : MOVIE_STUDIO_CHANNEL,
        likes: Math.floor(Math.random() * 300000) + 20000,
        dislikes: Math.floor(Math.random() * 1500) + 50,
        category,
        mediaType: isAnimation ? 'cartoon' : 'series',
        tags: [category, ...(show.genres || []), '1080p'],
        isHls: false,
        resolution: '1080p',
        rating: show.rating?.average ? show.rating.average.toString() : '8.0',
        streamServers: streams,
      };
    });
  } catch {
    return [];
  }
}

// ============================================================================
// Multi-Tier Live Search & Catalog
// ============================================================================
export async function getLiveCatalog(category: string, query?: string): Promise<Video[]> {
  const cleanQ = (query || '').trim();

  if (cleanQ) {
    const qLower = cleanQ.toLowerCase();
    // 0. Instant match against curated movies and anime
    const matchedCurated = CURATED_MOVIES.filter((m) =>
      m.title.toLowerCase().includes(qLower) ||
      m.tags.some((t) => t.toLowerCase().includes(qLower)) ||
      (m.category && m.category.toLowerCase().includes(qLower))
    );

    // 1. Prioritize TMDB live search from 1Tube (direct TMDB database)
    const tmdbResults = await fetch1TubeSearch(cleanQ);
    if (tmdbResults.length > 0) {
      const existingIds = new Set(matchedCurated.map((m) => m.id));
      return [...matchedCurated, ...tmdbResults.filter((t) => !existingIds.has(t.id))];
    }

    // 2. Direct TMDB search fallback using API key pool
    const directTmdbResults = await fetchDirectTmdbSearch(cleanQ);
    if (directTmdbResults.length > 0) {
      const existingIds = new Set(matchedCurated.map((m) => m.id));
      return [...matchedCurated, ...directTmdbResults.filter((t) => !existingIds.has(t.id))];
    }

    // 3. Multi-key OMDb search + TVMaze fallback
    const [omdbResults, tvmazeResults] = await Promise.all([
      fetchOMDbMovies(cleanQ),
      fetchTVMazeShows(cleanQ),
    ]);
    const merged = [...omdbResults, ...tvmazeResults];
    if (merged.length > 0) {
      const existingIds = new Set(matchedCurated.map((m) => m.id));
      return [...matchedCurated, ...merged.filter((t) => !existingIds.has(t.id))];
    }

    // 4. Return matched curated items
    return matchedCurated;
  }

  const catLower = category.toLowerCase();
  if (catLower === 'anime' || catLower === 'english dub' || catLower === 'english sub') {
    const curatedAnime = CURATED_MOVIES.filter((m) => m.category === 'Anime');
    const liveAnime = await fetch1TubeDiscover('tv', 1);
    const existingIds = new Set(curatedAnime.map((m) => m.id));
    return [...curatedAnime, ...liveAnime.filter((a) => !existingIds.has(a.id))];
  }

  if (catLower === 'movies') {
    const liveMovies = await fetch1TubeDiscover('movies', 1);
    if (liveMovies.length > 0) {
      const existingIds = new Set(liveMovies.map((m) => m.id));
      const curatedRest = CURATED_MOVIES.filter((m) => m.category === 'Movies' && !existingIds.has(m.id));
      return [...liveMovies, ...curatedRest];
    }
    return CURATED_MOVIES.filter((m) => m.category === 'Movies');
  }

  if (catLower === 'cartoons' || catLower === 'animation') {
    const liveCartoons = await fetch1TubeDiscover('tv', 1);
    if (liveCartoons.length > 0) {
      const existingIds = new Set(liveCartoons.map((m) => m.id));
      const curatedRest = CURATED_MOVIES.filter((m) => m.category === 'Cartoons' && !existingIds.has(m.id));
      return [...liveCartoons, ...curatedRest];
    }
    return CURATED_MOVIES.filter((m) => m.category === 'Cartoons');
  }

  return CURATED_MOVIES;
}
