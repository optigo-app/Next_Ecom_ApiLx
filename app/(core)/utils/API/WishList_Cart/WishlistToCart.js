import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const handleWishlistToCartAPI = async (param, item, visiterId) => {
    const storeInit = getSession("storeInit");
    const data = getSession("loginUserDetail");
    const islogin = getSession("LoginUser");
    const { FrontEnd_RegNo } = storeInit;

    const isGuest = storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);

    const customerId = isGuest ? visiterId : (data?.id ?? 0);
    const customerEmail = isGuest ? visiterId : (data?.userid ?? "");

    try {
        let combinedValue;
        if (param == 'isSelectAll') {
            combinedValue = JSON.stringify({
                Cartidlist: '',
                ischeckall: "1",
                FrontEnd_RegNo: `${FrontEnd_RegNo ?? ""}`,
                Customerid: `${customerId ?? 0}`,
                WebDiscount: islogin ? `${data?.WebDiscount ?? 0}` : `${0}`,
                IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
                IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
            });
        } else {
            combinedValue = JSON.stringify({
                Cartidlist: `${item?.id ?? ""}`,
                ischeckall: "0",
                FrontEnd_RegNo: `${FrontEnd_RegNo ?? ""}`,
                Customerid: `${customerId ?? 0}`,
                WebDiscount: islogin ? `${data?.WebDiscount ?? 0}` : `${0}`,
                IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
                IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
            });
        }

        const body = {
            con: `{\"id\":\"Store\",\"mode\":\"ADDWISHLISTTOCART\",\"appuserid\":\"${customerEmail ?? ''}\"}`,
            f: "MyWishList (GetWishList)",
            // p: btoa(combinedValue),
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
