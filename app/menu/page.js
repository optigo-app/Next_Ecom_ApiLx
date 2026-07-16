import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { resolveMenu } from "../(core)/utils/ThemeRouteResolver";

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const storeInit = await getStoreInit();
  const Menu = await resolveMenu(themeData.page);
  return <Menu storeInit={storeInit} />;
}
