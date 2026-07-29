'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import MarqueeTrack from "@/components/MarqueeTrack";
import PageBanner from "@/components/PageBanner";
import { getPageBySlug } from "@/actions/pageActions";

const airlineLogos = [
  { src: "/img/a-1.png", alt: "Saudi Airlines" },
  { src: "/img/a-2.png", alt: "Emirates" },
  { src: "/img/a-3.png", alt: "Qatar Airways" },
  { src: "/img/a-4.png", alt: "Turkish Airlines" },
  { src: "/img/a-5.png", alt: "Etihad Airways" },
  { src: "/img/a-6.png", alt: "EgyptAir" },
  { src: "/img/a-7.png", alt: "Royal Jordanian" },
  { src: "/img/a-8.png", alt: "Gulf Air" },
  { src: "/img/a-9.png", alt: "Air Canada" },
];

const availableFlights = [
  {
    code: "PIA",
    name: "Pakistan International Airlines",
    operatedBy: "Operated By PIA",
    originCode: "LHR",
    originCity: "London",
    destCode: "JED",
    destCity: "Jeddah",
    time: "14:20",
    price: "CAD 1,250.00",
  },
  {
    code: "PIA",
    name: "Pakistan International Airlines",
    operatedBy: "Operated By PIA",
    originCode: "LHR",
    originCity: "London",
    destCode: "JED",
    destCity: "Jeddah",
    time: "14:20",
    price: "CAD 1,250.00",
  },
  {
    code: "PIA",
    name: "Pakistan International Airlines",
    operatedBy: "Operated By PIA",
    originCode: "LHR",
    originCity: "London",
    destCode: "JED",
    destCity: "Jeddah",
    time: "14:20",
    price: "CAD 1,250.00",
  },
];

export default function AirlinesPage() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    getPageBySlug('/airlines').then(p => {
      if (p) setPageData(p);
    });
  }, []);

  return (
    <main className="bg-[#f2f5f3] min-h-screen pb-16">
      {/* ================= DYNAMIC HERO BANNER ================= */}
      <PageBanner
        title={pageData?.bannerTitle || pageData?.title || "Find <span>Lowest Fare</span> Flights & Book Airline Tickets Across Canada"}
        description={pageData?.bannerDescription || "Compare flight prices, discover exclusive travel deals, and book domestic & international air tickets with ease. Fast booking, trusted fares, and 24/7 travel support."}
        bgImage={pageData?.bannerBgImage}
        position={pageData?.bannerPosition}
        size={pageData?.bannerSize}
      />

      {/* ================= AVAILABLE FLIGHTS SECTION ================= */}
      <section className="pt-14 reveal">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-emerald-800 font-semibold uppercase tracking-wider text-sm block mb-1">
              Available Flights
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              BEST FARES, LIMITED AVAILABILITY FROM LONDON
            </h2>
          </div>

          <div className="space-y-6 mb-12">
            {availableFlights.map((flight, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-2xl border border-gray-200/60 p-6 md:p-8 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
                  {/* Left: Airline Info */}
                  <div className="flex items-center gap-4 min-w-[280px]">
                    <div className="bg-emerald-900 text-white font-bold px-3 py-2 rounded text-base tracking-wide flex items-center justify-center min-w-[54px] h-[44px]">
                      {flight.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{flight.name}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{flight.operatedBy}</p>
                    </div>
                  </div>

                  {/* Middle: Route & Times */}
                  <div className="flex flex-1 items-center justify-between max-w-md mx-auto w-full px-2">
                    <div className="text-center md:text-left">
                      <span className="block text-2xl font-bold text-gray-900">{flight.originCode}</span>
                      <span className="text-xs text-gray-400 font-medium">{flight.originCity}</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-4 relative">
                      <div className="w-full border-t border-dashed border-gray-300 absolute"></div>
                      <div className="bg-gray-100 px-2 z-10 rounded-full py-1">
                        <i className="fa-solid fa-plane text-sky-400 text-sm rotate-45"></i>
                      </div>
                    </div>

                    <div className="text-center md:text-left">
                      <span className="block text-2xl font-bold text-gray-900">{flight.destCode}</span>
                      <span className="text-xs text-gray-400 font-medium">{flight.destCity}</span>
                    </div>

                    <div className="h-8 border-l border-gray-300 mx-6 hidden md:block"></div>

                    <div className="text-center md:text-left">
                      <span className="block text-xl font-bold text-gray-900">{flight.time}</span>
                      <span className="text-xs text-gray-400 font-medium">{flight.originCode}</span>
                    </div>
                  </div>

                  {/* Right: Pricing & CTA */}
                  <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-0 pt-4 md:pt-0 border-gray-200">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block md:hidden">Price</span>
                      <span className="text-2xl font-extrabold text-gray-900">{flight.price}</span>
                    </div>
                    <a
                      href="https://wa.me/19056248344?text=Hi,%20I'm%20interested%20in%20booking%20this%20flight!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3 px-8 rounded-lg tracking-wide shadow-sm transition-colors duration-150 cursor-pointer text-sm w-full md:w-auto inline-block text-center"
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

      {/* ================= AIRLINE PARTNERS MARQUEE ================= */}
      <section id="flights" className="py-12 bg-white">
        <div className="wrap">
          <div className="section-head center reveal" style={{ marginBottom: "40px" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Our Trusted Partners</div>
            <h2>Airlines We Sourced Deals From</h2>
          </div>
        </div>
        <MarqueeTrack type="airline" images={airlineLogos} />
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="tint mt-12" style={{ padding: "80px 0" }}>
        <div className="wrap text-center">
          <h2 style={{ fontSize: "2.2rem", marginBottom: "20px" }}>Need Flight Booking Assistance?</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto 30px", color: "var(--ink-soft)" }}>
            Speak directly with our ticketing specialists to get custom quotes, group flight discounts, and immediate confirmations.
          </p>
          <Link href="/contact" className="btn dark">
            Contact Flight Desk
          </Link>
        </div>
      </section>
    </main>
  );
}
