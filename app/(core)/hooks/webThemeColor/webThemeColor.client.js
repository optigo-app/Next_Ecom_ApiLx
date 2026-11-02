"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { normalizeWebThemeColor } from "./normalizeWebThemeColor";

// Deduplicate simultaneous reads within the client
let clientInFlightPromise = null;

async function fetchColorFromApi() {
  if (clientInFlightPromise) {
    return clientInFlightPromise;
  }

  const url = `/api/sqlite/website-color?config=true`;

  clientInFlightPromise = fetch(url, { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(`Failed to fetch website color: HTTP ${res.status} ${res.statusText} ${errorText}`.trim());
      }
      return res.json();
    })
    .then((json) => {
      if (json?.Status && json.Status !== "200") {
        throw new Error(json?.Message || "Failed to retrieve website color from server API.");
      }
      return json?.Data || null;
    })
    .finally(() => {
      clientInFlightPromise = null;
    });

  return clientInFlightPromise;
}

/**
 * Universal Client Hook for Website Theme & Colors.
 * Can be called anywhere in Client Components across any theme.
 *
 * Features:
 * - Module-level request deduplication (multiple components calling simultaneously trigger only 1 fetch).
 * - Optional `initialData` support to eliminate client waterfalls when rendered within SSR components.
 * - Robust error handling returning explicit `error` and `isError` flags.
 * - Normalized properties and CSS variables for immediate styling.
 *
 * @param {object} [options={}]
 * @param {object} [options.initialData] - Optional pre-fetched data (e.g. from server props)
 * @param {boolean} [options.skip=false] - If true, avoids automatic fetch
 * @returns {{
 *   loading: boolean,
 *   isError: boolean,
 *   error: string|null,
 *   raw: object,
 *   primaryThemeColor: string|null,
 *   primaryThemeBg: string|null,
 *   stickyHeaderBg: string|null,
 *   btnMainBg: string|null,
 *   btnMainText: string|null,
 *   btnMainBorder: string|null,
 *   btnProductBg: string|null,
 *   btnProductText: string|null,
 *   btnProductBorder: string|null,
 *   btnProductBorderRadius: string|null,
 *   btnRemoveCartBg: string|null,
 *   btnRemoveCartText: string|null,
 *   btnRemoveCartBorder: string|null,
 *   btnRemoveCartBorderRadius: string|null,
 *   iconColor: string|null,
 *   iconRemoveColor: string|null,
 *   cssVariables: Record<string, string>,
 *   refetch: () => Promise<void>
 * }}
 */
export function useWebThemeColor(options = {}) {
  const { initialData = null, skip = false } = options;

  const [raw, setRaw] = useState(() => initialData || null);
  const [loading, setLoading] = useState(() => {
    if (skip || initialData) return false;
    return true;
  });
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchColorFromApi();
      setRaw(data);
    } catch (err) {
      console.error("[useWebThemeColor] Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (skip) return;
    if (initialData) {
      setRaw(initialData);
      return;
    }
    loadData();
  }, [skip, initialData, loadData]);

  const normalized = useMemo(() => {
    return normalizeWebThemeColor(raw);
  }, [raw]);

  return {
    loading,
    isError: Boolean(error),
    error,
    refetch: loadData,
    ...normalized,
  };
}

export default useWebThemeColor;
