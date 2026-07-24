import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { IsUserLoggedIn } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { redirect } from "next/navigation";
import React from "react";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { resolveLoginWithMobileCode } from "@/app/(core)/utils/ThemeRouteResolver";


const page = async ({ params, searchParams }) => {
  if (await IsUserLoggedIn()) {
    redirect("/");
  }
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const LoginWithMobileCode = await resolveLoginWithMobileCode(themeData.page);
  return <LoginWithMobileCode params={awaitedParams} searchParams={awaitedSearchParams} />;
};


export default page;
