import { getSession } from "../../FetchSessionData";
import { CommonAPI, getStoreInitData } from "../CommonAPI/CommonAPI";
import Cookies from "js-cookie";

export const GetMenuAPI = async (finalID) => {
  let response = { Data: { rd: [] } };
  try {
    let storeInit = getStoreInitData();
    if (!storeInit || !storeInit.FrontEnd_RegNo) {
      storeInit = getSession("storeInit") || (typeof window !== "undefined" ? window.__STORE_INIT__ : null);
    }

    const regNo = storeInit?.FrontEnd_RegNo || "";
    if (!regNo) {
      console.warn("GetMenuAPI: FrontEnd_RegNo not available yet.");
      return response;
    }

    const email = getSession("registerEmail") ?? "";
    const userDetail = getSession("loginUserDetail");
    const visiterID = Cookies.get("visiterId");

    let validId = "0";
    if (finalID && finalID !== "undefined" && finalID !== "null") {
      validId = String(finalID);
    } else if (userDetail?.id) {
      validId = String(userDetail.id);
    } else if (visiterID) {
      validId = String(visiterID);
    }

    const body = {
      con: JSON.stringify({ id: "", mode: "GETMENU", appuserid: email }),
      f: "onload (GETMENU)",
      p: JSON.stringify({ FrontEnd_RegNo: regNo, Customerid: validId }),
    };

    const res = await CommonAPI(body);
    if (res && res.Data) {
      response = res;
    }
  } catch (error) {
    console.error("GetMenuAPI Error:", error);
  }

  return response;
};