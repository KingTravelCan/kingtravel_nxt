import Image from "next/image";
import Link from "next/link";
import { getAllPackages } from "@/actions/packageActions";
import { getOrganizationJsonLd } from "@/lib/jsonLd";

export const metadata = {
  title: "Hajj Packages 2027 Canada | King Travel Mississauga",
  description: "Official Hajj 2027 packages from Canada. Registered Canadian Hajj agency offering VIP 5-star accommodations, tent city assistance & Imam guidance.",
};

export default async function HajjPackagesPage() {
  const allPackages = await getAllPackages();
  const hajjPackages = allPackages.filter((p) => p.type === "hajj");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationJsonLd()) }}
      />
      <main className="wrap reveal py-12">
        <div className="section-head text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow justify-center">Canadian Hajj Delegation</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">Hajj 2027 Packages</h1>
          <p className="text-slate-600 mt-3">
            Secure your priority registration for Hajj 2027. Full package details, hotel proximity in Makkah &amp; Madinah, and expert Canadian guides.
          </p>
        </div>

        <div className="pkg-scroller reveal grid grid-cols-1 md:grid-cols-3 gap-6">
          {hajjPackages.length === 0 ? (
            <p className="col-span-3 text-center text-slate-500 py-12">Hajj 2026 packages sold out. Hajj 2027 priority list registration is now open!</p>
          ) : (
            hajjPackages.map((pkg) => (
              <div key={pkg.id} className="pkg-card border border-slate-200 rounded-3xl overflow-hidden shadow-lg bg-white flex flex-col">
                <div className="pkg-media relative h-52">
                  <Image
                    src={pkg.featuredImage || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80"}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                  <span className="tag absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    HAJJ 2027
                  </span>
                </div>
                <div className="pkg-top p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="pkg-month text-xs font-bold uppercase tracking-widest text-slate-400">{pkg.month || "2027"}</div>
                    <div className="pkg-title text-xl font-bold text-slate-900 mt-1">{pkg.title}</div>
                    <div className="pkg-price text-2xl font-extrabold text-emerald-800 mt-2">
                      CAD {pkg.startingPrice} <span className="text-xs font-normal text-slate-500">/ Quad Occupancy</span>
                    </div>
                  </div>
                  <div className="pkg-cta-full mt-6">
                    <Link className="btn block w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition" href="/contact">
                      Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
