"use client";

export default function WhoWeAreSection({ data }: { data: any }) {
  // Use data from the CMS if available, otherwise fallback to hardcoded
  const eyebrow = data?.eyebrow || "WHO WE ARE";
  const title = data?.title || "We provide and offer<br />Hajj & Umrah packages";
  const description1 = data?.description1 || "King Travel proudly provides reliable and professional Hajj and Umrah services across Canada. With years of experience serving the Muslim community, we are committed to making your sacred journey smooth, comfortable, and spiritually fulfilling.";
  const description2 = data?.description2 || "Whether you are traveling for Hajj, Umrah, or Saudi Visa services, our expert team is here to guide you every step of the way.";
  const image = data?.image || "uploads\\sections\\hajj_1.jpg";
  const reviewText = data?.reviewText || "\"Every detail handled — from visa to hotel, steps from the Haram.\"";

  return (
    <section className="py-12 md:py-16 bg-sage">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Image */}
          <div className="relative justify-self-center lg:justify-self-end">
            <div className="rounded-[40px] overflow-hidden shadow-2xl relative aspect-square w-[90vw] max-w-[600px]">
              <img src={image.replace(/\\/g, '/')} alt="Kaaba" className="w-full h-full object-cover" />
            </div>

            {/* Review Badge */}
            <div className="absolute bottom-4 -left-2 sm:bottom-8 sm:-left-8 bg-white p-5 rounded-2xl shadow-xl w-64">
              <div className="flex text-gold text-sm mb-2">★★★★★</div>
              <p className="text-xs text-ink-soft font-medium leading-relaxed">
                {reviewText}
              </p>
            </div>
          </div>

          {/* Right: Text & Stats */}
          <div>
            <h3 className="eyebrow">{eyebrow}</h3>
            <h2
              className="font-serif  leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="!text-[18px] text-ink-soft mb-6 leading-relaxed text-sm md:text-base">
              {description1}
            </p>
            <p className="!text-[18px] text-ink-soft mb-10 leading-relaxed text-sm md:text-base">
              {description2}
            </p>
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 border border-slate-50 overflow-hidden">
                {((data?.items && Array.isArray(data.items) && data.items.length > 0) ? data.items : [
                  { value: '72K+', label: 'Happy Travelers' },
                  { value: '4.4', label: 'Google Rating' },
                  { value: '100%', label: 'Client Satisfaction' },
                  { value: '25+', label: 'Years Experience' }
                ]).map((stat: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`text-center py-6 px-4 border-slate-100 ${
                      idx % 2 === 0 ? 'border-r' : ''
                    } ${
                      idx < 2 ? 'border-b md:border-b-0' : ''
                    } ${
                      idx < 3 ? 'md:border-r' : ''
                    }`}
                  >
                    <div className="text-primary font-serif text-2xl md:text-3xl mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-ink-light uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
