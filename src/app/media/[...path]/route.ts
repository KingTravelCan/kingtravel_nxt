import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const filePath = resolvedParams.path.join('/');
  
  const publicBaseUrl = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, '') || 'https://media.kingtravelcan.com';
  
  return NextResponse.redirect(`${publicBaseUrl}/${filePath}`);
}
