import { LocalSetup } from "@/app/env";
import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const updateCartAPI = async (updatedItems, metalID, metalCOLORID, diaIDData, colorStoneID, sizeId, markupData, finalPrice, finalPriceWithMarkup, ObjExtra, articleSelection) => {
    try {
        const islogin = getSession("LoginUser");
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
        const loginUserDetail = getSession("loginUserDetail") || {};
        const cleanValue = (value) => {
            if (value === null || value === undefined) return "";
            const normalized = String(value).trim();
            return normalized === "null" || normalized === "undefined" ? "" : normalized;
        };
        const UserEmail = cleanValue(loginUserDetail?.userid) || cleanValue(getSession("registerEmail"));

        // console.log('jbjasd--', updatedItems, metalID, metalCOLORID, diaIDData, colorStoneID, sizeId, markupData, finalPrice, finalPriceWithMarkup);

        const IsElvee = LocalSetup === "elvee.web";
        const combinedValue = JSON.stringify({
            ForEvt: "Cart",
            FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo ?? ""}`,
            userid: UserEmail,
            Customerid: `${loginUserDetail?.id ?? 0}`,
            AddCartDetail: [
                {
                    "CartId": `${updatedItems?.id}`,
                    ...(articleSelection && {
                        ArticleId: `${articleSelection?.ArticleId ?? ""}`,
                        ArticleNo: `${articleSelection?.ArticleNo ?? ""}`,
                    }),
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
                    ...(IsElvee && {
                        ...ObjExtra
                    })
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

