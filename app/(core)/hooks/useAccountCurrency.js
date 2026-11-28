"use client";

import { useCallback } from "react";
import useCurrency from "./useCurrency";
import { isCurrencyConversionEnabled } from "@/app/(core)/utils/storeFlags";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

const positiveRate = (value) => {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 ? rate : 1;
};

/**
 * Account/report display currency helper.
 *
 * `convertAmount` expects a base-currency amount. `convertAmountFromRate`
 * expects an amount already converted using `sourceRate` (useful for the
 * account ledger, which is first converted to the login user's currency).
 *
 * When `IsCurrencyConversion` is explicitly `0`, both helpers return the
 * original value and the fallback row currency is displayed, preserving the
 * legacy behavior exactly.
 */
export const useAccountCurrency = () => {
  const { currency, code } = useCurrency();
  const storeInit = getSession("storeInit");
  const conversionEnabled = isCurrencyConversionEnabled(storeInit);
  const selectedRate = positiveRate(currency?.CurrencyRate);

  const convertAmount = useCallback((value) => {
    if (!conversionEnabled) return value;
    const num = Number(value);
    if (!Number.isFinite(num)) return value;
    return num / selectedRate;
  }, [conversionEnabled, selectedRate]);

  const convertAmountFromRate = useCallback((value, sourceRate = 1) => {
    if (!conversionEnabled) return value;
    const num = Number(value);
    if (!Number.isFinite(num)) return value;
    return num * positiveRate(sourceRate) / selectedRate;
  }, [conversionEnabled, selectedRate]);

  const convertAmountFromCurrency = useCallback((value, sourceCurrencyCode, sourceRate) => {
    let rate = Number(sourceRate);
    if (!Number.isFinite(rate) || rate <= 0) {
      const currencyCombo = getSession("CurrencyCombo");
      rate = currencyCombo?.find((item) =>
        item?.Currencycode?.toLowerCase()?.trim() === sourceCurrencyCode?.toLowerCase()?.trim()
      )?.CurrencyRate;
    }
    return convertAmountFromRate(value, rate);
  }, [convertAmountFromRate]);

  const getCurrencyCode = useCallback((fallback = "") => {
    if (!conversionEnabled) return fallback || "";
    return code || fallback || "";
  }, [conversionEnabled, code]);

  return {
    currency,
    conversionEnabled,
    selectedCurrencyCode: code,
    convertAmount,
    convertAmountFromRate,
    convertAmountFromCurrency,
    getCurrencyCode,
  };
};

export default useAccountCurrency;
