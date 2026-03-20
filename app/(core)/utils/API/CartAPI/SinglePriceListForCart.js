import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const GetSinglePriceListApi = async (item) => {

  const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
  const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"))
  const islogin = JSON.parse(sessionStorage.getItem("LoginUser"))
  const customerEmail = data?.userid ?? "";




  // let encodedFilter = {
  //   "DesignNo":item?.designno,
  //   "FilterKey":"",
  //   "FilterVal":"",
  //   "PageNo":"",
  //   "PageSize":"",
  //   "Metalid":"",
  //   "DiaQCid":"",
  //   "CsQCid":"",
  //   "IsFromDesDet":"1"
  // }

  const GetPriceReq = {
    "CurrencyRate": `${storeInit?.CurrencyRate}`,
    "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
    "Customerid": `${loginUserDetail?.id ?? 0}`,
    "Laboursetid": `${(storeInit?.IsB2BWebsite == 0 && (islogin == false)) ? storeInit?.pricemanagement_laboursetid : loginUserDetail?.pricemanagement_laboursetid}`,
    "diamondpricelistname": `${(storeInit?.IsB2BWebsite == 0 && (islogin == false)) ? storeInit?.diamondpricelistname : loginUserDetail?.diamondpricelistname}`,
    "colorstonepricelistname": `${(storeInit?.IsB2BWebsite == 0 && (islogin == false)) ? storeInit?.colorstonepricelistname : loginUserDetail?.colorstonepricelistname}`,
    "SettingPriceUniqueNo": `${(storeInit?.IsB2BWebsite == 0 && (islogin == false)) ? storeInit?.SettingPriceUniqueNo : loginUserDetail?.SettingPriceUniqueNo}`,
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

  const encodedCombinedValue = btoa(JSON.stringify(GetPriceReq));

  let body = {
    "con": `{\"id\":\"Store\",\"mode\":\"getdesignpricelist\",\"appuserid\":\"${customerEmail}\"}`,
    "f": "cartPagePriceApi (fullProdInfo)",
    // "p": encodedCombinedValue,
    // "dp":JSON.stringify(GetPriceReq)
    "p": JSON.stringify(GetPriceReq)
  }

  let finalData;

  await CommonAPI(body).then((res) => {
    sessionStorage.setItem("fullProdInfo", JSON.stringify(res?.Data))
    finalData = res?.Data
  })

  return finalData

}