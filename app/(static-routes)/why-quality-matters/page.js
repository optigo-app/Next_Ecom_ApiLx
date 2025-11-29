import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";


export default async function Page() {
    const theme = await getActiveTheme();
    const themeData = themeMap[theme];
    const Quality = (await import(`@/app/theme/${themeData.page}/quality/page.js`)).default;
    return <Quality />;
}
