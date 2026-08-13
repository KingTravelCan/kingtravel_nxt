"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Calendar, User, Check, Star, MapPin, Utensils, Plane, TicketPercent, AlertCircle, ChevronDown, ChevronUp, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getPackageDetailsAction, getPageSeoAction } from "@/actions/pageActions";
import { submitPackageBookingEnquiryAction } from "@/actions/enquiryActions";
import PageSeoHead from "@/components/PageSeoHead";
import SubmissionSuccessModal from "@/components/SubmissionSuccessModal";

const DEFAULT_HAJJ_UMRAH_PACKAGES = [
  {
    id: "economy-hajj-2027",
    title: "Economy Hajj Package 2027",
    badgeTag: "HAJJ 2027",
    duration: "14Days",
    durationText: "14 DAYS / 13 NIGHTS",
    departure: "CANADA",
    destination: "SAUDIA",
    price: "12,995",
    currencyCode: "CAD",
    priceSubtext: "PER PERSON, QUAD OCCUPANCY",
    heroImage:
      "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg",
    makkahHotel: {
      name: "5 Star Hotel in Makkah",
      location: "Near to Haram",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg",
      badge: "Breakfast",
      nights: "6 Nights",
    },
    madinahHotel: {
      name: "5 Star Hotel in Madinah",
      location: "Near to Masjid Nabawi",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg",
      badge: "Breakfast",
      nights: "6 Nights",
    },
  },
  {
    id: "deluxe-hajj-2027",
    title: "Deluxe Hajj 2027",
    badgeTag: "HAJJ 2027",
    duration: "15 Days",
    durationText: "15 DAYS / 14 NIGHTS",
    departure: "CANADA",
    destination: "SAUDIA",
    price: "17,995",
    currencyCode: "CAD",
    priceSubtext: "PER PERSON, QUAD OCCUPANCY",
    heroImage:
      "uploads\sections\hajj_1.jpg",
    makkahHotel: {
      name: "5 Star Hotel Fairmont Makkah",
      location: "Near to Haram",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5-XnMVZK4gPR2fok2UHalB4MgmobfdO0bUKh_VXGHMGYe_A7NQaaZ748&s=10",
      badge: "Buffet Included",
      nights: "8 Nights",
    },
    madinahHotel: {
      name: "5 Star Hotel Dar Al Eman Madinah",
      location: "Near to Masjid Nabawi",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80",
      badge: "Buffet Included",
      nights: "7 Nights",
    },
  },
  {
    id: "customize-umrah-package-2026",
    title: "Customize Umrah Package 2026",
    badgeTag: "UMRAH 2026",
    duration: "10, 15 Days",
    durationText: "15 DAYS / 14 NIGHTS",
    departure: "CANADA",
    destination: "SAUDIA",
    price: "7,499",
    currencyCode: "CAD",
    priceSubtext: "PER PERSON, QUAD OCCUPANCY",
    heroImage:
      "https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg",
    makkahHotel: {
      name: "5 Star Hotel in Makkah",
      location: "Near to Haram",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg",
      badge: "Breakfast",
      nights: "6 Nights",
    },
    madinahHotel: {
      name: "5 Star Hotel in Madinah",
      location: "Near to Masjid Nabawi",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg",
      badge: "Breakfast",
      nights: "6 Nights",
    },
  },
];

