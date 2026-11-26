import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";
import { getPricingPolicyParams } from "@/app/(core)/utils/product/pricingPolicy";

export const ApplyGiftCoupon = async (visiterId, discountCode) => {
    let storeInit = getSession("storeInit");
    const storedData = getSession("loginUserDetail");
    const islogin = getSession("LoginUser");
    const data = storedData;
    const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data?.id ?? 0;
    const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data?.userid ?? "";

    let packageId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? storeInit?.PackageId : data?.PackageId ?? 0;

    try {
        const combinedValue = JSON.stringify({
            PageNo: "1",
            PageSize: "1000",
            CurrRate: "1",
            FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}` ?? '',
            Customerid: `${customerId ?? ""}`,
            PackageId: packageId,
            ...getPricingPolicyParams({
                storeinit: storeInit,
                loginUserDetail: data,
                islogin,
            }),
            IsWishList: 0,
            IsPLW: storeInit?.IsPLW,
            CurrencyRate: `${data?.CurrencyRate ?? storeInit?.CurrencyRate}`,
            DomainForNo: `${storeInit?.DomainForNo ?? ""}`,
            WebDiscount: islogin ? `${data?.WebDiscount ?? 0}` : `${0}`,
            IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
            IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
            DiscountCode: `${discountCode ?? ""}`,
        });

        const body = {
            con: `{\"id\":\"\",\"mode\":\"ApplyGiftCoupon\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "Header (ApplyGiftCoupon)",
            p: combinedValue,
        };

        const response = await CommonAPI(body);

        return response;
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};
