import { getPageBySlug } from "@/actions/pageActions";
import SaudiVisaPageClient from "./SaudiVisaPageClient";

export default async function SaudiVisaPage() {
  const pageData = await getPageBySlug("/saudi-visa");
  return <SaudiVisaPageClient initialPageData={pageData} />;
}
