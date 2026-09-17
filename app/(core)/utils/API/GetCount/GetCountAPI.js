import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { CommonAPI } from "@/app/(core)/utils/API/CommonAPI/CommonAPI";
import Cookies from "js-cookie";

/**
 * Converts rd1 array from GetCountAPI into quick-lookup maps for Cart and Wishlist.
 * - IsWishList === 1 -> in Wishlist
 * - IsWishList === 0 -> in Cart
 */
export const buildCartAndWishMaps = (rd1Array = []) => {
    const newCartObj = {};
    const newWishObj = {};
    if (Array.isArray(rd1Array)) {
        rd1Array.forEach((item) => {
            const isWish = Number(item?.IsWishList) === 1;
            const isCart = Number(item?.IsWishList) === 0;

            const autocodeKey = item?.autocode != null && item?.autocode !== "" ? String(item.autocode) : null;
            const unpaddedAutocode = item?.autocode != null && !isNaN(item.autocode) ? String(Number(item.autocode)) : null;
            const articleKey = item?.ArticleNo != null && item?.ArticleNo !== "" ? String(item.ArticleNo) : null;
            const designKey = item?.designno != null && item?.designno !== "" ? String(item.designno) : null;

            const keys = [autocodeKey, unpaddedAutocode, articleKey, designKey].filter(Boolean);

            keys.forEach((key) => {
                if (isWish) {
                    newWishObj[key] = true;
                } else if (isCart) {
                    newCartObj[key] = true;
                }
            });
        });
    }
    return { newCartObj, newWishObj };
};

export const GetCountAPI = async (visiterId) => {
    let storeInit = getSession("storeInit");
    let loginInfo = getSession("loginUserDetail");
    const islogin = getSession("LoginUser") ?? false;

    const visitor = visiterId || Cookies.get("visiterId") || "";
    const customerId = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visitor : (loginInfo?.id ?? 0);
    const customerEmail = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visitor : (loginInfo?.userid ?? "");

    let data = {
        "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo ?? ""}`,
        "Customerid": `${customerId ?? 0}`,
        IsPLW: storeInit?.IsPLW ?? 0
    };

    let stringify = JSON.stringify(data);

    let body = {
        "con": `{\"id\":\"\",\"mode\":\"Getcount\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
        "f": "zen (getCount)",
        "p": stringify
    };

    try {
        const res = await CommonAPI(body);
        const ReVal = {
            ...(res?.Data?.rd[0] || {}),
            rd1: res?.Data?.rd1 || []
        };
        return ReVal;
    } catch (err) {
        console.log("GetCountErr", err);
        return null;
    }
};