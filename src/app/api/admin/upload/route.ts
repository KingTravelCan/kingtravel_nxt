import { NextRequest, NextResponse } from 'next/server';
import { uploadToFtp } from '@/lib/ftp';

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

    const uploadResult = await uploadToFtp(buffer, file.name, subfolder);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || 'FTP Upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      relativePath: uploadResult.relativePath,
    });
  } catch (error: any) {
    console.error('Error in /api/admin/upload POST handler:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error uploading file' },
      { status: 500 }
    );
  }
}
