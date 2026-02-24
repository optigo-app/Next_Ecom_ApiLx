import { getDomainInfo } from "../../getDomainInfo";
import { fetchAPIUrlFromStoreInit } from "../../Glob_Functions/GlobalFunction";
import axios from "axios";
let APIURL = "";

const setApiUrl = async () => {
    try {
        const localHosts = ["localhost", "nxtsonasons.web", "nxthoq.web", "nxtmobileapp.web"];
        const { hostname } = await getDomainInfo();
        const cleanHost = hostname.split(":")[0];
    const isNgrok = cleanHost.endsWith(".ngrok-free.app") || cleanHost.endsWith(".ngrok.io");

        if (localHosts.includes(cleanHost) || isNgrok) {
            APIURL = "http://newnextjs.web//api/report";
        } else {
            APIURL = "https://apilx.optigoapps.com/api/report";
        }

        if (APIURL) {
            APIURL = APIURL;
        } else {
            throw new Error("API URL not found");
        }
    } catch (error) {
        console.error("Failed to fetch API URL:", error);
    }
};

setApiUrl();
export const CommonAPI = async (body) => {
    if (!APIURL) {
        await setApiUrl();
    }

    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));

    if (!storeInit) {
        throw new Error("StoreInit data not found in sessionStorage");
    }
    try {
        const YearCode = storeInit?.YearCode ?? "";
        const Version = "NXT" || (storeInit?.version ?? "");
        const token = storeInit?.token ?? "";
        const sp = "54";
        const sv = storeInit?.sv ?? "";

        const header = {
            Authorization: `Bearer ${token}`,
            Yearcode: !!YearCode ? YearCode : "e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIxfX17e3NvbmFzb25zfX17e3NvbmFzb25zfX0=",
            Version,
            sp,
            sv: !!sv ? 0 : 1,
        };
        const response = await axios.post(APIURL, body, { headers: header });
        return response?.data;
    } catch (error) {
        console.error("error is..", error);
    }
};
