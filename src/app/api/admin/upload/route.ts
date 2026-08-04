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

    if (useFtp) {
      // Try FTP upload first
      const uploadResult = await uploadToFtp(buffer, file.name, subfolder);

      if (uploadResult.success && uploadResult.url) {
        return NextResponse.json({
          success: true,
          url: uploadResult.url,
          relativePath: uploadResult.relativePath,
        });
      }
      console.warn('FTP upload failed/timed out, falling back to local public storage:', uploadResult.error);
    }

    const ext = path.extname(file.name) || '.png';
    const cleanBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^\w-]/g, '');
    const uniqueFilename = `${cleanBaseName || 'media'}-${Date.now()}${ext.toLowerCase()}`;

    const localUploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder);
    if (!fs.existsSync(localUploadDir)) {
      fs.mkdirSync(localUploadDir, { recursive: true });
    }

    const localFilePath = path.join(localUploadDir, uniqueFilename);
    fs.writeFileSync(localFilePath, buffer);

    const localPublicUrl = `/uploads/${subfolder}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: localPublicUrl,
      relativePath: `uploads/${subfolder}/${uniqueFilename}`,
      warning: 'FTP timed out. File saved to local storage.',
    });
  } catch (error: any) {
    console.error('Error in /api/admin/upload POST handler:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error uploading file' },
      { status: 500 }
    );
  }
}
