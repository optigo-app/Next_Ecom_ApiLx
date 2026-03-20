import { getSession } from "../../FetchSessionData";
import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const CountryCodeListApi = async (finalID) => {

    let response;
    const domainname = wesbiteDomainName;
    try {
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const loginUserDetail = getSession('loginUserDetail') || '0';

        const islogin = getSession("LoginUser") ?? false;


        const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? finalID : loginUserDetail?.id ?? 0;
        const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? finalID : loginUserDetail?.userid ?? "";

        const { FrontEnd_RegNo } = storeInit;

        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${customerId ?? 0}`, domainname: domainname
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"COUNTRYCOMBO\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            "f": "Account (changePassword)",
            "p": combinedValue,

        }

        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }
    return response;

}