import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FloatingShareBar from "@/components/FloatingShareBar";
import RevealOnScroll from "@/components/RevealOnScroll";
import FrontendMaintenanceWrapper from "@/components/FrontendMaintenanceWrapper";
import DisclaimerPopupModal from "@/components/DisclaimerPopupModal";
import FaviconSync from "@/components/FaviconSync";
import Script from "next/script";
import {
  getSiteIdentity,
  getLoginAuthSettings,
  getNavItems,
  getFooterData,
  getSeoIntelligenceSettings,
} from "@/actions/pageActions";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const [identity, seoSettings] = await Promise.all([
    getSiteIdentity(),
    getSeoIntelligenceSettings(),
  ]);
  const faviconUrl = identity?.favicon || "/img/favicon.png";
  const isIndexingEnabled = seoSettings?.siteIndexingEnabled ?? true;

  return {
    title: identity?.siteName || "King Travel Canada",
    description: identity?.tagline || "Licensed Hajj & Umrah pilgrimage operator in Canada offering 5-star packages, visa consultation, and direct flights.",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    robots: !isIndexingEnabled ? { index: false, follow: false } : undefined,
    verification: seoSettings?.googleSearchConsoleCode ? {
      google: seoSettings.googleSearchConsoleCode,
    } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [identity, loginAuth, navItems, footerData, seoSettings] = await Promise.all([
    getSiteIdentity(),
    getLoginAuthSettings(),
    getNavItems(),
    getFooterData(),
    getSeoIntelligenceSettings(),
  ]);
  const faviconUrl = identity?.favicon || "/img/favicon.ico";
  const initialMaintenanceMode = loginAuth?.maintenanceMode ?? false;

  const isIndexingEnabled = seoSettings?.siteIndexingEnabled ?? true;
  const gscCode = (seoSettings?.googleSearchConsoleCode || "").trim();
  const gaId = (seoSettings?.googleAnalyticsId || "").trim();
  const isGaActive = (seoSettings?.googleAnalyticsEnabled ?? true) && gaId.length > 0;

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />

        {/* Global Robots Indexing Directive if disabled */}
        {!isIndexingEnabled && (
          <meta name="robots" content="noindex, nofollow" />
        )}

        {/* Google Search Console HTML Verification */}
        {gscCode && (
          <meta name="google-site-verification" content={gscCode} />
        )}

        {/* Google Analytics 4 (GA4) Tracking Script */}
        {isGaActive && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>

      <body suppressHydrationWarning>
        <FaviconSync faviconUrl={faviconUrl} />
        <FrontendMaintenanceWrapper initialMaintenanceMode={initialMaintenanceMode}>
          <Header initialNavItems={navItems} initialIdentity={identity} />
          {children}
          <Footer initialFooterData={footerData} />
          <WhatsAppFloat initialIdentity={identity} />
          <FloatingShareBar />
          <RevealOnScroll />
          <DisclaimerPopupModal />
        </FrontendMaintenanceWrapper>
      </body>
    </html>
  );
}
