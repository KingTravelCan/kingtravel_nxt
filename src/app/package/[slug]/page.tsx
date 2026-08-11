import { getPackageDetailsAction, getPageSeoAction } from "@/actions/pageActions";
import PackageDetailPageClient from "./PackageDetailPageClient";

export default async function StandalonePackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialPackage = await getPackageDetailsAction(slug).catch(() => null);
  const initialSeo = initialPackage?.id 
    ? await getPageSeoAction(`pkg_${initialPackage.id}`).catch(() => null)
    : null;

  return (
    <PackageDetailPageClient 
      initialSlug={slug} 
      initialPackage={initialPackage} 
      initialSeo={initialSeo} 
    />
  );
}
