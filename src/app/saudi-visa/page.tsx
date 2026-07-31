"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import { getPageBySlug } from "@/actions/pageActions";

const defaultVisaSolutions = [
  { title: "Tourist Visa", description: "Only passport required. Explore the beauty and culture of Saudi Arabia effortlessly.", image: "/img/saudi-visa-1.webp" },
  { title: "Umrah Visa", description: "Requires passport and PR Card or other proof of residence. Start your spiritual journey with official Umrah visa services.", image: "/img/saudi-visa-2.webp" },
  { title: "Family Visit Visa", description: "Complete list of requirements sent via email. Reunite with your loved ones quickly and securely.", image: "/img/saudi-visa-3.jpg" },
  { title: "Resident Iqama Visa", description: "Get all the requirements sent to your inbox. Simplify your residency process with expert guidance.", image: "/img/saudi-visa-4.webp" },
  { title: "Business Visit Visa", description: "We'll email the full details you need. Expand your business horizons with an authorized visa service.", image: "/img/saudi-visa-5.webp" },
  { title: "Work Visa", description: "Contact us for detailed requirements via email. Begin your career in Saudi Arabia with professional assistance.", image: "/img/saudi-visa-6.jpg" },
  { title: "Personal Visit Visa", description: "Get in touch with us today to get the detailed requirements and fast-track your Saudi personal visit visa with our professional guidance.", image: "/img/riyadh.jpg" },
];

function VisaSolutionsSection({ data }: { data?: any }) {
  const items = (data?.items && Array.isArray(data.items) && data.items.length > 0)
    ? data.items
    : defaultVisaSolutions;

  return (
    <section id="saudi-visa" className="py-12">
      <div className="wrap max-w-7xl mx-auto px-4">
        <div className="section-head center text-center mb-10">
          <div className="eyebrow uppercase text-xs font-bold tracking-widest text-[#DB9E30] mb-1">
            {data?.eyebrow || "EXPLORE OUR"}
          </div>
          <h2 className="text-3xl font-serif text-[#004B39]">
            {data?.title || "Saudi Visa Solutions"}
          </h2>
        </div>
        <div className="visa-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((card: any, cIdx: number) => (
            <div key={cIdx} className="visa-card bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col group transition-all duration-300 hover:shadow-2xl">
              <div className="card-image-wrapper relative h-52 overflow-hidden">
                <Image
                  src={card.image || "/img/saudi-visa-1.webp"}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <div className="card-content p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="card-title text-xl font-bold text-[#004B39] mb-2">{card.title}</h3>
                  <p className="card-description text-xs text-slate-600 leading-relaxed font-normal">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisaProcessStepsSection({ data }: { data?: any }) {
  return (
    <section className="visa-section py-12 bg-emerald-950 text-white">
      <div className="container max-w-7xl mx-auto px-4 visa-grid-bottom grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="visa-info-pane space-y-6">
          <span className="visa-tagline text-xs font-extrabold uppercase tracking-widest text-[#DB9E30]">
            {data?.eyebrow || "IN 3 EASY STEPS"}
          </span>
          <h2 className="text-3xl font-serif text-white">
            {data?.title || "Get Your Saudi Visa"}
          </h2>
          <p className="visa-description text-sm opacity-90 leading-relaxed font-light">
            Our Saudi visa services cover everything from application to approval, including tourist visas, Umrah visas, and visit visas. With expert guidance and fast processing, we make getting your Saudi Arabia visa simple and stress-free.
          </p>

          <div className="visa-contact-details space-y-3">
            <div className="contact-item flex items-center gap-3 text-sm">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#DB9E30" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href={`mailto:${data?.email || "saudivisa@kingtravel.com"}`} className="hover:underline text-slate-200">
                {data?.email || "saudivisa@kingtravel.com"}
              </a>
            </div>
            <div className="contact-item flex items-center gap-3 text-sm">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#DB9E30" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href={`tel:${(data?.phone || "+19056248344").replace(/\s+/g, '')}`} className="hover:underline text-slate-200">
                {data?.phone || "+1 905-624-8344"}
              </a>
            </div>
          </div>

          <Link href="/contact" className="inline-block bg-[#DB9E30] hover:bg-[#b88222] text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all text-sm mt-4">
            Start Your Visa Application Today
          </Link>
        </div>

        <div className="visa-steps-pane space-y-4">
          {((data?.steps && Array.isArray(data.steps) && data.steps.length > 0) ? data.steps : [
            { number: 1, title: "Apply & Share Your Details", description: "Fill out our quick application form and share your travel details. Our team will review your requirements and guide you on the best Saudi visa option for your needs." },
            { number: 2, title: "Submit Required Documents", description: "Provide the necessary documents such as your passport and photos. We'll verify everything and ensure your application meets all Saudi visa requirements." },
            { number: 3, title: "Sit Back & Get Your Visa", description: "We handle the complete visa processing on your behalf. Once approved, your Saudi visa will be delivered to you quickly and securely." }
          ]).map((st: any, sIdx: number) => (
            <div key={sIdx} className="visa-step-card p-5 rounded-2xl bg-white shadow-md border border-slate-100 flex gap-4 items-start">
              <div className="step-badge w-8 h-8 rounded-full bg-[#DB9E30] text-slate-950 font-extrabold flex items-center justify-center shrink-0 text-sm">
                {st.number || sIdx + 1}
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-slate-900 mb-1">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{st.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SaudiVisaPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    getPageBySlug("/saudi-visa").then((p) => {
      if (p) {
        setPageData(p);
        if (p.sections) {
          try {
            const parsed = JSON.parse(p.sections);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSections(parsed);
            }
          } catch (e) {
            console.error("Error parsing page sections:", e);
          }
        }
      }
    });
  }, []);

  return (
    <main>
      {/* ================= DYNAMIC HERO BANNER ================= */}
      <PageBanner
        title={
          pageData?.bannerTitle ||
          pageData?.title ||
          "Apply for a Saudi Visa from Canada <br /><span>with Trusted Expert Support</span>"
        }
        description={
          pageData?.bannerDescription ||
          "Apply for a Saudi visa from Canada with trusted support from King Travel. We help individuals and families understand the process for tourist, Umrah, family visit, business, work, and Saudi resident Iqama visas, with clear guidance on requirements, documents, and application steps."
        }
        bgImage={pageData?.bannerBgImage}
        position={pageData?.bannerPosition}
        size={pageData?.bannerSize}
      />

      {/* ================= DYNAMIC OR FALLBACK SECTIONS ================= */}
      {(() => {
        const hasVisaSolutions = sections.some((s: any) => s.type === "Visa Solutions Grid" || s.type === "Visa Cards");
        const hasVisaSteps = sections.some((s: any) => s.type === "Visa Process Steps" || s.type === "3 Easy Steps");

        return (
          <>
            {hasVisaSolutions ? (
              sections
                .filter((s: any) => s.type === "Visa Solutions Grid" || s.type === "Visa Cards")
                .map((sec: any, idx: number) => <VisaSolutionsSection key={idx} data={sec.data} />)
            ) : (
              <VisaSolutionsSection />
            )}

            {hasVisaSteps ? (
              sections
                .filter((s: any) => s.type === "Visa Process Steps" || s.type === "3 Easy Steps")
                .map((sec: any, idx: number) => <VisaProcessStepsSection key={idx} data={sec.data} />)
            ) : (
              <VisaProcessStepsSection />
            )}
          </>
        );
      })()}
    </main>
  );
}
