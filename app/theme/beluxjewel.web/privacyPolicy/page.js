import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import Policy from "@/app/components/(static)/Policy/Policy"; 

export default async function TopSection() {
  const { pageTemplates, isError, error } = await getWebContentManagement();

  if (isError) {
    console.error("[AboutUs] Error loading page templates:", error);
    return <div className="au-error">Failed to load About Us content.</div>;
  }

  const policyTemplates = (pageTemplates || []).filter(
    (t) => t?.PageKey === "privacy-policy"
  );

  return <Policy templates={policyTemplates} />;
}