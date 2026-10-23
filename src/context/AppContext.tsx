'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Video, Comment, UserProfile } from '@/types';
import { MOCK_VIDEOS, MOCK_COMMENTS } from '@/lib/mockData';
import { CURATED_MOVIES } from '@/lib/movieApi';

interface AppContextType {
  user: UserProfile | null;
  login: (email: string, name?: string, handle?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Videos
  videos: Video[];
  addUploadedVideo: (video: Video) => void;
  addDiscoveredVideos: (newVideos: Video[]) => void;
  deleteVideo: (videoId: string) => Promise<boolean>;

  // History & Library
  watchHistory: Video[];
  addToHistory: (video: Video) => void;
  clearHistory: () => void;

  // Liked Videos
  likedVideoIds: string[];
  dislikedVideoIds: string[];
  toggleLike: (videoId: string) => void;
  toggleDislike: (videoId: string) => void;

  // Watch Later
  savedVideoIds: string[];
  toggleWatchLater: (videoId: string) => void;

  // Subscriptions
  subscribedChannelIds: string[];
  toggleSubscribe: (channelId: string) => void;

  // Comments
  commentsMap: Record<string, Comment[]>;
  addComment: (videoId: string, content: string, parentCommentId?: string) => void;
  voteComment: (videoId: string, commentId: string, type: 'like' | 'dislike') => void;

  // Playback & Layout
  autoplay: boolean;
  setAutoplay: (val: boolean) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Queue
  queue: Video[];
  addToQueue: (video: Video) => void;
  removeFromQueue: (videoId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const OWNER_USER: UserProfile = {
  id: 'usr_owner_gabriel',
  name: 'Gabriel Tolulope',
  email: 'gabriel@streamhub.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  handle: 'G@bby',
};

export const isOwnerUser = (user: UserProfile | null): boolean => {
  if (!user) return false;
  return (
    user.id === 'usr_owner_gabriel' ||
    user.handle === 'G@bby' ||
    user.name.toLowerCase().includes('gabriel') ||
    user.email.toLowerCase().includes('gabriel')
  );
};

export const canDeleteVideo = (video: Video, user: UserProfile | null): boolean => {
  if (!user) return false;
  // Master owner can delete any uploaded movie/video or server asset
  if (isOwnerUser(user)) return true;
  // Regular creator can delete their uploaded movies
  return (
    video.channel.id === 'ch_' + user.id ||
    video.channel.handle === user.handle ||
    video.id.startsWith('upload_')
  );
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Any device starts logged out (null) so a Sign In button is shown
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([...CURATED_MOVIES, ...MOCK_VIDEOS]);
  const [watchHistory, setWatchHistory] = useState<Video[]>([]);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(['mux-bbb-hls']);
  const [dislikedVideoIds, setDislikedVideoIds] = useState<string[]>([]);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(['unified-tears-of-steel']);
  const [subscribedChannelIds, setSubscribedChannelIds] = useState<string[]>([
    'ch_blender',
    'ch_tech',
  ]);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(MOCK_COMMENTS);
  const [autoplay, setAutoplay] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [queue, setQueue] = useState<Video[]>([]);

  // Hydrate local storage on mount
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedUser = localStorage.getItem('streamhub_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

      const storedHistory = localStorage.getItem('streamhub_history');
      if (storedHistory) setWatchHistory(JSON.parse(storedHistory));

      const storedLikes = localStorage.getItem('streamhub_likes');
      if (storedLikes) setLikedVideoIds(JSON.parse(storedLikes));

      const storedSaved = localStorage.getItem('streamhub_saved');
      if (storedSaved) setSavedVideoIds(JSON.parse(storedSaved));

      const storedSubs = localStorage.getItem('streamhub_subs');
      if (storedSubs) setSubscribedChannelIds(JSON.parse(storedSubs));

      const storedDeleted = localStorage.getItem('streamhub_deleted_video_ids');
      const deletedIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : [];

      const storedUploads = localStorage.getItem('streamhub_custom_videos');
      if (storedUploads) {
        const customVids: Video[] = JSON.parse(storedUploads);
        setVideos((prev) => {
          const combined = [...customVids, ...prev];
          const unique = Array.from(new Map(combined.map((v) => [v.id, v])).values());
          return unique.filter((v) => !deletedIds.includes(v.id));
        });
      } else if (deletedIds.length > 0) {
        setVideos((prev) => prev.filter((v) => !deletedIds.includes(v.id)));
      }
    } catch {
      // Local storage unparsed or disabled
    }
    });

    // Unregister any stale service workers from localhost development
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          reg.unregister();
        }
      }).catch(() => {});
    }
  }, []);

  const login = useCallback((email: string, name = 'User', handle?: string) => {
    const isOwner =
      email.toLowerCase().includes('gabriel') ||
      name.toLowerCase().includes('gabriel') ||
      handle === 'G@bby';

    const newUser: UserProfile = {
      id: isOwner ? 'usr_owner_gabriel' : 'usr_' + Date.now(),
      name: isOwner ? 'Gabriel Tolulope' : name,
      email,
      avatarUrl: isOwner
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      handle: handle || (isOwner ? 'G@bby' : `@${email.split('@')[0]}`),
    };
    setUser(newUser);
    try {
      localStorage.setItem('streamhub_user', JSON.stringify(newUser));
    } catch {}
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('streamhub_user');
    } catch {}
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const addUploadedVideo = useCallback((video: Video) => {
    setVideos((prev) => [video, ...prev]);
    try {
      const stored = localStorage.getItem('streamhub_custom_videos');
      const existing: Video[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('streamhub_custom_videos', JSON.stringify([video, ...existing]));
    } catch {}
  }, []);

  const deleteVideo = useCallback(async (videoId: string): Promise<boolean> => {
    // 1. Remove from in-memory state immediately
    setVideos((prev) => prev.filter((v) => v.id !== videoId));

    try {
      // 2. Remove from custom uploads stored in localStorage
      const storedUploads = localStorage.getItem('streamhub_custom_videos');
      if (storedUploads) {
        const existing: Video[] = JSON.parse(storedUploads);
        const filtered = existing.filter((v) => v.id !== videoId);
        localStorage.setItem('streamhub_custom_videos', JSON.stringify(filtered));
      }

      // 3. Persist ID in streamhub_deleted_video_ids so it stays removed across reloads
      const storedDeleted = localStorage.getItem('streamhub_deleted_video_ids');
      const deletedIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : [];
      if (!deletedIds.includes(videoId)) {
        localStorage.setItem('streamhub_deleted_video_ids', JSON.stringify([...deletedIds, videoId]));
      }

      // 4. Remove from user watch history
      setWatchHistory((prev) => {
        const updated = prev.filter((v) => v.id !== videoId);
        try {
          localStorage.setItem('streamhub_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 5. Remove from liked & saved lists
      setLikedVideoIds((prev) => {
        const updated = prev.filter((id) => id !== videoId);
        try {
          localStorage.setItem('streamhub_likes', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setSavedVideoIds((prev) => {
        const updated = prev.filter((id) => id !== videoId);
        try {
          localStorage.setItem('streamhub_saved', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 6. Remove from queue
      setQueue((prev) => prev.filter((v) => v.id !== videoId));

      // 7. Request deletion on server endpoints and Supabase
      await Promise.allSettled([
        fetch(`/api/movies?id=${encodeURIComponent(videoId)}`, { method: 'DELETE' }),
        fetch(`/api/upload?id=${encodeURIComponent(videoId)}`, { method: 'DELETE' }),
      ]);
    } catch (err) {
      console.error('Error during video deletion:', err);
    }
    return true;
  }, []);

  const addDiscoveredVideos = useCallback((newVideos: Video[]) => {
    if (!newVideos || newVideos.length === 0) return;
    let deletedIds: string[] = [];
    try {
      const storedDeleted = localStorage.getItem('streamhub_deleted_video_ids');
      if (storedDeleted) deletedIds = JSON.parse(storedDeleted);
    } catch {}

    setVideos((prev) => {
      const existingIds = new Set(prev.map((v) => v.id));
      const novel = newVideos.filter((v) => !existingIds.has(v.id) && !deletedIds.includes(v.id));
      if (novel.length === 0) return prev;
      return [...prev, ...novel];
    });
  }, []);

  const addToHistory = useCallback((video: Video) => {
    setWatchHistory((prev) => {
      const filtered = prev.filter((v) => v.id !== video.id);
      const updated = [video, ...filtered].slice(0, 50);
      try {
        localStorage.setItem('streamhub_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setWatchHistory([]);
    try {
      localStorage.removeItem('streamhub_history');
    } catch {}
  }, []);

  const toggleLike = useCallback((videoId: string) => {
    setLikedVideoIds((prev) => {
      const isLiked = prev.includes(videoId);
      const updated = isLiked ? prev.filter((id) => id !== videoId) : [...prev, videoId];
      try {
        localStorage.setItem('streamhub_likes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setDislikedVideoIds((prev) => prev.filter((id) => id !== videoId));
  }, []);

  const toggleDislike = useCallback((videoId: string) => {
    setDislikedVideoIds((prev) => {
      const isDisliked = prev.includes(videoId);
      return isDisliked ? prev.filter((id) => id !== videoId) : [...prev, videoId];
    });
    setLikedVideoIds((prev) => prev.filter((id) => id !== videoId));
  }, []);

  const toggleWatchLater = useCallback((videoId: string) => {
    setSavedVideoIds((prev) => {
      const isSaved = prev.includes(videoId);
      const updated = isSaved ? prev.filter((id) => id !== videoId) : [...prev, videoId];
      try {
        localStorage.setItem('streamhub_saved', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const toggleSubscribe = useCallback((channelId: string) => {
    setSubscribedChannelIds((prev) => {
      const isSubbed = prev.includes(channelId);
      const updated = isSubbed ? prev.filter((id) => id !== channelId) : [...prev, channelId];
      try {
        localStorage.setItem('streamhub_subs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const addComment = useCallback(
    (videoId: string, content: string, parentCommentId?: string) => {
      if (!content.trim()) return;
      const author = user
        ? {
            name: user.name,
            handle: user.handle,
            avatarUrl: user.avatarUrl,
            isVerified: false,
          }
        : {
            name: 'Anonymous Creator',
            handle: '@creator',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          };

      const newComment: Comment = {
        id: 'cmt_' + Date.now(),
        videoId,
        author,
        content,
        createdAt: 'Just now',
        likes: 0,
        dislikes: 0,
        replies: [],
      };

      setCommentsMap((prev) => {
        const videoComments = prev[videoId] ? [...prev[videoId]] : [];
        if (parentCommentId) {
          const updated = videoComments.map((cmt) => {
            if (cmt.id === parentCommentId) {
              return {
                ...cmt,
                replies: [...(cmt.replies || []), newComment],
              };
            }
            return cmt;
          });
          return { ...prev, [videoId]: updated };
        }
        return { ...prev, [videoId]: [newComment, ...videoComments] };
      });
    },
    [user]
  );

  const voteComment = useCallback(
    (videoId: string, commentId: string, type: 'like' | 'dislike') => {
      setCommentsMap((prev) => {
        const list = prev[videoId] || [];
        const updated = list.map((cmt) => {
          if (cmt.id === commentId) {
            if (type === 'like') {
              const isLiked = cmt.userVote === 'like';
              return {
                ...cmt,
                likes: isLiked ? cmt.likes - 1 : cmt.likes + 1,
                dislikes: cmt.userVote === 'dislike' ? cmt.dislikes - 1 : cmt.dislikes,
                userVote: (isLiked ? null : 'like') as 'like' | 'dislike' | null,
              };
            } else {
              const isDisliked = cmt.userVote === 'dislike';
              return {
                ...cmt,
                dislikes: isDisliked ? cmt.dislikes - 1 : cmt.dislikes + 1,
                likes: cmt.userVote === 'like' ? cmt.likes - 1 : cmt.likes,
                userVote: (isDisliked ? null : 'dislike') as 'like' | 'dislike' | null,
              };
            }
          }
          return cmt;
        });
        return { ...prev, [videoId]: updated };
      });
    },
    []
  );

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const addToQueue = useCallback((video: Video) => {
    setQueue((prev) => (prev.some((v) => v.id === video.id) ? prev : [...prev, video]));
  }, []);

  const removeFromQueue = useCallback((videoId: string) => {
    setQueue((prev) => prev.filter((v) => v.id !== videoId));
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        videos,
        addUploadedVideo,
        addDiscoveredVideos,
        deleteVideo,
        watchHistory,
        addToHistory,
        clearHistory,
        likedVideoIds,
        dislikedVideoIds,
        toggleLike,
        toggleDislike,
        savedVideoIds,
        toggleWatchLater,
        subscribedChannelIds,
        toggleSubscribe,
        commentsMap,
        addComment,
        voteComment,
        autoplay,
        setAutoplay,
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        queue,
        addToQueue,
        removeFromQueue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
