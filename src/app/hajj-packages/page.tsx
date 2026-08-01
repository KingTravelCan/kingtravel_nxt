import Link from "next/link";
import Image from "next/image";

export default function HajjPackagesPage() {
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
          <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image src="https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80" alt="Makkah & Madinah" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={700} height={256} unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                  <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"><i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027</span>
                  <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"><i className="fa-solid fa-calendar"></i> 14 Days</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1"><i className="fa-solid fa-plane text-xs"></i>From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia</span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Economy Hajj Package 2027</h2>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg?k=13b36d624d683462058664c3aa31641cbb4c53cf07ca581f02f127e198029575&o=" alt="Makkah Hotel" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel in Makkah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-emerald-700"></i> Near to Haram</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">6 Nights</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg?k=2d6dfd51cd0bb767e33d6cc5dc4d3f8d76da0c17140158b7b43366dc7cf66a36&o=" alt="Madinah Hotel" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel in Madinah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-amber-600"></i> Near to Masjid Nabawi</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">6 Nights</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Operator</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">King Travel</span>
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded">4.4/5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">From CAD / Quad Occupancy</span>
                      <span className="text-2xl font-extrabold text-brand-800">12,995</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/economy-hajj-2027" className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                      <i className="fa-solid fa-passport"></i> Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 2 */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image src="https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=900&q=80" alt="Makkah Clock Tower" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={900} height={256} unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                  <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"><i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027</span>
                  <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"><i className="fa-solid fa-calendar"></i> 17 Days</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1"><i className="fa-solid fa-plane text-xs"></i> From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia</span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Deluxe Hajj 2027</h2>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="/img/fairmount.jpg" alt="Makkah Fairmont" className="w-full h-full object-cover" width={64} height={64} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel Fairmont Makkah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-emerald-700"></i> Near to Haram</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Buffet Included</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">8 Nights</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="/img/dar-al-eman.jpg" alt="Madinah Oberoi" className="w-full h-full object-cover" width={64} height={64} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel Dar Al Eman Madinah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-amber-600"></i> Near to Masjid Nabawi</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Buffet Included</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">7 Nights</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Operator</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">King Travel</span>
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded">4.4/5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">From CAD / Quad Occupancy</span>
                      <span className="text-2xl font-extrabold text-brand-800">17,995</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/deluxe-hajj-2027" className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                      <i className="fa-solid fa-passport"></i> Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 3 */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80" alt="Hajj Tent City" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={800} height={256} unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                  <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"><i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027</span>
                  <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"><i className="fa-solid fa-calendar"></i> 10 Days</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1"><i className="fa-solid fa-plane text-xs"></i> From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia</span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Express Custom Hajj 2027</h2>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=300&q=80" alt="Makkah Hyatt" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">Hyatt Regency Makkah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-emerald-700"></i> Jabal Omar (Short Walk)</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">5 Nights</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMH3qB9RTiBkL_HJ1Ud2v3EUkitmSkKqpCuxjwQcnJNlt6DQcGjUrYoo&s=10" alt="Madinah Pullman" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">Pullman Zamzam Madinah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-amber-600"></i> Walking Distance</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">5 Nights</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Operator</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">King Travel</span>
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded">4.4/5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">From CAD / Quad Occupancy</span>
                      <span className="text-2xl font-extrabold text-brand-800">14,995</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/contact" className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                      <i className="fa-solid fa-passport"></i> Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
