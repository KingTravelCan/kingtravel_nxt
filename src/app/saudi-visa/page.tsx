import Link from "next/link";
import Image from "next/image";

export default function SaudiVisaPage() {
  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="hero saudi">
        <div className="container">
          <h1>
            Apply for a <span>Saudi Visa</span> from Canada with<br />
            Trusted <span>Expert Support</span>
          </h1>
          <p>
            Apply for a Saudi visa from Canada with trusted support from King Travel. We help individuals and families understand the process for tourist, Umrah, family visit, business, work, and Saudi resident Iqama visas, with clear guidance on requirements, documents, and application steps.
          </p>
        </div>
      </section>

      {/* ================= SAUDI VISA SOLUTIONS ================= */}
      <section id="saudi-visa">
        <div className="wrap">
          <div className="section-head center reveal">
            <div>
              <div className="eyebrow">Explore Our</div>
              <h2>Saudi Visa Solutions</h2>
            </div>
          </div>
          <div className="visa-grid reveal">
            {/* Card 1 */}
            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-1.webp" alt="Tourist Visa" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Tourist Visa</h3>
                <p className="card-description">Only passport required. Explore the beauty and culture of Saudi Arabia effortlessly.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-2.webp" alt="Umrah Visa" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Umrah Visa</h3>
                <p className="card-description">Requires passport and PR Card or other proof of residence. Start your spiritual journey with official Umrah visa services.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-3.jpg" alt="Family Visit Visa" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Family Visit Visa</h3>
                <p className="card-description">Complete list of requirements sent via email. Reunite with your loved ones quickly and securely.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-4.webp" alt="Resident Iqama" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Resident Iqama Visa</h3>
                <p className="card-description">Get all the requirements sent to your inbox. Simplify your residency process with expert guidance.</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-5.webp" alt="Business Visit Visa" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Business Visit Visa</h3>
                <p className="card-description">We'll email the full details you need. Expand your business horizons with an authorized visa service.</p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/saudi-visa-6.jpg" alt="Work Visa Assistance" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Work Visa</h3>
                <p className="card-description">Contact us for detailed requirements via email. Begin your career in Saudi Arabia with professional assistance.</p>
              </div>
            </div>

            {/* Card 7 */}
            <div className="visa-card">
              <div className="card-image-wrapper">
                <Image src="/img/riyadh.jpg" alt="Personal Visit Visa" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Personal Visit Visa</h3>
                <p className="card-description">Get in touch with us today to get the detailed requirements and fast-track your Saudi personal visit visa with our professional guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STEP PROCESS SECTION ================= */}
      <section className="visa-section reveal">
        <div className="container visa-grid-bottom">
          {/* Left Side: Info & Contact */}
          <div className="visa-info-pane">
            <span className="visa-tagline">In 3 Easy Steps</span>
            <h2 className="visa-main-heading">Get Your Saudi Visa</h2>
            <p className="visa-description">
              Our Saudi visa services cover everything from application to approval, including tourist visas, Umrah visas, and visit visas. With expert guidance and fast processing, we make getting your Saudi Arabia visa simple and stress-free.
            </p>

            <div className="visa-contact-details">
              <div className="contact-item">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:saudivisa@kingtravel.com">saudivisa@kingtravel.com</a>
              </div>
              <div className="contact-item">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+19056248344">+1 905-624-8344</a>
              </div>
            </div>

            <Link href="/contact" className="visa-btn-cta">
              Start Your Visa Application Today
            </Link>
          </div>

          {/* Right Side: Interactive Step Cards */}
          <div className="visa-steps-pane">
            {/* Step 1 */}
            <div className="visa-step-card">
              <div className="step-badge">1</div>
              <div className="step-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="step-card-text">
                <h3>Apply &amp; Share Your Details</h3>
                <p>Fill out our quick application form and share your travel details. Our team will review your requirements and guide you on the best Saudi visa option for your needs.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="visa-step-card">
              <div className="step-badge">2</div>
              <div className="step-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="step-card-text">
                <h3>Submit Required Documents</h3>
                <p>Provide the necessary documents such as your passport and photos. We'll verify everything and ensure your application meets all Saudi visa requirements.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="visa-step-card">
              <div className="step-badge">3</div>
              <div className="step-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="step-card-text">
                <h3>Sit Back &amp; Get Your Visa</h3>
                <p>We handle the complete visa processing on your behalf. Once approved, your Saudi visa will be delivered to you quickly and securely.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
