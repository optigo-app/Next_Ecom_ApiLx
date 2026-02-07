import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import React from "react";


const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const storeInit = await getStoreInit();
  const themeData = themeMap[theme];
    const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);

  const ContinueWithEmail = (await import(`@/app/theme/${themeData.page}/Auth/ContinueWithEmail/page.js`)).default;
  return <ContinueWithEmail storeInit={storeInit} params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
