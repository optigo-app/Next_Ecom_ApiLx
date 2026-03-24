import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const CartAndWishListAPI = async (type, obj, visiterId, type2 = "", stockno, isPair) => {
    // console.log('stockno in api: ', stockno);
    // console.log("type2", type2, obj)

    const islogin = getSession("LoginUser");
    const UserEmail = getSession("registerEmail");
    const storeInit = getSession('storeInit');
    const loginUserDetail = getSession("loginUserDetail");

    const customerId = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginUserDetail?.id ?? 0);
    const customerEmail = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginUserDetail?.userid ?? "");


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