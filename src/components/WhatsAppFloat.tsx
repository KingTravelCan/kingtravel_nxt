"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getSiteIdentity } from "@/actions/pageActions";

const DEFAULT_URL = "https://wa.me/19056248344?text=Hi,%20I'm%20interested%20in%20your%20services!";
const DEFAULT_LABEL = "Chat on WhatsApp";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [href, setHref] = useState(DEFAULT_URL);
  const [label, setLabel] = useState(DEFAULT_LABEL);

  useEffect(() => {
    getSiteIdentity().then((data) => {
      if (data?.whatsappFloatUrl) setHref(data.whatsappFloatUrl);
      if (data?.whatsappFloatLabel) setLabel(data.whatsappFloatLabel);
    });

    // Also respond to live identity updates dispatched from the admin panel
    const onUpdate = () => {
      getSiteIdentity().then((data) => {
        if (data?.whatsappFloatUrl) setHref(data.whatsappFloatUrl);
        if (data?.whatsappFloatLabel) setLabel(data.whatsappFloatLabel);
      });
    };
    window.addEventListener("identity_updated", onUpdate);
    return () => window.removeEventListener("identity_updated", onUpdate);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href={href}
      className="fixed bottom-[30px] right-[30px] z-[100] w-[60px] h-[60px] max-sm:w-[50px] max-sm:h-[50px]"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
    >
      <Image
        src="/img/whatsapp.svg"
        alt={label}
        width={60}
        height={60}
        className="w-auto h-auto"
      />
    </a>
  );
}
