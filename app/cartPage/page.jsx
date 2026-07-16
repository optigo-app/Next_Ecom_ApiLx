import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "../(core)/utils/ThemeMap";
import { resolveCart } from "../(core)/utils/ThemeRouteResolver";

  export default async function Page({ params, searchParams }) {
    const theme = await getActiveTheme();
    const themeData = themeMap[theme];
    const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);

    const Cart = await resolveCart(themeData.page);
    return <Cart params={awaitedParams} searchParams={awaitedSearchParams} />;
}
