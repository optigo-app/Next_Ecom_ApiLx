import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import TestCheckoutMain from "./components/TestCheckoutMain";
import {
  beluxCheckoutTheme,
  julianCheckoutTheme,
  getCheckoutThemeByBrand,
} from "./theme/checkoutTheme";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | My Shopping Bag",
  description: "Review your shopping bag, manage delivery address and complete order.",
};

export { beluxCheckoutTheme, julianCheckoutTheme };

export default async function TestCheckoutPage() {
  const storeinit = await getStoreInit();
  const theme = getCheckoutThemeByBrand(storeinit?.domain);
  return <TestCheckoutMain storeinit={storeinit} theme={theme} />;
}
