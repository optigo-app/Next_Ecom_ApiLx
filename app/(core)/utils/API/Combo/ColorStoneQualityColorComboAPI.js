

import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";



export const ColorStoneQualityColorComboAPI = async () => {
    let response;
    try {
        const storedEmail = getSession('registerEmail') || '';
        const storeInit = typeof window !== "undefined" && window.__STORE_INIT__ ? window.__STORE_INIT__ : getSession("storeInit");
        if (!storeInit) return null;
        const loginUserDetail = getSession("loginUserDetail") || "0";
        const FrontEnd_RegNo = storeInit?.FrontEnd_RegNo;
        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`, colorstonepricelistname: `${loginUserDetail?.colorstonepricelistname ?? storeInit?.colorstonepricelistname}`
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"CSQUALITYCOLORCOMBO\",\"appuserid\":\"${storedEmail}\"}`,
            "f": "indexPage (getColorStoneQualityData)",
            // "p": encodedCombinedValue,
            // "dp": combinedValue,
            "p": combinedValue,
        }

        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }
    return response;

}