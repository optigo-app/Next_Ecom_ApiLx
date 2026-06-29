
import "./ShipingAndReturn.scss";
import Link from "next/link";
import { getShipingAndReturnDiamondtineContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function ShipingAndReturn() {
  const shipingAndReturnContent = await getShipingAndReturnDiamondtineContent();

  return (
    <div className="diamondtine_shiping-and-return">
      <div>
        <div
          className="shiping-and-return"
          dangerouslySetInnerHTML={{ __html: shipingAndReturnContent }}
        />
      </div>
       
    </div>
  );
}
