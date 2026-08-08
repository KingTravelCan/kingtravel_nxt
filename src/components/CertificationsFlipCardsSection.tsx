import React from 'react';
import Image from 'next/image';

interface FlipCardItem {
  logo: string;
  title: string;
  description: string;
  linkUrl?: string;
}

interface CertificationsFlipCardsSectionProps {
  data: {
    eyebrow?: string;
    title?: string;
    bgImage?: string;
    items?: FlipCardItem[];
  };
}

export default function CertificationsFlipCardsSection({ data }: CertificationsFlipCardsSectionProps) {
  const {
    eyebrow = 'WHY THEY MATTER',
    title = 'OUR CERTIFICATIONS',
    bgImage,
    items: dataItems = []
  } = data || {};

  const items = dataItems.length > 0 ? dataItems : [
    { logo: '/img/tico.svg', title: 'TICO', description: 'TICO regulates travel agencies in Ontario, protecting consumer prepaid funds and ensuring compliance with strict Canadian travel industry regulations.' },
    { logo: '/img/iata.svg', title: 'IATA', description: 'Being an IATA accredited agency allows us to work directly with airlines, offering competitive airfares, seamless ticketing, and exclusive deals.' },
    { logo: '/img/acta.svg', title: 'ACTA', description: 'ACTA membership advocates for ethical travel practices and professional excellence across the Canadian travel industry.' },
    { logo: '/img/asta.svg', title: 'ASTA', description: 'ASTA certification connects us with global travel standards and verified international destination management networks.' },
    { logo: '/img/atac.svg', title: 'ATAC', description: 'ATAC represents air transport excellence and safe aviation ticketing protocols across Canada.' },
    { logo: '', title: 'Saudi Ministry of Foreign Affairs', description: 'Official Saudi Ministry authorization for processing Umrah, Hajj, business, and tourist visas directly from Canada.' }
  ];

  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 relative bg-[#f4f6ec] overflow-hidden">
      {bgImage && (
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src={bgImage}
            alt="Background pattern"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#DB9E30] font-black uppercase tracking-[0.2em] text-xs mb-3 block">
            {eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#004B39]">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="h-64 w-full group [perspective:1000px]">
              <div className="relative h-full w-full rounded-[32px] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-sm hover:shadow-xl">
                
                {/* Front Side */}
                <div className="absolute inset-0 h-full w-full rounded-[32px] bg-white p-8 backface-hidden flex items-center justify-center border border-gray-100 z-10">
                  {item.logo ? (
                    <div className="relative w-4/5 h-4/5 flex items-center justify-center">
                      <img
                        src={item.logo}
                        alt={item.title || 'Certification Logo'}
                        className="max-h-full max-w-full object-contain w-36 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                  ) : (
                    <span className="text-[#004B39] font-bold text-center">{item.title}</span>
                  )}
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 h-full w-full rounded-[32px] bg-[#004B39] text-white p-8 [transform:rotateY(180deg)] backface-hidden flex flex-col justify-center items-center text-center">
                  <h3 className="font-bold text-lg mb-3 text-[#DB9E30]">{item.title}</h3>
                  <p className="text-sm text-emerald-50/90 leading-relaxed overflow-y-auto custom-scrollbar">
                    {item.description}
                  </p>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
