import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import Career from "@/app/components/(static)/Career/Career"; 

export default async function TopSection() {
  const { pageTemplates, isError, error } = await getWebContentManagement();

  if (isError) {
    console.error("[AboutUs] Error loading page templates:", error);
    return <div className="au-error">Failed to load About Us content.</div>;
  }

  const careerTemplates = (pageTemplates || []).filter(
    (t) => t?.PageKey === "career"
  );

  return <Career templates={careerTemplates} />;
}