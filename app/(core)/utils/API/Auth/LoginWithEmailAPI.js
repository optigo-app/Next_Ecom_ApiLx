import { getSession } from "../../FetchSessionData";
import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";


export const LoginWithEmailAPI = async (email, mobileNo, hashedPassword, ismobiletoke, userCookie, visiterId) => {
    let response
    const domainname = wesbiteDomainName;
    try {
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const combinedValue = JSON.stringify({
            userid: `${email}` ?? '', mobileno: mobileNo ?? '', pass: `${hashedPassword}` ?? '', mobiletoken: ismobiletoke ?? '', FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo ?? ''}`, Token: `${userCookie ?? ''}`,
            IsPLW: `${storeInit?.IsPLW ?? ''}`, ...(storeInit?.IsB2BWebsite === 0 && { Customerid: visiterId }), DomainForNo: `${storeInit?.DomainForNo ?? ""}`, domainname: domainname
        });

        // const combinedValue = JSON.stringify({
        //     userid: `${email}`, mobileno: mobileNo, pass: `${hashedPassword}`, mobiletoken: ismobiletoke, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Token: `${userCookie ?? ''}`,
        //     IsPLW: `${storeInit?.IsPLW}`
        // });

        // console.log(combinedValue, "combinedValue")
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": "{\"id\":\"\",\"mode\":\"WEBLOGIN\"}",
            "f": "LoginWithEmail (handleSubmit)",
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