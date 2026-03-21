
import axios from "axios";
import { getSession } from "../../FetchSessionData";
import { getDomainInfo } from "../../getDomainInfo";
import { isLocalHost } from "@/app/(core)/constants/DomainList";

let APIURL = '';

const setApiUrl = async () => {
  try {
    const { hostname } = await getDomainInfo();
    const cleanHost = hostname.split(":")[0];

    if (isLocalHost(cleanHost)) {
      APIURL = "http://newnextjs.web/api/report";
      // APIURL = "https://apilx.optigoapps.com/api/report";

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

export const CommonFileAPI = async (body, isUpload = false) => {
    if (!APIURL) {
        await setApiUrl();
    }

    const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');


    if (!storeInit) {
        throw new Error('StoreInit data not found in sessionStorage');
    }
    try {
        const YearCode = storeInit?.YearCode ?? '';
        const version = storeInit?.version ?? '';
        const token = storeInit?.token ?? '';
        const sv = storeInit?.sv ?? '';

      

        let finalURL = APIURL;
        let ContentType = "application/json";
        if (isUpload && APIURL?.includes("report")) {
            finalURL = APIURL.replace("report", "upload");
            ContentType = "multipart/form-data";
        }
          const header = {
            "Content-Type": ContentType,
            Authorization: `Bearer ${token}`,
            Yearcode: YearCode,
            Version: "NXT",
            sp: "54",
            sv: !!sv ? 0 : 1,
        };

        const response = await axios.post(finalURL, body, { headers: header });
        return response?.data;

    } catch (error) {
        console.error('error is..', error);
    }
};

