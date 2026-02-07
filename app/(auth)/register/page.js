import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";
import { themeMap } from "@/app/(core)/utils/ThemeMap";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const Register = (await import(`@/app/theme/${themeData.page}/Auth/Register/page.js`)).default;
  return <Register params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
