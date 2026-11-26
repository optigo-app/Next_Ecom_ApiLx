import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";
import { getPricingPolicyParams } from "@/app/(core)/utils/product/pricingPolicy";

export const SingleFullProdPriceAPI = async (obj, autocode) => {
  const storeInit = getSession("storeInit");
  const loginUserDetail = getSession("loginUserDetail");
  const islogin = getSession("LoginUser");
  const UserEmail = loginUserDetail?.userid ?? sessionStorage.getItem("registerEmail") ?? "";

  const GetPriceReq = {
    CurrencyRate: `${loginUserDetail?.CurrencyRate ?? storeInit?.CurrencyRate ?? ""}`,
    FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo ?? ""}`,
    Customerid: `${loginUserDetail?.id ?? 0}`,
    ...getPricingPolicyParams({
      storeinit: storeInit,
      loginUserDetail,
      islogin,
    }),
    designno: `${obj?.b ?? ""}`,
    IsFromDesDet: 1,
    AutoCodeList: `${obj?.a ?? ""}`,
    "WebDiscount": islogin ? `${loginUserDetail?.WebDiscount ?? 0}` : `${0}`,
    IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
    IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
  };

  let body = {
    con: `{\"id\":\"Store\",\"mode\":\"getdesignpricelist\",\"appuserid\":\"${UserEmail}\"}`,
    f: "onloadFirstTime (getdesignpricelist)",
    // p: btoa(JSON.stringify(GetPriceReq)),
    // dp: JSON.stringify(GetPriceReq),
    p: JSON.stringify(GetPriceReq),
  };

  let PriceApiData;

  await CommonAPI(body).then((res) => {
    PriceApiData = res?.Data;
  });

  return PriceApiData;
}