import { getActiveTheme } from "./(core)/lib/getActiveTheme";
import { getStoreInit } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "./(core)/utils/ThemeMap";
import { resolveHome } from "./(core)/utils/ThemeRouteResolver";

// Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function Page() {
  const storeData = await getStoreInit();
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Home = await resolveHome(themeData.page);
  return <Home storeinit={storeData} />;
}
