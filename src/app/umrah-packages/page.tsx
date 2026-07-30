"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { getPageBySlug } from "@/actions/pageActions";

const umrahCardsData = [
  {
    id: "customize-2026",
    title: "Customize Umrah Package 2026",
    duration: "10, 15 Days",
    heroImage: "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg",
    price: "$7,499",
    makkahHotel: {
      name: "5 Star Hotel in Makkah",
      location: "Near to Haram",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg?k=13b36d624d683462058664c3aa31641cbb4c53cf07ca581f02f127e198029575&o=",
      badge: "Breakfast",
      nights: "6 Nights",
    },
    madinahHotel: {
      name: "5 Star Hotel in Madinah",
      location: "Near to Masjid Nabawi",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg?k=2d6dfd51cd0bb767e33d6cc5dc4d3f8d76da0c17140158b7b43366dc7cf66a36&o=",
      badge: "Breakfast",
      nights: "6 Nights",
    },
  },
  {
    id: "elite-platinum-2026",
    title: "Elite Platinum Umrah 2026",
    duration: "15 Days",
    heroImage: "https://images.unsplash.com/photo-1745775759814-9b60ed1718ed?q=80&w=1159&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$10,950",
    makkahHotel: {
      name: "Fairmont Clock Royal Tower",
      location: "Zero distance (In Front)",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5-XnMVZK4gPR2fok2UHalB4MgmobfdO0bUKh_VXGHMGYe_A7NQaaZ748&s=10",
      badge: "Buffet Included",
      nights: "8 Nights",
    },
    madinahHotel: {
      name: "The Oberoi Madinah",
      location: "Adjacent to Courtyard",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80",
      badge: "Buffet Included",
      nights: "7 Nights",
    },
  },
  {
    id: "express-custom-2026",
    title: "Express Custom Umrah 2026",
    duration: "10 Days",
    heroImage: "https://images.unsplash.com/photo-1586811388230-21835e10b83d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$5,850",
    makkahHotel: {
      name: "Hyatt Regency Makkah",
      location: "Jabal Omar (Short Walk)",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=300&q=80",
      badge: "Breakfast",
      nights: "5 Nights",
    },
    madinahHotel: {
      name: "Pullman Zamzam Madinah",
      location: "Walking Distance",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80",
      badge: "Breakfast",
      nights: "5 Nights",
    },
  },
];

