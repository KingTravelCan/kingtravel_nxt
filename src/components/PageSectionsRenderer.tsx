"use client";

import Image from 'next/image';
import Link from 'next/link';
import MarqueeTrack from '@/components/MarqueeTrack';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import DynamicIcon from '@/components/ui/DynamicIcon';
import ContactFormSection from '@/components/ContactFormSection';
import VisaSolutionsSection from '@/components/VisaSolutionsSection';
import HomepageHeroBanner from '@/components/HomepageHeroBanner';
import WhoWeAreSection from '@/components/WhoWeAreSection';
import UpcomingUmrahPackages from '@/components/UpcomingUmrahPackages';
import TravelServicesSection from '@/components/TravelServicesSection';
import WhatWeProvideSection from '@/components/WhatWeProvideSection';
import HajjPackagesSection from '@/components/HajjPackagesSection';
import CertificationsFlipCardsSection from '@/components/CertificationsFlipCardsSection';

export default function PageSectionsRenderer({ sections, pageData }: { sections: any[], pageData?: any }) {
  if (!sections || !Array.isArray(sections)) return null;

  return (
    <div className="w-full">
      {sections.map((sec: any, idx: number) => {
        if (!sec || !sec.type) return null;
        if (sec.type === 'Certifications Flip Cards' || sec.type === 'Our Certifications') {
          return <CertificationsFlipCardsSection key={idx} data={sec.data || {}} />;
        }
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
                <h2 className=" mb-4">
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
                      <span className="eyebrow block">
                        {sec.data.eyebrow}
                      </span>
                    )}
                    <h2
                      className=""
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
            <section key={idx} className="py-14 bg-[#004B39]">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center flex flex-col mb-10">
                  {sec.data?.eyebrow && (
                    <span className="eyebrow mx-auto">
                      {sec.data.eyebrow}
                    </span>
                  )}
                  <h2 className="text-3xl md:text-4xl font-serif text-white font-normal">
                    {sec.data?.title || "What our clients say"}
                  </h2>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
                  <div className="reviews-owner-details">
                    <img
                        src="/img/round-logo.png"
                        className="w-16 h-16 rounded-full border border-white/20 object-cover"
                        alt="King Travel logo"
                      />
                    <div className="reviews-owner">
                      <b>King Travel Can Ltd - Mississauga</b>
                     <div className="stars">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          aria-hidden="true" 
                          className="lucide lucide-star"
                        >
                          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                        </svg>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          aria-hidden="true" 
                          className="lucide lucide-star"
                        >
                          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                        </svg>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          aria-hidden="true" 
                          className="lucide lucide-star"
                        >
                          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                        </svg>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          aria-hidden="true" 
                          className="lucide lucide-star"
                        >
                          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 16 15" version="1.1" xmlSpace="preserve" strokeMiterlimit="2" style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round' }}>
                            <g transform="matrix(1,0,0,1,-447.393,-260.031)">
                              <g transform="matrix(1.01647,0,0,1.01647,4.97715,-123.684)">
                                <path 
                                  d="M442.928,389.411C442.802,389.411 442.68,389.451 442.578,389.525L439.127,392.034C438.852,392.234 438.48,392.234 438.205,392.034C437.929,391.834 437.814,391.48 437.92,391.156L439.239,387.099C439.278,386.98 439.278,386.851 439.239,386.731C439.201,386.612 439.125,386.508 439.023,386.434L435.571,383.927C435.296,383.727 435.18,383.373 435.285,383.05C435.391,382.726 435.692,382.507 436.032,382.507L440.298,382.509C440.424,382.509 440.547,382.469 440.648,382.395C440.75,382.321 440.826,382.217 440.864,382.098L442.181,378.04C442.286,377.716 442.588,377.497 442.928,377.497L442.928,389.411Z" 
                                  style={{ fill: 'rgb(246,187,6)' }}
                                />
                              </g>
                              <g transform="matrix(-1.01647,0,0,1.01647,905.424,-123.684)">
                                <path 
                                  d="M442.928,389.411C442.802,389.411 442.68,389.451 442.578,389.525L439.127,392.034C438.852,392.234 438.48,392.234 438.205,392.034C437.929,391.834 437.814,391.48 437.92,391.156L439.239,387.099C439.278,386.98 439.278,386.851 439.239,386.731C439.201,386.612 439.125,386.508 439.023,386.434L435.571,383.927C435.296,383.727 435.18,383.373 435.285,383.05C435.391,382.726 435.692,382.507 436.032,382.507L440.298,382.509C440.424,382.509 440.547,382.469 440.648,382.395C440.75,382.321 440.826,382.217 440.864,382.098L442.181,378.04C442.286,377.716 442.588,377.497 442.928,377.497L442.928,389.411Z" 
                                  style={{ fill: 'rgb(204,204,204)' }}
                                />
                              </g>
                            </g>
                          </svg>
                      </div>
                      <span className="review-count">{sec.data?.reviewCount || "943"} Google reviews</span>
                      {sec.data?.reviewLink && (
                      <a
                        href={sec.data.reviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit inline-block border border-white/40 text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors"
                      >
                        {sec.data?.ctaLabel || "Write A Review"}
                      </a>
                    )}
                    </div>
                  </div>
                                   
                  <div className="lg:w-3/4 w-full">
                    <TestimonialsCarousel />
                  </div>
                </div>
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
            <section key={idx} className="">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center flex flex-col mb-8">
                  {sec.data?.eyebrow && (
                    <span className="eyebrow mx-auto">
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

        // ── Travel Organization ───────────────────────────────────────────────
        if (sec.type === "Travel Organization") {
          const logos: { src: string; alt: string }[] = (sec.data?.logos || []).map((l: any) => ({
            src: l.src || "",
            alt: l.alt || "",
          }));
          return (
            <section key={idx} className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-cente text-center mb-8">
                  {sec.data?.eyebrow && (
                    <span className="eyebrow mx-auto">
                      {sec.data.eyebrow}
                    </span>
                  )}
                  <h2 className=" font-normal">
                    {sec.data?.title || "Trusted Travel Organizations"}
                  </h2>
                </div>
                {logos.length > 0 ? (
                  <MarqueeTrack
                    type="travel"
                    images={logos}
                    speedMs={sec.data?.speedMs || 30000}
                    direction={sec.data?.direction || "left"}
                    cardStyle={true}
                  />
                ) : (
                  <p className="text-center text-slate-400 text-sm">No organization logos configured yet.</p>
                )}
              </div>
            </section>
          );
        }

        // ── Visa Solutions ───────────────────────────────────────────────────
        if (sec.type === 'Visa Solutions' || sec.type === 'Visa Solutions Grid' || sec.type === 'Visa Cards') {
          return <VisaSolutionsSection key={idx} data={sec.data} />;
        }

        // ── Contact ───────────────────────────────────────────────────────────
        if (sec.type === "Contact") {
          return <ContactFormSection key={idx} data={sec.data || {}} />;
        }

        if (sec.type === "Homepage Hero Banner" || sec.type === "Hero Slider") {
          return <HomepageHeroBanner key={idx} data={sec.data} pageData={pageData} />;
        }
        
        if (sec.type === "Who We Are" || sec.type === "Image+Text" || sec.type === "Intro") {
          return <WhoWeAreSection key={idx} data={sec.data} />;
        }
        
        if (sec.type === "Upcoming Umrah Packages" || sec.type === "Umrah Packages" || sec.type === "Umrah Packages Grid") {
          return <UpcomingUmrahPackages key={idx} data={sec.data} />;
        }

        if (sec.type === "Travel Services" || sec.type === "Services Grid" || sec.type === "Umrah Services Grid" || sec.type === "Hajj Services Grid") {
          return <TravelServicesSection key={idx} data={sec.data} />;
        }

        if (sec.type === "What We Provide" || sec.type === "Why Choose Us" || sec.type === "Stats Grid" || sec.type === "Accreditations Bar") {
          return <WhatWeProvideSection key={idx} data={sec.data} />;
        }

        if (sec.type === "Hajj Packages" || sec.type === "Packages Grid") {
          return <HajjPackagesSection key={idx} data={sec.data} />;
        }

        // Return null for any unmapped sections
        return null;
      })}
    </div>
  );
}
