"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { normalizeWebContent } from "./normalizeWebContent";

// Deduplicate simultaneous reads only; never retain content past the request.
let clientInFlightPromise = null;

async function fetchGroupedContentFromApi(bypassCache = false) {
  if (clientInFlightPromise && !bypassCache) {
    return clientInFlightPromise;
  }

  const url = `/api/sqlite/website-content?grouped=true${bypassCache ? "&bypassCache=true" : ""}`;

  clientInFlightPromise = fetch(url, { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(`Failed to fetch website content: HTTP ${res.status} ${res.statusText} ${errorText}`.trim());
      }
      return res.json();
    })
    .then((json) => {
      if (json?.Status && json.Status !== "200") {
        throw new Error(json?.Message || "Failed to retrieve website content from server API.");
      }
      const rawData = json?.Data || {};
      return rawData;
    })
    .finally(() => {
      clientInFlightPromise = null;
    });

  return clientInFlightPromise;
}

/**
 * Universal Client Hook for Website Content Management.
 * Can be called anywhere in Client Components across any theme.
 *
 * Features:
 * - Module-level cache & request deduplication (multiple components calling this simultaneously trigger only 1 fetch).
 * - Optional `initialData` support to eliminate client waterfalls when rendered within SSR components.
 * - Robust error handling without silent fake fallbacks. Returns explicit `error` and `isError` flags.
 * - Normalized slices for immediate use: `categories`, `collections`, `banners`, `branding`, `seo`, etc.
 *
 * @param {object} [options={}]
 * @param {object} [options.initialData] - Optional pre-fetched data (e.g., from server props)
 * @param {boolean} [options.skip=false] - If true, avoids automatic fetch
 * @returns {{
 *   loading: boolean,
 *   isError: boolean,
 *   error: string|null,
 *   raw: object,
 *   categoryConfig: object|null,
 *   categories: Array,
 *   collectionConfig: object|null,
 *   collections: Array,
 *   branding: object|null,
 *   seo: object|null,
 *   banners: Array,
 *   bannersByType: object,
 *   bannerConfig: object|null,
 *   getBannersByType: (typeKey: string) => Array,
 *   themeSetting: object|null,
 *   pageTemplates: Array,
 *   refetch: (options?: { bypassCache?: boolean }) => Promise<void>
 * }}
 */
export function useWebContentManagement(options = {}) {
  const { initialData = null, skip = false } = options;

  const [raw, setRaw] = useState(() => initialData || {});
  const [loading, setLoading] = useState(() => {
    if (skip || initialData) return false;
    return true;
  });
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  const executeFetch = useCallback(async (bypassCache = false, showLoading = true) => {
    if (skip) return;
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const data = await fetchGroupedContentFromApi(bypassCache);
      if (isMountedRef.current) {
        setRaw(data);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("[useWebContentManagement] Error:", err.message);
        setError(err.message || "Unknown error fetching website content.");
        setRaw({});
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [skip]);

  useEffect(() => {
    isMountedRef.current = true;

    // Keep server-rendered content for the first paint, then refresh from SQLite.
    if (!skip) executeFetch(false, !initialData);

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") executeFetch(false, false);
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [skip, initialData, executeFetch]);

  const refetch = useCallback(async (opts = {}) => {
    const bypass = opts?.bypassCache ?? true;
    await executeFetch(bypass);
  }, [executeFetch]);

  // Compute normalized data memoized against raw state
  const normalized = useMemo(() => normalizeWebContent(raw), [raw]);

  return {
    loading,
    isError: Boolean(error),
    error,
    ...normalized,
    refetch,
  };
}

/**
 * Convenience hook specifically for Categories and Category Config
 */
export function useWebContentCategory(options = {}) {
  const { categoryConfig, categories, loading, isError, error, refetch } = useWebContentManagement(options);
  return {
    categoryConfig,
    categories,
    loading,
    isError,
    error,
    refetch,
  };
}

/**
 * Convenience hook specifically for Collections and Collection Config
 */
export function useWebContentCollection(options = {}) {
  const { collectionConfig, collections, loading, isError, error, refetch } = useWebContentManagement(options);
  return {
    collectionConfig,
    collections,
    loading,
    isError,
    error,
    refetch,
  };
}

/**
 * Convenience hook specifically for Banners filtered by TypeKey (e.g. "HomepageSlider")
 */
export function useWebContentBanner(typeKey, options = {}) {
  const { banners, bannersByType, bannerConfig, getBannersByType, loading, isError, error, refetch } = useWebContentManagement(options);
  const filteredBanners = useMemo(() => getBannersByType(typeKey), [getBannersByType, typeKey]);
  return {
    banners: filteredBanners,
    allBanners: banners,
    bannersByType,
    bannerConfig,
    loading,
    isError,
    error,
    refetch,
  };
}

/**
 * Convenience hook specifically for Branding details (Logos, Title, Tagline)
 */
export function useWebContentBranding(options = {}) {
  const { branding, loading, isError, error, refetch } = useWebContentManagement(options);
  return {
    branding,
    loading,
    isError,
    error,
    refetch,
  };
}
