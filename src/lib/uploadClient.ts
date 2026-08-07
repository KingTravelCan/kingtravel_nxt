/**
 * Helper client function to upload a file to the FTP server via /api/admin/upload route.
 */
export async function uploadFileToFtp(file: File, subfolder: string = 'uploads'): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subfolder', subfolder);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      console.error('FTP Upload response not valid JSON:', text);
      alert('Upload failed: Server returned an invalid response. Please refresh the browser page and try again.');
      return null;
    }

    if (data.success && data.url) {
      return sanitizeMediaUrl(data.url);
    } else {
      console.error('FTP Upload error:', data.error);
      alert(`Upload failed: ${data.error || 'Unknown error'}`);
      return null;
    }
  } catch (err: any) {
    console.error('FTP Upload exception:', err);
    alert(`Upload failed: ${err.message || 'Network error'}`);
    return null;
  }
}

/**
 * Ensures any uploaded media URL is clean and replaces dead domain hostnames with valid paths.
 */
export function sanitizeMediaUrl(url: string): string {
  if (!url) return '';
  const mediaBase = (process.env.NEXT_PUBLIC_MEDIA_URL || '/media').replace(/\/$/, '');
  if (url.startsWith('https://media.kingtravelcan.com')) {
    return url.replace(/^https?:\/\/media\.kingtravelcan\.com\/?/, `${mediaBase}/`);
  }
  if (url.startsWith('/media/')) {
    return url.replace(/^\/media\//, `${mediaBase}/`);
  }
  if (url.startsWith('/uploads/')) {
    return url.replace(/^\/uploads\//, `${mediaBase}/uploads/`);
  }
  return url;
}

/**
 * Auto-generates clean, SEO-optimized Alt Text for any uploaded image file or path across all CRUDs.
 */
export function generateAutoAltText(fileOrName: File | string, contextTitle?: string): string {
  if (contextTitle && contextTitle.trim()) {
    const cleanContext = contextTitle.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
    return `Official ${cleanContext} - King Travel Canada`;
  }

  const filename = typeof fileOrName === 'string' ? fileOrName : fileOrName.name;
  if (!filename) return 'King Travel Canada Image';

  // Strip path and extension
  const basename = filename.split('/').pop()?.split('\\').pop() || filename;
  const nameWithoutExt = basename.replace(/\.[^/.]+$/, '');

  // Convert filename slug/snake_case to clean Title Case
  const cleanName = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();

  return `${cleanName} - King Travel Canada`;
}
