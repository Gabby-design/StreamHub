import { Video, Channel } from '@/types';

const OMDB_API_KEY = process.env.OMDB_API_KEY || process.env.NEXT_PUBLIC_OMDB_API_KEY || 'b9a5e69d';

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

export const CURATED_MOVIES: Video[] = [
  {
    id: 'movie-tt4154796',
    imdbId: 'tt4154796',
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/TcMBFSGVi1c',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_QL75_UX380_CR0,0,380,562_.jpg',
    duration: '181 min',
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
    streamServers: [
      { name: 'Trailer (HD)', url: 'https://www.youtube-nocookie.com/embed/TcMBFSGVi1c', isEmbed: true },
      { name: 'Server 1 (VidSrc)', url: 'https://vidsrc.to/embed/movie/tt4154796', isEmbed: true },
      { name: 'Server 2 (MultiEmbed)', url: 'https://multiembed.mov/?video_id=tt4154796', isEmbed: true },
    ],
  },
  {
    id: 'movie-tt15239678',
    imdbId: 'tt15239678',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/Way9Dexny3w',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
    duration: '166 min',
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
    streamServers: [
      { name: 'Trailer (HD)', url: 'https://www.youtube-nocookie.com/embed/Way9Dexny3w', isEmbed: true },
      { name: 'Server 1 (VidSrc)', url: 'https://vidsrc.to/embed/movie/tt15239678', isEmbed: true },
      { name: 'Server 2 (MultiEmbed)', url: 'https://multiembed.mov/?video_id=tt15239678', isEmbed: true },
    ],
  },
  {
    id: 'movie-tt6263850',
    imdbId: 'tt6263850',
    title: 'Deadpool & Wolverine',
    description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, Wade must team up with a reluctant Wolverine.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/73_1biulkYk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1080&auto=format&fit=crop&q=80',
    duration: '128 min',
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
    streamServers: [
      { name: 'Trailer (HD)', url: 'https://www.youtube-nocookie.com/embed/73_1biulkYk', isEmbed: true },
      { name: 'Server 1 (VidSrc)', url: 'https://vidsrc.to/embed/movie/tt6263850', isEmbed: true },
      { name: 'Server 2 (MultiEmbed)', url: 'https://multiembed.mov/?video_id=tt6263850', isEmbed: true },
    ],
  },
  {
    id: 'movie-tt9362722',
    imdbId: 'tt9362722',
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/cqGjhVJWtEg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1080&auto=format&fit=crop&q=80',
    duration: '140 min',
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
    streamServers: [
      { name: 'Trailer (HD)', url: 'https://www.youtube-nocookie.com/embed/cqGjhVJWtEg', isEmbed: true },
      { name: 'Server 1 (VidSrc)', url: 'https://vidsrc.to/embed/movie/tt9362722', isEmbed: true },
      { name: 'Server 2 (MultiEmbed)', url: 'https://multiembed.mov/?video_id=tt9362722', isEmbed: true },
    ],
  },
  {
    id: 'movie-tt22022452',
    imdbId: 'tt22022452',
    title: 'Inside Out 2',
    description: 'Joy, Sadness, Anger, Fear and Disgust have been running a successful operation by all accounts. However, when Anxiety, Envy, Ennui and Embarrassment show up, the headquarters undergoes a sudden demolition.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/LEjhY15eCx0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=80',
    duration: '96 min',
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
    streamServers: [
      { name: 'Trailer (HD)', url: 'https://www.youtube-nocookie.com/embed/LEjhY15eCx0', isEmbed: true },
      { name: 'Server 1 (VidSrc)', url: 'https://vidsrc.to/embed/movie/tt22022452', isEmbed: true },
      { name: 'Server 2 (MultiEmbed)', url: 'https://multiembed.mov/?video_id=tt22022452', isEmbed: true },
    ],
  },
  {
    id: 'movie-tt11126994',
    imdbId: 'tt11126994',
    title: 'Arcane: League of Legends',
    description: 'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/fXmAurh012s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
    duration: '45 min/ep',
    durationSec: 2700,
    views: 31800000,
    createdAt: '2024',
    channel: ANIMATION_STUDIO_CHANNEL,
    likes: 2950000,
    dislikes: 6400,
    category: 'Cartoons',
    mediaType: 'cartoon',
    tags: ['Cartoons', 'Animation', 'Action', 'Fantasy', 'Gaming', 'Netflix'],
    isHls: false,
    rating: '9.0',
    streamServers: [
      { name: 'Trailer (HD)', url: 'https://www.youtube-nocookie.com/embed/fXmAurh012s', isEmbed: true },
      { name: 'Server 1 (VidSrc)', url: 'https://vidsrc.to/embed/tv/tt11126994/1/1', isEmbed: true },
      { name: 'Server 2 (MultiEmbed)', url: 'https://multiembed.mov/?video_id=tt11126994&s=1&e=1', isEmbed: true },
    ],
  },
];

