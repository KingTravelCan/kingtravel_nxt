import React from 'react';

interface PageBannerProps {
  title: string;
  description?: string | null;
  bgImage?: string | null;
  position?: string | null;
  size?: string | null;
}

export default function PageBanner({
  title,
  description,
  bgImage,
  position = 'center center',
  size = 'cover',
}: PageBannerProps) {
  const defaultBg = 'https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg';
  const activeBg = bgImage || defaultBg;
  const activePos = position || 'center center';
  const activeSize = size || 'cover';

  return (
    <section
      className="relative text-center text-white py-20 px-5 overflow-hidden"
      style={{
        background: `linear-gradient(rgba(10, 66, 45, 0.88), rgba(10, 66, 45, 0.85)), url('${activeBg}') ${activePos} / ${activeSize} no-repeat`,
        minHeight: '260px',
        maxHeight: '360px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="max-w-[1280px] mx-auto w-full z-10">
        <h1
          className="text-3xl md:text-5xl font-serif font-normal text-white mb-3 tracking-wide [&>span]:text-[#DB9E30] [&>em]:text-[#DB9E30] [&>em]:not-italic"
          style={{ fontFamily: "var(--serif, 'Marcellus', serif)" }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {description && (
          <p
            className="text-sm md:text-base opacity-90 max-w-2xl mx-auto font-light leading-relaxed text-white/90"
            style={{ fontFamily: "var(--sans, 'Plus Jakarta Sans', sans-serif)" }}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
