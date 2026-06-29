
import "./termsPage.scss";
import Link from "next/link";
import { getTermsDiamondtineContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function PrivacyPolicy() {
  const termsContent = await getTermsDiamondtineContent();

  return (
    <div className="diamondtine_terms">
      <div>
        <div
          className="terms"
          dangerouslySetInnerHTML={{ __html: termsContent }}
        />
      </div>
       
    </div>
  );
}
