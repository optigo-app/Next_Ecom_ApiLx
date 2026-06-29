
import "./faqPage.scss";
import Link from "next/link";
import { getFaqDiamondtineContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function PrivacyPolicy() {
  const faqContent = await getFaqDiamondtineContent();

  return (
    <div className="diamondtine_faq">
      <div>
        <div
          className="faq"
          dangerouslySetInnerHTML={{ __html: faqContent }}
        />
      </div>
       
    </div>
  );
}
