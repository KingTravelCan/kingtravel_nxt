"use client";

import Image from 'next/image';
import Link from 'next/link';
import MarqueeTrack from '@/components/MarqueeTrack';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import DynamicIcon from '@/components/ui/DynamicIcon';
import ContactFormSection from '@/components/ContactFormSection';

export default function PageSectionsRenderer({ sections }: { sections: any[] }) {
  if (!sections || !Array.isArray(sections)) return null;

  return (
    <div className="w-full">
      {sections.map((sec: any, idx: number) => {
        if (!sec || !sec.type) return null;
        if (sec.type === 'Text Block (Rich Text)') {
          let content: string = sec.data?.content || '';
          if (!content) return null;
          content = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, '\u00a0');
          const innerM = content.match(/^<p>([\s\S]*)<\/p>$/);
          if (innerM) { const inner = innerM[1].trim(); if (/^<(h[1-6]|ul|ol|blockquote)/.test(inner)) content = inner; }
          if (!content || content === '<p></p>') return null;
          return (
            <section key={idx} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 max-w-5xl mx-auto my-8 w-full">
              <div
                className="prose prose-slate prose-headings:font-serif prose-headings:text-[#004B39] prose-a:text-[#004B39] prose-strong:text-slate-900 max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </section>
          );
        }

        if (sec.type === "Available Flights Grid" || sec.type === "Flights Cards") {
          const flights = (sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0)
            ? sec.data.items
            : [
              { code: "PIA", name: "Pakistan International Airlines", operatedBy: "Operated By PIA", originCode: "LHR", originCity: "London", destCode: "JED", destCity: "Jeddah", time: "14:20", price: "CAD 1,250.00" },
              { code: "SA", name: "Saudia Airlines", operatedBy: "Operated By Saudia", originCode: "LHR", originCity: "London", destCode: "MED", destCity: "Madinah", time: "18:45", price: "CAD 1,380.00" }
            ];

          return (
            <section key={idx} className="pt-14">
              <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-8">
                  <span className="text-emerald-800 font-semibold uppercase tracking-wider text-sm block mb-1">
                    {sec.data?.eyebrow || "AVAILABLE FLIGHTS"}
                  </span>
                  <h2 className="text-3xl font-serif text-gray-900 tracking-tight">
                    {sec.data?.title || "BEST FARES, LIMITED AVAILABILITY FROM LONDON"}
                  </h2>
                </div>
                <div className="space-y-6 mb-12">
                  {(sec.data?.items || [
                    { code: "PIA", name: "Pakistan International Airlines", operatedBy: "Operated By PIA", originCode: "LHR", originCity: "London", destCode: "JED", destCity: "Jeddah", time: "14:20", price: "CAD 1,250.00" },
                    { code: "SA", name: "Saudia Airlines", operatedBy: "Operated By Saudia", originCode: "LHR", originCity: "London", destCode: "MED", destCity: "Madinah", time: "18:45", price: "CAD 1,380.00" }
                  ]).map((flight: any, fIdx: number) => (
                    <div
                      key={fIdx}
                      className="bg-white shadow-lg rounded-2xl border border-gray-200/60 p-6 md:p-8 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
                        {/* Left: Airline Info */}
                        <div className="flex items-center gap-4 min-w-[280px]">
                          <div className="bg-emerald-900 text-white font-bold px-3 py-2 rounded text-base tracking-wide flex items-center justify-center min-w-[54px] h-[44px]">
                            {flight.code || "PIA"}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{flight.name}</h4>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">{flight.operatedBy || "Operated By PIA"}</p>
                          </div>
                        </div>

                        {/* Middle: Route & Times */}
                        <div className="flex flex-1 items-center justify-between max-w-md mx-auto w-full px-2">
                          <div className="text-center md:text-left">
                            <span className="block text-2xl font-bold text-gray-900">{flight.originCode || "LHR"}</span>
                            <span className="text-xs text-gray-400 font-medium">{flight.originCity || "London"}</span>
                          </div>

                          <div className="flex-1 flex items-center justify-center px-4 relative">
                            <div className="w-full border-t border-dashed border-gray-300 absolute"></div>
                            <div className="bg-gray-100 px-2 z-10 rounded-full py-1">
                              <i className="fa-solid fa-plane text-sky-400 text-sm rotate-45"></i>
                            </div>
                          </div>

                          <div className="text-center md:text-left">
                            <span className="block text-2xl font-bold text-gray-900">{flight.destCode || "JED"}</span>
                            <span className="text-xs text-gray-400 font-medium">{flight.destCity || "Jeddah"}</span>
                          </div>

                          <div className="h-8 border-l border-gray-300 mx-6 hidden md:block"></div>

                          <div className="text-center md:text-left">
                            <span className="block text-xl font-bold text-gray-900">{flight.time || "14:20"}</span>
                            <span className="text-xs text-gray-400 font-medium">{flight.originCode || "LHR"}</span>
                          </div>
                        </div>

                        {/* Right: Pricing & CTA */}
                        <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-0 pt-4 md:pt-0 border-gray-200">
                          <div>
                            <span className="text-xs font-semibold text-gray-500 block md:hidden">Price</span>
                            <span className="text-2xl font-extrabold text-gray-900">{flight.price || "CAD 1,250.00"}</span>
                          </div>
                          <a
                            href={`https://wa.me/19056248344?text=Hi,%20I'm%20interested%20in%20booking%20this%20flight%20(${encodeURIComponent(flight.name)})`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-900 text-white hover:bg-[#DB9E30] hover:text-slate-900 font-bold py-3 px-8 rounded-lg tracking-wide shadow-sm transition-all duration-150 cursor-pointer text-sm w-full md:w-auto inline-block text-center"
                          >
                            Booking
                          </a>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-gray-300/80 pt-4 text-right">
                        <span className="text-xs font-medium text-gray-500">Price Per Person (Incl. Taxes &amp; Fees)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (sec.type === "Flight Assistance CTA" || sec.type === "Flight Desk CTA") {
          return (
            <section key={idx} className="tint mt-12 py-20 bg-emerald-50/60 border-t border-emerald-100">
              <div className="wrap text-center max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-serif text-[#004B39] mb-4">
                  {sec.data?.title || "Need Flight Booking Assistance?"}
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed font-light">
                  {sec.data?.description || "Speak directly with our ticketing specialists to get custom quotes, group flight discounts, and immediate confirmations."}
                </p>
                <Link href={sec.data?.btnLink || "/contact"} className="inline-block bg-[#004B39] hover:bg-[#DB9E30] text-white hover:text-slate-900 font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm">
                  {sec.data?.btnLabel || "Contact Flight Desk"}
                </Link>
              </div>
            </section>
          );
        }

        // ── Skip hero – already rendered in page.tsx ──────────────────────────
        if (sec.type === "Homepage Hero Banner" || sec.type === "Hero Slider") {
          return null;
        }


        // ── Sold Out Packages ─────────────────────────────────────────────────
        if (sec.type === "Sold Out Packages") {
          const items: any[] = sec.data?.items || [];
          if (items.length === 0) return null;
          return (
            <section key={idx} className="py-20 bg-[#f4f6ec]">
              <div className="max-w-[1400px] mx-auto px-4">

                {/* Header (Two Columns) */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
                  <div className="md:w-1/2">
                    {sec.data?.eyebrow && (
                      <span className="text-[#DB9E30] font-black uppercase tracking-widest text-xs mb-3 block">
                        {sec.data.eyebrow}
                      </span>
                    )}
                    <h2
                      className="text-4xl md:text-5xl font-serif text-[#004B39] leading-tight"
                      dangerouslySetInnerHTML={{ __html: sec.data?.title || "Packages Officially<br />Sold Out" }}
                    />
                  </div>
                  {sec.data?.description && (
                    <div className="md:w-1/2">
                      <p className="text-gray-700 text-sm leading-relaxed max-w-lg pt-2">
                        {sec.data.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item: any, i: number) => (
                    <article key={i} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group transition-shadow hover:shadow-md">
                      {item.heroImage && (
                        <div className="relative h-[220px] w-full overflow-hidden shrink-0">
                          <img
                            src={item.heroImage}
                            alt={item.title || "Sold Out Package"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}

                      <div className="p-8 flex-1 flex flex-col">
                        <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                          {item.month || "MAY · 2026"}
                        </div>
                        <h3 className="text-[28px] font-serif text-[#1a2b25] mb-2 leading-tight">
                          {item.title}
                        </h3>
                        <div className="text-[#1a2b25] font-black text-2xl mb-8 flex items-baseline gap-1">
                          {item.price} <span className="text-sm font-medium text-gray-500">{item.priceUnit || "/Person"}</span>
                        </div>

                        <div className="text-[10px] font-black text-[#DB9E30] uppercase tracking-widest mb-5">
                          PACKAGE INCLUDES
                        </div>

                        {item.includes && item.includes.length > 0 && (
                          <ul className="space-y-4 mb-2 flex-1">
                            {item.includes.map((inc: any, j: number) => {
                              // map some common text to icons based on the UI
                              let iconName = inc.icon || "Check";
                              if (inc.text?.toLowerCase().includes("flight")) iconName = "Plane";
                              if (inc.text?.toLowerCase().includes("transport")) iconName = "Bus";
                              if (inc.text?.toLowerCase().includes("ihram")) iconName = "Shirt";
                              if (inc.text?.toLowerCase().includes("visa")) iconName = "FileText";
                              if (inc.text?.toLowerCase().includes("guide") || inc.text?.toLowerCase().includes("imam")) iconName = "User";
                              if (inc.text?.toLowerCase().includes("hotel")) iconName = "Building";

                              return (
                                <li key={j} className="flex gap-4 items-center text-sm text-gray-600">
                                  <DynamicIcon name={iconName} className="w-4 h-4 text-gray-400 shrink-0" />
                                  <span>{inc.text}</span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // ── Testimonials ──────────────────────────────────────────────────────
        if (sec.type === "Testimonials") {
          return (
            <section key={idx} className="py-14 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                  <div>
                    {sec.data?.eyebrow && (
                      <span className="text-xs font-bold uppercase tracking-widest text-[#DB9E30] block mb-2">
                        {sec.data.eyebrow}
                      </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-serif text-[#004B39] font-normal">
                      {sec.data?.title || "What Our Clients Say"}
                    </h2>
                  </div>
                  {sec.data?.reviewLink && (
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-5 h-5 text-[#DB9E30]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-bold text-slate-800 text-sm">5.0</span>
                        {sec.data?.reviewCount && (
                          <span className="text-slate-500 text-xs">({sec.data.reviewCount}+ reviews)</span>
                        )}
                      </div>
                      <a
                        href={sec.data.reviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border border-[#004B39] text-[#004B39] font-bold text-xs px-4 py-2 rounded-full hover:bg-[#004B39] hover:text-white transition-colors"
                      >
                        {sec.data?.ctaLabel || "Write A Review"}
                      </a>
                    </div>
                  )}
                </div>
                <TestimonialsCarousel />
              </div>
            </section>
          );
        }

        // ── Airlines ──────────────────────────────────────────────────────────
        if (sec.type === "Airlines") {
          const logos: { src: string; alt: string }[] = (sec.data?.logos || []).map((l: any) => ({
            src: l.src || "",
            alt: l.alt || "",
          }));
          return (
            <section key={idx} className="py-12 bg-[#f7f3ec] border-y border-[#e8e0d0]">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                  {sec.data?.eyebrow && (
                    <span className="text-xs font-bold uppercase tracking-widest text-[#DB9E30] block mb-2">
                      {sec.data.eyebrow}
                    </span>
                  )}
                  <h2 className="text-2xl font-serif text-[#004B39] font-normal">
                    {sec.data?.title || "Airlines We Sourced Deals From"}
                  </h2>
                </div>
                {logos.length > 0 ? (
                  <MarqueeTrack
                    type="airline"
                    images={logos}
                    speedMs={sec.data?.speedMs || 30000}
                    direction={sec.data?.direction || "left"}
                  />
                ) : (
                  <p className="text-center text-slate-400 text-sm">No airline logos configured yet.</p>
                )}
              </div>
            </section>
          );
        }

        // ── Contact ───────────────────────────────────────────────────────────
        if (sec.type === "Contact") {
          return <ContactFormSection key={idx} data={sec.data || {}} />;
        }

        // ── Statically Rendered Sections (Ignore) ──────────────────────────
        const ignoredSections = [
          "Upcoming Umrah Packages",
          "Umrah Packages",
          "Hajj Packages",
          "Hajj Services Grid",
          "Umrah Services Grid",
          "Travel Services",
          "Stats Grid",
          "Intro",
          "Image+Text",
          "Why Choose Us",
          "Services Grid",
          "What We Provide",
          "Accreditations Bar",
          "Badges Cards",
          "Umrah Packages Grid",
          "Packages Grid",
          "Who We Are",
          "Homepage Hero Banner",
          "Hero Slider"
        ];
        if (ignoredSections.includes(sec.type)) {
          return null;
        }

        // Default fallback for unmapped sections
        return (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            {sec.title && <h2 className="text-2xl font-bold text-slate-800 mb-4">{sec.title}</h2>}
            {sec.data?.description && <p className="text-slate-600 leading-relaxed">{sec.data.description}</p>}
          </div>
        );
      })}
    </div>
  );
}
