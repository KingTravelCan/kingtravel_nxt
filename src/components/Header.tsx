"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "LICENSES", href: "/about#licenses" },
    ],
  },
  { label: "Umrah Packages", href: "/umrah/packages" },
  { label: "Hajj Packages", href: "/hajj/packages" },
  { label: "Saudi Visa", href: "/saudi-visa" },
  { label: "Flights", href: "/airlines" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname === "/letstravel") {
    return null;
  }

  return (
    <header>
        <div className="nav-shell">
          <div className="nav">
            {/* Logo */}
            <div className="logo">
              <Link href="/" onClick={() => setMenuActive(false)}>
                <Image
                  src="/img/logo.png"
                  alt="King Travel Logo"
                  width={250}
                  height={60}
                  priority
                  style={{ width: "auto", height: "auto" }}
                />
              </Link>
            </div>

            {/* Desktop + Mobile Nav */}
            <nav className={`navlinks ${menuActive ? "active" : ""}`} id="navLinks">
              {NAV.map((item) => {
                if (!item.children) {
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMenuActive(false)}>
                      {item.label}
                    </Link>
                  );
                }

                const mobKey = item.label;
                return (
                  <div
                    key={item.href}
                    className={`dropdown-parent${openDropdown === mobKey ? " mob-open" : ""}`}
                  >
                    <span
                      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          setOpenDropdown(openDropdown === mobKey ? null : mobKey);
                        }
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          if (window.innerWidth < 1024) e.preventDefault();
                          else setMenuActive(false);
                        }}
                        style={{ pointerEvents: "auto" }}
                      >
                        {item.label}
                      </Link>
                      <span className="nav-arrow">▼</span>
                    </span>
                    <div className="dropdown-menu">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => {
                            setMenuActive(false);
                            setOpenDropdown(null);
                          }}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Right: WhatsApp chip + hamburger */}
            <div className="nav-right">
              <div className="contact-chip">
                <div className="wa-ico">
                  <Image
                    src="/img/whatsapp.svg"
                    alt="WhatsApp"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="txt">
                  <div className="l">Book Hajj &amp; Umrah</div>
                  <a
                    href="https://wa.me/19056248344?text=Hi,%20I'm%20interested%20in%20your%20services!"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +1 905-624-8344
                  </a>
                </div>
              </div>

              <button
                className="menu-toggle"
                id="menuToggle"
                aria-label="Toggle menu"
                onClick={() => {
                  setMenuActive(!menuActive);
                  setOpenDropdown(null);
                }}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </header>
  );
}
