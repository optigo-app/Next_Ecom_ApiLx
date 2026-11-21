import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const CartAndWishListAPI = async (
  type,
  obj,
  visiterId,
  type2 = "",
  stockno,
  isPair,
) => {
  const islogin = getSession("LoginUser");
  const UserEmail = getSession("registerEmail");
  const storeInit = getSession("storeInit");
  const loginUserDetail = getSession("loginUserDetail");

  const customerId =
    (storeInit?.IsB2BWebsite == 0 && islogin == false) || islogin == null
      ? visiterId
      : (loginUserDetail?.id ?? 0);
  const customerEmail =
    (storeInit?.IsB2BWebsite == 0 && islogin == false) || islogin == null
      ? visiterId
      : (loginUserDetail?.userid ?? "");

  const isGuest =
    storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);

  const withDesignBaseFlag = (product) => ({
    ...product,
    IsDesignBaseWeb:
      product?.IsDesignBaseWeb === 1 || product?.IsDesignBaseWeb === "1" ? 1 : 0,
  });
  const addCartDetail = type2
    ? Array.isArray(obj)
      ? obj.map(withDesignBaseFlag)
      : withDesignBaseFlag(obj)
    : [withDesignBaseFlag(obj)];

  let FinalObj = {
    ForEvt: `${type}`,
    FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
    userid: `${customerEmail}`,
    Customerid: `${customerId ?? 0}`,
    IsPLW: `${storeInit?.IsPLW}`,
    AddCartDetail: addCartDetail,
    stockno: `${stockno ?? ""}`,
    isPair: `${isPair ?? ""}`,
    DomainForNo: `${storeInit?.DomainForNo ?? ""}`,
    WebDiscount: islogin ? `${loginUserDetail?.WebDiscount ?? 0}` : `${0}`,
    IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
    IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
    Laboursetid: isGuest
      ? (storeInit?.pricemanagement_laboursetid ?? "")
      : (loginUserDetail?.pricemanagement_laboursetid ??
        storeInit?.pricemanagement_laboursetid ??
        ""),
    diamondpricelistname: isGuest
      ? (storeInit?.diamondpricelistname ?? "")
      : (loginUserDetail?.diamondpricelistname ??
        storeInit?.diamondpricelistname ??
        ""),
    colorstonepricelistname: isGuest
      ? (storeInit?.colorstonepricelistname ?? "")
      : (loginUserDetail?.colorstonepricelistname ??
        storeInit?.colorstonepricelistname ??
        ""),
    SettingPriceUniqueNo: isGuest
      ? (storeInit?.SettingPriceUniqueNo ?? "")
      : (loginUserDetail?.SettingPriceUniqueNo ??
        storeInit?.SettingPriceUniqueNo ??
        ""),
  };

  let body = {
    con: `{\"id\":\"Store\",\"mode\":\"ADDTOCART\",\"appuserid\":\"${customerEmail}\"}`,
    f: "onloadFirstTime (getdesignpricelist)",
    // p: btoa(FinalObj),
    // dp: JSON.stringify(FinalObj),
    p: JSON.stringify(FinalObj),
  };

  let cartAndWishResp;
  await CommonAPI(body).then((res) => {
    cartAndWishResp = res;
  });

  return cartAndWishResp;
};
