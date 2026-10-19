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
}
