import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const GetSinglePriceListApi = async (item) => {

  const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
  const loginUserDetail = getSession("loginUserDetail");
  const islogin = getSession("LoginUser");

  const customerId = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? 0 : (loginUserDetail?.id ?? 0);
  const customerEmail = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? "" : (loginUserDetail?.userid ?? "");

  const GetPriceReq = {
    "CurrencyRate": `${storeInit?.CurrencyRate ?? ""}`,
    "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo ?? ""}`,
    "Customerid": `${customerId ?? 0}`,
    "Laboursetid": `${storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeInit?.pricemanagement_laboursetid ?? ""
      : loginUserDetail?.pricemanagement_laboursetid ?? storeInit?.pricemanagement_laboursetid ?? ""
      }`,
    "diamondpricelistname": `${storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeInit?.diamondpricelistname ?? ""
      : loginUserDetail?.diamondpricelistname ?? storeInit?.diamondpricelistname ?? ""
      }`,
    "colorstonepricelistname": `${storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeInit?.colorstonepricelistname ?? ""
      : loginUserDetail?.colorstonepricelistname ?? storeInit?.colorstonepricelistname ?? ""
      }`,
    "SettingPriceUniqueNo": `${storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeInit?.SettingPriceUniqueNo ?? ""
      : loginUserDetail?.SettingPriceUniqueNo ?? storeInit?.SettingPriceUniqueNo ?? ""
      }`,
    "designno": item?.designno,
    "FilterKey": "",
    "FilterVal": "",
    "PageNo": "",
    "PageSize": "",
    "Metalid": "",
    "DiaQCid": "",
    "CsQCid": "",
    "IsFromDesDet": "1"
  }

  let body = {
    "con": `{\"id\":\"Store\",\"mode\":\"getdesignpricelist\",\"appuserid\":\"${customerEmail}\"}`,
    "f": "cartPagePriceApi (fullProdInfo)",
    // "p": btoa(JSON.stringify(GetPriceReq)),
    // "dp": JSON.stringify(GetPriceReq)
    "p": JSON.stringify(GetPriceReq)
  }

  let finalData;

  await CommonAPI(body).then((res) => {
    sessionStorage.setItem("fullProdInfo", JSON.stringify(res?.Data))
    finalData = res?.Data
  })

  return finalData

}