export default function UmrahPackagesPage() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    getPageBySlug('/umrah-packages').then(p => {
      if (p) setPageData(p);
    });
  }, []);

  return (
    <div className="bg-[#f4f6f5] min-h-screen text-slate-800 font-sans pb-24 w-full">
      {/* ================= DYNAMIC HERO BANNER ================= */}
      <PageBanner
        title={pageData?.bannerTitle || pageData?.title || "Umrah Packages from Canada 2026 <br /><span className=\"text-[#CBA25F]\">Travel with Confidence</span> by King Travel"}
        description={pageData?.bannerDescription || "Perform your sacred obligation of Umrah in 2026 with comfort, organization, and spiritual focus. King Travel proudly offers premium Umrah Packages from Canada 2026, designed to provide Canadian Muslims with a smooth and well-managed pilgrimage experience."}
        bgImage={pageData?.bannerBgImage}
        position={pageData?.bannerPosition}
        size={pageData?.bannerSize}
      />

        {/* ================= 4 WHITE CARDS OVERLAPPING (LUCIDE SVG ICONS) ================= */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* Card 1: ATOL Protected */}
            <div className="bg-white rounded-xl py-8 px-4 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#0a422d] transition duration-300">
                <svg className="w-6 h-6 stroke-[#0a422d]" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ATOL Protected
              </span>
            </div>

            {/* Card 2: Saudi Ministry Approved */}
            <div className="bg-white rounded-xl py-8 px-4 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#0a422d] transition duration-300">
                <svg className="w-6 h-6 stroke-[#0a422d]" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <path d="m12 6 3-3" />
                  <path d="m12 6-3-3" />
                  <path d="M6 22V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
                  <path d="M10 14h4" />
                  <path d="M10 18h4" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Saudi Ministry Approved
              </span>
            </div>

            {/* Card 3: IATA Accredited */}
            <div className="bg-white rounded-xl py-8 px-4 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#0a422d] transition duration-300">
                <svg className="w-6 h-6 stroke-[#0a422d]" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.5-.1-.9.1-1.1.5l-1.2 2.3c-.2.4-.1.9.2 1.2l4.8 4.2-3 3-2.1-.7c-.3-.1-.7 0-.9.3l-.6 1.1c-.2.4 0 .9.3 1.1l3.7 2.2c.4.2.9 0 1.1-.3l1.1-.6c.3-.2.4-.6.3-.9l-.7-2.1 3-3 4.2 4.8c.3.3.8.4 1.2.2l2.3-1.2c.4-.2.6-.6.5-1.1z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                IATA Accredited
              </span>
            </div>

            {/* Card 4: ABTA Bonded */}
            <div className="bg-white rounded-xl py-8 px-4 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#0a422d] transition duration-300">
                <svg className="w-6 h-6 stroke-[#0a422d]" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ABTA Bonded
              </span>
            </div>
          </div>
        </div>

        {/* ================= MAIN PACKAGES GRID ================= */}
        <section className="pt-10">
          <main className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {umrahCardsData.map((card) => (
                <article
                  key={card.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group"
                >
                  {/* Card Top Visual / Hero Image Stack */}
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <Image
                      src={card.heroImage}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>

                    {/* Top Tag Bar */}
                    <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                      <span className="bg-[#0a422d]/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                        <i className="fa-solid fa-kaaba text-[#CBA25F]"></i> Umrah 2026
                      </span>
                      <span className="bg-amber-500/90 text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                        <i className="fa-solid fa-calendar"></i> {card.duration}
                      </span>
                    </div>

                    {/* Title Placement inside image bottom */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1">
                        <i className="fa-solid fa-plane text-xs"></i> From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia
                      </span>
                      <h2 className="text-xl font-bold text-white tracking-tight">{card.title}</h2>
                    </div>
                  </div>

                  {/* Hotel & Inclusions Container */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Accommodations
                      </h3>

                      {/* Makkah Hotel Card */}
                      <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={card.makkahHotel.image}
                            alt={card.makkahHotel.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <span className="absolute bottom-1 right-1 bg-[#0a422d] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                            Makkah
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">
                            {card.makkahHotel.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <i className="fa-solid fa-location-dot text-emerald-700"></i> {card.makkahHotel.location}
                          </p>
                          <div className="flex gap-1.5 mt-1 flex-wrap">
                            <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md">
                              <i className="fa-solid fa-utensils text-[8px]"></i> {card.makkahHotel.badge}
                            </span>
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              {card.makkahHotel.nights}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Madinah Hotel Card */}
                      <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={card.madinahHotel.image}
                            alt={card.madinahHotel.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <span className="absolute bottom-1 right-1 bg-amber-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                            Madinah
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">
                            {card.madinahHotel.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <i className="fa-solid fa-location-dot text-amber-600"></i> {card.madinahHotel.location}
                          </p>
                          <div className="flex gap-1.5 mt-1 flex-wrap">
                            <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md">
                              <i className="fa-solid fa-utensils text-[8px]"></i> {card.madinahHotel.badge}
                            </span>
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              {card.madinahHotel.nights}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Meta & Pricing */}
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        {/* Operator Rating */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                            Operator
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">King Travel</span>
                            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded">
                              4.4/5
                            </span>
                          </div>
                        </div>
                        {/* Pricing */}
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                            From CAD / Quad Occupancy
                          </span>
                          <span className="text-2xl font-extrabold text-[#0a422d]">
                            {card.price}
                          </span>
                        </div>
                      </div>

                      {/* Booking & Details Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href="/contact"
                          className="border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1"
                        >
                          <i className="fa-solid fa-circle-info"></i> View Details
                        </Link>
                        <a
                          href={`https://wa.me/19056248344?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(card.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#CBA25F] hover:bg-[#bfa030] text-white font-bold text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline"
                        >
                          <i className="fa-solid fa-passport"></i> Book Umrah 2026
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </section>
      </div>
  );
}
