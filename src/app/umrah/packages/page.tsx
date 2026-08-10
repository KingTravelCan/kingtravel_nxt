import { getPageBySlug } from "@/actions/pageActions";
import UmrahPackagesPageClient from "./UmrahPackagesPageClient";

export default async function UmrahPackagesPage() {
  const pageData = await getPageBySlug("/umrah-packages");
  return <UmrahPackagesPageClient initialPageData={pageData} />;
}
