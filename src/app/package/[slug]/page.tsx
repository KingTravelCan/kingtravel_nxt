import { getPackageDetailsAction, getPageSeoAction } from "@/actions/pageActions";
import PackageDetailPageClient from "./PackageDetailPageClient";

export default async function StandalonePackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageDetailsAction(slug);
  const seoKey = `pkg_${pkg?.id || slug}`;
  const seo = await getPageSeoAction(seoKey);

  return (
    <PackageDetailPageClient
      initialSlug={slug}
      initialPackage={pkg}
      initialSeo={seo}
    />
  );
}
