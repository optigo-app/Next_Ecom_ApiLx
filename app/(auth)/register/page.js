import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { IsUserLoggedIn, getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { redirect } from "next/navigation";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import React from "react";
import { resolveRegister } from "@/app/(core)/utils/ThemeRouteResolver";

const page = async ({ params, searchParams }) => {
  if (await IsUserLoggedIn()) {
    redirect("/");
  }
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const storeInit = await getStoreInit();
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const Register = await resolveRegister(themeData.page);
  return <Register storeInit={storeInit} params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
