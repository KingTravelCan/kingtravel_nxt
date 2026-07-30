"use client";

import Image from "next/image";

interface MarqueeTrackProps {
  type: "travel" | "airline";
  images: { src: string; alt?: string }[];
  speedMs?: number;
  direction?: "left" | "right";
}

export default function MarqueeTrack({ type, images, speedMs = 35000, direction = "left" }: MarqueeTrackProps) {
  // Duplicate images for infinite scroll loop
  const displayImages = [...images, ...images];
  const animationDuration = `${speedMs / 1000}s`;
  const animationDirection = direction === "right" ? "reverse" : "normal";

  return (
    <div className="marquee-widget">
      <div className="marquee-wrapper">
        <div
          className={`marquee-track ${type}`}
          style={{
            animationDuration,
            animationDirection,
          }}
        >
          {displayImages.map((img, idx) => (
            <div className="marquee-item" key={idx}>
              {img.src.startsWith('data:') ? (
                <img
                  src={img.src}
                  alt={img.alt || "Partner logo"}
                  style={{ width: "auto", height: "auto", maxHeight: "60px", maxWidth: "100%", objectFit: "contain" }}
                />
              ) : (
                <Image
                  src={img.src}
                  alt={img.alt || "Partner logo"}
                  width={200}
                  height={80}
                  style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
