export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  subscribers: string;
  subscriberCount: number;
  isVerified: boolean;
  bannerUrl?: string;
  description?: string;
  joinedDate?: string;
}

export interface Comment {
  id: string;
  videoId: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
    isVerified?: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
  replies?: Comment[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  previewUrl?: string;
  duration: string;
  durationSec: number;
  views: number;
  createdAt: string;
  channel: Channel;
  likes: number;
  dislikes: number;
  category: string;
  tags: string[];
  isHls?: boolean;
  imdbId?: string;
  tmdbId?: number | string;
  posterUrl?: string;
  backdropUrl?: string;
  logoUrl?: string;
  tagline?: string;
  genres?: string[];
  releaseDate?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  collectionName?: string;
  director?: { name: string; avatarUrl?: string };
  cast?: { name: string; character: string; avatarUrl?: string }[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  episodes?: {
    id: number | string;
    episodeNumber: number;
    seasonNumber: number;
    title: string;
    overview: string;
    stillUrl?: string;
    runtime?: number;
    airDate?: string;
  }[];
  mediaType?: 'movie' | 'anime' | 'cartoon' | 'series' | 'video';
  rating?: string | number;
  trailerUrl?: string;
  resolution?: '4K' | '1080p' | '720p' | '480p';
  streamServers?: StreamServer[];
  isLive?: boolean;
  liveViewers?: number;
  liveStartedAt?: string;
  isUpcoming?: boolean;
}

export interface StreamServer {
  name: string;
  url: string;
  isEmbed: boolean;
  quality?: string;
  language?: string;
  isEnglish?: boolean;
}


export interface LiveChatMessage {
  id: string;
  sender: string;
  avatar: string;
  badge?: string;
  message: string;
  timestamp: string;
  isSuperChat?: boolean;
  amount?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  handle: string;
}

export type PlaybackQuality = 'auto' | '1080p' | '720p' | '480p';
