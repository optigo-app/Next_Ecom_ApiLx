import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const StockItemApi = async (ac, type, obj = {}, visiterId) => {
  let storeInit = getSession('storeInit');
  let loginUserDetail = getSession("loginUserDetail");
  let islogin = getSession("LoginUser");

  const customerId = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginUserDetail?.id ?? 0);
  const customerEmail = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginUserDetail?.userid ?? "");


  let data = {
    FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
    autocode: `${ac ?? ""}`,
    Customerid: `${customerId ?? 0}`,
    Laboursetid: `${storeInit?.IsB2BWebsite == 0 && islogin == false
      ? storeInit?.pricemanagement_laboursetid
      : loginUserDetail?.pricemanagement_laboursetid
      }`,
    diamondpricelistname: `${storeInit?.IsB2BWebsite == 0 && islogin == false
      ? storeInit?.diamondpricelistname
      : loginUserDetail?.diamondpricelistname
      }`,
    colorstonepricelistname: `${storeInit?.IsB2BWebsite == 0 && islogin == false
      ? storeInit?.colorstonepricelistname
      : loginUserDetail?.colorstonepricelistname
      }`,
    SettingPriceUniqueNo: `${storeInit?.IsB2BWebsite == 0 && islogin == false
      ? storeInit?.SettingPriceUniqueNo
      : loginUserDetail?.SettingPriceUniqueNo
      }`,
  }
  let data1 = {
    FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
    autocode: `${ac ?? ""}`,
    Customerid: `${customerId ?? 0}`,
    Metalid: `${obj?.mt == undefined ? (loginUserDetail?.MetalId ?? storeInit?.MetalId) : obj?.mt}`,
    DiaQCid: `${obj?.diaQc == undefined ? (loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid) : obj?.diaQc}`,
    CsQCid: `${obj?.csQc == undefined ? (loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid) : obj?.csQc}`,
    Laboursetid: `${storeInit?.IsB2BWebsite == 0 && islogin == false
      ? storeInit?.pricemanagement_laboursetid
      : loginUserDetail?.pricemanagement_laboursetid
      }`,
    diamondpricelistname: `${storeInit?.IsB2BWebsite == 0 && islogin == false
      ? storeInit?.diamondpricelistname
      : loginUserDetail?.diamondpricelistname
      }`,
    colorstonepricelistname: `${storeInit?.IsB2BWebsite == 0 && islogin == false
      ? storeInit?.colorstonepricelistname
      : loginUserDetail?.colorstonepricelistname
      }`,
    SettingPriceUniqueNo: `${storeInit?.IsB2BWebsite == 0 && islogin == false
      ? storeInit?.SettingPriceUniqueNo
      : loginUserDetail?.SettingPriceUniqueNo
      }`,
  }

  let encData = (type === "similarbrand" ? JSON.stringify(data1) : JSON.stringify(data))

  let body = {
    con: `{\"id\":\"\",\"mode\":\"${type === "stockitem" ? "GETStockItem" : "GETSimilar"}\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    f: "(singleProdList)",
    // p:btoa(encData),
    // dp: encData,
    p: encData
  };

  let resp;
  await CommonAPI(body).then((res) => {
    if (res) {
      resp = res;
    }
  })
  return resp;
}
