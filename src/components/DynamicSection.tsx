"use client";

import Image from 'next/image';
import Link from 'next/link';
import MarqueeTrack from '@/components/MarqueeTrack';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import DynamicIcon from '@/components/ui/DynamicIcon';

export default function DynamicSection({ sec, idx }: { sec: any; idx: number }) {
  if (!sec || !sec.type) return null;

  // PLACEMENT_1: Who We Are

  // PLACEMENT_2: Exclusive Upcoming Umrah Packages

  // PLACEMENT_3: Select Preferred Travel Service

  // PLACEMENT_4: What We Provide (Numbered Features)

  // PLACEMENT_5: Image+Text

  // PLACEMENT_6: Certifications Flip Cards

  // PLACEMENT_7: Airlines Marquee

  // PLACEMENT_8: Hajj Packages Grid

  // PLACEMENT_9: Latest Blogs Grid

  // PLACEMENT_10: Text Block (Rich Text)

  // PLACEMENT_11: Stats Grid

  // PLACEMENT_12: Intro

  // PLACEMENT_13: Services Grid

  // PLACEMENT_14: Accreditations Bar

  // PLACEMENT_15: Umrah Packages Grid

  // PLACEMENT_16: Hajj Packages (from page.tsx)

  // PLACEMENT_17: Sold Out Packages

  // PLACEMENT_18: Visa Solutions

  // PLACEMENT_19: Testimonials

  // Default fallback
  return (
    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
      {sec.title && <h2 className="text-2xl font-bold text-slate-800 mb-4">{sec.title}</h2>}
      {sec.data?.description && <p className="text-slate-600 leading-relaxed">{sec.data.description}</p>}
    </div>
  );
}
