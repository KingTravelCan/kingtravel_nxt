import React from 'react';

interface PageBannerProps {
  title: string;
  description?: string | null;
  bgImage?: string | null;
  position?: string | null;
  size?: string | null;
}

const DEFAULT_BANNER_BG = "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg";

export default function PageBanner({
  title,
  description,
  bgImage,
  position = 'center center',
  size = 'cover',
}: PageBannerProps) {
  const activeBg = (bgImage && bgImage.trim() !== '') ? bgImage : DEFAULT_BANNER_BG;
  const activePos = position || 'center center';
  const activeSize = size || 'cover';

  const cleanBg = activeBg.replace(/"/g, "'");

  return (
    <section
      ref={(el) => {
        if (el) {
          el.style.backgroundImage = `linear-gradient(rgba(10, 66, 45, 0.45), rgba(10, 66, 45, 0.45)), url("${cleanBg}")`;
          el.style.backgroundPosition = activePos;
          el.style.backgroundSize = activeSize;
        }
      }}
      className="relative text-center text-white py-20 px-5 overflow-hidden h-[360px] min-h-[360px] flex flex-col items-center justify-center bg-no-repeat"
    >
      <div className="max-w-[850px] mx-auto w-full z-10">
        <h1
          className="text-3xl md:text-5xl font-serif font-normal text-white mb-3 tracking-wide [&>span]:text-[#DB9E30] [&>em]:text-[#DB9E30] [&>em]:not-italic"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {description && (
          <p
            className="text-sm md:text-base opacity-90 max-w-2xl mx-auto font-light leading-relaxed text-white/90"
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
