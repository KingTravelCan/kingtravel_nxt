'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { getPageById, savePageAction } from '@/actions/pageActions';
import ConfirmModal, { ConfirmModalConfig } from '@/components/ui/ConfirmModal';
import { Trash2, Upload, Settings } from 'lucide-react';
import AdminPackageDetailModal from '@/components/admin/AdminPackageDetailModal';
import { uploadFileToFtp, generateAutoAltText } from '@/lib/uploadClient';
import SeoCenterModal from '@/components/admin/SeoCenterModal';

type SectionMeta = {
  type: string;
  description: string;
  pages: string[];
};

type SectionCategory = {
  category: string;
  icon: string;
  items: SectionMeta[];
};

const SECTION_CATALOG: SectionCategory[] = [
  {
    category: 'Homepage',
    icon: '🏠',
    items: [
      { type: 'Who We Are (Intro & Stats)', description: 'Split layout with agency intro text, trust quote badge, and animated stat counters.', pages: ['Homepage'] },
      { type: 'Exclusive Upcoming Umrah Packages', description: 'Featured Umrah package cards with CTA button and price teaser.', pages: ['Homepage'] },
      { type: 'Select Preferred Travel Service', description: 'Interactive service icon grid (Umrah, Hajj, Visa, Flights, Hotels…).', pages: ['Homepage'] },
      { type: 'What We Provide (Numbered Features)', description: 'Numbered feature list alongside a full-height image — showcases key value props.', pages: ['Homepage'] },
      { type: 'Hero Slider', description: 'Full-width hero slider with headline, subtext, and CTA buttons.', pages: ['Homepage'] },
    ],
  },
  {
    category: 'About & Trust',
    icon: '🏛',
    items: [
      { type: 'Intro', description: 'Simple eyebrow + heading + body text intro block for any page.', pages: ['About', 'Any Page'] },
      { type: 'Stats Grid', description: 'Horizontal KPI stat counters (e.g. 72K+ Travelers, 25+ Years).', pages: ['About', 'Homepage'] },
      { type: 'Accreditations Bar', description: 'Logo bar of accreditation bodies (IATA, TICO, ACTA, Saudi Ministry).', pages: ['About', 'Homepage'] },
      { type: 'Certifications Flip Cards', description: 'Flip-card grid showing certifications and credentials front & back.', pages: ['About'] },
      { type: 'Team Grid', description: 'Staff profile photo grid with name and role.', pages: ['About'] },
      { type: 'Ideology / Feature Cards', description: 'Mission, vision, values cards in a branded card grid.', pages: ['About'] },
      { type: 'Leader Bio Card', description: 'Full-width leadership bio with portrait photo and rich text.', pages: ['About'] },
      { type: 'Organization Hero Banner', description: 'Bold full-width banner with org name, tagline, and background image.', pages: ['About'] },
    ],
  },
  {
    category: 'Packages (Umrah & Hajj)',
    icon: '🕋',
    items: [
      { type: 'Umrah Packages Grid', description: 'Database-driven Umrah package cards with price, hotel rating, and booking CTA.', pages: ['Umrah Packages', 'Homepage'] },
      { type: 'Hajj Packages Grid', description: 'Database-driven Hajj package cards with full details and booking form.', pages: ['Hajj Packages'] },
      { type: 'CTA Banner', description: 'Full-width conversion CTA with heading, subtext, and call-to-action button.', pages: ['Umrah Packages', 'Hajj Packages', 'Any Page'] },
    ],
  },
  {
    category: 'Visa & Saudi',
    icon: '🪪',
    items: [
      { type: 'Visa Solutions Grid', description: 'Visa type cards (Tourist, Business, Umrah, Hajj) with features and apply CTA.', pages: ['Saudi Visa'] },
      { type: 'Visa Process Steps', description: '3-step visual process block (Apply → Review → Confirmed) for visa applicants.', pages: ['Saudi Visa'] },
    ],
  },
  {
    category: 'Airlines & Flights',
    icon: '✈️',
    items: [
      { type: 'Available Flights Grid', description: 'Live flight route cards with fare, airline, and availability status.', pages: ['Airlines'] },
      { type: 'Airlines Marquee', description: 'Infinite scrolling logo marquee of airline partner brands.', pages: ['Airlines', 'About', 'Homepage'] },
      { type: 'Airlines Logo Carousel', description: 'Interactive carousel of airline partner logos with hover effect.', pages: ['Airlines', 'About'] },
      { type: 'Flight Assistance CTA', description: 'Full-width CTA encouraging visitors to contact the flight desk.', pages: ['Airlines'] },
    ],
  },
  {
    category: 'Contact',
    icon: '📞',
    items: [
      { type: 'Contact Info Cards', description: 'Office address cards with phone, email, and map links for each location.', pages: ['Contact'] },
      { type: 'Contact Form', description: 'Animated contact form with dual notification (admin + user confirmation email).', pages: ['Contact', 'Any Page'] },
      { type: 'Contact Maps', description: 'Embedded dual Google Maps iframes for head office and branch locations.', pages: ['Contact'] },
    ],
  },
  {
    category: 'Content & Layout',
    icon: '📄',
    items: [
      { type: 'Services Grid', description: 'Icon + heading + description service tiles in a responsive grid.', pages: ['About', 'Any Page'] },
      { type: 'Image+Text', description: 'Split image-and-text block with eyebrow, heading, body, and optional CTA.', pages: ['Any Page'] },
      { type: 'Intro (Text + Image)', description: 'Reversed intro block — text on left, image panel on right.', pages: ['Any Page'] },
      { type: 'Image + Text (Side by Side)', description: 'Full-width split section with large image beside formatted text.', pages: ['Any Page'] },
      { type: 'Text Block (Rich Text)', description: 'Free-form rich text editor block for long-form content.', pages: ['Any Page'] },
      { type: 'Accordion / FAQ', description: 'Expandable FAQ accordion with question-answer pairs.', pages: ['Any Page'] },
      { type: 'Quote Banner (Full Width)', description: 'Bold full-width testimonial or inspirational quote with attribution.', pages: ['Any Page'] },
      { type: 'Media Grid', description: 'Photo / video gallery grid with lightbox support.', pages: ['Any Page'] },
      { type: 'Publications Grid', description: 'Media coverage and press publication logo grid.', pages: ['About', 'Any Page'] },
      { type: 'Embed / Media', description: 'Embed any iframe, YouTube video, or external media block.', pages: ['Any Page'] },
    ],
  },
];

