
import "./PrivacyPolicy.scss";
import Link from "next/link";
import { getPrivacypolicyDiamondtineContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function PrivacyPolicy() {
  const privacyPolicyContent = await getPrivacypolicyDiamondtineContent();
  
console.log("TCL: PrivacyPolicy -> ", privacyPolicyContent)
  return (
    <div className="diamondtine_privacy-policy">
      <div>
        <div
          className="privacy-policy"
          dangerouslySetInnerHTML={{ __html: privacyPolicyContent }}
        />
      </div>
       
    </div>
  );
}
