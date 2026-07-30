import { getPageBySlug } from '@/actions/pageActions';
import PageBanner from '@/components/PageBanner';
import MarqueeTrack from '@/components/MarqueeTrack';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface DynamicPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CatchAllDynamicPage({ params }: DynamicPageProps) {
  const resolvedParams = await params;
  const slugPath = '/' + (resolvedParams.slug ? resolvedParams.slug.join('/') : '');

  const page = await getPageBySlug(slugPath);

  if (!page || page.status === 'draft') {
    notFound();
  }

  let sections: any[] = [];
  if (page.sections) {
    try {
      sections = JSON.parse(page.sections);
    } catch {
      sections = [];
    }
  }

  return (
    <main className="bg-[#f2f5f3] min-h-screen pb-16">
      {/* Dynamic Hero Banner */}
      <PageBanner
        title={page.bannerTitle || page.title}
        description={page.bannerDescription || ''}
        bgImage={page.bannerBgImage || undefined}
        position={page.bannerPosition || undefined}
        size={page.bannerSize || undefined}
      />

      {/* Dynamic Page Content / Sections */}
      {sections.length > 0 ? (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
          {sections.map((sec: any, idx: number) => {
            if (sec.type === 'Image+Text' || sec.type === 'Why Choose Us') {
              return (
                <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {sec.data?.image && (
                    <div className="rounded-2xl overflow-hidden shadow-md">
                      <Image src={sec.data.image} alt={sec.data.title || ''} width={800} height={450} className="w-full h-auto object-cover" unoptimized />
                    </div>
                  )}
                  <div className="space-y-4">
                    {sec.data?.eyebrow && <span className="text-xs font-extrabold uppercase tracking-widest text-[#DB9E30]">{sec.data.eyebrow}</span>}
                    {sec.data?.title && <h2 className="text-2xl font-serif font-bold text-[#004B39]">{sec.data.title}</h2>}
                    {sec.data?.description && <p className="text-slate-600 leading-relaxed text-sm">{sec.data.description}</p>}
                  </div>
                </div>
              );
            }

            if (sec.type === 'Certifications Flip Cards' || sec.type === 'Our Certifications') {
              const bgImg = sec.data?.bgImage || 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1920&q=80';
              const items = (sec.data?.items && Array.isArray(sec.data.items) && sec.data.items.length > 0) ? sec.data.items : [
                { logo: '/img/tico-logo.png', title: 'TICO – Travel Industry Council of Ontario', description: 'TICO regulates travel agencies in Ontario, protecting consumer prepaid funds and ensuring compliance with strict Canadian travel industry regulations.' },
                { logo: '/img/iata-logo.png', title: 'IATA – International Air Transport Association', description: 'Being an IATA accredited agency allows us to work directly with airlines, offering competitive airfares, seamless ticketing, and exclusive travel deals.' },
                { logo: '/img/acta-logo.png', title: 'ACTA – Association of Canadian Travel Agencies', description: 'ACTA membership advocates for ethical travel practices and professional excellence across the Canadian travel industry.' },
                { logo: '/img/asta-logo.png', title: 'ASTA – American Society of Travel Advisors', description: 'ASTA certification connects us with global travel standards and verified international destination management networks.' },
                { logo: '/img/atac-logo.png', title: 'ATAC – Air Transportation Association of Canada', description: 'ATAC represents air transport excellence and safe aviation ticketing protocols across Canada.' },
                { logo: '/img/mofa-logo.png', title: 'Saudi Ministry of Foreign Affairs', description: 'Official Saudi Ministry authorization for processing Umrah, Hajj, business, and tourist visas directly from Canada.' }
              ];

              return (
                <section
                  key={idx}
                  className="!w-full relative py-16 overflow-hidden bg-cover bg-center shadow-xl"
                  style={{ backgroundImage: `linear-gradient(rgba(7, 19, 16, 0.85), rgba(7, 19, 16, 0.85)), url("${bgImg}")` }}
                >
                  <div className="max-w-6xl mx-auto text-center mb-12">
                    <div className="text-xs font-bold uppercase tracking-widest text-[#DB9E30] mb-2">
                      {sec.data?.eyebrow || 'WHY THEY MATTER'}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wider">
                      {sec.data?.title || 'OUR CERTIFICATIONS'}
                    </h2>
                  </div>

                  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {items.map((item: any, cIdx: number) => (
                      <div
                        key={cIdx}
                        className="group h-[240px] [perspective:1000px] cursor-pointer"
                      >
                        <div className="relative w-full h-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-lg">
                          {/* Front Side: Only Logo */}
                          <div className="absolute inset-0 w-full h-full bg-white rounded-2xl p-6 flex items-center justify-center [backface-visibility:hidden]">
                            {item.logo ? (
                              item.logo.startsWith('data:') ? (
                                <img src={item.logo} alt={item.title || 'Certification'} className="max-h-[140px] max-w-[85%] object-contain" />
                              ) : (
                                <Image src={item.logo} alt={item.title || 'Certification'} width={220} height={120} className="max-h-[140px] w-auto max-w-[85%] object-contain" unoptimized />
                              )
                            ) : (
                              <span className="text-lg font-bold text-[#004B39] text-center">{item.title}</span>
                            )}
                          </div>

                          {/* Back Side: Title & Description */}
                          <div className="absolute inset-0 w-full h-full bg-[#f1f8f5] border border-emerald-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                            <h3 className="text-sm font-extrabold text-[#004B39] mb-3 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sec.type === 'Airlines Marquee' || sec.type === 'Partners Marquee' || sec.type === 'Airlines Logo Carousel' || sec.type === 'Logo Carousel') {
              const defaultLogos = [
                { src: '/img/a-1.png', alt: 'Saudi Airlines' },
                { src: '/img/a-2.png', alt: 'Emirates' },
                { src: '/img/a-3.png', alt: 'Qatar Airways' },
                { src: '/img/a-4.png', alt: 'Turkish Airlines' },
                { src: '/img/a-5.png', alt: 'Etihad Airways' },
                { src: '/img/a-6.png', alt: 'EgyptAir' },
                { src: '/img/a-7.png', alt: 'Royal Jordanian' },
                { src: '/img/a-8.png', alt: 'Gulf Air' },
                { src: '/img/a-9.png', alt: 'Air Canada' },
              ];
              const logos = (sec.data?.logos && Array.isArray(sec.data.logos) && sec.data.logos.length > 0)
                ? sec.data.logos
                : defaultLogos;

              return (
                <section key={idx} className="py-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <div className="text-center mb-6">
                    {sec.data?.eyebrow && <span className="text-xs font-bold uppercase tracking-widest text-[#DB9E30] block mb-1">{sec.data.eyebrow}</span>}
                    {sec.data?.title && <h2 className="text-2xl font-serif text-[#004B39]">{sec.data.title}</h2>}
                  </div>
                  <MarqueeTrack
                    type="airline"
                    images={logos}
                    speedMs={sec.data?.speedMs}
                    direction={sec.data?.direction}
                  />
                </section>
              );
            }

            return (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                {sec.title && <h2 className="text-2xl font-bold text-slate-800 mb-4">{sec.title}</h2>}
                {sec.data?.description && <p className="text-slate-600 leading-relaxed">{sec.data.description}</p>}
              </div>
            );
          })}
        </div>
      ) : page.richText ? (
        <div className="w-full max-w-4xl mx-auto px-4 py-12 prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: page.richText }} />
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-700">{page.title}</h2>
          <p className="text-green mt-2">Content coming soon.</p>
        </div>
      )}
    </main>
  );
}