// Flat list for search compatibility
const SECTION_OPTIONS = SECTION_CATALOG.flatMap((cat) => cat.items.map((i) => i.type));

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

  // Homepage Hero Banner Specific Fields
  const [heroEyebrow, setHeroEyebrow] = useState('Est. in Canada · Licensed Pilgrimage Operator');
  const [primaryBtnLabel, setPrimaryBtnLabel] = useState('View Umrah Packages →');
  const [primaryBtnLink, setPrimaryBtnLink] = useState('#packages');
  const [secondaryBtnLabel, setSecondaryBtnLabel] = useState('Speak With an Advisor');
  const [secondaryBtnLink, setSecondaryBtnLink] = useState('/contact');
  const [badge1Top, setBadge1Top] = useState('10,000+');
  const [badge1Sub, setBadge1Sub] = useState('Pilgrims Guided');
  const [badge2Top, setBadge2Top] = useState('5★ Hotels');
  const [badge2Sub, setBadge2Sub] = useState('Every Package, Every Time');

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
  const [sectionSearch, setSectionSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeDetailPopupModal, setActiveDetailPopupModal] = useState<{ secId: string; pIdx: number; pkg: any } | null>(null);

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
    let defaultData: Record<string, any> = {
      eyebrow: type.toUpperCase(),
      title: `Heading for ${type}`,
      description: 'Add section content description here...',
    };

    if (type === 'Who We Are (Intro & Stats)' || type === 'Who We Are') {
      defaultData = {
        eyebrow: 'WHO WE ARE',
        title: 'We provide and offer Hajj & Umrah packages',
        description: 'King Travel proudly provides reliable and professional Hajj and Umrah services across Canada. With years of experience serving the Muslim community, we are committed to making your sacred journey smooth, comfortable, and spiritually fulfilling. Whether you are traveling for Hajj, Umrah, or Saudi Visa services, our expert team is here to guide you every step of the way.',
        image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80',
        quoteBadgeText: '"Every detail handled — from Visa to hotel, steps from the Haram."',
        stat1Num: '25+',
        stat1Label: 'Years Serving Canada',
        stat2Num: '10,000+',
        stat2Label: 'Pilgrims Guided',
        stat3Num: '5★',
        stat3Label: 'Hotels, Every Package',
      };
    } else if (type === 'Exclusive Upcoming Umrah Packages') {
      defaultData = {
        eyebrow: 'EXCLUSIVE UPCOMING',
        title: 'Umrah Packages from Canada',
        subtext: 'Departures from CAD 2,595 per person. Availability and accommodations are confirmed with every booking — contact us before reserving.',
        btnText: 'SEE ALL PACKAGES →',
        btnLink: '/umrah/packages',
      };
    } else if (type === 'Select Preferred Travel Service') {
      defaultData = {
        eyebrow: 'SERVICES WE OFFER',
        title: 'Select your preferred travel service',
        services: [
          { icon: 'star', title: 'Umrah Packages', description: 'Flexible departures with flights, stays, & guidance included.', link: '/umrah/packages' },
          { icon: 'kaaba', title: 'Hajj Packages', description: 'Fully accredited pilgrimage packages, curated end to end.', link: '/hajj/packages' },
          { icon: 'plane', title: 'Airline Tickets', description: 'Best-fare flights sourced from every route into Jeddah.', link: '/airlines' },
          { icon: 'visa', title: 'Saudi Visa Services', description: 'Full visa processing, handled and confirmed before departure.', link: '/saudi-visa' },
          { icon: 'hotel', title: 'Hotel Booking', description: '5-star stays within walking distance of the Haram.', link: '/contact' },
          { icon: 'globe', title: 'Global Flight Reservations', description: 'Worldwide reliable flight bookings for any itinerary.', link: '/airlines' },
          { icon: 'file', title: 'Travel Documentation', description: 'Guidance on every document your journey requires.', link: '/contact' },
          { icon: 'users', title: 'Group & Private Tours', description: 'Private, guided, and fully customizable itineraries.', link: '/contact' },
        ],
      };
    } else if (type === 'What We Provide (Numbered Features)') {
      defaultData = {
        eyebrow: 'WHAT WE PROVIDE',
        title: 'Lowest fares, exclusive travel deals, real trust',
        image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80',
        features: [
          { num: '01', title: 'Lowest Fares', description: 'We offer the lowest rates on the market, sourced across every route into Jeddah.' },
          { num: '02', title: 'Special Deals', description: 'Fixed-price Umrah packages with hotels, meals and transport included.' },
          { num: '03', title: 'Trusted & Certified', description: 'A fully accredited travel agency you can rely on, licensed across Canada.' },
          { num: '04', title: 'Pilgrimage Services', description: 'Visa processing, group support — the full spiritual journey, arranged.' },
        ],
      };
    }

    const newSec: SectionItem = {
      id: String(Date.now()),
      type,
      title: `${type}`,
      data: defaultData,
    };
    setSections([...sections, newSec]);
    setEditingSectionId(newSec.id);
    setDropdownOpen(false);
  };

  const [confirmConfig, setConfirmConfig] = useState<ConfirmModalConfig | null>(null);
  const [seoModalOpen, setSeoModalOpen] = useState(false);

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
        const updatedSections = [...sections];
        if (slug === '/' || pageId === 1) {
          const heroSecData = {
            heroEyebrow,
            title: bannerTitle || title || 'Your journey to <span>Makkah & Madinah</span>, guided with care.',
            description: bannerDescription || "King Travel plans Hajj and Umrah journeys from Canada down to the smallest detail...",
            primaryBtnLabel,
            primaryBtnLink,
            secondaryBtnLabel,
            secondaryBtnLink,
            badge1Top,
            badge1Sub,
            badge2Top,
            badge2Sub,
            bannerBgImage,
            bannerPosition,
            bannerSize,
          };
          const heroIdx = updatedSections.findIndex(s => s.type === 'Homepage Hero Banner' || s.type === 'Hero Slider');
          if (heroIdx >= 0) {
            updatedSections[heroIdx].data = heroSecData;
          } else {
            updatedSections.unshift({
              id: 'home-hero-1',
              type: 'Homepage Hero Banner',
              title: 'Homepage Hero Banner (1920px x 640px)',
              data: heroSecData,
            });
          }
        }

        const fd = new FormData();
        if (pageId) fd.append('id', String(pageId));
        fd.append('title', title);
        fd.append('slug', slug);
        fd.append('status', draft ? 'draft' : status);
        fd.append('showInMenu', String(showInMenu));
        fd.append('parentPage', parentPage);
        fd.append('sections', JSON.stringify(updatedSections));
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
    <div className="flex flex-col gap-5 font-sans text-slate-800">

      {/* ── Top Bar Breadcrumb & Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 lg:px-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200/90 text-slate-700 hover:border-[#004B39] hover:bg-[#004B39] hover:text-white text-xs font-bold transition-all shadow-2xs no-underline"
          >
            ← Back to Pages
          </Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-lg font-black text-slate-900 m-0 tracking-tight">{title || 'Page Editor'}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {message && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${message.startsWith('✅') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
              {message}
            </span>
          )}

          <button
            type="button"
            onClick={() => setSeoModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-[#004B39] border border-emerald-300 text-xs font-extrabold hover:bg-[#004B39] hover:text-white transition-all cursor-pointer shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Page SEO</span>
          </button>

          <Link
            href={slug || '/'}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all shadow-2xs no-underline"
          >
            👁 View Page
          </Link>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            📄 Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#004B39] hover:bg-[#00382B] text-white text-xs font-black transition-all cursor-pointer shadow-md border-none disabled:opacity-50"
          >
            {saving ? 'Saving...' : '✓ Update'}
          </button>
        </div>
      </div>

      {/* Page Banner Management & Real-Time Preview */}
      {slug === '/' || pageId === 1 ? (
        /* HOMEPAGE HERO BANNER EDITOR (1920px x 640px, MIN-HEIGHT 640px) */
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase m-0 flex items-center gap-1.5">
                👑 HOMEPAGE HERO BANNER BACKGROUND IMAGE & CONTENT (1920PX X 640PX)
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Recommended 1920px x 640px (min-height: 640px)</span>
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

          {/* Split Desktop Grid: Image Upload & Dropzone (Left) + Live 640px Hero Preview Card (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 5-Col Upload & Main Banner Settings */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div
                onClick={() => document.getElementById('hero-banner-file-input')?.click()}
                className="bg-slate-50/80 hover:bg-emerald-50/40 border-2 border-dashed border-slate-300 hover:border-[#004B39] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px]"
              >
                <input
                  type="file"
                  id="hero-banner-file-input"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'banners');
                      if (url) setBannerBgImage(url);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#004B39] mb-2 text-xl">
                  ⇧
                </div>
                <span className="text-xs font-extrabold text-slate-800">
                  {bannerBgImage ? 'Click to replace hero background image' : 'Click to upload homepage hero image'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-medium">
                  Recommended 1920px x 640px (aspect ratio ~ 3:1, min-height 640px)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>
            </div>

            {/* Right 7-Col Real-Time Live 640px Hero Preview Box (Matching Frontend Layout 100%) */}
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl border border-slate-900/20 p-6 md:p-8 flex flex-col justify-between text-white min-h-[320px]">
              <div
                className="absolute inset-0 z-0 transition-all duration-300"
                ref={(el) => {
                  if (el) {
                    const bgUrl = (bannerBgImage || '/img/hero.png').replace(/"/g, "'");
                    el.style.backgroundImage = `linear-gradient(100deg, rgba(10, 20, 18, .92) 0%, rgba(10, 20, 18, .72) 38%, rgba(10, 20, 18, .15) 68%), url("${bgUrl}")`;
                    el.style.backgroundPosition = bannerPosition || 'center center';
                    el.style.backgroundSize = bannerSize || 'cover';
                    el.style.backgroundRepeat = 'no-repeat';
                  }
                }}
              />

              {/* Floating Top Right Badge 1 Card (Matching Frontend) */}
              <div className="absolute right-5 top-5 z-10 bg-white/95 text-slate-900 rounded-2xl p-2.5 px-3.5 shadow-lg border border-white flex items-center gap-2.5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-full bg-[#DB9E30]/20 border border-[#DB9E30]/40 flex items-center justify-center text-[#DB9E30] text-xs">
                  ★
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 leading-none">{badge1Top}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{badge1Sub}</div>
                </div>
              </div>

              {/* Floating Bottom Right Badge 2 Card (Matching Frontend) */}
              <div className="absolute right-5 bottom-5 z-10 bg-white/95 text-slate-900 rounded-2xl p-2.5 px-3.5 shadow-lg border border-white flex items-center gap-2.5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-full bg-[#DB9E30]/20 border border-[#DB9E30]/40 flex items-center justify-center text-[#DB9E30] text-xs">
                  🕌
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 leading-none">{badge2Top}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{badge2Sub}</div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="relative z-10 max-w-md space-y-3 my-auto">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#DB9E30]">
                  {heroEyebrow || 'Est. in Canada · Licensed Pilgrimage Operator'}
                </div>
                <h1
                  className="text-xl md:text-3xl font-serif text-white m-0 font-normal tracking-tight leading-tight [&>span]:text-[#DB9E30] [&>em]:text-[#DB9E30] [&>em]:not-italic"
                  dangerouslySetInnerHTML={{ __html: bannerTitle || title || 'Your journey to <span>Makkah & Madinah</span>, guided with care.' }}
                />
                <p className="text-xs text-white/80 leading-relaxed font-light">
                  {bannerDescription || "King Travel plans Hajj and Umrah journeys from Canada down to the smallest detail — flights, five-star stays walking distance from the Haram, visas, and guides..."}
                </p>

                {/* Primary & Secondary Buttons Matching Frontend */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="bg-[#DB9E30] hover:bg-[#c68e27] text-[#004B39] font-black text-xs px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer">
                    {primaryBtnLabel || 'View Umrah Packages →'}
                  </span>
                  <span className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer border border-white">
                    {secondaryBtnLabel || 'Speak With an Advisor'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields Grid for Banner Content Editing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                EYEBROW TAGLINE
              </label>
              <input
                type="text"
                value={heroEyebrow}
                onChange={(e) => setHeroEyebrow(e.target.value)}
                placeholder="e.g. Est. in Canada · Licensed Pilgrimage Operator"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
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
                    const inputEl = document.getElementById('hero-banner-title-input') as HTMLInputElement;
                    const fullText = bannerTitle || 'Your journey to <span>Makkah & Madinah</span>, guided with care.';
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
                id="hero-banner-title-input"
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="Headline Title..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                SUBTEXT / DESCRIPTION
              </label>
              <input
                type="text"
                value={bannerDescription}
                onChange={(e) => setBannerDescription(e.target.value)}
                placeholder="Description paragraph..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                PRIMARY CTA BUTTON LABEL
              </label>
              <input
                type="text"
                value={primaryBtnLabel}
                onChange={(e) => setPrimaryBtnLabel(e.target.value)}
                placeholder="View Umrah Packages →"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                PRIMARY CTA LINK
              </label>
              <input
                type="text"
                value={primaryBtnLink}
                onChange={(e) => setPrimaryBtnLink(e.target.value)}
                placeholder="#packages or /umrah-packages"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                SECONDARY CTA BUTTON LABEL
              </label>
              <input
                type="text"
                value={secondaryBtnLabel}
                onChange={(e) => setSecondaryBtnLabel(e.target.value)}
                placeholder="Speak With an Advisor"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                SECONDARY CTA LINK
              </label>
              <input
                type="text"
                value={secondaryBtnLink}
                onChange={(e) => setSecondaryBtnLink(e.target.value)}
                placeholder="/contact"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                BADGE 1 TOP TEXT
              </label>
              <input
                type="text"
                value={badge1Top}
                onChange={(e) => setBadge1Top(e.target.value)}
                placeholder="10,000+"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                BADGE 1 SUBTEXT
              </label>
              <input
                type="text"
                value={badge1Sub}
                onChange={(e) => setBadge1Sub(e.target.value)}
                placeholder="Pilgrims Guided"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                BADGE 2 TOP TEXT
              </label>
              <input
                type="text"
                value={badge2Top}
                onChange={(e) => setBadge2Top(e.target.value)}
                placeholder="5★ Hotels"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                BADGE 2 SUBTEXT
              </label>
              <input
                type="text"
                value={badge2Sub}
                onChange={(e) => setBadge2Sub(e.target.value)}
                placeholder="Every Package, Every Time"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:border-[#004B39]"
              />
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD INNER PAGE BANNER EDITOR */
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
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'banners');
                      if (url) setBannerBgImage(url);
                    }
                  }}
              />
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#004B39]/20 flex items-center justify-center text-[#004B39] mb-2 text-lg">
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
                ref={(el) => {
                  if (el) {
                    const bgUrl = bannerBgImage
                      ? bannerBgImage.replace(/"/g, "'")
                      : "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg";
                    el.style.backgroundImage = `linear-gradient(rgba(10, 66, 45, 0.45), rgba(10, 66, 45, 0.45)), url("${bgUrl}")`;
                    el.style.backgroundPosition = bannerPosition || 'center center';
                    el.style.backgroundSize = bannerSize || 'cover';
                    el.style.backgroundRepeat = 'no-repeat';
                  }
                }}
              />
              <div className="relative z-10 max-w-md px-2">
                <h1
                  className="text-lg md:text-xl font-serif text-white m-0 font-normal tracking-wide [&>span]:text-[#DB9E30] [&>em]:text-[#DB9E30] [&>em]:not-italic"
                  
                  dangerouslySetInnerHTML={{ __html: bannerTitle || title || 'Page Title' }}
                />
                {bannerDescription && (
                  <p
                    className="text-[11px] opacity-90 max-w-sm m-0 mt-1 font-light leading-snug text-white/90"
                    
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
      <div className="grid grid-cols-[1fr_340px] gap-5 items-start">

        {/* Left Column: Title & Section Builder */}
        <div className="flex flex-col gap-5">

          {/* Title & Slug Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
            <div className="mb-4">
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
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
                className="font-bold w-full text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                SLUG *
              </label>
              <input
                type="text"
                value={slug || ''}
                onChange={(e) => setSlug(e.target.value)}
                className="font-semibold w-full text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {/* Dynamic Builder Tabs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs">

            {/* Tab Bar Header */}
            <div className="flex border-b border-slate-100 bg-slate-50 px-4">
              {[
                { key: 'sections', label: '🧱 Page Sections (Dynamic)' },
                { key: 'richtext', label: '📝 Rich Text' },
                { key: 'seo', label: '🔍 SEO Center' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as any)}
                  className={`px-4 py-3.5 text-xs border-x-0 border-t-0 border-b-3 font-sans transition-colors cursor-pointer ${activeTab === t.key ? 'border-b-[#004B39] text-[#004B39] font-extrabold' : 'border-b-transparent text-slate-500 font-semibold hover:text-slate-900'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content Panel */}
            <div className="p-6">
              {activeTab === 'sections' && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="text-base font-extrabold m-0 text-slate-900">Page Sections</h3>
                      <p className="text-xs text-slate-400 mt-1 m-0">Build page layout with reorderable sections</p>
                    </div>

                    {/* Add Section Dropdown Button — Grouped by Page with Hover Preview */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(!dropdownOpen);
                          setSectionSearch('');
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#004B39] hover:bg-[#00382B] text-white text-xs font-extrabold transition-all cursor-pointer shadow-sm border-none"
                      >
                        <span>+ Add Section</span>
                        <span className="text-[10px]">{dropdownOpen ? '▲' : '▼'}</span>
                      </button>

                      {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">

                          {/* Search */}
                          <div className="p-2 pb-2 border-b border-slate-100">
                            <input
                              type="text"
                              autoFocus
                              placeholder="🔍 Search sections..."
                              value={sectionSearch}
                              onChange={(e) => setSectionSearch(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:border-[#004B39]"
                            />
                          </div>

                          {/* Grouped / Filtered List */}
                          <div className="overflow-y-auto max-h-[420px] p-1.5 space-y-1">
                            {sectionSearch.trim() !== '' ? (
                              /* Flat Search Results */
                              (() => {
                                const results = SECTION_CATALOG.flatMap(cat =>
                                  cat.items
                                    .filter(item => item.type.toLowerCase().includes(sectionSearch.toLowerCase()))
                                    .map(item => ({ ...item, catIcon: cat.icon }))
                                );
                                return results.length === 0 ? (
                                  <div className="px-3 py-4 text-xs text-slate-400 font-medium text-center">
                                    No sections match &quot;{sectionSearch}&quot;
                                  </div>
                                ) : results.map(item => (
                                  <button
                                    key={item.type}
                                    type="button"
                                    onClick={() => { addSection(item.type); setDropdownOpen(false); }}
                                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#004B39] hover:bg-emerald-50 transition-colors border-none cursor-pointer flex items-center justify-between group"
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="text-base">{item.catIcon}</span>
                                      <span className="truncate max-w-[200px]">{item.type}</span>
                                    </span>
                                    <span className="text-emerald-600 opacity-0 group-hover:opacity-100 text-xs font-black transition-opacity shrink-0">+ Add</span>
                                  </button>
                                ));
                              })()
                            ) : (
                              /* Grouped by Category */
                              SECTION_CATALOG.map(cat => (
                                <div key={cat.category}>
                                  <div className="flex items-center gap-1.5 px-2 py-1 mt-1">
                                    <span className="text-sm">{cat.icon}</span>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{cat.category}</span>
                                  </div>
                                  {cat.items.map(item => (
                                    <button
                                      key={item.type}
                                      type="button"
                                      onClick={() => { addSection(item.type); setDropdownOpen(false); }}
                                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#004B39] hover:bg-emerald-50 transition-colors border-none cursor-pointer flex items-center justify-between group"
                                    >
                                      <span className="truncate max-w-[210px]">{item.type}</span>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {item.pages.slice(0, 1).map(pg => (
                                          <span key={pg} className="hidden group-hover:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#004B39]/10 text-[#004B39] border border-[#004B39]/20">{pg}</span>
                                        ))}
                                        <span className="text-emerald-600 opacity-0 group-hover:opacity-100 text-xs font-black transition-opacity">+ Add</span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section List */}
                  <div className="flex flex-col gap-3">
                    {sections.map((sec, index) => (
                      <div
                        key={sec.id}
                        className={`border rounded-lg px-2.5 py-1 cursor-pointer text-xs font-semibold transition-colors ${editingSectionId === sec.id ? 'border-[#004B39] bg-[#004B39] text-white' : 'border-slate-300 bg-white text-slate-900'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-0.5">
                              <button
                                disabled={index === 0}
                                onClick={() => moveSection(index, -1)}
                                className="font-sans"
                              >
                                ▲
                              </button>
                              <button
                                disabled={index === sections.length - 1}
                                onClick={() => moveSection(index, 1)}
                                className="font-sans"
                              >
                                ▼
                              </button>
                            </div>
                            <span className="flex items-center justify-center font-extrabold text-[#004B39]">
                              {sec.type.substring(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-slate-900">{sec.type}</div>
                              <div className="text-[11px] text-slate-500">{sec.title || sec.data?.title || `Section ${index + 1}`}</div>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => setEditingSectionId(editingSectionId === sec.id ? null : sec.id)}
                              className={`border rounded-lg px-2.5 py-1 cursor-pointer text-xs font-semibold transition-colors ${editingSectionId === sec.id ? 'border-[#004B39] bg-[#004B39] text-white' : 'border-slate-300 bg-white text-slate-900'}`}
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
                          <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">

                            {sec.type === 'Stats Grid' && (
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
                                <span className="text-[11px] font-extrabold text-[#004B39] uppercase">📊 KPI Stat Items (Value & Label)</span>
                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  { value: '72K+', label: 'Happy Travelers' },
                                  { value: '4.4', label: 'Google Rating' },
                                  { value: '100%', label: 'Client Satisfaction' },
                                  { value: '25+', label: 'Years Experience' }
                                ]).map((stat: any, sIdx: number) => (
                                  <div key={sIdx} className="grid grid-cols-[1fr_2fr] gap-2">
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
                                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
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
                                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Image+Text' || sec.type === 'Intro (Text + Image)' || sec.type === 'Why Choose Us') && (
                              <div className="flex flex-col gap-3.5 mt-1">
                                {/* Image Uploader Component */}
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                                    🖼 SECTION IMAGE UPLOADER
                                  </label>
                                  <div className="grid items-center">
                                    {sec.data?.image && (
                                      <div className="relative w-[120px] h-[80px] rounded-lg overflow-hidden border border-slate-300">
                                        <img src={sec.data.image} alt="Preview" className="w-full h-full object-cover" />
                                      </div>
                                    )}
                                    <label className="flex flex-col items-center justify-center cursor-pointer bg-slate-50">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'sections');
                      if (url) updateSectionData(sec.id, 'image', url);
                    }
                  }}
                                      />
                                      <span className="text-xs font-bold text-[#004B39] flex items-center gap-1.5">
                                        <Upload className="w-4 h-4" /> {sec.data?.image ? 'Click to Change Image File' : 'Click to Upload Image File'}
                                      </span>
                                      <span className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, WEBP, SVG</span>
                                    </label>
                                  </div>
                                </div>

                                {/* Rich Text & Features Checklist Editor */}
                                <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
                                  <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
                                    📝 Right Section Rich Text & Checklist Items
                                  </span>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">SUBHEADING</label>
                                    <input
                                      type="text"
                                      value={sec.data?.subheading || 'Common Travel Needs We Solve'}
                                      onChange={(e) => updateSectionData(sec.id, 'subheading', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">CHECKLIST FEATURES (One per line)</label>
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
                                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-sans"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Services Grid' || sec.type === 'What We Provide') && (
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 mt-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
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
                                    className="bg-[#004B39] text-white border-none rounded-md px-2.5 py-1 text-[11px] font-bold cursor-pointer"
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
                                  <div key={sIdx} className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 flex flex-col gap-2 relative">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-extrabold text-slate-500">CARD #{sIdx + 1}</span>
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
                                    <div className="grid grid-cols-[50px_1fr] gap-2">
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">ICON</label>
                                        <input
                                          type="text"
                                          value={svc.icon || '✈️'}
                                          onChange={(e) => {
                                            const currentServices = [...sec.data?.items];
                                            currentServices[sIdx] = { ...currentServices[sIdx], icon: e.target.value };
                                            updateSectionData(sec.id, 'items', currentServices);
                                          }}
                                          className="w-full p-1.5 rounded-md border border-slate-300 text-sm text-center"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">CARD TITLE</label>
                                        <input
                                          type="text"
                                          value={svc.title || ''}
                                          onChange={(e) => {
                                            const currentServices = [...sec.data?.items];
                                            currentServices[sIdx] = { ...currentServices[sIdx], title: e.target.value };
                                            updateSectionData(sec.id, 'items', currentServices);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">SUBTITLE / TAGLINE</label>
                                      <input
                                        type="text"
                                        value={svc.subtitle || ''}
                                        onChange={(e) => {
                                          const currentServices = [...sec.data?.items];
                                          currentServices[sIdx] = { ...currentServices[sIdx], subtitle: e.target.value };
                                          updateSectionData(sec.id, 'items', currentServices);
                                        }}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">DESCRIPTION</label>
                                      <textarea
                                        rows={2}
                                        value={svc.description || ''}
                                        onChange={(e) => {
                                          const currentServices = [...sec.data?.items];
                                          currentServices[sIdx] = { ...currentServices[sIdx], description: e.target.value };
                                          updateSectionData(sec.id, 'items', currentServices);
                                        }}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-sans"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Accreditations Bar' || sec.type === 'Badges Cards') && (
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 mt-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
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
                                    className="bg-[#004B39] text-white border-none rounded-md px-2.5 py-1 text-[11px] font-bold cursor-pointer"
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
                                  <div key={bIdx} className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 grid grid-cols-[1.5fr_1.5fr_1fr_auto] gap-2 items-center">
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">TITLE / BADGE</label>
                                      <input
                                        type="text"
                                        value={badge.title || ''}
                                        onChange={(e) => {
                                          const currentBadges = [...sec.data?.items];
                                          currentBadges[bIdx] = { ...currentBadges[bIdx], title: e.target.value };
                                          updateSectionData(sec.id, 'items', currentBadges);
                                        }}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">ICON CLASS / NAME</label>
                                      <input
                                        type="text"
                                        value={badge.icon || ''}
                                        placeholder="fa-solid fa-shield / shield"
                                        onChange={(e) => {
                                          const currentBadges = [...sec.data?.items];
                                          currentBadges[bIdx] = { ...currentBadges[bIdx], icon: e.target.value };
                                          updateSectionData(sec.id, 'items', currentBadges);
                                        }}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">ENGINE</label>
                                      <select
                                        value={badge.iconType || 'fontawesome'}
                                        onChange={(e) => {
                                          const currentBadges = [...sec.data?.items];
                                          currentBadges[bIdx] = { ...currentBadges[bIdx], iconType: e.target.value };
                                          updateSectionData(sec.id, 'items', currentBadges);
                                        }}
                                        className="w-full p-1.5 rounded-md border border-slate-300 text-[11px]"
                                      >
                                        <option value="fontawesome">FontAwesome</option>
                                        <option value="lucide">Lucide Icon</option>
                                        <option value="emoji">Emoji</option>
                                      </select>
                                    </div>
                                    <div className="pt-3.5">
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
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 mt-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
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
                                    className="bg-[#004B39] text-white border-none rounded-md px-2.5 py-1 text-[11px] font-bold cursor-pointer"
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
                                  <div key={vIdx} className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-extrabold text-slate-500">VISA CARD #{vIdx + 1}</span>
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
                                    <div className="grid grid-cols-[1fr_2fr] gap-2">
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">VISA TITLE</label>
                                        <input
                                          type="text"
                                          value={vCard.title || ''}
                                          onChange={(e) => {
                                            const currentVisas = [...sec.data?.items];
                                            currentVisas[vIdx] = { ...currentVisas[vIdx], title: e.target.value };
                                            updateSectionData(sec.id, 'items', currentVisas);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">IMAGE URL</label>
                                        <input
                                          type="text"
                                          value={vCard.image || ''}
                                          onChange={(e) => {
                                            const currentVisas = [...sec.data?.items];
                                            currentVisas[vIdx] = { ...currentVisas[vIdx], image: e.target.value };
                                            updateSectionData(sec.id, 'items', currentVisas);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">DESCRIPTION</label>
                                      <textarea
                                        rows={2}
                                        value={vCard.description || ''}
                                        onChange={(e) => {
                                          const currentVisas = [...sec.data?.items];
                                          currentVisas[vIdx] = { ...currentVisas[vIdx], description: e.target.value };
                                          updateSectionData(sec.id, 'items', currentVisas);
                                        }}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-sans"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Visa Process Steps' || sec.type === '3 Easy Steps') && (
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 mt-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
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
                                    className="bg-[#004B39] text-white border-none rounded-md px-2.5 py-1 text-[11px] font-bold cursor-pointer"
                                  >
                                    + Add New Step Card
                                  </button>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">EMAIL CONTACT</label>
                                    <input
                                      type="text"
                                      value={sec.data?.email || 'saudivisa@kingtravel.com'}
                                      onChange={(e) => updateSectionData(sec.id, 'email', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">PHONE CONTACT</label>
                                    <input
                                      type="text"
                                      value={sec.data?.phone || '+1 905-624-8344'}
                                      onChange={(e) => updateSectionData(sec.id, 'phone', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                </div>

                                {/* Step Cards CRUD */}
                                {((sec.data?.steps && Array.isArray(sec.data.steps) && sec.data.steps.length > 0) ? sec.data.steps : [
                                  { number: 1, title: "Apply & Share Your Details", description: "Fill out our quick application form and share your travel details. Our team will review your requirements and guide you on the best Saudi visa option for your needs." },
                                  { number: 2, title: "Submit Required Documents", description: "Provide the necessary documents such as your passport and photos. We'll verify everything and ensure your application meets all Saudi visa requirements." },
                                  { number: 3, title: "Sit Back & Get Your Visa", description: "We handle the complete visa processing on your behalf. Once approved, your Saudi visa will be delivered to you quickly and securely." }
                                ]).map((st: any, stIdx: number) => (
                                  <div key={stIdx} className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-bold text-slate-800">STEP CARD #{stIdx + 1}</span>
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
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">STEP TITLE</label>
                                      <input
                                        type="text"
                                        value={st.title || ''}
                                        onChange={(e) => {
                                          const currentSteps = [...sec.data?.steps];
                                          currentSteps[stIdx] = { ...currentSteps[stIdx], title: e.target.value };
                                          updateSectionData(sec.id, 'steps', currentSteps);
                                        }}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">STEP DESCRIPTION</label>
                                      <textarea
                                        rows={2}
                                        value={st.description || ''}
                                        onChange={(e) => {
                                          const currentSteps = [...sec.data?.steps];
                                          currentSteps[stIdx] = { ...currentSteps[stIdx], description: e.target.value };
                                          updateSectionData(sec.id, 'steps', currentSteps);
                                        }}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-sans"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Available Flights Grid' || sec.type === 'Flights Cards') && (
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 mt-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
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
                                    className="bg-[#004B39] text-white border-none rounded-md px-2.5 py-1 text-[11px] font-bold cursor-pointer"
                                  >
                                    + Add Flight Card
                                  </button>
                                </div>

                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  { code: "PIA", name: "Pakistan International Airlines", operatedBy: "Operated By PIA", originCode: "LHR", originCity: "London", destCode: "JED", destCity: "Jeddah", time: "14:20", price: "CAD 1,250.00" },
                                  { code: "PIA", name: "Pakistan International Airlines", operatedBy: "Operated By PIA", originCode: "LHR", originCity: "London", destCode: "JED", destCity: "Jeddah", time: "14:20", price: "CAD 1,250.00" },
                                  { code: "PIA", name: "Pakistan International Airlines", operatedBy: "Operated By PIA", originCode: "LHR", originCity: "London", destCode: "JED", destCity: "Jeddah", time: "14:20", price: "CAD 1,250.00" }
                                ]).map((fl: any, fIdx: number) => (
                                  <div key={fIdx} className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-bold text-slate-800">FLIGHT #{fIdx + 1} ({fl.code || 'PIA'})</span>
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
                                    <div className="grid">
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">CODE</label>
                                        <input
                                          type="text"
                                          value={fl.code || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], code: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          className="font-extrabold w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">AIRLINE NAME</label>
                                        <input
                                          type="text"
                                          value={fl.name || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], name: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">PRICE (CAD)</label>
                                        <input
                                          type="text"
                                          value={fl.price || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], price: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          className="font-extrabold w-full text-[#004B39]"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid">
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">FROM CODE</label>
                                        <input
                                          type="text"
                                          value={fl.originCode || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], originCode: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">FROM CITY</label>
                                        <input
                                          type="text"
                                          value={fl.originCity || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], originCity: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">TO CODE</label>
                                        <input
                                          type="text"
                                          value={fl.destCode || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], destCode: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">TO CITY</label>
                                        <input
                                          type="text"
                                          value={fl.destCity || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], destCity: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">FLIGHT TIME</label>
                                        <input
                                          type="text"
                                          value={fl.time || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], time: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">OPERATED BY</label>
                                        <input
                                          type="text"
                                          value={fl.operatedBy || ''}
                                          onChange={(e) => {
                                            const currentFlights = [...sec.data?.items];
                                            currentFlights[fIdx] = { ...currentFlights[fIdx], operatedBy: e.target.value };
                                            updateSectionData(sec.id, 'items', currentFlights);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Airlines Marquee' || sec.type === 'Partners Marquee' || sec.type === 'Logo Carousel' || sec.type === 'Airlines Logo Carousel') && (
                              <div className="flex flex-col bg-white">
                                <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
                                  ✈️ Airlines Logo Carousel & Partners Manager
                                </span>
                                <div className="grid grid-cols-4 gap-8">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">EYEBROW TEXT</label>
                                    <input
                                      type="text"
                                      value={sec.data?.eyebrow || 'OUR TRUSTED PARTNERS'}
                                      onChange={(e) => updateSectionData(sec.id, 'eyebrow', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">SECTION TITLE</label>
                                    <input
                                      type="text"
                                      value={sec.data?.title || 'Airlines We Sourced Deals From'}
                                      onChange={(e) => updateSectionData(sec.id, 'title', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">CAROUSEL SPEED (MS)</label>
                                    <input
                                      type="number"
                                      step="1000"
                                      placeholder="35000"
                                      value={sec.data?.speedMs !== undefined ? sec.data.speedMs : 35000}
                                      onChange={(e) => updateSectionData(sec.id, 'speedMs', Number(e.target.value))}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">SCROLL DIRECTION</label>
                                    <select
                                      value={sec.data?.direction || 'left'}
                                      onChange={(e) => updateSectionData(sec.id, 'direction', e.target.value)}
                                      className="w-full bg-white"
                                    >
                                      <option value="left">⬅️ Left</option>
                                      <option value="right">➡️ Right</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Multi Logo Uploader & Draggable Grid */}
                                <div className="flex flex-col bg-slate-50">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-800">
                                      🖼️ Upload & Manage Logos (Drag to reorder)
                                    </span>
                                    <div className="flex gap-8">
                                      <label className="flex items-center font-bold cursor-pointer text-white bg-[#004B39]">
                                        <Upload className="w-3.5 h-3.5" /> Upload Multiple Logos
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          className="hidden"
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

                                            (async () => {
                                              for (const file of files) {
                                                const url = await uploadFileToFtp(file, 'logos');
                                                if (url) {
                                                  currentLogos.push({ src: url, alt: file.name.replace(/\.[^/.]+$/, "") });
                                                  updateSectionData(sec.id, 'logos', [...currentLogos]);
                                                }
                                              }
                                            })();
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
                                        className="font-bold cursor-pointer text-slate-900"
                                      >
                                        + Add Logo URL
                                      </button>
                                    </div>
                                  </div>

                                  {/* Logo Cards Grid */}
                                  <div className="grid">
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
                                        className="flex flex-col relative bg-white"
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs font-bold text-slate-800">
                                            ⋮⋮ Logo #{lIdx + 1}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = allLogos.filter((_, i) => i !== lIdx);
                                              updateSectionData(sec.id, 'logos', updated);
                                            }}
                                            className="flex items-center justify-center cursor-pointer"
                                            title="Remove logo"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>

                                        {/* Logo Image Preview */}
                                        <div className="flex items-center justify-center bg-slate-50">
                                          {logoItem.src ? (
                                            <img src={logoItem.src} alt={logoItem.alt || 'Logo'} className="object-contain" />
                                          ) : (
                                            <span className="text-xs text-slate-500">No Image Preview</span>
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
                                          className="w-full"
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
                                          className="w-full"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Certifications Flip Cards' || sec.type === 'Our Certifications') && (
                              <div className="flex flex-col bg-white">
                                <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
                                  🏅 Certifications 3D Flip Cards Manager
                                </span>
                                <div className="grid grid-cols-3 gap-8">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">EYEBROW TEXT</label>
                                    <input
                                      type="text"
                                      value={sec.data?.eyebrow || 'WHY THEY MATTER'}
                                      onChange={(e) => updateSectionData(sec.id, 'eyebrow', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">SECTION TITLE</label>
                                    <input
                                      type="text"
                                      value={sec.data?.title || 'OUR CERTIFICATIONS'}
                                      onChange={(e) => updateSectionData(sec.id, 'title', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                </div>

                                {/* Background Image Upload & Preview Row */}
                                <div className="flex flex-col bg-slate-50">
                                  <label className="block font-extrabold uppercase">
                                    SECTION BACKGROUND IMAGE & PREVIEW
                                  </label>
                                  <div className="grid items-center">
                                    {/* Image Live Preview */}
                                    <div className="flex items-center justify-center relative">
                                      {sec.data?.bgImage ? (
                                        <img src={sec.data.bgImage} alt="Background preview" className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-xs text-slate-500">No Image Loaded</span>
                                      )}
                                      <span className="font-bold absolute text-white">
                                        Preview
                                      </span>
                                    </div>

                                    {/* Upload Button + File Input */}
                                    <div className="flex flex-col gap-6">
                                      <div className="flex gap-2 items-center">
                                        <input
                                          type="text"
                                          placeholder="Background Image Path / URL or Uploaded Base64"
                                          value={sec.data?.bgImage || 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1920&q=80'}
                                          onChange={(e) => updateSectionData(sec.id, 'bgImage', e.target.value)}
                                          className="font-sans"
                                        />
                                        <label className="flex items-center font-bold cursor-pointer text-white bg-[#004B39]">
                                          <Upload className="w-3.5 h-3.5" /> Upload Image
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'backgrounds');
                      if (url) updateSectionData(sec.id, 'bgImage', url);
                    }
                  }}
                                          />
                                        </label>
                                      </div>
                                      <span className="text-xs text-slate-500">Upload custom background image (JPG, PNG, WebP) for the certification cards section</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Certification Flip Cards Editor List with Drag-and-Drop & Preview */}
                                <div className="flex flex-col bg-slate-50">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-800">
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
                                      className="font-bold cursor-pointer text-white bg-[#004B39]"
                                    >
                                      + Add Certification Card
                                    </button>
                                  </div>

                                  <div className="grid">
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
                                        className="flex flex-col bg-white"
                                      >
                                        {/* Card Top Drag Handle & Delete Button */}
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs font-bold text-slate-800" title="Drag to reorder card">
                                            ⋮⋮ Card #{cIdx + 1}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = allCards.filter((_, i) => i !== cIdx);
                                              updateSectionData(sec.id, 'items', updated);
                                            }}
                                            className="flex items-center justify-center cursor-pointer"
                                            title="Remove card"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>

                                        {/* Logo Image Live Thumbnail Preview */}
                                        <div className="flex items-center justify-center bg-slate-50">
                                          {item.logo ? (
                                            <img src={item.logo} alt={item.title || 'Logo'} className="object-contain" />
                                          ) : (
                                            <span className="text-xs text-slate-500">No Logo Preview</span>
                                          )}
                                        </div>

                                        {/* Logo Upload & Image URL Input */}
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">LOGO IMAGE FILE / URL</label>
                                          <div className="flex items-center gap-6">
                                            <input
                                              type="text"
                                              placeholder="/img/tico-logo.png or Base64"
                                              value={item.logo || ''}
                                              onChange={(e) => {
                                                const current = [...allCards];
                                                current[cIdx] = { ...current[cIdx], logo: e.target.value };
                                                updateSectionData(sec.id, 'items', current);
                                              }}
                                              className="font-sans"
                                            />
                                            <label className="font-bold cursor-pointer text-white bg-[#004B39]">
                                              Upload
                                              <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'uploads');
                      if (url) updateSectionData(sec.id, 'image', url);
                    }
                  }}
                                              />
                                            </label>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">BACKSIDE TITLE</label>
                                          <input
                                            type="text"
                                            value={item.title || ''}
                                            onChange={(e) => {
                                              const current = [...allCards];
                                              current[cIdx] = { ...current[cIdx], title: e.target.value };
                                              updateSectionData(sec.id, 'items', current);
                                            }}
                                            className="w-full"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">BACKSIDE DESCRIPTION</label>
                                          <textarea
                                            rows={2}
                                            value={item.description || ''}
                                            onChange={(e) => {
                                              const current = [...allCards];
                                              current[cIdx] = { ...current[cIdx], description: e.target.value };
                                              updateSectionData(sec.id, 'items', current);
                                            }}
                                            className="w-full"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Flight Assistance CTA' || sec.type === 'Flight Desk CTA') && (
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 mt-1">
                                <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
                                  📞 Flight Booking Assistance CTA Banner Manager
                                </span>
                                <div className="grid grid-cols-2 gap-8">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">BUTTON LABEL</label>
                                    <input
                                      type="text"
                                      value={sec.data?.btnLabel || 'Contact Flight Desk'}
                                      onChange={(e) => updateSectionData(sec.id, 'btnLabel', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">BUTTON LINK</label>
                                    <input
                                      type="text"
                                      value={sec.data?.btnLink || '/contact'}
                                      onChange={(e) => updateSectionData(sec.id, 'btnLink', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Contact Info Cards' || sec.type === 'Contact Bar') && (
                              <div className="flex flex-col bg-slate-50">
                                <span className="text-xs font-bold text-slate-800">
                                  📍 Contact Info Cards & Locations Manager
                                </span>

                                <div className="grid">
                                  {/* Card 1: Locations Box */}
                                  <div className="flex flex-col bg-white">
                                    <div className="flex items-center gap-8">
                                      <div className="flex items-center justify-center text-[#004B39]">
                                        <i className="fa-solid fa-location-dot text-xs"></i>
                                      </div>
                                      <span className="text-xs font-bold text-slate-800">Card 1: Locations Info</span>
                                    </div>

                                    <div className="grid">
                                      <div>
                                        <label className="block font-bold text-[#004B39]">CARD TITLE</label>
                                        <input
                                          type="text"
                                          value={sec.data?.card1Title || 'OUR LOCATIONS'}
                                          onChange={(e) => updateSectionData(sec.id, 'card1Title', e.target.value)}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-bold"
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-8">
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">HEAD OFFICE ADDRESS</label>
                                          <input
                                            type="text"
                                            value={sec.data?.headAddress || '1325 Eglinton Ave E Ste 218, Mississauga, ON L4W 4L9, Canada'}
                                            onChange={(e) => updateSectionData(sec.id, 'headAddress', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">BRANCH OFFICE ADDRESS</label>
                                          <input
                                            type="text"
                                            value={sec.data?.branchAddress || '22 Ontario St S, Milton, ON L9T 2M6, Canada'}
                                            onChange={(e) => updateSectionData(sec.id, 'branchAddress', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card 2: Support Box */}
                                  <div className="flex flex-col bg-white">
                                    <div className="flex items-center gap-8">
                                      <div className="flex items-center justify-center text-[#004B39]">
                                        <i className="fa-solid fa-phone text-xs"></i>
                                      </div>
                                      <span className="text-xs font-bold text-slate-800">Card 2: 24/7 Phone Support</span>
                                    </div>

                                    <div className="grid">
                                      <div>
                                        <label className="block font-bold text-[#004B39]">CARD TITLE</label>
                                        <input
                                          type="text"
                                          value={sec.data?.card2Title || '24/7 SUPPORT'}
                                          onChange={(e) => updateSectionData(sec.id, 'card2Title', e.target.value)}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-bold"
                                        />
                                      </div>
                                      <div className="grid grid-cols-3 gap-8">
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">SUPPORT PHONE 1</label>
                                          <input
                                            type="text"
                                            value={sec.data?.phone1 || '+1 800-844-5464'}
                                            onChange={(e) => updateSectionData(sec.id, 'phone1', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">SUPPORT PHONE 2</label>
                                          <input
                                            type="text"
                                            value={sec.data?.phone2 || '+1 905-624-8555'}
                                            onChange={(e) => updateSectionData(sec.id, 'phone2', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate-500 mb-0.5">SUPPORT PHONE 3</label>
                                          <input
                                            type="text"
                                            value={sec.data?.phone3 || '+1 905-624-8344'}
                                            onChange={(e) => updateSectionData(sec.id, 'phone3', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card 3: Email Box */}
                                  <div className="flex flex-col bg-white">
                                    <div className="flex items-center gap-8">
                                      <div className="flex items-center justify-center text-[#004B39]">
                                        <i className="fa-solid fa-envelope text-xs"></i>
                                      </div>
                                      <span className="text-xs font-bold text-slate-800">Card 3: Email & Socials</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                      <div>
                                        <label className="block font-bold text-[#004B39]">CARD TITLE</label>
                                        <input
                                          type="text"
                                          value={sec.data?.card3Title || 'EMAIL US'}
                                          onChange={(e) => updateSectionData(sec.id, 'card3Title', e.target.value)}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px] font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">EMAIL ADDRESS</label>
                                        <input
                                          type="text"
                                          value={sec.data?.email || 'info@kingtravelcan.com'}
                                          onChange={(e) => updateSectionData(sec.id, 'email', e.target.value)}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                    </div>

                                    <div className="font-sans">
                                      <label className="block font-extrabold uppercase text-[#004B39]">
                                        📱 Social Media Links (Opens in New Tab)
                                      </label>
                                      <div className="grid grid-cols-2 gap-8">
                                        <div>
                                          <label className="flex items-center gap-4">
                                            <i className="fa-brands fa-facebook-f"></i> FACEBOOK URL
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.data?.facebookUrl !== undefined ? sec.data.facebookUrl : 'https://www.facebook.com/kingtravelcan'}
                                            onChange={(e) => updateSectionData(sec.id, 'facebookUrl', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                          />
                                        </div>
                                        <div>
                                          <label className="flex items-center gap-4">
                                            <i className="fa-brands fa-instagram"></i> INSTAGRAM URL
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.data?.instagramUrl !== undefined ? sec.data.instagramUrl : 'https://www.instagram.com/kingtravelcan/'}
                                            onChange={(e) => updateSectionData(sec.id, 'instagramUrl', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                          />
                                        </div>
                                        <div>
                                          <label className="flex items-center gap-4">
                                            <i className="fa-brands fa-linkedin-in"></i> LINKEDIN URL
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.data?.linkedinUrl !== undefined ? sec.data.linkedinUrl : 'https://ca.linkedin.com/company/kingtravelcan'}
                                            onChange={(e) => updateSectionData(sec.id, 'linkedinUrl', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                          />
                                        </div>
                                        <div>
                                          <label className="flex items-center gap-4">
                                            <i className="fa-brands fa-tiktok"></i> TIKTOK URL
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.data?.tiktokUrl !== undefined ? sec.data.tiktokUrl : 'https://www.tiktok.com/@kingtravelcan'}
                                            onChange={(e) => updateSectionData(sec.id, 'tiktokUrl', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Contact Form') && (
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 mt-1">
                                <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
                                  ✉️ Interactive Contact Form Manager
                                </span>
                                <div className="grid grid-cols-2 gap-8">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">FORM TITLE</label>
                                    <input
                                      type="text"
                                      value={sec.data?.title || 'Drop Us A Message'}
                                      onChange={(e) => updateSectionData(sec.id, 'title', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">FORM SUBTITLE</label>
                                    <input
                                      type="text"
                                      value={sec.data?.subtitle || "Fill out the form below and we'll get back to you shortly."}
                                      onChange={(e) => updateSectionData(sec.id, 'subtitle', e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Contact Maps' || sec.type === 'Google Maps') && (
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 mt-1">
                                <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
                                  🗺️ Dual Office Google Maps Manager
                                </span>
                                <div className="grid grid-cols-2 gap-12">
                                  {/* Head Office Map Controls */}
                                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 flex flex-col gap-2">
                                    <span className="text-xs font-bold text-slate-800">📍 Head Office Location</span>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">LOCATION TITLE</label>
                                      <input
                                        type="text"
                                        value={sec.data?.headTitle || 'Head Office'}
                                        onChange={(e) => updateSectionData(sec.id, 'headTitle', e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">LOCATION ADDRESS</label>
                                      <input
                                        type="text"
                                        value={sec.data?.headAddress || '1325 Eglinton Ave E Ste 218, Mississauga, ON L4W 4L9, Canada'}
                                        onChange={(e) => updateSectionData(sec.id, 'headAddress', e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">HEAD MAP EMBED URL</label>
                                      <input
                                        type="text"
                                        value={sec.data?.headMapUrl || ''}
                                        placeholder="https://www.google.com/maps/embed?..."
                                        onChange={(e) => updateSectionData(sec.id, 'headMapUrl', e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                      />
                                    </div>
                                  </div>

                                  {/* Branch Office Map Controls */}
                                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 flex flex-col gap-2">
                                    <span className="text-xs font-bold text-slate-800">📍 Branch Office Location</span>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">LOCATION TITLE</label>
                                      <input
                                        type="text"
                                        value={sec.data?.branchTitle || 'Branch Office'}
                                        onChange={(e) => updateSectionData(sec.id, 'branchTitle', e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">LOCATION ADDRESS</label>
                                      <input
                                        type="text"
                                        value={sec.data?.branchAddress || '22 Ontario St S, Milton, ON L9T 2M6, Canada'}
                                        onChange={(e) => updateSectionData(sec.id, 'branchAddress', e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">BRANCH MAP EMBED URL</label>
                                      <input
                                        type="text"
                                        value={sec.data?.branchMapUrl || ''}
                                        placeholder="https://www.google.com/maps/embed?..."
                                        onChange={(e) => updateSectionData(sec.id, 'branchMapUrl', e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {(sec.type === 'Hajj Packages Grid' || sec.type === 'Hajj Cards') && (
                              <div className="flex flex-col bg-white">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-slate-800">
                                    DYNAMIC HAJJ PACKAGES CARDS MANAGER (HAJJ 2027 STYLE)
                                  </span>
                                  <button
                                    onClick={() => {
                                      const currentPkgs = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [])];
                                      currentPkgs.push({
                                        id: `hajj-${Date.now()}`,
                                        title: `Economy Hajj Package 2027`,
                                        badgeTag: "HAJJ 2027",
                                        duration: "14Days",
                                        flightRoute: "FROM CANADA ➔ TO SAUDIA",
                                        heroImage: "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg",
                                        price: "12,995",
                                        priceSubtext: "FROM CAD / QUAD OCCUPANCY",
                                        operatorName: "King Travel",
                                        operatorRating: "4.4/5",
                                        btnLabel: "Book Hajj 2027",
                                        btnLink: "/contact",
                                        makkahHotel: {
                                          name: "5 Star Hotel in Makkah",
                                          location: "Near to Haram",
                                          badge: "Breakfast",
                                          nights: "6 Nights",
                                          image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg"
                                        },
                                        madinahHotel: {
                                          name: "5 Star Hotel in Madinah",
                                          location: "Near to Masjid Nabawi",
                                          badge: "Breakfast",
                                          nights: "6 Nights",
                                          image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg"
                                        }
                                      });
                                      updateSectionData(sec.id, 'items', currentPkgs);
                                    }}
                                    className="font-extrabold cursor-pointer"
                                  >
                                    + Add New Hajj Package Card
                                  </button>
                                </div>

                                {((sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                                  {
                                    id: "hajj-1",
                                    title: "Economy Hajj Package 2027",
                                    badgeTag: "HAJJ 2027",
                                    duration: "14Days",
                                    flightRoute: "FROM CANADA ➔ TO SAUDIA",
                                    heroImage: "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg",
                                    price: "12,995",
                                    priceSubtext: "FROM CAD / QUAD OCCUPANCY",
                                    operatorName: "King Travel",
                                    operatorRating: "4.4/5",
                                    btnLabel: "Book Hajj 2027",
                                    btnLink: "/contact",
                                    makkahHotel: {
                                      name: "5 Star Hotel in Makkah",
                                      location: "Near to Haram",
                                      badge: "Breakfast",
                                      nights: "6 Nights",
                                      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg"
                                    },
                                    madinahHotel: {
                                      name: "5 Star Hotel in Madinah",
                                      location: "Near to Masjid Nabawi",
                                      badge: "Breakfast",
                                      nights: "6 Nights",
                                      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg"
                                    }
                                  }
                                ]).map((pkg: any, pIdx: number, allPkgs: any[]) => (
                                  <div key={pkg.id || pIdx} className="flex flex-col relative">
                                    {/* Card Top Title & Remove Button */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-800">
                                        HAJJ PACKAGE CARD #{pIdx + 1}: {pkg.title || 'Untitled Package'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const pkgs = [...allPkgs];
                                          pkgs.splice(pIdx, 1);
                                          updateSectionData(sec.id, 'items', pkgs);
                                        }}
                                        className="border-0 bg-red-100 text-red-600 rounded px-2 py-1 text-xs cursor-pointer hover:bg-red-200 transition-colors flex items-center gap-1 font-bold"
                                        title="Remove Card"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" /> Remove Package
                                      </button>
                                    </div>

                                    {/* Section 1: Hero Featured Image & Top Meta (Header Block) */}
                                    <div className="grid items-center bg-white">
                                      {/* Hero Image Thumbnail with Overlay 'X' Badge */}
                                      <div className="relative">
                                        {pkg.heroImage ? (
                                          <>
                                            <img src={pkg.heroImage} alt="Hero" className="w-full h-full object-cover" />
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], heroImage: '' };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="flex items-center justify-center cursor-pointer absolute"
                                              title="Remove Hero Image"
                                            >
                                              ✕
                                            </button>
                                          </>
                                        ) : (
                                          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-[#004B39]">
                                            <Upload className="w-4 h-4" />
                                            <span className="font-bold">Upload Hero</span>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'uploads');
                      if (url) updateSectionData(sec.id, 'image', url);
                    }
                  }}
                                            />
                                          </label>
                                        )}
                                      </div>

                                      {/* Right Column: Title & Header Badges Grid */}
                                      <div className="flex flex-col gap-8">
                                        <div className="grid">
                                          <div>
                                            <label className="block text-[9px] font-bold text-slate-500 mb-0.5">PACKAGE TITLE</label>
                                            <input
                                              type="text"
                                              value={pkg.title || ''}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], title: e.target.value };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[9px] font-bold text-slate-500 mb-0.5">TOP LEFT BADGE</label>
                                            <input
                                              type="text"
                                              value={pkg.badgeTag || 'HAJJ 2027'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], badgeTag: e.target.value };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-[1fr_2fr] gap-2">
                                          <div>
                                            <label className="block text-[9px] font-bold text-slate-500 mb-0.5">DURATION BADGE</label>
                                            <input
                                              type="text"
                                              value={pkg.duration || '14Days'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], duration: e.target.value };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[9px] font-bold text-slate-500 mb-0.5">FLIGHT ROUTE TAGLINE</label>
                                            <input
                                              type="text"
                                              value={pkg.flightRoute || 'FROM CANADA ➔ TO SAUDIA'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], flightRoute: e.target.value };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Section 2: Side-by-Side Accommodations Grid (Makkah & Madinah) */}
                                    <div className="grid grid-cols-2 gap-12">
                                      {/* Makkah Accommodation Box */}
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-800">
                                          🏨 Makkah Hotel & Details
                                        </span>

                                        <div className="grid items-center">
                                          {/* Makkah Image Thumbnail with Overlay 'X' */}
                                          <div className="relative">
                                            {pkg.makkahHotel?.image ? (
                                              <>
                                                <img src={pkg.makkahHotel.image} alt="Makkah Hotel" className="w-full h-full object-cover" />
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const pkgs = [...allPkgs];
                                                    pkgs[pIdx] = { ...pkgs[pIdx], makkahHotel: { ...(pkgs[pIdx].makkahHotel || {}), image: '' } };
                                                    updateSectionData(sec.id, 'items', pkgs);
                                                  }}
                                                  className="flex items-center justify-center cursor-pointer absolute"
                                                  title="Remove Makkah Image"
                                                >
                                                  ✕
                                                </button>
                                              </>
                                            ) : (
                                              <label className="flex items-center justify-center w-full h-full cursor-pointer bg-white">
                                                <Upload className="w-3 h-3" />
                                                <input
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'uploads');
                      if (url) updateSectionData(sec.id, 'image', url);
                    }
                  }}
                                                />
                                              </label>
                                            )}
                                          </div>

                                          <label className="flex items-center justify-center font-bold cursor-pointer text-white">
                                            <Upload className="w-3 h-3" /> Upload Photo
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'uploads');
                      if (url) updateSectionData(sec.id, 'image', url);
                    }
                  }}
                                            />
                                          </label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                          <div>
                                            <label className="block font-bold text-slate-500">MAKKAH HOTEL NAME</label>
                                            <input
                                              type="text"
                                              value={pkg.makkahHotel?.name || '5 Star Hotel in Makkah'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], makkahHotel: { ...(pkgs[pIdx].makkahHotel || {}), name: e.target.value } };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                          <div>
                                            <label className="block font-bold text-slate-500">LOCATION SUBTEXT</label>
                                            <input
                                              type="text"
                                              value={pkg.makkahHotel?.location || 'Near to Haram'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], makkahHotel: { ...(pkgs[pIdx].makkahHotel || {}), location: e.target.value } };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                          <div>
                                            <label className="block font-bold text-slate-500">MEAL BADGE</label>
                                            <input
                                              type="text"
                                              value={pkg.makkahHotel?.badge || 'Breakfast'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], makkahHotel: { ...(pkgs[pIdx].makkahHotel || {}), badge: e.target.value } };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                          <div>
                                            <label className="block font-bold text-slate-500">DAY/NIGHTS BADGE</label>
                                            <input
                                              type="text"
                                              value={pkg.makkahHotel?.nights || '6 Nights'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], makkahHotel: { ...(pkgs[pIdx].makkahHotel || {}), nights: e.target.value } };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Madinah Accommodation Box */}
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-800">
                                          🕌 Madinah Hotel & Details
                                        </span>

                                        <div className="grid items-center">
                                          {/* Madinah Image Thumbnail with Overlay 'X' */}
                                          <div className="relative">
                                            {pkg.madinahHotel?.image ? (
                                              <>
                                                <img src={pkg.madinahHotel.image} alt="Madinah Hotel" className="w-full h-full object-cover" />
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const pkgs = [...allPkgs];
                                                    pkgs[pIdx] = { ...pkgs[pIdx], madinahHotel: { ...(pkgs[pIdx].madinahHotel || {}), image: '' } };
                                                    updateSectionData(sec.id, 'items', pkgs);
                                                  }}
                                                  className="flex items-center justify-center cursor-pointer absolute"
                                                  title="Remove Madinah Image"
                                                >
                                                  ✕
                                                </button>
                                              </>
                                            ) : (
                                              <label className="flex items-center justify-center w-full h-full cursor-pointer bg-white">
                                                <Upload className="w-3 h-3" />
                                                <input
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'uploads');
                      if (url) updateSectionData(sec.id, 'image', url);
                    }
                  }}
                                                />
                                              </label>
                                            )}
                                          </div>

                                          <label className="flex items-center justify-center font-bold cursor-pointer text-white">
                                            <Upload className="w-3 h-3" /> Upload Photo
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFileToFtp(file, 'uploads');
                      if (url) updateSectionData(sec.id, 'image', url);
                    }
                  }}
                                            />
                                          </label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                          <div>
                                            <label className="block font-bold text-slate-500">MADINAH HOTEL NAME</label>
                                            <input
                                              type="text"
                                              value={pkg.madinahHotel?.name || '5 Star Hotel in Madinah'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], madinahHotel: { ...(pkgs[pIdx].madinahHotel || {}), name: e.target.value } };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                          <div>
                                            <label className="block font-bold text-slate-500">LOCATION SUBTEXT</label>
                                            <input
                                              type="text"
                                              value={pkg.madinahHotel?.location || 'Near to Masjid Nabawi'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], madinahHotel: { ...(pkgs[pIdx].madinahHotel || {}), location: e.target.value } };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                          <div>
                                            <label className="block font-bold text-slate-500">MEAL BADGE</label>
                                            <input
                                              type="text"
                                              value={pkg.madinahHotel?.badge || 'Breakfast'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], madinahHotel: { ...(pkgs[pIdx].madinahHotel || {}), badge: e.target.value } };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                          <div>
                                            <label className="block font-bold text-slate-500">DAY/NIGHTS BADGE</label>
                                            <input
                                              type="text"
                                              value={pkg.madinahHotel?.nights || '6 Nights'}
                                              onChange={(e) => {
                                                const pkgs = [...allPkgs];
                                                pkgs[pIdx] = { ...pkgs[pIdx], madinahHotel: { ...(pkgs[pIdx].madinahHotel || {}), nights: e.target.value } };
                                                updateSectionData(sec.id, 'items', pkgs);
                                              }}
                                              className="w-full"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Section 3: Pricing & Operator Footer Row (6-Grid Row) */}
                                    <div className="grid bg-white">
                                      <div>
                                        <label className="block font-bold text-slate-500">OPERATOR</label>
                                        <input
                                          type="text"
                                          value={pkg.operatorName || 'King Travel'}
                                          onChange={(e) => {
                                            const pkgs = [...allPkgs];
                                            pkgs[pIdx] = { ...pkgs[pIdx], operatorName: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-bold text-slate-500">RATING</label>
                                        <input
                                          type="text"
                                          value={pkg.operatorRating || '4.4/5'}
                                          onChange={(e) => {
                                            const pkgs = [...allPkgs];
                                            pkgs[pIdx] = { ...pkgs[pIdx], operatorRating: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-bold text-slate-500">PRICE SUBTEXT</label>
                                        <input
                                          type="text"
                                          value={pkg.priceSubtext || 'FROM CAD / QUAD OCCUPANCY'}
                                          onChange={(e) => {
                                            const pkgs = [...allPkgs];
                                            pkgs[pIdx] = { ...pkgs[pIdx], priceSubtext: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-bold">PRICE (CAD)</label>
                                        <input
                                          type="text"
                                          value={pkg.price || ''}
                                          onChange={(e) => {
                                            const pkgs = [...allPkgs];
                                            pkgs[pIdx] = { ...pkgs[pIdx], price: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="font-extrabold w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-bold text-slate-500">BTN LABEL</label>
                                        <input
                                          type="text"
                                          value={pkg.btnLabel || 'Book Hajj 2027'}
                                          onChange={(e) => {
                                            const pkgs = [...allPkgs];
                                            pkgs[pIdx] = { ...pkgs[pIdx], btnLabel: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-bold text-slate-500">BTN LINK</label>
                                        <input
                                          type="text"
                                          value={pkg.btnLink || '/contact'}
                                          onChange={(e) => {
                                            const pkgs = [...allPkgs];
                                            pkgs[pIdx] = { ...pkgs[pIdx], btnLink: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="w-full"
                                        />
                                      </div>
                                    </div>

                                    {/* Section 4: Package Detail Page Popup Editor Button */}
                                    <button
                                      type="button"
                                      onClick={() => setActiveDetailPopupModal({ secId: sec.id, pIdx, pkg })}
                                      className="flex items-center justify-center font-extrabold w-full cursor-pointer"
                                    >
                                      <Settings className="w-4 h-4 text-[#DB9E30]" />
                                      <span>⚙️ MANAGE FULL PACKAGE DETAIL PAGE CONTENT (POPUP)</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(sec.type === 'Umrah Packages Grid' || sec.type === 'Packages Grid') && (
                              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 mt-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-extrabold text-[#004B39] uppercase">
                                    Dynamic Umrah Packages Cards Manager
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
                                    className="bg-[#004B39] text-white border-none rounded-md px-2.5 py-1 text-[11px] font-bold cursor-pointer"
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
                                  <div key={pkg.id || pIdx} className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 flex flex-col gap-2 relative">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-extrabold text-slate-500">PACKAGE CARD #{pIdx + 1}</span>
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
                                    <div className="grid">
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">PACKAGE TITLE</label>
                                        <input
                                          type="text"
                                          value={pkg.title || ''}
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], title: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">DURATION</label>
                                        <input
                                          type="text"
                                          value={pkg.duration || ''}
                                          placeholder="10, 15 Days"
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], duration: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">PRICE (CAD)</label>
                                        <input
                                          type="text"
                                          value={pkg.price || ''}
                                          placeholder="$7,499"
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], price: e.target.value };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="font-extrabold w-full text-[#004B39]"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">MAKKAH HOTEL</label>
                                        <input
                                          type="text"
                                          value={pkg.makkahHotel?.name || ''}
                                          placeholder="Hotel name..."
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], makkahHotel: { ...(pkgs[pIdx].makkahHotel || {}), name: e.target.value } };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">MADINAH HOTEL</label>
                                        <input
                                          type="text"
                                          value={pkg.madinahHotel?.name || ''}
                                          placeholder="Hotel name..."
                                          onChange={(e) => {
                                            const pkgs = [...sec.data?.items];
                                            pkgs[pIdx] = { ...pkgs[pIdx], madinahHotel: { ...(pkgs[pIdx].madinahHotel || {}), name: e.target.value } };
                                            updateSectionData(sec.id, 'items', pkgs);
                                          }}
                                          className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-[11px]"
                                        />
                                      </div>
                                    </div>

                                    {/* Section: Package Detail Page Popup Editor Button */}
                                    <button
                                      type="button"
                                      onClick={() => setActiveDetailPopupModal({ secId: sec.id, pIdx, pkg })}
                                      className="flex items-center justify-center font-extrabold w-full cursor-pointer"
                                    >
                                      <Settings className="w-4 h-4 text-[#DB9E30]" />
                                      <span>⚙️ MANAGE FULL PACKAGE DETAIL PAGE CONTENT (POPUP)</span>
                                    </button>
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
                    className="w-full"
                  />
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="flex flex-col gap-16">
                  <div>
                    <label className="block font-extrabold text-slate-500">META TITLE</label>
                    <input type="text" value={metaTitle || ''} onChange={(e) => setMetaTitle(e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <label className="block font-extrabold text-slate-500">META DESCRIPTION</label>
                    <textarea rows={3} value={metaDescription || ''} onChange={(e) => setMetaDescription(e.target.value)} className="w-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Status Settings */}
        <div className="flex flex-col gap-5">
          {/* Status & Visibility Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">PAGE STATUS</span>
                <span className="text-[11px] text-slate-500">Visibility on live website</span>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:border-[#004B39] cursor-pointer shadow-2xs"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Show in menu</span>
                <span className="text-[11px] text-slate-500 font-medium">Include link in site header nav</span>
              </div>
              <Field orientation="horizontal">
                <Switch id="switch-show-in-menu" checked={showInMenu} onChange={setShowInMenu} />
              </Field>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>⏱</span>
              <span>Auto-saves draft state dynamically</span>
            </div>
          </div>
        </div>

      </div>
      <ConfirmModal config={confirmConfig} onClose={() => setConfirmConfig(null)} />
      <AdminPackageDetailModal
        isOpen={!!activeDetailPopupModal}
        onClose={() => setActiveDetailPopupModal(null)}
        pkg={activeDetailPopupModal?.pkg}
        onSave={(updatedPkg) => {
          if (!activeDetailPopupModal) return;
          const { secId, pIdx } = activeDetailPopupModal;
          const sec = sections.find((s) => s.id === secId);
          if (sec) {
            const pkgs = [...((sec.data?.items && Array.isArray(sec.data.items)) ? sec.data.items : [])];
            pkgs[pIdx] = updatedPkg;
            updateSectionData(secId, 'items', pkgs);
          }
        }}
      />
      <SeoCenterModal
        isOpen={seoModalOpen}
        onClose={() => setSeoModalOpen(false)}
        pageData={{
          id: pageId || 1,
          title: title || 'Page',
          slug: slug || '/',
          metaTitle,
          metaDescription,
          bannerBgImage,
          sections,
        }}
        onSaveSuccess={() => {
          if (pageId) {
            getPageById(pageId).then((p) => {
              if (p) {
                if (p.metaTitle) setMetaTitle(p.metaTitle);
                if (p.metaDescription) setMetaDescription(p.metaDescription);
              }
            });
          }
        }}
      />
    </div>
  );
}

export default function PageBuilderPage() {
  return (
    <AdminLayout user={{ name: 'Admin', role: 'super_admin' }}>
      <Suspense fallback={<div className="font-sans">Loading Page Editor...</div>}>
        <PageBuilderContent />
      </Suspense>
    </AdminLayout>
  );
}
