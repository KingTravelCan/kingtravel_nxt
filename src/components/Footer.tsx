"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname === "/letstravel") {
    return null;
  }

  return (
    <footer id="footer-place">
      <div className="wrap">
        <div className="foot-grid">

          {/* ── Column 1: Brand + tagline + social + trust badges ── */}
          <div>
            <div className="foot-brand">
              <Link href="/">
                <Image
                  src="/img/logo-footer.png"
                  alt="King Travel Logo"
                  width={210}
                  height={50}
                  style={{ width: 210, height: "auto" }}
                />
              </Link>
            </div>
            <p style={{ maxWidth: "310px", fontWeight: 300, lineHeight: 1.7 }}>
              A licensed Canadian agency dedicated to Hajj &amp; Umrah travel —
              trusted, certified, and built for pilgrims.
            </p>

            <div className="foot-social">
              <b>Follow Us:</b>
              <ul className="social-links">
                <li>
                  <a href="https://www.facebook.com/kingtravelcan" target="_blank" rel="noopener noreferrer">
                    <Image src="/img/fb.svg" alt="Facebook" width={32} height={32} />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/kingtravelcan/" target="_blank" rel="noopener noreferrer">
                    <Image src="/img/insta.svg" alt="Instagram" width={32} height={32} />
                  </a>
                </li>
                <li>
                  <a href="https://ca.linkedin.com/company/kingtravelcan" target="_blank" rel="noopener noreferrer">
                    <Image src="/img/in.svg" alt="LinkedIn" width={32} height={32} />
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@kingtravelcan" target="_blank" rel="noopener noreferrer">
                    <Image src="/img/tik.svg" alt="TikTok" width={32} height={32} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Trust badges — class "trusted" matches CSS in globals.css */}
            <div className="trusted">
              <Image src="/img/acta.svg" alt="ACTA" width={48} height={48} style={{ width: "auto", height: "auto" }} />
              <Image src="/img/atac.svg" alt="ATAC" width={48} height={48} style={{ width: "auto", height: "auto" }} />
              <Image src="/img/tico.svg" alt="TICO" width={48} height={48} style={{ width: "auto", height: "auto" }} />
              <Image src="/img/iata.svg" alt="IATA" width={48} height={48} style={{ width: "auto", height: "auto" }} />
              <Image src="/img/asta.svg" alt="ASTA" width={48} height={48} style={{ width: "auto", height: "auto" }} />
            </div>
          </div>

          {/* ── Column 2: Services ── */}
          <div>
            <h5>Services</h5>
            <ul>
              <li><Link href="/umrah/packages">Umrah Packages</Link></li>
              <li><Link href="/hajj/packages">Hajj Packages</Link></li>
              <li><Link href="/airlines">Airline Tickets</Link></li>
              <li><Link href="/saudi-visa">Saudi Visa Services</Link></li>
            </ul>
          </div>

          {/* ── Column 3: Sitemap ── */}
          <div>
            <h5>Sitemap</h5>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/umrah/packages">Packages</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="#">Terms of Use</Link></li>
            </ul>
          </div>

          {/* ── Column 4: Customer Support ── */}
          <div>
            <h5>Customer Support</h5>
            <ul>
              <li>24/7 customer support</li>
              <li><a href="tel:+18008445464">+1 800-844-5464</a></li>
              <li><a href="tel:+19056248555">+1 905-624-8555</a></li>
              <li><a href="tel:+19056248344">+1 905-624-8344</a></li>
              <li><a href="mailto:info@kingtravelcan.com">info@kingtravelcan.com</a></li>
              <li>Mon–Sat, 9am – 7pm EST</li>
            </ul>
          </div>

        </div>

        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} King Travel Can LTD. All Rights Reserved.</span>
          <span>Design &amp; Developed by <a href="https://www.dks.com.pk" target="_blank" rel="noopener noreferrer">DKS</a></span>
        </div>
      </div>
    </footer>
  );
}
