import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const SearchProductPrice = async ({ searchVar, autocodeList }) => {

  const storeInit = getSession("storeInit");
  const loginUserDetail = getSession("loginUserDetail");
  const islogin = getSession("LoginUser");

  const isGuest = storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);

  const customerEmail = isGuest ? "" : (loginUserDetail?.userid ?? "");

  let data = {
    CurrencyRate: `${loginUserDetail?.CurrencyRate ?? storeInit?.CurrencyRate ?? ""}`,
    FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo ?? ""}`,
    Customerid: `${loginUserDetail?.id ?? 0}`,
    Laboursetid: `${isGuest
        ? storeInit?.pricemanagement_laboursetid ?? ""
        : loginUserDetail?.pricemanagement_laboursetid ?? storeInit?.pricemanagement_laboursetid ?? ""
      }`,
    diamondpricelistname: `${isGuest
        ? storeInit?.diamondpricelistname ?? ""
        : loginUserDetail?.diamondpricelistname ?? storeInit?.diamondpricelistname ?? ""
      }`,
    colorstonepricelistname: `${isGuest
        ? storeInit?.colorstonepricelistname ?? ""
        : loginUserDetail?.colorstonepricelistname ?? storeInit?.colorstonepricelistname ?? ""
      }`,
    SettingPriceUniqueNo: `${isGuest
        ? storeInit?.SettingPriceUniqueNo ?? ""
        : loginUserDetail?.SettingPriceUniqueNo ?? storeInit?.SettingPriceUniqueNo ?? ""
      }`,
    "Metalid": `${loginUserDetail?.Metalid ?? storeInit?.MetalId ?? ""}`,
    "DiaQCid": `${loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid ?? ""}`,
    "CsQCid": `${loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid ?? ""}`,
    "SearchKey": `${searchVar ?? ""}`,
    "AutoCodeList": `${autocodeList ?? ""}`,
    "WebDiscount": islogin ? `${loginUserDetail?.WebDiscount ?? 0}` : `${0}`,
    IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
    IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
  }

  let encData = JSON.stringify(data)

  let body = {
    "con": `{\"id\":\"Store\",\"mode\":\"getdesignpricelist\",\"appuserid\":\"${customerEmail}\"}`,
    "f": "onloadFirstTime (getdesignpricelist)",
    // "p": btoa(encData),
    // "dp": encData
    p: encData
  }

  let PriceApiData;

  await CommonAPI(body).then((res) => {
    PriceApiData = res?.Data;
  });

  return PriceApiData;

}
