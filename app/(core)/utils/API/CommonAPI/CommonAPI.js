import { isLocalHost, localHosts } from "@/app/(core)/constants/DomainList";
import { getSession } from "../../FetchSessionData";
import { getDomainInfo } from "../../getDomainInfo";
import axios from "axios";

let APIURL = "";
let apiUrlPromise = null;

const setApiUrl = async () => {
    if (apiUrlPromise) return apiUrlPromise;

    apiUrlPromise = (async () => {
        try {
            const domainInfo = await getDomainInfo();
            const hostname = domainInfo?.hostname || "";
            const cleanHost = hostname.split(":")[0];

            if (isLocalHost(cleanHost)) {
                APIURL = "http://newnextjs.web//api/report";
                // APIURL = "https://apilx.optigoapps.com/api/report";

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

export const CommonAPI = async (body) => {
    try {
        if (!APIURL) {
            await setApiUrl();
        }

        let storeInit = getStoreInitData();

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

        const YearCode = storeInit?.YearCode || "e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIxfX17e3NvbmFzb25zfX17e3NvbmFzb25zfX0=";
        const Version = "NXT" || (storeInit?.version ?? "");
        const token = storeInit?.token ?? "";
        const sp = "54";
        const sv = storeInit?.sv ? 0 : 1;

        const header = {
            Authorization: `Bearer ${token}`,
            Yearcode: YearCode,
            Version,
            sp,
            sv: sv,
        };

        const response = await axios.post(APIURL, body, {
            headers: header,
            timeout: 30000 // 30 seconds timeout for robustness
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
