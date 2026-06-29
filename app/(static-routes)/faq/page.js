import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Faq = (await import(`@/app/theme/${themeData.page}/faq/page.js`)).default;
  return <Faq />;
}
