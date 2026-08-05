"use client";

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPageBySlug } from '@/actions/pageActions';
import PageBanner from '@/components/PageBanner';
import MarqueeTrack from '@/components/MarqueeTrack';
import PackageDetailModal, { PackageDetailData } from "@/components/PackageDetailModal";
import PageSeoHead from "@/components/PageSeoHead";

export default function DynamicPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slugPath = '/' + (Array.isArray(rawSlug) ? rawSlug.join('/') : (rawSlug || ''));

  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDetailPkg, setSelectedDetailPkg] = useState<PackageDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPageBySlug(slugPath);
        if (!data || data.status === 'draft') {
          setPage(null);
        } else {
          setPage(data);
        }
      } catch {
        setPage(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slugPath]);

  if (loading) {
    return (
      <main className="bg-[#f2f5f3] min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-[#004B39] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-extrabold text-[#004B39] uppercase tracking-widest">Loading Page Content...</p>
      </main>
    );
  }
  if (!page) notFound();

  let sections: any[] = [];
  if (page.sections) {
    try {
      sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
    } catch (e) {
      sections = [];
    }
  }

  return (
    <main className="bg-[#f2f5f3] min-h-screen pb-16">
      <PageSeoHead pageTitle={page.title} seoData={page.seoData} />
      <PackageDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        pkg={selectedDetailPkg}
      />
      {/* Dynamic Hero Banner */}
      <PageBanner
        title={page.bannerTitle || page.title}
        description={page.bannerDescription || ''}
        bgImage={page.bannerBgImage || undefined}
        position={page.bannerPosition || undefined}
        size={page.bannerSize || undefined}
      />

      {/* Dynamic Page Content / Sections */}
      {sections.length > 0 ? (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
          {sections.map((sec: any, idx: number) => {
            if (sec.type === 'Who We Are (Intro & Stats)' || sec.type === 'Who We Are') {
              const eyebrow = sec.data?.eyebrow || 'WHO WE ARE';
              const title = sec.data?.title || 'We provide and offer Hajj & Umrah packages';
              const desc = sec.data?.description || 'King Travel proudly provides reliable and professional Hajj and Umrah services across Canada. With years of experience serving the Muslim community, we are committed to making your sacred journey smooth, comfortable, and spiritually fulfilling. Whether you are traveling for Hajj, Umrah, or Saudi Visa services, our expert team is here to guide you every step of the way.';
              const img = sec.data?.image || 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80';
              const badgeText = sec.data?.quoteBadgeText || '"Every detail handled — from Visa to hotel, steps from the Haram."';
              const s1Num = sec.data?.stat1Num || '25+';
              const s1Label = sec.data?.stat1Label || 'Years Serving Canada';
              const s2Num = sec.data?.stat2Num || '10,000+';
              const s2Label = sec.data?.stat2Label || 'Pilgrims Guided';
              const s3Num = sec.data?.stat3Num || '5★';
              const s3Label = sec.data?.stat3Label || 'Hotels, Every Package';

              return (
                <section key={idx} className="bg-[#FAF8F5] rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 relative">
                    <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 max-h-[440px]">
                      <img src={img} alt={title} className="w-full h-full object-cover min-h-[360px]" />
                    </div>
                    {badgeText && (
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 max-w-[260px]">
                        <div className="flex gap-1 text-amber-400 text-xs mb-1">★★★★★</div>
                        <p className="text-[11px] text-slate-700 font-medium leading-snug m-0">{badgeText}</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-6 space-y-6">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] block mb-2">{eyebrow}</span>
                      <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#004B39] leading-tight">{title}</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans">{desc}</p>
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/60">
                      <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100">
                        <div className="text-xl md:text-2xl font-serif font-extrabold text-[#DB9E30]">{s1Num}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1">{s1Label}</div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100">
                        <div className="text-xl md:text-2xl font-serif font-extrabold text-[#DB9E30]">{s2Num}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1">{s2Label}</div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100">
                        <div className="text-xl md:text-2xl font-serif font-extrabold text-[#DB9E30]">{s3Num}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1">{s3Label}</div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            if (sec.type === 'Exclusive Upcoming Umrah Packages') {
              const eyebrow = sec.data?.eyebrow || 'EXCLUSIVE UPCOMING';
              const title = sec.data?.title || 'Umrah Packages from Canada';
              const subtext = sec.data?.subtext || 'Departures from CAD 2,595 per person. Availability and accommodations are confirmed with every booking — contact us before reserving.';
              const btnText = sec.data?.btnText || 'SEE ALL PACKAGES →';
              const btnLink = sec.data?.btnLink || '/umrah/packages';

              const packagesData = [
                { badge: '5 STAR', image: '/img/kaaba.png', month: 'AUGUST · 2026', title: '5 Star Umrah Package', price: 'CAD 2,895', isGold: false },
                { badge: '5 STAR', image: '/img/hero.png', month: 'SEPTEMBER · 2026', title: '5 Star Umrah Package', price: 'CAD 2,695', isGold: true },
                { badge: '5 STAR', image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80', month: 'OCTOBER · 2026', title: '5 Star Umrah Package', price: 'CAD 2,795', isGold: false },
                { badge: '5 STAR', image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80', month: 'NOVEMBER · 2026', title: '5 Star Umrah Package', price: 'CAD 2,795', isGold: true },
              ];

              return (
                <section key={idx} className="py-8 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] block mb-1">{eyebrow}</span>
                      <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#004B39]">{title}</h2>
                    </div>
                    {subtext && <p className="text-xs text-slate-500 max-w-md font-medium leading-relaxed m-0">{subtext}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packagesData.map((pkg, pIdx) => (
                      <div
                        key={pIdx}
                        className={`rounded-3xl overflow-hidden shadow-lg border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${pkg.isGold ? 'bg-[#DB9E30] border-[#DB9E30] text-slate-900' : 'bg-white border-slate-100 text-slate-900'
                          }`}
                      >
                        <div>
                          <div className="relative h-44 overflow-hidden">
                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#004B39] font-black text-[10px] px-2.5 py-1 rounded-md z-10 shadow-xs">
                              {pkg.badge}
                            </span>
                            <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-5 space-y-3">
                            <div className="text-[10px] font-extrabold tracking-wider uppercase opacity-75">{pkg.month}</div>
                            <h3 className="text-lg font-serif font-bold leading-snug m-0">{pkg.title}</h3>
                            <div className="text-lg font-extrabold text-[#004B39]">
                              {pkg.price} <span className="text-xs font-normal text-slate-600">/ Person</span>
                            </div>
                            <div className="pt-2 border-t border-slate-900/10 space-y-2 text-xs opacity-90">
                              <div className="font-bold text-[10px] tracking-wider uppercase">PACKAGE INCLUDES</div>
                              <ul className="space-y-1.5 list-none p-0 m-0 text-[11px]">
                                <li>✈ Return Flights from Toronto</li>
                                <li>🚌 Luxury Ground Transportation</li>
                                <li>👕 Free Ihram Kit</li>
                                <li>📄 Registration & Visa Assistance</li>
                                <li>👤 Imam Lead Guide & Seminar</li>
                                <li>🏨 5 Star Hotels Makkah & Madinah</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="p-5 pt-0">
                          <Link
                            href={btnLink}
                            className={`block w-full text-center py-2.5 rounded-full font-extrabold text-xs transition-all ${pkg.isGold
                              ? 'bg-[#1c2925] text-white hover:bg-black'
                              : 'bg-[#DB9E30] text-[#004B39] hover:bg-[#004B39] hover:text-white'
                              }`}
                          >
                            BOOK NOW
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-4">
                    <Link
                      href={btnLink}
                      className="inline-block border border-slate-300 hover:border-[#004B39] bg-white text-[#004B39] hover:bg-[#004B39] hover:text-white px-8 py-3 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all shadow-xs"
                    >
                      {btnText}
                    </Link>
                  </div>
                </section>
              );
            }

            if (sec.type === 'Select Preferred Travel Service') {
              const eyebrow = sec.data?.eyebrow || 'SERVICES WE OFFER';
              const title = sec.data?.title || 'Select your preferred travel service';
              const services = (sec.data?.services && Array.isArray(sec.data.services)) ? sec.data.services : [
                { icon: '★', title: 'Umrah Packages', description: 'Flexible departures with flights, stays, & guidance included.', link: '/umrah/packages' },
                { icon: '', title: 'Hajj Packages', description: 'Fully accredited pilgrimage packages, curated end to end.', link: '/hajj/packages' },
                { icon: '✈', title: 'Airline Tickets', description: 'Best-fare flights sourced from every route into Jeddah.', link: '/airlines' },
                { icon: '📄', title: 'Saudi Visa Services', description: 'Full visa processing, handled and confirmed before departure.', link: '/saudi-visa' },
                { icon: '🏨', title: 'Hotel Booking', description: '5-star stays within walking distance of the Haram.', link: '/contact' },
                { icon: '🌐', title: 'Global Flight Reservations', description: 'Worldwide reliable flight bookings for any itinerary.', link: '/airlines' },
                { icon: '📑', title: 'Travel Documentation', description: 'Guidance on every document your journey requires.', link: '/contact' },
                { icon: '👤', title: 'Group & Private Tours', description: 'Private, guided, and fully customizable itineraries.', link: '/contact' },
              ];

              return (
                <section key={idx} className="bg-[#FAF8F5] rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] block">{eyebrow}</span>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#004B39]">{title}</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {services.map((srv: any, sIdx: number) => (
                      <Link
                        key={sIdx}
                        href={srv.link || '/contact'}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between no-underline"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#DB9E30] text-lg font-bold group-hover:scale-110 transition-transform">
                            {srv.icon === 'star' ? '★' : srv.icon === 'kaaba' ? '' : srv.icon === 'plane' ? '✈' : srv.icon === 'visa' ? '📄' : srv.icon === 'hotel' ? '🏨' : srv.icon === 'globe' ? '🌐' : srv.icon === 'file' ? '📑' : '👤'}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 m-0 group-hover:text-[#004B39] transition-colors">{srv.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed m-0 font-normal">{srv.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            }

            if (sec.type === 'What We Provide (Numbered Features)') {
              const eyebrow = sec.data?.eyebrow || 'WHAT WE PROVIDE';
              const title = sec.data?.title || 'Lowest fares, exclusive travel deals, real trust';
              const img = sec.data?.image || 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80';
              const features = (sec.data?.features && Array.isArray(sec.data.features)) ? sec.data.features : [
                { num: '01', title: 'Lowest Fares', description: 'We offer the lowest rates on the market, sourced across every route into Jeddah.' },
                { num: '02', title: 'Special Deals', description: 'Fixed-price Umrah packages with hotels, meals and transport included.' },
                { num: '03', title: 'Trusted & Certified', description: 'A fully accredited travel agency you can rely on, licensed across Canada.' },
                { num: '04', title: 'Pilgrimage Services', description: 'Visa processing, group support — the full spiritual journey, arranged.' },
              ];

              return (
                <section key={idx} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 max-h-[480px]">
                    <img src={img} alt={title} className="w-full h-full object-cover min-h-[380px]" />
                  </div>

                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] block mb-2">{eyebrow}</span>
                      <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#004B39] leading-tight">{title}</h2>
                    </div>

                    <div className="space-y-4 pt-2">
                      {features.map((feat: any, fIdx: number) => (
                        <div key={fIdx} className="bg-[#FAF8F5] rounded-2xl p-4 border border-slate-100 flex items-start gap-4 shadow-xs">
                          <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300/60 text-[#DB9E30] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {feat.num || `0${fIdx + 1}`}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 m-0 mb-1">{feat.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-normal m-0">{feat.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            if (sec.type === 'Image+Text' || sec.type === 'Why Choose Us') {
              return (
                <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {sec.data?.image && (
                    <div className="rounded-2xl overflow-hidden shadow-md">
                      <Image src={sec.data.image} alt={sec.data.title || ''} width={800} height={450} className="w-full h-auto object-cover" unoptimized />
                    </div>
                  )}
                  <div className="space-y-4">
                    {sec.data?.eyebrow && <span className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30]">{sec.data.eyebrow}</span>}
                    {sec.data?.title && <h2 className="text-2xl font-serif font-bold text-[#004B39]">{sec.data.title}</h2>}
                    {sec.data?.description && <p className="text-slate-600 leading-relaxed text-sm">{sec.data.description}</p>}
                  </div>
                </div>
              );
            }

            if (sec.type === 'Certifications Flip Cards' || sec.type === 'Our Certifications') {
              const bgImg = sec.data?.bgImage || 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1920&q=80';
              const items = (sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                { logo: '/img/tico-logo.png', title: 'TICO – Travel Industry Council of Ontario', description: 'TICO regulates travel agencies in Ontario, protecting consumer prepaid funds and ensuring compliance with strict Canadian travel industry regulations.' },
                { logo: '/img/iata-logo.png', title: 'IATA – International Air Transport Association', description: 'Being an IATA accredited agency allows us to work directly with airlines, offering competitive airfares, seamless ticketing, and exclusive travel deals.' },
                { logo: '/img/acta-logo.png', title: 'ACTA – Association of Canadian Travel Agencies', description: 'ACTA membership advocates for ethical travel practices and professional excellence across the Canadian travel industry.' },
                { logo: '/img/asta-logo.png', title: 'ASTA – American Society of Travel Advisors', description: 'ASTA certification connects us with global travel standards and verified international destination management networks.' },
                { logo: '/img/atac-logo.png', title: 'ATAC – Air Transportation Association of Canada', description: 'ATAC represents air transport excellence and safe aviation ticketing protocols across Canada.' },
                { logo: '/img/mofa-logo.png', title: 'Saudi Ministry of Foreign Affairs', description: 'Official Saudi Ministry authorization for processing Umrah, Hajj, business, and tourist visas directly from Canada.' }
              ];

              return (
                <section
                  key={idx}
                  ref={(el) => {
                    if (el) {
                      el.style.backgroundImage = `linear-gradient(rgba(7, 19, 16, 0.85), rgba(7, 19, 16, 0.85)), url("${bgImg}")`;
                    }
                  }}
                  className="!w-full relative py-16 overflow-hidden bg-cover bg-center shadow-xl"
                >
                  <div className="max-w-6xl mx-auto text-center mb-12">
                    <div className="text-xs font-bold uppercase tracking-widest text-[#DB9E30] mb-2">
                      {sec.data?.eyebrow || 'WHY THEY MATTER'}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wider">
                      {sec.data?.title || 'OUR CERTIFICATIONS'}
                    </h2>
                  </div>

                  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {items.map((item: any, cIdx: number) => (
                      <div
                        key={cIdx}
                        className="group h-[240px] [perspective:1000px] cursor-pointer"
                      >
                        <div className="relative w-full h-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-lg">
                          {/* Front Side: Only Logo */}
                          <div className="absolute inset-0 w-full h-full bg-white rounded-2xl p-6 flex items-center justify-center [backface-visibility:hidden]">
                            {item.logo ? (
                              item.logo.startsWith('data:') ? (
                                <img src={item.logo} alt={item.title || 'Certification'} className="max-h-[140px] max-w-[85%] object-contain" />
                              ) : (
                                <Image src={item.logo} alt={item.title || 'Certification'} width={220} height={120} className="max-h-[140px] w-auto max-w-[85%] object-contain" unoptimized />
                              )
                            ) : (
                              <span className="text-lg font-bold text-[#004B39] text-center">{item.title}</span>
                            )}
                          </div>

                          {/* Back Side: Title & Description */}
                          <div className="absolute inset-0 w-full h-full bg-[#f1f8f5] border border-emerald-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                            <h3 className="text-sm font-extrabold text-[#004B39] mb-3 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sec.type === 'Airlines Marquee' || sec.type === 'Partners Marquee' || sec.type === 'Airlines Logo Carousel' || sec.type === 'Logo Carousel') {
              const defaultLogos = [
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
              const logos = (sec.data?.logos && Array.isArray(sec.data.logos) && sec.data.logos.length > 0)
                ? sec.data.logos
                : defaultLogos;

              return (
                <section key={idx} className="py-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <div className="text-center mb-6">
                    {sec.data?.eyebrow && <span className="text-xs font-bold uppercase tracking-widest text-[#DB9E30] block mb-1">{sec.data.eyebrow}</span>}
                    {sec.data?.title && <h2 className="text-2xl font-serif text-[#004B39]">{sec.data.title}</h2>}
                  </div>
                  <MarqueeTrack
                    type="airline"
                    images={logos}
                    speedMs={sec.data?.speedMs}
                    direction={sec.data?.direction}
                  />
                </section>
              );
            }

            if (sec.type === 'Hajj Packages Grid' || sec.type === 'Hajj Cards') {
              const items = (sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0)
                ? sec.data.items
                : [
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
                ];

              return (
                <section key={idx} className="packages-grid-container py-12 max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((card: any, cIdx: number) => {
                      const badgeTag = card.badgeTag || "HAJJ 2027";
                      const duration = card.duration || "14Days";
                      const flightRoute = card.flightRoute || "FROM CANADA ➔ TO SAUDIA";
                      const heroImage = card.heroImage || "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg";
                      const title = card.title || "Hajj Package 2027";
                      const price = card.price || "12,995";
                      const priceSubtext = card.priceSubtext || "FROM CAD / QUAD OCCUPANCY";
                      const operatorName = card.operatorName || "King Travel";
                      const operatorRating = card.operatorRating || "4.4/5";
                      const btnLabel = card.btnLabel || "Book Hajj 2027";
                      const btnLink = card.btnLink || "/contact";

                      const makkahImg = card.makkahHotel?.image || "https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg";
                      const makkahName = card.makkahHotel?.name || "5 Star Hotel in Makkah";
                      const makkahLoc = card.makkahHotel?.location || "Near to Haram";
                      const makkahBadge = card.makkahHotel?.badge || "Breakfast";
                      const makkahNights = card.makkahHotel?.nights || "6 Nights";

                      const madinahImg = card.madinahHotel?.image || "https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg";
                      const madinahName = card.madinahHotel?.name || "5 Star Hotel in Madinah";
                      const madinahLoc = card.madinahHotel?.location || "Near to Masjid Nabawi";
                      const madinahBadge = card.madinahHotel?.badge || "Breakfast";
                      const madinahNights = card.madinahHotel?.nights || "6 Nights";

                      return (
                        <article key={card.id || cIdx} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 flex flex-col group transition-all duration-300 hover:shadow-2xl">
                          {/* Hero Header Image */}
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={heroImage}
                              alt={title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                            {/* Top Bar Tags */}
                            <div className="absolute top-4 inset-x-4 flex justify-between items-center text-xs">
                              <div className="bg-[#0a422d]/90 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                                <i className="fa-solid fa-kaaba text-[#DB9E30]"></i>
                                <span>{badgeTag}</span>
                              </div>
                              <div className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                <i className="fa-solid fa-calendar-days"></i>
                                <span>{duration}</span>
                              </div>
                            </div>

                            {/* Title & Route Placement */}
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <div className="text-[#6ee7b7] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                <i className="fa-solid fa-plane text-xs"></i> {flightRoute}
                              </div>
                              <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-3">Accommodations</span>

                              {/* Makkah Hotel */}
                              <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100/50 mb-3">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                  <Image
                                    src={makkahImg}
                                    alt={makkahName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-slate-800 truncate">{makkahName}</h4>
                                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <i className="fa-solid fa-location-dot text-[#004B39]"></i>
                                    <span>{makkahLoc}</span>
                                  </p>
                                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                    <span className="text-[9px] font-bold bg-[#004B39] text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                                      <i className="fa-solid fa-utensils text-[8px]"></i>
                                      <span>{makkahBadge}</span>
                                    </span>
                                    <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{makkahNights}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Madinah Hotel */}
                              <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40 mb-3">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                  <Image
                                    src={madinahImg}
                                    alt={madinahName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-slate-800 truncate">{madinahName}</h4>
                                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <i className="fa-solid fa-location-dot text-[#DB9E30]"></i>
                                    <span>{madinahLoc}</span>
                                  </p>
                                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                    <span className="text-[9px] font-bold bg-[#004B39] text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                                      <i className="fa-solid fa-utensils text-[8px]"></i>
                                      <span>{madinahBadge}</span>
                                    </span>
                                    <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{madinahNights}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Footer Meta & Actions */}
                            <div className="pt-4 border-t border-slate-100 mt-4 space-y-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">OPERATOR</span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs font-bold text-slate-800">{operatorName}</span>
                                    <span className="text-[9px] font-extrabold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">{operatorRating}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">{priceSubtext}</span>
                                  <div className="text-[24px] font-black text-[#004B39] text-right leading-none">{price}</div>
                                </div>
                              </div>

                              <Link
                                href={`/package/${card.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                className="w-full bg-[#DB9E30] hover:bg-[#b88222] text-slate-950 font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
                              >
                                <i className="fa-solid fa-book-bookmark"></i>
                                <span>{btnLabel}</span>
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            }

            if (sec.type === 'Latest Blogs Grid' || sec.type === 'Blog Posts Carousel') {
              const eyebrow = sec.data?.eyebrow || 'LATEST NEWS & GUIDES';
              const title = sec.data?.title || 'Articles, Tips & Spiritual Insights';
              const showThumbnail = sec.data?.showThumbnail !== false;
              const showDate = sec.data?.showDate !== false;
              const TitleTag = sec.data?.titleTag === 'h3' ? 'h3' : 'h2';

              return (
                <section key={idx} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30] block mb-1">{eyebrow}</span>
                      <TitleTag className="text-2xl md:text-4xl font-serif font-bold text-[#004B39]">{title}</TitleTag>
                    </div>
                    <Link
                      href="/blogs"
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-[#004B39] hover:gap-3 transition-all no-underline"
                    >
                      View All Articles <span className="text-[#DB9E30]">→</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "Ultimate Guide to Umrah 2026", date: "August 4, 2026", image: "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg", slug: "ultimate-guide-to-umrah-2026" },
                      { title: "Essential Hajj Preparation Checklist", date: "August 2, 2026", image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80", slug: "essential-hajj-preparation-checklist" },
                      { title: "Saudi Visa Requirements for Canadian Pilgrims", date: "July 28, 2026", image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80", slug: "saudi-visa-requirements-for-canadian-pilgrims" }
                    ].map((blogItem, bIdx) => (
                      <Link key={bIdx} href={`/blogs/${blogItem.slug}`} className="group flex flex-col rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 hover:shadow-lg transition-all no-underline">
                        {showThumbnail && (
                          <div className="h-44 overflow-hidden relative">
                            <img src={blogItem.image} alt={blogItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="p-5 flex flex-col justify-between flex-1">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#004B39] transition-colors leading-snug mb-2">{blogItem.title}</h3>
                          {showDate && <div className="text-[11px] text-slate-400 font-medium">{blogItem.date}</div>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            }

            if (sec.type === 'Text Block (Rich Text)') {
              let content: string = sec.data?.content || '';
              if (!content) return null;
              content = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, '\u00a0');
              const innerM = content.match(/^<p>([\s\S]*)<\/p>$/);
              if (innerM) { const inner = innerM[1].trim(); if (/^<(h[1-6]|ul|ol|blockquote)/.test(inner)) content = inner; }
              if (!content || content === '<p></p>') return null;
              return (
                <section key={idx} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                  <div
                    className="prose prose-slate prose-headings:font-serif prose-headings:text-[#004B39] prose-a:text-[#004B39] prose-strong:text-slate-900 max-w-none text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </section>
              );
            }

            return (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                {sec.title && <h2 className="text-2xl font-bold text-slate-800 mb-4">{sec.title}</h2>}
                {sec.data?.description && <p className="text-slate-600 leading-relaxed">{sec.data.description}</p>}
              </div>
            );
          })}
        </div>
      ) : page.richText ? (
        <div className="w-full max-w-4xl mx-auto px-4 py-12 prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: page.richText }} />
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-700">{page.title}</h2>
          <p className="text-green mt-2">Content coming soon.</p>
        </div>
      )}
    </main>
  );
}
