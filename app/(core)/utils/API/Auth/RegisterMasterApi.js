import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const RegisterMasterApi = async (finalID) => {
    let response;
    try {
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const loginUserDetail = getSession('loginUserDetail') || '0';
        const islogin = getSession('LoginUser') ?? false;

        const { FrontEnd_RegNo } = storeInit || {};

        const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? finalID : loginUserDetail?.id ?? 0;
        const combinedValue = JSON.stringify({ FrontEnd_RegNo: `${FrontEnd_RegNo || ''}`, Customerid: `${customerId ?? 0}` });

        const body = {
            "con": "{\"id\":\"\",\"mode\":\"GetRegistrationFormCombo\",\"appuserid\":\"0\"}",
            "f": "RegisterMasterApi (GetRegistrationFormCombo)",
            "p": combinedValue,
        };
        response = await CommonAPI(body);
    } catch (error) {
        console.error('Error:', error);
    }
    const res = {
        Data: {
            rd: response?.Data
        }
    };
    return res;
};
