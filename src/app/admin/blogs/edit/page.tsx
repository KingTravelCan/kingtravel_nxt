'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { getBlogById, saveBlogAction, slugifyBlogTitle } from '@/actions/blogActions';
import { uploadFileToFtp, generateAutoAltText } from '@/lib/uploadClient';
import SeoCenterModal from '@/components/admin/SeoCenterModal';
import GlassNotificationModal from '@/components/ui/GlassNotificationModal';
import { Save, Upload, ArrowLeft, Sliders, Eye } from 'lucide-react';

const CATEGORIES = [
  'Pilgrimage Guide',
  'Hajj Tips',
  'Umrah Guide',
  'Saudi Visa',
  'Travel Tips',
  'News & Updates',
  'Spiritual Journey',
];

function BlogEditorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const blogId = searchParams.get('id') ? Number(searchParams.get('id')) : null;
  const isEdit = !!blogId;

  const [saving, setSaving] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string }>({ isOpen: false, type: 'success', title: '', message: '' });

  // Form state
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'Pilgrimage Guide',
    authorName: 'King Travel Editorial',
    isPublished: true,
    publishedAt: '',
  });

  const notify = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') =>
    setNotification({ isOpen: true, type, title, message });

  // Load existing blog if editing
  useEffect(() => {
    if (!blogId) return;
    getBlogById(blogId).then((b) => {
      if (!b) return;
      setForm({
        title: b.title || '',
        slug: b.slug || '',
        excerpt: b.excerpt || '',
        content: b.content || '',
        featuredImage: b.featuredImage || '',
        category: b.category || 'Pilgrimage Guide',
        authorName: b.authorName || 'King Travel Editorial',
        isPublished: b.isPublished ?? true,
        publishedAt: b.publishedAt ? new Date(b.publishedAt).toISOString().split('T')[0] : '',
      });
    });
  }, [blogId]);

  // Auto-generate slug dynamically from title as user types
  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setForm((p) => ({
      ...p,
      title: val,
      slug: generatedSlug,
    }));
  };

  const handleThumbUpload = async (file: File) => {
    setThumbUploading(true);
    const url = await uploadFileToFtp(file, 'blogs');
    setThumbUploading(false);
    if (url) setForm((p) => ({ ...p, featuredImage: url }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { notify('Validation', 'Title is required.', 'warning'); return; }
    if (!form.slug.trim()) { notify('Validation', 'Slug is required.', 'warning'); return; }
    setSaving(true);
    const res = await saveBlogAction({
      id: blogId,
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content,
      featuredImage: form.featuredImage || null,
      category: form.category,
      authorName: form.authorName,
      isPublished: form.isPublished,
      publishedAt: form.publishedAt || null,
    });
    setSaving(false);
    if (res.success) {
      notify(isEdit ? 'Blog Updated' : 'Blog Created', 'Blog post saved and published successfully!', 'success');
      if (!isEdit && res.blogId) {
        router.replace(`/admin/blogs/edit?id=${res.blogId}`);
      }
    } else {
      notify('Save Failed', res.error || 'Failed to save blog post.', 'error');
    }
  };

  const fieldLabel = (text: string, required = false) => (
    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
      {text}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );

  return (
    <AdminLayout user={{ name: 'Admin User', role: 'Super Admin' }}>
      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* Top Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/blogs" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 no-underline transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Blogs
            </Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-lg font-extrabold text-slate-900 m-0">
              {isEdit ? `Edit Blog` : 'New Blog Post'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isEdit && form.slug && (
              <a
                href={`/blogs/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:border-[#004B39] hover:text-[#004B39] no-underline transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </a>
            )}
            {isEdit && (
              <button
                type="button"
                onClick={() => setSeoModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-[#004B39] border border-emerald-300 text-xs font-extrabold hover:bg-[#004B39] hover:text-white transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" /> Page SEO
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-[#004B39] text-white px-5 py-2 rounded-xl text-xs font-bold border-none cursor-pointer hover:bg-[#00382B] disabled:opacity-50 transition-colors shadow-md shadow-emerald-900/20"
            >
              <Save className="w-3.5 h-3.5 text-emerald-300" />
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Blog'}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">

          {/* Left Column — Content */}
          <div className="flex flex-col gap-5">

            {/* Title */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
              {fieldLabel('Blog Title', true)}
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Complete Guide to Umrah in 2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-[#004B39] transition-colors"
              />
              <div className="mt-2 flex items-center gap-2">
                {fieldLabel('Slug')}
                <div className="flex-1 flex items-center gap-0 border border-slate-200 rounded-xl overflow-hidden">
                  <span className="px-3 py-2 text-[11px] font-mono text-slate-400 bg-slate-50 border-r border-slate-200">/blogs/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    className="flex-1 px-3 py-2 text-[11px] font-mono outline-none text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
              {fieldLabel('Excerpt / Summary')}
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="Short summary shown in blog listings (150–200 chars recommended)..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none focus:border-[#004B39] resize-y transition-colors"
              />
            </div>

            {/* Full Content */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
              {fieldLabel('Full Blog Content', true)}
              <p className="text-[11px] text-slate-400 mb-2">Supports HTML markup for headings, bold, lists, images etc.</p>
              <textarea
                rows={22}
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                placeholder="<p>Write your full blog article here. You can use HTML for formatting...</p>"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 outline-none focus:border-[#004B39] resize-y transition-colors leading-relaxed"
              />
              <p className="text-[10px] text-slate-300 mt-1.5">{form.content.length} characters</p>
            </div>
          </div>

          {/* Right Column — Meta */}
          <div className="flex flex-col gap-5 xl:sticky xl:top-6">

            {/* Thumbnail */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-3">🖼 Featured Thumbnail</h3>
              {form.featuredImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 mb-3 group">
                  <img src={form.featuredImage} alt="thumbnail" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, featuredImage: '' }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"
                  >×</button>
                </div>
              ) : (
                <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-100 to-emerald-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-3">
                  <span className="text-xs text-slate-400">No thumbnail set</span>
                </div>
              )}
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#004B39] text-white text-xs font-bold cursor-pointer hover:bg-[#00382B] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  {thumbUploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleThumbUpload(f); }} />
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  value={form.featuredImage}
                  onChange={(e) => setForm((p) => ({ ...p, featuredImage: e.target.value }))}
                  placeholder="Or paste image URL..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-mono outline-none focus:border-[#004B39]"
                />
              </div>
            </div>

            {/* Publish Settings */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider m-0">📅 Publish Settings</h3>

              {/* Status Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Published</div>
                  <div className="text-[11px] text-slate-400">Visible on the frontend</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:bg-[#004B39] transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                </label>
              </div>

              {/* Published Date */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase mb-1.5">Display Date <span className="font-normal text-slate-400 normal-case">(optional)</span></label>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#004B39]"
                />
                <p className="text-[10px] text-slate-400 mt-1">If empty, creation date is used</p>
              </div>
            </div>

            {/* Category & Author */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider m-0">✏️ Classification</h3>
              <div>
                {fieldLabel('Category')}
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#004B39] bg-white"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                {fieldLabel('Author Name')}
                <input
                  type="text"
                  value={form.authorName}
                  onChange={(e) => setForm((p) => ({ ...p, authorName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#004B39]"
                />
              </div>
            </div>

            {/* SEO Quick CTA */}
            {isEdit && (
              <button
                type="button"
                onClick={() => setSeoModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50 text-[#004B39] text-xs font-bold hover:border-[#004B39] hover:bg-emerald-100 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
                Configure Page SEO, Open Graph & Schema
              </button>
            )}
          </div>
        </div>
      </form>

      <GlassNotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification((p) => ({ ...p, isOpen: false }))}
      />

      {isEdit && (
        <SeoCenterModal
          isOpen={seoModalOpen}
          onClose={() => setSeoModalOpen(false)}
          pageData={{
            id: blogId!,
            title: form.title,
            slug: `/blogs/${form.slug}`,
            seoData: null,
          }}
          onSaveSuccess={() => {}}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminBlogEditPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400 text-sm">Loading editor...</div>}>
      <BlogEditorInner />
    </Suspense>
  );
}
