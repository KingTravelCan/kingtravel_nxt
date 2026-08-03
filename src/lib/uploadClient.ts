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

    const data = await res.json();
    if (data.success && data.url) {
      return data.url;
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
