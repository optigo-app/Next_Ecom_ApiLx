import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

/**
 * Saves a product detail page view into the website analytics (ERP).
 * Fire-and-forget: never throws, returns the first response row or null.
 */
export const SaveWebsiteAnalytics = async (visiterId, autocode, designno) => {
  try {
    const storeInit = (typeof window !== "undefined" && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession("storeInit");
    const loginInfo = getSession("loginUserDetail");
    const islogin = getSession("LoginUser");

    const isGuest = storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);
    const customerId = isGuest ? visiterId : (loginInfo?.id ?? 0);
    const customerEmail = isGuest ? visiterId : (loginInfo?.userid ?? "");

    const data = {
      FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo ?? 0}`,
      autocode: `${autocode ?? 0}`,
      designno: `${designno ?? 0}`,
      Customerid: `${customerId ?? 0}`,
    };

    const body = {
      con: `{\"id\":\"\",\"mode\":\"SaveWebsiteAnalytics\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
      f: "SaveLastViewDesign",
      p: JSON.stringify(data),
    };

    const res = await CommonAPI(body);
    return res?.Data?.rd?.[0] ?? null;
  } catch (error) {
    console.log("SaveWebsiteAnalyticsErr", error);
    return null;
  }
};

export default SaveWebsiteAnalytics;
