"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  CURRENCY_CHANGE_EVENT,
  getCurrencyList,
  getCurrencyCode,
  getCurrencySymbol,
  getSelectedCurrency,
  setSelectedCurrency,
  convertPrice,
  formatPrice,
} from "@/app/(core)/utils/Glob_Functions/Currency";
import { decodeEntities } from "@/app/(core)/utils/product/productListingHelpers";

const subscribe = (onStoreChange) => {
  window.addEventListener(CURRENCY_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CURRENCY_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

const getSnapshot = () => {
  try {
    return JSON.stringify(getSelectedCurrency()) ?? "null";
  } catch (_) {
    return "null";
  }
};

// SSR/hydration: render with no conversion (base currency) to keep
// markup identical to the server; the stored pick applies right after mount.
const getServerSnapshot = () => "null";

/**
 * Reactive currency state for UI-only price conversion.
 *
 *   const { format, symbol } = useCurrency();
 *   <span>{symbol}</span>{format(product.UnitCostWithMarkUp)}
 *
 * `format`/`convert` divide the base price by the selected `CurrencyRate`.
 * The raw value is unchanged — keep sending the original to APIs.
 */
export const useCurrency = () => {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let currency = null;
  try {
    currency = raw && raw !== "null" ? JSON.parse(raw) : null;
  } catch (_) {}

  const format = useCallback((value) => formatPrice(value, currency), [raw]);
  const convert = useCallback((value) => convertPrice(value, currency), [raw]);
  const select = useCallback((c) => setSelectedCurrency(c), []);

  // Prices are labelled with the currency CODE (INR / USD / AUD) rather
  // than the symbol — per product owner decision.
  return {
    currency,
    code: getCurrencyCode(currency),
    symbol: getCurrencyCode(currency) || decodeEntities(getCurrencySymbol(currency) || "") || null,
    format,
    convert,
    select,
    list: getCurrencyList(),
  };
};

export default useCurrency;
