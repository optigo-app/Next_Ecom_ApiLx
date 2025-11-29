import "./index.scss";
import { getAboutUsContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function AboutUs() {
  const aboutUsContent = await getAboutUsContent();
  return (
    <div className="smr_about_mainDiv">
      <div className="daimondsEveryAbout">
        <div className="smr_daimondsEveryAbout_sub" style={{ paddingBottom: "80px", minHeight: "400px" }}>
          <div dangerouslySetInnerHTML={{ __html: aboutUsContent }} />
        </div>
      </div>
    </div>
  );
}
