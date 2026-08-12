'use client';

import { useState } from 'react';
import { updatePackageAction } from '@/actions/packageActions';
import { Edit2, ArrowLeft, BookOpen, Hotel, Plane, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageUploadWidget from '@/components/admin/ImageUploadWidget';
import DetailPageDataFields from '@/components/admin/DetailPageDataFields';

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
  includes: [
    { icon: 'Plane', text: 'Return Flights from Toronto' },
    { icon: 'Hotel', text: '5 Star Hotel in Makkah' },
    { icon: 'Hotel', text: '5 Star Hotel in Madinah' },
    { icon: 'FileCheck', text: 'Visa & Registration' },
    { icon: 'Users', text: 'Imam & Guide' },
  ],
  makkahHotel: { image: '', name: '5 Star Hotel in Makkah', location: 'Near to Haram', badge: 'Breakfast', nights: '5 Nights' },
  madinahHotel: { image: '', name: '5 Star Hotel in Madinah', location: 'Near to Masjid Nabawi', badge: 'Breakfast', nights: '5 Nights' },
};

function getDefaultCardData(type: 'hajj' | 'umrah') {
  return type === 'hajj' ? { ...defaultHajjCardData } : { ...defaultUmrahCardData };
}

function HajjCardFields({ pkgData, setPkgData }: { pkgData: any; setPkgData: (v: any) => void }) {
  const cd = pkgData.cardData || defaultHajjCardData;
  const updateCD = (f: string, v: any) => setPkgData({ ...pkgData, cardData: { ...cd, [f]: v } });
  const updateMak = (f: string, v: any) => {
    const updatedHotel = { ...(cd.makkahHotel || {}), [f]: v };
    setPkgData({
      ...pkgData,
      cardData: { ...cd, makkahHotel: updatedHotel },
      detailPageData: { ...(pkgData.detailPageData || {}), makkahHotel: updatedHotel }
    });
  };
  const updateMad = (f: string, v: any) => {
    const updatedHotel = { ...(cd.madinahHotel || {}), [f]: v };
    setPkgData({
      ...pkgData,
      cardData: { ...cd, madinahHotel: updatedHotel },
      detailPageData: { ...(pkgData.detailPageData || {}), madinahHotel: updatedHotel }
    });
  };

  return (
    <div className="col-span-full space-y-5 p-5 border border-amber-200 bg-amber-50/40 rounded-2xl">
      <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider border-b border-amber-200 pb-2 flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5" /> Dynamic Card Details
      </h4>

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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex gap-2">
                  <input type="text" placeholder="Icon (e.g. Utensils)" value={cd.makkahHotel?.badgeIcon || ''} onChange={e => updateMak('badgeIcon', e.target.value)} className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" title="Lucide Icon Name" />
                  <input type="text" value={cd.makkahHotel?.badge || ''} onChange={e => updateMak('badge', e.target.value)} className="w-2/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">NIGHTS</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Icon (e.g. Moon)" value={cd.makkahHotel?.nightsIcon || ''} onChange={e => updateMak('nightsIcon', e.target.value)} className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" title="Lucide Icon Name" />
                  <input type="text" value={cd.makkahHotel?.nights || ''} onChange={e => updateMak('nights', e.target.value)} className="w-2/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

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
                <div className="flex gap-2">
                  <input type="text" placeholder="Icon (e.g. Utensils)" value={cd.madinahHotel?.badgeIcon || ''} onChange={e => updateMad('badgeIcon', e.target.value)} className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" title="Lucide Icon Name" />
                  <input type="text" value={cd.madinahHotel?.badge || ''} onChange={e => updateMad('badge', e.target.value)} className="w-2/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">NIGHTS</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Icon (e.g. Moon)" value={cd.madinahHotel?.nightsIcon || ''} onChange={e => updateMad('nightsIcon', e.target.value)} className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" title="Lucide Icon Name" />
                  <input type="text" value={cd.madinahHotel?.nights || ''} onChange={e => updateMad('nights', e.target.value)} className="w-2/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UmrahCardFields({ pkgData, setPkgData }: { pkgData: any; setPkgData: (v: any) => void }) {
  const cd = pkgData.cardData || defaultUmrahCardData;
  const updateCD = (f: string, v: any) => setPkgData({ ...pkgData, cardData: { ...cd, [f]: v } });

  const updateMak = (f: string, v: any) => {
    const updatedHotel = { ...(cd.makkahHotel || {}), [f]: v };
    setPkgData({
      ...pkgData,
      cardData: { ...cd, makkahHotel: updatedHotel },
      detailPageData: { ...(pkgData.detailPageData || {}), makkahHotel: updatedHotel }
    });
  };
  const updateMad = (f: string, v: any) => {
    const updatedHotel = { ...(cd.madinahHotel || {}), [f]: v };
    setPkgData({
      ...pkgData,
      cardData: { ...cd, madinahHotel: updatedHotel },
      detailPageData: { ...(pkgData.detailPageData || {}), madinahHotel: updatedHotel }
    });
  };

  type IncludeItem = {
    icon: string;
    text: string;
  };

  const includes: IncludeItem[] = Array.isArray(cd.includes)
    ? cd.includes.map((item: any) =>
      typeof item === 'string'
        ? { icon: 'Check', text: item }
        : {
          icon: item?.icon || 'Check',
          text: item?.text || '',
        }
    )
    : [];

  const updateIncludes = (idx: number, val: IncludeItem) => {
    const next: IncludeItem[] = [...includes];
    next[idx] = val;
    updateCD('includes', next);
  };

  const addInclude = () => {
    updateCD('includes', [
      ...includes,
      { icon: 'Check', text: '' },
    ]);
  };

  const removeInclude = (idx: number) => {
    updateCD(
      'includes',
      includes.filter((_: IncludeItem, i: number) => i !== idx)
    );
  };

  return (
    <div className="col-span-full space-y-5 p-5 border border-emerald-200 bg-emerald-50/30 rounded-2xl">
      <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider border-b border-emerald-200 pb-2 flex items-center gap-2">
        <Plane className="w-3.5 h-3.5" /> Dynamic Card Details
      </h4>

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

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex gap-2">
                  <input type="text" placeholder="Icon (e.g. Utensils)" value={cd.makkahHotel?.badgeIcon || ''} onChange={e => updateMak('badgeIcon', e.target.value)} className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" title="Lucide Icon Name" />
                  <input type="text" value={cd.makkahHotel?.badge || ''} onChange={e => updateMak('badge', e.target.value)} className="w-2/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">NIGHTS</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Icon (e.g. Moon)" value={cd.makkahHotel?.nightsIcon || ''} onChange={e => updateMak('nightsIcon', e.target.value)} className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" title="Lucide Icon Name" />
                  <input type="text" value={cd.makkahHotel?.nights || ''} onChange={e => updateMak('nights', e.target.value)} className="w-2/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

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
                <div className="flex gap-2">
                  <input type="text" placeholder="Icon (e.g. Utensils)" value={cd.madinahHotel?.badgeIcon || ''} onChange={e => updateMad('badgeIcon', e.target.value)} className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" title="Lucide Icon Name" />
                  <input type="text" value={cd.madinahHotel?.badge || ''} onChange={e => updateMad('badge', e.target.value)} className="w-2/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">NIGHTS</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Icon (e.g. Moon)" value={cd.madinahHotel?.nightsIcon || ''} onChange={e => updateMad('nightsIcon', e.target.value)} className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" title="Lucide Icon Name" />
                  <input type="text" value={cd.madinahHotel?.nights || ''} onChange={e => updateMad('nights', e.target.value)} className="w-2/3 px-2 py-1.5 rounded-lg border border-slate-200 text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PACKAGE INCLUDES</label>
          <button type="button" onClick={addInclude} className="text-[10px] font-extrabold text-emerald-700 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer">
            + Add Item
          </button>
        </div>
        <div className="space-y-2">
          {includes.map((inc: IncludeItem, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={inc.icon || ''}
                onChange={e => updateIncludes(idx, { ...inc, icon: e.target.value })}
                placeholder="Lucide Icon (e.g. Plane)"
                className="w-1/3 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
              />
              <input
                type="text"
                value={inc.text || ''}
                onChange={e => updateIncludes(idx, { ...inc, text: e.target.value })}
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

interface EditPackageClientProps {
  packageData: any;
}

export default function EditPackageClient({ packageData }: EditPackageClientProps) {
  const router = useRouter();

  const parseJSON = (data: any, defaultVal: any) => {
    if (!data) return defaultVal;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return defaultVal;
      }
    }
    return data;
  };

  const initialPkg = {
    ...packageData,
    cardData: parseJSON(packageData.cardData, getDefaultCardData(packageData.type)),
    detailPageData: parseJSON(packageData.detailPageData, {})
  };

  const [editingPkg, setEditingPkg] = useState<any>(initialPkg);
  const [activeTab, setActiveTab] = useState<'basic' | 'detail'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    setIsSubmitting(true);
    const res = await updatePackageAction(editingPkg.id, {
      title: editingPkg.title,
      slug: editingPkg.slug,
      type: editingPkg.type,
      month: editingPkg.month,
      startingPrice: editingPkg.startingPrice,
      starRating: editingPkg.starRating,
      status: editingPkg.status,
      shortDescription: editingPkg.shortDescription,
      fullDescription: editingPkg.fullDescription,
      cardData: editingPkg.cardData,
      detailPageData: editingPkg.detailPageData,
    });
    setIsSubmitting(false);
    if (res.success) {
      setSaveMsg('Package Updated Successfully!');
      setTimeout(() => setSaveMsg(null), 3000);
    } else {
      alert(res.error || 'Failed to update package.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-4">
          <Link href={editingPkg.type === 'hajj' ? '/admin/hajj-packages' : '/admin/umrah-packages'} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 m-0 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-[#DB9E30]" /> Edit {editingPkg.type === 'hajj' ? 'Hajj' : 'Umrah'} Package
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'basic' ? 'bg-gold text-primary shadow' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Basic & Card Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'detail' ? 'bg-gold text-primary shadow' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Detail Page Content
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">


          {activeTab === 'basic' && (
            <>
              {/* Package Title */}
              <div className="col-span-full">
                <label className="text-xs font-bold text-slate-700 block mb-1">Package Title *</label>
                <input
                  type="text"
                  value={editingPkg.title}
                  onChange={e => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setEditingPkg({ ...editingPkg, title, slug });
                  }}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                />
              </div>

              {/* Slug */}
              <div className="col-span-full">
                <label className="text-xs font-bold text-slate-700 block mb-1">Page Slug *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-xs">
                    /
                  </span>
                  <input
                    type="text"
                    value={editingPkg.slug || ''}
                    onChange={e => setEditingPkg({ ...editingPkg, slug: e.target.value })}
                    required
                    className="flex-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-r-xl text-xs outline-none focus:border-[#004B39]"
                  />
                </div>
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
              {editingPkg.type === 'umrah' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Travel Month / Duration</label>
                  <input
                    type="text"
                    value={editingPkg.month || ''}
                    onChange={e => setEditingPkg({ ...editingPkg, month: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                  />
                </div>
              )}

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

              {/* Status */}
              <div className="col-span-full">
                <label className="text-xs font-bold text-slate-700 block mb-2">Availability Status</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <label className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all select-none ${editingPkg.status === 'sold_out'
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
                      <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${editingPkg.status === 'sold_out' ? 'bg-red-500' : 'bg-slate-300'
                        }`} />
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${editingPkg.status === 'sold_out' ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </div>
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${editingPkg.status === 'sold_out' ? 'text-red-600' : 'text-slate-500'
                      }`}>
                      {editingPkg.status === 'sold_out' ? '🔴 Sold Out' : 'Mark as Sold Out'}
                    </span>
                  </label>


                </div>
                {editingPkg.status !== 'sold_out' && (
                  <select
                    value={editingPkg.status || 'available'}
                    onChange={e => setEditingPkg({ ...editingPkg, status: e.target.value as any })}
                    className="flex-1 mt-3 sm:mt-0 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] bg-white"
                  >
                    <option value="available">● Available</option>
                    <option value="coming_soon">● Coming Soon</option>
                    <option value="draft">● Draft</option>
                  </select>
                )}
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

              <div className="col-span-full">
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Summary</label>
                <input
                  type="text"
                  value={editingPkg.shortDescription || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39]"
                />
              </div>

              {editingPkg.type === 'hajj' ? (
                <HajjCardFields pkgData={editingPkg} setPkgData={setEditingPkg} />
              ) : (
                <UmrahCardFields pkgData={editingPkg} setPkgData={setEditingPkg} />
              )}
            </>
          )}

          {activeTab === 'detail' && (
            <DetailPageDataFields
              data={editingPkg.detailPageData}
              onChange={newData => setEditingPkg({ ...editingPkg, detailPageData: newData })}
              onHotelSync={(hotelKey, field, val) => {
                setEditingPkg((prev: any) => ({
                  ...prev,
                  cardData: {
                    ...prev.cardData,
                    [hotelKey]: { ...(prev.cardData?.[hotelKey] || {}), [field]: val }
                  }
                }));
              }}
            />
          )}

          <div className="col-span-full flex items-center justify-between pt-6 border-t border-slate-100 mt-4">
            <div>
              {saveMsg && (
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
                  {saveMsg}
                </span>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Link
                href={editingPkg.type === 'hajj' ? '/admin/hajj-packages' : '/admin/umrah-packages'}
                className="px-6 py-3 rounded-full text-sm font-bold bg-slate-100 text-slate-700 border-none cursor-pointer hover:bg-slate-200 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full text-sm font-extrabold bg-[#004B39] text-white border-none cursor-pointer shadow-md hover:bg-[#003229] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
