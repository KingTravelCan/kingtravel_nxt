'use client';

import { useEffect } from 'react';

interface PageSeoHeadProps {
  pageTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  jsonLdPayload?: string;
  noIndex?: boolean;
  seoData?: any;
}

export default function PageSeoHead({
  pageTitle,
  metaTitle,
  metaDescription,
  canonicalUrl,
  ogImageUrl,
  jsonLdPayload,
  noIndex,
  seoData,
}: PageSeoHeadProps) {
  // Extract values from seoData if provided, otherwise fallback
  const finalMetaTitle =
    metaTitle ||
    seoData?.metaTitle ||
    (pageTitle
      ? `${pageTitle} | King Travel Canada — Hajj & Umrah, Guided With Care`
      : 'King Travel Canada — Hajj & Umrah, Guided With Care');

  const finalMetaDescription =
    metaDescription ||
    seoData?.metaDescription ||
    'King Travel plans Hajj and Umrah journeys from Canada down to the smallest detail — flights, 5-star hotel bookings walking distance from the Haram, visas, and dedicated guides.';

  const finalCanonicalUrl =
    canonicalUrl || seoData?.canonicalUrl || 'https://kingtravelcan.com';

  const finalOgImageUrl =
    ogImageUrl ||
    seoData?.ogImageUrl ||
    'https://media.kingtravelcan.com/uploads/branding/logo.png';

  const finalJsonLdPayload = jsonLdPayload || seoData?.jsonLdPayload;
  const finalNoIndex = noIndex ?? seoData?.noIndex ?? false;

  // Set document.title on client mount & whenever metaTitle changes
  useEffect(() => {
    if (finalMetaTitle) {
      document.title = finalMetaTitle;
    }
  }, [finalMetaTitle]);

  return (
    <>
      <title>{finalMetaTitle}</title>
      <meta name="description" content={finalMetaDescription} />
      {finalCanonicalUrl && <link rel="canonical" href={finalCanonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={finalMetaTitle} />
      <meta property="og:description" content={finalMetaDescription} />
      <meta property="og:image" content={finalOgImageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonicalUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalMetaTitle} />
      <meta name="twitter:description" content={finalMetaDescription} />
      <meta name="twitter:image" content={finalOgImageUrl} />

      {/* Indexing Robots */}
      {finalNoIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* JSON-LD Knowledge Graph Schema */}
      {finalJsonLdPayload && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: finalJsonLdPayload }}
        />
      )}
    </>
  );
}
