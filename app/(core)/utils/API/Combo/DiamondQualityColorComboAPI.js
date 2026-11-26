import { getSession, getSessionAsync } from "../../FetchSessionData";
import { getPricingPolicyParams } from "../../product/pricingPolicy";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const DiamondQualityColorComboAPI = async (finalID) => {
    let response;

    try {
        const storedEmail = getSession("registerEmail") || "";
        const storeInit = typeof window !== "undefined" && window.__STORE_INIT__ ? window.__STORE_INIT__ : getSession("storeInit");

        const loginUserDetail = getSession("loginUserDetail") || "0";
        const { FrontEnd_RegNo } = storeInit;
        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            ...getPricingPolicyParams({
                storeinit: storeInit,
                loginUserDetail,
            }),
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"DIAQUALITYCOLORCOMBO\",\"appuserid\":\"${storedEmail ?? ""}\"}`,
            f: "header (getQualityColor)",
            p: combinedValue,
        };

        response = await CommonAPI(body);
    } catch (error) {
        console.error("Error:", error);
    }
    return response;
};
