"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import {
  buildStockMap,
  checkProductStock,
  enrichProductsWithStock,
  fetchTenantStockList,
} from "@/app/(core)/utils/product/stockUtils";
import {
  getPricingPolicyParams,
  getDynamicStockTableName,
  POLICY_TABLE_COOKIE,
  POLICY_TABLE_ALIAS,
} from "@/app/(core)/utils/product/pricingPolicy";

// Module-level cache across re-renders to prevent duplicate network calls across page navigations
const globalStockCache = new Map();

/**
 * Universal React Hook for Stock Barcode Verification and Enrichment
 * 
 * Automatically manages stock list caching and continuously verifies each product's
 * StockBarcode against live stock as the user paginates, filters, searches, or sorts.
 * Identical policy resolution as product listing.
 * 
 * @param {Array<object>} products - The current page or filtered products array
 * @param {object} [options={}]
 * @param {string} [options.domain] - Tenant domain
 * @param {string} [options.tableName] - Specific policy stock table (e.g., "stock_list_20_BEdiamond_BEcolorStone_11")
 * @param {object} [options.storeinit] - Store initialization configuration
 * @param {object} [options.loginUserDetail] - Current logged-in user profile
 * @param {boolean} [options.islogin] - Whether user is logged in
 * @param {object} [options.policyParams] - Pre-resolved pricing policy parameters
 * @param {Array<object>} [options.initialStockList] - Pre-loaded stock list if available
 * @param {boolean} [options.autoFetch=true] - Whether to automatically fetch stock list if not cached
 * @returns {{
 *   enrichedProducts: Array<object>,
 *   checkStock: (barcodeOrProduct: string|object) => object,
 *   stockMap: Map<string, object>,
 *   inStockCount: number,
 *   inMemoCount: number,
 *   isStockLoading: boolean,
 *   refreshStock: () => Promise<void>
 * }}
 */
export function useProductStock(products = [], options = {}) {
  const {
    domain,
    tableName,
    storeinit,
    loginUserDetail,
    islogin,
    policyParams,
    initialStockList,
    autoFetch = true,
  } = options;

  // Resolve active domain from options or browser cookie/host
  const activeDomain = useMemo(() => {
    if (domain) return String(domain).trim().split(":")[0];
    if (typeof window !== "undefined") {
      return window.location.hostname;
    }
    return "default";
  }, [domain]);

  // 1. Resolve pricing policy parameters identically to product listing
  const resolvedPolicyParams = useMemo(() => {
    if (policyParams) return policyParams;
    return getPricingPolicyParams({
      storeinit,
      loginUserDetail,
      islogin,
    });
  }, [policyParams, storeinit, loginUserDetail, islogin]);

  // 2. Resolve active stock policy table name identically to product listing (getDynamicDesignTableName)
  const activeTableName = useMemo(() => {
    if (tableName) return tableName;

    // Direct policy cookie (set by auth / store initialization)
    const cookiePolicy = Cookies.get(POLICY_TABLE_COOKIE) || Cookies.get(POLICY_TABLE_ALIAS);
    if (cookiePolicy && cookiePolicy.startsWith("design_Productlist_")) {
      return cookiePolicy.replace("design_Productlist_", "stock_list_");
    }

    // Standard policy-based resolution
    const dynamicName = getDynamicStockTableName(resolvedPolicyParams);
    if (dynamicName && !dynamicName.endsWith("_0_default_default_0")) {
      return dynamicName;
    }

    return dynamicName || "";
  }, [tableName, resolvedPolicyParams]);

  const cacheKey = `${activeDomain}::${activeTableName || "none"}`;

  // Initialize stockMap from global cache or initialStockList
  const [stockMap, setStockMap] = useState(() => {
    if (initialStockList && Array.isArray(initialStockList) && initialStockList.length > 0) {
      const map = buildStockMap(initialStockList);
      globalStockCache.set(cacheKey, map);
      return map;
    }
    if (activeTableName && globalStockCache.has(cacheKey)) {
      return globalStockCache.get(cacheKey);
    }
    return new Map();
  });

  const [isStockLoading, setIsStockLoading] = useState(false);
  const isFetchingRef = useRef(false);

  // Fetch stock list once per domain/table session
  const loadStockData = useCallback(async (force = false) => {
    if (!activeTableName) {
      // Strictly avoid dummy queries when no policy table is available
      return;
    }

    if (!force && globalStockCache.has(cacheKey) && globalStockCache.get(cacheKey).size > 0) {
      setStockMap(globalStockCache.get(cacheKey));
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsStockLoading(true);

    try {
      const rawList = await fetchTenantStockList({
        domain: activeDomain,
        tableName: activeTableName,
        Laboursetid: resolvedPolicyParams?.Laboursetid,
        diamondpricelistname: resolvedPolicyParams?.diamondpricelistName,
        colorstonepricelistname: resolvedPolicyParams?.colorstonepricelistName,
        SettingPriceUniqueNo: resolvedPolicyParams?.SettingPriceUniqueNo,
      });

      const newMap = buildStockMap(rawList);
      globalStockCache.set(cacheKey, newMap);
      setStockMap(newMap);
    } catch (err) {
      console.warn("[useProductStock] Could not fetch stock list:", err.message);
    } finally {
      setIsStockLoading(false);
      isFetchingRef.current = false;
    }
  }, [cacheKey, activeDomain, activeTableName, resolvedPolicyParams]);

  useEffect(() => {
    if (autoFetch && (!globalStockCache.has(cacheKey) || globalStockCache.get(cacheKey).size === 0)) {
      loadStockData();
    }
  }, [autoFetch, cacheKey, loadStockData]);

  // Continuously enrich products array in O(N) linear time whenever products change (pagination, filter)
  const enrichedProducts = useMemo(() => {
    return enrichProductsWithStock(products, stockMap);
  }, [products, stockMap]);

  // Pre-calculate counts of in-stock items on the current screen view
  const { inStockCount, inMemoCount } = useMemo(() => {
    let inStock = 0;
    let inMemo = 0;
    for (const item of enrichedProducts) {
      if (item.isInStock) inStock++;
      if (item.isInMemo) inMemo++;
    }
    return { inStockCount: inStock, inMemoCount: inMemo };
  }, [enrichedProducts]);

  // Helper function to check any arbitrary barcode or product object on demand
  const checkStock = useCallback(
    (barcodeOrProduct) => {
      return checkProductStock(barcodeOrProduct, stockMap);
    },
    [stockMap]
  );

  return {
    enrichedProducts,
    checkStock,
    stockMap,
    inStockCount,
    inMemoCount,
    isStockLoading,
    refreshStock: () => loadStockData(true),
  };
}

export default useProductStock;
