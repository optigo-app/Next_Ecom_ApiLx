import { getSession, getSessionAsync } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const DiamondQualityColorComboAPI = async (finalID) => {
    let response;

    try {
        const storedEmail = getSession("registerEmail") || "";
        const storeInit = typeof window !== "undefined" && window.__STORE_INIT__ ? window.__STORE_INIT__ : getSession("storeInit");
        
        const loginUserDetail = await getSessionAsync("loginUserDetail") || "0";
        const { FrontEnd_RegNo } = storeInit;
        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            diamondpricelistname: `${loginUserDetail?.diamondpricelistname ?? storeInit?.diamondpricelistname}`,
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"DIAQUALITYCOLORCOMBO\",\"appuserid\":\"${storedEmail ?? ""}\"}`,
            f: "header (getQualityColor)",
            p: combinedValue,
            // "p": encodedCombinedValue,
            // "dp": combinedValue,
        };

        response = await CommonAPI(body);
    } catch (error) {
        console.error("Error:", error);
    }
    return response;
};
