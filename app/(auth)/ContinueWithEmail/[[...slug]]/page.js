import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit, IsUserLoggedIn } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { redirect } from "next/navigation";
import React from "react";


const page = async ({ params, searchParams }) => {
  if (await IsUserLoggedIn()) {
    redirect("/");
  }
  const theme = await getActiveTheme();
  const storeInit = await getStoreInit();
  const themeData = themeMap[theme];
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const ContinueWithEmail = (await import(`@/app/theme/${themeData.page}/Auth/ContinueWithEmail/page.js`)).default;
  return <ContinueWithEmail storeInit={storeInit} params={awaitedParams} searchParams={awaitedSearchParams} />;
};


export default page;
