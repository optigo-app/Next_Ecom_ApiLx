import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import AboutUs from "@/app/components/(static)/About/AboutUs"; 

export default async function TopSection() {
  const { pageTemplates, isError, error } = await getWebContentManagement();

  if (isError) {
    console.error("[AboutUs] Error loading page templates:", error);
    return <div className="au-error">Failed to load About Us content.</div>;
  }

  const aboutTemplates = (pageTemplates || []).filter(
    (t) => t?.PageKey === "about-us"
  );

  return <AboutUs templates={aboutTemplates} />;
}