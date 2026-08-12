"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import PageSectionsRenderer from "@/components/PageSectionsRenderer";

const umrahCardsData = [
  {
    id: "customize-2026",
    title: "Customize Umrah Package 2026",
    duration: "10, 15 Days",
    heroImage:
      "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg",
    price: "CAD 7,499",
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
    id: "elite-platinum-2026",
    title: "Elite Platinum Umrah 2026",
    duration: "15 Days",
    heroImage:
      "https://images.unsplash.com/photo-1745775759814-9b60ed1718ed?q=80&w=1159&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "CAD 10,950",
    makkahHotel: {
      name: "Fairmont Clock Royal Tower",
      location: "Zero distance (In Front)",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5-XnMVZK4gPR2fok2UHalB4MgmobfdO0bUKh_VXGHMGYe_A7NQaaZ748&s=10",
      badge: "Buffet Included",
      nights: "8 Nights",
    },
    madinahHotel: {
      name: "The Oberoi Madinah",
      location: "Adjacent to Courtyard",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80",
      badge: "Buffet Included",
      nights: "7 Nights",
    },
  },
  {
    id: "express-custom-2026",
    title: "Express Custom Umrah 2026",
    duration: "10 Days",
    heroImage:
      "https://images.unsplash.com/photo-1586811388230-21835e10b83d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "CAD 5,850",
    makkahHotel: {
      name: "Hyatt Regency Makkah",
      location: "2 Mins Walk",
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

import PackageDetailModal, { PackageDetailData } from "@/components/PackageDetailModal";

export default function UmrahPackagesPageClient({ initialPageData, packages = [] }: { initialPageData?: any, packages?: any[] }) {
  const pageData = initialPageData || null;
  const [selectedDetailPkg, setSelectedDetailPkg] = useState<PackageDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);


  const openDetailModal = (card: any) => {
    setSelectedDetailPkg({
      ...card,
      badgeTag: card.badgeTag || "UMRAH 2026",
      departure: card.departure || "CANADA",
      destination: card.destination || "SAUDIA"
    });
    setIsDetailOpen(true);
  };

  return (
    <div className="umrah-page-wrapper" suppressHydrationWarning>
      <PackageDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        pkg={selectedDetailPkg}
      />
      {/* ================= DYNAMIC HERO BANNER ================= */}
      <PageBanner
        title={pageData?.bannerTitle || pageData?.title || "Umrah Packages from Canada 2026 <br /><span>Travel with Confidence</span> by King Travel"}
        description={pageData?.bannerDescription || "Perform your sacred obligation of Umrah in 2026 with comfort, organization, and spiritual focus. King Travel proudly offers premium Umrah Packages from Canada 2026, designed to provide Canadian Muslims with a smooth and well-managed pilgrimage experience."}
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
            <span>ATOL Protected</span>
          </div>

          <div className="badge-card">
            <div className="badge-icon-wrap">
              <i className="fa-solid fa-mosque"></i>
            </div>
            <span>Saudi Ministry Approved</span>
          </div>

          <div className="badge-card">
            <div className="badge-icon-wrap">
              <i className="fa-solid fa-plane-departure"></i>
            </div>
            <span>IATA Accredited</span>
          </div>

          <div className="badge-card">
            <div className="badge-icon-wrap">
              <i className="fa-solid fa-stamp"></i>
            </div>
            <span>ABTA Bonded</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN PACKAGES GRID ================= */}
      <section className="packages-grid-container">
        <div className="cards-grid">
          {(() => {
            let cards = packages && packages.length > 0 ? packages : umrahCardsData;
            return cards.map((card: any) => {
              const badgeTag = card.badgeTag || (card.month ? `UMRAH ${card.month}` : "UMRAH 2026");
              const duration = card.duration || card.detailPageData?.durationText || card.month || "14Days";
              const heroImage = card.thumbnail || card.heroImage || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1170&auto=format&fit=crop";
              const title = card.title || "Umrah Package 2026";
              const rawPrice = (card.startingPrice || card.price || "12,995").toString();
              const price = rawPrice.startsWith("CAD") ? rawPrice : `CAD ${rawPrice.replace("$", "").trim()}`;

              const makkahHotel = card.detailPageData?.makkahHotel || card.makkahHotel || { name: "5 Star Hotel", location: "Near Haram", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80", badge: "Breakfast", nights: "5 Nights" };
              const madinahHotel = card.detailPageData?.madinahHotel || card.madinahHotel || { name: "5 Star Hotel", location: "Near Masjid", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80", badge: "Breakfast", nights: "5 Nights" };

              return (
                <article key={card.id} className="custom-pkg-card">
                  {/* Hero Header Image */}
                  <div className="card-hero-img-wrap">
                    <Image
                      src={heroImage}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                    <div className="card-hero-overlay" />

                    {/* Top Bar Tags */}
                    <div className="card-hero-tags">
                      <div className="tag-black">
                        <i className="fa-solid fa-kaaba text-gold"></i>
                        <span>{badgeTag}</span>
                      </div>
                      <div className="tag-gold">
                        <i className="fa-solid fa-calendar-days"></i>
                        <span>{duration}</span>
                      </div>
                    </div>

                    {/* Title & Route Placement */}
                    <div className="card-hero-text">
                      <div className="route-subtext">
                        <i className="fa-solid fa-plane text-xs"></i> FROM CANADA <i className="fa-solid fa-arrow-right text-[10px]"></i> TO SAUDIA
                      </div>
                      <h2 className="card-main-title">{title}</h2>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <div>
                      <span className="section-label">Accommodations</span>

                      {/* Makkah Hotel */}
                      <div className="hotel-strip makkah">
                        <div className="hotel-thumb">
                          <Image
                            src={makkahHotel.image}
                            alt={makkahHotel.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <span className="city-badge-overlay mk">Makkah</span>
                        </div>
                        <div className="hotel-details">
                          <div className="hotel-name">{makkahHotel.name}</div>
                          <div className="hotel-location">
                            <i className="fa-solid fa-location-dot text-[#004B39]"></i>
                            <span>{makkahHotel.location}</span>
                          </div>
                          <div className="hotel-tags">
                            <span className="tag-pill-dark">
                              <i className="fa-solid fa-utensils text-[8px]"></i>
                              <span>{makkahHotel.badge}</span>
                            </span>
                            <span className="tag-pill-light">{makkahHotel.nights}</span>
                          </div>
                        </div>
                      </div>

                      {/* Madinah Hotel */}
                      <div className="hotel-strip madinah">
                        <div className="hotel-thumb">
                          <Image
                            src={madinahHotel.image}
                            alt={madinahHotel.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <span className="city-badge-overlay md">Madinah</span>
                        </div>
                        <div className="hotel-details">
                          <div className="hotel-name">{madinahHotel.name}</div>
                          <div className="hotel-location">
                            <i className="fa-solid fa-location-dot text-gold"></i>
                            <span>{madinahHotel.location}</span>
                          </div>
                          <div className="hotel-tags">
                            <span className="tag-pill-dark">
                              <i className="fa-solid fa-utensils text-[8px]"></i>
                              <span>{madinahHotel.badge}</span>
                            </span>
                            <span className="tag-pill-light">{madinahHotel.nights}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Meta & Actions */}
                    <div className="card-footer-meta">
                      <div className="meta-row">
                        <div>
                          <div className="operator-title">Operator</div>
                          <div className="operator-val">
                            <span className="operator-name">King Travel</span>
                            <span className="rating-badge">4.4/5</span>
                          </div>
                        </div>
                        <div>
                          <div className="price-title">From CAD / Quad Occupancy</div>
                          <div className="text-[24px] font-black text-[#004B39] text-right leading-none">{card.price}</div>
                        </div>
                      </div>

                      <Link
                        href={`/package/${card.slug || card.id || card.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        className="w-full bg-gold hover:bg-[#b88222] text-slate-950 font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
                      >
                        <i className="fa-solid fa-passport"></i>
                        <span>Book Umrah 2026</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            });
          })()}
        </div>
      </section>

      {(() => {
        try {
          const parsed = typeof pageData?.sections === 'string' ? JSON.parse(pageData.sections) : (pageData?.sections || []);
          if (parsed.length > 0) {
            return <PageSectionsRenderer sections={parsed} pageData={pageData} />;
          }
        } catch (e) { }
        return null;
      })()}
    </div>
  );
}
