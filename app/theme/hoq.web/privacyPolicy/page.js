import { getPrivacyHoqContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import "./PrivacyPolicy.scss";
import Link from "next/link";

export default async function PrivacyPolicy() {
    const privacyContent = await getPrivacyHoqContent();

    return (
        <div className="hoq_privacyPolicy">
            <div>
                <div
                    // className="privacy-policy"
                    style={{
                        padding: "0 15px",
                        width: "70%",
                        margin: "0 auto"
                    }}
                    dangerouslySetInnerHTML={{ __html: privacyContent }}
                />
            </div>
            <div className="back-to-home">
                <Link href={"/"}>Back to Home</Link>
            </div>
        </div>
    );
}
