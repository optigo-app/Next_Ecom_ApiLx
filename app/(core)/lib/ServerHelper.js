// app/(core)/lib/ServerHelper.js
import { headers } from "next/headers";
import { NEXT_APP_WEB } from "../utils/env";

/**
 * Safe host getter (server only).
 */
export async function getHost() {
  try {
    const h = headers();
    const host = h.get("host");
    if (host) return host;
  } catch {
    console.log("headers() not available → likely client");
  }

  if (typeof window !== "undefined") {
    return window.location.host;
  }

  return "localhost:3000";
}

export function getProtocol(host) {
  if (!host) return "http";
  return host.includes("localhost") ? "https" : "https";
}

export function storImagePath(host) {
  const protocol = getProtocol(host);
  const base = host.includes("localhost") || host.includes("zen") ? NEXT_APP_WEB : NEXT_APP_WEB;
  // return `${protocol}://${base}/WebSiteStaticImage`;
  return `WebSiteStaticImage`;
}

export async function getAssetBase() {
  const host = await getHost();
  return storImagePath(host);
}

export const assetBase = await getAssetBase();

export function getLogos() {
  return {
    web: "/WebSiteStaticImage/logoIcon/webLogo.png",
    mobile: "/WebSiteStaticImage/logoIcon/mobileLogo.png",
  };
}

export function getHoqLogos() {
  return {
    web: "/WebSiteStaticImage/logoIcon/webLogo1.png",
    mobile: "/WebSiteStaticImage/logoIcon/mobileLogo2.png",
  };
}