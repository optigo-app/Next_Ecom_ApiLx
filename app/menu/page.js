import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { resolveMenu } from "../(core)/utils/ThemeRouteResolver";
import { getSqliteMenus } from "../(core)/utils/sqlite/sqliteActions";
import { cookies } from "next/headers";

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const storeInit = await getStoreInit();
  const Menu = await resolveMenu(themeData.page);
  const cookieStore = await cookies();
  const userPackageId = cookieStore.get("userPackageId")?.value;
  const packageId = userPackageId ? Number(userPackageId) : storeInit?.PackageId;

  let initialMenuData = [];
  try {
    const menuResponse = await getSqliteMenus({ packageId });
    initialMenuData = menuResponse?.Data?.rd || [];
  } catch (error) {
    console.warn("[menu] SQLite menu prefetch failed:", error?.message);
  }

  return <Menu storeInit={storeInit} initialMenuData={initialMenuData} />;
}
