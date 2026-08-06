"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MarqueeTrack from "@/components/MarqueeTrack";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { getPageBySlug } from "@/actions/pageActions";
import { submitQuoteEnquiryAction, submitContactEnquiryAction } from "@/actions/enquiryActions";
import PageSeoHead from "@/components/PageSeoHead";
import SubmissionSuccessModal from "@/components/SubmissionSuccessModal";
import DynamicIcon from "@/components/ui/DynamicIcon";
import * as LucideIcons from "lucide-react";



export default function Home() {
  const [heroData, setHeroData] = useState({
    heroEyebrow: "",
    title: "",
    description: "",
    primaryBtnLabel: "",
    primaryBtnLink: "",
    secondaryBtnLabel: "",
    secondaryBtnLink: "",
    badge1Top: "",
    badge1Sub: "",
    badge2Top: "",
    badge2Sub: "",
    bgImage: "",
    position: "center center",
    size: "cover",
  });

  const [homeSeo, setHomeSeo] = useState<any>(null);
  const [dynamicSections, setDynamicSections] = useState<any[]>([]);

  useEffect(() => {
    getPageBySlug("/").then((p) => {
      if (p) {
        if (p.seoData) setHomeSeo(p.seoData);
        if (p.sections) {
          try {
            const parsed = typeof p.sections === 'string' ? JSON.parse(p.sections) : p.sections;
            if (Array.isArray(parsed) && parsed.length > 0) {
              setDynamicSections(parsed);
            }
            const foundHero = parsed.find(
              (s: any) => s.type === "Homepage Hero Banner" || s.type === "Hero Slider"
            );
            if (foundHero && foundHero.data) {
              const secData = foundHero.data;
              setHeroData({
                heroEyebrow: secData.heroEyebrow || "",
                title: p.bannerTitle || secData.title || "",
                description: p.bannerDescription || secData.description || "",
                primaryBtnLabel: secData.primaryBtnLabel || "",
                primaryBtnLink: secData.primaryBtnLink || "",
                secondaryBtnLabel: secData.secondaryBtnLabel || "",
                secondaryBtnLink: secData.secondaryBtnLink || "",
                badge1Top: secData.badge1Top || "",
                badge1Sub: secData.badge1Sub || "",
                badge2Top: secData.badge2Top || "",
                badge2Sub: secData.badge2Sub || "",
                bgImage: p.bannerBgImage || secData.bannerBgImage || "",
                position: p.bannerPosition || secData.bannerPosition || "center center",
                size: p.bannerSize || secData.bannerSize || "cover",
              });
            }
          } catch { }
        }
      }
    });
  }, []);

  const [quoteForm, setQuoteForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    packageType: "Select your package",
    departureDate: "",
    adults: 1,
  });
  const [quoteStatus, setQuoteStatus] = useState<string | null>(null);
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({});

  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    packageType: "Select Package",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalRef, setModalRef] = useState("");

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!quoteForm.fullName.trim()) newErrors.fullName = "Please fill out this field.";
    if (!quoteForm.phone.trim()) newErrors.phone = "Please fill out this field.";
    if (!quoteForm.email.trim()) {
      newErrors.email = "Please fill out this field.";
    } else if (!/\S+@\S+\.\S+/.test(quoteForm.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setQuoteErrors(newErrors);
      return;
    }

    setQuoteErrors({});
    setQuoteStatus("Submitting to database...");
    try {
      const res = await submitQuoteEnquiryAction({
        fullName: quoteForm.fullName,
        phone: quoteForm.phone,
        email: quoteForm.email,
        packageType: quoteForm.packageType,
        departureDate: quoteForm.departureDate,
        adults: quoteForm.adults,
      });

      if (res.success) {
        const msg = res.message || "Thank you! Your quote request has been received. Our team will contact you shortly.";
        setModalMsg(msg);
        if (res.enquiryNumber) setModalRef(res.enquiryNumber);
        setModalOpen(true);
        setQuoteStatus(null);
        setQuoteForm({
          fullName: "",
          phone: "",
          email: "",
          packageType: "Select your package",
          departureDate: "",
          adults: 1,
        });
      } else {
        setQuoteStatus(res.error || "Submission failed.");
      }
    } catch {
      setQuoteStatus("Failed to submit request.");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!contactForm.fullName.trim()) newErrors.fullName = "Please fill out this field.";
    if (!contactForm.email.trim()) {
      newErrors.email = "Please fill out this field.";
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setContactErrors(newErrors);
      return;
    }

    setContactErrors({});
    setContactStatus("Sending message to database...");
    try {
      const res = await submitContactEnquiryAction({
        fullName: contactForm.fullName,
        email: contactForm.email,
        phone: contactForm.phone,
        packageType: contactForm.packageType,
        message: contactForm.message,
      });

      if (res.success) {
        const msg = res.message || "Thank you! Your message has been received. Our team will contact you shortly.";
        setModalMsg(msg);
        if (res.ticketNumber) setModalRef(res.ticketNumber);
        setModalOpen(true);
        setContactStatus(null);
        setContactForm({
          fullName: "",
          email: "",
          phone: "",
          packageType: "Select Package",
          message: "",
        });
      } else {
        setContactStatus(res.error || "Submission failed.");
      }
    } catch {
      setContactStatus("Failed to send message.");
    }
  };

  return (
    <main>
      <PageSeoHead pageTitle="Home" seoData={homeSeo} />
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-inner">
          <div
            ref={(el) => {
              if (el) {
                const bg = (heroData.bgImage || '/img/hero.png').replace(/"/g, "'");
                el.style.backgroundImage = `linear-gradient(100deg, rgba(10, 20, 18, .92) 0%, rgba(10, 20, 18, .72) 38%, rgba(10, 20, 18, .15) 68%), url("${bg}")`;
                el.style.backgroundPosition = heroData.position || 'center center';
                el.style.backgroundSize = heroData.size || 'cover';
                el.style.backgroundRepeat = 'no-repeat';
              }
            }}
            className="hero-media min-h-[640px]"
          >
            <div className="hero-pattern"></div>
            <div className="hero-content">
              <div className="eyebrow">{heroData.heroEyebrow}</div>
              <h1 dangerouslySetInnerHTML={{ __html: heroData.title }} />
              <p className="lead">{heroData.description}</p>
              <div className="hero-cta">
                <a className="btn" href={heroData.primaryBtnLink || '#packages'}>
                  {heroData.primaryBtnLabel || 'View Umrah Packages →'}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                <Link className="btn ghost-light" href={heroData.secondaryBtnLink || '/contact'}>
                  {heroData.secondaryBtnLabel || 'Speak With an Advisor'}
                </Link>
              </div>
            </div>
            <div className="badges">
              <div className="float-badge badge-1">
                <div className="ico">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2 L14 9 L21 9 L15 13.5 L17 21 L12 16.5 L7 21 L9 13.5 L3 9 L10 9 Z"></path>
                  </svg>
                </div>
                <div>
                  <div className="n">{heroData.badge1Top}</div>
                  <div className="l">{heroData.badge1Sub}</div>
                </div>
              </div>
              <div className="float-badge badge-2">
                <div className="ico">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 21V10l9-6 9 6v11"></path>
                    <path d="M9 21v-7h6v7"></path>
                  </svg>
                </div>
                <div>
                  <div className="n">{heroData.badge2Top}</div>
                  <div className="l">{heroData.badge2Sub}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap">
          <div className="relative rounded-3xl shadow-xl bg-sage p-6 md:p-8 -mt-8 reveal">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#004B39] tracking-tight text-center mb-6">
              Get a free Quote
            </h2>
            {quoteStatus && <p className="text-center text-emerald-800 font-semibold mb-6">{quoteStatus}</p>}

            <form noValidate className="flex flex-col gap-4" onSubmit={handleQuoteSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="quote-fullName"
                    placeholder="Full Name"
                    value={quoteForm.fullName}
                    onChange={(e) => {
                      setQuoteForm({ ...quoteForm, fullName: e.target.value });
                      if (quoteErrors.fullName) setQuoteErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    className={`w-full border p-3 rounded-xl bg-white outline-none transition-colors duration-300 text-slate-900 text-sm font-medium ${quoteErrors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"
                      }`}
                  />
                  {quoteErrors.fullName && <span className="text-red-600 text-xs font-semibold mt-1 block">{quoteErrors.fullName}</span>}
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="quote-phone"
                    placeholder="+1(___) ___-____"
                    value={quoteForm.phone}
                    onChange={(e) => {
                      setQuoteForm({ ...quoteForm, phone: e.target.value });
                      if (quoteErrors.phone) setQuoteErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    className={`w-full border p-3 rounded-xl bg-white outline-none transition-colors duration-300 text-slate-900 text-sm font-medium ${quoteErrors.phone ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"
                      }`}
                  />
                  {quoteErrors.phone && <span className="text-red-600 text-xs font-semibold mt-1 block">{quoteErrors.phone}</span>}
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="quote-email"
                    placeholder="your@email.com"
                    value={quoteForm.email}
                    onChange={(e) => {
                      setQuoteForm({ ...quoteForm, email: e.target.value });
                      if (quoteErrors.email) setQuoteErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full border p-3 rounded-xl bg-white outline-none transition-colors duration-300 text-slate-900 text-sm font-medium ${quoteErrors.email ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"
                      }`}
                  />
                  {quoteErrors.email && <span className="text-red-600 text-xs font-semibold mt-1 block">{quoteErrors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Select Your Package
                  </label>
                  <select
                    value={quoteForm.packageType}
                    onChange={(e) => setQuoteForm({ ...quoteForm, packageType: e.target.value })}
                    className="w-full border border-slate-300 p-3 rounded-xl bg-white outline-none focus:border-emerald-800 transition-colors text-slate-900 text-sm font-medium"
                  >
                    <option>Select your package</option>
                    <option>Umrah Package</option>
                    <option>Hajj Package</option>
                    <option>Flight Only</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={quoteForm.departureDate}
                    onChange={(e) => setQuoteForm({ ...quoteForm, departureDate: e.target.value })}
                    className="w-full border border-slate-300 p-3 rounded-xl bg-white outline-none focus:border-emerald-800 transition-colors text-slate-900 text-sm font-medium"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Number of Adults
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quoteForm.adults}
                    onChange={(e) => setQuoteForm({ ...quoteForm, adults: parseInt(e.target.value, 10) || 1 })}
                    className="w-full border border-slate-300 p-3 rounded-xl bg-white outline-none focus:border-emerald-800 transition-colors text-slate-900 text-sm font-medium"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#DB9E30] text-[#004B39] font-extrabold py-3.5 px-6 rounded-xl shadow-md hover:bg-[#bfa030] hover:text-white active:scale-[0.99] transition-all duration-300 tracking-wider uppercase text-sm flex items-center justify-center cursor-pointer"
                  >
                    <span>SUBMIT</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= DYNAMIC SECTIONS ================= */}
      {dynamicSections.map((sec, secIndex) => {
        switch (sec.type) {
          case 'Hajj Packages':
            return (
              <div key={sec.id || secIndex}>
                <section className="py-6">
                  <div className="wrap">
                    <div className="section-head split reveal">
                      <div>
                        {sec.data?.eyebrow && <div className="eyebrow">{sec.data.eyebrow}</div>}
                        {sec.data?.title && <h2 dangerouslySetInnerHTML={{ __html: sec.data.title }} />}
                      </div>
                      {sec.data?.description && (
                        <p className="max-w-[480px]">{sec.data.description}</p>
                      )}
                    </div>
                    <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {(sec.data?.items || []).map((pkg: any, idx: number) => (
                        <article key={idx} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
                          <div className="relative h-64 overflow-hidden shrink-0">
                            {pkg.heroImage && (
                              <Image
                                src={pkg.heroImage}
                                alt={pkg.title || 'Hajj'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                width={700}
                                height={256}
                                unoptimized
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                            <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                              <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                                <i className="fa-solid fa-kaaba text-brand-gold"></i> {pkg.badge || 'HAJJ 2027'}
                              </span>
                              {pkg.duration && (
                                <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                                  <i className="fa-solid fa-calendar"></i> {pkg.duration}
                                </span>
                              )}
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1">
                                <i className="fa-solid fa-plane text-xs"></i>From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia
                              </span>
                              {pkg.title && <h2 className="text-xl font-bold text-white tracking-tight">{pkg.title}</h2>}
                            </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>

                              {pkg.makkahHotel && (
                                <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                    {pkg.makkahHotel.image && (
                                      <Image src={pkg.makkahHotel.image} alt="Makkah Hotel" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{pkg.makkahHotel.name || '5 Star Hotel in Makkah'}</h4>
                                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                      <i className="fa-solid fa-location-dot text-emerald-700"></i> {pkg.makkahHotel.distance || 'Near to Haram'}
                                    </p>
                                    <div className="flex gap-1.5 mt-1 flex-wrap">
                                      {pkg.makkahHotel.mealPlan && (
                                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> {pkg.makkahHotel.mealPlan}</span>
                                      )}
                                      {pkg.makkahHotel.nights && (
                                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{pkg.makkahHotel.nights} Nights</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {pkg.madinahHotel && (
                                <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                    {pkg.madinahHotel.image && (
                                      <Image src={pkg.madinahHotel.image} alt="Madinah Hotel" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{pkg.madinahHotel.name || '5 Star Hotel in Madinah'}</h4>
                                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                      <i className="fa-solid fa-location-dot text-amber-600"></i> {pkg.madinahHotel.distance || 'Near to Masjid Nabawi'}
                                    </p>
                                    <div className="flex gap-1.5 mt-1 flex-wrap">
                                      {pkg.madinahHotel.mealPlan && (
                                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> {pkg.madinahHotel.mealPlan}</span>
                                      )}
                                      {pkg.madinahHotel.nights && (
                                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{pkg.madinahHotel.nights} Nights</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Operator</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-slate-800">King Travel</span>
                                    <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded">4.4/5</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">From CAD / Quad Occupancy</span>
                                  <span className="text-2xl font-extrabold text-brand-800">{pkg.price}</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                <Link href={pkg.btnLink || '/contact'} className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                                  <DynamicIcon name={pkg.btnIcon || 'Passport'} className="w-4 h-4 mr-1" /> {pkg.btnText || 'Book Hajj 2027'}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            );
          case 'Sold Out Packages':
            return (
              <div key={sec.id || secIndex}>
                <section id="hajj" className="tint py-6">
                  <div className="wrap">
                    <div className="section-head split reveal">
                      <div>
                        {sec.data?.eyebrow && <div className="eyebrow">{sec.data.eyebrow}</div>}
                        {sec.data?.title && <h2 dangerouslySetInnerHTML={{ __html: sec.data.title }} />}
                      </div>
                      {sec.data?.description && (
                        <p className="max-w-[480px]">{sec.data.description}</p>
                      )}
                    </div>
                    <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {(sec.data?.items || []).map((pkg: any, idx: number) => (
                        <article key={idx} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col transition-all duration-300 group relative grayscale hover:grayscale-0">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 -rotate-12 pointer-events-none">
                            <span className="bg-red-600 text-white text-2xl md:text-3xl font-black uppercase tracking-widest px-6 py-2 rounded-lg shadow-xl border-4 border-red-700/50 backdrop-blur-sm whitespace-nowrap">
                              {pkg.badgeText || 'Sold Out'}
                            </span>
                          </div>
                          <div className="relative h-64 overflow-hidden shrink-0 opacity-80">
                            {pkg.heroImage && (
                              <Image src={pkg.heroImage} alt={pkg.title || 'Hajj'} width={700} height={256} className="w-full h-full object-cover" unoptimized />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                            <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                              <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                                {pkg.month}
                              </span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                              {pkg.title && <h2 className="text-xl font-bold text-white tracking-tight">{pkg.title}</h2>}
                              <div className="text-brand-gold font-bold mt-1">{pkg.price} <span className="text-white/70 text-xs font-normal">{pkg.priceUnit || '/ Person'}</span></div>
                            </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between opacity-80">
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">{pkg.includesLabel || 'Package Includes'}</h3>
                              <ul className="space-y-3 mb-6">
                                {(pkg.includes || []).map((feat: any, fIdx: number) => (
                                  <li key={fIdx} className="flex items-center gap-3 text-sm text-slate-600">
                                    {feat.icon ? (
                                      <DynamicIcon name={feat.icon} className={`w-4 h-4 ${feat.iconColor || 'text-slate-400'}`} />
                                    ) : (
                                      <DynamicIcon name="Check" className={`w-4 h-4 text-slate-400`} />
                                    )}
                                    {feat.text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {pkg.btnText && pkg.btnLink && (
                              <a href={pkg.btnLink} className="w-full bg-slate-200 text-slate-500 font-bold py-3.5 px-6 rounded-xl text-center uppercase tracking-wider text-sm flex items-center justify-center cursor-not-allowed pointer-events-none">
                                {pkg.btnIcon && <DynamicIcon name={pkg.btnIcon} className="w-4 h-4 mr-2" />}
                                {pkg.btnText}
                              </a>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            );
          case 'Visa Solutions':
            return (
              <div key={sec.id || secIndex}>
                <section id="visa" className="py-6 bg-[#FAF8F5]">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                      {sec.data?.eyebrow && <div className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] mb-2">{sec.data.eyebrow}</div>}
                      {sec.data?.title && <h2 className="text-3xl md:text-4xl font-serif text-slate-900" dangerouslySetInnerHTML={{ __html: sec.data.title }} />}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(sec.data?.items || []).map((item: any, idx: number) => {
                        // Make the last item span 2 columns on medium screens if it's the 5th item, etc.
                        // For now, let's stick to the original static layout logic for col-span if needed.
                        // The original had item 5 as md:col-span-2 lg:col-span-1.
                        const extraClass = (idx === 4) ? " md:col-span-2 lg:col-span-1" : "";
                        return (
                          <div key={idx} className={`bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group${extraClass}`}>
                            <div className="relative h-48 w-full overflow-hidden shrink-0">
                              {item.image && (
                                <Image src={item.image} alt={item.title || 'Visa'} width={400} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                              )}
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
            );
          case 'Testimonials':
            return (
              <div key={sec.id || secIndex}>
                <section className="bg-[#004B39] text-white py-6 overflow-hidden">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                      {sec.data?.eyebrow && <div className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] mb-2">{sec.data.eyebrow}</div>}
                      {sec.data?.title && <h2 className="text-3xl md:text-4xl font-serif text-white" dangerouslySetInnerHTML={{ __html: sec.data.title }} />}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
                        <div className="flex items-center gap-3">
                          <Image src="/img/round-logo.png" className="w-12 h-12 rounded-full border border-white/20 object-cover" alt="King Travel logo" width={48} height={48} />
                          <div className="text-sm font-bold text-white">King Travel Can Ltd - Mississauga</div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-lg">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                        <div className="text-xs font-medium text-slate-200">Google reviews</div>
                        <a href={sec.data?.reviewLink || 'https://maps.app.goo.gl/1BRUoBxtt4wWw58t6'} target="_blank" rel="noopener noreferrer" className="inline-block border border-white/40 text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">
                          {sec.data?.ctaLabel || 'Write A Review'}
                        </a>
                      </div>

                      <div className="lg:col-span-8 relative">
                        <TestimonialsCarousel
                          reviews={sec.data.items}
                          autoplaySpeed={sec.data.autoplaySpeed ? parseInt(sec.data.autoplaySpeed, 10) : 3000}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            );
          default:
            return null;
        }
      })}

      <SubmissionSuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMsg}
        referenceNumber={modalRef}
      />
    </main>
  );
}
