import { Client } from 'basic-ftp';
import { Readable } from 'stream';
import path from 'path';

export interface FtpUploadResult {
  success: boolean;
  url?: string;
  relativePath?: string;
  error?: string;
}

/**
 * Uploads a file buffer to the remote FTP server and returns its public URL.
 * 
 * Environment Variables required:
 * - FTP_HOST (e.g., ftp.kingtravelcan.com)
 * - FTP_USER (e.g., u328269640.dksdev)
 * - FTP_PASSWORD
 * - FTP_ROOT_DIR (e.g., /public_html/media)
 * - NEXT_PUBLIC_MEDIA_URL (e.g., https://media.kingtravelcan.com)
 */
export async function uploadToFtp(
  fileBuffer: Buffer,
  originalFilename: string,
  subfolder: string = 'uploads'
): Promise<FtpUploadResult> {
  const client = new Client(4000);
  client.ftp.verbose = false;

  const ftpHost = process.env.FTP_HOST;
  const ftpUser = process.env.FTP_USER;
  const ftpPassword = process.env.FTP_PASSWORD;
  const ftpRootDir = process.env.FTP_ROOT_DIR || '/public_html/media';
  const publicBaseUrl = (process.env.NEXT_PUBLIC_MEDIA_URL || '/media').replace(/\/$/, '');

  if (!ftpHost || !ftpUser || !ftpPassword) {
    return {
      success: false,
      error: 'FTP credentials missing in environment variables (FTP_HOST, FTP_USER, FTP_PASSWORD).',
    };
  }

  try {
    // Use the filename provided by the caller to ensure consistency with local storage
    const ext = path.extname(originalFilename) || '.png';
    const cleanBaseName = path
      .basename(originalFilename, ext)
      .toLowerCase()
      .replace(/[^\w-]/g, '');
    const timestamp = Date.now();
    const uniqueFilename = `${cleanBaseName || 'media'}-${timestamp}${ext.toLowerCase()}`;
    const dateFolder = new Date().toISOString().slice(0, 7); // e.g., "2026-08"
    const relativeDir = `${subfolder}/${dateFolder}`.replace(/^\/+|\/+$/g, '');
    const targetDir = `${ftpRootDir.replace(/\/$/, '')}/${relativeDir}`;

    // Connect to FTP server (with 5s connection timeout)
    await client.access({
      host: ftpHost,
      user: ftpUser,
      password: ftpPassword,
      secure: false, // Standard FTP
    });

    // Ensure remote destination directory exists
    await client.ensureDir(targetDir);

    // Convert Buffer to Readable Stream
    const fileStream = Readable.from(fileBuffer);

    // Upload stream to remote path
    await client.uploadFrom(fileStream, uniqueFilename);

    const relativePath = `${relativeDir}/${uniqueFilename}`;
    const publicUrl = `${publicBaseUrl}/${relativePath}`;

    return {
      success: true,
      url: publicUrl,
      relativePath: relativePath,
    };
  } catch (error: any) {
    console.error('FTP Upload Error:', error);
    return {
      success: false,
      error: error?.message || 'Failed to upload file to FTP server',
    };
  } finally {
    client.close();
  }
}
