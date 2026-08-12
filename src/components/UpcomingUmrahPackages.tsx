"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { getPackagesByType, getPackagesByIds } from "@/actions/packageActions";
import PackageBookingModal from "@/components/PackageBookingModal";
export default function UpcomingUmrahPackages({ data, initialPackages }: { data: any, initialPackages?: any }) {
  const pathname = usePathname();
  const eyebrow = data?.eyebrow || "EXCLUSIVE UPCOMING";
  const title = data?.title || "Umrah Packages<br />from Canada";
  const description =
    data?.description ||
    "Departures from CAD 2,595 per person. Availability and accommodations are confirmed with every booking – contact us before reserving.";

  const [pkgs, setPkgs] = useState<any[]>(initialPackages || []);
  const [loading, setLoading] = useState(!initialPackages);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPkgForBooking, setSelectedPkgForBooking] = useState<any>(null);

  useEffect(() => {
    const packageIds = data?.packageIds || [];
    const isUmrahListingPage = pathname === "/umrah-packages";

    // The main Umrah listing page must always show every non-draft, non-sold-out
    // Umrah package from the database. Ignore CMS-selected packageIds here.
    if (isUmrahListingPage) {
      if (initialPackages) {
        setPkgs(initialPackages);
        setLoading(false);
        return;
      }

      setLoading(true);
      getPackagesByType("umrah")
        .then((rows) => setPkgs(rows))
        .catch(() => setPkgs([]))
        .finally(() => setLoading(false));
      return;
    }

    // On other pages, keep supporting manually selected packages.
    if (initialPackages && packageIds.length === 0) {
      setPkgs(initialPackages);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (packageIds.length > 0) {
      getPackagesByIds(packageIds)
        .then((rows) => setPkgs(rows))
        .catch(() => setPkgs([]))
        .finally(() => setLoading(false));
    } else {
      getPackagesByType("umrah")
        .then((rows) => setPkgs(rows))
        .catch(() => setPkgs([]))
        .finally(() => setLoading(false));
    }
  }, [data?.packageIds, initialPackages, pathname]);

  // Homepage should only show the first 4 Umrah packages.
  const displayedPkgs = pathname === "/" ? pkgs.slice(0, 4) : pkgs;
  return (
    <section className="py-10">
      <div className="max-w-[1400px] mx-auto px-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="eyebrow">{eyebrow}</h3>
            <h2
              className=""
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
          <div className="max-w-sm text-ink-soft text-sm leading-relaxed border-t-2 md:border-t-0 md:border-l-2 border-gray-200 pt-4 md:pt-0 pl-0 md:pl-4">
            {description}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-8 space-y-4">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-5 bg-gray-100 rounded w-1/2" />
                  <div className="h-24 bg-gray-100 rounded" />
                  <div className="h-12 bg-gold/30 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No packages */}
        {!loading && pkgs.length === 0 && (
          <p className="text-center text-slate-400 py-12">
            No Umrah packages added to this section yet.
          </p>
        )}

        {/* Packages Grid */}
        {!loading && pkgs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {displayedPkgs.map((pkg: any, idx: number) => {
              let cd = pkg.cardData || {};
              if (typeof cd === 'string') {
                try {
                  cd = JSON.parse(cd);
                } catch (e) {
                  cd = {};
                }
              }
              // Apply gold style automatically to every even-numbered card (2nd, 4th, etc.) based on order index
              const isGold = idx % 2 !== 0;
              const heroImage =
                cd.bannerImage || pkg.featuredImage || "";
              const starRating = pkg.starRating || cd.starRating || "5 Star";
              const month = pkg.month || "";
              const price = pkg.startingPrice
                ? Number(pkg.startingPrice).toLocaleString("en-CA", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
                : "";
              const buttonUrl = `/${pkg.slug}`;
              const buttonText = cd.btnLabel || "BOOK NOW";

              // Parse inclusions: stored as JSON string or array
              let includes: string[] = [];
              if (cd.includes && Array.isArray(cd.includes)) {
                includes = cd.includes;
              } else if (pkg.inclusions) {
                try {
                  const parsed = JSON.parse(pkg.inclusions);
                  includes = Array.isArray(parsed)
                    ? parsed.map((item: any) =>
                      typeof item === "string" ? item : item.text || ""
                    )
                    : [];
                } catch {
                  includes = [];
                }
              }

              return (
                <div
                  key={pkg.id || idx}
                  className={`${isGold
                    ? "bg-gold hover:bg-paper transition duration-400 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mt-0 xl:-mt-8 xl:mb-8"
                    : "hover:bg-[#FBF8F1] transition-[transform,box-shadow] duration-400 border-1 border-[#ccc] transition duration-400 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                    } rounded-3xl overflow-hidden flex flex-col`}
                >
                  <div className="relative h-48 w-full">
                    {heroImage && (
                      <img
                        src={heroImage}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">
                      {starRating} STAR
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div
                      className={`${isGold ? "" : "text-gray-500"
                        } text-xs font-bold uppercase tracking-widest mb-2`}
                    >
                      {month}
                    </div>
                    <h3 className="text-2xl font-serif mb-2">{pkg.title}</h3>
                    <div
                      className={`${isGold ? "" : "text-gold"
                        } font-black text-xl mb-6`}
                    >
                      CAD {price}{" "}
                      <span
                        className={`text-sm font-medium ${isGold ? "" : "text-ink-soft"
                          }`}
                      >
                        / Person
                      </span>
                    </div>

                    <div className="incl-label">PACKAGE INCLUDES</div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {includes.map((inc: any, i: number) => {
                        let Icon = LucideIcons.CheckCircle;
                        let text = "";

                        if (typeof inc === 'string') {
                          text = inc;
                          const firstWord = text.split(" ")[0].toLowerCase();
                          if (firstWord === "return" || firstWord === "flights")
                            Icon = LucideIcons.Plane;
                          else if (firstWord === "luxury" || firstWord === "transport")
                            Icon = LucideIcons.Bus;
                          else if (firstWord === "free" || firstWord === "ihram")
                            Icon = LucideIcons.Gift;
                          else if (firstWord === "registration" || firstWord === "visa")
                            Icon = LucideIcons.FileText;
                          else if (firstWord === "imam" || firstWord === "guide")
                            Icon = LucideIcons.Users;
                          else if (firstWord === "5" || firstWord === "hotel")
                            Icon = LucideIcons.Hotel;
                        } else {
                          text = inc.text || "";
                          // @ts-ignore
                          Icon = LucideIcons[inc.icon] || LucideIcons.CheckCircle;
                        }

                        return (
                          <li
                            key={i}
                            className={`flex gap-3 text-sm ${isGold ? "" : "text-ink-soft"
                              }`}
                          >
                            <Icon
                              className={`w-4 h-4 shrink-0 ${isGold ? "" : "text-ink-soft"
                                }`}
                            />{" "}
                            <span className="leading-tight">{text}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="flex gap-2">
                      <a
                        href={`/${pkg.slug}`}
                        className={`flex-1 py-3 text-center text-xs font-black rounded-md uppercase tracking-widest transition-colors block border-2 border-ink-soft text-ink-soft hover:bg-ink-soft/5`}
                      >
                        View Detail
                      </a>
                      <button
                        onClick={() => {
                          setSelectedPkgForBooking(pkg);
                          setBookingModalOpen(true);
                        }}
                        className={`flex-1 py-3 text-center text-xs font-black rounded-md uppercase tracking-widest transition-colors block border-2 border-transparent cursor-pointer ${isGold
                          ? "bg-ink-soft hover:bg-ink text-white"
                          : "bg-gold hover:bg-gold-lt text-black"
                          }`}
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pathname !== "/umrah-packages" && (
          <div className="flex justify-center mt-12">
            <a
              href="/umrah-packages"
              className="px-8 py-3.5 border-2 border-[#004B39] text-[#004B39] font-bold text-xs uppercase tracking-widest rounded-md hover:bg-[#004B39] hover:text-white transition-all flex items-center gap-3"
            >
              SEE ALL PACKAGES <span>→</span>
            </a>
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