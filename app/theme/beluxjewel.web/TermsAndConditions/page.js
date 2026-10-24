import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import TermsAndCondition from "@/app/components/(static)/TermsAndCondition/TermsAndCondition"; 

export default async function TopSection() {
  const { pageTemplates, isError, error } = await getWebContentManagement();

  if (isError) {
    console.error("[AboutUs] Error loading page templates:", error);
    return <div className="au-error">Failed to load About Us content.</div>;
  }

  const termsTemplates = (pageTemplates || []).filter(
    (t) => t?.PageKey === "terms-condition"
  );

  
  console.log("TCL: TopSection -> termsTemplates",termsTemplates )

  return <TermsAndCondition templates={termsTemplates} />;
}