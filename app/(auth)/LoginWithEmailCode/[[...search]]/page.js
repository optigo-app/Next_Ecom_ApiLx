import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { IsUserLoggedIn } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { redirect } from "next/navigation";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import React from "react";


const page = async ({ params, searchParams }) => {
  if (await IsUserLoggedIn()) {
    redirect("/");
  }
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const LoginWithEmailCode = (await import(`@/app/theme/${themeData.page}/Auth/LoginWithEmailCode/page.js`)).default;
  return <LoginWithEmailCode params={awaitedParams} searchParams={awaitedSearchParams} />;
};


export default page;
