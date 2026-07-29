import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import RevealOnScroll from "@/components/RevealOnScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "King Travel — Hajj & Umrah, Guided With Care",
  description:
    "King Travel plans Hajj and Umrah journeys from Canada down to the smallest detail — flights, five-star stays walking distance from the Haram, visas, and guides.",
  icons: {
    icon: "https://kingtravelcan.com/wp-content/uploads/2026/05/cropped-King-TRavel-Favicon-1-1-270x270.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
        <Header />
        {children}
        <Footer />
        <WhatsAppFloat />
        <RevealOnScroll />
      </body>
    </html>
  );
}
