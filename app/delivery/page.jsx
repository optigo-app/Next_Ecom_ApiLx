import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { resolveDelivery } from "../(core)/utils/ThemeRouteResolver";


  export default async function Page() {
    const theme = await getActiveTheme();
    const themeData = themeMap[theme];
    const storeInit = await getStoreInit();
    const Delivery = await resolveDelivery(themeData.page);
    return <Delivery storeInit={storeInit} />;
}
