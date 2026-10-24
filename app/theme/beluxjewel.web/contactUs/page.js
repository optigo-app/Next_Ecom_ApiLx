import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import ContactUs from "@/app/components/(static)/Contact/ContactUs"; 

export default async function TopSection() {
  const { pageTemplates, isError, error } = await getWebContentManagement();

  if (isError) {
    console.error("[AboutUs] Error loading page templates:", error);
    return <div className="au-error">Failed to load About Us content.</div>;
  }

  const contactTemplates = (pageTemplates || []).filter(
    (t) => t?.PageKey === "contact-us"
  );

  return <ContactUs templates={contactTemplates} />;
}