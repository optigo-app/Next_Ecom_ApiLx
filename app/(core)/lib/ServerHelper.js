// app/(core)/lib/ServerHelper.js
import { headers } from "next/headers";
import { NEXT_APP_WEB } from "../utils/env";
import { activeBrand } from "@/app/env";
import { AppConfig } from "../constants/AppConfig";

/**
 * Safe host getter (server only).
 */
export async function getHost() {
  try {
    const h = await headers();
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
  const base =
    host.includes("localhost") || host.includes("zen")
      ? NEXT_APP_WEB
      : NEXT_APP_WEB;
  // return `${protocol}://${base}/WebSiteStaticImage`;
  return `WebSiteStaticImage`;
}

export async function getAssetBase() {
  const host = await getHost();
  return storImagePath(host);
}

export const assetBase = await getAssetBase();

const Theme = {
  Sonasons: {
    web: "/WebSiteStaticImage/logoIcon/webLogo.png",
    mobile: "/WebSiteStaticImage/logoIcon/mobileLogo.png",
  },
  omjiyansh: {
    web: "/WebSiteStaticImage/logoIcon/om/new/om-jiyansh-jewel pvt ltd final logo.png",
    mobile:
      "/WebSiteStaticImage/logoIcon/om/new/om-jiyansh-jewel pvt ltd final logo.png",
  },
  hoq: {
    web: "/WebSiteStaticImage/logoIcon/webLogo1.png",
    mobile: "/WebSiteStaticImage/logoIcon/mobileLogo2.png",
  },
  Elvee: {
    web: "/WebSiteStaticImage/logoIcon/webLogo.png",
    mobile: "/WebSiteStaticImage/logoIcon/mobileLogo.png",
  },
  vimalgoldanddiamond: {
    web: "/WebSiteStaticImage/logoIcon/vimal/webLogo.png",
    mobile: "/WebSiteStaticImage/logoIcon/vimal/mobileLogo.png",
    favicon: "/WebSiteStaticImage/logoIcon/vimal/favicon.ico",
    meta: "/WebSiteStaticImage/logoIcon/vimal/MetaShareImage.jpg",
  },
  beluxjewel: {
    web: "/WebSiteStaticImage/logoIcon/vimal/webLogo.png",
    mobile: "/WebSiteStaticImage/logoIcon/vimal/mobileLogo.png",
    blackLogo: "/WebSiteStaticImage/logoIcon/vimal/webLogo11.png",
  },
};

export function getLogos() {
  const config = AppConfig[activeBrand];
  if (config?.web && config?.mobile) {
    return {
      web: config.web,
      mobile: config.mobile,
      transparent_mobile: config.transparent_mobile,
      ...(config.black_logo && { black_logo: config.black_logo }),
    };
  }

  const brand = activeBrand === "omjiyas" ? "omjiyansh" : activeBrand;
  if (Theme[brand]) {
    return Theme[brand];
  }
  if (brand.toLowerCase().includes("sonasons")) {
    return Theme.Sonasons;
  }
  if (brand.toLowerCase().includes("elvee")) {
    return Theme.Elvee;
  }
  if (brand.toLowerCase().includes("hoq")) {
    return Theme.hoq;
  }
  if (brand.toLowerCase().includes("beluxjewel")) {
    return Theme.beluxjewel;
  }

  return Theme.Sonasons;
}

export function getHoqLogos() {
  const config = AppConfig[activeBrand];
  if (config?.web && config?.mobile) {
    return {
      web: config.web,
      mobile: config.mobile,
    };
  }

  const brand = activeBrand === "omjiyas" ? "omjiyansh" : activeBrand;
  if (Theme[brand]) {
    return Theme[brand];
  }
  if (brand.toLowerCase().includes("sonasons")) {
    return Theme.Sonasons;
  }
  if (
    brand.toLowerCase().includes("elvee") ||
    brand.toLowerCase().includes("belux")
  ) {
    return Theme.Elvee;
  }
  if (brand.toLowerCase().includes("hoq")) {
    return Theme.hoq;
  }
  return Theme.Sonasons;
}
