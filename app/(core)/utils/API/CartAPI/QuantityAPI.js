import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const updateQuantity = async (num, lastEnteredQuantity, visiterId) => {
  try {
    const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
    const { FrontEnd_RegNo } = storeInit;
    const storedData = sessionStorage.getItem("loginUserDetail");
    const islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
    const data = JSON.parse(storedData);
    const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data?.id ?? 0;
    const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data?.userid ?? "";

    const combinedValue = JSON.stringify({
      CartId: `${num}`,
      Quantity: `${lastEnteredQuantity}`,
      FrontEnd_RegNo: `${FrontEnd_RegNo}`,
      Customerid: `${customerId ?? 0}`,
    });
    const encodedCombinedValue = btoa(combinedValue);
    const body = {
      con: `{\"id\":\"\",\"mode\":\"UpdateQuantity\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
      f: "header (handleUpdateQuantity)",
      // p: encodedCombinedValue,
      // dp: combinedValue,
      "p": combinedValue
    };
    if (lastEnteredQuantity !== "") {
      const response = await CommonAPI(body);

      return response;
    } else {
      // toast.error("ERROR !!!,Please Check QTY");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

