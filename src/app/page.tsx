"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MarqueeTrack from "@/components/MarqueeTrack";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const partnerLogos = [
  { src: "/img/t-3.png", alt: "Trust Partner 3" },
  { src: "/img/t-2.png", alt: "Trust Partner 2" },
  { src: "/img/t-1.png", alt: "Trust Partner 1" },
  { src: "/img/t-4.png", alt: "Trust Partner 4" },
  { src: "/img/t-5.png", alt: "Trust Partner 5" },
  { src: "/img/t-6.png", alt: "Trust Partner 6" },
];

const airlineLogos = [
  { src: "/img/a-1.png", alt: "Airline 1" },
  { src: "/img/a-2.png", alt: "Airline 2" },
  { src: "/img/a-3.png", alt: "Airline 3" },
  { src: "/img/a-4.png", alt: "Airline 4" },
  { src: "/img/a-5.png", alt: "Airline 5" },
  { src: "/img/a-6.png", alt: "Airline 6" },
  { src: "/img/a-7.png", alt: "Airline 7" },
  { src: "/img/a-8.png", alt: "Airline 8" },
  { src: "/img/a-9.png", alt: "Airline 9" },
];

export default function Home() {
  const [quoteForm, setQuoteForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    packageType: "Select your package",
    departureDate: "",
    adults: 1,
  });
  const [quoteStatus, setQuoteStatus] = useState<string | null>(null);

  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    packageType: "Select Package",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteStatus("Submitting...");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteForm),
      });
      const data = await res.json();
      if (res.ok) {
        setQuoteStatus("Thank you! Your quote request has been received.");
        setQuoteForm({
          fullName: "",
          phone: "",
          email: "",
          packageType: "Select your package",
          departureDate: "",
          adults: 1,
        });
      } else {
        setQuoteStatus(data.error || "Submission failed.");
      }
    } catch {
      setQuoteStatus("Failed to submit request.");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("Sending...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (res.ok) {
        setContactStatus("Thank you! Your message has been sent.");
        setContactForm({
          fullName: "",
          email: "",
          phone: "",
          packageType: "Select Package",
          message: "",
        });
      } else {
        setContactStatus(data.error || "Submission failed.");
      }
    } catch {
      setContactStatus("Failed to send message.");
    }
  };

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-media">
            <div className="hero-pattern"></div>
            <div className="hero-content">
              <div className="eyebrow">Est. in Canada · Licensed Pilgrimage Operator</div>
              <h1>
                Your journey to<br />
                <em>Makkah &amp; Madinah</em>,<br />
                guided with care.
              </h1>
              <p className="lead">
                King Travel plans Hajj and Umrah journeys from Canada down to the smallest detail — flights,
                five‑star stays walking distance from the Haram, visas, and guides who've made this journey themselves.
              </p>
              <div className="hero-cta">
                <a className="btn" href="#packages">
                  View Umrah Packages{" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                <Link className="btn ghost-light" href="/contact">
                  Speak With an Advisor
                </Link>
              </div>
            </div>
            <div className="badges">
              <div className="float-badge badge-1">
                <div className="ico">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2 L14 9 L21 9 L15 13.5 L17 21 L12 16.5 L7 21 L9 13.5 L3 9 L10 9 Z"></path>
                  </svg>
                </div>
                <div>
                  <div className="n">10,000+</div>
                  <div className="l">Pilgrims Guided</div>
                </div>
              </div>
              <div className="float-badge badge-2">
                <div className="ico">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 21V10l9-6 9 6v11"></path>
                    <path d="M9 21v-7h6v7"></path>
                  </svg>
                </div>
                <div>
                  <div className="n">5★ Hotels</div>
                  <div className="l">Every Package, Every Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap">
          <form className="search-card reveal" onSubmit={handleQuoteSubmit}>
            <h3>Get a free Quote</h3>
            {quoteStatus && <p className="text-center text-emerald-700 font-semibold mb-4">{quoteStatus}</p>}
            <div className="search-row">
              <div className="field">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={quoteForm.fullName}
                  onChange={(e) => setQuoteForm({ ...quoteForm, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (___) ___-____"
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="search-row">
              <div className="field">
                <label>Select Your Package</label>
                <select
                  value={quoteForm.packageType}
                  onChange={(e) => setQuoteForm({ ...quoteForm, packageType: e.target.value })}
                >
                  <option>Select your package</option>
                  <option>Umrah Package</option>
                  <option>Hajj Package</option>
                  <option>Flight Only</option>
                </select>
              </div>
              <div className="field">
                <label>Departure Date</label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={quoteForm.departureDate}
                  onChange={(e) => setQuoteForm({ ...quoteForm, departureDate: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Number of Adults</label>
                <input
                  type="number"
                  min="1"
                  value={quoteForm.adults}
                  onChange={(e) => setQuoteForm({ ...quoteForm, adults: parseInt(e.target.value, 10) || 1 })}
                />
              </div>
              <div className="submit-cell">
                <button className="btn block" type="submit">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ================= TRUST Travel ================= */}
      <section className="travels-section">
        <div className="wrap section-head center reveal">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Licensed &amp; Accredited</div>
          <h2 style={{ fontSize: "32px" }}>Trusted travel Organization</h2>
        </div>
        <MarqueeTrack type="travel" images={partnerLogos} />
      </section>

      {/* ================= ABOUT ================= */}
      <section className="tint" id="trust">
        <div className="wrap about-split reveal">
          <div className="about-figure">
            <div className="main-img">
              <Image
                src="https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=1000&q=80"
                alt="The Kaaba, Masjid al-Haram, Makkah"
                width={1000}
                height={1000}
                style={{ width: "100%", height: "100%" }}
                unoptimized
              />
            </div>
            <div className="float-card">
              <div className="stars">
                <span className="star"></span>
                <span className="star"></span>
                <span className="star"></span>
                <span className="star"></span>
                <span className="star"></span>
              </div>
              <p>"Every detail handled — from visa to hotel, steps from the Haram."</p>
            </div>
          </div>
          <div className="about-copy">
            <div className="eyebrow">Who We Are</div>
            <h2 style={{ marginTop: "16px", fontSize: "clamp(28px,3.2vw,38px)" }}>
              We provide and offer<br />Hajj &amp; Umrah packages
            </h2>
            <p>
              King Travel proudly provides reliable and professional Hajj and Umrah services across Canada. With years of
              experience serving the Muslim community, we are committed to making your sacred journey smooth, comfortable,
              and spiritually fulfilling.
            </p>
            <p>
              Whether you are traveling for Hajj, Umrah, or Saudi Visa services, our expert team is here to guide you every
              step of the way.
            </p>
            <div className="stat-cards">
              <div className="stat-box">
                <div className="n">25+</div>
                <div className="l">Years Serving Canada</div>
              </div>
              <div className="stat-box">
                <div className="n">10,000+</div>
                <div className="l">Pilgrims Guided</div>
              </div>
              <div className="stat-box">
                <div className="n">5★</div>
                <div className="l">Hotels, Every Package</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= UMRAH PACKAGES ================= */}
      <section id="packages">
        <div className="wrap">
          <div className="section-head split reveal">
            <div>
              <div className="eyebrow">Exclusive Upcoming</div>
              <h2>Umrah Packages<br />from Canada</h2>
            </div>
            <p style={{ maxWidth: "480px" }}>
              Departures from CAD 2,595 per person. Availability and accommodations are confirmed
              with every booking — contact us before reserving.
            </p>
          </div>

          <div className="pkg-scroller reveal">
            {/* Umrah Card 1 */}
            <div className="pkg-card">
              <div className="pkg-media">
                <Image
                  src="https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80"
                  alt="Makkah"
                  width={700}
                  height={200}
                  style={{ width: "100%", height: "100%" }}
                  unoptimized
                />
                <span className="tag">5 Star</span>
              </div>
              <div className="pkg-top">
                <div className="pkg-month">August · 2026</div>
                <div className="pkg-title">5 Star Umrah Package</div>
                <div className="pkg-price">CAD 2,895<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                    Imam Lead Guide &amp; Seminar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah
                  </li>
                </ul>
                <div className="pkg-cta-full"><Link className="btn block" href="/contact">Book Now</Link></div>
              </div>
            </div>

            {/* Umrah Card 2 */}
            <div className="pkg-card active">
              <div className="pkg-media">
                <Image
                  src="https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=700&q=80"
                  alt="Madinah"
                  width={700}
                  height={200}
                  style={{ width: "100%", height: "100%" }}
                  unoptimized
                />
                <span className="tag">5 Star</span>
              </div>
              <div className="pkg-top">
                <div className="pkg-month">SEPTEMBER · 2026</div>
                <div className="pkg-title">5 Star Umrah Package</div>
                <div className="pkg-price">CAD 2,695<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                    Imam Lead Guide &amp; Seminar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah
                  </li>
                </ul>
                <div className="pkg-cta-full"><Link className="btn block" href="/contact">Book Now</Link></div>
              </div>
            </div>

            {/* Umrah Card 3 */}
            <div className="pkg-card">
              <div className="pkg-media">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ-woBtLbE_PWTBqCZ0brMsNEO9cHm5Ty6OCvR5RFNo7W0KUJju1hOyP_q_rbDHPmxNebevMC34dQLhx3Nnq8ge9vhJPkyWcKA0dcuuO0l8xYQslkwffXg3ykAx1dNenk6erSOcJyc_AlaXq2EF76R51_YvEogiCpJVurSD9X-yPiEZG18m2eOeHrqQXpqPZY9-JbONVyqZgYzy6E8X45y96-V4nKAP3WoezDdYk-kFBIOCDuJWAbN"
                  alt="Masjid Nabawi green dome"
                  width={700}
                  height={200}
                  style={{ width: "100%", height: "100%" }}
                  unoptimized
                />
                <span className="tag">5 Star</span>
              </div>
              <div className="pkg-top">
                <div className="pkg-month">OCTOBER · 2026</div>
                <div className="pkg-title">5 Star Umrah Package</div>
                <div className="pkg-price">CAD 2,795<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                    Imam Lead Guide &amp; Seminar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah
                  </li>
                </ul>
                <div className="pkg-cta-full"><Link className="btn block" href="/contact">Book Now</Link></div>
              </div>
            </div>

            {/* Umrah Card 4 */}
            <div className="pkg-card active">
              <div className="pkg-media">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ-woBtLbE_PWTBqCZ0brMsNEO9cHm5Ty6OCvR5RFNo7W0KUJju1hOyP_q_rbDHPmxNebevMC34dQLhx3Nnq8ge9vhJPkyWcKA0dcuuO0l8xYQslkwffXg3ykAx1dNenk6erSOcJyc_AlaXq2EF76R51_YvEogiCpJVurSD9X-yPiEZG18m2eOeHrqQXpqPZY9-JbONVyqZgYzy6E8X45y96-V4nKAP3WoezDdYk-kFBIOCDuJWAbN"
                  alt="Masjid Nabawi green dome"
                  width={700}
                  height={200}
                  style={{ width: "100%", height: "100%" }}
                  unoptimized
                />
                <span className="tag">5 Star</span>
              </div>
              <div className="pkg-top">
                <div className="pkg-month">NOVEMBER · 2026</div>
                <div className="pkg-title">5 Star Umrah Package</div>
                <div className="pkg-price">CAD 2,795<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                    Imam Lead Guide &amp; Seminar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah
                  </li>
                </ul>
                <div className="pkg-cta-full"><Link className="btn block" href="/contact">Book Now</Link></div>
              </div>
            </div>
          </div>

          <div className="more-wrap reveal">
            <Link className="btn outline" style={{ borderColor: "var(--ink)" }} href="/contact">
              See All Packages{" "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="tint">
        <div className="wrap">
          <div className="section-head center reveal">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Services We Offer</div>
            <h2>Select your preferred travel service</h2>
          </div>
          <div className="svc-grid reveal">
            <a className="svc-tile" href="#packages">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2 L14 9 L21 9 L15 13.5 L17 21 L12 16.5 L7 21 L9 13.5 L3 9 L10 9 Z" />
                </svg>
              </div>
              <h4>Umrah Packages</h4>
              <p>Flexible departures with flights, stays &amp; guidance included.</p>
            </a>
            <Link className="svc-tile" href="/hajj-packages">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <rect x="7" y="9" width="10" height="12" />
                  <circle cx="12" cy="6" r="3" />
                </svg>
              </div>
              <h4>Hajj Packages</h4>
              <p>Fully accredited pilgrimage packages, curated end to end.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M3 12h18M3 12l6-6M3 12l6 6M21 12l-6-6M21 12l-6 6" />
                </svg>
              </div>
              <h4>Airline Tickets</h4>
              <p>Best-fare flights sourced from every route into Jeddah.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="1" />
                  <path d="M4 10h16M9 4v6" />
                </svg>
              </div>
              <h4>Saudi Visa Services</h4>
              <p>Full visa processing, handled and confirmed before departure.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M3 21V10l9-6 9 6v11" />
                  <path d="M9 21v-7h6v7" />
                </svg>
              </div>
              <h4>Hotel Booking</h4>
              <p>5-star stays within walking distance of the Haram.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9Z" />
                </svg>
              </div>
              <h4>Global Flight Reservations</h4>
              <p>Worldwide reliable flight bookings for any itinerary.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                  <path d="M9 12h6M9 16h6" />
                </svg>
              </div>
              <h4>Travel Documentation</h4>
              <p>Guidance on every document your journey requires.</p>
            </Link>
            <Link className="svc-tile" href="/contact">
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <h4>Group &amp; Private Tours</h4>
              <p>Private, guided, and fully customizable itineraries.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHAT WE PROVIDE ================= */}
      <section>
        <div className="wrap provide-split reveal">
          <div className="provide-img">
            <Image
              src="https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=900&q=80"
              alt="Masjid al-Haram at night"
              width={900}
              height={900}
              style={{ width: "100%", height: "100%" }}
              unoptimized
            />
          </div>
          <div>
            <div className="eyebrow">What We Provide</div>
            <h2 style={{ marginTop: "16px", fontSize: "clamp(28px,3.2vw,38px)" }}>
              Lowest fares, exclusive<br />travel deals, real trust
            </h2>
            <div className="provide-list" style={{ marginTop: "26px" }}>
              <div className="item">
                <div className="num">01</div>
                <div>
                  <h4>Lowest Fares</h4>
                  <p>We offer the lowest rates on the market, sourced across every route into Jeddah.</p>
                </div>
              </div>
              <div className="item">
                <div className="num">02</div>
                <div>
                  <h4>Special Deals</h4>
                  <p>Fixed-price Umrah packages with hotels, meals and transport included.</p>
                </div>
              </div>
              <div className="item">
                <div className="num">03</div>
                <div>
                  <h4>Trusted &amp; Certified</h4>
                  <p>A fully accredited travel agency you can rely on, licensed across Canada.</p>
                </div>
              </div>
              <div className="item">
                <div className="num">04</div>
                <div>
                  <h4>Pilgrimage Services</h4>
                  <p>Visa processing, group support — the full spiritual journey, arranged.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN PACKAGES GRID ================= */}
      <section>
        <div className="wrap">
          <div className="section-head split reveal">
            <div>
              <div className="eyebrow">Luxury Hajj Packages</div>
              <h2>Hajj Packages 2027</h2>
            </div>
            <p style={{ maxWidth: "480px" }}>
              Luxury Hajj 2027 Packages with 5-Star Hotels, VIP Services &amp; Complete Spiritual Guidance.
            </p>
          </div>
          <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80"
                  alt="Makkah & Madinah"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={700}
                  height={256}
                  style={{ width: "100%", height: "100%" }}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                  <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027
                  </span>
                  <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-calendar"></i> 14 Days
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1">
                    <i className="fa-solid fa-plane text-xs"></i>From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Economy Hajj Package 2027</h2>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/865309229.jpg?k=13b36d624d683462058664c3aa31641cbb4c53cf07ca581f02f127e198029575&o="
                        alt="Makkah Hotel"
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel in Makkah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <i className="fa-solid fa-location-dot text-emerald-700"></i> Near to Haram
                      </p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">6 Nights</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/523311776.jpg?k=2d6dfd51cd0bb767e33d6cc5dc4d3f8d76da0c17140158b7b43366dc7cf66a36&o="
                        alt="Madinah Hotel"
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel in Madinah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <i className="fa-solid fa-location-dot text-amber-600"></i> Near to Masjid Nabawi
                      </p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">6 Nights</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Operator</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">King Travel</span>
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded">4.4/5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">From CAD / Quad Occupancy</span>
                      <span className="text-2xl font-extrabold text-brand-800">12,995</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/economy-hajj-2027" className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                      <i className="fa-solid fa-passport"></i> Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 2 */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=900&q=80"
                  alt="Makkah Clock Tower"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={900}
                  height={256}
                  style={{ width: "100%", height: "100%" }}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                  <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027
                  </span>
                  <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-calendar"></i> 17 Days
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1">
                    <i className="fa-solid fa-plane text-xs"></i> From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Deluxe Hajj 2027</h2>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="/img/fairmount.jpg" alt="Makkah Fairmont" className="w-full h-full object-cover" width={64} height={64} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel Fairmont Makkah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-emerald-700"></i> Near to Haram</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Buffet Included</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">8 Nights</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="/img/dar-al-eman.jpg" alt="Madinah Oberoi" className="w-full h-full object-cover" width={64} height={64} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">5 Star Hotel Dar Al Eman Madinah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-amber-600"></i> Near to Masjid Nabawi</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Buffet Included</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">7 Nights</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Operator</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">King Travel</span>
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded">4.4/5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">From CAD / Quad Occupancy</span>
                      <span className="text-2xl font-extrabold text-brand-800">17,995</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/deluxe-hajj-2027" className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                      <i className="fa-solid fa-passport"></i> Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 3 */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80"
                  alt="Hajj Tent City"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={800}
                  height={256}
                  style={{ width: "100%", height: "100%" }}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                  <span className="bg-brand-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-kaaba text-brand-gold"></i> HAJJ 2027
                  </span>
                  <span className="bg-[var(--gold)] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-calendar"></i> 10 Days
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 mb-1">
                    <i className="fa-solid fa-plane text-xs"></i> From Canada <i className="fa-solid fa-arrow-right text-[10px]"></i> To Saudia
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Express Custom Hajj 2027</h2>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-2">Accommodations</h3>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=300&q=80" alt="Makkah Hyatt" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">Hyatt Regency Makkah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-emerald-700"></i> Jabal Omar (Short Walk)</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">5 Nights</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3 rounded-2xl bg-amber-50/30 border border-amber-100/40">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMH3qB9RTiBkL_HJ1Ud2v3EUkitmSkKqpCuxjwQcnJNlt6DQcGjUrYoo&s=10" alt="Madinah Pullman" className="w-full h-full object-cover" width={64} height={64} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">Pullman Zamzam Madinah</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><i className="fa-solid fa-location-dot text-amber-600"></i> Walking Distance</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md"><i className="fa-solid fa-utensils text-[8px]"></i> Breakfast</span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">5 Nights</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Operator</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">King Travel</span>
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded">4.4/5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">From CAD / Quad Occupancy</span>
                      <span className="text-2xl font-extrabold text-brand-800">14,995</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/contact" className="bg-[var(--gold)] hover:bg-[var(--gold-lt)] text-white font-bold text-xs py-4 rounded-xl transition duration-200 flex items-center justify-center gap-1 shadow-md shadow-amber-600/10 hover:no-underline">
                      <i className="fa-solid fa-passport"></i> Book Hajj 2027
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= HAJJ PACKAGES (SOLD OUT) ================= */}
      <section id="hajj" className="tint">
        <div className="wrap">
          <div className="section-head split reveal">
            <div>
              <div className="eyebrow">Luxury Hajj Packages</div>
              <h2>Packages Officially<br />Sold Out</h2>
            </div>
            <p style={{ maxWidth: "480px" }}>
              We sincerely thank everyone for the incredible trust and response. Our Hajj 2026
              packages are now fully sold out. May Allah (SWT) grant all pilgrims a safe and accepted Hajj. For Hajj 2027
              inquiries or to join the priority list, please get in touch with our team.
            </p>
          </div>
          <div className="pkg-scroller three reveal">
            {/* Sold Out 1 */}
            <div className="pkg-card sold">
              <div className="soldout"><span className="tag sold">Sold Out</span></div>
              <div className="pkg-media">
                <Image src="https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80" alt="Makkah, Hajj" width={700} height={200} style={{ width: "100%", height: "100%" }} unoptimized />
              </div>
              <div className="pkg-top">
                <div className="pkg-month">May · 2026</div>
                <div className="pkg-title">Hajj Package</div>
                <div className="pkg-price">$18,995<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance</li>
                  <li><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>Imam Lead Guide &amp; Seminar</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah</li>
                </ul>
              </div>
            </div>

            {/* Sold Out 2 */}
            <div className="pkg-card sold">
              <div className="soldout"><span className="tag sold">Sold Out</span></div>
              <div className="pkg-media">
                <Image src="https://images.unsplash.com/photo-1513072064285-240f87fa81e8?auto=format&fit=crop&w=700&q=80" alt="Masjid al-Haram, Hajj" width={700} height={200} style={{ width: "100%", height: "100%" }} unoptimized />
              </div>
              <div className="pkg-top">
                <div className="pkg-month">May · 2026</div>
                <div className="pkg-title">Hajj Package</div>
                <div className="pkg-price">$21,995<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance</li>
                  <li><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>Imam Lead Guide &amp; Seminar</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah</li>
                </ul>
              </div>
            </div>

            {/* Sold Out 3 */}
            <div className="pkg-card sold">
              <div className="soldout"><span className="tag sold">Sold Out</span></div>
              <div className="pkg-media">
                <Image src="https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=700&q=80" alt="Madinah, Hajj" width={700} height={200} style={{ width: "100%", height: "100%" }} unoptimized />
              </div>
              <div className="pkg-top">
                <div className="pkg-month">May · 2026</div>
                <div className="pkg-title">Hajj Package</div>
                <div className="pkg-price">$16,995<span>/ Person</span></div>
              </div>
              <div className="pkg-body">
                <div className="incl-label">Package Includes</div>
                <ul className="space-y-4 text-on-surface-variant mb-8">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span> Return Flights from Toronto</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">directions_bus</span> Luxury Ground Transportation</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apparel</span> Free Ihram Kit</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">description</span> Registration &amp; Visa Assistance</li>
                  <li><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>Imam Lead Guide &amp; Seminar</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-xl">apartment</span> 5 Star Hotels Makkah &amp; Madinah</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SAUDI VISA GRID ================= */}
      <section id="saudi-visa">
        <div className="wrap">
          <div className="section-head center reveal">
            <div>
              <div className="eyebrow">Explore Our</div>
              <h2>Saudi Visa Solutions</h2>
            </div>
          </div>
          <div className="visa-grid">
            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-1.webp" alt="Tourist Visa" width={400} height={200} style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Tourist Visa</h3>
                <p className="card-description">Only passport required. Explore the beauty and culture of Saudi Arabia effortlessly.</p>
              </div>
            </div>

            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-2.webp" alt="Umrah Visa" width={400} height={200} style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Umrah Visa</h3>
                <p className="card-description">Requires passport and PR Card or other proof of residence. Start your spiritual journey with official Umrah visa services.</p>
              </div>
            </div>

            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-3.jpg" alt="Family Visit Visa" width={400} height={200} style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Family Visit Visa</h3>
                <p className="card-description">Complete list of requirements sent via email. Reunite with your loved ones quickly and securely.</p>
              </div>
            </div>

            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-4.webp" alt="Resident Iqama" width={400} height={200} style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Resident Iqama Visa</h3>
                <p className="card-description">Get all the requirements sent to your inbox. Simplify your residency process with expert guidance.</p>
              </div>
            </div>

            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-5.webp" alt="Business Visit Visa" width={400} height={200} style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Business Visit Visa</h3>
                <p className="card-description">We'll email the full details you need. Expand your business horizons with an authorized visa service.</p>
              </div>
            </div>

            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-6.jpg" alt="Work Visa Assistance" width={400} height={200} style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Work Visa</h3>
                <p className="card-description">Contact us for detailed requirements via email. Begin your career in Saudi Arabia with professional assistance.</p>
              </div>
            </div>

            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/riyadh.jpg" alt="Personal Visit Visa" width={400} height={200} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Personal Visit Visa</h3>
                <p className="card-description">Get in touch with us today to get the detailed requirements and fast-track your Saudi personal visit visa with our professional guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="section-dark">
        <div className="wrap">
          <div className="section-head center reveal">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Happy Pilgrims</div>
            <h2>What our clients say</h2>
          </div>
          <div className="reviews-outer mb-8">
            <div className="reviews-owner-details">
              <Image src="/img/round-logo.png" className="reviews-owner-img" alt="King Travel logo" width={64} height={64} />
              <div className="reviews-owner">
                <b>King Travel Can Ltd - Mississauga</b>
                <div className="stars">
                  <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </div>
                <span className="review-count">927 Google reviews</span>
                <button className="btn outline">Write a review</button>
              </div>
            </div>
          </div>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* ================= AIRLINES ================= */}
      <section id="flights">
        <div className="wrap">
          <div className="section-head center reveal" style={{ marginBottom: "40px" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Our Trusted Partners</div>
            <h2>Airlines we work with</h2>
          </div>
        </div>
        <MarqueeTrack type="airline" images={airlineLogos} />
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="tint-gray">
        <div className="wrap">
          <div className="contact-grid reveal">
            <div className="contact-info">
              <div className="eyebrow">Get In Touch</div>
              <h3 style={{ marginTop: "16px" }}>We're here to help</h3>
              <div className="contacts-num">
                <div className="row">
                  <b>Landlines:</b>
                  <a href="tel:+18008445464">+1 800-844-5464</a>
                  <a href="tel:+19056248555">+1 905-624-8555</a>
                  <a href="tel:+19056248344">+1 905-624-8344</a>
                </div>
                <div className="row">
                  <b>Whatsapp:</b>
                  <div>
                    <a
                      href="https://wa.me/19056248344?text=Hi!%20I%E2%80%99d%20like%20to%20reserve%20a%20package.%20Could%20you%20please%20help%20me%20with%20the%20reservation%20process%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +1 905-624-8344
                    </a>{" "}
                    - <span>Reservation</span>
                  </div>
                  <div>
                    <a
                      href="https://wa.me/16479828555?text=Hi%20King%20Travel!%20I'm%20interested%20in%20applying%20for%20a%20Saudi%20Visa.%20Could%20you%20please%20provide%20me%20with%20more%20details%20on%20the%20requirements%20and%20process%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +1 647-982-8555
                    </a>{" "}
                    - <span>Saudi Visa</span>
                  </div>
                </div>
              </div>

              <div className="row">
                <b>Email</b>
                <a href="mailto:info@kingtravelcan.com">info@kingtravelcan.com</a>
              </div>
              <div className="row">
                <b>Office Hours</b>Mon–Sat, 9am – 7pm EST
              </div>
              <div className="row">
                <b>Head Office</b>
                <a href="https://maps.app.goo.gl/1BRUoBxtt4wWw58t6" target="_blank" rel="noopener noreferrer">
                  1325 Eglinton Ave E Ste 218, <br />
                  Mississauga, ON L4W 4L9, Canada
                </a>
              </div>
              <div className="row">
                <b>Branch Office</b>
                <a href="https://maps.app.goo.gl/U6B4fci2Jas4sh6S6" target="_blank" rel="noopener noreferrer">
                  22 Ontario St S, <br />
                  Milton, ON L9T 2M6, Canada
                </a>
              </div>
            </div>
            <form className="contact-form-card" onSubmit={handleContactSubmit}>
              {contactStatus && <p className="text-emerald-700 font-semibold mb-4">{contactStatus}</p>}
              <div className="two-col">
                <div className="field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={contactForm.fullName}
                    onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="two-col">
                <div className="field">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Select Package</label>
                  <select
                    value={contactForm.packageType}
                    onChange={(e) => setContactForm({ ...contactForm, packageType: e.target.value })}
                  >
                    <option>Select Package</option>
                    <option>Umrah Package</option>
                    <option>Hajj Package</option>
                    <option>Saudi Visa</option>
                  </select>
                </div>
              </div>
              <div className="field" style={{ marginBottom: "20px" }}>
                <label>Message</label>
                <textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                ></textarea>
              </div>
              <button className="btn dark block" type="submit">
                Send Enquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
