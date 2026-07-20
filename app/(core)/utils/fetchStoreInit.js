import { isLocalHost, localHosts } from "../constants/DomainList";
import { NEXT_APP_WEB } from "./env";
import { getDomainInfo } from "./getDomainInfo";

const storeInitCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

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
    const isNgrok =
      cleanHost.endsWith(".ngrok-free.app") || cleanHost.endsWith(".ngrok.io");
    const isLocalhost =
      cleanHost === "localhost" ||
      cleanHost === "127.0.0.1" ||
      cleanHost.endsWith(".localhost") ||
      cleanHost === "92.168.0.153" ||
      isNgrok;

    if (!hostname) hostname = NEXT_APP_WEB;
    if (isLocalHost(cleanHost)) {
      if (process.env.NODE_ENV === "development") {
        baseUrl = `http://192.168.0.153/R50B3/UFS/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
        // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/elior.optigoapps.com/StoreInit.json`;
        // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/shreediamond.optigoapps.com/StoreInit.json`;
        // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/nxt14.optigoapps.com/StoreInit.json`;
      } else {
        if (isLocalHost(cleanHost)) {
          baseUrl = `http://192.168.0.153/R50B3/UFS/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
        } else {
          console.log(isLocalHost(cleanHost), "cleanHost  else ");
          baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
        }
      }
    } else if (isLocalhost) {
      baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
    } else {
      baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
    }

    const finalUrl = baseUrl;

    // Check memory cache
    const cachedEntry = storeInitCache.get(finalUrl);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      return cachedEntry.data;
    }

    // Check in-flight promise
    if (inFlightRequests.has(finalUrl)) {
      return await inFlightRequests.get(finalUrl);
    }

    const fetchPromise = (async () => {
      console.log(baseUrl, "baseUrl");
      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const jsonData = await response.json();
      const result = jsonData || {};
      storeInitCache.set(finalUrl, { data: result, timestamp: Date.now() });
      return result;
    })().finally(() => {
      inFlightRequests.delete(finalUrl);
    });

    inFlightRequests.set(finalUrl, fetchPromise);
    return await fetchPromise;
  } catch (error) {
    console.error("❌ Error fetching StoreInit data:", error);
    return null;
  }
}

// import { isLocalHost, localHosts } from "../constants/DomainList";
// import { NEXT_APP_WEB } from "./env";
// import { getDomainInfo } from "./getDomainInfo";

// export async function fetchStoreInitData(req) {
//   try {
//     let baseUrl = "";
//     let hostname = "";
//     let protocol = "";
//     let domainInfo = null;
//     try {
//       domainInfo = await getDomainInfo();
//       hostname = domainInfo.hostname;
//       protocol = domainInfo.protocol;
//     } catch {
//       hostname = "";
//       protocol = "";
//     }
//     if ((!hostname || hostname === "") && typeof window !== "undefined") {
//       const { protocol: winProtocol, hostname: winHost } = window.location;
//       hostname = winHost.replace(/^www\./, "");
//       protocol = winProtocol;
//     }

//     const cleanHost = hostname.split(":")[0];
//     const isNgrok =
//       cleanHost.endsWith(".ngrok-free.app") || cleanHost.endsWith(".ngrok.io");
//     const isLocalhost =
//       cleanHost === "localhost" ||
//       cleanHost === "127.0.0.1" ||
//       cleanHost.endsWith(".localhost") ||
//       isNgrok;

//     if (!hostname) hostname = NEXT_APP_WEB;
//     if (isLocalHost(cleanHost)) {
//       if (process.env.NODE_ENV === "development") {
//         baseUrl = `http://192.168.0.153/R50B3/UFS/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
//         // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/elior.optigoapps.com/StoreInit.json`;
//         // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/shreediamond.optigoapps.com/StoreInit.json`;
//         // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/nxt14.optigoapps.com/StoreInit.json`;
//       } else {
//         if (cleanHost === "localhost") {
//           baseUrl = `http://192.168.0.153/R50B3/UFS/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
//         } else {
//           baseUrl = `http://192.168.0.153/R50B3/UFS/StoreInit/${cleanHost}/StoreInit.json`;
//         }
//       }
//     } else if (isLocalhost) {
//       baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
//     } else {
//       baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
//     }

//     const finalUrl = baseUrl;
//     const response = await fetch(finalUrl);
//     if (!response.ok) throw new Error(`HTTP error ${response.status}`);
//     const jsonData = await response.json();
//     return jsonData || {};
//   } catch (error) {
//     console.error("❌ Error fetching StoreInit data:", error);
//     return null;
//   }
// }
