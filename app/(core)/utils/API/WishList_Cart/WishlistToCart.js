import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const handleWishlistToCartAPI = async (param, item, visiterId) => {
  const storeInit = getSession("storeInit");
  const data = getSession("loginUserDetail");
  const islogin = getSession("LoginUser");
  const { FrontEnd_RegNo } = storeInit;

  const isGuest =
    storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);

  const customerId = isGuest ? visiterId : (data?.id ?? 0);
  const customerEmail = isGuest ? visiterId : (data?.userid ?? "");

  const Policys = {
    Laboursetid: isGuest
      ? (storeInit?.pricemanagement_laboursetid ?? "")
      : (data?.pricemanagement_laboursetid ??
        storeInit?.pricemanagement_laboursetid ??
        ""),
    diamondpricelistname: isGuest
      ? (storeInit?.diamondpricelistname ?? "")
      : (data?.diamondpricelistname ?? storeInit?.diamondpricelistname ?? ""),
    colorstonepricelistname: isGuest
      ? (storeInit?.colorstonepricelistname ?? "")
      : (data?.colorstonepricelistname ??
        storeInit?.colorstonepricelistname ??
        ""),
    SettingPriceUniqueNo: isGuest
      ? (storeInit?.SettingPriceUniqueNo ?? "")
      : (data?.SettingPriceUniqueNo ?? storeInit?.SettingPriceUniqueNo ?? ""),
  };
  try {
    let combinedValue;
    if (param == "isSelectAll") {
      combinedValue = JSON.stringify({
        Cartidlist: "",
        ischeckall: "1",
        FrontEnd_RegNo: `${FrontEnd_RegNo ?? ""}`,
        Customerid: `${customerId ?? 0}`,
        WebDiscount: islogin ? `${data?.WebDiscount ?? 0}` : `${0}`,
        IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
        IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
        ...Policys,
      });
    } else {
      combinedValue = JSON.stringify({
        Cartidlist: `${item?.id ?? ""}`,
        ischeckall: "0",
        FrontEnd_RegNo: `${FrontEnd_RegNo ?? ""}`,
        Customerid: `${customerId ?? 0}`,
        WebDiscount: islogin ? `${data?.WebDiscount ?? 0}` : `${0}`,
        IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
        IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
        ...Policys,
      });
    }

    const body = {
      con: `{\"id\":\"Store\",\"mode\":\"ADDWISHLISTTOCART\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
      f: "MyWishList (GetWishList)",
      // p: btoa(combinedValue),
      // dp: combinedValue
      p: combinedValue,
    };
    const response = await CommonAPI(body);
    return response;
  } catch (error) {
    console.error("Error fetching cart details:", error);
    throw error;
  }
};
