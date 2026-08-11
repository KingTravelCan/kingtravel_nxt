"use client";

import { useEffect, useState } from "react";
import PageBanner from "@/components/PageBanner";
import { getPageBySlug, getFormsSettings } from "@/actions/pageActions";
import { submitContactEnquiryAction } from "@/actions/enquiryActions";
import SubmissionSuccessModal from "@/components/SubmissionSuccessModal";
import PageSectionsRenderer from "@/components/PageSectionsRenderer";

export default function ContactPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    getPageBySlug('/contact').then(p => {
      if (p) {
        setPageData(p);
        if (p.sections) {
          try {
            const parsed = JSON.parse(p.sections);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSections(parsed);
            }
          } catch (e) {
            console.error("Error parsing contact page sections:", e);
          }
        }
      }
    });
  }, []);
  return (
    <main className="bg-[#f2f5f3] min-h-screen">
      {/* ================= DYNAMIC HERO BANNER ================= */}
      <PageBanner
        title={pageData?.bannerTitle || pageData?.title || "We'd <span>Love</span> To Hear From You"}
        description={pageData?.bannerDescription || "Have a question or want to work together? Choose the most convenient way to reach us."}
        bgImage={pageData?.bannerBgImage}
        position={pageData?.bannerPosition}
        size={pageData?.bannerSize}
      />

      <PageSectionsRenderer sections={sections} pageData={pageData} />
    </main>
  );
}
