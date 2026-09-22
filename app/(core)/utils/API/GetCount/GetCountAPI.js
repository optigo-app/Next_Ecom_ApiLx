import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { CommonAPI } from "@/app/(core)/utils/API/CommonAPI/CommonAPI";
import Cookies from "js-cookie";

/**
 * Normalizes an autocode: trims and strips left-padded zeros for numeric codes
 * so "0001695" and "1695" resolve to the same key.
 */
const normalizeAutocode = (value) => {
    if (value == null) return null;
    const s = String(value).trim();
    if (s === "") return null;
    return !isNaN(s) ? String(Number(s)) : s;
};

/**
 * Normalizes an ArticleNo: trims and returns null for empty/null values.
 */
const normalizeArticle = (value) => {
    if (value == null) return null;
    const s = String(value).trim();
    return s === "" ? null : s;
};

/**
 * Builds the precise composite key for a cart/wishlist item.
 * - autocode + ArticleNo  -> "autocode|ArticleNo" (variant-exact)
 * - autocode only         -> "autocode|" (design-level entry, no article)
 * One autocode can have multiple ArticleNos; ArticleNo is unique per variant,
 * so the composite key guarantees per-variant accuracy.
 */
export const getCartWishKey = (item = {}) => {
    const auto = normalizeAutocode(item?.autocode);
    const article = normalizeArticle(item?.ArticleNo);
    if (!auto && !article) return null;
    return `${auto ?? ""}|${article ?? ""}`;
};

/**
 * Robust presence lookup for a product against a cart/wish map.
 * Checks the variant-exact composite key first, then the design-level
 * (article-less) key. Falls back to the provided flag (e.g. IsInCart === 1)
 * only when the map has not yet been hydrated from GetCountAPI.
 */
export const isItemInMap = (map, item = {}, fallback = false) => {
    if (!map || typeof map !== "object") return Boolean(fallback);
    const auto = normalizeAutocode(item?.autocode);
    const article = normalizeArticle(item?.ArticleNo);

    const compositeKey = auto || article ? `${auto ?? ""}|${article ?? ""}` : null;
    if (compositeKey && map[compositeKey] !== undefined) return Boolean(map[compositeKey]);

    // Design-level entry (rd1 rows where ArticleNo is null) applies to any variant
    if (auto && article && map[`${auto}|`] !== undefined) return Boolean(map[`${auto}|`]);

    if (map.__hydrated) return false;
    return Boolean(fallback);
};

/**
 * Converts rd1 array from GetCountAPI into quick-lookup maps for Cart and Wishlist.
 * - IsWishList === 1 -> in Wishlist
 * - IsWishList === 0 -> in Cart
 * - Item not present -> in neither
 * Precise composite keys ("autocode|ArticleNo") are the source of truth;
 * legacy plain keys (autocode/ArticleNo/designno) are kept for themes that
 * still read the maps directly.
 */
export const buildCartAndWishMaps = (rd1Array = []) => {
    const newCartObj = { __hydrated: true };
    const newWishObj = { __hydrated: true };
    if (Array.isArray(rd1Array)) {
        rd1Array.forEach((item) => {
            const isWish = Number(item?.IsWishList) === 1;
            const isCart = Number(item?.IsWishList) === 0;
            if (!isWish && !isCart) return;

            const preciseKey = getCartWishKey(item);

            const autocodeKey = item?.autocode != null && item?.autocode !== "" ? String(item.autocode) : null;
            const unpaddedAutocode = normalizeAutocode(item?.autocode);
            const articleKey = normalizeArticle(item?.ArticleNo);
            const designKey = item?.designno != null && item?.designno !== "" ? String(item.designno) : null;

            const keys = [preciseKey, autocodeKey, unpaddedAutocode, articleKey, designKey].filter(Boolean);

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
