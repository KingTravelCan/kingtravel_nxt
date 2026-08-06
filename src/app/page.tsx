"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MarqueeTrack from "@/components/MarqueeTrack";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import PageSectionsRenderer from "@/components/PageSectionsRenderer";
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
    setQuoteStatus("Submitting to Database...");
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
                    className={`w-full border p-3 rounded-xl bg-slate-50 outline-none transition-colors duration-300 text-slate-900 text-sm font-medium placeholder:text-slate-400 ${quoteErrors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"
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
                    className={`w-full border p-3 rounded-xl bg-slate-50 outline-none transition-colors duration-300 text-slate-900 text-sm font-medium placeholder:text-slate-400 ${quoteErrors.phone ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"
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
                    className={`w-full border p-3 rounded-xl bg-slate-50 outline-none transition-colors duration-300 text-slate-900 text-sm font-medium placeholder:text-slate-400 ${quoteErrors.email ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"
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
                    className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 outline-none focus:border-emerald-800 transition-colors text-slate-900 text-sm font-medium"
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
                    className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 outline-none focus:border-emerald-800 transition-colors text-slate-900 text-sm font-medium"
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
                    className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 outline-none focus:border-emerald-800 transition-colors text-slate-900 text-sm font-medium"
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


      {/* ================= TRUSTED MARQUEE ================= */}
      <section className="py-6 border-b border-gray-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
          <div className="whitespace-nowrap font-bold text-gray-500 uppercase tracking-widest text-xs">
            TRUSTED TRAVEL ORGANIZATION
          </div>
          <div className="flex-1 flex justify-between items-center opacity-70 grayscale flex-wrap gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Ministry_of_Hajj_and_Umrah_logo.svg/512px-Ministry_of_Hajj_and_Umrah_logo.svg.png" alt="Ministry of Hajj" className="h-10 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/IATA_logo.svg/512px-IATA_logo.svg.png" alt="IATA" className="h-8 object-contain" />
            <img src="https://m.ttnworldwide.com/ArticleImages/20210216091011504153073.jpg" alt="Nusuk" className="h-8 object-contain" />
            <img src="https://logos-world.net/wp-content/uploads/2020/03/Saudia-Logo.png" alt="Saudia" className="h-10 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/TICO_logo.svg/512px-TICO_logo.svg.png" alt="Tico" className="h-10 object-contain" />
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-16 md:py-24 bg-[#f4f6ec]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left: Image */}
            <div className="relative justify-self-center lg:justify-self-end">
              <div className="rounded-[40px] overflow-hidden shadow-2xl relative aspect-[4/3] w-[90vw] max-w-[550px]">
                <img src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80" alt="Kaaba" className="w-full h-full object-cover" />
              </div>

              {/* Review Badge */}
              <div className="absolute -bottom-6 -left-2 sm:-bottom-8 sm:-left-8 bg-white p-5 rounded-2xl shadow-xl w-64">
                <div className="flex text-[#DB9E30] text-sm mb-2">★★★★★</div>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  "Every detail handled — from visa to hotel, steps from the Haram."
                </p>
              </div>
            </div>

            {/* Right: Text & Stats */}
            <div>
              <h3 className="text-[#DB9E30] font-black uppercase tracking-widest text-sm mb-4">WHO WE ARE</h3>
              <h2 className="text-4xl md:text-5xl font-serif text-[#004B39] leading-tight mb-6">
                We provide and offer<br />Hajj & Umrah packages
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                King Travel proudly provides reliable and professional Hajj and Umrah services across Canada. With years of experience serving the Muslim community, we are committed to making your sacred journey smooth, comfortable, and spiritually fulfilling.
              </p>
              <p className="text-gray-700 mb-10 leading-relaxed text-sm md:text-base">
                Whether you are traveling for Hajj, Umrah, or Saudi Visa services, our expert team is here to guide you every step of the way.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#fbfbf9] border border-[#e5e7dc] rounded-2xl p-5 text-center shadow-sm">
                  <div className="text-[#DB9E30] font-serif text-2xl mb-1">25+</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Years Serving Canada</div>
                </div>
                <div className="bg-[#fbfbf9] border border-[#e5e7dc] rounded-2xl p-5 text-center shadow-sm">
                  <div className="text-[#DB9E30] font-serif text-2xl mb-1">10,000+</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pilgrims Guided</div>
                </div>
                <div className="bg-[#fbfbf9] border border-[#e5e7dc] rounded-2xl p-5 text-center shadow-sm">
                  <div className="text-[#DB9E30] font-serif text-2xl mb-1">5★</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Hotels, Every Package</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= UMRAH PACKAGES ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h3 className="text-[#DB9E30] font-black uppercase tracking-widest text-xs mb-3">EXCLUSIVE UPCOMING</h3>
              <h2 className="text-4xl md:text-5xl font-serif text-[#004B39] leading-tight">Umrah Packages<br />from Canada</h2>
            </div>
            <div className="max-w-sm text-gray-500 text-sm leading-relaxed border-l-2 border-gray-200 pl-4">
              Departures from CAD 2,595 per person. Availability and accommodations are confirmed with every booking – contact us before reserving.
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {/* Card 1 */}
            <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col border border-gray-100">
              <div className="relative h-48 w-full">
                <img src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80" alt="Makkah" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">5 STAR</div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">AUGUST · 2026</div>
                <h3 className="text-2xl font-serif text-[#004B39] mb-2">5 Star Umrah Package</h3>
                <div className="text-[#DB9E30] font-black text-xl mb-6">CAD 2,895 <span className="text-sm font-medium text-gray-500">/ Person</span></div>
                
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">PACKAGE INCLUDES</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Plane className="w-4 h-4 text-gray-400 shrink-0" /> Return Flights from Toronto</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Bus className="w-4 h-4 text-gray-400 shrink-0" /> Luxury Ground Transportation</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Gift className="w-4 h-4 text-gray-400 shrink-0" /> Free Ihram Kit</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.FileText className="w-4 h-4 text-gray-400 shrink-0" /> Registration & Visa Assistance</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Users className="w-4 h-4 text-gray-400 shrink-0" /> Imam Lead Guide & Seminar</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Hotel className="w-4 h-4 text-gray-400 shrink-0" /> 5 Star Hotels Makkah & Madinah</li>
                </ul>
                
                <button className="w-full py-4 bg-[#DB9E30] hover:bg-[#c58d2a] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors">BOOK NOW</button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#DB9E30] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col mt-0 xl:mt-8">
              <div className="relative h-48 w-full">
                <img src="https://images.unsplash.com/photo-1565552070098-fd83a8dac718?auto=format&fit=crop&w=600&q=80" alt="Madinah" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">5 STAR</div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-[#004B39]/70 text-xs font-bold uppercase tracking-widest mb-2">SEPTEMBER · 2026</div>
                <h3 className="text-2xl font-serif text-[#004B39] mb-2">5 Star Umrah Package</h3>
                <div className="text-[#004B39] font-black text-xl mb-6">CAD 2,695 <span className="text-sm font-medium opacity-80">/ Person</span></div>
                
                <div className="text-[10px] font-black text-[#004B39]/70 uppercase tracking-widest mb-4">PACKAGE INCLUDES</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Plane className="w-4 h-4 shrink-0" /> Return Flights from Toronto</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Bus className="w-4 h-4 shrink-0" /> Luxury Ground Transportation</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Gift className="w-4 h-4 shrink-0" /> Free Ihram Kit</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.FileText className="w-4 h-4 shrink-0" /> Registration & Visa Assistance</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Users className="w-4 h-4 shrink-0" /> Imam Lead Guide & Seminar</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Hotel className="w-4 h-4 shrink-0" /> 5 Star Hotels Makkah & Madinah</li>
                </ul>
                
                <button className="w-full py-4 bg-[#2c3e35] hover:bg-[#1a2520] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors">BOOK NOW</button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col border border-gray-100">
              <div className="relative h-48 w-full">
                <img src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80" alt="Makkah" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">5 STAR</div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">OCTOBER · 2026</div>
                <h3 className="text-2xl font-serif text-[#004B39] mb-2">5 Star Umrah Package</h3>
                <div className="text-[#DB9E30] font-black text-xl mb-6">CAD 2,795 <span className="text-sm font-medium text-gray-500">/ Person</span></div>
                
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">PACKAGE INCLUDES</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Plane className="w-4 h-4 text-gray-400 shrink-0" /> Return Flights from Toronto</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Bus className="w-4 h-4 text-gray-400 shrink-0" /> Luxury Ground Transportation</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Gift className="w-4 h-4 text-gray-400 shrink-0" /> Free Ihram Kit</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.FileText className="w-4 h-4 text-gray-400 shrink-0" /> Registration & Visa Assistance</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Users className="w-4 h-4 text-gray-400 shrink-0" /> Imam Lead Guide & Seminar</li>
                  <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Hotel className="w-4 h-4 text-gray-400 shrink-0" /> 5 Star Hotels Makkah & Madinah</li>
                </ul>
                
                <button className="w-full py-4 bg-[#DB9E30] hover:bg-[#c58d2a] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors">BOOK NOW</button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#DB9E30] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col mt-0 xl:mt-8">
              <div className="relative h-48 w-full">
                <img src="https://images.unsplash.com/photo-1565552070098-fd83a8dac718?auto=format&fit=crop&w=600&q=80" alt="Madinah" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">5 STAR</div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-[#004B39]/70 text-xs font-bold uppercase tracking-widest mb-2">NOVEMBER · 2026</div>
                <h3 className="text-2xl font-serif text-[#004B39] mb-2">5 Star Umrah Package</h3>
                <div className="text-[#004B39] font-black text-xl mb-6">CAD 2,795 <span className="text-sm font-medium opacity-80">/ Person</span></div>
                
                <div className="text-[10px] font-black text-[#004B39]/70 uppercase tracking-widest mb-4">PACKAGE INCLUDES</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Plane className="w-4 h-4 shrink-0" /> Return Flights from Toronto</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Bus className="w-4 h-4 shrink-0" /> Luxury Ground Transportation</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Gift className="w-4 h-4 shrink-0" /> Free Ihram Kit</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.FileText className="w-4 h-4 shrink-0" /> Registration & Visa Assistance</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Users className="w-4 h-4 shrink-0" /> Imam Lead Guide & Seminar</li>
                  <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Hotel className="w-4 h-4 shrink-0" /> 5 Star Hotels Makkah & Madinah</li>
                </ul>
                
                <button className="w-full py-4 bg-[#2c3e35] hover:bg-[#1a2520] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors">BOOK NOW</button>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <button className="px-8 py-3.5 border-2 border-[#004B39] text-[#004B39] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#004B39] hover:text-white transition-all flex items-center gap-3">
              SEE ALL PACKAGES <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="py-20 bg-[#f4f6ec]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-[#DB9E30] font-black uppercase tracking-[0.2em] text-sm mb-3">SERVICES WE OFFER</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-[#004B39] leading-tight">
              Select your preferred travel<br />service
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Umrah Packages', 
                desc: 'Flexible departures with flights, stays & guidance included.', 
                icon: 'Star' 
              },
              { 
                title: 'Hajj Packages', 
                desc: 'Fully accredited pilgrimage packages, curated end to end.', 
                icon: 'Briefcase' 
              },
              { 
                title: 'Airline Tickets', 
                desc: 'Best-fare flights sourced from every route into Jeddah.', 
                icon: 'ArrowLeftRight' 
              },
              { 
                title: 'Saudi Visa Services', 
                desc: 'Full visa processing, handled and confirmed before departure.', 
                icon: 'CreditCard' 
              },
              { 
                title: 'Hotel Booking', 
                desc: '5-star stays within walking distance of the Haram.', 
                icon: 'Home' 
              },
              { 
                title: 'Global Flight Reservations', 
                desc: 'Worldwide reliable flight bookings for any itinerary.', 
                icon: 'Globe' 
              },
              { 
                title: 'Travel Documentation', 
                desc: 'Guidance on every document your journey requires.', 
                icon: 'FileText' 
              },
              { 
                title: 'Group & Private Tours', 
                desc: 'Private, guided, and fully customizable itineraries.', 
                icon: 'User' 
              },
            ].map((s, i) => (
              <div key={i} className="bg-[#fcfdf9] rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#eef0e4] hover:-translate-y-1 transition-transform duration-300 cursor-pointer flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-[#faeed8] flex items-center justify-center text-[#DB9E30] mb-6">
                  <DynamicIcon name={s.icon} className="w-5 h-5" />
                </div>
                <h4 className="text-[#1a2b25] font-serif text-lg mb-3">{s.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DYNAMIC SECTIONS ================= */}
      <PageSectionsRenderer sections={dynamicSections} />

      <SubmissionSuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMsg}
        referenceNumber={modalRef}
      />
    </main>
  );
}
