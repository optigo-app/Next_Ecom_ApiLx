import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const DiscountMasterAPI = async (finalID) => {
  let response;
  try {
    const storedEmail = getSession("registerEmail") || "";
    const storeInit = getSession("storeInit") ?? {};
    const { FrontEnd_RegNo } = storeInit;
    const combinedValue = JSON.stringify({
      FrontEnd_RegNo: `${FrontEnd_RegNo}`,
      Customerid: `${finalID}`,
    });

    const body = {
      con: `{\"id\":\"\",\"mode\":\"GetOffer\",\"appuserid\":\"${storedEmail}\"}`,
      f: "m-test2.orail.co.in (UpdateQuantity)",
      p: combinedValue,
    };

    response = await CommonAPI(body);
  } catch (error) {
    console.error("Error:", error);
  }
  return response;
};
