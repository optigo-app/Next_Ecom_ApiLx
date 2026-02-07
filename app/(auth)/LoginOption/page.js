import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import React from "react";


const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const LoginOption = (await import(`@/app/theme/${themeData.page}/Auth/LoginOption/page.js`)).default;
  return <LoginOption params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
