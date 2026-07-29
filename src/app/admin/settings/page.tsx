'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { getNavItems, saveNavItemsAction, getPagesList } from '@/actions/pageActions';

const TABS = [
  { id: 'header-footer', label: 'Header & Footer', icon: '🎨' },
  { id: 'seo', label: 'SEO Intelligence', icon: '🔍' },
  { id: 'identity', label: 'Site Identity', icon: '🏢' },
  { id: 'share', label: 'Share Tools', icon: '🔗' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'dates', label: 'Hijri/Gregorian Dates', icon: '📅' },
  { id: 'auth', label: 'Login Auth', icon: '🔐' },
  { id: 'popup', label: 'Disclaimer Popup', icon: '🚨' },
  { id: 'css', label: 'Global CSS', icon: '💻' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('header-footer');
  const [subTab, setSubTab] = useState<'header' | 'footer'>('header');

  // Form states
  const [siteName, setSiteName] = useState('King Travel Canada');
  const [altText, setAltText] = useState('Official King Travel Canada Logo');
  const [youtubeUrl, setYoutubeUrl] = useState('https://youtube.com/@kingtravelcan');
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/kingtravelcan');
  const [twitterUrl, setTwitterUrl] = useState('https://twitter.com/kingtravelcan');
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/19056248344');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/kingtravelcan');
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [showDateBar, setShowDateBar] = useState(true);
  const [customCss, setCustomCss] = useState('/* Add custom CSS rules here */');

  // Navigation Builder State
  const [navTree, setNavTree] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagesList, setPagesList] = useState<any[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    getNavItems().then(items => {
      if (items && Array.isArray(items)) setNavTree(items);
    });
    getPagesList().then(pages => {
      if (pages && Array.isArray(pages)) setPagesList(pages);
    });
  }, []);

  const handleSaveNav = async (updatedTree: any[]) => {
    setNavTree(updatedTree);
    const res = await saveNavItemsAction(updatedTree);
    if (res.success) {
      setSaveMsg('✅ Navigation Menu Updated!');
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  return (
    <AdminLayout user={{ name: 'Admin User', role: 'Super Admin' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'inherit', color: '#1e293b' }}>
      
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">⚙️</span>
          <h1 className="text-2xl font-extrabold text-slate-900 m-0">Settings</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 mb-0">
          Manage global interface settings, brand identity, navigation builders, and system options.
        </p>
      </div>

      {/* ── Top Multi-Tab Bar ── */}
      <div className="flex gap-2 flex-wrap bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeTab === t.id
                ? 'bg-[#004B39] text-white border-[#004B39]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Header & Footer Sub-Tabs ── */}
      {activeTab === 'header-footer' && (
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setSubTab('header')}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: subTab === 'header' ? '1px solid #004B39' : '1px solid #e2e8f0',
              background: subTab === 'header' ? '#e6f4f1' : '#fff',
              color: subTab === 'header' ? '#004B39' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            📋 Header Builder
          </button>
          <button
            onClick={() => setSubTab('footer')}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: subTab === 'footer' ? '1px solid #004B39' : '1px solid #e2e8f0',
              background: subTab === 'footer' ? '#e6f4f1' : '#fff',
              color: subTab === 'footer' ? '#004B39' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            👣 Footer Builder
          </button>
        </div>
      )}

      {/* ── Main Tab Content Box ── */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 28,
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      }}>

        {/* ================= TAB 1: HEADER & FOOTER ================= */}
        {activeTab === 'header-footer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Logo & Identity Panel */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                🖼 LOGO &amp; IDENTITY
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, alignItems: 'center' }}>
                <div style={{
                  background: '#f8fafc',
                  border: '2px dashed #cbd5e1',
                  borderRadius: 14,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <img src="/img/logo.png" alt="Logo Preview" style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
                  <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 8, display: 'block' }}>PNG, SVG or WEBP</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>
                      SITE NAME (TEXT FALLBACK)
                    </label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: 13, outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>
                      ALTERNATIVE TEXT
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: 13, outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu Builder (Multi-level & Colorized) */}
            <div className="border-b border-slate-100 pb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider m-0">
                    📂 NAVIGATION MENU BUILDER
                  </h3>
                  {saveMsg && <span className="text-xs font-bold text-emerald-600">{saveMsg}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({ id: String(Date.now()), label: '', url: '', level: 1, parentId: null, children: [] });
                    setIsModalOpen(true);
                  }}
                  className="bg-[#004B39] text-white hover:bg-[#00382B] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border-none shadow-sm flex items-center gap-1"
                >
                  + Add Item
                </button>
              </div>

              {/* Render Multi-level Colorized Menu Tree */}
              <div className="flex flex-col gap-2">
                {navTree.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1.5">
                    {/* Level 1: White/Emerald Card */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-800/20 bg-gradient-to-r from-emerald-50/70 to-white shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-400 font-bold text-xs">⋮⋮</span>
                        <span className="font-bold text-xs text-slate-800">{item.label}</span>
                        {item.children && item.children.length > 0 && (
                          <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {item.children.length} sub
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-mono">{item.url}</span>
                        <button
                          type="button"
                          title="Add Sub Item"
                          onClick={() => {
                            setEditingItem({ id: String(Date.now()), label: '', url: '', level: 2, parentId: item.id, children: [] });
                            setIsModalOpen(true);
                          }}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded border-none"
                        >
                          + Sub
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem({ ...item });
                            setIsModalOpen(true);
                          }}
                          className="text-xs text-slate-600 hover:text-[#004B39] font-bold cursor-pointer border-none bg-transparent"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newTree = navTree.filter(t => t.id !== item.id);
                            handleSaveNav(newTree);
                          }}
                          className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer border-none bg-transparent"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Level 2 Sub-items: Muted Teal/Sage Level */}
                    {item.children && item.children.map((sub: any) => (
                      <div key={sub.id} className="ml-6 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-teal-200 bg-teal-50/70 shadow-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-teal-400 font-bold text-xs">↳ ⋮⋮</span>
                            <span className="font-bold text-xs text-teal-900">{sub.label}</span>
                            {sub.children && sub.children.length > 0 && (
                              <span className="text-[10px] font-extrabold bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full">
                                {sub.children.length} sub
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-teal-700 font-mono">{sub.url}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem({ ...sub, parentId: item.id });
                                setIsModalOpen(true);
                              }}
                              className="text-xs text-teal-800 hover:text-teal-950 font-bold cursor-pointer border-none bg-transparent"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newTree = navTree.map(t => {
                                  if (t.id === item.id) {
                                    return { ...t, children: t.children.filter((c: any) => c.id !== sub.id) };
                                  }
                                  return t;
                                });
                                handleSaveNav(newTree);
                              }}
                              className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer border-none bg-transparent"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* Level 3 Sub-items: Sky/Blue Level */}
                        {sub.children && sub.children.map((sub3: any) => (
                          <div key={sub3.id} className="ml-6 flex items-center justify-between p-2 rounded-lg border border-sky-200 bg-sky-50 shadow-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-sky-400 font-bold text-xs">↳↳ ⋮⋮</span>
                              <span className="font-bold text-xs text-sky-900">{sub3.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-sky-700 font-mono">{sub3.url}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItem({ ...sub3, parentId: sub.id });
                                  setIsModalOpen(true);
                                }}
                                className="text-xs text-sky-800 font-bold cursor-pointer border-none bg-transparent"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const newTree = navTree.map(t => {
                                    if (t.id === item.id) {
                                      return {
                                        ...t,
                                        children: t.children.map((c: any) => {
                                          if (c.id === sub.id) {
                                            return { ...c, children: c.children.filter((c3: any) => c3.id !== sub3.id) };
                                          }
                                          return c;
                                        })
                                      };
                                    }
                                    return t;
                                  });
                                  handleSaveNav(newTree);
                                }}
                                className="text-xs text-red-500 font-bold cursor-pointer border-none bg-transparent"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* CRUD Modal for Menu Item Configuration */}
            {isModalOpen && editingItem && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider m-0">
                      {editingItem.id ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 font-bold border-none bg-transparent text-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Quick Link to Existing Dynamic CMS Page */}
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                    <label className="block text-[11px] font-bold text-[#004B39] mb-1">
                      🔗 Quick Link to Existing Page
                    </label>
                    <select
                      onChange={(e) => {
                        const selectedSlug = e.target.value;
                        const match = pagesList.find(p => p.slug === selectedSlug);
                        if (match) {
                          setEditingItem({ ...editingItem, label: match.title, url: match.slug });
                        }
                      }}
                      className="w-full p-2 rounded-lg border border-emerald-300 bg-white text-xs outline-none focus:ring-2 focus:ring-[#004B39]"
                    >
                      <option value="">— Select a Page to auto-fill —</option>
                      {pagesList.map(p => (
                        <option key={p.id} value={p.slug}>{p.title} ({p.slug})</option>
                      ))}
                    </select>
                  </div>

                  {/* Manual Label & URL Inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Label *</label>
                      <input
                        type="text"
                        value={editingItem.label || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs outline-none focus:border-[#004B39]"
                        placeholder="e.g. Services"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">URL *</label>
                      <input
                        type="text"
                        value={editingItem.url || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs outline-none focus:border-[#004B39]"
                        placeholder="e.g. /services"
                      />
                    </div>
                  </div>

                  {/* Parent Item Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Parent Item (for sub-menus)</label>
                    <select
                      value={editingItem.parentId || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, parentId: e.target.value || null })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs outline-none focus:border-[#004B39]"
                    >
                      <option value="">— Top Level —</option>
                      {navTree.map(t => (
                        <option key={t.id} value={t.id}>{t.label} (Top Level)</option>
                      ))}
                    </select>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingItem.label || !editingItem.url) return;
                        let updatedTree = [...navTree];
                        if (editingItem.parentId) {
                          // Insert into parent children array
                          updatedTree = updatedTree.map(t => {
                            if (t.id === editingItem.parentId) {
                              const existingSubIdx = (t.children || []).findIndex((c: any) => c.id === editingItem.id);
                              let newSubs = [...(t.children || [])];
                              if (existingSubIdx >= 0) {
                                newSubs[existingSubIdx] = editingItem;
                              } else {
                                newSubs.push({ ...editingItem, level: 2, children: [] });
                              }
                              return { ...t, children: newSubs };
                            }
                            return t;
                          });
                        } else {
                          // Top level item update/insert
                          const idx = updatedTree.findIndex(t => t.id === editingItem.id);
                          if (idx >= 0) {
                            updatedTree[idx] = { ...updatedTree[idx], label: editingItem.label, url: editingItem.url };
                          } else {
                            updatedTree.push({ ...editingItem, level: 1, children: [] });
                          }
                        }
                        handleSaveNav(updatedTree);
                        setIsModalOpen(false);
                      }}
                      className="px-5 py-2 rounded-lg bg-[#004B39] text-white text-xs font-bold hover:bg-[#00382B] cursor-pointer border-none shadow-sm"
                    >
                      💾 Save Item
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Visibility Toggles */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 24, paddingTop: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                👁 VISIBILITY TOGGLES
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Search Bar</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Show the search input in the header</div>
                  </div>
                  <input type="checkbox" checked={showSearchBar} onChange={(e) => setShowSearchBar(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Data Display</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Show Gregorian &amp; Hijri date bar</div>
                  </div>
                  <input type="checkbox" checked={showDateBar} onChange={(e) => setShowDateBar(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                🌐 SOCIAL MEDIA LINKS (TOP BAR &amp; FOOTER)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>YOUTUBE</label>
                  <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: 13, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>FACEBOOK</label>
                  <input type="text" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: 13, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>TWITTER (X)</label>
                  <input type="text" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: 13, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>WHATSAPP NUMBER</label>
                  <input type="text" value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: 13, outline: 'none' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: GLOBAL CSS ================= */}
        {activeTab === 'css' && (
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              💻 CUSTOM GLOBAL CSS OVERRIDES
            </h3>
            <textarea
              rows={12}
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-300 font-mono text-xs bg-slate-900 text-sky-400 outline-none focus:ring-2 focus:ring-[#004B39]"
            />
          </div>
        )}

        {/* ================= OTHER TABS PLACEHOLDER ================= */}
        {activeTab !== 'header-footer' && activeTab !== 'css' && (
          <div className="p-6 text-center text-slate-500">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {TABS.find((t) => t.id === activeTab)?.label} Configuration
            </h3>
            <p className="text-xs">Advanced settings for {activeTab} can be managed here.</p>
          </div>
        )}

        {/* Save Footer Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button className="bg-[#004B39] text-white px-7 py-3 rounded-xl font-extrabold text-xs border-none cursor-pointer shadow-md hover:bg-[#00382B] transition-colors">
            💾 Save Settings
          </button>
        </div>

        </div>
      </div>
    </AdminLayout>
  );
}
