import Cookies from "js-cookie";
import {
    syncUserDetailToCookies,
    clearPolicyCookies,
    getDynamicDesignTableName,
    POLICY_TABLE_COOKIE,
    POLICY_TABLE_ALIAS,
} from "./product/pricingPolicy.js";

// Safe check for browser
const isBrowser = () => typeof window !== "undefined";

// Smart parser (handles JSON + normal string + boolean)
const parseValue = (value) => {
    if (value === null || value === undefined || value === "undefined" || value === "null") return null;

    try {
        return JSON.parse(value);
    } catch {
        return value; // if not JSON, return as it is
    }
};

// ✅ Get value
export const getSession = (key, defaultValue = null) => {
    if (!isBrowser()) return defaultValue;
    try {
        // First priority: Window Globals (for specific high-priority keys)
        if (key === "storeInit" && window.__STORE_INIT__) return window.__STORE_INIT__;
        if (key === "loginUserDetail" && window.__LOGIN_USER_DETAIL__) return window.__LOGIN_USER_DETAIL__;
        if (key === "LoginUser" && typeof window.__LOGIN_USER__ !== "undefined") return window.__LOGIN_USER__;

        const value = sessionStorage.getItem(key);
        if (value !== null) return parseValue(value);

        // LocalStorage Fallback (cross-tab / new tab / browser reload)
        if (key === "loginUserDetail" || key === "LoginUser") {
            try {
                const lsVal = localStorage.getItem(key);
                if (lsVal !== null) {
                    const parsed = parseValue(lsVal);
                    try { sessionStorage.setItem(key, typeof lsVal === "object" ? JSON.stringify(lsVal) : lsVal); } catch (_) {}
                    if (key === "loginUserDetail") window.__LOGIN_USER_DETAIL__ = parsed;
                    if (key === "LoginUser") window.__LOGIN_USER__ = parsed;
                    return parsed;
                }
            } catch (_) {}

            // Cookie Fallback if sessionStorage and localStorage were not populated
            const cookieVal = Cookies.get(key);
            if (cookieVal !== undefined && cookieVal !== null) {
                let raw = cookieVal;
                try { raw = decodeURIComponent(cookieVal); } catch (_) {}
                const parsed = parseValue(raw);
                try {
                    sessionStorage.setItem(key, typeof parsed === "object" ? JSON.stringify(parsed) : parsed);
                } catch (e) {}
                if (key === "loginUserDetail") window.__LOGIN_USER_DETAIL__ = parsed;
                if (key === "LoginUser") window.__LOGIN_USER__ = parsed;
                return parsed;
            }
        }

        return defaultValue;
    } catch (err) {
        console.error("Session get error:", err);
        return defaultValue;
    }
};

// ✅ Set value (auto stringify if needed)
export const setSession = (key, value) => {
    if (!isBrowser()) return;

    try {
        const valueToStore =
            typeof value === "object" ? JSON.stringify(value) : value;
        sessionStorage.setItem(key, valueToStore);

        // Backup auth session keys into Cookies and localStorage with 7 day expiry
        if (key === "loginUserDetail") {
            const parsed = typeof value === "string" ? parseValue(value) : value;
            syncUserDetailToCookies(parsed);
        } else if (key === "LoginUser") {
            Cookies.set("LoginUser", String(value), { path: "/", expires: 7 });
            try {
                localStorage.setItem("LoginUser", String(value));
            } catch (_) {}
        } else if (key === "storeInit") {
            const parsed = typeof value === "string" ? parseValue(value) : value;
            // If user is guest, automatically set guest table in cookie for instant SSR
            const isGuest = !Cookies.get("loginUserDetail") && !Cookies.get("LoginUser");
            if (isGuest && parsed && typeof parsed === "object") {
                const guestTable = getDynamicDesignTableName(parsed);
                Cookies.set(POLICY_TABLE_COOKIE, guestTable, { path: "/", expires: 7 });
                Cookies.set(POLICY_TABLE_ALIAS, guestTable, { path: "/", expires: 7 });
                try { localStorage.setItem(POLICY_TABLE_COOKIE, guestTable); } catch (_) {}
            }
        }

        // Sync to Window Globals for easy access
        if (key === "storeInit") window.__STORE_INIT__ = value;
        if (key === "loginUserDetail") window.__LOGIN_USER_DETAIL__ = value;
        if (key === "LoginUser") window.__LOGIN_USER__ = value;

    } catch (err) {
        console.error("Session set error:", err);
    }
};

// ✅ Remove value
export const removeSession = (key) => {
    if (!isBrowser()) return;

    sessionStorage.removeItem(key);

    if (key === "loginUserDetail" || key === "LoginUser") {
        clearPolicyCookies(window.__STORE_INIT__);
    }

    // Sync to Window Globals
    if (key === "storeInit") window.__STORE_INIT__ = null;
    if (key === "loginUserDetail") window.__LOGIN_USER_DETAIL__ = null;
    if (key === "LoginUser") window.__LOGIN_USER__ = false;
};

// ✅ Clear all (Logout)
export const clearSession = () => {
    if (!isBrowser()) return;

    sessionStorage.clear();
    clearPolicyCookies(window.__STORE_INIT__);

    // Clear Window Globals
    window.__STORE_INIT__ = null;
    window.__LOGIN_USER_DETAIL__ = null;
    window.__LOGIN_USER__ = false;
};

/**
 * Robustly wait for a session value if it's currently empty.
 * Checks every 100ms up to the specified timeout.
 */
export const getSessionAsync = (key, timeout = 5000) => {
    if (!isBrowser()) return Promise.resolve(null);

    return new Promise((resolve) => {
        const val = getSession(key);
        if (val) return resolve(val);

        const startTime = Date.now();
        const interval = setInterval(() => {
            const currentVal = getSession(key);
            if (currentVal || Date.now() - startTime >= timeout) {
                clearInterval(interval);
                resolve(currentVal || null);
            }
        }, 100);
    });
};