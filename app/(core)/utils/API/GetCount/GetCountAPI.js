import { CommonAPI } from "../CommonAPI/CommonAPI"

export const GetCountAPI = async (visiterId) => {

    let storeInit = JSON.parse(sessionStorage.getItem("storeInit"))
    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"))
    let userEmail = sessionStorage.getItem("registerEmail")
    const islogin = JSON.parse(sessionStorage.getItem("LoginUser")) ?? false;

    const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginInfo?.id ?? 0;
    const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginInfo?.userid ?? 0;

    let data = {
        "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
        "Customerid": `${customerId ?? 0}`,
        IsPLW: storeInit?.IsPLW
    }

    let stringify = JSON.stringify(data)

    let body = {
        "con": `{\"id\":\"\",\"mode\":\"Getcount\",\"appuserid\":\"${customerEmail ?? ""}\"}`
        , "f": "zen (getCount)"
        // , "dp": stringify
        // , "p": btoa(stringify)
        , "p": stringify
    }

    let ReVal


    try {
        const res = await CommonAPI(body);
        ReVal = {
            ...(res?.Data?.rd[0] || {}),
            rd1: res?.Data?.rd1 || []
        };
        return ReVal;
    } catch (err) {
        console.log("GetCountErr", err);
        return null
    }

}