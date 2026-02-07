import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";

export default async function Page({ params, searchParams }) {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);

  const Detail = (await import(`@/app/theme/${themeData.page}/detail/page.jsx`)).default;
  return <Detail params={awaitedParams} searchParams={awaitedSearchParams} />;
}
