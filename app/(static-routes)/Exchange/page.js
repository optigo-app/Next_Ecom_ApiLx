import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Exchange = (await import(`@/app/theme/${themeData.page}/exchange/page.js`)).default;
  return <Exchange />;
}
