import { getPackageDetailsAction, getPageSeoAction } from "@/actions/pageActions";
import PackageDetailPageClient from "./PackageDetailPageClient";

export default async function StandalonePackageDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
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
