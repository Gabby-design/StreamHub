import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
