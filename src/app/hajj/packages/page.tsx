import { getPageBySlug } from "@/actions/pageActions";
import HajjPackagesPageClient from "./HajjPackagesPageClient";

export default async function HajjPackagesPage() {
  const pageData = await getPageBySlug("/hajj-packages");
  return <HajjPackagesPageClient initialPageData={pageData} />;
}
