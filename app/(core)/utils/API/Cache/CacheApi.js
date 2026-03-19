import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const BookCache = async (visiterId, type, pricingContext, alc) => {
  const PackageId = pricingContext?.PackageId ?? "";
  const LabourSetId = pricingContext?.Laboursetid ?? "";
  const diamondpricelistname = pricingContext?.diamondpricelistname ?? "";
  const colorstonepricelistname = pricingContext?.colorstonepricelistname ?? "";
  const SettingPriceUniqueNo = pricingContext?.SettingPriceUniqueNo ?? "";
  const ACL = alc;

  let response;
  const storeInit = getSession("storeInit");
  const FrontEnd_RegNo = storeInit?.FrontEnd_RegNo;
  const loginUserDetail = getSession("loginUserDetail") || {};
  const islogin = getSession("LoginUser") ?? false;

  const isB2B = storeInit?.IsB2BWebsite === 0;
  const isGuest = !islogin;

  const customerEmail = isB2B && isGuest ? visiterId ?? "" : loginUserDetail?.userid ?? "";

  try {
    const combinedValue = JSON.stringify({
      FrontEnd_RegNo: FrontEnd_RegNo ?? "",
      EventName: type,
      PackageId: PackageId,
      Laboursetid: LabourSetId,
      diamondpricelistname: diamondpricelistname,
      colorstonepricelistname: colorstonepricelistname,
      SettingPriceUniqueNo: SettingPriceUniqueNo,
      ALC: ACL,
      ForEvt: "CacheRebuildDateSave"
    });
    const body = {
      con: `{"id":"","mode":"CacheRebuildDateSave","appuserid":"${customerEmail}"}`,
      f: "Cache (CacheRebuildDateSave)",
      p: combinedValue,
    };

    response = await CommonAPI(body);
    // Extract CacheRebuildDate from API response
    const cacheRebuildDate = response?.Data?.rd?.[0]?.CacheRebuildDate ?? null;
    return { response, CacheRebuildDate: cacheRebuildDate };
  } catch (error) {
    console.error("Error:", error);
    return { response: null, CacheRebuildDate: null };
  }
};

export const GetCacheList = async (visiterId) => {
  let response;

  const storeInit = getSession("storeInit");
  const FrontEnd_RegNo = storeInit?.FrontEnd_RegNo;
  const loginInfo = getSession("loginUserDetail") || {};
  const islogin = getSession("LoginUser") ?? false;

  const isB2B = storeInit?.IsB2BWebsite === 0;
  const isGuest = !islogin;

  const customerId = isB2B && isGuest ? visiterId ?? "" : loginInfo.id ?? 0;
  const customerEmail = isB2B && isGuest ? visiterId ?? "" : loginInfo?.userid ?? "";

  try {
    const combinedValue = JSON.stringify({
      FrontEnd_RegNo: FrontEnd_RegNo ?? "",
      Customerid: customerId ?? 0,
      ForEvt: "GetCacheRebuildDate"
    });

    const body = {
      con: `{"id":"","mode":"GetCacheRebuildDate","appuserid":"${customerEmail}"}`,
      f: "Cache (GetCacheRebuildDate)",
      p: combinedValue,
    };

    response = await CommonAPI(body);
  } catch (error) {
    console.error("Error:", error);
  }

  return response;
};
