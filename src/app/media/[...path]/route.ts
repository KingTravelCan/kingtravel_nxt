import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'basic-ftp';
import { PassThrough } from 'stream';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Await the params object in Next.js 16+ App Router
  const resolvedParams = await params;
  const filePath = resolvedParams.path.join('/');
  const client = new Client(4000);

  try {
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
