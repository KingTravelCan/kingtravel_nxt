"use client";

import { useState, useEffect } from "react";
import PageSectionsRenderer from "@/components/PageSectionsRenderer";
import { getPageBySlug } from "@/actions/pageActions";
import PageSeoHead from "@/components/PageSeoHead";

export default function Home() {
  const [homeSeo, setHomeSeo] = useState<any>(null);
  const [dynamicSections, setDynamicSections] = useState<any[]>([]);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    getPageBySlug("/").then((p) => {
      if (p) {
        setPageData(p);
        if (p.seoData) setHomeSeo(p.seoData);
        if (p.sections) {
          try {
            const parsed = typeof p.sections === 'string' ? JSON.parse(p.sections) : p.sections;
            if (Array.isArray(parsed) && parsed.length > 0) {
              setDynamicSections(parsed);
            }
          } catch { }
        }
      }
    });
  }, []);

  return (
    <main>
      <PageSeoHead pageTitle="Home" seoData={homeSeo} />
      {/* ================= DYNAMIC SECTIONS ================= */}
      <PageSectionsRenderer sections={dynamicSections} pageData={pageData} />
    </main>
  );
}
