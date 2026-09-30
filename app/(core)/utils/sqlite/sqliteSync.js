import { saveSqliteProducts, saveSqliteFilters } from "./sqliteActions";

/**
 * SQLite Client Helper for synchronizing product listings and menu filters.
 * Controlled by ENABLE_AUTO_SQLITE_SYNC flag.
 */

// Manual flag: Set to true ONLY when you want to explicitly enable automatic background syncing.
// Default is false so SQLite is not constantly being overwritten on every request.
export const ENABLE_AUTO_SQLITE_SYNC = true;

/**
 * Normalizes any menu identifier into a consistent string key
 * @param {string|object} menu
 * @returns {string}
 */
export function normalizeMenuIdentifier(menu) {
  if (!menu) return "default";
  if (typeof menu === "string") {
    // If it's a URL path like "/p/L8/Ring/?M=...", extract clean path
    let cleaned = menu.split("?")[0].replace(/^\/p\//, "").replace(/\/+$/, "");
    return cleaned || "default";
  }
  if (typeof menu === "object") {
    const parts = [
      menu.menuname,
      menu.FilterVal,
      menu.FilterVal1,
      menu.FilterVal2,
    ].filter(Boolean);
    return parts.join("/") || "default";
  }
  return String(menu);
}

/**
 * Syncs product listing data into SQLite in the background if manual sync is enabled or forced.
 * @param {Array<object>|string} productsOrMenu
 * @param {Array<object>|string} [productsOrDomain]
 * @param {string} [domain]
 * @param {object} [options={ force: false }]
 */
export async function syncProductsToSqlite(productsOrMenu, productsOrDomain, domain, options = {}) {
  // Respect manual sync flag
  const isForced = options?.force === true || (typeof domain === "object" && domain?.force === true);
  if (!ENABLE_AUTO_SQLITE_SYNC && !isForced) {
    return;
  }

  try {
    let products = [];
    let targetDomain = typeof domain === "string" ? domain : undefined;
    let menuIdent = "GLOBAL";

    if (Array.isArray(productsOrMenu)) {
      products = productsOrMenu;
      targetDomain = typeof productsOrDomain === "string" ? productsOrDomain : targetDomain;
    } else if (Array.isArray(productsOrDomain)) {
      products = productsOrDomain;
      menuIdent = normalizeMenuIdentifier(productsOrMenu);
    }

    if (!Array.isArray(products) || products.length === 0) return;

    saveSqliteProducts(products, menuIdent, targetDomain).catch(() => {});
  } catch (err) {
    console.warn("[sqliteSync] Product sync error:", err.message);
  }
}

/**
 * Syncs filter options from GETFILTERLIST into SQLite in the background if manual sync is enabled or forced.
 * @param {string|object} menuIdentifier
 * @param {Array<object>} filters
 * @param {string} [domain]
 * @param {object} [options={ force: false }]
 */
export async function syncFiltersToSqlite(menuIdentifier, filters, domain, options = {}) {
  // Respect manual sync flag
  const isForced = options?.force === true || (typeof domain === "object" && domain?.force === true);
  if (!ENABLE_AUTO_SQLITE_SYNC && !isForced) {
    return;
  }

  try {
    if (!Array.isArray(filters) || filters.length === 0) return;
    const cleanMenu = normalizeMenuIdentifier(menuIdentifier);
    const targetDomain = typeof domain === "string" ? domain : undefined;

    saveSqliteFilters(cleanMenu, filters, targetDomain).catch(() => {});
  } catch (err) {
    console.warn("[sqliteSync] Filter sync error:", err.message);
  }
}

/**
 * Queries products from SQLite for given filters or menu
 * @param {object|string} [filtersOrMenu={}]
 * @param {object|string} [filterParamsOrDomain={}]
 * @param {string} [domain]
 * @returns {Promise<{ rd: Array<object>, totalCount: number }>}
 */
export async function getProductsFromSqlite(filtersOrMenu = {}, filterParamsOrDomain = {}, domain) {
  try {
    const params = new URLSearchParams();
    let targetDomain = domain;

    if (typeof filtersOrMenu === "object" && filtersOrMenu !== null) {
      for (const [k, v] of Object.entries(filtersOrMenu)) {
        if (v != null && v !== "") params.set(k, String(v));
      }
      if (typeof filterParamsOrDomain === "string") targetDomain = filterParamsOrDomain;
    } else if (typeof filtersOrMenu === "string") {
      params.set("menu", normalizeMenuIdentifier(filtersOrMenu));
      if (typeof filterParamsOrDomain === "object" && filterParamsOrDomain !== null) {
        for (const [k, v] of Object.entries(filterParamsOrDomain)) {
          if (v != null && v !== "") params.set(k, String(v));
        }
      }
    }

    if (targetDomain) params.set("domain", targetDomain);

    const res = await fetch(`/api/sqlite/products?${params.toString()}`);
    if (!res.ok) return { rd: [], totalCount: 0 };
    const json = await res.json();
    return { rd: json.data || json.pdList || [], totalCount: json.totalCount || 0 };
  } catch (err) {
    console.warn("[sqliteSync] getProductsFromSqlite error:", err.message);
    return { rd: [], totalCount: 0 };
  }
}

/**
 * Queries stored filter options from SQLite for a given menu
 * @param {string|object} menuIdentifier
 * @param {string} [domain]
 * @returns {Promise<Array<object>>}
 */
export async function getFiltersFromSqlite(menuIdentifier, domain) {
  try {
    const cleanMenu = normalizeMenuIdentifier(menuIdentifier);
    const params = new URLSearchParams({ menu: cleanMenu });
    if (domain) params.set("domain", domain);

    const res = await fetch(`/api/sqlite/filters?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[sqliteSync] getFiltersFromSqlite error:", err.message);
    return [];
  }
}
