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
    <section className="py-16 md:py-24 bg-sage">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Image */}
          <div className="relative justify-self-center lg:justify-self-end">
            <div className="rounded-[40px] overflow-hidden shadow-2xl relative aspect-[4/3] w-[90vw] max-w-[550px]">
              <img src={image.replace(/\\/g, '/')} alt="Kaaba" className="w-full h-full object-cover" />
            </div>

            {/* Review Badge */}
            <div className="absolute -bottom-6 -left-2 sm:-bottom-8 sm:-left-8 bg-white p-5 rounded-2xl shadow-xl w-64">
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 max-sm:grid-cols-3 sm:grid-cols-3 gap-4">
              <div className="bg-[#fbfbf9] border border-[#e5e7dc] rounded-2xl p-4 sm:p-5 text-center shadow-sm">
                <div className="text-gold font-serif text-xl sm:text-2xl mb-1 mb-wwa-yellow-font">25+</div>
                <div className="text-[10px] uppercase font-bold text-ink-soft tracking-wider">Years Serving Canada</div>
              </div>
              <div className="bg-[#fbfbf9] border border-[#e5e7dc] rounded-2xl p-4 sm:p-5 text-center shadow-sm">
                <div className="text-gold font-serif text-xl sm:text-2xl mb-1 mb-wwa-yellow-font">10k+</div>
                <div className="text-[10px] uppercase font-bold text-ink-soft tracking-wider">Pilgrims Guided</div>
              </div>
              <div className="bg-[#fbfbf9] border border-[#e5e7dc] rounded-2xl p-4 sm:p-5 text-center shadow-sm">
                <div className="text-gold font-serif text-xl sm:text-2xl mb-1 mb-wwa-yellow-font">5★</div>
                <div className="text-[10px] uppercase font-bold text-ink-soft tracking-wider">Hotels, Every Package</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
