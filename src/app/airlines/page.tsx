import { getPageBySlug } from "@/actions/pageActions";
import AirlinesPageClient from "./AirlinesPageClient";

export default async function AirlinesPage() {
  const pageData = await getPageBySlug("/airlines");
  return <AirlinesPageClient initialPageData={pageData} />;
}
