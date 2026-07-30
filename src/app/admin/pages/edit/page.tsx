'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { getPageById, savePageAction } from '@/actions/pageActions';
import ConfirmModal, { ConfirmModalConfig } from '@/components/ui/ConfirmModal';
import { Trash2, Upload } from 'lucide-react';

const SECTION_OPTIONS = [
  'Hero Slider',
  'Intro',
  'Stats Grid',
  'Accreditations Bar',
  'Umrah Packages Grid',
  'Hajj Packages Grid',
  'Visa Solutions Grid',
  'Visa Process Steps',
  'Available Flights Grid',
  'Flight Assistance CTA',
  'Contact Info Cards',
  'Contact Form',
  'Contact Maps',
  'Services Grid',
  'Image+Text',
  'Airlines Marquee',
  'Airlines Logo Carousel',
  'Certifications Flip Cards',
  'Intro (Text + Image)',
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
  data?: Record<string, any>;
}

function PageBuilderContent() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get('id') ? Number(searchParams.get('id')) : null;

  const [bannerBgImage, setBannerBgImage] = useState<string>('');
  const [bannerPosition, setBannerPosition] = useState<string>('center center');
  const [bannerSize, setBannerSize] = useState<string>('cover');
  const [bannerTitle, setBannerTitle] = useState<string>('');
  const [bannerDescription, setBannerDescription] = useState<string>('');

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

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

  const updateSectionField = (id: string, field: string, value: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateSectionData = (id: string, key: string, value: any) => {
    setSections(sections.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        data: {
          ...(s.data || {}),
          [key]: value,
        }
      };
    }));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);
  };

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
              const parsed = JSON.parse(p.sections);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setSections(parsed);
              } else if (p.slug === '/saudi-visa' || pageId === 5) {
                setSections([
                  {
                    id: 'sv-1',
                    type: 'Visa Solutions Grid',
                    title: 'Saudi Visa Solutions Grid',
                    data: {
                      eyebrow: 'EXPLORE OUR',
                      title: 'Saudi Visa Solutions'
                    }
                  },
                  {
                    id: 'sv-2',
                    type: 'Visa Process Steps',
                    title: 'Saudi Visa Process Steps',
                    data: {
                      eyebrow: 'IN 3 EASY STEPS',
                      title: 'Get Your Saudi Visa',
                      email: 'saudivisa@kingtravel.com',
                      phone: '+1 905-624-8344'
                    }
                  }
                ]);
              } else if (p.slug === '/airlines' || pageId === 6) {
                setSections([
                  {
                    id: 'air-1',
                    type: 'Available Flights Grid',
                    title: 'Available Flights Grid',
                    data: {
                      eyebrow: 'AVAILABLE FLIGHTS',
                      title: 'BEST FARES, LIMITED AVAILABILITY FROM LONDON'
                    }
                  },
                  {
                    id: 'air-2',
                    type: 'Airlines Marquee',
                    title: 'Airlines We Sourced Deals From',
                    data: {
                      eyebrow: 'OUR TRUSTED PARTNERS',
                      title: 'Airlines We Sourced Deals From'
                    }
                  },
                  {
                    id: 'air-3',
                    type: 'Flight Assistance CTA',
                    title: 'Flight Booking Assistance CTA',
                    data: {
                      eyebrow: 'NEED ASSISTANCE',
                      title: 'Need Flight Booking Assistance?',
                      description: 'Speak directly with our ticketing specialists to get custom quotes, group flight discounts, and immediate confirmations.',
                      btnLabel: 'Contact Flight Desk',
                      btnLink: '/contact'
                    }
                  }
                ]);
              } else if (p.slug === '/contact' || pageId === 7) {
                setSections([
                  {
                    id: 'cnt-1',
                    type: 'Contact Info Cards',
                    title: 'Contact Info & Office Locations',
                    data: {
                      headAddress: '1325 Eglinton Ave E Ste 218, Mississauga, ON L4W 4L9, Canada',
                      branchAddress: '22 Ontario St S, Milton, ON L9T 2M6, Canada',
                      phone1: '+1 800-844-5464',
                      phone2: '+1 905-624-8555',
                      phone3: '+1 905-624-8344',
                      email: 'info@kingtravelcan.com'
                    }
                  },
                  {
                    id: 'cnt-2',
                    type: 'Contact Form',
                    title: 'Interactive Contact Form',
                    data: {
                      title: 'Drop Us A Message',
                      subtitle: "Fill out the form below and we'll get back to you shortly."
                    }
                  },
                  {
                    id: 'cnt-3',
                    type: 'Contact Maps',
                    title: 'Dual Office Google Maps',
                    data: {
                      headMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2888.1637775952674!2d-79.62528662340336!3d43.63487945347209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b3897316b3bdb%3A0xc6758691a49d5a8e!2sKing%20Travel%20Can%20Ltd%20-%20Mississauga!5e0!3m2!1sen!2sca!4v1710000000000!5m2!1sen!2sca',
                      branchMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2893.6521568283307!2d-79.87981462340915!3d43.5177187791263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b6fa0d880eae9%3A0xc57548acb421436c!2s22%20Ontario%20St%20S%2C%20Milton%2C%20ON%20L9T%202M6%2C%20Canada!5e0!3m2!1sen!2sca!4v1710000000001!5m2!1sen!2sca'
                    }
                  }
                ]);
              } else if (p.slug === '/about' || pageId === 2) {
                setSections([
                  { id: '1', type: 'Stats Grid', title: 'Stats Grid' },
                  {
                    id: '2',
                    type: 'Intro',
                    title: 'Intro (About King Travel)',
                    data: {
                      eyebrow: 'ABOUT',
                      title: 'King Travel',
                      description: "For over 20 years, King Travel has been a trusted travel agency in Canada, offering Hajj and Umrah services, airline ticketing, and visa processing with unmatched expertise. We are Canada's No. 1 authorized PIA seller agency and an official agent licensed by the Ministry of Hajj & Umrah, IATA, TICO, OCTA, and ASTA."
                    }
                  },
                  {
                    id: '3',
                    type: 'Image+Text',
                    title: 'Why Choose Us',
                    data: {
                      eyebrow: 'WHY CHOOSE US',
                      title: 'Your Trusted Partner for Pilgrimage & Global Travel',
                      description: "Serving Ontario travelers for years, King Travel Can Ltd is certified by IATA, ACTA, TICO, ASTA, ATAC, and the Saudi Ministry of Hajj & Umrah. We've arranged thousands of successful journeys with fast response times and secure ID checks for every booking.",
                      image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80"
                    }
                  },
                  {
                    id: '4',
                    type: 'Services Grid',
                    title: 'Our Premium Travel Services',
                    data: {
                      eyebrow: 'WHAT WE PROVIDE',
                      title: 'Our Premium Travel Services'
                    }
                  },
                  {
                    id: '5',
                    type: 'Airlines Marquee',
                    title: 'Our Trusted Partners (Airlines)',
                    data: {
                      eyebrow: 'OUR TRUSTED PARTNERS',
                      title: 'Airlines we work with'
                    }
                  },
                ]);
              }
            } catch (e) {
              setSections([]);
            }
          } else if (p.slug === '/about' || pageId === 2) {
            setSections([
              { id: '1', type: 'Stats Grid', title: 'Stats Grid' },
              {
                id: '2',
                type: 'Intro',
                title: 'Intro (About King Travel)',
                data: {
                  eyebrow: 'ABOUT',
                  title: 'King Travel',
                  description: "For over 20 years, King Travel has been a trusted travel agency in Canada, offering Hajj and Umrah services, airline ticketing, and visa processing with unmatched expertise."
                }
              },
              {
                id: '3',
                type: 'Image+Text',
                title: 'Why Choose Us',
                data: {
                  eyebrow: 'WHY CHOOSE US',
                  title: 'Your Trusted Partner for Pilgrimage & Global Travel',
                  description: "Serving Ontario travelers for years, King Travel Can Ltd is certified by IATA, ACTA, TICO, ASTA, ATAC, and the Saudi Ministry of Hajj & Umrah.",
                  image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80"
                }
              },
              {
                id: '4',
                type: 'Services Grid',
                title: 'Our Premium Travel Services',
                data: {
                  eyebrow: 'WHAT WE PROVIDE',
                  title: 'Our Premium Travel Services'
                }
              },
              {
                id: '5',
                type: 'Airlines Marquee',
                title: 'Our Trusted Partners (Airlines)',
                data: {
                  eyebrow: 'OUR TRUSTED PARTNERS',
                  title: 'Airlines we work with'
                }
              },
            ]);
          }
        }
      });
    } else {
      setTitle('New Custom Page');
      setSlug('/new-page');
    }
  }, [pageId]);

  const addSection = (type: string) => {
    const newSec: SectionItem = {
      id: String(Date.now()),
      type,
      title: `New ${type}`,
      data: {
        eyebrow: type.toUpperCase(),
        title: `Heading for ${type}`,
        description: 'Add section content description here...'
      }
    };
    setSections([...sections, newSec]);
    setEditingSectionId(newSec.id);
    setDropdownOpen(false);
  };

  const [confirmConfig, setConfirmConfig] = useState<ConfirmModalConfig | null>(null);

  const removeSection = (id: string, title?: string) => {
    setConfirmConfig({
      icon: <Trash2 className="w-3 h-3 text-red-600" />,
      title: '',
      message: `Are you sure you want to remove the section "${title || 'Untitled Section'}" from this page layout?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: () => {
        setSections(sections.filter(s => s.id !== id));
      },
    });
  };

  const handleSave = async (draft = false) => {
    setConfirmConfig({
      icon: '💾',
      title: draft ? 'Save Draft' : 'Update Page',
      message: draft ? 'Would you like to save this page as a draft?' : 'Would you like to publish and apply these changes to the live website?',
      confirmText: draft ? 'Save Draft' : 'Update Page',
      cancelText: 'Not now',
      variant: 'primary',
      onConfirm: async () => {
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
      },
    });
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
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase m-0 flex items-center gap-1.5">
                🖼 GLOBAL PAGE BANNER BACKGROUND IMAGE
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">This banner background image applies to hero header preview</span>
            </div>
            {bannerBgImage && (
              <button
                type="button"
                onClick={() => setBannerBgImage('')}
                className="bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
              >
                ⊗ Remove Image
              </button>
            )}
          </div>

          {/* Split 2-Column Desktop Grid: Upload Box (Left) + Live Preview Card (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Left Upload Dropzone Box */}
            <div
              onClick={() => document.getElementById('banner-file-input')?.click()}
              className="bg-slate-50/80 hover:bg-emerald-50/40 border-2 border-dashed border-slate-300 hover:border-[#004B39] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px]"
            >
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
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#004B39] mb-2 text-lg">
                ⇧
              </div>
              <span className="text-xs font-extrabold text-slate-800">
                {bannerBgImage ? 'Click to replace banner image' : 'Click to upload global banner image'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium">
                Recommended 1920px x 360px (aspect ratio ~ 16:3, max 2MB)
              </span>
            </div>

            {/* Right Side Compact Real-Time Live Preview Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-md flex flex-col items-center justify-center text-center p-4 text-white min-h-[140px] border border-slate-900/10">
              <div
                className="absolute inset-0 z-0 transition-all duration-300"
                style={{
                  backgroundImage: bannerBgImage
                    ? `linear-gradient(rgba(10, 66, 45, 0.45), rgba(10, 66, 45, 0.45)), url("${bannerBgImage.replace(/"/g, "'")}")`
                    : `linear-gradient(rgba(10, 66, 45, 0.45), rgba(10, 66, 45, 0.45)), url("https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg")`,
                  backgroundPosition: bannerPosition || 'center center',
                  backgroundSize: bannerSize || 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <div className="relative z-10 max-w-md px-2">
                <h1
                  className="text-lg md:text-xl font-serif text-white m-0 font-normal tracking-wide [&>span]:text-[#DB9E30] [&>em]:text-[#DB9E30] [&>em]:not-italic"
                  style={{ fontFamily: "var(--serif, 'Marcellus', serif)" }}
                  dangerouslySetInnerHTML={{ __html: bannerTitle || title || 'Page Title' }}
                />
                {bannerDescription && (
                  <p
                    className="text-[11px] opacity-90 max-w-sm m-0 mt-1 font-light leading-snug text-white/90"
                    style={{ fontFamily: "var(--sans, 'Plus Jakarta Sans', sans-serif)" }}
                  >
                    {bannerDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Compact Input Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end pt-2 border-t border-slate-100">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  TITLE (H1)
                </label>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
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
                      if (!fullText.includes('<span>')) {
                        setBannerTitle(fullText.replace(/([A-Z][a-z0-9\s&]+)$/i, '<span>$1</span>'));
                      } else {
                        setBannerTitle(fullText.replace(/<\/?span>/g, ''));
                      }
                    }
                  }}
                  className="text-[10px] font-bold text-[#DB9E30] hover:bg-amber-100 bg-amber-50 px-2 py-0.5 rounded cursor-pointer border border-[#DB9E30]/30 transition-colors"
                  title="Highlight text and click to make it Gold"
                >
                  ✨ Gold Words
                </button>
              </div>
              <input
                id="banner-title-input"
                type="text"
                placeholder={title || 'Page Title'}
                value={bannerTitle || ''}
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
                placeholder="Description..."
                value={bannerDescription || ''}
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
                value={title || ''}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTitle(newTitle);
                  // Auto-generate slug from title unless it's home '/'
                  if (slug !== '/') {
                    const generatedSlug = '/' + newTitle
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/[\s_-]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    setSlug(generatedSlug);
                  }
                }}
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
                value={slug || ''}
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
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}>

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
                          maxHeight: 420,
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
                    {sections.map((sec, index) => (
                      <div
                        key={sec.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 14,
                          padding: '14px 18px',
                          gap: editingSectionId === sec.id ? 16 : 0,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <button
                                disabled={index === 0}
                                onClick={() => moveSection(index, -1)}
                                style={{ border: 'none', background: 'transparent', cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: 10, opacity: index === 0 ? 0.3 : 1, padding: 0 }}
                              >
                                ▲
                              </button>
                              <button
                                disabled={index === sections.length - 1}
                                onClick={() => moveSection(index, 1)}
                                style={{ border: 'none', background: 'transparent', cursor: index === sections.length - 1 ? 'not-allowed' : 'pointer', fontSize: 10, opacity: index === sections.length - 1 ? 0.3 : 1, padding: 0 }}
                              >
                                ▼
                              </button>
                            </div>
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
                              <div style={{ fontSize: 11, color: '#64748b' }}>{sec.title || sec.data?.title || `Section ${index + 1}`}</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button
                              onClick={() => setEditingSectionId(editingSectionId === sec.id ? null : sec.id)}
                              style={{
                                border: '1px solid #cbd5e1',
                                background: editingSectionId === sec.id ? '#004B39' : '#fff',
                                color: editingSectionId === sec.id ? '#fff' : '#0f172a',
                                borderRadius: 8,
                                padding: '4px 10px',
                                cursor: 'pointer',
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              {editingSectionId === sec.id ? 'Close Editor' : '✎ Edit Section'}
                            </button>
                            <button
                              onClick={() => removeSection(sec.id)}
                              className="border border-red-300 bg-red-100 text-red-600 rounded-lg px-2.5 py-1 cursor-pointer text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1.5"
                              title="Delete entire section"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Section Editor Panel */}
                        {editingSectionId === sec.id && (
                          <div style={{ paddingTop: 16, borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>

                            {sec.type === 'Stats Grid' && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>📊 KPI Stat Items (Value & Label)</span>
                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  { value: '72K+', label: 'Happy Travelers' },
                                  { value: '4.4', label: 'Google Rating' },
                                  { value: '100%', label: 'Client Satisfaction' },
                                  { value: '25+', label: 'Years Experience' }
                                ]).map((stat: any, sIdx: number) => (
                                  <div key={sIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
                                    <input
                                      type="text"
                                      value={stat.value || ''}
                                      placeholder="Value (e.g. 72K+)"
                                      onChange={(e) => {
                                        const currentItems = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [
                                          { value: '72K+', label: 'Happy Travelers' },
                                          { value: '4.4', label: 'Google Rating' },
                                          { value: '100%', label: 'Client Satisfaction' },
                                          { value: '25+', label: 'Years Experience' }
                                        ])];
                                        currentItems[sIdx] = { ...currentItems[sIdx], value: e.target.value };
                                        updateSectionData(sec.id, 'items', currentItems);
                                      }}
                                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                                    />
                                    <input
                                      type="text"
                                      value={stat.label || ''}
                                      placeholder="Label (e.g. Happy Travelers)"
                                      onChange={(e) => {
                                        const currentItems = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [
                                          { value: '72K+', label: 'Happy Travelers' },
                                          { value: '4.4', label: 'Google Rating' },
                                          { value: '100%', label: 'Client Satisfaction' },
                                          { value: '25+', label: 'Years Experience' }
                                        ])];
                                        currentItems[sIdx] = { ...currentItems[sIdx], label: e.target.value };
                                        updateSectionData(sec.id, 'items', currentItems);
                                      }}
                                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Image+Text' || sec.type === 'Intro (Text + Image)' || sec.type === 'Why Choose Us') && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                                {/* Image Uploader Component */}
                                <div>
                                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                                    🖼 SECTION IMAGE UPLOADER
                                  </label>
                                  <div style={{ display: 'grid', gridTemplateColumns: sec.data?.image ? '120px 1fr' : '1fr', gap: 12, alignItems: 'center' }}>
                                    {sec.data?.image && (
                                      <div style={{ position: 'relative', width: 120, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                        <img src={sec.data.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      </div>
                                    )}
                                    <label style={{
                                      background: '#f8fafc',
                                      border: '2px dashed #cbd5e1',
                                      borderRadius: 10,
                                      padding: '12px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      textAlign: 'center',
                                    }}>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (evt) => {
                                              if (evt.target?.result) {
                                                updateSectionData(sec.id, 'image', String(evt.target.result));
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                      />
                                      <span style={{ fontSize: 12, fontWeight: 700, color: '#004B39', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Upload className="w-4 h-4" /> {sec.data?.image ? 'Click to Change Image File' : 'Click to Upload Image File'}
                                      </span>
                                      <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Supports JPG, PNG, WEBP, SVG</span>
                                    </label>
                                  </div>
                                </div>

                                {/* Rich Text & Features Checklist Editor */}
                                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                    📝 Right Section Rich Text & Checklist Items
                                  </span>

                                  <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>SUBHEADING</label>
                                    <input
                                      type="text"
                                      value={sec.data?.subheading || 'Common Travel Needs We Solve'}
                                      onChange={(e) => updateSectionData(sec.id, 'subheading', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                                    />
                                  </div>

                                  <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>CHECKLIST FEATURES (One per line)</label>
                                    <textarea
                                      rows={5}
                                      value={Array.isArray(sec.data?.features) ? sec.data.features.join('\n') : (sec.data?.features || [
                                        "Securing all types of Saudi visas quickly.",
                                        "Coordinating family or group Hajj packages.",
                                        "Last-minute airline ticket changes or cancellations.",
                                        "5-Star Accommodations near the Haram.",
                                        "Managing itineraries with multiple destinations.",
                                        "Handling urgent travel during peak seasons."
                                      ].join('\n'))}
                                      onChange={(e) => {
                                        const lines = e.target.value.split('\n');
                                        updateSectionData(sec.id, 'features', lines);
                                      }}
                                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontFamily: 'inherit' }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Services Grid' || sec.type === 'What We Provide') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                    ✨ Services Grid Cards (Icon, Title, Subtitle & Description)
                                  </span>
                                  <button
                                    onClick={() => {
                                      const currentServices = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [
                                        { icon: "✈️", title: "Lowest Fares", subtitle: "We Offer the Lowest Fair on Air Ticketing around the Globe.", description: "As a partner with major airlines, including PIA, King Travel Can Ltd guarantees the lowest airfares for flights to Pakistan, Saudi Arabia, and beyond." },
                                        { icon: "✨", title: "Special Deals", subtitle: "We Provide Best Prices Of All Inclusive Packages.", description: "We offer exclusive special deals on Umrah, Hajj, and international flight packages, tailored to fit your budget." },
                                        { icon: "🛡️", title: "Trusted & Certified", subtitle: "We are The Only Authorized Saudi Visa Providers Canada!", description: "Recognized by IATA, ACTA, TICO, ASTA, ATAC, and the Saudi Ministry of Hajj & Umrah." },
                                        { icon: "🕌", title: "Pilgrimage Experts", subtitle: "We Offer Best Accommodations & Transports In Saudia Arabia", description: "From visa processing and ticketing to 5-star accommodations and guided tours, King Travel provides a complete pilgrimage experience." }
                                      ])];
                                      currentServices.push({ icon: "🌟", title: "New Service Card", subtitle: "Service Subtitle", description: "Service details description..." });
                                      updateSectionData(sec.id, 'items', currentServices);
                                    }}
                                    style={{ background: '#004B39', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    + Add Service Card
                                  </button>
                                </div>
                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  { icon: "✈️", title: "Lowest Fares", subtitle: "We Offer the Lowest Fair on Air Ticketing around the Globe.", description: "As a partner with major airlines, including PIA, King Travel Can Ltd guarantees the lowest airfares for flights to Pakistan, Saudi Arabia, and beyond." },
                                  { icon: "✨", title: "Special Deals", subtitle: "We Provide Best Prices Of All Inclusive Packages.", description: "We offer exclusive special deals on Umrah, Hajj, and international flight packages, tailored to fit your budget." },
                                  { icon: "🛡️", title: "Trusted & Certified", subtitle: "We are The Only Authorized Saudi Visa Providers Canada!", description: "Recognized by IATA, ACTA, TICO, ASTA, ATAC, and the Saudi Ministry of Hajj & Umrah." },
                                  { icon: "🕌", title: "Pilgrimage Experts", subtitle: "We Offer Best Accommodations & Transports In Saudia Arabia", description: "From visa processing and ticketing to 5-star accommodations and guided tours, King Travel provides a complete pilgrimage experience." }
                                ]).map((svc: any, sIdx: number) => (
                                  <div key={sIdx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b' }}>CARD #{sIdx + 1}</span>
                                      <button
                                        onClick={() => {
                                          const currentServices = [...sec.data?.items];
                                          currentServices.splice(sIdx, 1);
                                          updateSectionData(sec.id, 'items', currentServices);
                                        }}
                                        className="border-0 bg-red-100 text-red-600 rounded p-1 text-xs cursor-pointer hover:bg-red-200 transition-colors flex items-center gap-1 font-semibold"
                                        title="Remove Card"
                                      >
                                        <Trash2 className="w-3 h-3" /> Card
                                      </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>ICON</label>
                                        <input
                                          type="text"
                                          value={svc.icon || '✈️'}
                                          onChange={(e) => {
                                            const currentServices = [...sec.data?.items];
                                            currentServices[sIdx] = { ...currentServices[sIdx], icon: e.target.value };
                                            updateSectionData(sec.id, 'items', currentServices);
                                          }}
                                          style={{ width: '100%', padding: '6px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, textAlign: 'center' }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>CARD TITLE</label>
                                        <input
                                          type="text"
                                          value={svc.title || ''}
                                          onChange={(e) => {
                                            const currentServices = [...sec.data?.items];
                                            currentServices[sIdx] = { ...currentServices[sIdx], title: e.target.value };
                                            updateSectionData(sec.id, 'items', currentServices);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>SUBTITLE / TAGLINE</label>
                                      <input
                                        type="text"
                                        value={svc.subtitle || ''}
                                        onChange={(e) => {
                                          const currentServices = [...sec.data?.items];
                                          currentServices[sIdx] = { ...currentServices[sIdx], subtitle: e.target.value };
                                          updateSectionData(sec.id, 'items', currentServices);
                                        }}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>DESCRIPTION</label>
                                      <textarea
                                        rows={2}
                                        value={svc.description || ''}
                                        onChange={(e) => {
                                          const currentServices = [...sec.data?.items];
                                          currentServices[sIdx] = { ...currentServices[sIdx], description: e.target.value };
                                          updateSectionData(sec.id, 'items', currentServices);
                                        }}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontFamily: 'inherit' }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Accreditations Bar' || sec.type === 'Badges Cards') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                    🛡️ Accreditations & Badges Cards (Lucide / FontAwesome / SVG)
                                  </span>
                                  <button
                                    onClick={() => {
                                      const currentBadges = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [
                                        { title: 'ATOL PROTECTED', icon: 'fa-solid fa-shield-halved', iconType: 'fontawesome' },
                                        { title: 'SAUDI MINISTRY APPROVED', icon: 'fa-solid fa-mosque', iconType: 'fontawesome' },
                                        { title: 'IATA ACCREDITED', icon: 'fa-solid fa-plane-departure', iconType: 'fontawesome' },
                                        { title: 'ABTA BONDED', icon: 'fa-solid fa-stamp', iconType: 'fontawesome' }
                                      ])];
                                      currentBadges.push({ title: 'NEW ACCREDITATION BADGE', icon: 'fa-solid fa-certificate', iconType: 'fontawesome' });
                                      updateSectionData(sec.id, 'items', currentBadges);
                                    }}
                                    style={{ background: '#004B39', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    + Add Badge Card
                                  </button>
                                </div>
                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  { title: 'ATOL PROTECTED', icon: 'fa-solid fa-shield-halved', iconType: 'fontawesome' },
                                  { title: 'SAUDI MINISTRY APPROVED', icon: 'fa-solid fa-[#004B39] fa-mosque', iconType: 'fontawesome' },
                                  { title: 'IATA ACCREDITED', icon: 'fa-solid fa-plane-departure', iconType: 'fontawesome' },
                                  { title: 'ABTA BONDED', icon: 'fa-solid fa-stamp', iconType: 'fontawesome' }
                                ]).map((badge: any, bIdx: number) => (
                                  <div key={bIdx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr auto', gap: 8, alignItems: 'center' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>TITLE / BADGE</label>
                                      <input
                                        type="text"
                                        value={badge.title || ''}
                                        onChange={(e) => {
                                          const currentBadges = [...sec.data?.items];
                                          currentBadges[bIdx] = { ...currentBadges[bIdx], title: e.target.value };
                                          updateSectionData(sec.id, 'items', currentBadges);
                                        }}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 700 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>ICON CLASS / NAME</label>
                                      <input
                                        type="text"
                                        value={badge.icon || ''}
                                        placeholder="fa-solid fa-shield / shield"
                                        onChange={(e) => {
                                          const currentBadges = [...sec.data?.items];
                                          currentBadges[bIdx] = { ...currentBadges[bIdx], icon: e.target.value };
                                          updateSectionData(sec.id, 'items', currentBadges);
                                        }}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>ENGINE</label>
                                      <select
                                        value={badge.iconType || 'fontawesome'}
                                        onChange={(e) => {
                                          const currentBadges = [...sec.data?.items];
                                          currentBadges[bIdx] = { ...currentBadges[bIdx], iconType: e.target.value };
                                          updateSectionData(sec.id, 'items', currentBadges);
                                        }}
                                        style={{ width: '100%', padding: '6px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                      >
                                        <option value="fontawesome">FontAwesome</option>
                                        <option value="lucide">Lucide Icon</option>
                                        <option value="emoji">Emoji</option>
                                      </select>
                                    </div>
                                    <div style={{ paddingTop: 14 }}>
                                      <button
                                        onClick={() => {
                                          const currentBadges = [...sec.data?.items];
                                          currentBadges.splice(bIdx, 1);
                                          updateSectionData(sec.id, 'items', currentBadges);
                                        }}
                                        className="border-0 bg-red-100 text-red-600 rounded-md p-1.5 cursor-pointer hover:bg-red-200 transition-colors flex items-center justify-center"
                                        title="Remove badge"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Visa Solutions Grid' || sec.type === 'Visa Cards') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                    🇸🇦 Visa Solutions Cards Manager (7 Visa Types)
                                  </span>
                                  <button
                                    onClick={() => {
                                      const currentVisas = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [
                                        { title: "Tourist Visa", description: "Only passport required. Explore the beauty and culture of Saudi Arabia effortlessly.", image: "/img/saudi-visa-1.webp" },
                                        { title: "Umrah Visa", description: "Requires passport and PR Card or other proof of residence.", image: "/img/saudi-visa-2.webp" },
                                        { title: "Family Visit Visa", description: "Complete list of requirements sent via email.", image: "/img/saudi-visa-3.jpg" }
                                      ])];
                                      currentVisas.push({ title: "New Visa Category", description: "Visa category description...", image: "/img/saudi-visa-1.webp" });
                                      updateSectionData(sec.id, 'items', currentVisas);
                                    }}
                                    style={{ background: '#004B39', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    + Add Visa Card
                                  </button>
                                </div>
                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  { title: "Tourist Visa", description: "Only passport required. Explore the beauty and culture of Saudi Arabia effortlessly.", image: "/img/saudi-visa-1.webp" },
                                  { title: "Umrah Visa", description: "Requires passport and PR Card or other proof of residence. Start your spiritual journey with official Umrah visa services.", image: "/img/saudi-visa-2.webp" },
                                  { title: "Family Visit Visa", description: "Complete list of requirements sent via email. Reunite with your loved ones quickly and securely.", image: "/img/saudi-visa-3.jpg" },
                                  { title: "Resident Iqama Visa", description: "Get all the requirements sent to your inbox. Simplify your residency process with expert guidance.", image: "/img/saudi-visa-4.webp" },
                                  { title: "Business Visit Visa", description: "We'll email the full details you need. Expand your business horizons with an authorized visa service.", image: "/img/saudi-visa-5.webp" },
                                  { title: "Work Visa", description: "Contact us for detailed requirements via email. Begin your career in Saudi Arabia with professional assistance.", image: "/img/saudi-visa-6.jpg" },
                                  { title: "Personal Visit Visa", description: "Get in touch with us today to get the detailed requirements and fast-track your Saudi personal visit visa.", image: "/img/riyadh.jpg" }
                                ]).map((vCard: any, vIdx: number) => (
                                  <div key={vIdx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b' }}>VISA CARD #{vIdx + 1}</span>
                                      <button
                                        onClick={() => {
                                          const currentVisas = [...sec.data?.items];
                                          currentVisas.splice(vIdx, 1);
                                          updateSectionData(sec.id, 'items', currentVisas);
                                        }}
                                        className="border-0 bg-red-100 text-red-600 rounded p-1 text-xs cursor-pointer hover:bg-red-200 transition-colors flex items-center gap-1 font-semibold"
                                        title="Remove Card"
                                      >
                                        <Trash2 className="w-3 h-3" /> Card
                                      </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>VISA TITLE</label>
                                        <input
                                          type="text"
                                          value={vCard.title || ''}
                                          onChange={(e) => {
                                            const currentVisas = [...sec.data?.items];
                                            currentVisas[vIdx] = { ...currentVisas[vIdx], title: e.target.value };
                                            updateSectionData(sec.id, 'items', currentVisas);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 700 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>IMAGE URL</label>
                                        <input
                                          type="text"
                                          value={vCard.image || ''}
                                          onChange={(e) => {
                                            const currentVisas = [...sec.data?.items];
                                            currentVisas[vIdx] = { ...currentVisas[vIdx], image: e.target.value };
                                            updateSectionData(sec.id, 'items', currentVisas);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>DESCRIPTION</label>
                                      <textarea
                                        rows={2}
                                        value={vCard.description || ''}
                                        onChange={(e) => {
                                          const currentVisas = [...sec.data?.items];
                                          currentVisas[vIdx] = { ...currentVisas[vIdx], description: e.target.value };
                                          updateSectionData(sec.id, 'items', currentVisas);
                                        }}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontFamily: 'inherit' }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Visa Process Steps' || sec.type === '3 Easy Steps') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                    📝 Visa Process Timeline Steps & Contact Info Manager
                                  </span>
                                  <button
                                    onClick={() => {
                                      const currentSteps = [...((sec.data?.steps && Array.isArray(sec.data.steps)) ? sec.data.steps : [
                                        { number: 1, title: "Apply & Share Your Details", description: "Fill out our quick application form and share your travel details. Our team will review your requirements and guide you on the best Saudi visa option for your needs." },
                                        { number: 2, title: "Submit Required Documents", description: "Provide the necessary documents such as your passport and photos. We'll verify everything and ensure your application meets all Saudi visa requirements." },
                                        { number: 3, title: "Sit Back & Get Your Visa", description: "We handle the complete visa processing on your behalf. Once approved, your Saudi visa will be delivered to you quickly and securely." }
                                      ])];
                                      currentSteps.push({
                                        number: currentSteps.length + 1,
                                        title: `New Step ${currentSteps.length + 1}`,
                                        description: "Step details description..."
                                      });
                                      updateSectionData(sec.id, 'steps', currentSteps);
                                    }}
                                    style={{ background: '#004B39', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    + Add New Step Card
                                  </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>EMAIL CONTACT</label>
                                    <input
                                      type="text"
                                      value={sec.data?.email || 'saudivisa@kingtravel.com'}
                                      onChange={(e) => updateSectionData(sec.id, 'email', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>PHONE CONTACT</label>
                                    <input
                                      type="text"
                                      value={sec.data?.phone || '+1 905-624-8344'}
                                      onChange={(e) => updateSectionData(sec.id, 'phone', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                </div>

                                {/* Step Cards CRUD */}
                                {((sec.data?.steps && Array.isArray(sec.data.steps) && sec.data.steps.length > 0) ? sec.data.steps : [
                                  { number: 1, title: "Apply & Share Your Details", description: "Fill out our quick application form and share your travel details. Our team will review your requirements and guide you on the best Saudi visa option for your needs." },
                                  { number: 2, title: "Submit Required Documents", description: "Provide the necessary documents such as your passport and photos. We'll verify everything and ensure your application meets all Saudi visa requirements." },
                                  { number: 3, title: "Sit Back & Get Your Visa", description: "We handle the complete visa processing on your behalf. Once approved, your Saudi visa will be delivered to you quickly and securely." }
                                ]).map((st: any, stIdx: number) => (
                                  <div key={stIdx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: '#004B39' }}>STEP CARD #{stIdx + 1}</span>
                                      <button
                                        onClick={() => {
                                          const currentSteps = [...sec.data?.steps];
                                          currentSteps.splice(stIdx, 1);
                                          updateSectionData(sec.id, 'steps', currentSteps);
                                        }}
                                        className="border-0 bg-red-100 text-red-600 rounded p-1 text-xs cursor-pointer hover:bg-red-200 transition-colors flex items-center gap-1 font-semibold"
                                        title="Remove Step"
                                      >
                                        <Trash2 className="w-3 h-3" /> Step
                                      </button>
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>STEP TITLE</label>
                                      <input
                                        type="text"
                                        value={st.title || ''}
                                        onChange={(e) => {
                                          const currentSteps = [...sec.data?.steps];
                                          currentSteps[stIdx] = { ...currentSteps[stIdx], title: e.target.value };
                                          updateSectionData(sec.id, 'steps', currentSteps);
                                        }}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 700 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>STEP DESCRIPTION</label>
                                      <textarea
                                        rows={2}
                                        value={st.description || ''}
                                        onChange={(e) => {
                                          const currentSteps = [...sec.data?.steps];
                                          currentSteps[stIdx] = { ...currentSteps[stIdx], description: e.target.value };
                                          updateSectionData(sec.id, 'steps', currentSteps);
                                        }}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontFamily: 'inherit' }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Available Flights Grid' || sec.type === 'Flights Cards') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                    ✈️ Available Flights & Fares Cards Manager
                                  </span>
                                  <button
                                    onClick={() => {
                                      const currentFlights = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [
                                        { code: "PIA", name: "Pakistan International Airlines", operatedBy: "Operated By PIA", originCode: "LHR", originCity: "London", destCode: "JED", destCity: "Jeddah", time: "14:20", price: "CAD 1,250.00" }
                                      ])];
                                      currentFlights.push({
                                        code: "SV",
                                        name: "Saudi Arabian Airlines",
                                        operatedBy: "Operated By Saudia",
                                        originCode: "YYZ",
                                        originCity: "Toronto",
                                        destCode: "JED",
                                        destCity: "Jeddah",
                                        time: "16:45",
                                        price: "CAD 1,450.00"
                                      });
                                      updateSectionData(sec.id, 'items', currentFlights);
                                    }}
                                    style={{ background: '#004B39', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    + Add Flight Card
                                  </button>
                                </div>

                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  { code: "PIA", name: "Pakistan International Airlines", operatedBy: "Operated By PIA", originCode: "LHR", originCity: "London", destCode: "JED", destCity: "Jeddah", time: "14:20", price: "CAD 1,250.00" },
                                  { code: "PIA", name: "Pakistan International Airlines", operatedBy: "Operated By PIA", originCode: "LHR", originCity: "London", destCode: "JED", destCity: "Jeddah", time: "14:20", price: "CAD 1,250.00" },
                                  { code: "PIA", name: "Pakistan International Airlines", operatedBy: "Operated By PIA", originCode: "LHR", originCity: "London", destCode: "JED", destCity: "Jeddah", time: "14:20", price: "CAD 1,250.00" }
                                ]).map((fl: any, fIdx: number) => (
                                  <div key={fIdx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: '#004B39' }}>FLIGHT #{fIdx + 1} ({fl.code || 'PIA'})</span>
                                      <button
                                        onClick={() => {
                                          const currentFlights = [...sec.data?.items];
                                          currentFlights.splice(fIdx, 1);
                                          updateSectionData(sec.id, 'items', currentFlights);
                                        }}
                                        className="border-0 bg-red-100 text-red-600 rounded p-1 text-xs cursor-pointer hover:bg-red-200 transition-colors flex items-center gap-1 font-semibold"
                                        title="Remove Flight"
                                      >
                                        <Trash2 className="w-3 h-3" /> Flight
                                      </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>CODE</label>
                                        <input
                                          type="text"
                                          value={fl.code || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], code: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          style={{ width: '100%', padding: '6px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 800 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>AIRLINE NAME</label>
                                        <input
                                          type="text"
                                          value={fl.name || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], name: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 700 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>PRICE ($)</label>
                                        <input
                                          type="text"
                                          value={fl.price || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], price: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 800, color: '#004B39' }}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>FROM CODE</label>
                                        <input
                                          type="text"
                                          value={fl.originCode || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], originCode: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>FROM CITY</label>
                                        <input
                                          type="text"
                                          value={fl.originCity || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], originCity: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>TO CODE</label>
                                        <input
                                          type="text"
                                          value={fl.destCode || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], destCode: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>TO CITY</label>
                                        <input
                                          type="text"
                                          value={fl.destCity || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], destCity: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>FLIGHT TIME</label>
                                        <input
                                          type="text"
                                          value={fl.time || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], time: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>OPERATED BY</label>
                                        <input
                                          type="text"
                                          value={fl.operatedBy || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], operatedBy: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Airlines Marquee' || sec.type === 'Partners Marquee' || sec.type === 'Logo Carousel' || sec.type === 'Airlines Logo Carousel') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                  ✈️ Airlines Logo Carousel & Partners Manager
                                </span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>EYEBROW TEXT</label>
                                    <input
                                      type="text"
                                      value={sec.data?.eyebrow || 'OUR TRUSTED PARTNERS'}
                                      onChange={(e) => updateSectionData(sec.id, 'eyebrow', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>SECTION TITLE</label>
                                    <input
                                      type="text"
                                      value={sec.data?.title || 'Airlines We Sourced Deals From'}
                                      onChange={(e) => updateSectionData(sec.id, 'title', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>CAROUSEL SPEED (MS)</label>
                                    <input
                                      type="number"
                                      step="1000"
                                      placeholder="35000"
                                      value={sec.data?.speedMs !== undefined ? sec.data.speedMs : 35000}
                                      onChange={(e) => updateSectionData(sec.id, 'speedMs', Number(e.target.value))}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>SCROLL DIRECTION</label>
                                    <select
                                      value={sec.data?.direction || 'left'}
                                      onChange={(e) => updateSectionData(sec.id, 'direction', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, background: '#fff' }}
                                    >
                                      <option value="left">⬅️ Left</option>
                                      <option value="right">➡️ Right</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Multi Logo Uploader & Draggable Grid */}
                                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                      🖼️ Upload & Manage Logos (Drag to reorder)
                                    </span>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                      <label style={{ background: '#004B39', color: '#fff', padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Upload className="w-3.5 h-3.5" /> Upload Multiple Logos
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          style={{ display: 'none' }}
                                          onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            if (files.length === 0) return;
                                            const currentLogos = (sec.data?.logos && Array.isArray(sec.data.logos)) ? [...sec.data.logos] : [
                                              { src: '/img/a-1.png', alt: 'Saudi Airlines' },
                                              { src: '/img/a-2.png', alt: 'Emirates' },
                                              { src: '/img/a-3.png', alt: 'Qatar Airways' },
                                              { src: '/img/a-4.png', alt: 'Turkish Airlines' },
                                              { src: '/img/a-5.png', alt: 'Etihad Airways' },
                                              { src: '/img/a-6.png', alt: 'EgyptAir' },
                                              { src: '/img/a-7.png', alt: 'Royal Jordanian' },
                                              { src: '/img/a-8.png', alt: 'Gulf Air' },
                                              { src: '/img/a-9.png', alt: 'Air Canada' },
                                            ];

                                            files.forEach((file) => {
                                              const reader = new FileReader();
                                              reader.onload = (uploadEvent) => {
                                                const newSrc = uploadEvent.target?.result as string;
                                                if (newSrc) {
                                                  currentLogos.push({ src: newSrc, alt: file.name.replace(/\.[^/.]+$/, "") });
                                                  updateSectionData(sec.id, 'logos', [...currentLogos]);
                                                }
                                              };
                                              reader.readAsDataURL(file);
                                            });
                                          }}
                                        />
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const currentLogos = (sec.data?.logos && Array.isArray(sec.data.logos)) ? [...sec.data.logos] : [
                                            { src: '/img/a-1.png', alt: 'Saudi Airlines' },
                                            { src: '/img/a-2.png', alt: 'Emirates' },
                                            { src: '/img/a-3.png', alt: 'Qatar Airways' },
                                            { src: '/img/a-4.png', alt: 'Turkish Airlines' },
                                            { src: '/img/a-5.png', alt: 'Etihad Airways' },
                                            { src: '/img/a-6.png', alt: 'EgyptAir' },
                                            { src: '/img/a-7.png', alt: 'Royal Jordanian' },
                                            { src: '/img/a-8.png', alt: 'Gulf Air' },
                                            { src: '/img/a-9.png', alt: 'Air Canada' },
                                          ];
                                          currentLogos.push({ src: '', alt: 'New Partner' });
                                          updateSectionData(sec.id, 'logos', currentLogos);
                                        }}
                                        style={{ background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                      >
                                        + Add Logo URL
                                      </button>
                                    </div>
                                  </div>

                                  {/* Logo Cards Grid */}
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                                    {((sec.data?.logos && Array.isArray(sec.data.logos)) ? sec.data.logos : [
                                      { src: '/img/a-1.png', alt: 'Saudi Airlines' },
                                      { src: '/img/a-2.png', alt: 'Emirates' },
                                      { src: '/img/a-3.png', alt: 'Qatar Airways' },
                                      { src: '/img/a-4.png', alt: 'Turkish Airlines' },
                                      { src: '/img/a-5.png', alt: 'Etihad Airways' },
                                      { src: '/img/a-6.png', alt: 'EgyptAir' },
                                      { src: '/img/a-7.png', alt: 'Royal Jordanian' },
                                      { src: '/img/a-8.png', alt: 'Gulf Air' },
                                      { src: '/img/a-9.png', alt: 'Air Canada' },
                                    ]).map((logoItem: any, lIdx: number, allLogos: any[]) => (
                                      <div
                                        key={lIdx}
                                        draggable
                                        onDragStart={(e) => {
                                          e.dataTransfer.setData('text/plain', lIdx.toString());
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
                                          if (isNaN(draggedIdx) || draggedIdx === lIdx) return;
                                          const updated = [...allLogos];
                                          const [reordered] = updated.splice(draggedIdx, 1);
                                          updated.splice(lIdx, 0, reordered);
                                          updateSectionData(sec.id, 'logos', updated);
                                        }}
                                        style={{
                                          background: '#fff',
                                          border: '1px solid #cbd5e1',
                                          borderRadius: 8,
                                          padding: 8,
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: 6,
                                          position: 'relative',
                                          cursor: 'grab'
                                        }}
                                      >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <span style={{ fontSize: 9, fontWeight: 800, color: '#64748b' }}>
                                            ⋮⋮ Logo #{lIdx + 1}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = allLogos.filter((_, i) => i !== lIdx);
                                              updateSectionData(sec.id, 'logos', updated);
                                            }}
                                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Remove logo"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>

                                        {/* Logo Image Preview */}
                                        <div style={{ height: 60, background: '#f8fafc', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px border-slate-200' }}>
                                          {logoItem.src ? (
                                            <img src={logoItem.src} alt={logoItem.alt || 'Logo'} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                          ) : (
                                            <span style={{ fontSize: 9, color: '#94a3b8' }}>No Image Preview</span>
                                          )}
                                        </div>

                                        {/* Image URL / Input */}
                                        <input
                                          type="text"
                                          placeholder="Image URL / Path"
                                          value={logoItem.src || ''}
                                          onChange={(e) => {
                                            const updated = [...allLogos];
                                            updated[lIdx] = { ...updated[lIdx], src: e.target.value };
                                            updateSectionData(sec.id, 'logos', updated);
                                          }}
                                          style={{ width: '100%', padding: '4px 6px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 10 }}
                                        />

                                        {/* Alt Text Input */}
                                        <input
                                          type="text"
                                          placeholder="Airline / Partner Name"
                                          value={logoItem.alt || ''}
                                          onChange={(e) => {
                                            const updated = [...allLogos];
                                            updated[lIdx] = { ...updated[lIdx], alt: e.target.value };
                                            updateSectionData(sec.id, 'logos', updated);
                                          }}
                                          style={{ width: '100%', padding: '4px 6px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 10 }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Certifications Flip Cards' || sec.type === 'Our Certifications') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                  🏅 Certifications 3D Flip Cards Manager
                                </span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>EYEBROW TEXT</label>
                                    <input
                                      type="text"
                                      value={sec.data?.eyebrow || 'WHY THEY MATTER'}
                                      onChange={(e) => updateSectionData(sec.id, 'eyebrow', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>SECTION TITLE</label>
                                    <input
                                      type="text"
                                      value={sec.data?.title || 'OUR CERTIFICATIONS'}
                                      onChange={(e) => updateSectionData(sec.id, 'title', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                </div>

                                {/* Background Image Upload & Preview Row */}
                                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                  <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                                    SECTION BACKGROUND IMAGE & PREVIEW
                                  </label>
                                  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, alignItems: 'center' }}>
                                    {/* Image Live Preview */}
                                    <div style={{ height: 75, background: '#071310', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', position: 'relative' }}>
                                      {sec.data?.bgImage ? (
                                        <img src={sec.data.bgImage} alt="Background preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                                      ) : (
                                        <span style={{ fontSize: 9, color: '#cbd5e1' }}>No Image Loaded</span>
                                      )}
                                      <span style={{ position: 'absolute', fontSize: 9, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
                                        Preview
                                      </span>
                                    </div>

                                    {/* Upload Button + File Input */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                          type="text"
                                          placeholder="Background Image Path / URL or Uploaded Base64"
                                          value={sec.data?.bgImage || 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1920&q=80'}
                                          onChange={(e) => updateSectionData(sec.id, 'bgImage', e.target.value)}
                                          style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                        <label style={{ background: '#004B39', color: '#fff', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                                          <Upload className="w-3.5 h-3.5" /> Upload Image
                                          <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                  updateSectionData(sec.id, 'bgImage', ev.target?.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                      <span style={{ fontSize: 9, color: '#64748b' }}>Upload custom background image (JPG, PNG, WebP) for the certification cards section</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Certification Flip Cards Editor List with Drag-and-Drop & Preview */}
                                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                                      Flip Cards Items ({((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : []).length})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentItems = (sec.data?.items && Array.isArray(sec.data.items)) ? [...sec.data.items] : [];
                                        currentItems.push({
                                          logo: '',
                                          title: 'New Accreditation',
                                          description: 'Add detailed certification description here.',
                                          linkUrl: ''
                                        });
                                        updateSectionData(sec.id, 'items', currentItems);
                                      }}
                                      style={{ background: '#004B39', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                    >
                                      + Add Certification Card
                                    </button>
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                                    {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                      { logo: '/img/tico-logo.png', title: 'TICO - Travel Industry Council of Ontario', description: 'TICO regulates travel agencies in Ontario, protecting consumer prepaid funds and ensuring compliance with strict Canadian travel industry regulations.' },
                                      { logo: '/img/iata-logo.png', title: 'IATA - International Air Transport Association', description: 'Being an IATA accredited agency allows us to work directly with airlines, offering competitive airfares, seamless ticketing, and exclusive deals.' },
                                      { logo: '/img/acta-logo.png', title: 'ACTA - Association of Canadian Travel Agencies', description: 'ACTA membership advocates for ethical travel practices and professional excellence across the Canadian travel industry.' },
                                      { logo: '/img/asta-logo.png', title: 'ASTA - American Society of Travel Advisors', description: 'ASTA certification connects us with global travel standards and verified international destination management networks.' },
                                      { logo: '/img/atac-logo.png', title: 'ATAC - Air Transportation Association of Canada', description: 'ATAC represents air transport excellence and safe aviation ticketing protocols across Canada.' },
                                      { logo: '/img/mofa-logo.png', title: 'Saudi Ministry of Foreign Affairs', description: 'Official Saudi Ministry authorization for processing Umrah, Hajj, business, and tourist visas directly from Canada.' }
                                    ]).map((item: any, cIdx: number, allCards: any[]) => (
                                      <div
                                        key={cIdx}
                                        draggable
                                        onDragStart={(e) => {
                                          e.dataTransfer.setData('text/plain', String(cIdx));
                                          e.dataTransfer.effectAllowed = 'move';
                                        }}
                                        onDragOver={(e) => {
                                          e.preventDefault();
                                        }}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          const fromIndex = Number(e.dataTransfer.getData('text/plain'));
                                          if (isNaN(fromIndex) || fromIndex === cIdx) return;
                                          const updated = [...allCards];
                                          const [movedCard] = updated.splice(fromIndex, 1);
                                          updated.splice(cIdx, 0, movedCard);
                                          updateSectionData(sec.id, 'items', updated);
                                        }}
                                        style={{
                                          background: '#fff',
                                          border: '1px solid #cbd5e1',
                                          borderRadius: 8,
                                          padding: 10,
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: 8,
                                          cursor: 'grab',
                                        }}
                                      >
                                        {/* Card Top Drag Handle & Delete Button */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <span style={{ fontSize: 9, fontWeight: 800, color: '#64748b', cursor: 'grab' }} title="Drag to reorder card">
                                            ⋮⋮ Card #{cIdx + 1}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = allCards.filter((_, i) => i !== cIdx);
                                              updateSectionData(sec.id, 'items', updated);
                                            }}
                                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Remove card"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>

                                        {/* Logo Image Live Thumbnail Preview */}
                                        <div style={{ height: 64, background: '#f8fafc', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px border-slate-200' }}>
                                          {item.logo ? (
                                            <img src={item.logo} alt={item.title || 'Logo'} style={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain' }} />
                                          ) : (
                                            <span style={{ fontSize: 9, color: '#94a3b8' }}>No Logo Preview</span>
                                          )}
                                        </div>

                                        {/* Logo Upload & Image URL Input */}
                                        <div>
                                          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>LOGO IMAGE FILE / URL</label>
                                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <input
                                              type="text"
                                              placeholder="/img/tico-logo.png or Base64"
                                              value={item.logo || ''}
                                              onChange={(e) => {
                                                const current = [...allCards];
                                                current[cIdx] = { ...current[cIdx], logo: e.target.value };
                                                updateSectionData(sec.id, 'items', current);
                                              }}
                                              style={{ flex: 1, padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 10 }}
                                            />
                                            <label style={{ background: '#004B39', color: '#fff', borderRadius: 6, padding: '5px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                                              Upload
                                              <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                      const current = [...allCards];
                                                      current[cIdx] = { ...current[cIdx], logo: ev.target?.result as string };
                                                      updateSectionData(sec.id, 'items', current);
                                                    };
                                                    reader.readAsDataURL(file);
                                                  }
                                                }}
                                              />
                                            </label>
                                          </div>
                                        </div>

                                        <div>
                                          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>BACKSIDE TITLE</label>
                                          <input
                                            type="text"
                                            value={item.title || ''}
                                            onChange={(e) => {
                                              const current = [...allCards];
                                              current[cIdx] = { ...current[cIdx], title: e.target.value };
                                              updateSectionData(sec.id, 'items', current);
                                            }}
                                            style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>

                                        <div>
                                          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>BACKSIDE DESCRIPTION</label>
                                          <textarea
                                            rows={2}
                                            value={item.description || ''}
                                            onChange={(e) => {
                                              const current = [...allCards];
                                              current[cIdx] = { ...current[cIdx], description: e.target.value };
                                              updateSectionData(sec.id, 'items', current);
                                            }}
                                            style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 10 }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Flight Assistance CTA' || sec.type === 'Flight Desk CTA') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                  📞 Flight Booking Assistance CTA Banner Manager
                                </span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>BUTTON LABEL</label>
                                    <input
                                      type="text"
                                      value={sec.data?.btnLabel || 'Contact Flight Desk'}
                                      onChange={(e) => updateSectionData(sec.id, 'btnLabel', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>BUTTON LINK</label>
                                    <input
                                      type="text"
                                      value={sec.data?.btnLink || '/contact'}
                                      onChange={(e) => updateSectionData(sec.id, 'btnLink', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Contact Info Cards' || sec.type === 'Contact Bar') && (
                              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#004B39', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                                  📍 Contact Info Cards & Locations Manager
                                </span>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                  {/* Card 1: Locations Box */}
                                  <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                                      <div style={{ width: 28, height: 28, borderRadius: 6, background: '#e6f4f1', color: '#004B39', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="fa-solid fa-location-dot text-xs"></i>
                                      </div>
                                      <span style={{ fontSize: 12, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>Card 1: Locations Info</span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#004B39', marginBottom: 2 }}>CARD TITLE</label>
                                        <input
                                          type="text"
                                          value={sec.data?.card1Title || 'OUR LOCATIONS'}
                                          onChange={(e) => updateSectionData(sec.id, 'card1Title', e.target.value)}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 700 }}
                                        />
                                      </div>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <div>
                                          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>HEAD OFFICE ADDRESS</label>
                                          <input
                                            type="text"
                                            value={sec.data?.headAddress || '1325 Eglinton Ave E Ste 218, Mississauga, ON L4W 4L9, Canada'}
                                            onChange={(e) => updateSectionData(sec.id, 'headAddress', e.target.value)}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>
                                        <div>
                                          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>BRANCH OFFICE ADDRESS</label>
                                          <input
                                            type="text"
                                            value={sec.data?.branchAddress || '22 Ontario St S, Milton, ON L9T 2M6, Canada'}
                                            onChange={(e) => updateSectionData(sec.id, 'branchAddress', e.target.value)}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card 2: Support Box */}
                                  <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                                      <div style={{ width: 28, height: 28, borderRadius: 6, background: '#e6f4f1', color: '#004B39', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="fa-solid fa-phone text-xs"></i>
                                      </div>
                                      <span style={{ fontSize: 12, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>Card 2: 24/7 Phone Support</span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#004B39', marginBottom: 2 }}>CARD TITLE</label>
                                        <input
                                          type="text"
                                          value={sec.data?.card2Title || '24/7 SUPPORT'}
                                          onChange={(e) => updateSectionData(sec.id, 'card2Title', e.target.value)}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 700 }}
                                        />
                                      </div>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                        <div>
                                          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>SUPPORT PHONE 1</label>
                                          <input
                                            type="text"
                                            value={sec.data?.phone1 || '+1 800-844-5464'}
                                            onChange={(e) => updateSectionData(sec.id, 'phone1', e.target.value)}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>
                                        <div>
                                          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>SUPPORT PHONE 2</label>
                                          <input
                                            type="text"
                                            value={sec.data?.phone2 || '+1 905-624-8555'}
                                            onChange={(e) => updateSectionData(sec.id, 'phone2', e.target.value)}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>
                                        <div>
                                          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>SUPPORT PHONE 3</label>
                                          <input
                                            type="text"
                                            value={sec.data?.phone3 || '+1 905-624-8344'}
                                            onChange={(e) => updateSectionData(sec.id, 'phone3', e.target.value)}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card 3: Email Box */}
                                  <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                                      <div style={{ width: 28, height: 28, borderRadius: 6, background: '#e6f4f1', color: '#004B39', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="fa-solid fa-envelope text-xs"></i>
                                      </div>
                                      <span style={{ fontSize: 12, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>Card 3: Email & Socials</span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#004B39', marginBottom: 2 }}>CARD TITLE</label>
                                        <input
                                          type="text"
                                          value={sec.data?.card3Title || 'EMAIL US'}
                                          onChange={(e) => updateSectionData(sec.id, 'card3Title', e.target.value)}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 700 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>EMAIL ADDRESS</label>
                                        <input
                                          type="text"
                                          value={sec.data?.email || 'info@kingtravelcan.com'}
                                          onChange={(e) => updateSectionData(sec.id, 'email', e.target.value)}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8, marginTop: 4 }}>
                                      <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#004B39', textTransform: 'uppercase', marginBottom: 6 }}>
                                        📱 Social Media Links (Opens in New Tab)
                                      </label>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <div>
                                          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, color: '#1877F2', marginBottom: 2 }}>
                                            <i className="fa-brands fa-facebook-f"></i> FACEBOOK URL
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.data?.facebookUrl !== undefined ? sec.data.facebookUrl : 'https://www.facebook.com/kingtravelcan'}
                                            onChange={(e) => updateSectionData(sec.id, 'facebookUrl', e.target.value)}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>
                                        <div>
                                          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, color: '#E4405F', marginBottom: 2 }}>
                                            <i className="fa-brands fa-instagram"></i> INSTAGRAM URL
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.data?.instagramUrl !== undefined ? sec.data.instagramUrl : 'https://www.instagram.com/kingtravelcan/'}
                                            onChange={(e) => updateSectionData(sec.id, 'instagramUrl', e.target.value)}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>
                                        <div>
                                          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, color: '#0077B5', marginBottom: 2 }}>
                                            <i className="fa-brands fa-linkedin-in"></i> LINKEDIN URL
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.data?.linkedinUrl !== undefined ? sec.data.linkedinUrl : 'https://ca.linkedin.com/company/kingtravelcan'}
                                            onChange={(e) => updateSectionData(sec.id, 'linkedinUrl', e.target.value)}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>
                                        <div>
                                          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, color: '#000', marginBottom: 2 }}>
                                            <i className="fa-brands fa-tiktok"></i> TIKTOK URL
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.data?.tiktokUrl !== undefined ? sec.data.tiktokUrl : 'https://www.tiktok.com/@kingtravelcan'}
                                            onChange={(e) => updateSectionData(sec.id, 'tiktokUrl', e.target.value)}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Contact Form') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                  ✉️ Interactive Contact Form Manager
                                </span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>FORM TITLE</label>
                                    <input
                                      type="text"
                                      value={sec.data?.title || 'Drop Us A Message'}
                                      onChange={(e) => updateSectionData(sec.id, 'title', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>FORM SUBTITLE</label>
                                    <input
                                      type="text"
                                      value={sec.data?.subtitle || "Fill out the form below and we'll get back to you shortly."}
                                      onChange={(e) => updateSectionData(sec.id, 'subtitle', e.target.value)}
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Contact Maps' || sec.type === 'Google Maps') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                  🗺️ Dual Office Google Maps Manager
                                </span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                  {/* Head Office Map Controls */}
                                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>📍 Head Office Location</span>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>LOCATION TITLE</label>
                                      <input
                                        type="text"
                                        value={sec.data?.headTitle || 'Head Office'}
                                        onChange={(e) => updateSectionData(sec.id, 'headTitle', e.target.value)}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>LOCATION ADDRESS</label>
                                      <input
                                        type="text"
                                        value={sec.data?.headAddress || '1325 Eglinton Ave E Ste 218, Mississauga, ON L4W 4L9, Canada'}
                                        onChange={(e) => updateSectionData(sec.id, 'headAddress', e.target.value)}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>HEAD MAP EMBED URL</label>
                                      <input
                                        type="text"
                                        value={sec.data?.headMapUrl || ''}
                                        placeholder="https://www.google.com/maps/embed?..."
                                        onChange={(e) => updateSectionData(sec.id, 'headMapUrl', e.target.value)}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                      />
                                    </div>
                                  </div>

                                  {/* Branch Office Map Controls */}
                                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>📍 Branch Office Location</span>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>LOCATION TITLE</label>
                                      <input
                                        type="text"
                                        value={sec.data?.branchTitle || 'Branch Office'}
                                        onChange={(e) => updateSectionData(sec.id, 'branchTitle', e.target.value)}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>LOCATION ADDRESS</label>
                                      <input
                                        type="text"
                                        value={sec.data?.branchAddress || '22 Ontario St S, Milton, ON L9T 2M6, Canada'}
                                        onChange={(e) => updateSectionData(sec.id, 'branchAddress', e.target.value)}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>BRANCH MAP EMBED URL</label>
                                      <input
                                        type="text"
                                        value={sec.data?.branchMapUrl || ''}
                                        placeholder="https://www.google.com/maps/embed?..."
                                        onChange={(e) => updateSectionData(sec.id, 'branchMapUrl', e.target.value)}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Hajj Packages Grid' || sec.type === 'Hajj Cards') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: '#DB9E30', textTransform: 'uppercase' }}>
                                    🕋 Dynamic Hajj Packages Cards Manager (Hajj 2027 Style)
                                  </span>
                                  <button
                                    onClick={() => {
                                      const currentPkgs = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [
                                        {
                                          id: "hajj-1",
                                          title: "Economy Hajj Package 2027",
                                          duration: "14Days",
                                          heroImage: "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg",
                                          price: "12,995",
                                          makkahHotel: { name: "5 Star Hotel in Makkah", location: "Near to Haram" },
                                          madinahHotel: { name: "5 Star Hotel in Madinah", location: "Near to Masjid Nabawi" }
                                        }
                                      ])];
                                      currentPkgs.push({
                                        id: `hajj-${Date.now()}`,
                                        title: `Deluxe Hajj Package ${currentPkgs.length + 1}`,
                                        duration: "15 Days",
                                        heroImage: "https://images.unsplash.com/photo-1565552070098-fd83a8dac718?auto=format&fit=crop&w=800&q=80",
                                        price: "17,995",
                                        makkahHotel: { name: "5 Star Fairmont Makkah", location: "Near to Haram" },
                                        madinahHotel: { name: "5 Star Dar Al Eman Madinah", location: "Near to Masjid Nabawi" }
                                      });
                                      updateSectionData(sec.id, 'items', currentPkgs);
                                    }}
                                    style={{ background: '#DB9E30', color: '#000', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                                  >
                                    + Add New Hajj Package Card
                                  </button>
                                </div>

                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  {
                                    id: "hajj-1",
                                    title: "Economy Hajj Package 2027",
                                    duration: "14Days",
                                    heroImage: "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg",
                                    price: "12,995",
                                    makkahHotel: { name: "5 Star Hotel in Makkah", location: "Near to Haram" },
                                    madinahHotel: { name: "5 Star Hotel in Madinah", location: "Near to Masjid Nabawi" }
                                  },
                                  {
                                    id: "hajj-2",
                                    title: "Deluxe Hajj 2027",
                                    duration: "15 Days",
                                    heroImage: "https://images.unsplash.com/photo-1565552070098-fd83a8dac718?auto=format&fit=crop&w=800&q=80",
                                    price: "17,995",
                                    makkahHotel: { name: "5 Star Hotel Fairmont Makkah", location: "Near to Haram" },
                                    madinahHotel: { name: "5 Star Hotel Dar Al Eman Madinah", location: "Near to Masjid Nabawi" }
                                  }
                                ]).map((pkg: any, pIdx: number) => (
                                  <div key={pkg.id || pIdx} style={{ background: '#fcf8f2', border: '1px solid #fcd34d', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: '#b45309' }}>HAJJ PACKAGE CARD #{pIdx + 1}</span>
                                      <button
                                        onClick={() => {
                                          const pkgs = [...sec.data?.items];
                                          pkgs.splice(pIdx, 1);
                                          updateSectionData(sec.id, 'items', pkgs);
                                        }}
                                        className="border-0 bg-red-100 text-red-600 rounded p-1 text-xs cursor-pointer hover:bg-red-200 transition-colors flex items-center gap-1 font-semibold"
                                        title="Remove Card"
                                      >
                                        <Trash2 className="w-3 h-3" /> Card
                                      </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>PACKAGE TITLE</label>
                                        <input
                                          type="text"
                                          value={pkg.title || ''}
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], title: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>DURATION</label>
                                        <input
                                          type="text"
                                          value={pkg.duration || ''}
                                          placeholder="14Days"
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], duration: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>PRICE ($)</label>
                                        <input
                                          type="text"
                                          value={pkg.price || ''}
                                          placeholder="12,995"
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], price: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 800, color: '#b45309' }}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>MAKKAH HOTEL</label>
                                        <input
                                          type="text"
                                          value={pkg.makkahHotel?.name || ''}
                                          placeholder="Hotel name..."
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], makkahHotel: { ...(pkgs[pIdx].makkahHotel || {}), name: e.target.value } };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>MADINAH HOTEL</label>
                                        <input
                                          type="text"
                                          value={pkg.madinahHotel?.name || ''}
                                          placeholder="Hotel name..."
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], madinahHotel: { ...(pkgs[pIdx].madinahHotel || {}), name: e.target.value } };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Umrah Packages Grid' || sec.type === 'Packages Grid') && (
                              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: '#004B39', textTransform: 'uppercase' }}>
                                    🕋 Dynamic Umrah Packages Cards Manager
                                  </span>
                                  <button
                                    onClick={() => {
                                      const currentPkgs = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [
                                        {
                                          id: "pkg-1",
                                          title: "Customize Umrah Package 2026",
                                          duration: "10, 15 Days",
                                          heroImage: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80",
                                          price: "$7,499",
                                          makkahHotel: { name: "5 Star Hotel in Makkah", location: "Near to Haram" },
                                          madinahHotel: { name: "5 Star Hotel in Madinah", location: "Near to Masjid Nabawi" }
                                        }
                                      ])];
                                      currentPkgs.push({
                                        id: `pkg-${Date.now()}`,
                                        title: `New Umrah Package ${currentPkgs.length + 1}`,
                                        duration: "15 Days",
                                        heroImage: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80",
                                        price: "$6,999",
                                        makkahHotel: { name: "5 Star Makkah Hotel", location: "Close to Haram" },
                                        madinahHotel: { name: "5 Star Madinah Hotel", location: "Close to Prophet's Mosque" }
                                      });
                                      updateSectionData(sec.id, 'items', currentPkgs);
                                    }}
                                    style={{ background: '#004B39', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    + Add New Package Card
                                  </button>
                                </div>

                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  {
                                    id: "pkg-1",
                                    title: "Customize Umrah Package 2026",
                                    duration: "10, 15 Days",
                                    heroImage: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80",
                                    price: "$7,499",
                                    makkahHotel: { name: "5 Star Hotel in Makkah", location: "Near to Haram" },
                                    madinahHotel: { name: "5 Star Hotel in Madinah", location: "Near to Masjid Nabawi" }
                                  },
                                  {
                                    id: "pkg-2",
                                    title: "Elite Platinum Umrah 2026",
                                    duration: "15 Days",
                                    heroImage: "https://images.unsplash.com/photo-1565552070098-fd83a8dac718?auto=format&fit=crop&w=800&q=80",
                                    price: "$10,950",
                                    makkahHotel: { name: "Fairmont Clock Royal Tower", location: "Zero distance (In Front)" },
                                    madinahHotel: { name: "The Oberoi Madinah", location: "Adjacent to Courtyard" }
                                  }
                                ]).map((pkg: any, pIdx: number) => (
                                  <div key={pkg.id || pIdx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b' }}>PACKAGE CARD #{pIdx + 1}</span>
                                      <button
                                        onClick={() => {
                                          const pkgs = [...sec.data?.items];
                                          pkgs.splice(pIdx, 1);
                                          updateSectionData(sec.id, 'items', pkgs);
                                        }}
                                        className="border-0 bg-red-100 text-red-600 rounded p-1 text-xs cursor-pointer hover:bg-red-200 transition-colors flex items-center gap-1 font-semibold"
                                        title="Remove Card"
                                      >
                                        <Trash2 className="w-3 h-3" /> Card
                                      </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>PACKAGE TITLE</label>
                                        <input
                                          type="text"
                                          value={pkg.title || ''}
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], title: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>DURATION</label>
                                        <input
                                          type="text"
                                          value={pkg.duration || ''}
                                          placeholder="10, 15 Days"
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], duration: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>PRICE ($)</label>
                                        <input
                                          type="text"
                                          value={pkg.price || ''}
                                          placeholder="$7,499"
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], price: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 800, color: '#004B39' }}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>MAKKAH HOTEL</label>
                                        <input
                                          type="text"
                                          value={pkg.makkahHotel?.name || ''}
                                          placeholder="Hotel name..."
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], makkahHotel: { ...(pkgs[pIdx].makkahHotel || {}), name: e.target.value } };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>MADINAH HOTEL</label>
                                        <input
                                          type="text"
                                          value={pkg.madinahHotel?.name || ''}
                                          placeholder="Hotel name..."
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], madinahHotel: { ...(pkgs[pIdx].madinahHotel || {}), name: e.target.value } };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'richtext' && (
                <div>
                  <textarea
                    value={richText || ''}
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
                    <input type="text" value={metaTitle || ''} onChange={(e) => setMetaTitle(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>META DESCRIPTION</label>
                    <textarea rows={3} value={metaDescription || ''} onChange={(e) => setMetaDescription(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }} />
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
              <Field orientation="horizontal">
                <Switch id="switch-show-in-menu" checked={showInMenu} onChange={setShowInMenu} />
              </Field>
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
            ⏱ Auto-saves draft every 60 seconds
          </div>
        </div>

      </div>
      <ConfirmModal config={confirmConfig} onClose={() => setConfirmConfig(null)} />
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
