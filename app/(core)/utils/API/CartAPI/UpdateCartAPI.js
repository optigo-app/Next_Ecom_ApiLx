import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const updateCartAPI = async (updatedItems, metalID, metalCOLORID, diaIDData, colorStoneID, sizeId, markupData, finalPrice, finalPriceWithMarkup) => {
    try {
        const islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const { FrontEnd_RegNo } = storeInit;
        const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"))
        const UserEmail = sessionStorage.getItem("registerEmail")

        // console.log('jbjasd--', updatedItems, metalID, metalCOLORID, diaIDData, colorStoneID, sizeId, markupData, finalPrice, finalPriceWithMarkup);

        const combinedValue = JSON.stringify({
            ForEvt: "Cart",
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            userid: `${UserEmail}`,
            Customerid: `${loginUserDetail?.id ?? 0}`,
            AddCartDetail: [
                {
                    "CartId": `${updatedItems?.id}`,
                    "Metalid": metalID ?? 0,
                    "MetalColorId": metalCOLORID ?? 0,
                    "DiaQCid": `${diaIDData}` ?? "0,0",
                    "CsQCid": `${colorStoneID}` ?? "0,0",
                    "Size": `${sizeId ?? 0}`,
                    "Unitcost": `${updatedItems?.FinalCost ?? 0}`,
                    "markup": `${updatedItems?.SizeMarkUp ?? 0}`,
                    "UnitCostWithmarkup": `${updatedItems?.UnitCostWithMarkUp ?? 0}`,
                    "WebDiscount": islogin ? `${loginUserDetail?.WebDiscount ?? 0}` : `${0}`,
                    IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
                    IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
                }],
            DomainForNo: `${storeInit?.DomainForNo ?? ""}`
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"CartCustomize\",\"appuserid\":\"${UserEmail ?? ""}\"}`,
            f: "header (handleUpdateCart)",
            // p: encodedCombinedValue,
            // dp: combinedValue,
            "p": combinedValue
        };

        const response = await CommonAPI(body);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

