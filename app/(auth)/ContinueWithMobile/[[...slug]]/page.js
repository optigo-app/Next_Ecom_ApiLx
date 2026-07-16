import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { getStoreInit, IsUserLoggedIn } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { redirect } from "next/navigation";
import { resolveContinueWithMobile } from "@/app/(core)/utils/ThemeRouteResolver";

const page = async ({ params, searchParams }) => {
  if (await IsUserLoggedIn()) {
    redirect("/");
  }
  const theme = await getActiveTheme();
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const storeInit = await getStoreInit();

  const themeData = themeMap[theme];
  const ContinueWithMobile = await resolveContinueWithMobile(themeData.page);
  return <ContinueWithMobile params={awaitedParams} searchParams={awaitedSearchParams} storeInit={storeInit} />;
};


export default page;
