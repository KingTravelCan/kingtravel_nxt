'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getPagesList, deletePageAction, updatePageOrderAction, updatePageStatusAction } from '@/actions/pageActions';
import Link from 'next/link';

import ConfirmModal, { ConfirmModalConfig } from '@/components/ui/ConfirmModal';
import { Trash2, Pencil, Copy, Check } from 'lucide-react';

export default function AdminPagesListPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmModalConfig | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    getPagesList().then((res) => {
      if (res && Array.isArray(res)) setPages(res);
    });
  }, []);

  const handleCopySlug = (id: number, slug: string) => {
    const fullUrl = `${window.location.origin}${slug.startsWith('/') ? slug : '/' + slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (id: number, newStatus: 'published' | 'draft') => {
    setPages((prevPages) =>
      prevPages.map((p) => (p.id === id ? { ...p, status: newStatus, updatedAt: new Date() } : p))
    );
    await updatePageStatusAction(id, newStatus);
  };

  const handleDelete = (id: number, title: string) => {
    setConfirmConfig({
      icon: <Trash2 className="w-3 h-3 text-red-600" />,
      title: 'Delete Page',
      message: `Would you like to permanently delete the page "${title}"? This cannot be undone.`,
      confirmText: 'Delete page',
      cancelText: 'Not now',
      variant: 'danger',
      onConfirm: async () => {
        setDeletingId(id);
        const res = await deletePageAction(id);
        if (res.success) {
          setPages((prev) => prev.filter((p) => p.id !== id));
        }
        setDeletingId(null);
      },
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...pages];
    const item = updated.splice(draggedIndex, 1)[0];
    updated.splice(index, 0, item);
    setDraggedIndex(index);
    setPages(updated);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const orderedIds = pages.map(p => p.id);
    await updatePageOrderAction(orderedIds);
  };

  const filteredPages = pages.filter((p) => {
    const searchLower = search.trim().toLowerCase();
    const matchesSearch =
      !searchLower ||
      (p.title || '').toLowerCase().includes(searchLower) ||
      (p.slug || '').toLowerCase().includes(searchLower);
    const itemStatus = (p.status || 'published').toLowerCase();
    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout user={{ name: 'Admin User', role: 'Super Admin' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Top Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Pages</h1>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, marginBottom: 0 }}>Manage live website pages, titles, slugs, dynamic page sections &amp; order</p>
          </div>
          <Link
            href="/admin/pages/edit"
            style={{
              background: '#004B39',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(0,75,57,0.25)',
            }}
          >
            + Create New Page
          </Link>
        </div>

        {/* Filter / Search Bar */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '16px 20px',
          border: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
        }}>
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              maxWidth: 400,
              padding: '10px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              fontSize: 13,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, background: '#fff', outline: 'none' }}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Pages Table — Dynamic & Draggable */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 12px', width: 40, textAlign: 'center' }}>⋮⋮</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Title</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Slug</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Updated</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((p: any, idx: number) => (
                <tr
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: draggedIndex === idx ? '#f0fdf4' : '#fff',
                    cursor: 'grab',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <td style={{ padding: '16px 12px', textAlign: 'center', color: '#94a3b8', fontSize: 16, cursor: 'grab' }} title="Drag to reorder">
                    ⋮⋮
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0f172a' }}>{p.title}</td>
                  <td style={{ padding: '16px 20px', color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>
                    <div className="flex items-center gap-2 group">
                      <span>{p.slug}</span>
                      <button
                        type="button"
                        onClick={() => handleCopySlug(p.id, p.slug)}
                        className="p-1 rounded-md text-primary hover:text-slate-900 hover:bg-gold/20 transition-colors border-none cursor-pointer flex items-center justify-center"
                        title="Copy full page URL"
                      >
                        {copiedId === p.id ? (
                          <Check className="w-3.5 h-3.5 text-primary bg-primary/10 font-bold" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div className="relative inline-block">
                      <select
                        value={p.status || 'published'}
                        onChange={(e) => handleStatusChange(p.id, e.target.value as 'published' | 'draft')}
                        className="appearance-none font-bold text-[11px] px-3 py-1 pr-4 rounded-full cursor-pointer transition-colors border outline-none shadow-2xs uppercase tracking-normal"
                        style={{
                          backgroundColor: p.status === 'published' ? '#ecfdf5' : '#fffbe0',
                          color: p.status === 'published' ? '#059669' : '#d97706',
                          borderColor: p.status === 'published' ? '#a7f3d0' : '#fde68a',
                        }}
                      >
                        <option value="published" className="bg-white text-emerald-800 font-bold py-1">
                          • Published
                        </option>
                        <option value="draft" className="bg-white text-amber-800 font-bold py-1">
                          • Draft
                        </option>
                      </select>
                      <span
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px]"
                        style={{ color: p.status === 'published' ? '#059669' : '#d97706' }}
                      >
                        ▼
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8', fontSize: 12 }}>
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                      <Link href={`/admin/pages/edit?id=${p.id}`} className="flex gap-1 px-3 py-1.5 rounded-lg bg-gold/50 text-primary no-underline text-[11px] font-bold hover:bg-gold transition-colors">
                        <Pencil className='w-3 h-3' />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        disabled={deletingId === p.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === p.id ? 'Deleting...' : <><Trash2 className="w-3 h-3" /></>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal config={confirmConfig} onClose={() => setConfirmConfig(null)} />
    </AdminLayout>
  );
}
