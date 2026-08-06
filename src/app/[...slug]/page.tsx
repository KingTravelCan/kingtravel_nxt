"use client";

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPageBySlug } from '@/actions/pageActions';
import PageBanner from '@/components/PageBanner';
import MarqueeTrack from '@/components/MarqueeTrack';
import PackageDetailModal, { PackageDetailData } from "@/components/PackageDetailModal";
import PageSeoHead from "@/components/PageSeoHead";
import PageSectionsRenderer from "@/components/PageSectionsRenderer";

export default function DynamicPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slugPath = '/' + (Array.isArray(rawSlug) ? rawSlug.join('/') : (rawSlug || ''));

  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDetailPkg, setSelectedDetailPkg] = useState<PackageDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPageBySlug(slugPath);
        if (!data || data.status === 'draft') {
          setPage(null);
        } else {
          setPage(data);
        }
      } catch {
        setPage(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slugPath]);

  if (loading) {
    return (
      <main className="bg-[#f2f5f3] min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-[#004B39] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-extrabold text-[#004B39] uppercase tracking-widest">Loading Page Content...</p>
      </main>
    );
  }
  if (!page) notFound();

  let sections: any[] = [];
  if (page.sections) {
    try {
      sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
    } catch (e) {
      sections = [];
    }
  }

  return (
    <main className="bg-[#f2f5f3] min-h-screen pb-16">
      <PageSeoHead pageTitle={page.title} seoData={page.seoData} />
      <PackageDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        pkg={selectedDetailPkg}
      />
      {/* Dynamic Hero Banner */}
      <PageBanner
        title={page.bannerTitle || page.title}
        description={page.bannerDescription || ''}
        bgImage={page.bannerBgImage || undefined}
        position={page.bannerPosition || undefined}
        size={page.bannerSize || undefined}
      />

      {/* Dynamic Page Content / Sections */}
      {sections.length > 0 ? (
        <div className="w-full mx-auto pb-12">
          <PageSectionsRenderer sections={sections} />
        </div>
      ) : page.richText ? (
        <div className="w-full max-w-4xl mx-auto px-4 py-12 prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: page.richText }} />
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-700">{page.title}</h2>
          <p className="text-green mt-2">Content coming soon.</p>
        </div>
      )}
    </main>
  );
}
