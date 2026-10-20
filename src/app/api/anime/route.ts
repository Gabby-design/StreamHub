import { NextRequest, NextResponse } from 'next/server';
import { Video } from '@/types';
import { CURATED_MOVIES } from '@/lib/movieApi';

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

      liveVideos = animeList
        .filter((item: any) => item.attributes?.youtubeVideoId || item.attributes?.posterImage)
      .map((item: any) => {
        const attr = item.attributes;
        const ytId = attr.youtubeVideoId;
        const poster = attr.posterImage?.large || attr.posterImage?.medium || attr.coverImage?.large;
        const title = attr.canonicalTitle || attr.titles?.en || attr.titles?.en_jp || 'Anime Stream';
        const studio = attr.ageRatingGuide || 'Animation Studio';

        const fullMultiEmbed = `https://multiembed.mov/?video_id=${encodeURIComponent(title)}&s=1&e=1`;
        const fullVidSrc = `https://vidsrc.to/embed/tv/${item.id}/1/1`;
        const trailerUrl = ytId
          ? `https://www.youtube-nocookie.com/embed/${ytId}`
          : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(title + ' anime official trailer')}`;

        return {
          id: `anime-${item.id}`,
          title: `${title} (English Sub/Dub)`,
          description: attr.synopsis || 'Official anime stream and broadcast presentation.',
          videoUrl: fullMultiEmbed,
          streamServers: [
            { name: 'Server 1 (1080p MultiEmbed)', url: fullMultiEmbed, isEmbed: true, quality: '1080p' },
            { name: 'Server 2 (720p VidSrc)', url: fullVidSrc, isEmbed: true, quality: '720p' },
            { name: 'Trailer (HD Preview)', url: trailerUrl, isEmbed: true, quality: 'HD' },
          ],
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
  }
}
