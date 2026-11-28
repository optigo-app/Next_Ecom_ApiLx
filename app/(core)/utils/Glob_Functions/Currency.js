import { getSession } from "../FetchSessionData";
import { formatter as baseNumberFormatter } from "./GlobalFunction";

/**
 * Currency display utilities (UI-ONLY conversion).
 *
 * Prices coming from the APIs are always in the base currency
 * (the currency whose `IsDefault === 1`, typically INR with rate 1).
 * These helpers divide the raw price by the selected currency's
 * `CurrencyRate` purely for on-screen display. The original value
 * is what must still be sent to any API.
 */

export const CURRENCY_STORAGE_KEY = "selectedCurrency";
export const CURRENCY_CHANGE_EVENT = "app:currency-changed";

const isBrowser = () => typeof window !== "undefined";

const priceFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

/** All currencies offered by the CURRENCYCOMBO master API (sessionStorage). */
export const getCurrencyList = () => {
  const list = getSession("CurrencyCombo");
  return Array.isArray(list) ? list : [];
};

/**
 * The currency selected by the user, or the combo default (`IsDefault === 1`),
 * or `null` when nothing is known yet (SSR / combo not loaded).
 */
export const getSelectedCurrency = () => {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (stored && typeof stored === "object") return stored;
    }
  } catch (_) {}
  const list = getCurrencyList();
  return list.find((c) => c?.IsDefault === 1) || null;
};

/** Persist the user's pick and notify every `useCurrency` subscriber. */
export const setSelectedCurrency = (currency) => {
  if (!isBrowser() || !currency) return;
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(currency));
  } catch (_) {}
  window.dispatchEvent(
    new CustomEvent(CURRENCY_CHANGE_EVENT, { detail: currency }),
  );
};

export const getCurrencyRate = (currency) => {
  const rate = Number(currency?.CurrencyRate);
  return Number.isFinite(rate) && rate > 0 ? rate : 1;
};

/**
 * Convert a base-currency amount into the display currency.
 * Screen only — never send the result back to an API.
 */
export const convertPrice = (value, currency) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  return num / getCurrencyRate(currency ?? getSelectedCurrency());
};

/** converted + grouped number (no symbol), e.g. `1,234.56`. */
export const formatPrice = (value, currency) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return baseNumberFormatter(value);
  return priceFormatter.format(
    num / getCurrencyRate(currency ?? getSelectedCurrency()),
  );
};

/**
 * Symbol shown next to a price. `Currencysymbol` may hold an HTML entity
 * ("&#8377;") so callers using `decodeEntities` keep working.
 */
export const getCurrencySymbol = (currency) =>
  currency?.Currencysymbol || currency?.Currencycode || null;

/** Currency code, e.g. "INR" / "USD". */
export const getCurrencyCode = (currency) => currency?.Currencycode || null;

/** ISO country of the flag shown for a currency code (flags live in /public/flags). */
const CURRENCY_FLAG_MAP = {
  INR: "in",
  USD: "us",
  AUD: "au",
  CAD: "ca",
  HKD: "hk",
  GBP: "gb",
  EUR: "eu",
  AED: "ae",
  SGD: "sg",
  JPY: "jp",
  CNY: "cn",
  CHF: "ch",
  QAR: "qa",
};

/**
 * Local flag SVG path for a currency, e.g. "/flags/in.svg".
 * Returns `null` for currencies with no real country (QA1, P, …) —
 * callers should fall back to the symbol badge.
 */
export const getCurrencyFlag = (currency) => {
  const country = CURRENCY_FLAG_MAP[String(currency?.Currencycode || "").toUpperCase()];
  return country ? `/flags/${country}.svg` : null;
};
