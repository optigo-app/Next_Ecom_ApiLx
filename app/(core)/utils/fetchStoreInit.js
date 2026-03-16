import { isLocalHost, localHosts } from "../constants/DomainList";
import { NEXT_APP_WEB } from "./env";
import { getDomainInfo } from "./getDomainInfo";

export async function fetchStoreInitData(req) {
  try {
    let baseUrl = "";
    let hostname = "";
    let protocol = "";
    let domainInfo = null;
    try {
      domainInfo = await getDomainInfo();
      hostname = domainInfo.hostname;
      protocol = domainInfo.protocol;
    } catch {
      hostname = "";
      protocol = "";
    }
    if ((!hostname || hostname === "") && typeof window !== "undefined") {
      const { protocol: winProtocol, hostname: winHost } = window.location;
      hostname = winHost.replace(/^www\./, "");
      protocol = winProtocol;
    }

    const cleanHost = hostname.split(":")[0];
    const isNgrok = cleanHost.endsWith(".ngrok-free.app") || cleanHost.endsWith(".ngrok.io");
    const isLocalhost = cleanHost === "localhost" || cleanHost === "127.0.0.1" || cleanHost.endsWith(".localhost") ||isNgrok;

    if (!hostname) hostname = NEXT_APP_WEB;

    if (isLocalHost(cleanHost)) {
      if (process.env.NODE_ENV === "development") {
        console.log("development");
        baseUrl = `http://192.168.1.153/R50B3/UFS/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
      // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/nxt14.optigoapps.com/StoreInit.json`;

      } else {
        console.log("production");
        baseUrl = `http://192.168.1.153/R50B3/UFS/StoreInit/${cleanHost}/StoreInit.json`;
      }
    } else if (isLocalhost) {
      baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
    } else {
      baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
    }

    const finalUrl = baseUrl;
    console.log("🚀 ~ fetchStoreInitData ~ baseUrl:", baseUrl)
    const response = await fetch(finalUrl);
    const jsonData = await response.json();
    if (!Boolean(response.ok)) throw new Error(`HTTP error ${response.status}`);
    return jsonData || {};
  } catch (error) {
    console.error("❌ Error fetching StoreInit data:", error);
    return null;
  }
}

