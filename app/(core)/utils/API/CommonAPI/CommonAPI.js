import { isLocalHost, localHosts } from "@/app/(core)/constants/DomainList";
import { getSession } from "../../FetchSessionData";
import { getDomainInfo } from "../../getDomainInfo";
import { fetchStoreInitData } from "../../fetchStoreInit";
import axios from "axios";

let APIURL = "";
let apiUrlPromise = null;
let SV_DY = null;
let SV_YearCode = null;
let SV_Token = null;
let SV_version = null;
let storeInitCache = null;
let initPromise = null;


export const getClientIpAddress = async () => {
    try {
        if (typeof window !== "undefined") {
            const cachedIp = sessionStorage.getItem("clientIpAddress");
            if (cachedIp) return cachedIp;
        }

        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        const ip = data?.ip || "";

        if (typeof window !== "undefined" && ip) {
            sessionStorage.setItem("clientIpAddress", ip);
        }
        return ip;
    } catch (error) {
        console.error("Error fetching IP address:", error);
        return "";
    }
};

const setApiUrl = async () => {
    if (apiUrlPromise) return apiUrlPromise;

    apiUrlPromise = (async () => {
        try {

            let parseddata;
            if (typeof window === "undefined") {
                const storeInitRes = await fetchStoreInitData();
                parseddata = storeInitRes?.rd?.[0] || storeInitRes;
            } else {
                const datas = await fetch(`/api/store-init`, { method: 'GET' });
                parseddata = await datas.json();
            }

            console.log(parseddata, "logssss")

            if (parseddata) {
                APIURL = parseddata?.ApiUrl || {};
                SV_DY = parseddata?.sv;
                SV_YearCode = parseddata?.YearCode;
                SV_Token = parseddata?.token;
                SV_version = parseddata?.version;
                return;
            }

            const domainInfo = await getDomainInfo();
            const hostname = domainInfo?.hostname || "";
            const cleanHost = hostname.split(":")[0];

            if (isLocalHost(cleanHost)) {
                APIURL = "http://newnextjs.web/api/report";
            } else {
                APIURL = "https://apilx.optigoapps.com/api/report";
            }
            if (!APIURL) {
                APIURL = "https://apilx.optigoapps.com/api/report";
            }
            return APIURL;
        } catch (error) {
            console.error("Failed to fetch API URL:", error);
            APIURL = "https://apilx.optigoapps.com/api/report";
            return APIURL;
        }
    })();

    return apiUrlPromise;
};

// Initial call
setApiUrl();

export const getStoreInitData = () => {
    if (typeof window !== "undefined") {
        return window.__STORE_INIT__ || getSession("storeInit");
    }
    return null;
};


const initStore = async () => {
    if (storeInitCache) return storeInitCache;

    if (!initPromise) {
        initPromise = (async () => {
            try {
                let data;
                if (typeof window === "undefined") {
                    // Server-side: bypass internal API call and fetch directly
                    const storeInitRes = await fetchStoreInitData();
                    data = storeInitRes?.rd?.[0] || storeInitRes;
                } else {
                    // Client-side: use the API route
                    const res = await fetch("/api/store-init");
                    data = await res.json();
                }

                storeInitCache = data;
                APIURL = data?.ApiUrl || {};
                SV_DY = data?.sv;
                SV_YearCode = data?.YearCode;
                SV_Token = data?.token;
                SV_version = data?.version;
                // || "https://apilx.optigoapps.com/api/report";

                return data;
            } catch (err) {
                console.error("initStore Error:", err);
                return null;
            }
        })();
    }

    return initPromise;
};

const waitForStoreInit = async (maxRetries = 50, interval = 100) => {
    return new Promise((resolve) => {
        let retries = 0;
        const check = () => {
            const data = getStoreInitData();
            if (data || retries >= maxRetries) {
                if (!data && typeof window !== "undefined") {
                    console.warn("CommonAPI: Proceeding without storeInit after timeout");
                }
                resolve(data);
            } else {
                retries++;
                setTimeout(check, interval);
            }
        };
        check();
    });
};

