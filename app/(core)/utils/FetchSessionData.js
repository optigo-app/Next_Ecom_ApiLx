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
    } catch (err) {
        console.error("Session set error:", err);
    }
};

// ✅ Remove value
export const removeSession = (key) => {
    if (!isBrowser()) return;

    sessionStorage.removeItem(key);
};

// ✅ Clear all
export const clearSession = () => {
    if (!isBrowser()) return;

    sessionStorage.clear();
};