import { getQualityHoqContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import "./page.scss";
import Link from "next/link";

export default async function page() {
    const qualityContent = await getQualityHoqContent();

    return (
        <div className="hoq_why_quality_manners">
            <div
                className="content"
                dangerouslySetInnerHTML={{ __html: qualityContent }}
            />
            <div className="back-to-home">
                <Link href={"/"}>Back to Home</Link>
            </div>
        </div>
    );
}
