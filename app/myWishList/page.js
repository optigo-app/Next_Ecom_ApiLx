import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { resolveWishlist } from "../(core)/utils/ThemeRouteResolver";

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const storeInit = await getStoreInit();
  const Wishlist = await resolveWishlist(themeData.page);
  return <Wishlist storeInit={storeInit} />;
}