function resolvePackage(rawSlug: string, foundPkg: any) {
  if (foundPkg) return foundPkg;

  const cleanSlug = rawSlug.toLowerCase();
  const exactMatch = DEFAULT_HAJJ_UMRAH_PACKAGES.find(
    (p) =>
      p.id.toLowerCase() === cleanSlug ||
      p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanSlug ||
      cleanSlug.includes(p.id.toLowerCase())
  );

  if (exactMatch) return exactMatch;

  const isHajj = cleanSlug.includes("hajj");
  const isDeluxe = cleanSlug.includes("deluxe");
  const readableTitle = rawSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: rawSlug,
    title: readableTitle || (isHajj ? "Hajj Package 2027" : "Umrah Package 2026"),
    badgeTag: isHajj ? "HAJJ 2027" : "UMRAH 2026",
    duration: isHajj ? "15 Days" : "14 Days",
    durationText: isHajj ? "15 DAYS / 14 NIGHTS" : "14 DAYS / 13 NIGHTS",
    departure: "CANADA",
    destination: "SAUDIA",
    price: isDeluxe ? "17,995" : isHajj ? "12,995" : "7,499",
    currencyCode: "CAD",
    priceSubtext: "PER PERSON, QUAD OCCUPANCY",
    makkahHotel: isDeluxe
      ? {
        name: "5 Star Fairmont Makkah",
        location: "Near to Haram",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5-XnMVZK4gPR2fok2UHalB4MgmobfdO0bUKh_VXGHMGYe_A7NQaaZ748&s=10",
        badge: "Breakfast & Dinner Inc.",
        nights: "8 Nights Stay",
      }
      : {
        name: "5 Star Hotel in Makkah",
        location: "Near to Haram",
        image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg",
        badge: "Breakfast",
        nights: "6 Nights Stay",
      },
    madinahHotel: isDeluxe
      ? {
        name: "5 Star Dar Al Eman Madinah",
        location: "Near to Masjid Nabawi",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80",
        badge: "Breakfast & Dinner Inc.",
        nights: "7 Nights Stay",
      }
      : {
        name: "5 Star Hotel in Madinah",
        location: "Near to Masjid Nabawi",
        image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg",
        badge: "Breakfast",
        nights: "6 Nights Stay",
      },
  };
}

