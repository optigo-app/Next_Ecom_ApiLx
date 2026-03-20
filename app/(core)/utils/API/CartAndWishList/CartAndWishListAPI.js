import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const CartAndWishListAPI = async (type, obj, visiterId, type2 = "", stockno, isPair) => {
    // console.log('stockno in api: ', stockno);
    // console.log("type2", type2, obj)

    const islogin = JSON.parse(sessionStorage.getItem("LoginUser")) ?? false;
    const UserEmail = sessionStorage.getItem("registerEmail");
    const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
    const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));

    const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginUserDetail.id ?? 0;
    const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginUserDetail?.userid ?? "";


    let FinalObj = {
        "ForEvt": `${type}`,
        "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
        "userid": `${customerEmail}`,
        "Customerid": `${customerId ?? 0}`,
        "IsPLW": `${storeInit?.IsPLW}`,
        "AddCartDetail": type2 ? obj : [obj],
        "stockno": `${stockno ?? ""}`,
        "isPair": `${isPair ?? ""}`,
        "DomainForNo": `${storeInit?.DomainForNo ?? ""}`,
        "WebDiscount": islogin ? `${loginUserDetail?.WebDiscount ?? 0}` : `${0}`,
        "IsZeroPriceProductShow": `${storeInit?.IsZeroPriceProductShow ?? 0}`,
        "IsSolitaireWebsite": `${storeInit?.IsSolitaireWebsite ?? 0}`,
    }

    let body = {
        con: `{\"id\":\"Store\",\"mode\":\"ADDTOCART\",\"appuserid\":\"${customerEmail}\"}`,
        f: "onloadFirstTime (getdesignpricelist)",
        // p: btoa(FinalObj),
        // dp: JSON.stringify(FinalObj),
        p: JSON.stringify(FinalObj)
    };



    let cartAndWishResp;
    await CommonAPI(body).then((res) => {
        cartAndWishResp = res;
    });

    return cartAndWishResp;
}