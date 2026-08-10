import { getFormsSettings, getPageBySlug } from "@/actions/pageActions";
import ContactPageClient from "./ContactPageClient";

export default async function ContactPage() {
  const [pageData, formsSettings] = await Promise.all([
    getPageBySlug("/contact"),
    getFormsSettings(),
  ]);

  return (
    <ContactPageClient
      initialPageData={pageData}
      initialFormConfig={formsSettings?.formsData?.contact || null}
    />
  );
}
