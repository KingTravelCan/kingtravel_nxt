import { NextRequest, NextResponse } from 'next/server';

const MEDIA_BASE = 'https://media.kingtravelcan.com';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const filePath = resolvedParams.path.join('/');
  const remoteUrl = `${MEDIA_BASE}/${filePath}`;

  try {
    const upstream = await fetch(remoteUrl, { cache: 'force-cache' });

    if (!upstream.ok) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}
