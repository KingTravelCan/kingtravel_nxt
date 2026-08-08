'use client';

import { useState } from 'react';
import { createPackage, updatePackageAction, deletePackage, updatePackageStatus } from '@/actions/packageActions';
import ConfirmModal, { ConfirmModalConfig } from '@/components/ui/ConfirmModal';
import { Trash2, Edit2, Plus, Sparkles, Sliders } from 'lucide-react';
import SeoCenterModal from '@/components/admin/SeoCenterModal';

interface PackagesClientProps {
  initialPackages: any[];
}

export default function PackagesClient({ initialPackages }: PackagesClientProps) {
  const [packagesList, setPackagesList] = useState<any[]>(initialPackages);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);
  const [selectedSeoPkg, setSelectedSeoPkg] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmModalConfig | null>(null);

  const [newPkg, setNewPkg] = useState({
    title: '',
    type: 'umrah' as 'umrah' | 'hajj',
    month: 'Flexible 2026',
    startingPrice: '1995.00',
    starRating: '5 Star',
    shortDescription: '',
    fullDescription: '',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPkg.title);
    formData.append('type', newPkg.type);
    formData.append('month', newPkg.month);
    formData.append('startingPrice', newPkg.startingPrice);
    formData.append('starRating', newPkg.starRating);
    formData.append('shortDescription', newPkg.shortDescription);
    formData.append('fullDescription', newPkg.fullDescription);

    const res = await createPackage(formData);
    if (res.success) {
      setSaveMsg('Package created successfully!');
      setTimeout(() => setSaveMsg(null), 3000);
      setIsCreating(false);
      setNewPkg({
        title: '',
        type: 'umrah',
        month: 'Flexible 2026',
        startingPrice: '1995.00',
        starRating: '5 Star',
        shortDescription: '',
        fullDescription: '',
      });
      window.location.reload();
    } else {
      alert(res.error || 'Failed to create package.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;

    const res = await updatePackageAction(editingPkg.id, {
      title: editingPkg.title,
      type: editingPkg.type,
      month: editingPkg.month,
      startingPrice: editingPkg.startingPrice,
      starRating: editingPkg.starRating,
      status: editingPkg.status,
      shortDescription: editingPkg.shortDescription,
      fullDescription: editingPkg.fullDescription,
    });

    if (res.success) {
      setPackagesList((prev) => prev.map((p) => (p.id === editingPkg.id ? editingPkg : p)));
      setEditingPkg(null);
      setSaveMsg('Package updated successfully!');
      setTimeout(() => setSaveMsg(null), 3000);
    } else {
      alert(res.error || 'Failed to update package.');
    }
  };

  const handleDeleteInitiate = (id: number, title: string) => {
    setConfirmConfig({
      icon: <Trash2 className="w-4 h-4 text-red-600" />,
      title: `Delete ${title}?`,
      message: `Are you sure you want to permanently delete "${title}"? This cannot be undone.`,
      confirmText: 'Yes, Delete Package',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        await deletePackage(id);
        setPackagesList((prev) => prev.filter((p) => p.id !== id));
        setSaveMsg('Package deleted.');
        setTimeout(() => setSaveMsg(null), 3000);
      },
    });
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'available' ? 'sold_out' : 'available';
    await updatePackageStatus(id, nextStatus as any);
    setPackagesList((prev) => prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 m-0">Pilgrimage Packages</h1>
          <p className="text-xs text-slate-500 mt-1 mb-0">
            Manage Hajj &amp; Umrah package offerings, prices, and live availability
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && <span className="text-xs font-bold text-emerald-600 animate-in fade-in">{saveMsg}</span>}
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="bg-[#DB9E30] hover:bg-[#c38927] text-slate-950 px-5 py-2.5 rounded-full text-xs font-extrabold transition-colors cursor-pointer border-none shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? 'Close Form' : 'Create New Package'}
          </button>
        </div>
      </div>

      {/* Create Package Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs animate-in fade-in">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#DB9E30]" /> Add New Pilgrimage Package
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Package Title *</label>
              <input
                type="text"
                placeholder="e.g. 5 Star September Umrah Package 2026"
                value={newPkg.title}
                onChange={(e) => setNewPkg({ ...newPkg, title: e.target.value })}
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Package Type *</label>
              <select
                value={newPkg.type}
                onChange={(e) => setNewPkg({ ...newPkg, type: e.target.value as any })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] bg-white"
              >
                <option value="umrah">🕋 Umrah Package</option>
                <option value="hajj">🕌 Hajj Package</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Month / Travel Dates *</label>
              <input
                type="text"
                placeholder="e.g. September 2026 (14 Nights)"
                value={newPkg.month}
                onChange={(e) => setNewPkg({ ...newPkg, month: e.target.value })}
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Starting Price (CAD) *</label>
              <input
                type="text"
                placeholder="2695.00"
                value={newPkg.startingPrice}
                onChange={(e) => setNewPkg({ ...newPkg, startingPrice: e.target.value })}
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Hotel Star Rating</label>
              <select
                value={newPkg.starRating}
                onChange={(e) => setNewPkg({ ...newPkg, starRating: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] bg-white"
              >
                <option value="5 Star">5 Star Luxury</option>
                <option value="4 Star">4 Star Premium</option>
                <option value="3 Star">3 Star Standard</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-bold text-slate-700 block mb-1">Short Summary Description</label>
              <input
                type="text"
                placeholder="Brief package highlight description"
                value={newPkg.shortDescription}
                onChange={(e) => setNewPkg({ ...newPkg, shortDescription: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full text-xs font-extrabold bg-[#004B39] text-white border-none cursor-pointer shadow-md"
              >
                Publish Package
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Package Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900 m-0 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#DB9E30]" /> Edit Package Details
              </h3>
              <button
                type="button"
                onClick={() => setEditingPkg(null)}
                className="text-slate-400 hover:text-slate-600 bg-transparent border-none text-base cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Package Title</label>
                <input
                  type="text"
                  value={editingPkg.title}
                  onChange={(e) => setEditingPkg({ ...editingPkg, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                <select
                  value={editingPkg.type}
                  onChange={(e) => setEditingPkg({ ...editingPkg, type: e.target.value as any })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] bg-white"
                >
                  <option value="umrah">Umrah Package</option>
                  <option value="hajj">Hajj Package</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Travel Month / Duration</label>
                <input
                  type="text"
                  value={editingPkg.month || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, month: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Starting Price (CAD)</label>
                <input
                  type="text"
                  value={editingPkg.startingPrice || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, startingPrice: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={editingPkg.status || 'available'}
                  onChange={(e) => setEditingPkg({ ...editingPkg, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] bg-white"
                >
                  <option value="available">Available</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingPkg.shortDescription || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-5 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full text-xs font-extrabold bg-[#004B39] text-white border-none cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Packages Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-extrabold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Package Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Starting Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packagesList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No packages in database yet.
                  </td>
                </tr>
              ) : (
                packagesList.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{pkg.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">{pkg.slug}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                        pkg.type === 'hajj'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {pkg.type === 'hajj' ? '🕌 Hajj' : '🕋 Umrah'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{pkg.month || 'Flexible'}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      CAD ${Number(pkg.startingPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(pkg.id, pkg.status)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border cursor-pointer ${
                          pkg.status === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        ● {pkg.status || 'available'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSeoPkg(pkg)}
                          title="Package SEO Center"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#004B39] border border-emerald-200 text-[10px] font-extrabold hover:bg-[#004B39] hover:text-white transition-all cursor-pointer shadow-2xs"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>SEO</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPkg(pkg)}
                          title="Edit Package"
                          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#004B39] text-slate-600 hover:text-white flex items-center justify-center border-none cursor-pointer transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteInitiate(pkg.id, pkg.title)}
                          title="Delete Package"
                          className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white flex items-center justify-center border-none cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal config={confirmConfig} onClose={() => setConfirmConfig(null)} />

      <SeoCenterModal
        isOpen={!!selectedSeoPkg}
        onClose={() => setSelectedSeoPkg(null)}
        pageData={
          selectedSeoPkg
            ? {
                id: `pkg_${selectedSeoPkg.id}`,
                title: selectedSeoPkg.title,
                slug: `/package/${selectedSeoPkg.id}`,
                metaTitle: `${selectedSeoPkg.title} | King Travel Canada`,
                metaDescription: `Book official ${selectedSeoPkg.title} from Canada. Starting at CAD $${selectedSeoPkg.startingPrice}. ${selectedSeoPkg.shortDescription || 'Verified visa, luxury hotel stays, flights included.'}`,
              }
            : null
        }
      />
    </div>
  );
}
