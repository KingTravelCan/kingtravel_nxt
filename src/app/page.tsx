"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MarqueeTrack from "@/components/MarqueeTrack";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { getPageBySlug } from "@/actions/pageActions";
import { submitQuoteEnquiryAction, submitContactEnquiryAction } from "@/actions/enquiryActions";

const partnerLogos = [
  { src: "/img/t-3.png", alt: "Trust Partner 3" },
  { src: "/img/t-2.png", alt: "Trust Partner 2" },
  { src: "/img/t-1.png", alt: "Trust Partner 1" },
  { src: "/img/t-4.png", alt: "Trust Partner 4" },
  { src: "/img/t-5.png", alt: "Trust Partner 5" },
  { src: "/img/t-6.png", alt: "Trust Partner 6" },
];

const airlineLogos = [
  { src: "/img/a-1.png", alt: "Airline 1" },
  { src: "/img/a-2.png", alt: "Airline 2" },
  { src: "/img/a-3.png", alt: "Airline 3" },
  { src: "/img/a-4.png", alt: "Airline 4" },
  { src: "/img/a-5.png", alt: "Airline 5" },
  { src: "/img/a-6.png", alt: "Airline 6" },
  { src: "/img/a-7.png", alt: "Airline 7" },
  { src: "/img/a-8.png", alt: "Airline 8" },
  { src: "/img/a-9.png", alt: "Airline 9" },
];

