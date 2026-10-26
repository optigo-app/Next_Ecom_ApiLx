import { getSession } from "../../FetchSessionData";
import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";


export const LoginWithCustomerCodeAlbumAPI = async (Customerid, userCookie = "") => {
    let response
    const domainname = wesbiteDomainName;
    try {
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo ?? ''}`,
            Token: `${userCookie ?? ''}`,
            Customerid: `${Customerid}`,
            DomainForNo: `${storeInit?.DomainForNo ?? ""}`, domainname: domainname
        });

        const body = {
            "con": "{\"id\":\"\",\"mode\":\"WEBLOGINFROMALB\"}",
            "f": "WEBLOGINFROMALB (handleSubmit)",
            "p": combinedValue

        };
        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }
    return response;
}
