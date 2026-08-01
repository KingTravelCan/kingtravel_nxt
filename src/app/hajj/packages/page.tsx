"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { getPageBySlug } from "@/actions/pageActions";
import PackageDetailModal, { PackageDetailData } from "@/components/PackageDetailModal";

const hajjCardsData = [
  {
    id: "economy-hajj-2027",
    title: "Economy Hajj Package 2027",
    duration: "14Days",
    heroImage:
      "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg",
    price: "CAD 12,995",
    makkahHotel: {
      name: "5 Star Hotel in Makkah",
      location: "Near to Haram",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg?k=13b36d624d683462058664c3aa31641cbb4c53cf07ca581f02f127e198029575&o=",
      badge: "Breakfast",
      nights: "6 Nights",
    },
    madinahHotel: {
      name: "5 Star Hotel in Madinah",
      location: "Near to Masjid Nabawi",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg?k=2d6dfd51cd0bb767e33d6cc5dc4d3f8d76da0c17140158b7b43366dc7cf66a36&o=",
      badge: "Breakfast",
      nights: "6 Nights",
    },
  },
  {
    id: "deluxe-hajj-2027",
    title: "Deluxe Hajj 2027",
    duration: "15 Days",
    heroImage:
      "https://images.unsplash.com/photo-1565552070098-fd83a8dac718?auto=format&fit=crop&w=800&q=80",
    price: "CAD 17,995",
    makkahHotel: {
      name: "5 Star Hotel Fairmont Makkah",
      location: "Near to Haram",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5-XnMVZK4gPR2fok2UHalB4MgmobfdO0bUKh_VXGHMGYe_A7NQaaZ748&s=10",
      badge: "Buffet Included",
      nights: "8 Nights",
    },
    madinahHotel: {
      name: "5 Star Hotel Dar Al Eman Madinah",
      location: "Near to Masjid Nabawi",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80",
      badge: "Buffet Included",
      nights: "7 Nights",
    },
  },
  {
    id: "express-custom-hajj-2027",
    title: "Express Custom Hajj 2027",
    duration: "10 Days",
    heroImage:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80",
    price: "CAD 14,995",
    makkahHotel: {
      name: "Hyatt Regency Makkah",
      location: "Jabal Omar (Short Walk)",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
      badge: "Breakfast",
      nights: "5 Nights",
    },
    madinahHotel: {
      name: "Pullman Zamzam Madinah",
      location: "Walking Distance",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80",
      badge: "Breakfast",
      nights: "5 Nights",
    },
  },
];

export default function HajjPackagesPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [selectedDetailPkg, setSelectedDetailPkg] = useState<PackageDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    getPageBySlug("/hajj/packages").then((p) => {
      if (p) setPageData(p);
    });
  }, []);

  const openDetailModal = (card: any) => {
    setSelectedDetailPkg(card);
    setIsDetailOpen(true);
  };

  return (
    <div className="hajj-page-wrapper" suppressHydrationWarning>
      <PackageDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        pkg={selectedDetailPkg}
      />
      {/* ================= DYNAMIC HERO BANNER ================= */}
      <PageBanner
        title={
          pageData?.bannerTitle ||
          pageData?.title ||
          "Hajj Packages from Canada 2027 <br /><span>Travel with Confidence</span> by King Travel"
        }
        description={
          pageData?.bannerDescription ||
          "Perform your sacred obligation of Hajj in 2027 with comfort, organization, and spiritual focus. King Travel proudly offers premium Hajj Packages from Canada 2027, designed to provide Canadian Muslims with a smooth and well-managed pilgrimage experience."
        }
        bgImage={pageData?.bannerBgImage}
        position={pageData?.bannerPosition}
        size={pageData?.bannerSize}
      />

      {/* ================= 4 FLOATING ACCREDITATION BADGES ================= */}
      <div className="badges-overlap-container">
        <div className="badge-grid">
          <div className="badge-card">
            <div className="badge-icon-wrap">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <span>ATOL PROTECTED</span>
          </div>

          <div className="badge-card">
            <div className="badge-icon-wrap">
              <i className="fa-solid fa-mosque"></i>
            </div>
            <span>SAUDI MINISTRY APPROVED</span>
          </div>

          <div className="badge-card">
            <div className="badge-icon-wrap">
              <i className="fa-solid fa-plane-departure"></i>
            </div>
            <span>IATA ACCREDITED</span>
          </div>

          <div className="badge-card">
            <div className="badge-icon-wrap">
              <i className="fa-solid fa-stamp"></i>
            </div>
            <span>ABTA BONDED</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN HAJJ PACKAGES GRID ================= */}
      <section className="packages-grid-container py-12 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(() => {
            let cards = hajjCardsData;
            if (pageData?.sections) {
              try {
                const parsed = typeof pageData.sections === "string" ? JSON.parse(pageData.sections) : pageData.sections;
                const hajjSec = Array.isArray(parsed) && parsed.find((s: any) => s.type === "Hajj Packages Grid" || s.type === "Hajj Cards");
                if (hajjSec?.data?.items && Array.isArray(hajjSec.data.items) && hajjSec.data.items.length > 0) {
                  cards = hajjSec.data.items;
                }
              } catch (e) {}
            }

            return cards.map((card: any, idx: number) => {
              const badgeTag = card.badgeTag || "HAJJ 2027";
              const duration = card.duration || "14Days";
              const flightRoute = card.flightRoute || "FROM CANADA ➔ TO SAUDIA";
              const heroImage = card.heroImage || "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg";
              const title = card.title || "Hajj Package 2027";
              const rawPrice = card.price || "12,995";
              const price = rawPrice.startsWith("CAD") ? rawPrice : `CAD ${rawPrice.replace("$", "").trim()}`;
              const priceSubtext = card.priceSubtext || "FROM CAD / QUAD OCCUPANCY";
              const operatorName = card.operatorName || "King Travel";
              const operatorRating = card.operatorRating || "4.4/5";
              const btnLabel = card.btnLabel || "Book Hajj 2027";
              const btnLink = card.btnLink || `https://wa.me/19056248344?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(title)}`;

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

              const pkgSlug = card.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

              return (
                <article key={card.id || idx} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 flex flex-col group transition-all duration-300 hover:shadow-2xl">
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
                          <h4 className="text-sm font-bold text-[#004B39] truncate">{madinahName}</h4>
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
                        href={`/package/${pkgSlug}`}
                        className="w-full bg-[#DB9E30] hover:bg-[#b88222] text-slate-950 font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
                      >
                        <i className="fa-solid fa-book-bookmark"></i>
                        <span>{btnLabel}</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            });
          })()}
        </div>
      </section>
    </div>
  );
}
