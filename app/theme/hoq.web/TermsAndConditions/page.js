import { getTermsHoqContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import "./termsPage.scss";
import Link from "next/link";

export default async function PrivacyPolicy() {
  const termsContent = await getTermsHoqContent();

  return (
    <div className="hoq_terms">
      <div>
        <div
          className="terms"
          dangerouslySetInnerHTML={{ __html: termsContent }}
        />
      </div>
      <div className="back-to-home">
        <Link href={"/"}>Back to Home</Link>
      </div>
    </div>
  );
}
