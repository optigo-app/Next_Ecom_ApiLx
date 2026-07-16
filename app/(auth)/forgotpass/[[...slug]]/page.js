import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit, IsUserLoggedIn } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { redirect } from "next/navigation";
import React from "react";
import { resolveForgotPassword } from "@/app/(core)/utils/ThemeRouteResolver";


const page = async ({ params, searchParams }) => {
  if (await IsUserLoggedIn()) {
    redirect("/");
  }
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const storeInit = await getStoreInit();

  const ForgotPassword = await resolveForgotPassword(themeData.page);
  return <ForgotPassword params={awaitedParams} searchParams={awaitedSearchParams} storeInit={storeInit} />;
};


export default page;