export const CommonAPI = async (body) => {
    try {
        if (!APIURL) {
            await setApiUrl();
        }

        let storeInit = getStoreInitData();
        storeInit = await initStore() || storeInitCache;
        //         SV_DY
        // SV_YearCode
        // SV_Token

        if (!storeInit && typeof window !== 'undefined') {
            storeInit = window.__STORE_INIT__ || await waitForStoreInit();
        }

        const ipAddress = await getClientIpAddress();
        if (typeof FormData !== 'undefined' && body instanceof FormData) {
            if (body.has("con")) {
                try {
                    let conObj = JSON.parse(body.get("con"));
                    conObj.IPAddress = ipAddress;
                    body.set("con", JSON.stringify(conObj));
                } catch (e) {
                    console.error("Error parsing FormData con:", e);
                }
            }
            if (body.has("IPAddress")) body.delete("IPAddress");
        } else if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
            if (body.con) {
                try {
                    let conObj = typeof body.con === 'string' ? JSON.parse(body.con) : body.con;
                    conObj.IPAddress = ipAddress;
                    body.con = typeof body.con === 'string' ? JSON.stringify(conObj) : conObj;
                } catch (e) {
                    console.error("Error parsing body.con:", e);
                }
            }
            if ("ipaddress" in body) delete body.ipaddress;
        }

        const YearCode = SV_YearCode || storeInit?.YearCode || "e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIxfX17e3NvbmFzb25zfX17e3NvbmFzb25zfX0=";
        const Version = SV_version || "NXT" || (storeInit?.version ?? "");
        const token = SV_Token || (storeInit?.token ?? "");
        const sp = "54";
        const sv = process.env.NODE_ENV === "development" ? 0 : 1;

        const header = {
            Authorization: `Bearer ${token}`,
            Yearcode: YearCode,
            Version,
            sp,
            sv: sv,
        };

        const endpoint = APIURL.endsWith('/api/report')
            ? APIURL
            : APIURL.replace(/\/$/, '') + '/api/report';

        const response = await axios.post(endpoint, body, {
            headers: header,
            timeout: 30000
        });


        return response?.data || { Data: { rd: [] } };
    } catch (error) {
        console.error("CommonAPI Error:", error);
        return {
            Data: {
                rd: [{ stat: 0, stat_msg: "Network error or API failure" }]
            }
        };
    }
};



// import { isLocalHost, localHosts } from "@/app/(core)/constants/DomainList";
// import { getSession } from "../../FetchSessionData";
// import { getDomainInfo } from "../../getDomainInfo";
// import axios from "axios";

// let APIURL = "";

// const setApiUrl = async () => {
//     try {
//         let storeInit = null;

//         if (typeof window !== "undefined") {
//             storeInit = window.__STORE_INIT__ || getSession("storeInit");
//         } else {
//             try {
//                 const { cookies } = await import("next/headers");
//                 const cookieStore = await cookies();
//                 const storeDataStr = cookieStore?.get("x-store-data")?.value;
//                 if (storeDataStr) {
//                     storeInit = JSON.parse(storeDataStr);
//                 }
//             } catch (err) {
//                 console.error("CommonAPI setApiUrl Server Cookies Error:", err);
//             }
//         }

//         if (storeInit && storeInit.ApiUrl) {
//             const baseUrl = storeInit?.ApiUrl?.replace(/\/$/, "");
//             APIURL = `${baseUrl}/api/report`;
//             return APIURL;
//         }

//         const domainInfo = await getDomainInfo();
//         const hostname = domainInfo?.hostname || "";
//         const cleanHost = hostname.split(":")[0];

//         // if (isLocalHost(cleanHost)) {
//         //     APIURL = "http://newnextjs.web/api/report";
//         // } else {
//         //     APIURL = "https://apilx.optigoapps.com/api/report";
//         // }

//         return APIURL;
//     } catch (error) {
//         console.error("Failed to fetch API URL:", error);
//         APIURL = "https://apilx.optigoapps.com/api/report";
//         return APIURL;
//     }
// };

// export const getStoreInitData = () => {
//     if (typeof window !== "undefined") {
//         return window.__STORE_INIT__ || getSession("storeInit");
//     }
//     return null;
// };

