import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'basic-ftp';
import { PassThrough } from 'stream';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  // Await the params object in Next.js 16+ App Router
  const resolvedParams = await params;
  const filePath = resolvedParams.path.join('/');
  const client = new Client(4000);

  try {
    // Guess mime type
    const ext = filePath.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml'
    };
    const contentType = mimeTypes[ext!] || 'application/octet-stream';

    // 1. First, check if the file exists locally (Fallback if FTP timed out during upload)
    const localFilePath = path.join(process.cwd(), 'public', filePath);
    if (fs.existsSync(localFilePath)) {
      const fileBuffer = fs.readFileSync(localFilePath);
      return new NextResponse(fileBuffer as any, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. If not local, try fetching from FTP
    const ftpHost = process.env.FTP_HOST;
    const ftpUser = process.env.FTP_USER;
    const ftpPassword = process.env.FTP_PASSWORD;
    const ftpRootDir = process.env.FTP_ROOT_DIR || '/public_html/media';

    if (!ftpHost || !ftpUser || !ftpPassword) {
      return new NextResponse('FTP Credentials missing', { status: 500 });
    }

    await client.access({
      host: ftpHost,
      user: ftpUser,
      password: ftpPassword,
      secure: false,
    });

    const targetFile = `${ftpRootDir.replace(/\/$/, '')}/${filePath}`;


    const pass = new PassThrough();

    const webStream = new ReadableStream({
      async start(controller) {
        pass.on('data', chunk => controller.enqueue(chunk));
        pass.on('end', () => controller.close());
        pass.on('error', err => controller.error(err));

        try {
          await client.downloadTo(pass, targetFile);
        } catch (e) {
          console.error('FTP Download Error:', e);
          controller.error(e);
        } finally {
          client.close();
        }
      }
    });

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (err: any) {
    client.close();
    console.error('Media proxy error:', err);
    return new NextResponse('Not Found', { status: 404 });
  }
}
