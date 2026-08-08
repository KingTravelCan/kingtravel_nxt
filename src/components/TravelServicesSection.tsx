"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";

export default function TravelServicesSection({ data }: { data: any }) {
  const eyebrow = data?.eyebrow || "SERVICES WE OFFER";
  const title = data?.title || "Select your preferred travel<br />service";
  
  const defaultServices = [
    { title: 'Umrah Packages', desc: 'Flexible departures with flights, stays & guidance included.', icon: 'Star' },
    { title: 'Hajj Packages', desc: 'Fully accredited pilgrimage packages, curated end to end.', icon: 'Briefcase' },
    { title: 'Airline Tickets', desc: 'Best-fare flights sourced from every route into Jeddah.', icon: 'ArrowLeftRight' },
    { title: 'Saudi Visa Services', desc: 'Full visa processing, handled and confirmed before departure.', icon: 'CreditCard' },
    { title: 'Hotel Booking', desc: '5-star stays within walking distance of the Haram.', icon: 'Home' },
    { title: 'Global Flight Reservations', desc: 'Worldwide reliable flight bookings for any itinerary.', icon: 'Globe' },
    { title: 'Travel Documentation', desc: 'Guidance on every document your journey requires.', icon: 'FileText' },
    { title: 'Group & Private Tours', desc: 'Private, guided, and fully customizable itineraries.', icon: 'User' },
  ];

  const services = data?.items?.length ? data.items : defaultServices;

  return (
    <section className="py-20 bg-[#f4f6ec]">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center flex flex-col items-center mb-16">
          <h3 className="eyebrow">{eyebrow}</h3>
          <h2 
            className=""
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s: any, i: number) => (
            <div key={i} className="bg-[#fcfdf9] rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#eef0e4] hover:-translate-y-1 transition-transform duration-300 cursor-pointer flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-[#faeed8] flex items-center justify-center text-[#DB9E30] mb-6">
                <DynamicIcon name={s.icon || 'Star'} className="w-5 h-5" />
              </div>
              <h4 className="text-[#1a2b25] font-serif text-lg mb-3">{s.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc || s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
