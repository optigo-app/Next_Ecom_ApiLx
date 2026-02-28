import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const GetMenuAPI = async (finalID) => {
    let response;
    try {
        const storeInit = getSession("storeInit") ?? "";
        const email = getSession("registerEmail") ?? "";
        const body = {
            con: `{\"id\":\"\",\"mode\":\"GETMENU\",\"appuserid\":\"${email}\"}`,
            f: "onload (GETMENU)",
            p: `{\"FrontEnd_RegNo\":\"${storeInit?.FrontEnd_RegNo}\",\"Customerid\":\"${finalID}\"}`
        }

        response = await CommonAPI(body);
    } catch (error) {
        console.error('Error:', error);
    }

    return response;

}