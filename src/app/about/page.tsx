"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import { getPageBySlug } from "@/actions/pageActions";

export default function AboutPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [counts, setCounts] = useState({
    travelers: 0,
    rating: 0.0,
    satisfaction: 0,
    experience: 0,
  });

  useEffect(() => {
    getPageBySlug('/about').then(p => {
      if (p) setPageData(p);
    });

    let start: number | null = null;
    const duration = 1500;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeProgress = progress * (2 - progress);

      setCounts({
        travelers: Math.floor(easeProgress * 72),
        rating: parseFloat((easeProgress * 4.4).toFixed(1)),
        satisfaction: Math.floor(easeProgress * 100),
        experience: Math.floor(easeProgress * 25),
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCounts({
          travelers: 72,
          rating: 4.4,
          satisfaction: 100,
          experience: 25,
        });
      }
    };

    requestAnimationFrame(step);
  }, []);

  return (
    <main>
      {/* ================= DYNAMIC HERO BANNER ================= */}
      <PageBanner
        title={pageData?.bannerTitle || pageData?.title || "Your Trusted Partner for <span>Pilgrimage & Global Travel</span>"}
        description={pageData?.bannerDescription || "Over 25 years of unmatched expertise coordinating safe, seamless, and deeply spiritual journeys across the globe."}
        bgImage={pageData?.bannerBgImage}
        position={pageData?.bannerPosition}
        size={pageData?.bannerSize}
      />

      <div className="wrap reveal">
        <div className="stats-bar" style={{ gridTemplateColumns: "repeat(4,1fr)", background: "#fff", boxShadow: "0 4px 30px -10px rgba(19,39,35,.15)" }}>
          <div className="stat-item">
            <h3>{counts.travelers}K+</h3>
            <p>Happy Travelers</p>
          </div>
          <div className="stat-item">
            <h3>{counts.rating.toFixed(1)}</h3>
            <p>Google Rating</p>
          </div>
          <div className="stat-item">
            <h3>{counts.satisfaction}%</h3>
            <p>Client Satisfaction</p>
          </div>
          <div className="stat-item">
            <h3>{counts.experience}+</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </div>

      <div className="wrap">
        <section className="about-section reveal">
          <div className="grid-2">
            <div className="about-image">
              <Image
                src="https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80"
                alt="Mecca Clock Tower"
                width={800}
                height={450}
                unoptimized
              />
            </div>
            <div className="about-content">
              <span className="section-tag">Why Choose Us</span>
              <h2 className="section-title">Common Travel Needs We Securely Solve</h2>
              <p>
                Serving Ontario travelers for decades, King Travel Can Ltd is certified by IATA, ACTA, TICO, ATAC, and the Saudi Ministry of Hajj &amp; Umrah. We arrange hassle-free, fully coordinated spiritual and global travel packages tailored specifically to your needs.
              </p>
              <ul className="features-list">
                <li>Fast Saudi Visas</li>
                <li>5-Star Accommodations</li>
                <li>Coordinated Family Packages</li>
                <li>Expert Group Guides</li>
                <li>Last-minute Flight Modifications</li>
                <li>Peak Season Bookings</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <section className="services-section">
        <div className="wrap">
          <div className="section-header reveal">
            <span className="section-tag">What We Provide</span>
            <h2 className="section-title">Our Premium Travel Services</h2>
          </div>
          <div className="grid-4 reveal">
            <div className="service-card">
              <span className="service-icon">✈️</span>
              <h3>Lowest Fares</h3>
              <p>In partnership with top airlines, we guarantee highly competitive rates on flights to Pakistan, Saudi Arabia, and beyond.</p>
            </div>
            <div className="service-card">
              <span className="service-icon">✨</span>
              <h3>Special Deals</h3>
              <p>Exclusive deals on luxury packages curated to maximize your budget without sacrificing quality and comfort.</p>
            </div>
            <div className="service-card">
              <span className="service-icon">🛡️</span>
              <h3>Trusted &amp; Certified</h3>
              <p>Fully accredited by major international travel associations, offering you total financial and logistical security.</p>
            </div>
            <div className="service-card">
              <span className="service-icon">🕌</span>
              <h3>Pilgrimage Experts</h3>
              <p>Complete end-to-end guidance, 5-star hotel access near the Haram, and reliable local transportation.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
