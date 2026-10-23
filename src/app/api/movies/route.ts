import { NextRequest, NextResponse } from 'next/server';
import { getLiveCatalog, fetch1TubeDetails, fetch1TubeSeasonEpisodes, CURATED_MOVIES } from '@/lib/movieApi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const season = searchParams.get('season');
  const q = searchParams.get('q');
  const category = searchParams.get('category') || 'Movies';
  const type = (searchParams.get('type') || 'movie') as 'movie' | 'tv';

  try {
    if (id) {
      // 1. If season is requested, return episodes for that season
      if (season) {
        const seasonNum = parseInt(season, 10) || 1;
        const episodes = await fetch1TubeSeasonEpisodes(id, seasonNum);
        return NextResponse.json({ success: true, episodes });
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
        return NextResponse.json({ success: true, video: curated });
      }

      // 3. Query 1Tube details (supports TMDB IDs and IMDB tt IDs)
      const video = await fetch1TubeDetails(id, type);
      if (video) {
        return NextResponse.json({ success: true, video });
      }

      return NextResponse.json(
        { success: false, error: 'Video stream not found' },
        { status: 404 }
      );
    }

    const videos = await getLiveCatalog(category, q || undefined);
    return NextResponse.json({
      success: true,
      count: videos.length,
      videos,
    });
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
