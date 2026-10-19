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
  mediaType?: 'movie' | 'anime' | 'cartoon' | 'series' | 'video';
  rating?: string | number;
  trailerUrl?: string;
  streamServers?: { name: string; url: string; isEmbed: boolean }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  handle: string;
}

export type PlaybackQuality = 'auto' | '1080p' | '720p' | '480p';
