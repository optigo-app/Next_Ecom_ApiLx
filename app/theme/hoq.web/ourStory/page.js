import './page.scss';
import Link from "next/link";
import { getStoryHoqContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function OurStory() {
    const storyContent = await getStoryHoqContent();
    return (
        <div className="hoq_ourStory">
            <div>
                <div
                    style={{
                        padding: "0 15px",
                        width: "70%",
                        margin: "0 auto"
                    }}
                    dangerouslySetInnerHTML={{ __html: storyContent }}
                />
            </div>
            <div className="back-to-home">
                <Link href={"/"}>Back to Home</Link>
            </div>
        </div>
    );
}
