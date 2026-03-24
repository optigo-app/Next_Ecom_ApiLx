// Safe check for browser
const isBrowser = () => typeof window !== "undefined";

// Smart parser (handles JSON + normal string + boolean)
const parseValue = (value) => {
    if (value === null) return null;

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
        return value !== null ? parseValue(value) : defaultValue;
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

    // Sync to Window Globals
    if (key === "storeInit") window.__STORE_INIT__ = null;
    if (key === "loginUserDetail") window.__LOGIN_USER_DETAIL__ = null;
    if (key === "LoginUser") window.__LOGIN_USER__ = false;
};

// ✅ Clear all
export const clearSession = () => {
    if (!isBrowser()) return;

    sessionStorage.clear();

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