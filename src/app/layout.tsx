import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FloatingShareBar from "@/components/FloatingShareBar";
import RevealOnScroll from "@/components/RevealOnScroll";
import FrontendMaintenanceWrapper from "@/components/FrontendMaintenanceWrapper";
import DisclaimerPopupModal from "@/components/DisclaimerPopupModal";
import FaviconSync from "@/components/FaviconSync";
import { getSiteIdentity, getLoginAuthSettings, getNavItems, getFooterData } from "@/actions/pageActions";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getSiteIdentity();
  const faviconUrl = identity?.favicon || "/img/favicon.png";
  return {
    title: identity?.siteName || "King Travel Canada",
    description: identity?.tagline || "Licensed Hajj & Umrah pilgrimage operator in Canada offering 5-star packages, visa consultation, and direct flights.",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [identity, loginAuth, navItems, footerData] = await Promise.all([
    getSiteIdentity(),
    getLoginAuthSettings(),
    getNavItems(),
    getFooterData(),
  ]);
  const faviconUrl = identity?.favicon || "/img/favicon.ico";
  const initialMaintenanceMode = loginAuth?.maintenanceMode ?? false;

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
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
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
