import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { CommonAPI } from "@/app/(core)/utils/API/CommonAPI/CommonAPI";
import Cookies from "js-cookie";
import { getOrCreateVisitorId } from "@/app/(core)/utils/VisitorId";

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

const normalizeVariantValue = (value, fallback = "0") => {
    if (value == null || String(value).trim() === "") return fallback;
    return String(value).trim().toLowerCase();
};

/**
 * Builds a design-based cart key from the selected customization dimensions.
 * Unlike ArticleNo, this distinguishes multiple metal/stone/size variants of
 * the same design.
 */
export const getDesignBaseCartWishKey = (item = {}) => {
    const auto = normalizeAutocode(item?.autocode);
    if (!auto) return null;

    const diaQc = String(item?.DiaQCid ?? "").split(",");
    const metalTypeId = item?.metaltypeid ?? item?.MetalTypeId ?? item?.Metalid ?? item?.MetalPurityid;
    const metalColorId = item?.metalcolorid ?? item?.MetalColorId ?? item?.MetalColorid;
    const diamondQualityId = item?.diamondqualityid ?? item?.DiamondQualityId ?? diaQc[0];
    const diamondColorId = item?.diamondcolorid ?? item?.DiamondColorId ?? diaQc[1];
    const size = item?.DesignSize ?? item?.Size ?? item?.size;

    return [
        auto,
        "designbase",
        normalizeVariantValue(metalTypeId),
        normalizeVariantValue(metalColorId),
        normalizeVariantValue(diamondQualityId),
        normalizeVariantValue(diamondColorId),
        normalizeVariantValue(size, ""),
    ].join("|");
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

/** Looks up a design-based cart/wishlist entry by its selected variant. */
export const isDesignBaseItemInMap = (map, item = {}, fallback = false) => {
    if (!map || typeof map !== "object") return Boolean(fallback);
    const designBaseKey = getDesignBaseCartWishKey(item);
    if (designBaseKey && map[designBaseKey] !== undefined) {
        return Boolean(map[designBaseKey]);
    }
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
            const isDesignBaseItem =
                Number(item?.IsDesignBaseWeb ?? item?.IsCustomize) === 1;
            const designBaseKey = isDesignBaseItem
                ? getDesignBaseCartWishKey(item)
                : null;

            const autocodeKey = item?.autocode != null && item?.autocode !== "" ? String(item.autocode) : null;
            const unpaddedAutocode = normalizeAutocode(item?.autocode);
            const articleKey = normalizeArticle(item?.ArticleNo);
            const designKey = item?.designno != null && item?.designno !== "" ? String(item.designno) : null;

            const keys = [preciseKey, designBaseKey, autocodeKey, unpaddedAutocode, articleKey, designKey].filter(Boolean);

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

    let visitor = visiterId || Cookies.get("visiterId") || "";
    if (!visitor || visitor === "undefined" || visitor === "null" || visitor === "0") {
        visitor = getOrCreateVisitorId(storeInit?.VisitorId);
    }

    const isLoggedInUser = Boolean(islogin) && Boolean(loginInfo?.id || loginInfo?.userid);

    const customerId = isLoggedInUser
        ? (loginInfo?.id ?? 0)
        : (storeInit?.IsB2BWebsite == 0 ? visitor : (loginInfo?.id ?? 0));

    const customerEmail = isLoggedInUser
        ? (loginInfo?.userid ?? "")
        : (storeInit?.IsB2BWebsite == 0 ? visitor : (loginInfo?.userid ?? ""));

    const safeCustomerId = (customerId === "undefined" || customerId === "null" || customerId == null)
        ? (visitor || "0")
        : customerId;
    const safeCustomerEmail = (customerEmail === "undefined" || customerEmail === "null" || customerEmail == null)
        ? (visitor || "")
        : customerEmail;

    let data = {
        "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo ?? ""}`,
        "Customerid": `${safeCustomerId}`,
        IsPLW: storeInit?.IsPLW ?? 0
    };

    let stringify = JSON.stringify(data);

    let body = {
        "con": `{\"id\":\"\",\"mode\":\"Getcount\",\"appuserid\":\"${safeCustomerEmail}\"}`,
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
