"use client";

import * as LucideIcons from "lucide-react";

export default function UpcomingUmrahPackages({ data }: { data: any }) {
  // Use data from the CMS if available, otherwise fallback to hardcoded
  const eyebrow = data?.eyebrow || "EXCLUSIVE UPCOMING";
  const title = data?.title || "Umrah Packages<br />from Canada";
  const description = data?.description || "Departures from CAD 2,595 per person. Availability and accommodations are confirmed with every booking – contact us before reserving.";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h3 className="text-[#DB9E30] font-black uppercase tracking-widest text-xs mb-3">{eyebrow}</h3>
            <h2 
              className="text-4xl md:text-5xl font-serif text-[#004B39] leading-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
          <div className="max-w-sm text-gray-500 text-sm leading-relaxed border-l-2 border-gray-200 pl-4">
            {description}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {/* Card 1 */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col border border-gray-100">
            <div className="relative h-48 w-full">
              <img src="uploads/sections/hajj_1.jpg" alt="Makkah" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">5 STAR</div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">AUGUST · 2026</div>
              <h3 className="text-2xl font-serif text-[#004B39] mb-2">5 Star Umrah Package</h3>
              <div className="text-[#DB9E30] font-black text-xl mb-6">CAD 2,895 <span className="text-sm font-medium text-gray-500">/ Person</span></div>

              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">PACKAGE INCLUDES</div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Plane className="w-4 h-4 text-gray-400 shrink-0" /> Return Flights from Toronto</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Bus className="w-4 h-4 text-gray-400 shrink-0" /> Luxury Ground Transportation</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Gift className="w-4 h-4 text-gray-400 shrink-0" /> Free Ihram Kit</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.FileText className="w-4 h-4 text-gray-400 shrink-0" /> Registration & Visa Assistance</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Users className="w-4 h-4 text-gray-400 shrink-0" /> Imam Lead Guide & Seminar</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Hotel className="w-4 h-4 text-gray-400 shrink-0" /> 5 Star Hotels Makkah & Madinah</li>
              </ul>

              <button className="w-full py-4 bg-[#DB9E30] hover:bg-[#c58d2a] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors">BOOK NOW</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#DB9E30] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col mt-0 xl:mt-8">
            <div className="relative h-48 w-full">
              <img src="https://images.unsplash.com/photo-1565552070098-fd83a8dac718?auto=format&fit=crop&w=600&q=80" alt="Madinah" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">5 STAR</div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-[#004B39]/70 text-xs font-bold uppercase tracking-widest mb-2">SEPTEMBER · 2026</div>
              <h3 className="text-2xl font-serif text-[#004B39] mb-2">5 Star Umrah Package</h3>
              <div className="text-[#004B39] font-black text-xl mb-6">CAD 2,695 <span className="text-sm font-medium opacity-80">/ Person</span></div>

              <div className="text-[10px] font-black text-[#004B39]/70 uppercase tracking-widest mb-4">PACKAGE INCLUDES</div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Plane className="w-4 h-4 shrink-0" /> Return Flights from Toronto</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Bus className="w-4 h-4 shrink-0" /> Luxury Ground Transportation</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Gift className="w-4 h-4 shrink-0" /> Free Ihram Kit</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.FileText className="w-4 h-4 shrink-0" /> Registration & Visa Assistance</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Users className="w-4 h-4 shrink-0" /> Imam Lead Guide & Seminar</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Hotel className="w-4 h-4 shrink-0" /> 5 Star Hotels Makkah & Madinah</li>
              </ul>

              <button className="w-full py-4 bg-[#2c3e35] hover:bg-[#1a2520] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors">BOOK NOW</button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col border border-gray-100">
            <div className="relative h-48 w-full">
              <img src="uploads/sections/hajj_1.jpg" alt="Makkah" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">5 STAR</div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">OCTOBER · 2026</div>
              <h3 className="text-2xl font-serif text-[#004B39] mb-2">5 Star Umrah Package</h3>
              <div className="text-[#DB9E30] font-black text-xl mb-6">CAD 2,795 <span className="text-sm font-medium text-gray-500">/ Person</span></div>

              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">PACKAGE INCLUDES</div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Plane className="w-4 h-4 text-gray-400 shrink-0" /> Return Flights from Toronto</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Bus className="w-4 h-4 text-gray-400 shrink-0" /> Luxury Ground Transportation</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Gift className="w-4 h-4 text-gray-400 shrink-0" /> Free Ihram Kit</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.FileText className="w-4 h-4 text-gray-400 shrink-0" /> Registration & Visa Assistance</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Users className="w-4 h-4 text-gray-400 shrink-0" /> Imam Lead Guide & Seminar</li>
                <li className="flex gap-3 text-sm text-gray-600"><LucideIcons.Hotel className="w-4 h-4 text-gray-400 shrink-0" /> 5 Star Hotels Makkah & Madinah</li>
              </ul>

              <button className="w-full py-4 bg-[#DB9E30] hover:bg-[#c58d2a] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors">BOOK NOW</button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#DB9E30] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col mt-0 xl:mt-8">
            <div className="relative h-48 w-full">
              <img src="https://images.unsplash.com/photo-1565552070098-fd83a8dac718?auto=format&fit=crop&w=600&q=80" alt="Madinah" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">5 STAR</div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-[#004B39]/70 text-xs font-bold uppercase tracking-widest mb-2">NOVEMBER · 2026</div>
              <h3 className="text-2xl font-serif text-[#004B39] mb-2">5 Star Umrah Package</h3>
              <div className="text-[#004B39] font-black text-xl mb-6">CAD 2,795 <span className="text-sm font-medium opacity-80">/ Person</span></div>

              <div className="text-[10px] font-black text-[#004B39]/70 uppercase tracking-widest mb-4">PACKAGE INCLUDES</div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Plane className="w-4 h-4 shrink-0" /> Return Flights from Toronto</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Bus className="w-4 h-4 shrink-0" /> Luxury Ground Transportation</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Gift className="w-4 h-4 shrink-0" /> Free Ihram Kit</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.FileText className="w-4 h-4 shrink-0" /> Registration & Visa Assistance</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Users className="w-4 h-4 shrink-0" /> Imam Lead Guide & Seminar</li>
                <li className="flex gap-3 text-sm text-[#004B39]/90"><LucideIcons.Hotel className="w-4 h-4 shrink-0" /> 5 Star Hotels Makkah & Madinah</li>
              </ul>

              <button className="w-full py-4 bg-[#2c3e35] hover:bg-[#1a2520] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors">BOOK NOW</button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button className="px-8 py-3.5 border-2 border-[#004B39] text-[#004B39] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#004B39] hover:text-white transition-all flex items-center gap-3">
            SEE ALL PACKAGES <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