// const waitForStoreInit = async (maxRetries = 50, interval = 100) => {
//     return new Promise((resolve) => {
//         let retries = 0;
//         const check = () => {
//             const data = getStoreInitData();
//             if (data || retries >= maxRetries) {
//                 if (!data && typeof window !== "undefined") {
//                     console.warn("CommonAPI: Proceeding without storeInit after timeout");
//                 }
//                 resolve(data);
//             } else {
//                 retries++;
//                 setTimeout(check, interval);
//             }
//         };
//         check();
//     });
// };

// export const getClientIpAddress = async () => {
//     try {
//         if (typeof window !== "undefined") {
//             const cachedIp = sessionStorage.getItem("clientIpAddress");
//             if (cachedIp) return cachedIp;
//         }

//         const res = await fetch("https://api.ipify.org?format=json");
//         const data = await res.json();
//         const ip = data?.ip || "";

//         if (typeof window !== "undefined" && ip) {
//             sessionStorage.setItem("clientIpAddress", ip);
//         }
//         return ip;
//     } catch (error) {
//         console.error("Error fetching IP address:", error);
//         return "";
//     }
// };

// export const CommonAPI = async (body) => {
//     try {
//         // 1. Robustly fetch storeInit for BOTH Client and Server
//         let storeInit = null;

//         if (typeof window !== 'undefined') {
//             storeInit = window.__STORE_INIT__ || getSession("storeInit");
//             if (!storeInit) {
//                 storeInit = await waitForStoreInit();
//             }
//         } else {
//             try {
//                 const { cookies } = await import("next/headers");
//                 const cookieStore = await cookies();
//                 const storeDataStr = cookieStore?.get("x-store-data")?.value;
//                 if (storeDataStr) {
//                     storeInit = JSON.parse(storeDataStr);
//                 }
//             } catch (err) {
//                 console.error("CommonAPI SSR Cookie Error:", err);
//             }
//         }

//         let requestApiUrl = APIURL;

//         if (storeInit && storeInit.ApiUrl) {
//             const baseUrl = storeInit?.ApiUrl?.replace(/\/$/, "");
//             requestApiUrl = `${baseUrl}/api/report`;
//             APIURL = requestApiUrl; // cache it globally for client
//         }

//         if (!requestApiUrl) {
//             requestApiUrl = await setApiUrl();
//         }

//         const ipAddress = await getClientIpAddress();
//         if (typeof FormData !== 'undefined' && body instanceof FormData) {
//             if (body.has("con")) {
//                 try {
//                     let conObj = JSON.parse(body.get("con"));
//                     conObj.IPAddress = ipAddress;
//                     body.set("con", JSON.stringify(conObj));
//                 } catch (e) {
//                     console.error("Error parsing FormData con:", e);
//                 }
//             }
//             if (body.has("IPAddress")) body.delete("IPAddress");
//         } else if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
//             if (body.con) {
//                 try {
//                     let conObj = typeof body.con === 'string' ? JSON.parse(body.con) : body.con;
//                     conObj.IPAddress = ipAddress;
//                     body.con = typeof body.con === 'string' ? JSON.stringify(conObj) : conObj;
//                 } catch (e) {
//                     console.error("Error parsing body.con:", e);
//                 }
//             }
//             if ("ipaddress" in body) delete body.ipaddress;
//         }

//         const YearCode = storeInit?.YearCode || "e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIxfX17e3NvbmFzb25zfX17e3NvbmFzb25zfX0=";
//         const Version = storeInit?.version || "NXT";
//         const token = storeInit?.token || "";
//         const sp = "54";
//         const sv = process.env.NODE_ENV === "development" ? "0" : "1";

//         const header = {
//             Authorization: `Bearer ${token}`,
//             Yearcode: YearCode,
//             Version,
//             sp,
//             sv,
//         };

//         const response = await axios.post(requestApiUrl, body, {
//             headers: header,
//             timeout: 30000
//         });

//         return response?.data || { Data: { rd: [] } };
//     } catch (error) {
//         console.error("CommonAPI Error:", error);
//         return {
//             Data: {
//                 rd: [{ stat: 0, stat_msg: "Network error or API failure" }]
//             }
//         };
//     }
// };
