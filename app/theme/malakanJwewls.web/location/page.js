
import "./locationPage.scss";
import Link from "next/link";
import { getLocationDiamondtineContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function Location() {
  const locationContent = await getLocationDiamondtineContent();

  return (
    <div className="diamondtine_location">
      <div>
        <div
          className="location"
          dangerouslySetInnerHTML={{ __html: locationContent }}
        />
      </div>
       
    </div>
  );
}
