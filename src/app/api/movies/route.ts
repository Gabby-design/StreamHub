import { NextRequest, NextResponse } from 'next/server';
import { getLiveCatalog, fetch1TubeDetails, fetch1TubeSeasonEpisodes, CURATED_MOVIES } from '@/lib/movieApi';

const apiCache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached(key: string) {
  const entry = apiCache.get(key);
  if (entry && entry.expires > Date.now()) {
    return entry.data;
  }
  if (entry) apiCache.delete(key);
  return null;
}

function setCached(key: string, data: unknown) {
  if (apiCache.size > 500) {
    const firstKey = apiCache.keys().next().value;
    if (firstKey) apiCache.delete(firstKey);
  }
  apiCache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
}

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const season = searchParams.get('season');
  const q = searchParams.get('q');
  const category = searchParams.get('category') || 'Movies';
  const type = (searchParams.get('type') || 'movie') as 'movie' | 'tv';

  const cacheKey = `movies:${id || ''}:${season || ''}:${q || ''}:${category}:${type}`;
  const cachedData = getCached(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData, { headers: CACHE_HEADERS });
  }

  try {
    if (id) {
      // 1. If season is requested, return episodes for that season
      if (season) {
        const seasonNum = parseInt(season, 10) || 1;
        const episodes = await fetch1TubeSeasonEpisodes(id, seasonNum);
        const payload = { success: true, episodes };
        setCached(cacheKey, payload);
        return NextResponse.json(payload, { headers: CACHE_HEADERS });
      }

      // 2. Check curated list first
      const cleanId = id.toLowerCase().trim();
      const numMatch = cleanId.replace(/[^0-9]/g, '');
      const slugMatch = cleanId.replace(/^anime-tmdb-/, '').replace(/^movie-tmdb-/, '').replace(/^tv-tmdb-/, '').replace(/^anime-/, '').replace(/^movie-/, '').replace(/^tv-/, '').replace(/[-_]+/g, '');

      const curated = CURATED_MOVIES.find((m) => {
        if (m.id === id || m.id.toLowerCase() === cleanId) return true;
        if (m.imdbId === id || (m.imdbId && id.includes(m.imdbId))) return true;
        if (String(m.tmdbId) === id || (numMatch && String(m.tmdbId) === numMatch)) return true;
        const mSlug = m.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (slugMatch && (mSlug.includes(slugMatch) || slugMatch.includes(mSlug))) return true;
        return false;
      });
      if (curated) {
        const payload = { success: true, video: curated };
        setCached(cacheKey, payload);
        return NextResponse.json(payload, { headers: CACHE_HEADERS });
      }

      // 3. Query 1Tube details (supports TMDB IDs and IMDB tt IDs)
      const video = await fetch1TubeDetails(id, type);
      if (video) {
        const payload = { success: true, video };
        setCached(cacheKey, payload);
        return NextResponse.json(payload, { headers: CACHE_HEADERS });
      }

      return NextResponse.json(
        { success: false, error: 'Video stream not found' },
        { status: 404 }
      );
    }

    const videos = await getLiveCatalog(category, q || undefined);
    const payload = {
      success: true,
      count: videos.length,
      videos,
    };
    setCached(cacheKey, payload);
    return NextResponse.json(payload, { headers: CACHE_HEADERS });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch catalog';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get('id');

  if (!id) {
    try {
      const body = await request.json();
      id = body?.id;
    } catch {}
  }

  if (!id) {
    return NextResponse.json({ success: false, error: 'Movie ID required' }, { status: 400 });
  }

  try {
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('videos').delete().eq('id', id);
    }

    return NextResponse.json({
      success: true,
      message: 'Movie deleted successfully from server',
      id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete movie from server';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
