import { NextRequest, NextResponse } from 'next/server';
import { getLiveCatalog, fetchOMDbMovies, fetchTVMazeShows } from '@/lib/movieApi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const category = searchParams.get('category') || 'Movies';

  try {
    const videos = await getLiveCatalog(category, q || undefined);
    return NextResponse.json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
