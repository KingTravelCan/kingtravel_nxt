import { getPageBySlug } from "@/actions/pageActions";
import HajjPackagesPageClient from "./HajjPackagesPageClient";

export default async function HajjPackagesPage() {
  const pageData = await getPageBySlug("/hajj-packages").catch(() => null);

  return <HajjPackagesPageClient initialPageData={pageData} />;
}
