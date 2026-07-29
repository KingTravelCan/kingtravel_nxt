"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getNavItems } from "@/actions/pageActions";

export default function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    getNavItems().then((items) => {
      if (items && Array.isArray(items) && items.length > 0) {
        setNavItems(items);
      }
    });
  }, []);

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
              {navItems.map((item) => {
                const itemHref = item.url || item.href || '#';
                const itemLabel = item.label || item.title;
                const hasChildren = item.children && item.children.length > 0;
                const isParentActive = pathname === itemHref || (hasChildren && item.children.some((sub: any) => pathname === (sub.url || sub.href)));

                if (!hasChildren) {
                  const isActive = pathname === itemHref;
                  return (
                    <Link
                      key={item.id || itemHref}
                      href={itemHref}
                      onClick={() => setMenuActive(false)}
                      className={isActive ? "text-gold font-bold" : ""}
                      style={isActive ? { color: "var(--gold, #DB9E30)" } : undefined}
                    >
                      {itemLabel}
                    </Link>
                  );
                }

                const mobKey = itemLabel;
                return (
                  <div
                    key={item.id || itemHref}
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
                        href={itemHref}
                        onClick={() => setMenuActive(false)}
                        className={isParentActive ? "text-gold font-bold" : ""}
                        style={{ color: isParentActive ? "var(--gold, #DB9E30)" : "inherit", textDecoration: "none" }}
                      >
                        {itemLabel}
                      </Link>
                      <i className="nav-arrow">▼</i>
                    </span>

                    <div className="dropdown-menu">
                      {item.children.map((sub: any) => {
                        const subHref = sub.url || sub.href || '#';
                        const isSubActive = pathname === subHref;
                        return (
                          <Link
                            key={sub.id || subHref}
                            href={subHref}
                            className={isSubActive ? "text-gold font-bold" : ""}
                            style={isSubActive ? { color: "var(--gold, #DB9E30)" } : undefined}
                            onClick={() => {
                              setMenuActive(false);
                              setOpenDropdown(null);
                            }}
                          >
                            {sub.label || sub.title}
                          </Link>
                        );
                      })}
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
