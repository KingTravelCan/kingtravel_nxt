'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPageById, savePageAction } from '@/actions/pageActions';
import AdminLayout from '@/components/admin/AdminLayout';

const SECTION_OPTIONS = [
  'Hero Slider',
  'Intro (Text + Image)',
  'Stats Grid',
  'Accordion / FAQ',
  'Team Grid',
  'Media Grid',
  'Publications Grid',
  'CTA Banner',
  'Embed / Media',
  'Text Block (Rich Text)',
  'Image + Text (Side by Side)',
  'Organization Hero Banner',
  'Quote Banner (Full Width)',
  'Leader Bio Card',
  'Ideology / Feature Cards',
];

interface SectionItem {
  id: string;
  type: string;
  title: string;
}

function PageBuilderContent() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get('id') ? Number(searchParams.get('id')) : null;

  const [bannerBgImage, setBannerBgImage] = useState<string>('');
  const [bannerPosition, setBannerPosition] = useState<string>('center center');
  const [bannerSize, setBannerSize] = useState<string>('cover');
  const [bannerTitle, setBannerTitle] = useState<string>('');
  const [bannerDescription, setBannerDescription] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'sections' | 'richtext' | 'seo'>('sections');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [showInMenu, setShowInMenu] = useState(true);
  const [parentPage, setParentPage] = useState('');
  const [richText, setRichText] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (pageId) {
      getPageById(pageId).then((p) => {
        if (p) {
          setTitle(p.title);
          setSlug(p.slug);
          setStatus(p.status as any);
          setShowInMenu(p.showInMenu);
          setParentPage(p.parentPage || '');
          setRichText(p.richText || '');
          setMetaTitle(p.metaTitle || p.title);
          setMetaDescription(p.metaDescription || '');
          setBannerBgImage(p.bannerBgImage || '');
          setBannerPosition(p.bannerPosition || 'center center');
          setBannerSize(p.bannerSize || 'cover');
          setBannerTitle(p.bannerTitle || p.title);
          setBannerDescription(p.bannerDescription || '');
          if (p.sections) {
            try {
              setSections(JSON.parse(p.sections));
            } catch (e) {
              setSections([]);
            }
          }
        }
      });
    } else {
      setTitle('New Custom Page');
      setSlug('/new-page');
    }
  }, [pageId]);

  const addSection = (type: string) => {
    setSections([...sections, { id: String(Date.now()), type, title: `New ${type}` }]);
    setDropdownOpen(false);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleSave = async (draft = false) => {
    setSaving(true);
    setMessage(null);
    const fd = new FormData();
    if (pageId) fd.append('id', String(pageId));
    fd.append('title', title);
    fd.append('slug', slug);
    fd.append('status', draft ? 'draft' : status);
    fd.append('showInMenu', String(showInMenu));
    fd.append('parentPage', parentPage);
    fd.append('sections', JSON.stringify(sections));
    fd.append('richText', richText);
    fd.append('metaTitle', metaTitle);
    fd.append('metaDescription', metaDescription);
    fd.append('bannerBgImage', bannerBgImage);
    fd.append('bannerPosition', bannerPosition);
    fd.append('bannerSize', bannerSize);
    fd.append('bannerTitle', bannerTitle || title);
    fd.append('bannerDescription', bannerDescription);

    const res = await savePageAction(fd);
    setSaving(false);
    if (res.success) {
      setMessage('✅ Page Saved Successfully!');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage(`❌ Save Failed: ${res.error}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'inherit', color: '#1e293b' }}>

      {/* ── Top Bar Breadcrumb & Header ── */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '16px 24px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="text-[#004B39] border border-[#004B39] hover:border-[#DB9E30] px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#DB9E30] hover:text-black transition-all">
            ← Back to Pages
          </Link>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>{title || 'Page Editor'}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {message && (
            <span style={{ fontSize: 12, fontWeight: 700, color: message.startsWith('✅') ? '#059669' : '#dc2626' }}>
              {message}
            </span>
          )}

          <Link
            href={slug || '/'}
            target="_blank"
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#fff',
              fontSize: 12,
              fontWeight: 700,
              color: '#334155',
              textDecoration: 'none',
            }}
          >
            👁 View Page
          </Link>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#fff',
              fontSize: 12,
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            📄 Save Draft
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            style={{
              padding: '9px 22px',
              borderRadius: 10,
              border: 'none',
              background: '#004B39',
              fontSize: 12,
              fontWeight: 800,
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,75,57,0.25)',
            }}
          >
            {saving ? 'Saving...' : '✓ Update'}
          </button>
        </div>
      </div>

      {/* Page Banner Management & Real-Time Preview (Excluded on Homepage) */}
      {slug !== '/' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase m-0">🖼 PAGE BANNER CONFIGURATION</h3>
              <span className="text-[10px] text-slate-400 font-medium">Hero header settings & live preview</span>
            </div>
            {bannerBgImage && (
              <button
                type="button"
                onClick={() => setBannerBgImage('')}
                className="bg-red-50 text-red-500 hover:bg-red-100 border-none px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors"
              >
                ✕ Remove Image
              </button>
            )}
          </div>

          {/* Compact Real-Time Live Banner Preview */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              👁 REAL-TIME BANNER PREVIEW
            </label>
            <div
              className="relative w-full max-w-[1920px] max-h-[360px] h-[130px] rounded-xl overflow-hidden flex flex-col items-center justify-center text-center p-3 text-white shadow-md transition-all"
              style={{
                background: bannerBgImage
                  ? `linear-gradient(rgba(10, 66, 45, 0.88), rgba(10, 66, 45, 0.85)), url('${bannerBgImage}') ${bannerPosition} / ${bannerSize} no-repeat`
                  : 'linear-gradient(rgba(10, 66, 45, 0.88), rgba(10, 66, 45, 0.85)), url(\'https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg\') center center/cover no-repeat',
              }}
            >
              <h1
                className="text-xl md:text-2xl font-serif text-white m-0 font-normal tracking-wide [&>span]:text-[#DB9E30] [&>em]:text-[#DB9E30] [&>em]:not-italic"
                style={{ fontFamily: "var(--serif, 'Marcellus', serif)" }}
                dangerouslySetInnerHTML={{ __html: bannerTitle || title || 'Page Title' }}
              />
              {bannerDescription && (
                <p
                  className="text-xs opacity-90 max-w-xl m-0 mt-1 font-light leading-snug text-white/90"
                  style={{ fontFamily: "var(--sans, 'Plus Jakarta Sans', sans-serif)" }}
                >
                  {bannerDescription}
                </p>
              )}
            </div>
          </div>

          {/* Banner Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                POSITION
              </label>
              <select
                value={bannerPosition}
                onChange={(e) => setBannerPosition(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold outline-none focus:border-[#004B39]"
              >
                <option value="center center">Center Center</option>
                <option value="top center">Top Center</option>
                <option value="bottom center">Bottom Center</option>
                <option value="left center">Left Center</option>
                <option value="right center">Right Center</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                SIZE
              </label>
              <select
                value={bannerSize}
                onChange={(e) => setBannerSize(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold outline-none focus:border-[#004B39]"
              >
                <option value="cover">Cover (Default)</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto / Original</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                IMAGE UPLOADER
              </label>
              <input
                type="file"
                id="banner-file-input"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      if (evt.target?.result) setBannerBgImage(String(evt.target.result));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('banner-file-input')?.click()}
                className="w-full px-2.5 py-1.5 rounded-lg border border-dashed border-[#004B39] bg-emerald-50 text-[#004B39] text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                📁 {bannerBgImage ? 'Change Image' : 'Upload Image'}
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  TITLE (H1)
                </label>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // Prevent losing input text selection focus
                  onClick={() => {
                    const inputEl = document.getElementById('banner-title-input') as HTMLInputElement;
                    const fullText = bannerTitle || title;
                    if (inputEl && inputEl.selectionStart !== null && inputEl.selectionEnd !== null && inputEl.selectionStart !== inputEl.selectionEnd) {
                      const start = inputEl.selectionStart;
                      const end = inputEl.selectionEnd;
                      const selectedText = fullText.substring(start, end);
                      const newText = fullText.substring(0, start) + `<span>${selectedText}</span>` + fullText.substring(end);
                      setBannerTitle(newText);
                    } else {
                      // Fallback if no text highlighted: toggle last words
                      if (!fullText.includes('<span>')) {
                        setBannerTitle(fullText.replace(/([A-Z][a-z0-9\s&]+)$/i, '<span>$1</span>'));
                      } else {
                        setBannerTitle(fullText.replace(/<\/?span>/g, ''));
                      }
                    }
                  }}
                  className="text-[10px] font-bold text-[#DB9E30] hover:bg-amber-100 bg-amber-50 px-2 py-0.5 rounded cursor-pointer border border-[#DB9E30]/30 transition-colors"
                  title="Highlight any text in the input box and click to make it Gold"
                >
                  ✨ Gold Words
                </button>
              </div>
              <input
                id="banner-title-input"
                type="text"
                placeholder={title || 'Page Title'}
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                SUBTEXT / DESCRIPTION
              </label>
              <input
                type="text"
                placeholder="Compare rates, features..."
                value={bannerDescription}
                onChange={(e) => setBannerDescription(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs outline-none focus:border-[#004B39]"
              />
            </div>
          </div>

        </div>
      )}

      {/* ── Main 2-Column Workspace ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* Left Column: Title & Section Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Title & Slug Box */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #f1f5f9', boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                SLUG *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Dynamic Builder Tabs */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}>

            {/* Tab Bar Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', padding: '0 16px' }}>
              {[
                { key: 'sections', label: '🧱 Page Sections (Dynamic)' },
                { key: 'richtext', label: '📝 Rich Text' },
                { key: 'seo', label: '🔍 SEO Center' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as any)}
                  style={{
                    padding: '16px 20px',
                    border: 'none',
                    borderBottom: activeTab === t.key ? '3px solid #004B39' : '3px solid transparent',
                    background: 'transparent',
                    color: activeTab === t.key ? '#004B39' : '#64748b',
                    fontWeight: activeTab === t.key ? 800 : 600,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content Panel */}
            <div style={{ padding: 24 }}>
              {activeTab === 'sections' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#0f172a' }}>Page Sections</h3>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>Build page layout with reorderable sections</p>
                    </div>

                    {/* Add Section Dropdown Button */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{
                          background: '#004B39',
                          color: '#fff',
                          padding: '10px 18px',
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 12,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        + Add Section ▾
                      </button>

                      {dropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          right: 0,
                          width: 220,
                          background: '#fff',
                          borderRadius: 12,
                          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                          border: '1px solid #e2e8f0',
                          zIndex: 100,
                          padding: 6,
                          maxHeight: 280,
                          overflowY: 'auto',
                        }}>
                          {SECTION_OPTIONS.map((opt) => (
                            <div
                              key={opt}
                              onClick={() => addSection(opt)}
                              style={{
                                padding: '8px 12px',
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#334155',
                                borderRadius: 6,
                                cursor: 'pointer',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sections.map((sec) => (
                      <div
                        key={sec.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 14,
                          padding: '14px 18px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ color: '#cbd5e1', cursor: 'grab' }}>:::</span>
                          <span style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 800,
                            color: '#004B39',
                          }}>
                            {sec.type.substring(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{sec.type}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{sec.title}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14 }}>✎</button>
                          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14 }}>👁</button>
                          <button onClick={() => removeSection(sec.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, color: '#ef4444' }}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'richtext' && (
                <div>
                  <textarea
                    value={richText}
                    onChange={(e) => setRichText(e.target.value)}
                    placeholder="Enter rich text page content here..."
                    rows={10}
                    style={{
                      width: '100%',
                      padding: 16,
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              )}

              {activeTab === 'seo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>META TITLE</label>
                    <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>META DESCRIPTION</label>
                    <textarea rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Status Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Status Panel */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #f1f5f9', boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>STATUS</span>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Visible on the website</div>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                style={{
                  background: status === 'published' ? '#ecfdf5' : '#fffbe0',
                  color: status === 'published' ? '#059669' : '#d97706',
                  padding: '5px 12px',
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 800,
                  border: status === 'published' ? '1px solid #a7f3d0' : '1px solid #fde68a',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <option value="published" style={{ background: '#ffffff', color: '#059669', fontWeight: 700 }}>Published</option>
                <option value="draft" style={{ background: '#ffffff', color: '#d97706', fontWeight: 700 }}>Draft</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Show in menu</span>
              <input
                type="checkbox"
                checked={showInMenu}
                onChange={(e) => setShowInMenu(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
            ⏱ Auto-saves draft every 60 seconds
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PageBuilderPage() {
  return (
    <AdminLayout user={{ name: 'Admin', role: 'super_admin' }}>
      <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>Loading Page Editor...</div>}>
        <PageBuilderContent />
      </Suspense>
    </AdminLayout>
  );
}
