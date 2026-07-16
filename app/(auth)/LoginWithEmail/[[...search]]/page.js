import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { getStoreInit, IsUserLoggedIn } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { redirect } from "next/navigation";
import { resolveLoginWithEmail } from "@/app/(core)/utils/ThemeRouteResolver";

const page = async ({ params, searchParams }) => {
  if (await IsUserLoggedIn()) {
    redirect("/");
  }
  const theme = await getActiveTheme();
  const storeInit = await getStoreInit();
  const themeData = themeMap[theme];
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const LoginWithEmail = await resolveLoginWithEmail(themeData.page);
  return <LoginWithEmail params={awaitedParams} searchParams={awaitedSearchParams} storeInit={storeInit} />;
};


export default page;
