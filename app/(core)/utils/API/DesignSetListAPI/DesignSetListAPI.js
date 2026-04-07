import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const DesignSetListAPI = async (obj, dno, visiterId) => {

  let storeinit = getSession('storeInit');
  let loginInfo = getSession("loginUserDetail");

  const islogin = getSession("LoginUser");

  const customerId = (storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginInfo?.id ?? 0);
  const customerEmail = (storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginInfo?.userid ?? "");

  let data = {
    PackageId: `${loginInfo?.PackageId ?? storeinit?.PackageId}`,
    FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
    Customerid: `${customerId ?? 0}`,
    CurrencyRate: `${(loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate) ?? ''}`,
    designno: `${dno}`,
    Metalid: `${obj?.mt == undefined ? (loginInfo?.MetalId ?? storeinit?.MetalId) : obj?.mt}`,
    DiaQCid: `${obj?.diaQc == undefined ? (loginInfo?.cmboDiaQCid ?? storeinit?.cmboDiaQCid) : obj?.diaQc}`,
    CsQCid: `${obj?.csQc == undefined ? (loginInfo?.cmboCSQCid ?? storeinit?.cmboCSQCid) : obj?.csQc}`,
    Laboursetid: `${storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeinit?.pricemanagement_laboursetid ?? ""
      : loginInfo?.pricemanagement_laboursetid ?? storeinit?.pricemanagement_laboursetid ?? ""
      }`,
    diamondpricelistname: `${storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeinit?.diamondpricelistname ?? ""
      : loginInfo?.diamondpricelistname ?? storeinit?.diamondpricelistname ?? ""
      }`,
    colorstonepricelistname: `${storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeinit?.colorstonepricelistname ?? ""
      : loginInfo?.colorstonepricelistname ?? storeinit?.colorstonepricelistname ?? ""
      }`,
    SettingPriceUniqueNo: `${storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeinit?.SettingPriceUniqueNo ?? ""
      : loginInfo?.SettingPriceUniqueNo ?? storeinit?.SettingPriceUniqueNo ?? ""
      }`,
    IsStockWebsite: `${storeinit?.IsStockWebsite}`,
    WebDiscount: islogin ? `${loginInfo?.WebDiscount ?? 0}` : `${0}`,
    IsZeroPriceProductShow: `${storeinit?.IsZeroPriceProductShow ?? 0}`,
    IsSolitaireWebsite: `${storeinit?.IsSolitaireWebsite ?? 0}`,
  }

  let encData = JSON.stringify(data)

  let body = {
    con: `{\"id\":\"\",\"mode\":\"GETDesignSet_List\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    f: "onlocationKey (designsetList)",
    // p: btoa(encData),
    // dp: encData,
    "p": encData,

  }

  let resp = []

  await CommonAPI(body).then((res) => {
    if (res) {
      resp = res
    }
  })

  return resp

}
