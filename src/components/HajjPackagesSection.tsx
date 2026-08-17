"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { getPackagesByType, getPackagesByIds } from "@/actions/packageActions";
import PackageBookingModal from "@/components/PackageBookingModal";
export default function HajjPackagesSection({ data, initialPackages }: { data: any, initialPackages?: any }) {
  const pathname = usePathname();
  const eyebrow = data?.eyebrow || "LUXURY HAJJ PACKAGES";
  const title = data?.title || "Hajj Packages 2027";
  const description =
    data?.description ||
    data?.subtext ||
    "Luxury Hajj 2027 Packages with 5-Star Hotels, VIP Services & Complete Spiritual Guidance.";

  const [pkgs, setPkgs] = useState<any[]>(initialPackages || []);
  const [loading, setLoading] = useState(!initialPackages);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPkgForBooking, setSelectedPkgForBooking] = useState<any>(null);

  useEffect(() => {
    const packageIds = data?.packageIds || [];

    // If we have initialPackages and no specific packageIds are selected, 
    // we don't need to fetch on mount, because the server already gave us all packages.
    if (initialPackages && packageIds.length === 0) {
      setPkgs(initialPackages);
      setLoading(false);
      return;
    }

    if (packageIds.length > 0) {
      getPackagesByIds(packageIds)
        .then((rows) => setPkgs(rows))
        .catch(() => setPkgs([]))
        .finally(() => setLoading(false));
    } else {
      getPackagesByType("hajj")
        .then((rows) => setPkgs(rows))
        .catch(() => setPkgs([]))
        .finally(() => setLoading(false));
    }
  }, [data?.packageIds, initialPackages]);
  return (
    <section className={`py-20 ${pathname === '/' ? 'bg-white' : 'bg-sage'}`}>
      <div className="max-w-[1400px] mx-auto px-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="eyebrow">{eyebrow}</h3>
            <h2 className="">{title}</h2>
          </div>
          <div className="max-w-sm text-ink-soft text-sm leading-relaxed border-t-2 md:border-t-0 md:border-l-2 border-gray-200 pt-4 md:pt-0 pl-0 md:pl-4">
            {description}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-[240px] bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-16 bg-gray-100 rounded-2xl" />
                  <div className="h-16 bg-gray-100 rounded-2xl" />
                  <div className="h-12 bg-gold/30 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No packages configured */}
        {!loading && pkgs.length === 0 && (
          <p className="text-center text-slate-400 py-12">
            No Hajj packages added to this section yet.
          </p>
        )}

        {/* Packages Grid */}
        {!loading && pkgs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pkgs.map((pkg: any, idx: number) => {
              let cd = pkg.cardData || {};
              if (typeof cd === 'string') {
                try {
                  cd = JSON.parse(cd);
                } catch (e) {
                  cd = {};
                }
              }
              const heroImage =
                cd.bannerImage ||
                pkg.featuredImage ||
                "/uploads/sections/hajj_1.jpg";
              const badgeTag = cd.badgeTag || "HAJJ 2027";
              const duration = cd.duration || `${pkg.durationDays || 14}Days`;
              const flightRoute =
                cd.flightRoute || "FROM CANADA ➔ TO SAUDIA";
              const operatorName = cd.operatorName || "King Travel";
              const operatorRating = cd.operatorRating || "4.4/5";
              const priceSubtext =
                cd.priceSubtext || "FROM CAD / QUAD OCCUPANCY";
              const price = pkg.startingPrice
                ? Number(pkg.startingPrice).toLocaleString("en-CA", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
                : "12,995";
              const makkahHotel = cd.makkahHotel;
              const madinahHotel = cd.madinahHotel;

              return (
                <div
                  key={pkg.id || idx}
                  className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col"
                >
                  {/* Hero image */}
                  <div className="relative h-[240px] w-full">
                    <img
                      src={heroImage}
                      alt={pkg.title || "Hajj Package"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 text-white text-[11px] font-bold tracking-wider">
                      <LucideIcons.Shield className="w-3 h-3" /> {badgeTag}
                    </div>
                    <div className="absolute top-4 right-4 bg-gold text-ink px-3 py-1 rounded-full text-[11px] font-black tracking-wider flex items-center gap-1.5">
                      <LucideIcons.Calendar className="w-3 h-3" /> {duration}
                    </div>

                    {/* Bottom text */}
                    <div className="absolute bottom-4 left-6 right-6">
                      <div className="text-[#20d88a] text-[11px] font-black tracking-widest mb-1 flex items-center gap-2">
                        <LucideIcons.Plane className="w-3 h-3" /> {flightRoute}
                      </div>
                      <h3 className="text-white font-serif text-2xl leading-tight">
                        {pkg.title || "Hajj Package"}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[11px] font-black text-ink uppercase tracking-widest mb-4">
                      ACCOMMODATIONS
                    </div>

                    <div className="flex flex-col gap-3 flex-1 mb-6">
                      {/* Makkah Hotel */}
                      {makkahHotel && (
                        <div className="flex gap-4 p-3 rounded-2xl border border-[#eef0e4] bg-[#fcfdf9]">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={
                                makkahHotel.image ||
                                "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=200&q=80"
                              }
                              alt="Hotel"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-primary font-bold text-sm mb-1">
                              {makkahHotel.name || "5 Star Hotel in Makkah"}
                            </h4>
                            <div className="text-ink-soft text-[11px] flex items-center gap-1 mb-2">
                              <LucideIcons.MapPin className="w-3 h-3" />{" "}
                              {makkahHotel.location || "Near to Haram"}
                            </div>
                            <div className="flex gap-2">
                              <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-wider flex items-center gap-1">
                                {makkahHotel.badgeIcon && <DynamicIcon name={makkahHotel.badgeIcon} className="w-2.5 h-2.5" />}
                                {makkahHotel.badge || "Breakfast"}
                              </span>
                              <span className="bg-gray-100 text-ink-soft text-[10px] px-2 py-0.5 rounded font-bold tracking-wider flex items-center gap-1">
                                {makkahHotel.nightsIcon && <DynamicIcon name={makkahHotel.nightsIcon} className="w-2.5 h-2.5" />}
                                {makkahHotel.nights || "6 Nights"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Madinah Hotel */}
                      {madinahHotel && (
                        <div className="flex gap-4 p-3 rounded-2xl border border-[#eef0e4] bg-[#fcfdf9]">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={
                                madinahHotel.image ||
                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80"
                              }
                              alt="Hotel"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-primary font-bold text-sm mb-1">
                              {madinahHotel.name || "5 Star Hotel in Madinah"}
                            </h4>
                            <div className="text-ink-soft text-[11px] flex items-center gap-1 mb-2">
                              <LucideIcons.MapPin className="w-3 h-3" />{" "}
                              {madinahHotel.location || "Near to Masjid Nabawi"}
                            </div>
                            <div className="flex gap-2">
                              <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-wider flex items-center gap-1">
                                {madinahHotel.badgeIcon && <DynamicIcon name={madinahHotel.badgeIcon} className="w-2.5 h-2.5" />}
                                {madinahHotel.badge || "Breakfast"}
                              </span>
                              <span className="bg-gray-100 text-ink-soft text-[10px] px-2 py-0.5 rounded font-bold tracking-wider flex items-center gap-1">
                                {madinahHotel.nightsIcon && <DynamicIcon name={madinahHotel.nightsIcon} className="w-2.5 h-2.5" />}
                                {madinahHotel.nights || "6 Nights"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-5 flex items-end justify-between mb-6">
                      <div>
                        <div className="text-[10px] font-bold text-ink-soft uppercase tracking-widest mb-1.5">
                          OPERATOR
                        </div>
                        <div className="text-sm font-bold text-ink flex items-center gap-2">
                          {operatorName}{" "}
                          <span className="bg-gold text-ink text-[10px] px-1.5 py-0.5 rounded font-black">
                            {operatorRating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-ink-soft uppercase tracking-widest mb-1.5">
                          {priceSubtext}
                        </div>
                        <div className="text-2xl font-black text-ink">
                          {price}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={`/${pkg.slug}`}
                        className="flex-1 py-3.5 border-2 border-ink-soft text-ink-soft hover:bg-ink-soft/5 text-xs font-black rounded-md uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
                      >
                        <LucideIcons.Eye className="w-4 h-4" /> View Detail
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPkgForBooking(pkg);
                          setBookingModalOpen(true);
                        }}
                        className="flex-1 py-3.5 bg-gold hover:bg-gold-lt text-ink text-xs font-black rounded-md uppercase tracking-widest transition-colors flex justify-center items-center gap-2 cursor-pointer"
                      >
                        <LucideIcons.BookOpen className="w-4 h-4" /> Book Hajj 2027
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PackageBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        pkg={selectedPkgForBooking}
      />
    </section>
  );
}