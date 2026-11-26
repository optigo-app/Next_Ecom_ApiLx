import { CommonAPI } from "../CommonAPI/CommonAPI";
import { getOrCreateVisitorId } from "@/app/(core)/utils/VisitorId";
import { getPricingPolicyParams } from "@/app/(core)/utils/product/pricingPolicy";

export const fetchWishlistDetails = async (visiterId) => {
    let storeInit = null;
    try {
      storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    } catch {}
    const storedData = typeof window !== 'undefined' ? sessionStorage.getItem("loginUserDetail") : null;
    let islogin = false;
    try {
      islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
    } catch {}
    let data = null;
    try {
      data = JSON.parse(storedData);
    } catch {}

    let cleanVisiterId = visiterId;
    if (!cleanVisiterId || cleanVisiterId === "undefined" || cleanVisiterId === "null" || cleanVisiterId === "0") {
      cleanVisiterId = getOrCreateVisitorId(storeInit?.VisitorId);
    }

    const isGuest = storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);
    const rawCustomerId = isGuest ? cleanVisiterId : (data?.id ?? 0);
    const customerId = (rawCustomerId === "undefined" || rawCustomerId === "null" || rawCustomerId == null) ? (cleanVisiterId || 0) : rawCustomerId;
    const rawCustomerEmail = isGuest ? cleanVisiterId : (data?.userid ?? "");
    const customerEmail = (rawCustomerEmail === "undefined" || rawCustomerEmail === "null" || rawCustomerEmail == null) ? (cleanVisiterId || "") : rawCustomerEmail;
    const { FrontEnd_RegNo } = storeInit || {};

    let packageId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? storeInit?.PackageId : data?.PackageId ?? 0

    try {
        const combinedValue = JSON.stringify({
            PageNo: "1",
            PageSize: "1000",
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            Customerid: `${customerId}`,
            PackageId: packageId,
            ...getPricingPolicyParams({
                storeinit: storeInit,
                loginUserDetail: data,
                islogin,
            }),
            IsWishList: 1,
            IsPLW: storeInit?.IsPLW,
            CurrencyRate: `${data?.CurrencyRate ?? storeInit?.CurrencyRate}`,
            WebDiscount: islogin ? `${data?.WebDiscount ?? 0}` : `${0}`,
            IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
            IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"GetWishList\",\"appuserid\":\"${customerEmail}\"}`,
            f: "Header (getCartData)",
            // p: encodedCombinedValue,
            // dp: combinedValue
            p: combinedValue
        };

        const response = await CommonAPI(body);

        return response;
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};