export default function Home() {
  const [heroData, setHeroData] = useState({
    heroEyebrow: "Est. in Canada · Licensed Pilgrimage Operator",
    title: "Your journey to<br /><em>Makkah &amp; Madinah</em>,<br />guided with care.",
    description: "King Travel plans Hajj and Umrah journeys from Canada down to the smallest detail — flights, five‑star stays walking distance from the Haram, visas, and guides who've made this journey themselves.",
    primaryBtnLabel: "View Umrah Packages →",
    primaryBtnLink: "#packages",
    secondaryBtnLabel: "Speak With an Advisor",
    secondaryBtnLink: "/contact",
    badge1Top: "10,000+",
    badge1Sub: "Pilgrims Guided",
    badge2Top: "5★ Hotels",
    badge2Sub: "Every Package, Every Time",
    bgImage: "/img/hero.png",
    position: "center center",
    size: "cover",
  });

  useEffect(() => {
    getPageBySlug("/").then((p) => {
      if (p) {
        let secData: any = {};
        if (p.sections) {
          try {
            const parsed = JSON.parse(p.sections);
            const foundHero = parsed.find(
              (s: any) => s.type === "Homepage Hero Banner" || s.type === "Hero Slider"
            );
            if (foundHero && foundHero.data) secData = foundHero.data;
          } catch {}
        }
        setHeroData({
          heroEyebrow: secData.heroEyebrow || "Est. in Canada · Licensed Pilgrimage Operator",
          title: p.bannerTitle || secData.title || "Your journey to<br /><em>Makkah &amp; Madinah</em>,<br />guided with care.",
          description: p.bannerDescription || secData.description || "King Travel plans Hajj and Umrah journeys from Canada down to the smallest detail — flights, five‑star stays walking distance from the Haram, visas, and guides who've made this journey themselves.",
          primaryBtnLabel: secData.primaryBtnLabel || "View Umrah Packages →",
          primaryBtnLink: secData.primaryBtnLink || "#packages",
          secondaryBtnLabel: secData.secondaryBtnLabel || "Speak With an Advisor",
          secondaryBtnLink: secData.secondaryBtnLink || "/contact",
          badge1Top: secData.badge1Top || "10,000+",
          badge1Sub: secData.badge1Sub || "Pilgrims Guided",
          badge2Top: secData.badge2Top || "5★ Hotels",
          badge2Sub: secData.badge2Sub || "Every Package, Every Time",
          bgImage: p.bannerBgImage || secData.bannerBgImage || "/img/hero.png",
          position: p.bannerPosition || secData.bannerPosition || "center center",
          size: p.bannerSize || secData.bannerSize || "cover",
        });
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
        setQuoteStatus(res.message || "Thank you! Your quote request has been saved in the database.");
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
        setContactStatus(res.message || "Thank you! Your message has been logged in our database.");
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
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gold bg-[#fadeac] p-6 md:p-8 -mt-8 reveal">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#004B39] tracking-tight text-center mb-6">
              Get a free Quote
            </h2>
            {quoteStatus && <p className="text-center text-emerald-800 font-semibold mb-6">{quoteStatus}</p>}

            <form noValidate className="flex flex-col gap-4" onSubmit={handleQuoteSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    id="quote-fullName"
                    placeholder=" "
                    value={quoteForm.fullName}
                    onChange={(e) => {
                      setQuoteForm({ ...quoteForm, fullName: e.target.value });
                      if (quoteErrors.fullName) setQuoteErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    className={`peer w-full border p-3 rounded-xl bg-white/80 outline-none transition-colors duration-300 text-slate-900 placeholder-transparent ${quoteErrors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"
                      }`}
                  />
                  <label
                    htmlFor="quote-fullName"
                    className={`absolute left-3 top-3 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs ${quoteErrors.fullName ? "text-red-600 peer-focus:text-red-600" : "text-slate-500 peer-focus:text-emerald-800"
                      }`}
                  >
                    Your Name
                  </label>
                  {quoteErrors.fullName && <span className="text-red-600 text-xs font-semibold mt-1 block">{quoteErrors.fullName}</span>}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="quote-phone"
                    placeholder=" "
                    value={quoteForm.phone}
                    onChange={(e) => {
                      setQuoteForm({ ...quoteForm, phone: e.target.value });
                      if (quoteErrors.phone) setQuoteErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    className={`peer w-full border p-3 rounded-xl bg-white/80 outline-none transition-colors duration-300 text-slate-900 placeholder-transparent ${quoteErrors.phone ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"
                      }`}
                  />
                  <label
                    htmlFor="quote-phone"
                    className={`absolute left-3 top-3 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs ${quoteErrors.phone ? "text-red-600 peer-focus:text-red-600" : "text-slate-500 peer-focus:text-emerald-800"
                      }`}
                  >
                    Phone Number
                  </label>
                  {quoteErrors.phone && <span className="text-red-600 text-xs font-semibold mt-1 block">{quoteErrors.phone}</span>}
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="quote-email"
                    placeholder=" "
                    value={quoteForm.email}
                    onChange={(e) => {
                      setQuoteForm({ ...quoteForm, email: e.target.value });
                      if (quoteErrors.email) setQuoteErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`peer w-full border p-3 rounded-xl bg-white/80 outline-none transition-colors duration-300 text-slate-900 placeholder-transparent ${quoteErrors.email ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"
                      }`}
                  />
                  <label
                    htmlFor="quote-email"
                    className={`absolute left-3 top-3 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs ${quoteErrors.email ? "text-red-600 peer-focus:text-red-600" : "text-slate-500 peer-focus:text-emerald-800"
                      }`}
                  >
                    Email Address
                  </label>
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
                    className="group w-full bg-[#004B39] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md hover:bg-[#DB9E30] hover:text-[#004B39] hover:border hover:border-[#004B39] active:scale-[0.99] transition-all duration-300 tracking-wider uppercase text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>SUBMIT QUOTE</span>
                    <i className="fa-solid fa-paper-plane text-xs group-hover:translate-x-1 transition-transform"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= TRUST Travel ================= */}
      <section className="travels-section">
        <div className="wrap section-head center reveal">
          <div className="eyebrow justify-center">Licensed &amp; Accredited</div>
          <h2 className="text-[32px]">Trusted travel Organization</h2>
        </div>
        <MarqueeTrack type="travel" images={partnerLogos} />
      </section>

      {/* ================= ABOUT ================= */}
      <section className="tint" id="trust">
        <div className="wrap about-split reveal">
          <div className="about-figure">
            <div className="main-img">
              <Image
                src="https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=1000&q=80"
                alt="The Kaaba, Masjid al-Haram, Makkah"
                width={1000}
                height={1000}
                className="w-full h-full"
                unoptimized
              />
            </div>
            <div className="float-card">
              <div className="stars">
                <span className="star"></span>
                <span className="star"></span>
                <span className="star"></span>
                <span className="star"></span>
                <span className="star"></span>
              </div>
              <p>"Every detail handled — from visa to hotel, steps from the Haram."</p>
            </div>
          </div>
          <div className="about-copy">
            <div className="eyebrow">Who We Are</div>
            <h2 className="mt-4 text-[clamp(28px,3.2vw,38px)]">
              We provide and offer<br />Hajj &amp; Umrah packages
            </h2>
            <p>
              King Travel proudly provides reliable and professional Hajj and Umrah services across Canada. With years of
              experience serving the Muslim community, we are committed to making your sacred journey smooth, comfortable,
              and spiritually fulfilling.
            </p>
            <p>
              Whether you are traveling for Hajj, Umrah, or Saudi Visa services, our expert team is here to guide you every
              step of the way.
            </p>
            <div className="stat-cards">
              <div className="stat-box">
                <div className="n">25+</div>
                <div className="l">Years Serving Canada</div>
              </div>
              <div className="stat-box">
                <div className="n">10,000+</div>
                <div className="l">Pilgrims Guided</div>
              </div>
              <div className="stat-box">
                <div className="n">5★</div>
                <div className="l">Hotels, Every Package</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= UMRAH PACKAGES ================= */}
      <section id="packages">
        <div className="wrap">
          <div className="section-head split reveal">
            <div>
              <div className="eyebrow">Exclusive Upcoming</div>
              <h2>Umrah Packages<br />from Canada</h2>
            </div>
            <p className="max-w-[480px]">
              Departures from CAD 2,595 per person. Availability and accommodations are confirmed
              with every booking — contact us before reserving.
            </p>
          </div>

          <div className="pkg-scroller reveal">
            {/* Umrah Card 1 */}
            <div className="pkg-card">
              <div className="pkg-media">
                <Image
                  src="https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80"
                  alt="Makkah"
                  width={700}
                  height={200}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                <span className="tag">5 Star</span>
              </div>
              <div className="pkg-top">
                <div className="pkg-month">August · 2026</div>
                <div className="pkg-title">5 Star Umrah Package</div>
                <div className="pkg-price">CAD 2,895<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                    Imam Lead Guide &amp; Seminar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah
                  </li>
                </ul>
                <div className="pkg-cta-full"><Link className="btn block" href="/contact">Book Now</Link></div>
              </div>
            </div>

            {/* Umrah Card 2 */}
            <div className="pkg-card active">
              <div className="pkg-media">
                <Image
                  src="https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=700&q=80"
                  alt="Madinah"
                  width={700}
                  height={200}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                <span className="tag">5 Star</span>
              </div>
              <div className="pkg-top">
                <div className="pkg-month">SEPTEMBER · 2026</div>
                <div className="pkg-title">5 Star Umrah Package</div>
                <div className="pkg-price">CAD 2,695<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                    Imam Lead Guide &amp; Seminar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah
                  </li>
                </ul>
                <div className="pkg-cta-full"><Link className="btn block" href="/contact">Book Now</Link></div>
              </div>
            </div>

            {/* Umrah Card 3 */}
            <div className="pkg-card">
              <div className="pkg-media">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ-woBtLbE_PWTBqCZ0brMsNEO9cHm5Ty6OCvR5RFNo7W0KUJju1hOyP_q_rbDHPmxNebevMC34dQLhx3Nnq8ge9vhJPkyWcKA0dcuuO0l8xYQslkwffXg3ykAx1dNenk6erSOcJyc_AlaXq2EF76R51_YvEogiCpJVurSD9X-yPiEZG18m2eOeHrqQXpqPZY9-JbONVyqZgYzy6E8X45y96-V4nKAP3WoezDdYk-kFBIOCDuJWAbN"
                  alt="Masjid Nabawi green dome"
                  width={700}
                  height={200}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                <span className="tag">5 Star</span>
              </div>
              <div className="pkg-top">
                <div className="pkg-month">OCTOBER · 2026</div>
                <div className="pkg-title">5 Star Umrah Package</div>
                <div className="pkg-price">CAD 2,795<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                    Imam Lead Guide &amp; Seminar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah
                  </li>
                </ul>
                <div className="pkg-cta-full"><Link className="btn block" href="/contact">Book Now</Link></div>
              </div>
            </div>

            {/* Umrah Card 4 */}
            <div className="pkg-card active">
              <div className="pkg-media">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ-woBtLbE_PWTBqCZ0brMsNEO9cHm5Ty6OCvR5RFNo7W0KUJju1hOyP_q_rbDHPmxNebevMC34dQLhx3Nnq8ge9vhJPkyWcKA0dcuuO0l8xYQslkwffXg3ykAx1dNenk6erSOcJyc_AlaXq2EF76R51_YvEogiCpJVurSD9X-yPiEZG18m2eOeHrqQXpqPZY9-JbONVyqZgYzy6E8X45y96-V4nKAP3WoezDdYk-kFBIOCDuJWAbN"
                  alt="Masjid Nabawi green dome"
                  width={700}
                  height={200}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                <span className="tag">5 Star</span>
              </div>
              <div className="pkg-top">
                <div className="pkg-month">NOVEMBER · 2026</div>
                <div className="pkg-title">5 Star Umrah Package</div>
                <div className="pkg-price">CAD 2,795<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                    Imam Lead Guide &amp; Seminar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah
                  </li>
                </ul>
                <div className="pkg-cta-full"><Link className="btn block" href="/contact">Book Now</Link></div>
              </div>
            </div>
          </div>

          <div className="more-wrap reveal">
            <Link className="btn outline border-[var(--ink)]" href="/contact">
              See All Packages{" "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="tint">
        <div className="wrap">
          <div className="section-head center reveal">
            <div className="eyebrow justify-center">Services We Offer</div>
            <h2>Select your preferred travel service</h2>
          </div>
          <div className="svc-grid reveal">
            <a className="svc-tile" href="#packages">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2 L14 9 L21 9 L15 13.5 L17 21 L12 16.5 L7 21 L9 13.5 L3 9 L10 9 Z" />
                </svg>
              </div>
              <h4>Umrah Packages</h4>
              <p>Flexible departures with flights, stays &amp; guidance included.</p>
            </a>
            <Link className="svc-tile" href="/hajj-packages">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <rect x="7" y="9" width="10" height="12" />
                  <circle cx="12" cy="6" r="3" />
                </svg>
              </div>
              <h4>Hajj Packages</h4>
              <p>Fully accredited pilgrimage packages, curated end to end.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M3 12h18M3 12l6-6M3 12l6 6M21 12l-6-6M21 12l-6 6" />
                </svg>
              </div>
              <h4>Airline Tickets</h4>
              <p>Best-fare flights sourced from every route into Jeddah.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="1" />
                  <path d="M4 10h16M9 4v6" />
                </svg>
              </div>
              <h4>Saudi Visa Services</h4>
              <p>Full visa processing, handled and confirmed before departure.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M3 21V10l9-6 9 6v11" />
                  <path d="M9 21v-7h6v7" />
                </svg>
              </div>
              <h4>Hotel Booking</h4>
              <p>5-star stays within walking distance of the Haram.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9Z" />
                </svg>
              </div>
              <h4>Global Flight Reservations</h4>
              <p>Worldwide reliable flight bookings for any itinerary.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                  <path d="M9 12h6M9 16h6" />
                </svg>
              </div>
              <h4>Travel Documentation</h4>
              <p>Guidance on every document your journey requires.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <h4>Group &amp; Private Tours</h4>
              <p>Private, guided, and fully customizable itineraries.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHAT WE PROVIDE ================= */}
      <section>
        <div className="wrap provide-split reveal">
          <div className="provide-img">
            <Image
              src="https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=900&q=80"
              alt="Masjid al-Haram at night"
              width={900}
              height={900}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <div className="eyebrow">What We Provide</div>
            <h2 className="mt-4 text-[clamp(28px,3.2vw,38px)]">
              Lowest fares, exclusive<br />travel deals, real trust
            </h2>
            <div className="provide-list mt-[26px]">
              <div className="item">
                <div className="num">01</div>
                <div>
                  <h4>Lowest Fares</h4>
                  <p>We offer the lowest rates on the market, sourced across every route into Jeddah.</p>
                </div>
              </div>
              <div className="item">
                <div className="num">02</div>
                <div>
                  <h4>Special Deals</h4>
                  <p>Fixed-price Umrah packages with hotels, meals and transport included.</p>
                </div>
              </div>
              <div className="item">
                <div className="num">03</div>
                <div>
                  <h4>Trusted &amp; Certified</h4>
                  <p>A fully accredited travel agency you can rely on, licensed across Canada.</p>
                </div>
              </div>
              <div className="item">
                <div className="num">04</div>
                <div>
                  <h4>Pilgrimage Services</h4>
                  <p>Visa processing, group support — the full spiritual journey, arranged.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN PACKAGES GRID ================= */}
      <section>
        <div className="wrap">
          <div className="section-head split reveal">
            <div>
              <div className="eyebrow">Luxury Hajj Packages</div>
              <h2>Hajj Packages 2027</h2>
            </div>
            <p className="max-w-[480px]">
              Luxury Hajj 2027 Packages with 5-Star Hotels, VIP Services &amp; Complete Spiritual Guidance.
            </p>
          </div>
          <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80"
                  alt="Makkah & Madinah"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={700}
                  height={256}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                  <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027
                  </span>
                  <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-calendar"></i> 14 Days
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1">
                    <i className="fa-solid fa-plane text-xs"></i>From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Economy Hajj Package 2027</h2>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg?k=13b36d624d683462058664c3aa31641cbb4c53cf07ca581f02f127e198029575&o="
                        alt="Makkah Hotel"
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel in Makkah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <i className="fa-solid fa-location-dot text-emerald-700"></i> Near to Haram
                      </p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">6 Nights</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg?k=2d6dfd51cd0bb767e33d6cc5dc4d3f8d76da0c17140158b7b43366dc7cf66a36&o="
                        alt="Madinah Hotel"
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel in Madinah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <i className="fa-solid fa-location-dot text-amber-600"></i> Near to Masjid Nabawi
                      </p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">6 Nights</span>
                      </div>
                    </div>
                  </div>
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
                      <span className="text-2xl font-extrabold text-brand-800">12,995</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/economy-hajj-2027" className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                      <i className="fa-solid fa-passport"></i> Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 2 */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=900&q=80"
                  alt="Makkah Clock Tower"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={900}
                  height={256}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                  <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027
                  </span>
                  <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-calendar"></i> 17 Days
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1">
                    <i className="fa-solid fa-plane text-xs"></i> From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Deluxe Hajj 2027</h2>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="/img/fairmount.jpg" alt="Makkah Fairmont" className="w-full h-full object-cover" width={64} height={64} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel Fairmont Makkah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-emerald-700"></i> Near to Haram</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Buffet Included</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">8 Nights</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="/img/dar-al-eman.jpg" alt="Madinah Oberoi" className="w-full h-full object-cover" width={64} height={64} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel Dar Al Eman Madinah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-amber-600"></i> Near to Masjid Nabawi</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Buffet Included</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">7 Nights</span>
                      </div>
                    </div>
                  </div>
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
                      <span className="text-2xl font-extrabold text-brand-800">17,995</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/deluxe-hajj-2027" className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                      <i className="fa-solid fa-passport"></i> Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 3 */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80"
                  alt="Hajj Tent City"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={800}
                  height={256}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                  <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027
                  </span>
                  <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-calendar"></i> 10 Days
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1">
                    <i className="fa-solid fa-plane text-xs"></i> From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Express Custom Hajj 2027</h2>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=300&q=80" alt="Makkah Hyatt" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">Hyatt Regency Makkah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-emerald-700"></i> Jabal Omar (Short Walk)</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">5 Nights</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMH3qB9RTiBkL_HJ1Ud2v3EUkitmSkKqpCuxjwQcnJNlt6DQcGjUrYoo&s=10" alt="Madinah Pullman" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">Pullman Zamzam Madinah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-amber-600"></i> Walking Distance</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">5 Nights</span>
                      </div>
                    </div>
                  </div>
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
                      <span className="text-2xl font-extrabold text-brand-800">14,995</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/contact" className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                      <i className="fa-solid fa-passport"></i> Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= HAJJ PACKAGES (SOLD OUT) ================= */}
      <section id="hajj" className="tint">
        <div className="wrap">
          <div className="section-head split reveal">
            <div>
              <div className="eyebrow">Luxury Hajj Packages</div>
              <h2>Packages Officially<br />Sold Out</h2>
            </div>
            <p className="max-w-[480px]">
              We sincerely thank everyone for the incredible trust and response. Our Hajj 2026
              packages are now fully sold out. May Allah (SWT) grant all pilgrims a safe and accepted Hajj. For Hajj 2027
              inquiries or to join the priority list, please get in touch with our team.
            </p>
          </div>
          <div className="pkg-scroller three reveal">
            {/* Sold Out 1 */}
            <div className="pkg-card sold">
              <div className="soldout"><span className="tag sold">Sold Out</span></div>
              <div className="pkg-media">
                <Image src="https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80" alt="Makkah, Hajj" width={700} height={200} className="w-full h-full object-cover" unoptimized />
              </div>
              <div className="pkg-top">
                <div className="pkg-month">May · 2026</div>
                <div className="pkg-title">Hajj Package</div>
                <div className="pkg-price">$18,995<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance</li>
                  <li><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>Imam Lead Guide &amp; Seminar</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah</li>
                </ul>
              </div>
            </div>

            {/* Sold Out 2 */}
            <div className="pkg-card sold">
              <div className="soldout"><span className="tag sold">Sold Out</span></div>
              <div className="pkg-media">
                <Image src="https://images.unsplash.com/photo-1513072064285-240f87fa81e8?auto=format&fit=crop&w=700&q=80" alt="Masjid al-Haram, Hajj" width={700} height={200} className="w-full h-full object-cover" unoptimized />
              </div>
              <div className="pkg-top">
                <div className="pkg-month">May · 2026</div>
                <div className="pkg-title">Hajj Package</div>
                <div className="pkg-price">$21,995<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance</li>
                  <li><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>Imam Lead Guide &amp; Seminar</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah</li>
                </ul>
              </div>
            </div>

            {/* Sold Out 3 */}
            <div className="pkg-card sold">
              <div className="soldout"><span className="tag sold">Sold Out</span></div>
              <div className="pkg-media">
                <Image src="https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=700&q=80" alt="Madinah, Hajj" width={700} height={200} className="w-full h-full object-cover" unoptimized />
              </div>
              <div className="pkg-top">
                <div className="pkg-month">May · 2026</div>
                <div className="pkg-title">Hajj Package</div>
                <div className="pkg-price">$16,995<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance</li>
                  <li><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>Imam Lead Guide &amp; Seminar</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SAUDI VISA GRID (MATCHING IMAGE 2 LAYOUT) ================= */}
      <section id="saudi-visa" className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#004B39] mb-2">Explore Our</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">Saudi Visa Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <Image src="/img/saudi-visa-1.webp" alt="Tourist Visa" width={400} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Tourist Visa</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Only passport required. Explore the beauty and culture of Saudi Arabia effortlessly.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <Image src="/img/saudi-visa-2.webp" alt="Umrah Visa" width={400} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Umrah Visa</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Requires passport and PR Card or other proof of residence. Start your spiritual journey with official Umrah visa services.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <Image src="/img/saudi-visa-3.jpg" alt="Family Visit Visa" width={400} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Family Visit Visa</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Complete list of requirements sent via email. Reunite with your loved ones quickly and securely.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <Image src="/img/saudi-visa-4.webp" alt="Resident Iqama" width={400} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Resident Iqama Visa</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Get all the requirements sent to your inbox. Simplify your residency process with expert guidance.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <Image src="/img/saudi-visa-5.webp" alt="Business Visit Visa" width={400} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Business Visit Visa</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">We'll email the full details you need. Expand your business horizons with an authorized visa service.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <Image src="/img/saudi-visa-6.jpg" alt="Work Visa Assistance" width={400} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Work Visa</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Contact us for detailed requirements via email. Begin your career in Saudi Arabia with professional assistance.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group md:col-span-2 lg:col-span-1">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <Image src="/img/riyadh.jpg" alt="Personal Visit Visa" width={400} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Personal Visit Visa</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Get in touch with us today to get the detailed requirements and fast-track your Saudi personal visit visa with our professional guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      {/* ================= TESTIMONIALS (MATCHING SCREENSHOT 4) ================= */}
      <section className="bg-[#004B39] text-white py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] mb-2">HAPPY PILGRIMS</div>
            <h2 className="text-3xl md:text-4xl font-serif text-white">What our clients say</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Rating Box */}
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
              <div className="text-xs font-medium text-slate-200">927 Google reviews</div>
              <a href="https://maps.app.goo.gl/1BRUoBxtt4wWw58t6" target="_blank" rel="noopener noreferrer" className="inline-block border border-white/40 text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">
                Write A Review
              </a>
            </div>

            {/* Right Testimonial Cards Carousel */}
            <div className="lg:col-span-8 relative">
              <TestimonialsCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* ================= AIRLINES ================= */}
      <section id="flights" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] mb-2">Our Trusted Partners</div>
            <h2 className="text-2xl md:text-3xl font-serif text-slate-900">Airlines we work with</h2>
          </div>
        </div>
        <MarqueeTrack type="airline" images={airlineLogos} />
      </section>

      {/* ================= CONTACT / GET IN TOUCH (MATCHING SCREENSHOT 3) ================= */}
      <section id="contact" className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Contact Info (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] mb-2">GET IN TOUCH</div>
                <h2 className="text-3xl md:text-4xl font-serif text-slate-900">We're here to help</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#DB9E30] mb-2">LANDLINES:</h4>
                  <div className="space-y-1 text-xs font-semibold text-slate-700">
                    <div><a href="tel:+18008445464" className="hover:text-[#004B39]">+1 800-844-5464</a></div>
                    <div><a href="tel:+19056248555" className="hover:text-[#004B39]">+1 905-624-8555</a></div>
                    <div><a href="tel:+19056248344" className="hover:text-[#004B39]">+1 905-624-8344</a></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#DB9E30] mb-2">WHATSAPP:</h4>
                  <div className="space-y-1 text-xs font-semibold text-slate-700">
                    <div>
                      <a href="https://wa.me/19056248344" target="_blank" rel="noopener noreferrer" className="hover:text-[#004B39]">
                        +1 905-624-8344
                      </a> <span className="text-slate-400 font-normal">- Reservation</span>
                    </div>
                    <div>
                      <a href="https://wa.me/16479828555" target="_blank" rel="noopener noreferrer" className="hover:text-[#004B39]">
                        +1 647-982-8555
                      </a> <span className="text-slate-400 font-normal">- Saudi Visa</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-200/60">
                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#DB9E30] mb-1">EMAIL</h4>
                  <a href="mailto:info@kingtravelcan.com" className="text-xs font-semibold text-slate-700 hover:text-[#004B39]">
                    info@kingtravelcan.com
                  </a>
                </div>

                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#DB9E30] mb-1">OFFICE HOURS</h4>
                  <p className="text-xs font-semibold text-slate-700">Mon–Sat, 9am – 7pm EST</p>
                </div>

                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#DB9E30] mb-1">HEAD OFFICE</h4>
                  <a href="https://maps.app.goo.gl/1BRUoBxtt4wWw58t6" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-slate-700 hover:text-[#004B39] leading-relaxed block">
                    1325 Eglinton Ave E Ste 218,<br />
                    Mississauga, ON L4W 4L9, Canada
                  </a>
                </div>

                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#DB9E30] mb-1">BRANCH OFFICE</h4>
                  <a href="https://maps.app.goo.gl/U6B4fci2Jas4sh6S6" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-slate-700 hover:text-[#004B39] leading-relaxed block">
                    22 Ontario St S,<br />
                    Milton, ON L9T 2M6, Canada
                  </a>
                </div>
              </div>
            </div>

            {/* Right Contact Form Card (7 Cols - White Box matching Screenshot 3) */}
            <div className="lg:col-span-7">
              <form noValidate className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 space-y-5" onSubmit={handleContactSubmit}>
                {contactStatus && <p className="text-emerald-700 font-semibold mb-4 text-xs">{contactStatus}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${contactErrors.fullName ? "text-red-600" : "text-slate-600"}`}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={contactForm.fullName}
                      onChange={(e) => {
                        setContactForm({ ...contactForm, fullName: e.target.value });
                        if (contactErrors.fullName) setContactErrors((prev) => ({ ...prev, fullName: "" }));
                      }}
                      className={`w-full text-xs font-medium px-4 py-3 rounded-xl border bg-white focus:outline-none transition-colors ${
                        contactErrors.fullName ? "border-red-600 focus:border-red-600" : "border-slate-200 focus:border-[#DB9E30]"
                      }`}
                    />
                    {contactErrors.fullName && <span className="text-red-600 text-xs font-semibold mt-1 block">{contactErrors.fullName}</span>}
                  </div>

                  <div>
                    <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${contactErrors.email ? "text-red-600" : "text-slate-600"}`}>
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={contactForm.email}
                      onChange={(e) => {
                        setContactForm({ ...contactForm, email: e.target.value });
                        if (contactErrors.email) setContactErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={`w-full text-xs font-medium px-4 py-3 rounded-xl border bg-white focus:outline-none transition-colors ${
                        contactErrors.email ? "border-red-600 focus:border-red-600" : "border-slate-200 focus:border-[#DB9E30]"
                      }`}
                    />
                    {contactErrors.email && <span className="text-red-600 text-xs font-semibold mt-1 block">{contactErrors.email}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      PHONE NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#DB9E30] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      SELECT PACKAGE
                    </label>
                    <select
                      value={contactForm.packageType}
                      onChange={(e) => setContactForm({ ...contactForm, packageType: e.target.value })}
                      className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#DB9E30] focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option>Select Package</option>
                      <option>Umrah Package</option>
                      <option>Hajj Package</option>
                      <option>Saudi Visa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#DB9E30] focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#DB9E30] hover:bg-[#c98e29] text-[#004B39] font-extrabold text-xs py-4 rounded-full shadow-lg transition-all uppercase tracking-wider text-center"
                >
                  SEND ENQUIRY
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
