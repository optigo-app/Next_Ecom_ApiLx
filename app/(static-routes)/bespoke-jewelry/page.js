import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import { themeMap } from "@/app/(core)/utils/ThemeMap";

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  
  const BespokeJewelry = (await import(`@/app/theme/${themeData.page}/bespoke-jewelry/page.js`)).default;
  return <BespokeJewelry assetBase={assetBase} />;
}
