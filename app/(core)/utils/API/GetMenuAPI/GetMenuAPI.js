import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";
import Cookies from "js-cookie";

export const GetMenuAPI = async (finalID) => {
  let response;
  try {
    const { getStoreInitData } = await import("../CommonAPI/CommonAPI");
    const storeInit = getStoreInitData();

    const { getSession } = await import("../../FetchSessionData");
    const email = getSession("registerEmail") ?? "";

    const userDetail = getSession("loginUserDetail");
    const visiterID = Cookies.get("visiterId");

    const validId =
      finalID !== undefined && finalID !== null && finalID !== "undefined" && finalID !== ""
        ? finalID
        : (userDetail?.id || visiterID || "0");

    const body = {
      con: `{\"id\":\"\",\"mode\":\"GETMENU\",\"appuserid\":\"${email}\"}`,
      f: "onload (GETMENU)",
      p: `{\"FrontEnd_RegNo\":\"${storeInit?.FrontEnd_RegNo}\",\"Customerid\":\"${validId}\"}`,
    };

    response = await CommonAPI(body);
  } catch (error) {
    console.error("Error:", error);
  }

  return response;
};