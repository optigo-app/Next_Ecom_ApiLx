import { getSession } from "../../FetchSessionData";
import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";


export const ContinueWithEmailAPI = async (trimmedEmail) => {

    let response
    const domainname = wesbiteDomainName;

    try {
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const domainForNo = storeInit?.DomainForNo ?? "";
        const { FrontEnd_RegNo, IsB2BWebsite } = storeInit;
        const combinedValue = JSON.stringify({
            userid: `${(trimmedEmail).toLocaleLowerCase()}`, IsB2BWebsite: `${IsB2BWebsite}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0', DomainForNo: domainForNo, domainname: domainname
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": "{\"id\":\"\",\"mode\":\"WEBVALDNEMAIL\"}",
            "f": "emilValid (handleEmail)",
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