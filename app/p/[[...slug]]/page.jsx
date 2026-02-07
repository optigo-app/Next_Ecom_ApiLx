import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";

export default async function Page({ params, searchParams }) {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Product = (await import(`@/app/theme/${themeData.page}/product/page.jsx`)).default;
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  return <Product params={awaitedParams} searchParams={awaitedSearchParams} />;
}
