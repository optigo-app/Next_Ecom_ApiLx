"use client";

import { useStore } from "@/app/(core)/contexts/StoreProvider";

/** Shows storefront content to everyone on B2C sites and logged-in users on B2B sites. */
export default function B2BContent({ children }) {
  const { isB2B, islogin } = useStore();

  if (isB2B && !islogin) return null;

  return children;
}
