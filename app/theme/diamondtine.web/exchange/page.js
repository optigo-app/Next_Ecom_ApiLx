
import "./exchange.scss";
import Link from "next/link";
import { getExchangeDiamondtineContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function Exchange() {
  const exchangeContent = await getExchangeDiamondtineContent();

  return (
    <div className="diamondtine_exchange">
      <div>
        <div
          className="exchange"
          dangerouslySetInnerHTML={{ __html: exchangeContent }}
        />
      </div>
       
    </div>
  );
}
