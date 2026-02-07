import { getCustomHoqContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import "./page.scss";
import Link from "next/link";

export default async function page() {
    const cutomizeContent = await getCustomHoqContent();

    return (
        <div className="hoq_custom">
            <div
                className="custom"
                dangerouslySetInnerHTML={{ __html: cutomizeContent }}
            />
            <div className="back-to-home">
                <Link href={"/"}>Back to Home</Link>
            </div>
        </div>
    );
}
