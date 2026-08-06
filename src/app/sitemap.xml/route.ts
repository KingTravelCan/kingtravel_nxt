import { generateSitemapXml } from '@/lib/sitemapGenerator';
import { NextResponse } from 'next/server';

// Revalidate this route according to cache preferences
export const revalidate = 86400; // Cache for 24 hours (86400 seconds)

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kingtravel.ca';
    const sitemapXml = await generateSitemapXml(baseUrl);

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
