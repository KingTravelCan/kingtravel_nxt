"use client";

import Image from "next/image";

interface MarqueeTrackProps {
  type: "travel" | "airline";
  images: { src: string; alt?: string }[];
}

export default function MarqueeTrack({ type, images }: MarqueeTrackProps) {
  // Duplicate images for infinite scroll loop
  const displayImages = [...images, ...images];

  return (
    <div className="marquee-widget reveal">
      <div className="marquee-wrapper">
        <div className={`marquee-track ${type}`}>
          {displayImages.map((img, idx) => (
            <div className="marquee-item" key={idx}>
              <Image
                src={img.src}
                alt={img.alt || "Partner logo"}
                width={200}
                height={80}
                style={{ width: "auto", height: "auto", maxWidth: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
