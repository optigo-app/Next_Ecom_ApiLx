import { getSession } from "../../FetchSessionData";
import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";


export const LoginWithEmailCodeAPI = async (storedEmail) => {
    let response
    const domainname = wesbiteDomainName;
    try {
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const { FrontEnd_RegNo } = storeInit;

        const combinedValue = JSON.stringify({
            userid: storedEmail, FrontEnd_RegNo: FrontEnd_RegNo, domainname: domainname
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: "{\"id\":\"\",\"mode\":\"WEBSCEMAIL\"}",
            f: "LoginWithEmailCode (firstTimeOTP)",
            // p: encodedCombinedValue,
            // "dp": combinedValue,
            "p": combinedValue

        };
        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }
    return response;
}