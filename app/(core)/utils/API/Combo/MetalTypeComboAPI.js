import { getSession, getSessionAsync } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const MetalTypeComboAPI = async (finalID) => {
    let response;
    try {
        const storeInit = typeof window !== "undefined" && window.__STORE_INIT__ ? window.__STORE_INIT__ : getSession("storeInit");
        const loginUserDetail = getSession("loginUserDetail") || "0";
        const islogin = getSession("LoginUser") ?? false;

        const customerId = (storeInit?.IsB2BWebsite == 0 && islogin == false) || islogin == null ? finalID : (loginUserDetail?.id ?? 0);
        const customerEmail = (storeInit?.IsB2BWebsite == 0 && islogin == false) || islogin == null ? finalID : (loginUserDetail?.userid ?? "");

        const { FrontEnd_RegNo } = storeInit;

        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            Customerid: `${customerId ?? 0}`,
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"METALTYPECOMBO\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "Account (changePassword)",
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
