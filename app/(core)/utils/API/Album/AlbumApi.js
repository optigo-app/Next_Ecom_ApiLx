import { getSession } from "../../FetchSessionData.js";
import { CommonAPI } from "../CommonAPI/CommonAPI.js";

/**
 * Helper to execute ProCatalog Album CallLog actions.
 * Formats `con`, `p`, and `f` to match ERP API requirements.
 *
 * @param {string} mode - The action mode (e.g., "ArticleAlbumDesignViewCount", "ArticleAlbumDesignLike", etc.)
 * @param {object} payload - Action parameters (AlbumId, AlbumCode, autocode, designno, ArticleMasterCode, etc.)
 * @param {string} [visiterId] - Optional visitor ID for guest users
 * @returns {Promise<object|null>} API response
 */
export const callAlbumActionAPI = async (mode, payload = {}, visiterId = "") => {
  const storeInit = getSession("storeInit");
  const loginInfo = getSession("loginUserDetail");
  const islogin = getSession("LoginUser");

  const customerId =
    payload.Customerid ??
    payload.customerId ??
    ((storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null))
      ? (visiterId || 0)
      : (loginInfo?.id ?? 0));

  const customerEmail =
    payload.appuserid ??
    payload.customerEmail ??
    ((storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null))
      ? (visiterId || "")
      : (loginInfo?.userid ?? loginInfo?.email ?? ""));

  const pData = {
    Customerid: String(customerId ?? "0"),
    AlbumId: String(payload.AlbumId ?? payload.albumId ?? payload.albumid ?? ""),
    AlbumCode: String(payload.AlbumCode ?? payload.albumCode ?? payload.albumcode ?? ""),
    autocode: String(payload.autocode ?? payload.autoCode ?? ""),
    designno: String(payload.designno ?? payload.designNo ?? ""),
    ArticleMasterCode: String(
      payload.ArticleMasterCode ??
        payload.articleMasterCode ??
        payload.ArticleNo ??
        payload.articleno ??
        ""
    ),
    Source: String(payload.Source ?? payload.source ?? "article"),
    StockBarcode: String(
      payload.StockBarcode ??
        payload.stockBarcode ??
        payload.stockbarcode ??
        ""
    ),
  };

  const conData = {
    id: "",
    mode,
    y: storeInit?.YearCode || "",
    appuserid: customerEmail ? String(customerEmail) : "",
    FormName: `onlogin (${mode})`,
    domain: storeInit?.domain || "",
    version: storeInit?.version || "NXTAS",
    EventName: "",
  };

  const body = {
    con: JSON.stringify(conData),
    p: JSON.stringify(pData),
    f: "CallLog",
  };

  try {
    const res = await CommonAPI(body);
    return res;
  } catch (error) {
    console.error(`[AlbumAPI] ${mode} Error:`, error);
    return null;
  }
};

/**
 * 1. Log view count for an album design/article
 */
export const ArticleAlbumDesignViewCountAPI = async (payload = {}, visiterId = "") => {
  return callAlbumActionAPI("ArticleAlbumDesignViewCount", payload, visiterId);
};

/**
 * 2. Like an album design/article
 */
export const ArticleAlbumDesignLikeAPI = async (payload = {}, visiterId = "") => {
  return callAlbumActionAPI("ArticleAlbumDesignLike", payload, visiterId);
};

/**
 * 3. Dislike an album design/article
 */
export const ArticleAlbumDesignDislikeAPI = async (payload = {}, visiterId = "") => {
  return callAlbumActionAPI("ArticleAlbumDesignDislike", payload, visiterId);
};

/**
 * 4. Add album design/article to Cart (CallLog tracker)
 */
export const ArticleAlbumDesignCartAPI = async (payload = {}, visiterId = "") => {
  return callAlbumActionAPI("ArticleAlbumDesignCart", payload, visiterId);
};

/**
 * 5. Remove album design/article from Cart (CallLog tracker)
 */
export const ArticleAlbumDesignRemoveCartAPI = async (payload = {}, visiterId = "") => {
  return callAlbumActionAPI("ArticleAlbumDesignRemoveCart", payload, visiterId);
};

// Aliases for convenience
export const AlbumDesignViewCount = ArticleAlbumDesignViewCountAPI;
export const AlbumDesignLike = ArticleAlbumDesignLikeAPI;
export const AlbumDesignDislike = ArticleAlbumDesignDislikeAPI;
export const AlbumDesignCart = ArticleAlbumDesignCartAPI;
export const AlbumDesignRemoveCart = ArticleAlbumDesignRemoveCartAPI;
