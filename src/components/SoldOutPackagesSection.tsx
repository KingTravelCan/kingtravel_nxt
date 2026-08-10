"use client";

import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { getPackagesByIds } from "@/actions/packageActions";

export default function SoldOutPackagesSection({ data }: { data: any }) {
  const eyebrow = data?.eyebrow || "";
  const title = data?.title || "Packages Officially<br />Sold Out";
  const description = data?.description || "";

  const packageIds: number[] = Array.isArray(data?.packageIds)
    ? data.packageIds.map(Number).filter(Boolean)
    : [];

  const [pkgs, setPkgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(packageIds.length > 0);

  useEffect(() => {
    if (packageIds.length === 0) {
      setLoading(false);
      return;
    }
    getPackagesByIds(packageIds)
      .then((rows) => setPkgs(rows))
      .catch(() => setPkgs([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.packageIds?.join?.(",")]);

  if (!loading && pkgs.length === 0) return null;

  return (
    <section className="py-20 bg-[#f4f6ec]">
      <div className="max-w-[1400px] mx-auto px-5">
        {/* Header (Two Columns) */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="eyebrow">{eyebrow}</h3>
            <h2
              className=""
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
          <div className="max-w-sm text-gray-500 text-sm leading-relaxed border-t-2 md:border-t-0 md:border-l-2 border-gray-200 pt-4 md:pt-0 pl-0 md:pl-4">
            {description}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-[220px] bg-gray-200" />
                <div className="p-8 space-y-4">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                  <div className="h-8 bg-gray-100 rounded w-1/2" />
                  <div className="space-y-2 pt-4">
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards Grid */}
        {!loading && pkgs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {pkgs.map((pkg: any, idx: number) => {
              const cd = pkg.cardData || {};
              const heroImage =
                cd.bannerImage ||
                pkg.featuredImage ||
                "https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80";
              const typeName = pkg.type === "hajj" ? "HAJJ" : "UMRAH";
              
              // We could use `pkg.month` or `cd.duration` here, let's show the package type and duration
              const monthLabel = `${typeName} \u00B7 ${cd.duration || pkg.durationDays + ' Days'}`;
              
              const price = pkg.startingPrice
                ? `CAD ${Number(pkg.startingPrice).toLocaleString("en-CA")}`
                : "CAD 0";
              const priceUnit = cd.priceSubtext || "/ Person";
              const includesText = "PACKAGE INCLUDES";
              
              // Map some common text to icons based on the UI
              const getIconForText = (text: string, defaultIcon: string = "Check") => {
                const lower = text.toLowerCase();
                if (lower.includes("flight")) return "Plane";
                if (lower.includes("transport")) return "Bus";
                if (lower.includes("ihram")) return "Shirt";
                if (lower.includes("visa")) return "FileText";
                if (lower.includes("guide") || lower.includes("imam")) return "User";
                if (lower.includes("hotel")) return "Building";
                return defaultIcon;
              };

              // Use custom includes from cardData if available, otherwise fallback to defaults based on Hajj/Umrah
              const includes = Array.isArray(cd.includes) && cd.includes.length > 0
                ? cd.includes
                : [
                    { text: 'Return Flights from Toronto', icon: 'Plane' },
                    { text: 'Luxury Ground Transportation', icon: 'Bus' },
                    { text: '5 Star Hotels Makkah & Madinah', icon: 'Building' }
                  ];

              return (
                <article
                  key={pkg.id || idx}
                  className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group transition-shadow hover:shadow-md relative"
                >
                  {/* SOLD OUT BADGE OVERLAY */}
                  <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                    <LucideIcons.Ban className="w-3.5 h-3.5" /> SOLD OUT
                  </div>

                  {heroImage && (
                    <div className="relative h-[220px] w-full overflow-hidden shrink-0">
                      <img
                        src={heroImage}
                        alt={pkg.title || "Sold Out Package"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                      {pkg.type === "hajj" ? <LucideIcons.Tent className="w-3.5 h-3.5" /> : <LucideIcons.MoonStar className="w-3.5 h-3.5" />}
                      {monthLabel}
                    </div>
                    <h3 className="text-[28px] font-serif text-[#1a2b25] mb-2 leading-tight">
                      {pkg.title}
                    </h3>
                    <div className="text-[#1a2b25] font-black text-2xl mb-8 flex items-baseline gap-1">
                      {price}{" "}
                      <span className="text-sm font-medium text-gray-500">
                        {priceUnit}
                      </span>
                    </div>

                    <div className="text-[10px] font-black text-[#DB9E30] uppercase tracking-widest mb-5">
                      {includesText}
                    </div>

                    {includes && includes.length > 0 && (
                      <ul className="space-y-4 mb-2 flex-1">
                        {includes.map((inc: any, j: number) => {
                          let iconName = inc.icon || getIconForText(inc.text || "");
                          return (
                            <li
                              key={j}
                              className="flex gap-4 items-center text-sm text-gray-600"
                            >
                              <DynamicIcon
                                name={iconName}
                                className="w-4 h-4 text-gray-400 shrink-0"
                              />
                              <span>{inc.text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
