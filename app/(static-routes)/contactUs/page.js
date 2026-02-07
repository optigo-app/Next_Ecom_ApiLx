import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";


export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const ContactUs = (await import(`@/app/theme/${themeData.page}/contactUs/page.js`)).default;
  return <ContactUs />;
}
