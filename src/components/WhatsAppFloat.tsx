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
      className="fixed bottom-[30px] right-[30px] z-[100] w-[60px] h-[60px] max-sm:w-[50px] max-sm:h-[50px]"
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
