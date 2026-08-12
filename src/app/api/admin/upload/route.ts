import { NextRequest, NextResponse } from 'next/server';
import { uploadToFtp } from '@/lib/ftp';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const subfolder = (formData.get('subfolder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if FTP is explicitly disabled or local uploads are forced in development
    const useFtp = process.env.ENABLE_FTP === 'true';

    const ext = path.extname(file.name) || '.png';
    const cleanBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^\w-]/g, '');
    const uniqueFilename = `${cleanBaseName || 'media'}-${Date.now()}${ext.toLowerCase()}`;

    // ALWAYS save a local copy to public/media/... so that local previews work immediately
    const relativeDir = `${subfolder}/${new Date().toISOString().slice(0, 7)}`.replace(/^\/+|\/+$/g, '');
    const localUploadDir = path.join(process.cwd(), 'public', 'media', relativeDir);
    if (!fs.existsSync(localUploadDir)) {
      fs.mkdirSync(localUploadDir, { recursive: true });
    }
    const localFilePath = path.join(localUploadDir, uniqueFilename);
    fs.writeFileSync(localFilePath, buffer);

    if (useFtp) {
      // Try FTP upload
      const uploadResult = await uploadToFtp(buffer, uniqueFilename, subfolder);

      if (uploadResult.success && uploadResult.url) {
        return NextResponse.json({
          success: true,
          url: uploadResult.url,
          relativePath: uploadResult.relativePath,
        });
      }
      console.warn('FTP upload failed/timed out, falling back to local public storage:', uploadResult.error);
    }

    // If we reach here, it means FTP is disabled or it failed
    const localPublicUrl = `/media/${relativeDir}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: localPublicUrl,
      relativePath: `media/${relativeDir}/${uniqueFilename}`,
      warning: useFtp ? 'FTP timed out. File saved to local storage.' : undefined,
    });
  } catch (error: any) {
    console.error('Error in /api/admin/upload POST handler:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error uploading file' },
      { status: 500 }
    );
  }
}