export async function fetchOMDbMovies(query: string, type?: 'movie' | 'series'): Promise<Video[]> {
  try {
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}${type ? `&type=${type}` : ''}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    if (data.Response !== 'True' || !Array.isArray(data.Search)) {
      return [];
    }

    return data.Search.map((item: any) => {
      const isSeries = item.Type === 'series';
      const isCartoon = query.toLowerCase().includes('cartoon') || query.toLowerCase().includes('animation');
      const category = isCartoon ? 'Cartoons' : 'Movies';

      return {
        id: `movie-${item.imdbID}`,
        imdbId: item.imdbID,
        title: item.Title,
        description: `Official ${item.Type} release (${item.Year}). Streaming in high definition with multi-server playback options.`,
        videoUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(item.Title + ' official trailer')}`,
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
        tags: [category, item.Type, item.Year, 'HD'].filter(Boolean),
        isHls: false,
        streamServers: [
          {
            name: 'Official Trailer (HD)',
            url: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(item.Title + ' official trailer')}`,
            isEmbed: true,
          },
          {
            name: 'Stream Server 1 (VidSrc)',
            url: isSeries
              ? `https://vidsrc.to/embed/tv/${item.imdbID}/1/1`
              : `https://vidsrc.to/embed/movie/${item.imdbID}`,
            isEmbed: true,
          },
          {
            name: 'Stream Server 2 (MultiEmbed)',
            url: isSeries
              ? `https://multiembed.mov/?video_id=${item.imdbID}&s=1&e=1`
              : `https://multiembed.mov/?video_id=${item.imdbID}`,
            isEmbed: true,
          },
        ],
      };
    });
  } catch {
    return [];
  }
}

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

      return {
        id: `tvmaze-${show.id}`,
        title: show.name,
        description: show.summary ? show.summary.replace(/<[^>]*>?/gm, '') : 'Animated feature broadcast.',
        videoUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(show.name + ' official trailer')}`,
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
        tags: [category, ...(show.genres || [])],
        isHls: false,
        rating: show.rating?.average ? show.rating.average.toString() : '8.0',
        streamServers: [
          {
            name: 'Official Trailer (HD)',
            url: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(show.name + ' official trailer')}`,
            isEmbed: true,
          },
          {
            name: 'Stream Server 1 (MultiEmbed)',
            url: `https://multiembed.mov/?video_id=${encodeURIComponent(show.name)}`,
            isEmbed: true,
          },
        ],
      };
    });
  } catch {
    return [];
  }
}

export async function getLiveCatalog(category: string, query?: string): Promise<Video[]> {
  const cleanQ = (query || '').trim();

  if (cleanQ) {
    // Search both OMDb and TVMaze in parallel
    const [omdbResults, tvmazeResults] = await Promise.all([
      fetchOMDbMovies(cleanQ),
      fetchTVMazeShows(cleanQ),
    ]);
    const merged = [...omdbResults, ...tvmazeResults];
    return merged.length > 0 ? merged : CURATED_MOVIES.filter((m) => m.title.toLowerCase().includes(cleanQ.toLowerCase()));
  }

  const catLower = category.toLowerCase();
  if (catLower === 'movies') {
    const popular = await fetchOMDbMovies('Avengers');
    const scifi = await fetchOMDbMovies('Batman');
    const combined = [...CURATED_MOVIES.filter((m) => m.category === 'Movies'), ...popular, ...scifi];
    // Deduplicate by ID
    const seen = new Set();
    return combined.filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  }

  if (catLower === 'cartoons' || catLower === 'animation') {
    const cartoons1 = await fetchTVMazeShows('Spider-Man');
    const cartoons2 = await fetchTVMazeShows('Avatar');
    const combined = [...CURATED_MOVIES.filter((m) => m.category === 'Cartoons'), ...cartoons1, ...cartoons2];
    const seen = new Set();
    return combined.filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  }

  return CURATED_MOVIES;
}
