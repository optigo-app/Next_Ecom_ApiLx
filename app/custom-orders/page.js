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
import { LocalSetup } from "../env";
import OrderFormApp from "@/app/theme/fgstore.mapp/home/CustomOrder";

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const storeInit = await getStoreInit();
  const CustomOrder = (await import(`@/app/theme/${themeData.page}/CustomOrder/index.js`)).default;
  if (LocalSetup === "fgstore.mapp") return <OrderFormApp />;
  return <CustomOrder storeInit={storeInit} />;
}
