import { NextRequest, NextResponse } from 'next/server';
import { Video } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '12';

    let endpoint = `https://kitsu.io/api/edge/anime?page[limit]=${limit}&sort=-userCount`;
    if (query && query.trim()) {
      endpoint = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query.trim())}&page[limit]=${limit}`;
    }

    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch anime data' }, { status: response.status });
    }

    const data = await response.json();
    const animeList = data.data || [];

    const videos: Video[] = animeList
      .filter((item: any) => item.attributes?.youtubeVideoId || item.attributes?.posterImage)
      .map((item: any) => {
        const attr = item.attributes;
        const ytId = attr.youtubeVideoId;
        const poster = attr.posterImage?.large || attr.posterImage?.medium || attr.coverImage?.large;
        const title = attr.canonicalTitle || attr.titles?.en || attr.titles?.en_jp || 'Anime Stream';
        const studio = attr.ageRatingGuide || 'Animation Studio';

        return {
          id: `anime-${item.id}`,
          title: `${title} (English Sub/Dub)`,
          description: attr.synopsis || 'Official anime stream and broadcast presentation.',
          videoUrl: ytId
            ? `https://www.youtube-nocookie.com/embed/${ytId}`
            : 'https://vjs.zencdn.net/v/oceans.mp4',
          streamServers: ytId
            ? [{ name: 'Trailer (HD)', url: `https://www.youtube-nocookie.com/embed/${ytId}`, isEmbed: true }]
            : undefined,
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

    return NextResponse.json({ videos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
  }
}
