import { NextRequest, NextResponse } from 'next/server';
import { Video } from '@/types';
import { CURATED_MOVIES, buildStreamServers } from '@/lib/movieApi';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '12';

    const cleanQ = (query || '').toLowerCase().trim();
    const curatedMatches: Video[] = CURATED_MOVIES.filter((m) => {
      if (m.category !== 'Anime') return false;
      if (!cleanQ) return true;
      return (
        m.title.toLowerCase().includes(cleanQ) ||
        m.tags.some((t) => t.toLowerCase().includes(cleanQ))
      );
    });

    let endpoint = `https://kitsu.io/api/edge/anime?page[limit]=${limit}&sort=-userCount`;
    if (cleanQ) {
      endpoint = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(cleanQ)}&page[limit]=${limit}`;
    }

    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      next: { revalidate: 3600 },
    });

    let liveVideos: Video[] = [];
    if (response.ok) {
      const data = await response.json();
      const animeList = data.data || [];

      interface KitsuAnimeItem {
        id: string;
        attributes?: {
          youtubeVideoId?: string;
          posterImage?: { large?: string; medium?: string; tiny?: string; small?: string };
          coverImage?: { large?: string };
          canonicalTitle?: string;
          titles?: { en?: string; en_jp?: string };
          ageRatingGuide?: string;
          synopsis?: string;
          episodeCount?: number;
          userCount?: number;
          favoritesCount?: number;
          startDate?: string;
          subtype?: string;
          status?: string;
        };
      }

      liveVideos = (animeList as KitsuAnimeItem[])
        .filter((item: KitsuAnimeItem) => item.attributes?.youtubeVideoId || item.attributes?.posterImage)
      .map((item: KitsuAnimeItem) => {
        const attr = item.attributes || {};
        const ytId = attr.youtubeVideoId;
        const poster = attr.posterImage?.large || attr.posterImage?.medium || attr.coverImage?.large;
        const title = attr.canonicalTitle || attr.titles?.en || attr.titles?.en_jp || 'Anime Stream';

        const servers = buildStreamServers(title, true, undefined, title, 1, 1);
        const primaryUrl = servers[0]?.url || (ytId ? `https://www.youtube-nocookie.com/embed/${ytId}` : '');

        return {
          id: `anime-${item.id}`,
          title: `${title} (English Sub/Dub)`,
          description: attr.synopsis || 'Official anime stream and broadcast presentation.',
          videoUrl: primaryUrl,
          streamServers: servers,
          resolution: '1080p' as const,
          thumbnailUrl: poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
          duration: attr.episodeCount ? `${attr.episodeCount} Ep` : '24:00',
          durationSec: 1440,
          views: (attr.userCount || 1000) * 12,
          createdAt: attr.startDate ? `${attr.startDate.split('-')[0]}` : '2024',
          channel: {
            id: `ch_anime_${item.id}`,
            name: `${title} Official`,
            handle: `@${title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)}`,
            avatarUrl: attr.posterImage?.tiny || attr.posterImage?.small || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            subscribers: `${Math.floor((attr.favoritesCount || 500) / 100)}K`,
            subscriberCount: attr.favoritesCount || 5000,
            isVerified: true,
          },
          likes: Math.floor((attr.userCount || 1000) / 5),
          dislikes: Math.floor((attr.userCount || 1000) / 80),
          category: 'Anime',
          tags: ['Anime', 'English Sub', 'English Dub', attr.subtype || 'TV', attr.status || 'Finished'],
          isHls: false,
        };
      });
    }

    const combined = [
      ...curatedMatches,
      ...liveVideos.filter((lv) => !curatedMatches.some((cm) => cm.id === lv.id)),
    ];

    return NextResponse.json({ videos: combined });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
