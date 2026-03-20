import { getSession } from "../../FetchSessionData";
import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";


export const ResetPasswordAPI = async (email, hashedPassword) => {
    let response;
    const domainname = wesbiteDomainName;
    try {

        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const { FrontEnd_RegNo } = storeInit;
        const combinedValue = JSON.stringify({
            // userid: 'xoraxor802@fryshare.com', pass: `${hashedPassword}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0'
            userid: `${email}`, pass: `${hashedPassword}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0', domainname: domainname
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"resetpassword\",\"appuserid\":\"${email}\"}`,
            "f": "ForgotPassword (handleSubmit)",
            // "p": encodedCombinedValue,
            // "dp": combinedValue,
            "p": combinedValue
        }
        response = await CommonAPI(body);
    } catch (error) {
        console.error('Error:', error);
    }
    return response;
}