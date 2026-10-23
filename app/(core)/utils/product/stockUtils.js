/**
 * Universal Stock Barcode Utilities for Product Listing & Detail Pages
 * Fast O(1) in-memory stock resolution based exclusively on StockBarcode, InStock, and InMemo.
 */

/**
 * Normalizes a barcode string for robust case/space-insensitive matching.
 * @param {any} val
 * @returns {string}
 */
export function normalizeBarcode(val) {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

/**
 * Converts a raw stock list array from ERP/SQLite into a high-performance Lookup Map.
 * 
 * @param {Array<object>} [stockList=[]]
 * @returns {Map<string, { StockBarcode: string, InStock: number, InMemo: number, designno?: string, autocode?: string }>}
 */
export function buildStockMap(stockList = []) {
  const map = new Map();
  if (!Array.isArray(stockList)) return map;

  for (const item of stockList) {
    if (!item) continue;
    const barcode = normalizeBarcode(item.StockBarcode || item.stockbarcode || item.barcode);
    if (!barcode) continue;

    const inStock = Number(item.InStock ?? item.instock ?? 0) === 1 ? 1 : 0;
    const inMemo = Number(item.InMemo ?? item.inmemo ?? 0) === 1 ? 1 : 0;

    map.set(barcode, {
      StockBarcode: barcode,
      InStock: inStock,
      InMemo: inMemo,
      designno: item.designno ? String(item.designno).trim() : "",
      autocode: item.autocode ? String(item.autocode).trim() : "",
      ArticleNo: String(item.ArticleNo ?? item.articleno ?? "").trim(),
    });
  }

  return map;
}

/**
 * Resolves a product barcode from the already-loaded stock map.
 * Uses ArticleNo when the stock row provides it; otherwise only returns an
 * autocode/design match when it identifies exactly one stock barcode.
 */
export function getStockBarcodeForProduct(product, stockMap) {
  const directBarcode = normalizeBarcode(
    product?.StockBarcode || product?.stockbarcode || product?.stockBarcode || product?.barcode
  );
  if (directBarcode) return directBarcode;
  if (!(stockMap instanceof Map) || stockMap.size === 0 || !product) return "";

  const articleNo = normalizeBarcode(product.ArticleNo ?? product.articleno).toLowerCase();
  const autocode = normalizeBarcode(product.autocode ?? product.AutoCode);
  const designno = normalizeBarcode(product.designno ?? product.DesignNo).toLowerCase();
  const records = [...stockMap.values()];

  let candidates = articleNo
    ? records.filter((record) => record.ArticleNo && record.ArticleNo.toLowerCase() === articleNo)
    : [];

  if (candidates.length === 0 && autocode) {
    candidates = records.filter((record) => record.autocode === autocode);
  }
  if (candidates.length === 0 && designno) {
    candidates = records.filter((record) => record.designno.toLowerCase() === designno);
  }

  // Do not guess when a design maps to multiple physical stock barcodes.
  return candidates.length === 1 ? candidates[0].StockBarcode : "";
}

/**
 * Determines the live stock status of any single product or variant using StockBarcode.
 * 
 * @param {object|string} productOrBarcode - Product object or barcode string
 * @param {Map<string, object>} [stockMap] - Cached stock lookup map
 * @returns {{ isInStock: boolean, isInMemo: boolean, stockStatus: "IN_STOCK" | "IN_MEMO" | "MADE_TO_ORDER", barcode: string, stockRecord: object|null }}
 */
export function checkProductStock(productOrBarcode, stockMap) {
  let barcode = "";
  if (typeof productOrBarcode === "string") {
    barcode = normalizeBarcode(productOrBarcode);
  } else if (productOrBarcode && typeof productOrBarcode === "object") {
    barcode = normalizeBarcode(
      productOrBarcode.StockBarcode ||
      productOrBarcode.stockbarcode ||
      productOrBarcode.barcode
    );
  }

  // 1. If stockMap is available, do instant O(1) match
  if (stockMap instanceof Map && barcode) {
    const stockItem = stockMap.get(barcode);
    if (stockItem) {
      const isInStock = stockItem.InStock === 1;
      const isInMemo = stockItem.InMemo === 1;
      let stockStatus = "MADE_TO_ORDER";
      if (isInStock) stockStatus = "IN_STOCK";
      else if (isInMemo) stockStatus = "IN_MEMO";

      return {
        isInStock,
        isInMemo,
        stockStatus,
        barcode,
        stockRecord: stockItem,
      };
    }
  }

  // 2. Direct property fallback if InStock/InMemo were directly embedded in product object
  if (productOrBarcode && typeof productOrBarcode === "object") {
    const inStock = Number(productOrBarcode.InStock ?? productOrBarcode.instock ?? 0) === 1;
    const inMemo = Number(productOrBarcode.InMemo ?? productOrBarcode.inmemo ?? 0) === 1;

    if (inStock || inMemo) {
      return {
        isInStock: inStock,
        isInMemo: inMemo,
        stockStatus: inStock ? "IN_STOCK" : "IN_MEMO",
        barcode,
        stockRecord: null,
      };
    }
  }

  return {
    isInStock: false,
    isInMemo: false,
    stockStatus: "MADE_TO_ORDER",
    barcode,
    stockRecord: null,
  };
}

/**
 * Enriches an array of products (on pagination, filter, sort) with computed live stock flags.
 * Operates in O(N) linear time and never blocks the UI.
 * 
 * @param {Array<object>} products - Products list for current page
 * @param {Map<string, object>} [stockMap] - Cached stock lookup map
 * @returns {Array<object>} Enriched products array
 */
export function enrichProductsWithStock(products = [], stockMap) {
  if (!Array.isArray(products) || products.length === 0) return [];
  if (!stockMap || !(stockMap instanceof Map) || stockMap.size === 0) {
    // If no stock map provided, check embedded properties
    return products.map((item) => {
      const stock = checkProductStock(item, stockMap);
      return {
        ...item,
        isInStock: stock.isInStock,
        isInMemo: stock.isInMemo,
        stockStatus: stock.stockStatus,
      };
    });
  }

  return products.map((item) => {
    const stock = checkProductStock(item, stockMap);
    return {
      ...item,
      isInStock: stock.isInStock,
      isInMemo: stock.isInMemo,
      stockStatus: stock.stockStatus,
    };
  });
}

/**
 * Fetches the active stock list from SQLite API for the current tenant domain and policy.
 * 
 * @param {object} [options={}]
 * @param {string} [options.domain]
 * @param {string} [options.tableName]
 * @returns {Promise<Array<object>>}
 */
export async function fetchTenantStockList(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.domain) params.set("domain", options.domain);
    if (options.tableName) params.set("tableName", options.tableName);

    const res = await fetch(`/api/sqlite/stock-list?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.rd || json?.Data?.rd || [];
  } catch (err) {
    console.error("[stockUtils] Failed to fetch stock list:", err.message);
    return [];
  }
}
