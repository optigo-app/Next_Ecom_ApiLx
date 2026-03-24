import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const getSizeData = async (item, visiterId) => {
  try {
    const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
    const { FrontEnd_RegNo } = storeInit;
    const data = (typeof window !== 'undefined' && window.__LOGIN_USER_DETAIL__) ? window.__LOGIN_USER_DETAIL__ : getSession("loginUserDetail");
    const islogin = (typeof window !== 'undefined' && window.__LOGIN_USER__) ? window.__LOGIN_USER__ : getSession("LoginUser");

    const customerId = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (data?.id ?? 0);
    const customerEmail = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (data?.userid ?? "");

    const combinedValue = JSON.stringify({
      autocode: `${item?.autocode}`,
      FrontEnd_RegNo: `${FrontEnd_RegNo}`,
      Customerid: `${customerId}`,
      DomainForNo: `${storeInit?.DomainForNo ?? ""}`
    });
    const encodedCombinedValue = btoa(combinedValue);
    const body = {
      con: `{\"id\":\"\",\"mode\":\"CATEGORYSIZECOMBO\",\"appuserid\":\"${customerEmail}\"}`,
      f: "index (getSizeData)",
      // p: encodedCombinedValue,
      // dp:combinedValue
      "p": combinedValue
    };
    const response = await CommonAPI(body);
    return response
  } catch (error) {
    console.error("Error:", error);
  }
};