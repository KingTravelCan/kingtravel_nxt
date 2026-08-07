"use client";

import Image from "next/image";

interface MarqueeTrackProps {
  type: "travel" | "airline";
  images: { src: string; alt?: string }[];
  speedMs?: number;
  direction?: "left" | "right";
  cardStyle?: boolean;
}

export default function MarqueeTrack({ type, images, speedMs = 35000, direction = "left", cardStyle = false }: MarqueeTrackProps) {
  // Duplicate images for infinite scroll loop
  const displayImages = [...images, ...images];
  const animationDuration = `${speedMs / 1000}s`;
  const animationDirection = direction === "right" ? "reverse" : "normal";

  return (
    <div className="marquee-widget">
      <div className="marquee-wrapper">
        <div
          ref={(el) => {
            if (el) {
              el.style.animationDuration = animationDuration;
              el.style.animationDirection = animationDirection;
            }
          }}
          className={`marquee-track ${type}`}
        >
          {displayImages.map((img, idx) => (
            <div className={`marquee-item ${cardStyle ? 'p-3' : ''}`} key={idx}>
              <div className={`w-full h-full flex items-center justify-center ${cardStyle ? 'bg-white rounded-[20px] border border-slate-200/60 shadow-sm p-6 min-h-[110px]' : ''}`}>
                {img.src.startsWith('data:') ? (
                  <img
                    src={img.src}
                    alt={img.alt || "Partner logo"}
                    className="w-auto h-auto max-h-[60px] max-w-full object-contain"
                  />
                ) : (
                  <Image
                    src={img.src}
                    alt={img.alt || "Partner logo"}
                    width={200}
                    height={80}
                    className="w-auto h-auto max-w-full"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
