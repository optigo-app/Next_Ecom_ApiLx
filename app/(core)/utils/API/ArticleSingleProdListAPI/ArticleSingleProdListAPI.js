import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const SingleArticleProdListAPI = async (
  singprod,
  size = "",
  obj = {},
  visiterId,
  AlbumName = "",
) => {
  let storeinit = getSession("storeInit");
  let loginInfo = getSession("loginUserDetail");
  const islogin = getSession("LoginUser");

  const customerId =
    storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? visiterId
      : (loginInfo?.id ?? 0);
  const customerEmail =
    storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? visiterId
      : (loginInfo?.userid ?? "");



  const data = {
    PackageId: `${loginInfo?.PackageId ?? storeinit?.PackageId}`,
    autocode: `${singprod?.a ?? ""}`,
    FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
    Customerid: `${customerId ?? 0}`,
    designno: `${singprod?.b ?? ""}`,
    ArticleNo: `${singprod?.ArticleNo ?? ""}`,
    CurrencyRate: `${loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate}`,
    Metalid: `${obj?.mt == null ? (loginInfo?.MetalId ?? storeinit?.MetalId) : obj?.mt}`,
    DiaQCid: `${obj?.diaQc == null ? (loginInfo?.cmboDiaQCid ?? storeinit?.cmboDiaQCid) : obj?.diaQc}`,
    CsQCid: `${obj?.csQc == null ? (loginInfo?.cmboCSQCid ?? storeinit?.cmboCSQCid) : (obj?.csQc ?? "0,0")}`,
    Laboursetid: `${
      storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
        ? (storeinit?.pricemanagement_laboursetid ?? "")
        : (loginInfo?.pricemanagement_laboursetid ??
          storeinit?.pricemanagement_laboursetid ??
          "")
    }`,
    diamondpricelistname: `${
      storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
        ? (storeinit?.diamondpricelistname ?? "")
        : (loginInfo?.diamondpricelistname ??
          storeinit?.diamondpricelistname ??
          "")
    }`,
    colorstonepricelistname: `${
      storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
        ? (storeinit?.colorstonepricelistname ?? "")
        : (loginInfo?.colorstonepricelistname ??
          storeinit?.colorstonepricelistname ??
          "")
    }`,
    SettingPriceUniqueNo: `${
      storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
        ? (storeinit?.SettingPriceUniqueNo ?? "")
        : (loginInfo?.SettingPriceUniqueNo ??
          storeinit?.SettingPriceUniqueNo ??
          "")
    }`,
    IsStockWebsite: `${storeinit?.IsStockWebsite}`,
    Size: `${size}`,
    IsFromDesDet: 1,
    AlbumName: AlbumName ?? "",
    DomainForNo: `${storeinit?.DomainForNo ?? ""}`,
    WebDiscount: islogin ? `${loginInfo?.WebDiscount ?? 0}` : `${0}`,
    IsZeroPriceProductShow: `${storeinit?.IsZeroPriceProductShow ?? 0}`,
    IsSolitaireWebsite: `${storeinit?.IsSolitaireWebsite ?? 0}`,
  };

  let encData = JSON.stringify(data);

  let body = {
    con: `{\"id\":\"\",\"mode\":\"GETPRODUCTARTICLE\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    f: "(singleProdList)",
    // p: btoa(encData),
    // dp: encData,
    p: encData,
  };

  let pdList = [];
  let pdResp = [];
  let status = [];

  await CommonAPI(body).then((res) => {
    if (res) {
      // let pdData = res?.Data.rd;
      pdList = res?.Data.rd;
      pdResp = res?.Data;
      status = res;
    }
  });

  return { pdList, pdResp, status };
};
