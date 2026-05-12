import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  console.log(theme, "theme")
  console.log(themeData, "themeData")
  const storeInit = await getStoreInit();
  const Wishlist = (await import(`@/app/theme/${themeData.page}/Wishlist/page.js`)).default;
  return <Wishlist storeInit={storeInit} />;
}
