export interface AnimeEpisode {
  id: string;
  number: number;
  title: string;
  thumbnailUrl: string;
  duration: string;
  streamUrl: string;
  dubStreamUrl?: string;
  isHls?: boolean;
  synopsis?: string;
  resolution?: '1080p' | '720p' | '4K';
  streamServers?: { name: string; url: string; quality?: string; isEmbed?: boolean }[];
}

export interface AnimeSeries {
  id: string;
  malId?: number;
  title: string;
  titleEnglish: string;
  titleJapanese?: string;
  synopsis: string;
  score: number;
  episodesCount: number;
  episodes: AnimeEpisode[];
  bannerUrl: string;
  posterUrl: string;
  genres: string[];
  studio: string;
  status: string;
  year: number;
  trailerUrl?: string;
  trailerYoutubeId?: string;
  hasSub: boolean;
  hasDub: boolean;
  rating?: string;
  resolution?: '1080p' | '720p' | '4K';
}
