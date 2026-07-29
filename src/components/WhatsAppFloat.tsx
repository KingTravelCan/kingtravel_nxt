"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function WhatsAppFloat() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href="https://wa.me/19056248344?text=Hi,%20I'm%20interested%20in%20your%20services!"
      className="fixed-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <Image
        src="/img/whatsapp.svg"
        alt="WhatsApp"
        width={60}
        height={60}
        style={{ width: "auto", height: "auto" }}
      />
    </a>
  );
}
