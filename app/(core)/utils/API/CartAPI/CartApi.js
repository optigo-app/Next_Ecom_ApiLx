import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";
import { getOrCreateVisitorId } from "@/app/(core)/utils/VisitorId";

export const fetchCartDetails = async (visiterId) => {
    let storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
    const data = getSession("loginUserDetail");
    const islogin = getSession("LoginUser");

    let cleanVisiterId = visiterId;
    if (!cleanVisiterId || cleanVisiterId === "undefined" || cleanVisiterId === "null" || cleanVisiterId === "0") {
      cleanVisiterId = getOrCreateVisitorId(storeInit?.VisitorId);
    }

    const isGuest = storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);

    const rawCustomerId = isGuest ? cleanVisiterId : (data?.id ?? 0);
    const customerId = (rawCustomerId === "undefined" || rawCustomerId === "null" || rawCustomerId == null) ? (cleanVisiterId || 0) : rawCustomerId;
    const rawCustomerEmail = isGuest ? cleanVisiterId : (data?.userid ?? "");
    const customerEmail = (rawCustomerEmail === "undefined" || rawCustomerEmail === "null" || rawCustomerEmail == null) ? (cleanVisiterId || "") : rawCustomerEmail;

    let packageId = isGuest ? (storeInit?.PackageId ?? 0) : (data?.PackageId ?? storeInit?.PackageId ?? 0);
    let laboursetid = isGuest ? (storeInit?.pricemanagement_laboursetid ?? "") : (data?.pricemanagement_laboursetid ?? storeInit?.pricemanagement_laboursetid ?? "");
    let diamondpricelistname = isGuest ? (storeInit?.diamondpricelistname ?? "") : (data?.diamondpricelistname ?? storeInit?.diamondpricelistname ?? "");
    let colorstonepricelistname = isGuest ? (storeInit?.colorstonepricelistname ?? "") : (data?.colorstonepricelistname ?? storeInit?.colorstonepricelistname ?? "");
    let SettingPriceUniqueNo = isGuest ? (storeInit?.SettingPriceUniqueNo ?? "") : (data?.SettingPriceUniqueNo ?? storeInit?.SettingPriceUniqueNo ?? "");

    try {
        const combinedValue = JSON.stringify({
            PageNo: "1",
            PageSize: "1000",
            CurrRate: "1",
            FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo ?? ""}`,
            Customerid: `${customerId ?? ""}`,
            PackageId: packageId,
            Laboursetid: laboursetid,
            diamondpricelistname: diamondpricelistname,
            colorstonepricelistname: colorstonepricelistname,
            SettingPriceUniqueNo: SettingPriceUniqueNo,
            IsWishList: 0,
            IsPLW: storeInit?.IsPLW,
            CurrencyRate: `${data?.CurrencyRate ?? storeInit?.CurrencyRate ?? ""}`,
            DomainForNo: `${storeInit?.DomainForNo ?? ""}`,
            WebDiscount: islogin ? `${data?.WebDiscount ?? 0}` : `${0}`,
            IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
            IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
        });

        const body = {
            con: `{\"id\":\"\",\"mode\":\"GetCart_Details\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "Header (getCartData)",
            // p: btoa(combinedValue),
            // dp: combinedValue
            "p": combinedValue
        };

        const response = await CommonAPI(body);
        return response;
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};
