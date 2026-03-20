import { getSession } from "../../FetchSessionData";
import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";


export const RegisterAPI = async (firstName, lastName, email, mobileNo, hashedPassword, code, shortCode) => {

    let response;
    const domainname = wesbiteDomainName;
    try {
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const domainForNo = storeInit?.DomainForNo ?? "";
        const { FrontEnd_RegNo, IsB2BWebsite } = storeInit;
        const combinedValue = JSON.stringify({
            firstname: `${firstName}`, lastname: `${lastName}`, userid: `${(email).toLocaleLowerCase()}`, country_code: code ?? "", mobileno: `${mobileNo}`, pass: `${hashedPassword}`, IsB2BWebsite: `${IsB2BWebsite}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0', DomainForNo: domainForNo, domainname: domainname, CountryShortName: shortCode ?? "IND"
        });

        // const combinedValue = JSON.stringify({
        //     firstname: `${firstName}`, lastname: `${lastName}`, userid: `${(email).toLocaleLowerCase()}`, country_code: code ?? "", mobileno: `${mobileNo}`, pass: `${hashedPassword}`, IsB2BWebsite: `${IsB2BWebsite}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0', DomainForNo: domainForNo, domainname: domainname , Countrycodestate : shortCode ?? "IND"
        // });





        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": "{\"id\":\"\",\"mode\":\"WEBSIGNUP\"}",
            "f": "Register (handleSubmit)",
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