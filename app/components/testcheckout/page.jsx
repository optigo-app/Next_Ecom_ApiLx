import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import TestCheckoutMain from "./components/TestCheckoutMain";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | My Shopping Bag",
  description: "Review your shopping bag, manage delivery address and complete order.",
};

/**
 * Belux Jewel Theme Color Configuration
 * Customizable theme object: change primary/variants here to restyle the entire checkout experience.
 */
export const checkoutTheme = {
  primary: "#cca182",            // Belux warm caramel gold
  primaryHover: "#b88d6e",       // Interactive hover shade
  primaryActive: "#a67c5d",      // Pressed / active shade
  primaryLight: "#faf4ee",       // Soft tint for selected cards & edit mode
  primaryLightBorder: "#edd8c7", // Subtle border for active items
  primaryText: "#9c6d48",        // Primary text for totals and accents
  btnColor: "#ffffff",           // Button text color
  badgeBg: "#f5e8dd",            // Deliver Here / active tag background
  badgeText: "#8d613e",          // Deliver Here / active tag text color
};

export default async function TestCheckoutPage() {
  const storeinit = await getStoreInit();
  return <TestCheckoutMain storeinit={storeinit} theme={checkoutTheme} />;
}