export default function PackageDetailPageClient({
  initialSlug,
  initialPackage,
  initialSeo,
}: {
  initialSlug: string;
  initialPackage?: any;
  initialSeo?: any;
}) {
  const rawSlug = initialSlug;
  const [pkg] = useState<any>(() => resolvePackage(rawSlug, initialPackage));
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+1 ");
  const [email, setEmail] = useState("");
  const [adults, setAdults] = useState("1");
  const [childrenCount, setChildrenCount] = useState("0");
  const [infantsCount, setInfantsCount] = useState("0");
  const [selectedDate, setSelectedDate] = useState("");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const todayDateStr = new Date().toISOString().split("T")[0];
  const pkgSeo = initialSeo || null;

  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalRef, setModalRef] = useState("");
  const [galleryOpenIndex, setGalleryOpenIndex] = useState<number | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};
    if (!fullName.trim()) newErrors.fullName = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setBookingStatus("Submitting booking to database...");
    try {
      const res = await submitPackageBookingEnquiryAction({
        packageId: pkg?.id ? parseInt(pkg.id, 10) || undefined : undefined,
        packageName: pkg?.title || "Umrah Package",
        fullName,
        phone,
        email,
        adults: parseInt(adults, 10),
        children: parseInt(childrenCount, 10),
        infants: parseInt(infantsCount, 10),
        startDate: selectedDate,
        totalPrice: String(pkg?.startingPrice ?? pkg?.price ?? ""),
      });

      if (res.success) {
        const msg = res.message || "Thank you! Your package booking request has been received. Our team will contact you shortly.";
        setModalMsg(msg);
        if (res.bookingNumber) setModalRef(res.bookingNumber);
        setModalOpen(true);
        setBookingStatus(null);
        setFullName("");
        setEmail("");
        setSelectedDate("");
      } else {
        setBookingStatus(res.error || "Submission failed.");
      }
    } catch {
      setBookingStatus("Failed to submit booking.");
    }
  };

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-center items-center p-8 text-center">
        <h2 className="text-2xl font-bold font-serif text-slate-800 mb-2">Package Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested package details could not be loaded.</p>
        <Link href="/" className="bg-[#004B39] text-white px-6 py-3 rounded-xl font-extrabold text-xs">
          ← Back to Homepage
        </Link>
      </div>
    );
  }

  let title = pkg.title || "Economy Hajj Package 2027";
  const hasHajjOrUmrah = /hajj|umrah/i.test(title);
  if (!hasHajjOrUmrah) {
    const bTag = (pkg.badgeTag || "").toUpperCase();
    const slugLower = rawSlug.toLowerCase();
    if (bTag.includes("HAJJ") || slugLower.includes("hajj")) {
      title = /(20\d\d)/.test(title) ? title.replace(/(20\d\d)/, "Hajj $1") : `${title} Hajj`;
    } else if (bTag.includes("UMRAH") || slugLower.includes("umrah")) {
      title = /(20\d\d)/.test(title) ? title.replace(/(20\d\d)/, "Umrah $1") : `${title} Umrah`;
    } else {
      title = `${title} Package`;
    }
  }
  const detailData = pkg.detailPageData || {};

  const durationText = detailData.durationText || pkg.durationText || `${pkg.duration || "14 DAYS"} / 13 NIGHTS`;
  const departure = detailData.departure || pkg.departure || "CANADA";
  const destination = detailData.destination || pkg.destination || "SAUDIA";
  // Database packages store the package price in `startingPrice`.
  // `pkg.price` is kept only as a fallback for older/static package objects.
  const rawPrice = pkg.startingPrice ?? pkg.price ?? "12,995";
  const numericPrice = Number(String(rawPrice).replace(/[^0-9.]/g, ""));
  const price = Number.isFinite(numericPrice)
    ? numericPrice.toLocaleString("en-CA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    : String(rawPrice).replace("CAD", "").replace("$", "").trim();

  const priceSubtext = pkg.priceSubtext || "PER PERSON, QUAD OCCUPANCY";
  const exclusiveBadge = pkg.exclusiveBadge || "EXCLUSIVE PACKAGE";
  const currencyCode = pkg.currency || pkg.currencyCode || "CAD";

  const operatorName = pkg.operatorName || "King Travel";
  const operatorRating = pkg.operatorRating || "4.4/5";
  const operatorReviews = pkg.operatorReviews || "928 verified reviews";

  const makkahImg = detailData.makkahHotel?.image || pkg.makkahHotel?.image || "https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg";
  const makkahName = detailData.makkahHotel?.name || pkg.makkahHotel?.name || "5 Star Luxury Hotel";
  const makkahLoc = detailData.makkahHotel?.location || pkg.makkahHotel?.location || "Walking distance to Al-Haram";
  const makkahBadge = detailData.makkahHotel?.badge || pkg.makkahHotel?.badge || "Breakfast & Dinner Inc.";
  const makkahNights = detailData.makkahHotel?.nights || pkg.makkahHotel?.nights || "6 Nights Stay";

  const madinahImg = detailData.madinahHotel?.image || pkg.madinahHotel?.image || "https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg";
  const madinahName = detailData.madinahHotel?.name || pkg.madinahHotel?.name || "5 Star Luxury Hotel";
  const madinahLoc = detailData.madinahHotel?.location || pkg.madinahHotel?.location || "Near Masjid Al-Nabawi courtyard";
  const madinahBadge = detailData.madinahHotel?.badge || pkg.madinahHotel?.badge || "Breakfast & Dinner Inc.";
  const madinahNights = detailData.madinahHotel?.nights || pkg.madinahHotel?.nights || "6 Nights Stay";

  const overviewArray = detailData.overview?.length > 0 ? detailData.overview : [
    {
      heading: "DURING STAY AT MADINAH - Hotel close to Haram (Breakfast & Dinner)",
      details: [
        "01 Dhul-Hajjah Check in at Madinah hotel and spend time in Prophet's Mosque",
        "02 Dhul-Hajjah Spend time in Haram",
        "03 Dhul-Hajjah Leave for Ziarat in Madinah at 08:00 am",
        "04 Dhul-Hajjah Check out from Madinah and Leave for Makkah Aziziya by air-conditioned coach"
      ]
    },
    {
      heading: "DURING STAY AT AZIZIYA - Hotel (Full Board)",
      details: ["04 - 07 Dhul-Hajjah Stay at Aziziya Accommodation."]
    },
    {
      heading: "DURING STAY AT MINA - Near Jamarat Maktab-A-Category (Full Board)",
      details: ["07 - 12 Dhul-Hajjah Rituals at Mina / Arafat / Muzalfa."]
    },
    {
      heading: "DURING STAY AT AZIZIYA - Hotel - Maktab-A-Category (Full Board)",
      details: [
        "12 to 14 Dhul-Hajjah Stay and preparation for departure.",
        "14 Dhul-Hajjah Check out from Aziziya and leave for Jeddah airport for departure to Toronto."
      ]
    }
  ];

  const highlightsList = detailData.highlights?.length > 0 ? detailData.highlights : [
    "Group Will Be Led By A Qualified Imam",
    "Free Complete Ahram Kit Provided To Pilgrims",
    "Before Departure we offer Seminar with Dinner & Hajj under the Imam Guidance",
    "Flexible Dates are Available",
    "Qurbani Not Included"
  ];

  const eligibilityList = detailData.eligibility?.length > 0 ? detailData.eligibility : [
    "Canadian & U.S. citizens with Pakistan Passports.",
    "Pakistani Passport holders with Canadian PR or American Green Cards.",
    "All Foreign Passport holders with Pakistan Passports.",
    "Side trips to Pakistan or any other destination available with an additional cost."
  ];

  const importantNotice = detailData.importantNotice || "To secure your visa slot, please make sure your Canadian passport is valid for at least 6 months beyond travel dates, and you have completed all mandatory immunizations required by the Saudi Ministry of Hajj.";

  // Gallery is intentionally Umrah-only. Existing Hajj pages are unchanged.
  const rawPackagesGallery = pkg.packagesGallery ?? [];
  const parseRawGallery = (raw: any): any[] => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  };

  const packagesGallery: string[] = parseRawGallery(rawPackagesGallery)
    .flatMap((url: any) => (typeof url === "string" ? url.split(",") : []))
    .map((url) => url.trim())
    .filter(Boolean);

  const showPreviousGalleryImage = () => {
    if (galleryOpenIndex === null || packagesGallery.length === 0) return;
    setGalleryOpenIndex((galleryOpenIndex - 1 + packagesGallery.length) % packagesGallery.length);
  };

  const showNextGalleryImage = () => {
    if (galleryOpenIndex === null || packagesGallery.length === 0) return;
    setGalleryOpenIndex((galleryOpenIndex + 1) % packagesGallery.length);
  };

  const faqs = detailData.faqs?.length > 0 ? detailData.faqs : [
    {
      question: "Can I upgrade to double or triple occupancy?",
      answer: "Yes! Upgrades to Double or Triple occupancy are available upon request. Please select your occupancy preference or contact our support team during booking."
    },
    {
      question: "Are flights included in the CAD package price?",
      answer: "Yes, round-trip flights from Canada to Saudi Arabia are fully included in the package pricing."
    }
  ];

  return (
    <div className="bg-[#faf7f2] min-h-screen text-slate-800">
      <PageSeoHead
        pageTitle={title}
        metaTitle={pkgSeo?.metaTitle || `${title} Canada | King Travel`}
        metaDescription={
          pkgSeo?.metaDescription ||
          `Book official ${title} packages with King Travel Canada. ${durationText}, departure from ${departure}, starting price CAD $${price}. Authorized visa, 5-star hotels & flight options.`
        }
        canonicalUrl={pkgSeo?.canonicalUrl || `/package/${rawSlug}`}
        ogImageUrl={pkgSeo?.ogImageUrl || pkg.heroImage || 'https://media.kingtravelcan.com/uploads/branding/logo.png'}
        jsonLdPayload={
          pkgSeo?.jsonLdPayload ||
          JSON.stringify(
            {
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: title,
              image: pkg.heroImage || 'https://media.kingtravelcan.com/uploads/branding/logo.png',
              description: `Official ${title} travel package provided by King Travel Canada. Includes flights, 5-star accommodations, and verified visa processing.`,
              brand: {
                '@type': 'Brand',
                name: 'King Travel Canada',
              },
              offers: {
                '@type': 'Offer',
                url: `/package/${rawSlug}`,
                priceCurrency: 'CAD',
                price: String(pkg.startingPrice ?? pkg.price ?? price ?? '12995').replace(/,/g, ''),
                priceValidUntil: '2027-12-31',
                availability: 'https://schema.org/InStock',
                seller: {
                  '@type': 'Organization',
                  name: 'King Travel Canada',
                },
              },
            },
            null,
            2
          )
        }
        seoData={pkgSeo}
      />
      {/* ================= FULL-WIDTH HEADER BANNER ================= */}
      <div className="w-full bg-[#004B39] text-white py-10 sm:py-14 shadow-lg border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 relative">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white font-serif mb-2.5 leading-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-200 uppercase mb-5">
              DURATION: {durationText}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-100">
              <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
                <Plane className="w-4 h-4 text-gold" /> DEPARTURE: <strong className="text-white">{departure}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
                <Plane className="w-4 h-4 text-gold" /> DESTINATION: <strong className="text-white">{destination}</strong>
              </span>
            </div>
          </div>

          {/* Price Box Overlay on Right */}
          <div className="mt-8 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 md:right-10 bg-[#00382B]/90 border-2 border-dashed border-gold rounded-2xl p-5 text-center min-w-[220px] backdrop-blur-md shadow-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold block mb-1">
              {exclusiveBadge}
            </span>
            <div className="text-3xl font-black text-white font-serif">
              {currencyCode} {price}
            </div>
            <span className="text-[10px] font-medium text-emerald-200 uppercase tracking-wide block mt-1">
              {priceSubtext}
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT BODY (2-COL GRID) ================= */}
      <div className="max-w-7xl mx-auto pb-16">
        <div className="p-4 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">

          {/* LEFT COLUMN: Accommodations, Overview, Highlights, Eligibility, FAQs */}
          <div className="lg:col-span-8 flex flex-col gap-10">

            {/* 1. Premium Accommodations */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 mb-5 flex items-center gap-2">
                Premium Accommodations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Makkah Hotel Card */}
                <div className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-md flex flex-col">
                  <div className="relative h-48 w-full bg-slate-200">
                    <Image
                      src={makkahImg}
                      alt={makkahName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute top-3 left-3 bg-[#004B39] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Makkah
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base line-clamp-1">{makkahName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#004B39]" />
                        <span>{makkahLoc}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
                      <span className="bg-emerald-50 text-[#004B39] px-2.5 py-1 rounded-lg border border-emerald-200/60 flex items-center gap-1 text-[11px]">
                        <Utensils className="w-3 h-3" /> {makkahBadge}
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[11px]">
                        {makkahNights}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Madinah Hotel Card */}
                <div className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-md flex flex-col">
                  <div className="relative h-48 w-full bg-slate-200">
                    <Image
                      src={madinahImg}
                      alt={madinahName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute top-3 left-3 bg-gold text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Madinah
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base line-clamp-1">{madinahName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gold" />
                        <span>{madinahLoc}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
                      <span className="bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200/60 flex items-center gap-1 text-[11px]">
                        <Utensils className="w-3 h-3" /> {madinahBadge}
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[11px]">
                        {madinahNights}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Package Overview (Timeline) */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 mb-5">
                Package Overview
              </h3>
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
                {overviewArray.map((block: any, bIdx: number) => {
                  const heading = block.heading;
                  const details = block.details || [];

                  return (
                    <div key={bIdx} className="relative pl-6 border-l-2 border-[#004B39] space-y-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#004B39] border-2 border-white" />
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {heading}
                      </h4>
                      {details.length > 0 && (
                        <ul className="space-y-1.5 pt-1">
                          {details.map((d: string, dIdx: number) => (
                            <li key={dIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                              <span className="text-gold font-bold text-xs mt-0.5">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Package Highlights & Eligibility (Side-by-Side Cards) */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 mb-5">
                Highlights & Eligibility
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highlights */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md">
                  <h3 className="text-lg font-bold font-serif text-slate-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-500" /> Package Highlights
                  </h3>
                  <ul className="space-y-3">
                    {highlightsList.map((hl: string, idx: number) => {
                      const isNotIncluded = hl.toLowerCase().includes("not included");
                      return (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          {isNotIncluded ? (
                            <span className="text-red-500 font-bold shrink-0 text-base leading-none">✕</span>
                          ) : (
                            <span className="text-amber-500 font-bold shrink-0 text-base leading-none">✦</span>
                          )}
                          <span className={isNotIncluded ? "text-red-500" : "font-medium"}>
                            {hl}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Eligibility Requirements */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md">
                  <h3 className="text-lg font-bold font-serif text-slate-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" /> Eligibility Requirements
                  </h3>
                  <ul className="space-y-3">
                    {eligibilityList.map((el: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <span className="text-emerald-600 font-bold shrink-0 text-base leading-none">✓</span>
                        <span className="font-medium">{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Package Gallery */}
            {packagesGallery.length > 0 && (
              <div>
                <div className="flex items-end justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-800">
                      Package Gallery
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Click any image to view it in full size.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {packagesGallery.length} {packagesGallery.length === 1 ? "Photo" : "Photos"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {packagesGallery.map((imageUrl, imageIdx) => (
                    <button
                      key={`${imageUrl}-${imageIdx}`}
                      type="button"
                      onClick={() => setGalleryOpenIndex(imageIdx)}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm group cursor-zoom-in"
                      aria-label={`Open gallery image ${imageIdx + 1}`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${title} gallery image ${imageIdx + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Important Booking Notice */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-sm">
              <div className="p-2.5 bg-amber-500/10 rounded-xl shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-700" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-amber-950 text-sm">Important Booking Notice</h4>
                <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                  {importantNotice}
                </p>
              </div>
            </div>

            {/* 6. Frequently Asked Questions (Accordion) */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 mb-5">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {faqs.map((faq: any, idx: number) => {
                  const isOpenItem = openFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIdx(isOpenItem ? null : idx)}
                        className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {faq.question}
                        </span>
                        {isOpenItem ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpenItem && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Operator Badge & Booking Form (Sticky Sidebar) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl space-y-6">

              {/* Operator Badge Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <h4 className="font-bold font-serif text-slate-900 text-lg">{operatorName}</h4>
                  <p className="text-xs text-slate-400 font-medium">{operatorReviews}</p>
                </div>
                <div className="bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <span>{operatorRating}</span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </div>
              </div>

              {/* Booking Input Form */}
              <form onSubmit={handleBookingSubmit} noValidate className="space-y-4">
                {bookingStatus && (
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
                    {bookingStatus}
                  </p>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: false }));
                    }}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none transition-all ${errors.fullName
                      ? "border-red-500 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-500"
                      : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-[#004B39]"
                      }`}
                  />
                  {errors.fullName && (
                    <span className="text-[10px] font-bold text-red-600 mt-1 block">Please fill out this field.</span>
                  )}
                </div>

                {/* Phone Number & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Mobile #"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
                      }}
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none transition-all ${errors.phone
                        ? "border-red-500 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-500"
                        : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-[#004B39]"
                        }`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] font-bold text-red-600 mt-1 block">Please fill out this field.</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: false }));
                      }}
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none transition-all ${errors.email
                        ? "border-red-500 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-500"
                        : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-[#004B39]"
                        }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] font-bold text-red-600 mt-1 block">Please fill out this field.</span>
                    )}
                  </div>
                </div>

                {/* Adults, Children, Infants Dropdowns */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 text-center">
                      Adults
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#004B39] focus:outline-none cursor-pointer text-center"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6+">6+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 text-center">
                      Children
                    </label>
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#004B39] focus:outline-none cursor-pointer text-center"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4+">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 text-center">
                      Infants
                    </label>
                    <select
                      value={infantsCount}
                      onChange={(e) => setInfantsCount(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#004B39] focus:outline-none cursor-pointer text-center"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4+">4+</option>
                    </select>
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Start Date
                  </label>
                  <div className="relative">
                    <div
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all flex items-center justify-between ${errors.selectedDate
                        ? "border-red-500 bg-red-50/50 text-red-900"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                    >
                      <span className={selectedDate ? "text-slate-900" : "text-slate-400"}>
                        {selectedDate
                          ? (() => {
                            const [year, month, day] = selectedDate.split('-');
                            return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
                          })()
                          : "e.g. March 25, 2025"}
                      </span>
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="date"
                      min={todayDateStr}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        if (errors.selectedDate) setErrors((prev) => ({ ...prev, selectedDate: false }));
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.selectedDate && (
                    <span className="text-[10px] font-bold text-red-600 mt-1 block">Please select a valid start date.</span>
                  )}
                </div>

                {/* Total Calculation Display */}
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Estimated Total</span>
                  <span className="text-xl font-black text-slate-900 font-serif">
                    {currencyCode} {price}
                  </span>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-primary text-black hover:text-white font-semibold py-3.5 px-4 rounded-md text-sm transition-all duration-300 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <TicketPercent className="w-4 h-4" />
                  <span>Book {pkg.badgeTag || "Package"}</span>
                </button>

                <p className="text-[10px] text-slate-600 text-center leading-normal pt-1">
                  *Hajj & Umrah Packages are subject to seat availability. Visa processing is included. Comprehensive medical insurance and Ahram Kit provided upon arrival.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {galleryOpenIndex !== null && packagesGallery[galleryOpenIndex] && (
        <div
          className="fixed inset-0 z-[100000] bg-black/90 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Package gallery viewer"
          onClick={() => setGalleryOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setGalleryOpenIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer z-20"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {packagesGallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPreviousGalleryImage();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gold hover:bg-primary text-black hover:text-white flex items-center justify-center cursor-pointer z-20"
              aria-label="Previous gallery image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}

          <div
            className="relative w-full max-w-5xl h-[70vh] sm:h-[82vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={packagesGallery[galleryOpenIndex]}
              alt={`${title} gallery image ${galleryOpenIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>

          {packagesGallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNextGalleryImage();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gold hover:bg-primary text-black hover:text-white flex items-center justify-center cursor-pointer z-20"
              aria-label="Next gallery image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-black text-xs font-bold bg-gold px-3 py-1.5 rounded-full">
            {galleryOpenIndex + 1} / {packagesGallery.length}
          </div>
        </div>
      )}

      <SubmissionSuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMsg}
        referenceNumber={modalRef}
      />
    </div>
  );
}