"use client";

import * as LucideIcons from "lucide-react";

export default function HajjPackagesSection({ data }: { data: any }) {
  // Use data from the CMS if available, otherwise fallback to hardcoded
  const eyebrow = data?.eyebrow || "LUXURY HAJJ PACKAGES";
  const title = data?.title || "Hajj Packages 2027";
  const description = data?.description || "Luxury Hajj 2027 Packages with 5-Star Hotels, VIP Services & Complete Spiritual Guidance.";

  return (
    <section className="py-20 bg-[#fbfcf9]">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h3 className="eyebrow">{eyebrow}</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-[#004B39] leading-tight">{title}</h2>
          </div>
          <div className="max-w-sm text-gray-500 text-sm leading-relaxed">
            {description}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col">
            <div className="relative h-[240px] w-full">
              <img src="uploads/sections/hajj_1.jpg" alt="Makkah" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 text-white text-[10px] font-bold tracking-wider">
                <LucideIcons.Shield className="w-3 h-3" /> HAJJ 2027
              </div>
              <div className="absolute top-4 right-4 bg-[#DB9E30] text-[#1a2b25] px-3 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1.5">
                <LucideIcons.Calendar className="w-3 h-3" /> 14 Days
              </div>

              {/* Bottom text */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="text-[#20d88a] text-[10px] font-black tracking-widest mb-1 flex items-center gap-2">
                  <LucideIcons.Plane className="w-3 h-3" /> FROM CANADA <LucideIcons.ArrowRight className="w-3 h-3" /> TO SAUDIA
                </div>
                <h3 className="text-white font-serif text-2xl leading-tight">Economy Hajj Package 2027</h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">ACCOMMODATIONS</div>

              <div className="flex flex-col gap-3 flex-1 mb-6">
                {/* Hotel 1 */}
                <div className="flex gap-4 p-3 rounded-2xl border border-[#eef0e4] bg-[#fcfdf9]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=200&q=80" alt="Hotel" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[#004B39] font-bold text-sm mb-1">5 Star Hotel in Makkah</h4>
                    <div className="text-gray-500 text-[10px] flex items-center gap-1 mb-2"><LucideIcons.MapPin className="w-3 h-3" /> Near to Haram</div>
                    <div className="flex gap-2">
                      <span className="bg-[#004B39] text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">Breakfast</span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">4 Nights</span>
                    </div>
                  </div>
                </div>

                {/* Hotel 2 */}
                <div className="flex gap-4 p-3 rounded-2xl border border-[#eef0e4] bg-[#fcfdf9]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80" alt="Hotel" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[#004B39] font-bold text-sm mb-1">5 Star Hotel in Madinah</h4>
                    <div className="text-gray-500 text-[10px] flex items-center gap-1 mb-2"><LucideIcons.MapPin className="w-3 h-3" /> Near to Masjid Nabawi</div>
                    <div className="flex gap-2">
                      <span className="bg-[#004B39] text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">Breakfast</span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">4 Nights</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 flex items-end justify-between mb-6">
                <div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">OPERATOR</div>
                  <div className="text-sm font-bold text-[#1a2b25] flex items-center gap-2">King Travel <span className="bg-[#DB9E30] text-[#1a2b25] text-[10px] px-1.5 py-0.5 rounded font-black">4.4/5</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">FROM CAD / QUAD OCCUPANCY</div>
                  <div className="text-2xl font-black text-[#1a2b25]">12,995</div>
                </div>
              </div>

              <button className="w-full py-3.5 bg-[#DB9E30] hover:bg-[#c58d2a] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
                <LucideIcons.BookOpen className="w-4 h-4" /> Book Hajj 2027
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col">
            <div className="relative h-[240px] w-full">
              <img src="uploads/sections/hajj_1.jpg" alt="Makkah" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 text-white text-[10px] font-bold tracking-wider">
                <LucideIcons.Shield className="w-3 h-3" /> HAJJ 2027
              </div>
              <div className="absolute top-4 right-4 bg-[#DB9E30] text-[#1a2b25] px-3 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1.5">
                <LucideIcons.Calendar className="w-3 h-3" /> 17 Days
              </div>

              {/* Bottom text */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="text-[#20d88a] text-[10px] font-black tracking-widest mb-1 flex items-center gap-2">
                  <LucideIcons.Plane className="w-3 h-3" /> FROM CANADA <LucideIcons.ArrowRight className="w-3 h-3" /> TO SAUDIA
                </div>
                <h3 className="text-white font-serif text-2xl leading-tight">Deluxe Hajj 2027</h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">ACCOMMODATIONS</div>

              <div className="flex flex-col gap-3 flex-1 mb-6">
                {/* Hotel 1 */}
                <div className="flex gap-4 p-3 rounded-2xl border border-[#eef0e4] bg-[#fcfdf9]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1542314831-c53cd4b85d3e?auto=format&fit=crop&w=200&q=80" alt="Hotel" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[#004B39] font-bold text-sm mb-1">5 Star Hotel Fairmont Makkah</h4>
                    <div className="text-gray-500 text-[10px] flex items-center gap-1 mb-2"><LucideIcons.MapPin className="w-3 h-3" /> Near to Haram</div>
                    <div className="flex gap-2">
                      <span className="bg-[#004B39] text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">Buffet Included</span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">8 Nights</span>
                    </div>
                  </div>
                </div>

                {/* Hotel 2 */}
                <div className="flex gap-4 p-3 rounded-2xl border border-[#eef0e4] bg-[#fcfdf9]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1551882547-ff40c0d5b98f?auto=format&fit=crop&w=200&q=80" alt="Hotel" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[#004B39] font-bold text-sm mb-1">5 Star Hotel Dar Al Eman Madi...</h4>
                    <div className="text-gray-500 text-[10px] flex items-center gap-1 mb-2"><LucideIcons.MapPin className="w-3 h-3" /> Near to Masjid Nabawi</div>
                    <div className="flex gap-2">
                      <span className="bg-[#004B39] text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">Buffet Included</span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">7 Nights</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 flex items-end justify-between mb-6">
                <div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">OPERATOR</div>
                  <div className="text-sm font-bold text-[#1a2b25] flex items-center gap-2">King Travel <span className="bg-[#DB9E30] text-[#1a2b25] text-[10px] px-1.5 py-0.5 rounded font-black">4.4/5</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">FROM CAD / QUAD OCCUPANCY</div>
                  <div className="text-2xl font-black text-[#1a2b25]">17,995</div>
                </div>
              </div>

              <button className="w-full py-3.5 bg-[#DB9E30] hover:bg-[#c58d2a] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
                <LucideIcons.BookOpen className="w-4 h-4" /> Book Hajj 2027
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col">
            <div className="relative h-[240px] w-full">
              <img src="uploads/sections/hajj_1.jpg" alt="Makkah" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 text-white text-[10px] font-bold tracking-wider">
                <LucideIcons.Shield className="w-3 h-3" /> HAJJ 2027
              </div>
              <div className="absolute top-4 right-4 bg-[#DB9E30] text-[#1a2b25] px-3 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1.5">
                <LucideIcons.Calendar className="w-3 h-3" /> 10 Days
              </div>

              {/* Bottom text */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="text-[#20d88a] text-[10px] font-black tracking-widest mb-1 flex items-center gap-2">
                  <LucideIcons.Plane className="w-3 h-3" /> FROM CANADA <LucideIcons.ArrowRight className="w-3 h-3" /> TO SAUDIA
                </div>
                <h3 className="text-white font-serif text-2xl leading-tight">Express Custom Hajj 2027</h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">ACCOMMODATIONS</div>

              <div className="flex flex-col gap-3 flex-1 mb-6">
                {/* Hotel 1 */}
                <div className="flex gap-4 p-3 rounded-2xl border border-[#eef0e4] bg-[#fcfdf9]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1560662105-57f8ad6ae2d1?auto=format&fit=crop&w=200&q=80" alt="Hotel" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[#004B39] font-bold text-sm mb-1">Hyatt Regency Makkah</h4>
                    <div className="text-gray-500 text-[10px] flex items-center gap-1 mb-2"><LucideIcons.MapPin className="w-3 h-3" /> Jabal Omar (Short Walk)</div>
                    <div className="flex gap-2">
                      <span className="bg-[#004B39] text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">Breakfast</span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">5 Nights</span>
                    </div>
                  </div>
                </div>

                {/* Hotel 2 */}
                <div className="flex gap-4 p-3 rounded-2xl border border-[#eef0e4] bg-[#fcfdf9]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1542314831-c53cd4b85d3e?auto=format&fit=crop&w=200&q=80" alt="Hotel" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[#004B39] font-bold text-sm mb-1">Pullman Zamzam Madinah</h4>
                    <div className="text-gray-500 text-[10px] flex items-center gap-1 mb-2"><LucideIcons.MapPin className="w-3 h-3" /> Walking Distance</div>
                    <div className="flex gap-2">
                      <span className="bg-[#004B39] text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">Breakfast</span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded font-bold tracking-wider">5 Nights</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 flex items-end justify-between mb-6">
                <div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">OPERATOR</div>
                  <div className="text-sm font-bold text-[#1a2b25] flex items-center gap-2">King Travel <span className="bg-[#DB9E30] text-[#1a2b25] text-[10px] px-1.5 py-0.5 rounded font-black">4.4/5</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">FROM CAD / QUAD OCCUPANCY</div>
                  <div className="text-2xl font-black text-[#1a2b25]">14,995</div>
                </div>
              </div>

              <button className="w-full py-3.5 bg-[#DB9E30] hover:bg-[#c58d2a] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
                <LucideIcons.BookOpen className="w-4 h-4" /> Book Hajj 2027
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
