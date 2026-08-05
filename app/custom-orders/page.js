// import React from "react";
// import OrderForm from "@/app/theme/fgstore.web/CustomOrder";
// import OrderFormApp from "@/app/theme/fgstore.mapp/home/CustomOrder";
// import { LocalSetup } from "../env";

// const page = () => {
//   if (LocalSetup === "fgstore.mapp") return <OrderFormApp />;
//   return <OrderForm />;
// };

// export default page;


import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "../(core)/utils/ThemeMap";
import { resolveCustomOrders } from "../(core)/utils/ThemeRouteResolver";

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme] || { page: "fgstore.web" };
  const storeInit = await getStoreInit();
  const CustomOrder = await resolveCustomOrders(themeData?.page);
  return <CustomOrder storeInit={storeInit} theme={theme} />;
}

