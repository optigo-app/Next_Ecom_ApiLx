import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const SaveWebsiteAnalytics = async (finalID) => {
  let response;
  try {
    const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');

    const email = getSession("registerEmail") ?? "";
    const islogin = getSession("LoginUser");
    const loginUserDetail = getSession("loginUserDetail");
    let packageId = (storeInit?.IsB2BWebsite == 0 && islogin == false) || islogin == null ? storeInit?.PackageId : loginUserDetail?.PackageId ?? 0;

    const body = {
      con: `{\"id\":\"\",\"mode\":\"SaveWebsiteAnalytics\",\"appuserid\":\"${email}\"}`,
      f: "onload (GETMENU SETUP)",
      p: `{\"FrontEnd_RegNo\":\"${storeInit?.FrontEnd_RegNo}\",\"autocode\":\"${finalID}\",\"designno\":\"${packageId}\",\"Customerid\":${storeInit?.Customerid}}`,
    };
    response = await CommonAPI(body);
  } catch (error) {
    console.error("Error:", error);
  }

  return response;
};

