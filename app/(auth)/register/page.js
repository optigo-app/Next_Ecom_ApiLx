import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { IsUserLoggedIn } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
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
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const Register = await resolveRegister(themeData.page);
  return <Register params={awaitedParams} searchParams={awaitedSearchParams} />;
};


export default page;
