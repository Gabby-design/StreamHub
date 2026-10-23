import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    // 1. Mux Direct Upload Integration
    if (config.mux.isConfigured) {
      const basicAuth = Buffer.from(
        `${config.mux.tokenId}:${config.mux.tokenSecret}`
      ).toString('base64');

      const response = await fetch('https://api.mux.com/video/v1/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_asset_settings: {
            playback_policy: ['public'],
            video_quality: 'basic',
          },
          cors_origin: config.app.url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        return NextResponse.json({ error: errorData }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({
        provider: 'mux',
        uploadUrl: data.data.url,
        uploadId: data.data.id,
      });
    }

    // 2. Cloudflare Stream Direct Creator Upload Integration
    if (config.cloudflare.isConfigured) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/stream/direct_upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.cloudflare.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            maxDurationSeconds: 3600,
            requireSignedURLs: false,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        return NextResponse.json({ error: errorData }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({
        provider: 'cloudflare',
        uploadUrl: data.result.uploadURL,
        uid: data.result.uid,
      });
    }

    // 3. Fallback Mock Presigned Response (for local demo without API keys)
    return NextResponse.json({
      provider: 'mock',
      uploadUrl: '/api/upload/mock-sink',
      message: 'Mock upload target active. Configure Mux or Cloudflare keys in .env.local to route to live transcoding target.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let id = searchParams.get('id');

  if (!id) {
    try {
      const body = await req.json();
      id = body?.id;
    } catch {}
  }

  if (!id) {
    return NextResponse.json({ success: false, error: 'Asset ID required' }, { status: 400 });
  }

  try {
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('videos').delete().eq('id', id);
    }

    return NextResponse.json({
      success: true,
      message: 'Uploaded movie asset deleted from server',
      id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove asset';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
