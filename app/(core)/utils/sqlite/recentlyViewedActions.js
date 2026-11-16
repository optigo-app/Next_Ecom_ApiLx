"use client";

import Cookies from "js-cookie";

/**
 * Module-level de-duplication. The detail page can render / re-run effects several times
 * (login detail hydrating, remounts, listing click + detail view), but a design view must hit
 * the API only once: saves are skipped for the same customer+design inside SAVE_TTL_MS,
 * and identical fetches share one in-flight request / short-lived result.
 */
const SAVE_TTL_MS = 60 * 1000;
const FETCH_TTL_MS = 30 * 1000;
const savedAt = new Map();
const saveInflight = new Map();
const fetchCache = new Map();
const fetchInflight = new Map();

/**
 * Resolves current active customer ID from user session or visitor cookie.
 * 
 * @param {object} [loginUserDetail]
 * @returns {string|null}
 */
export function resolveCurrentCustomerId(loginUserDetail = null) {
  if (loginUserDetail?.id || loginUserDetail?.userid) {
    return String(loginUserDetail.id || loginUserDetail.userid);
  }

  if (typeof window !== "undefined") {
    try {
      const rawUser = Cookies.get("loginUserDetail");
      if (rawUser) {
        const parsed = JSON.parse(decodeURIComponent(rawUser));
        if (parsed?.id || parsed?.userid) {
          return String(parsed.id || parsed.userid);
        }
      }
    } catch (_) {}

    const visitorId = Cookies.get("visiterId");
    if (visitorId) {
      return String(visitorId);
    }
  }

  return null;
}

/**
 * Saves a recently viewed design customer-wise into SQLite.
 * Zero external API calls - 100% local SQLite.
 * Note: designno is NOT unique across the table so multiple customers can view/click the same design.
 * 
 * @param {object} params
 * @param {string|number} [params.customerId]
 * @param {string} params.designno
 * @param {string|number} [params.autocode]
 * @param {string} [params.domain]
 * @param {object} [params.loginUserDetail]
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function saveRecentlyViewedDesign({
  customerId,
  designno,
  autocode,
  domain,
  loginUserDetail,
}) {
  if (!designno) return { success: false, message: "designno is required" };

  const finalCustomerId = customerId || resolveCurrentCustomerId(loginUserDetail);
  if (!finalCustomerId) {
    // If no customerId is found yet, cannot save customer-wise
    return { success: false, message: "No customerId available" };
  }

  const saveKey = `${finalCustomerId}:${String(designno)}`;
  if (Date.now() - (savedAt.get(saveKey) || 0) < SAVE_TTL_MS) {
    return { success: true, deduped: true };
  }
  if (saveInflight.has(saveKey)) return saveInflight.get(saveKey);

  const run = (async () => {
  try {
    const res = await fetch("/api/sqlite/recently-viewed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        customerId: finalCustomerId,
        designno: String(designno),
        autocode: autocode ? String(autocode) : null,
        domain: domain || (typeof window !== "undefined" ? window.location.hostname : undefined),
      }),
    });

    if (!res.ok) {
      return { success: false, status: res.status };
    }
    const json = await res.json();
    savedAt.set(saveKey, Date.now());
    fetchCache.clear();
    return json;
  } catch (err) {
    console.warn("[saveRecentlyViewedDesign] Background save error:", err?.message);
    return { success: false, error: err?.message };
  }
  })();
  saveInflight.set(saveKey, run);
  try {
    return await run;
  } finally {
    saveInflight.delete(saveKey);
  }
}

/**
 * Fetches recently viewed designs customer-wise from SQLite.
 * Joins against current tenant pricing policy table.
 * 
 * @param {object} params
 * @param {string|number} [params.customerId]
 * @param {string} [params.currentDesignno] - Current product designno to exclude
 * @param {number} [params.limit=12]
 * @param {string} [params.domain]
 * @param {object} [params.storeInit]
 * @param {object} [params.loginUserDetail]
 * @returns {Promise<Array<object>>}
 */
export async function fetchRecentlyViewedDesigns({
  customerId,
  currentDesignno,
  limit = 12,
  domain,
  storeInit,
  loginUserDetail,
} = {}) {
  const finalCustomerId = customerId || resolveCurrentCustomerId(loginUserDetail);
  if (!finalCustomerId) {
    return [];
  }

  const fetchKey = `${finalCustomerId}:${currentDesignno || ""}:${limit}`;
  const cached = fetchCache.get(fetchKey);
  if (cached && Date.now() - cached.at < FETCH_TTL_MS) return cached.data;
  if (fetchInflight.has(fetchKey)) return fetchInflight.get(fetchKey);

  const run = (async () => {
  try {
    const res = await fetch("/api/sqlite/recently-viewed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "fetch",
        customerId: finalCustomerId,
        currentDesignno: currentDesignno || null,
        limit,
        domain: domain || (typeof window !== "undefined" ? window.location.hostname : undefined),
        storeInit,
        loginUserDetail,
      }),
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const list = data?.Data?.rd || data?.rd || [];
    fetchCache.set(fetchKey, { at: Date.now(), data: list });
    return list;
  } catch (err) {
    console.error("[fetchRecentlyViewedDesigns] Fetch error:", err?.message);
    return [];
  }
  })();
  fetchInflight.set(fetchKey, run);
  try {
    return await run;
  } finally {
    fetchInflight.delete(fetchKey);
  }
}

export default {
  resolveCurrentCustomerId,
  saveRecentlyViewedDesign,
  fetchRecentlyViewedDesigns,
};
