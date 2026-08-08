'use client';

import { useState } from 'react';
import { createPackage, updatePackageAction, deletePackage, updatePackageStatus } from '@/actions/packageActions';
import ConfirmModal, { ConfirmModalConfig } from '@/components/ui/ConfirmModal';
import { Trash2, Edit2, Plus, Sparkles, Sliders, X, BookOpen, Hotel, Plane } from 'lucide-react';
import SeoCenterModal from '@/components/admin/SeoCenterModal';
import ImageUploadWidget from '@/components/admin/ImageUploadWidget';

interface PackagesClientProps {
  initialPackages: any[];
  defaultTab: 'hajj' | 'umrah';
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const defaultHajjCardData = {
  bannerImage: '',
  badgeTag: 'HAJJ 2027',
  duration: '14Days',
  flightRoute: 'FROM CANADA ➔ TO SAUDIA',
  operatorName: 'King Travel',
  operatorRating: '4.4/5',
  btnLabel: 'Book Hajj 2027',
  btnLink: '/contact',
  priceSubtext: 'FROM CAD / QUAD OCCUPANCY',
  makkahHotel: { image: '', name: '5 Star Hotel in Makkah', location: 'Near to Haram', badge: 'Breakfast', nights: '6 Nights' },
  madinahHotel: { image: '', name: '5 Star Hotel in Madinah', location: 'Near to Masjid Nabawi', badge: 'Breakfast', nights: '6 Nights' },
};

const defaultUmrahCardData = {
  bannerImage: '',
  isActiveCard: false,
  btnLabel: 'BOOK NOW',
  btnLink: '/contact',
  includes: ['Return Flights from Toronto', '5 Star Hotel in Makkah', '5 Star Hotel in Madinah', 'Visa & Registration', 'Imam & Guide'],
};

function getDefaultCardData(type: 'hajj' | 'umrah') {
  return type === 'hajj' ? { ...defaultHajjCardData } : { ...defaultUmrahCardData };
}

// ─── Hajj Card Fields ────────────────────────────────────────────────────────

function HajjCardFields({ pkgData, setPkgData }: { pkgData: any; setPkgData: (v: any) => void }) {
  const cd = pkgData.cardData || defaultHajjCardData;
  const updateCD = (f: string, v: any) => setPkgData({ ...pkgData, cardData: { ...cd, [f]: v } });
  const updateMak = (f: string, v: any) => updateCD('makkahHotel', { ...(cd.makkahHotel || {}), [f]: v });
  const updateMad = (f: string, v: any) => updateCD('madinahHotel', { ...(cd.madinahHotel || {}), [f]: v });

  return (
    <div className="col-span-full space-y-5 p-5 border border-amber-200 bg-amber-50/40 rounded-2xl">
      <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider border-b border-amber-200 pb-2 flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5" /> Dynamic Card Details
      </h4>

      {/* Banner + Badge row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <label className="text-[10px] font-bold text-slate-500 mb-1 block">BANNER IMAGE</label>
          <ImageUploadWidget value={cd.bannerImage || ''} onChange={(url) => updateCD('bannerImage', url)} subfolder="packages" />
        </div>
        <div className="md:w-2/3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">TOP LEFT BADGE</label>
            <input type="text" value={cd.badgeTag || ''} onChange={e => updateCD('badgeTag', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">DURATION BADGE</label>
            <input type="text" value={cd.duration || ''} onChange={e => updateCD('duration', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">FLIGHT ROUTE TAGLINE</label>
            <input type="text" value={cd.flightRoute || ''} onChange={e => updateCD('flightRoute', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">OPERATOR NAME</label>
            <input type="text" value={cd.operatorName || ''} onChange={e => updateCD('operatorName', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">OPERATOR RATING</label>
            <input type="text" value={cd.operatorRating || ''} onChange={e => updateCD('operatorRating', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">PRICE SUBTEXT</label>
            <input type="text" value={cd.priceSubtext || ''} onChange={e => updateCD('priceSubtext', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">BUTTON LABEL</label>
            <input type="text" value={cd.btnLabel || ''} onChange={e => updateCD('btnLabel', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">BUTTON LINK</label>
            <input type="text" value={cd.btnLink || ''} onChange={e => updateCD('btnLink', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
        </div>
      </div>

      {/* Hotels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Makkah Hotel */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h5 className="text-[10px] font-extrabold text-slate-700 mb-3 flex items-center gap-1.5">
            <Hotel className="w-3 h-3 text-amber-600" /> Makkah Hotel
          </h5>
          <div className="space-y-2.5">
            <ImageUploadWidget value={cd.makkahHotel?.image || ''} onChange={(url) => updateMak('image', url)} subfolder="packages" />
            <div>
              <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">HOTEL NAME</label>
              <input type="text" value={cd.makkahHotel?.name || ''} onChange={e => updateMak('name', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">LOCATION SUBTEXT</label>
              <input type="text" value={cd.makkahHotel?.location || ''} onChange={e => updateMak('location', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">MEAL BADGE</label>
                <input type="text" value={cd.makkahHotel?.badge || ''} onChange={e => updateMak('badge', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">NIGHTS</label>
                <input type="text" value={cd.makkahHotel?.nights || ''} onChange={e => updateMak('nights', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Madinah Hotel */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h5 className="text-[10px] font-extrabold text-slate-700 mb-3 flex items-center gap-1.5">
            <Hotel className="w-3 h-3 text-emerald-600" /> Madinah Hotel
          </h5>
          <div className="space-y-2.5">
            <ImageUploadWidget value={cd.madinahHotel?.image || ''} onChange={(url) => updateMad('image', url)} subfolder="packages" />
            <div>
              <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">HOTEL NAME</label>
              <input type="text" value={cd.madinahHotel?.name || ''} onChange={e => updateMad('name', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">LOCATION SUBTEXT</label>
              <input type="text" value={cd.madinahHotel?.location || ''} onChange={e => updateMad('location', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">MEAL BADGE</label>
                <input type="text" value={cd.madinahHotel?.badge || ''} onChange={e => updateMad('badge', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">NIGHTS</label>
                <input type="text" value={cd.madinahHotel?.nights || ''} onChange={e => updateMad('nights', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Umrah Card Fields ────────────────────────────────────────────────────────

function UmrahCardFields({ pkgData, setPkgData }: { pkgData: any; setPkgData: (v: any) => void }) {
  const cd = pkgData.cardData || defaultUmrahCardData;
  const updateCD = (f: string, v: any) => setPkgData({ ...pkgData, cardData: { ...cd, [f]: v } });

  const includes: string[] = Array.isArray(cd.includes) ? cd.includes : [];

  const updateIncludes = (idx: number, val: string) => {
    const next = [...includes];
    next[idx] = val;
    updateCD('includes', next);
  };
  const addInclude = () => updateCD('includes', [...includes, '']);
  const removeInclude = (idx: number) => updateCD('includes', includes.filter((_, i) => i !== idx));

  return (
    <div className="col-span-full space-y-5 p-5 border border-emerald-200 bg-emerald-50/30 rounded-2xl">
      <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider border-b border-emerald-200 pb-2 flex items-center gap-2">
        <Plane className="w-3.5 h-3.5" /> Dynamic Card Details
      </h4>

      {/* Banner image + links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 mb-1 block">CARD HERO IMAGE</label>
          <ImageUploadWidget value={cd.bannerImage || ''} onChange={(url) => updateCD('bannerImage', url)} subfolder="packages" />
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">BUTTON LABEL</label>
            <input type="text" value={cd.btnLabel || ''} onChange={e => updateCD('btnLabel', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-1 block">BUTTON LINK</label>
            <input type="text" value={cd.btnLink || ''} onChange={e => updateCD('btnLink', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs" />
          </div>
          <div className="flex items-center gap-3">
            <input
              id="isActiveCard"
              type="checkbox"
              checked={!!cd.isActiveCard}
              onChange={e => updateCD('isActiveCard', e.target.checked)}
              className="w-4 h-4 rounded accent-[#DB9E30]"
            />
            <label htmlFor="isActiveCard" className="text-xs font-bold text-slate-700 cursor-pointer">
              Featured / Gold card style
            </label>
          </div>
        </div>
      </div>

      {/* Package Includes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PACKAGE INCLUDES</label>
          <button type="button" onClick={addInclude} className="text-[10px] font-extrabold text-emerald-700 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer">
            + Add Item
          </button>
        </div>
        <div className="space-y-2">
          {includes.map((inc, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={inc}
                onChange={e => updateIncludes(idx, e.target.value)}
                placeholder="e.g. Return Flights from Toronto"
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={() => removeInclude(idx)}
                className="w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center border-none cursor-pointer shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {includes.length === 0 && (
            <p className="text-xs text-slate-400 italic">No inclusions added yet. Click "+ Add Item".</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PackagesClient({ initialPackages, defaultTab }: PackagesClientProps) {
  const [packagesList, setPackagesList] = useState<any[]>(initialPackages);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);
  const [selectedSeoPkg, setSelectedSeoPkg] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmModalConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'umrah' | 'hajj'>(defaultTab);

  const blankPkg = (type: 'hajj' | 'umrah') => ({
    title: '',
    type,
    month: 'Flexible 2026',
    startingPrice: '1995.00',
    starRating: '5 Star',
    shortDescription: '',
    fullDescription: '',
    inclusions: '[]',
    cardData: getDefaultCardData(type),
  });

  const [newPkg, setNewPkg] = useState(() => blankPkg(defaultTab));

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPkg.title);
    formData.append('type', newPkg.type);
    formData.append('month', newPkg.month);
    formData.append('startingPrice', newPkg.startingPrice);
    formData.append('shortDescription', newPkg.shortDescription);
    formData.append('fullDescription', newPkg.fullDescription);
    formData.append('inclusions', newPkg.inclusions);
    if (newPkg.cardData) formData.append('cardData', JSON.stringify(newPkg.cardData));

    const res = await createPackage(formData);
    if (res.success) {
      setSaveMsg('Package created successfully!');
      setTimeout(() => setSaveMsg(null), 3000);
      setIsCreating(false);
      setNewPkg(blankPkg(activeTab));
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
      cardData: editingPkg.cardData,
      departureCity: editingPkg.departureCity,
      destination: editingPkg.destination,
      featuredImage: editingPkg.featuredImage,
    });
    if (res.success) {
      setPackagesList(prev => prev.map(p => (p.id === editingPkg.id ? editingPkg : p)));
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
        setPackagesList(prev => prev.filter(p => p.id !== id));
        setSaveMsg('Package deleted.');
        setTimeout(() => setSaveMsg(null), 3000);
      },
    });
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'available' ? 'sold_out' : 'available';
    await updatePackageStatus(id, nextStatus as any);
    setPackagesList(prev => prev.map(p => (p.id === id ? { ...p, status: nextStatus } : p)));
  };

  // ── render ─────────────────────────────────────────────────────────────────

  const filteredPkgs = packagesList.filter(pkg => pkg.type === activeTab);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header Bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 m-0">
            {activeTab === 'hajj' ? 'Hajj Packages' : 'Umrah Packages'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 mb-0">
            {activeTab === 'hajj'
              ? 'Manage Hajj package offerings, prices, and live availability'
              : 'Manage Umrah package offerings, prices, and live availability'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && <span className="text-xs font-bold text-emerald-600 animate-in fade-in">{saveMsg}</span>}
          <button
            type="button"
            onClick={() => {
              if (!isCreating) setNewPkg(blankPkg(activeTab));
              setIsCreating(!isCreating);
            }}
            className="bg-[#DB9E30] hover:bg-[#c38927] text-slate-950 px-5 py-2.5 rounded-full text-xs font-extrabold transition-colors cursor-pointer border-none shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? 'Close Form' : `Create New ${activeTab === 'hajj' ? 'Hajj' : 'Umrah'} Package`}
          </button>
        </div>
      </div>

      {/* ── Edit Package Modal ──────────────────────────────────────────────── */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="text-base font-extrabold text-slate-900 m-0 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#DB9E30]" />
                Edit {editingPkg.type === 'hajj' ? 'Hajj' : 'Umrah'} Package
              </h3>
              <button
                type="button"
                onClick={() => setEditingPkg(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center border-none cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdate} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Package Title */}
              <div className="col-span-full">
                <label className="text-xs font-bold text-slate-700 block mb-1">Package Title *</label>
                <input
                  type="text"
                  value={editingPkg.title}
                  onChange={e => setEditingPkg({ ...editingPkg, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                <select
                  value={editingPkg.type}
                  onChange={e => setEditingPkg({ ...editingPkg, type: e.target.value as any, cardData: getDefaultCardData(e.target.value as any) })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] bg-white"
                >
                  <option value="umrah">🕋 Umrah Package</option>
                  <option value="hajj">🕌 Hajj Package</option>
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Travel Month / Duration</label>
                <input
                  type="text"
                  value={editingPkg.month || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, month: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Starting Price (CAD)</label>
                <input
                  type="text"
                  value={editingPkg.startingPrice || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, startingPrice: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                />
              </div>

              {/* Status — Sold Out toggle + other statuses */}
              <div className="col-span-full">
                <label className="text-xs font-bold text-slate-700 block mb-2">Availability Status</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  {/* Sold Out toggle switch */}
                  <label className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all select-none ${
                    editingPkg.status === 'sold_out'
                      ? 'border-red-400 bg-red-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}>
                    <div className="relative shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={editingPkg.status === 'sold_out'}
                        onChange={e =>
                          setEditingPkg({
                            ...editingPkg,
                            status: e.target.checked ? 'sold_out' : 'available',
                          })
                        }
                      />
                      <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                        editingPkg.status === 'sold_out' ? 'bg-red-500' : 'bg-slate-300'
                      }`} />
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        editingPkg.status === 'sold_out' ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${
                      editingPkg.status === 'sold_out' ? 'text-red-600' : 'text-slate-500'
                    }`}>
                      {editingPkg.status === 'sold_out' ? '🔴 Sold Out' : 'Mark as Sold Out'}
                    </span>
                  </label>

                  {/* Other statuses — only visible when not sold_out */}
                  {editingPkg.status !== 'sold_out' && (
                    <select
                      value={editingPkg.status || 'available'}
                      onChange={e => setEditingPkg({ ...editingPkg, status: e.target.value as any })}
                      className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] bg-white"
                    >
                      <option value="available">● Available</option>
                      <option value="coming_soon">● Coming Soon</option>
                      <option value="draft">● Draft</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hotel Star Rating</label>
                <select
                  value={editingPkg.starRating || '5 Star'}
                  onChange={e => setEditingPkg({ ...editingPkg, starRating: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] bg-white"
                >
                  <option value="5 Star">5 Star Luxury</option>
                  <option value="4 Star">4 Star Premium</option>
                  <option value="3 Star">3 Star Standard</option>
                </select>
              </div>

              {/* Short Description */}
              <div className="col-span-full">
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingPkg.shortDescription || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] resize-none"
                />
              </div>

              {/* Dynamic Card Details — type-specific */}
              {editingPkg.type === 'hajj' ? (
                <HajjCardFields pkgData={editingPkg} setPkgData={setEditingPkg} />
              ) : (
                <UmrahCardFields pkgData={editingPkg} setPkgData={setEditingPkg} />
              )}

              {/* Actions */}
              <div className="col-span-full flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border-none cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full text-xs font-extrabold bg-[#004B39] text-white border-none cursor-pointer shadow-md hover:bg-[#003229] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Package Form ─────────────────────────────────────────────── */}
      {isCreating && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in mb-2">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#DB9E30]" />
            Add New {activeTab === 'hajj' ? 'Hajj' : 'Umrah'} Package
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full">
              <label className="text-xs font-bold text-slate-700 block mb-1">Package Title *</label>
              <input
                type="text"
                placeholder={activeTab === 'hajj' ? 'e.g. Economy Hajj Package 2027' : 'e.g. 5 Star September Umrah Package 2026'}
                value={newPkg.title}
                onChange={e => setNewPkg({ ...newPkg, title: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Package Type</label>
              <select
                value={newPkg.type}
                disabled
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-white opacity-60 cursor-not-allowed"
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
                onChange={e => setNewPkg({ ...newPkg, month: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Starting Price (CAD) *</label>
              <input
                type="text"
                placeholder="2695.00"
                value={newPkg.startingPrice}
                onChange={e => setNewPkg({ ...newPkg, startingPrice: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Hotel Star Rating</label>
              <select
                value={newPkg.starRating}
                onChange={e => setNewPkg({ ...newPkg, starRating: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] bg-white"
              >
                <option value="5 Star">5 Star Luxury</option>
                <option value="4 Star">4 Star Premium</option>
                <option value="3 Star">3 Star Standard</option>
              </select>
            </div>

            <div className="col-span-full">
              <label className="text-xs font-bold text-slate-700 block mb-1">Short Summary</label>
              <input
                type="text"
                placeholder="Brief package highlight description"
                value={newPkg.shortDescription}
                onChange={e => setNewPkg({ ...newPkg, shortDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
              />
            </div>

            {/* Dynamic card fields per type */}
            {newPkg.type === 'hajj' ? (
              <HajjCardFields pkgData={newPkg} setPkgData={setNewPkg} />
            ) : (
              <UmrahCardFields pkgData={newPkg} setPkgData={setNewPkg} />
            )}

            <div className="col-span-full flex justify-end gap-3 pt-3 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border-none cursor-pointer hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 rounded-full text-xs font-extrabold bg-[#004B39] text-white border-none cursor-pointer shadow-md hover:bg-[#003229] transition-colors"
              >
                Publish Package
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Packages Table ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
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
              {filteredPkgs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No packages found. Click "Create New {activeTab === 'hajj' ? 'Hajj' : 'Umrah'} Package" to add one.
                  </td>
                </tr>
              ) : (
                filteredPkgs.map((pkg) => {
                  const isSoldOut = pkg.status === 'sold_out';
                  return (
                  <tr key={pkg.id} className={`transition-colors border-b ${
                    isSoldOut
                      ? 'bg-red-50/50 border-red-100 hover:bg-red-50/80'
                      : 'border-slate-100 hover:bg-slate-50/60'
                  }`}>
                    <td className="py-3.5 px-4">
                      <div className={`font-bold ${isSoldOut ? 'text-red-700' : 'text-slate-900'}`}>{pkg.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">{pkg.slug}</div>
                      {isSoldOut && (
                        <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] font-extrabold text-red-500 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block" /> Sold Out
                        </span>
                      )}
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
                    <td className={`py-3.5 px-4 font-medium ${isSoldOut ? 'text-red-400 line-through' : 'text-slate-600'}`}>
                      {pkg.month || 'Flexible'}
                    </td>
                    <td className={`py-3.5 px-4 font-black ${isSoldOut ? 'text-red-500' : 'text-slate-900'}`}>
                      CAD ${Number(pkg.startingPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize border-2 transition-all ${
                          isSoldOut
                            ? 'bg-red-100 text-red-700 border-red-400 shadow-sm'
                            : pkg.status === 'available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {isSoldOut ? '🔴 Sold Out' : `● ${pkg.status || 'available'}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSeoPkg(pkg)}
                          title="Package SEO Center"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#004B39] border border-emerald-200 text-[10px] font-extrabold hover:bg-[#004B39] hover:text-white transition-all cursor-pointer"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>SEO</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPkg({
                            ...pkg,
                            cardData: pkg.cardData || getDefaultCardData(pkg.type),
                          })}
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
                  );
                })
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
