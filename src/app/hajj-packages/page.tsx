import Link from "next/link";
import Image from "next/image";
import { getAllPackages } from "@/actions/packageActions";

// Fallback cards shown only if no Hajj packages exist yet in the database,
// so the page never renders empty.
const fallbackCards = [
  {
    badgeDuration: "14 Days",
    title: "Economy Hajj Package 2027",
    heroImage:
      "https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80",
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
    price: "12,995",
    btnLink: "/economy-hajj-2027",
  },
  {
    badgeDuration: "17 Days",
    title: "Deluxe Hajj 2027",
    heroImage:
      "https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=900&q=80",
    makkahHotel: {
      name: "5 Star Hotel Fairmont Makkah",
      location: "Near to Haram",
      image: "/img/fairmount.jpg",
      badge: "Buffet Included",
      nights: "8 Nights",
    },
    madinahHotel: {
      name: "5 Star Hotel Dar Al Eman Madinah",
      location: "Near to Masjid Nabawi",
      image: "/img/dar-al-eman.jpg",
      badge: "Buffet Included",
      nights: "7 Nights",
    },
    price: "17,995",
    btnLink: "/deluxe-hajj-2027",
  },
  {
    badgeDuration: "10 Days",
    title: "Express Custom Hajj 2027",
    heroImage:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80",
    makkahHotel: {
      name: "Hyatt Regency Makkah",
      location: "Jabal Omar (Short Walk)",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=300&q=80",
      badge: "Breakfast",
      nights: "5 Nights",
    },
    madinahHotel: {
      name: "Pullman Zamzam Madinah",
      location: "Walking Distance",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMH3qB9RTiBkL_HJ1Ud2v3EUkitmSkKqpCuxjwQcnJNlt6DQcGjUrYoo&s=10",
      badge: "Breakfast",
      nights: "5 Nights",
    },
    price: "14,995",
    btnLink: "/contact",
  },
];

export default async function HajjPackagesPage() {
  let liveCards: any[] = [];

  try {
    const allPackages = await getAllPackages();
    const hajjPackages = allPackages.filter((pkg: any) => pkg.type === "hajj");

    liveCards = hajjPackages.map((pkg: any) => {
      const cd = pkg.cardData || {};
      return {
        badgeDuration: cd.duration || `${pkg.durationDays || 14} Days`,
        title: pkg.title,
        heroImage:
          cd.bannerImage ||
          pkg.featuredImage ||
          "/uploads/sections/hajj_1.jpg",
        makkahHotel: cd.makkahHotel || null,
        madinahHotel: cd.madinahHotel || null,
        price: pkg.startingPrice
          ? Number(pkg.startingPrice).toLocaleString("en-CA", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          : "",
        btnLink: cd.btnLink || `/package/${pkg.slug}`,
      };
    });
  } catch (err) {
    console.error("Failed to load Hajj packages:", err);
  }

  const cards = liveCards.length > 0 ? liveCards : fallbackCards;

  return (
    <main>
      <section className="hero packages">
        <div className="wrap">
          <h1 className="text-white text-5xl mb-5">
            Luxury <span className="text-[#DB9E30]">Hajj Packages 2027</span>
          </h1>
          <p className="text-white text-lg max-w-[700px] mx-auto mb-7.5 opacity-90">
            Luxury Hajj 2027 Packages with 5-Star Hotels, VIP Services &amp; Complete Spiritual Guidance.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head split reveal">
            <div>
              <div className="eyebrow">Luxury Hajj Packages</div>
              <h2>Hajj Packages 2027</h2>
            </div>
            <p className="max-w-[480px]">
              Luxury Hajj 2027 Packages with 5-Star Hotels, VIP Services &amp; Complete Spiritual Guidance.
            </p>
          </div>

          {cards.length === 0 ? (
            <p className="text-center text-slate-400 py-12">
              No Hajj packages added yet.
            </p>
          ) : (
            <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cards.map((c, idx) => (
                <article
                  key={idx}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <Image
                      src={c.heroImage}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={700}
                      height={256}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                    <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                      <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                        <i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027
                      </span>
                      <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                        <i className="fa-solid fa-calendar"></i> {c.badgeDuration}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1">
                        <i className="fa-solid fa-plane text-xs"></i>From Canada{" "}
                        <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia
                      </span>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        {c.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">
                        Accommodations
                      </h3>
                      {c.makkahHotel && (
                        <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <Image
                              src={c.makkahHotel.image}
                              alt="Makkah Hotel"
                              className="w-full h-full object-cover"
                              width={64}
                              height={64}
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate">
                              {c.makkahHotel.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <i className="fa-solid fa-location-dot text-emerald-700"></i>{" "}
                              {c.makkahHotel.location}
                            </p>
                            <div className="flex gap-1.5 mt-1 flex-wrap">
                              <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md">
                                <i className="fa-solid fa-utensils text-[8px]"></i>{" "}
                                {c.makkahHotel.badge}
                              </span>
                              <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                {c.makkahHotel.nights}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      {c.madinahHotel && (
                        <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <Image
                              src={c.madinahHotel.image}
                              alt="Madinah Hotel"
                              className="w-full h-full object-cover"
                              width={64}
                              height={64}
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate">
                              {c.madinahHotel.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <i className="fa-solid fa-location-dot text-amber-600"></i>{" "}
                              {c.madinahHotel.location}
                            </p>
                            <div className="flex gap-1.5 mt-1 flex-wrap">
                              <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md">
                                <i className="fa-solid fa-utensils text-[8px]"></i>{" "}
                                {c.madinahHotel.badge}
                              </span>
                              <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                {c.madinahHotel.nights}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4">
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
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                            From CAD / Quad Occupancy
                          </span>
                          <span className="text-2xl font-extrabold text-brand-800">
                            {c.price}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <Link
                          href={c.btnLink}
                          className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline"
                        >
                          <i className="fa-solid fa-passport"></i> Book Hajj 2027
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
