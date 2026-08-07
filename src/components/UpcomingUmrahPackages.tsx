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
          {(data?.items || []).map((pkg: any, idx: number) => {
            const isGold = pkg.isActiveCard;
            return (
              <div key={idx} className={`${isGold ? 'bg-[#DB9E30] shadow-[0_8px_30px_rgb(0,0,0,0.12)] mt-0 xl:mt-8' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100'} rounded-[32px] overflow-hidden flex flex-col`}>
                <div className="relative h-48 w-full">
                  <img src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-800 tracking-wider">{pkg.starRating} STAR</div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className={`${isGold ? 'text-[#004B39]/70' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-2`}>{pkg.month}</div>
                  <h3 className="text-2xl font-serif text-[#004B39] mb-2">{pkg.title}</h3>
                  <div className={`${isGold ? 'text-[#004B39]' : 'text-[#DB9E30]'} font-black text-xl mb-6`}>CAD {pkg.price} <span className={`text-sm font-medium ${isGold ? 'opacity-80' : 'text-gray-500'}`}>/ Person</span></div>

                  <div className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isGold ? 'text-[#004B39]/70' : 'text-gray-400'}`}>PACKAGE INCLUDES</div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {(pkg.includes || []).map((inc: string, i: number) => {
                      const firstWord = inc.split(' ')[0].toLowerCase();
                      let Icon = LucideIcons.CheckCircle;
                      if (firstWord === 'return' || firstWord === 'flights') Icon = LucideIcons.Plane;
                      else if (firstWord === 'luxury' || firstWord === 'transport') Icon = LucideIcons.Bus;
                      else if (firstWord === 'free' || firstWord === 'ihram') Icon = LucideIcons.Gift;
                      else if (firstWord === 'registration' || firstWord === 'visa') Icon = LucideIcons.FileText;
                      else if (firstWord === 'imam' || firstWord === 'guide') Icon = LucideIcons.Users;
                      else if (firstWord === '5' || firstWord === 'hotel') Icon = LucideIcons.Hotel;

                      return (
                        <li key={i} className={`flex gap-3 text-sm ${isGold ? 'text-[#004B39]/90' : 'text-gray-600'}`}>
                          <Icon className={`w-4 h-4 shrink-0 ${isGold ? 'text-[#004B39]/90' : 'text-gray-400'}`} /> {inc}
                        </li>
                      );
                    })}
                  </ul>

                  <a href={pkg.buttonUrl || '#contact'} className={`w-full py-4 text-center text-xs font-black rounded-xl uppercase tracking-widest transition-colors block ${isGold ? 'bg-[#2c3e35] hover:bg-[#1a2520] text-white' : 'bg-[#DB9E30] hover:bg-[#c58d2a] text-white'}`}>
                    {pkg.buttonText || 'BOOK NOW'}
                  </a>
                </div>
              </div>
            );
          })}
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
