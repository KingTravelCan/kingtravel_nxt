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
