import Cookies from "js-cookie";
import { LocalSetup } from "@/app/env";
import { getSession } from "../../FetchSessionData.js";
import {
  ArticleAlbumDesignViewCountAPI,
  ArticleAlbumDesignLikeAPI,
  ArticleAlbumDesignDislikeAPI,
  ArticleAlbumDesignCartAPI,
  ArticleAlbumDesignRemoveCartAPI,
} from "./AlbumApi.js";

const CTX_KEY = "procatalog_album_ctx";

const ACTIONS = {
  view: ArticleAlbumDesignViewCountAPI,
  like: ArticleAlbumDesignLikeAPI,
  dislike: ArticleAlbumDesignDislikeAPI,
  cart: ArticleAlbumDesignCartAPI,
  removeCart: ArticleAlbumDesignRemoveCartAPI,
};

const normCode = (v) => {
  const t = String(v ?? "").trim();
  return t !== "" && !isNaN(t) ? String(Number(t)) : t;
};

/** Album tracking exists only on the ProCatalog theme. */
export const isProcatalogTheme = () => LocalSetup === "procatalog.web";

/** True only when the visitor was logged in through an exclusive album (`isalbumlogin` = 1). */
export const isAlbumLogin = (loginInfo) => {
  const info = loginInfo || getSession("loginUserDetail");
  return Number(info?.isalbumlogin ?? info?.IsAlbumLogin ?? info?.Isalbumlogin) === 1;
};

export const setAlbumContext = (album, customerId = "") => {
  if (typeof window === "undefined" || !album) return;
  const ctx = {
    AlbumId: String(album?.id ?? album?.AlbumId ?? ""),
    AlbumCode: String(album?.albumcode ?? album?.AlbumCode ?? ""),
    customerId: String(customerId || album?.CustomerId || album?.Customerid || ""),
    autocodes: [...new Set((album?.designs || []).map((d) => normCode(d?.autocode)).filter(Boolean))],
  };
  try {
    sessionStorage.setItem(CTX_KEY, JSON.stringify(ctx));
  } catch (_) {}
};

export const getAlbumContext = () => {
  if (typeof window === "undefined") return null;
  try {
    const ctx = JSON.parse(sessionStorage.getItem(CTX_KEY) || "null");
    return ctx?.AlbumId || ctx?.AlbumCode ? ctx : null;
  } catch (_) {
    return null;
  }
};

export const clearAlbumContext = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CTX_KEY);
  } catch (_) {}
};

/**
 * Fire-and-forget album CallLog tracker. No-op unless isalbumlogin == 1 and an album context exists.
 * @param {"view"|"like"|"dislike"|"cart"|"removeCart"} kind
 * @param {object} item design/article ({ autocode, designno, ArticleNo, StockBarcode })
 * @param {{ loginInfo?: object, album?: object, customerId?: string }} [opts]
 */
export const trackAlbumAction = async (kind, item = {}, opts = {}) => {
  const api = ACTIONS[kind];
  if (!api || !item || !isProcatalogTheme() || !isAlbumLogin(opts.loginInfo)) return null;

  const ctx = opts.album
    ? {
        ...getAlbumContext(),
        AlbumId: String(opts.album?.id ?? opts.album?.AlbumId ?? ""),
        AlbumCode: String(opts.album?.albumcode ?? opts.album?.AlbumCode ?? ""),
        ...(Array.isArray(opts.album?.designs) && {
          autocodes: opts.album.designs.map((d) => normCode(d?.autocode)).filter(Boolean),
        }),
      }
    : getAlbumContext();
  if (!ctx?.AlbumId && !ctx?.AlbumCode) return null;

  // Only designs that belong to the opened album count; anything browsed from home/categories is ignored
  if (!Array.isArray(ctx.autocodes) || !ctx.autocodes.includes(normCode(item.autocode))) return null;

  const loginInfo = opts.loginInfo || getSession("loginUserDetail");
  const articleNo = item.ArticleNo ?? item.articleno ?? item.ArticleMasterCode ?? "";
  const customerId = opts.customerId || ctx.customerId || loginInfo?.id || "";

  if (kind === "view" && typeof window !== "undefined") {
    const key = `procatalog_detail_view_${ctx.AlbumId}_${item.designno || item.autocode}_${articleNo}_${customerId}`;
    try {
      if (sessionStorage.getItem(key)) return null;
      sessionStorage.setItem(key, "1");
    } catch (_) {}
  }

  const payload = {
    Customerid: customerId || undefined,
    AlbumId: ctx.AlbumId,
    AlbumCode: ctx.AlbumCode,
    autocode: String(item.autocode ?? ""),
    designno: String(item.designno ?? ""),
    ArticleMasterCode: String(articleNo),
    StockBarcode: String(item.StockBarcode ?? ""),
    Source: "procatalog website",
  };

  try {
    return await api(payload, Cookies.get("visiterId") || "");
  } catch (err) {
    console.warn(`[albumTracker] ${kind} failed:`, err);
    return null;
  }
};
