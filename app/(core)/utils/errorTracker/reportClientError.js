/**
 * Pure client-side error reporter. Zero external dependencies.
 * Uses navigator.sendBeacon with fetch(keepalive: true) fallback.
 * Includes in-memory deduplication to avoid flooding error.log.
 */

const recentErrors = new Map(); // hash -> timestamp
const DEDUPE_WINDOW_MS = 10000; // Ignore duplicate errors within 10 seconds

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

/**
 * Decodes minified production React errors ("Minified React error #NNN") into
 * their full template messages, substituting the args embedded in the
 * react.dev error URL. Makes production error logs actually meaningful.
 */
const REACT_ERROR_TEMPLATES = {
  31: "Objects are not valid as a React child (found: %s). If you meant to render a collection of children, use an array instead.",
  130: "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s. Likely a broken/mismatched import (default vs named) or a module resolved to a plain object.",
  152: "A component suspended while responding to synchronous input.",
  185: "Maximum update depth exceeded — a component calls setState inside render or useEffect without proper guards.",
  300: "Rendered fewer hooks than expected — a hook was called conditionally or after an early return.",
  310: "Rendered more hooks than during the previous render — hook count changed between renders.",
  418: "Hydration failed because the text content does not match server-rendered HTML (%s mismatch). Usually caused by browser-only values (Date, random, sessionStorage, window) rendered during SSR.",
  419: "Hydration failed because the server rendered extra/missing attributes compared to the client.",
  420: "Hydration failed because the server rendered different HTML than the client tree.",
  421: "Hydration failed because a server-rendered suspense boundary resolved differently on the client.",
  422: "Hydration failed because text content does not match — VM/dirty check mismatch.",
  423: "Hydration failed — the server-rendered tree type does not match the client (%s).",
  425: "Text content does not match server-rendered HTML.",
};

function decodeReactError(message) {
  if (typeof message !== "string" || !message.includes("Minified React error #")) {
    return null;
  }
  try {
    const numMatch = message.match(/Minified React error #(\d+)/);
    if (!numMatch) return null;
    const code = numMatch[1];
    // Extract args[] values embedded in the react.dev URL
    const args = [];
    const argRegex = /args\[\]=([^&]*)/g;
    let m;
    while ((m = argRegex.exec(message)) !== null) {
      args.push(decodeURIComponent(m[1]));
    }
    const template = REACT_ERROR_TEMPLATES[code];
    if (!template) {
      return `React error #${code}${args.length ? ` (args: ${args.join(", ")})` : ""} — see https://react.dev/errors/${code}`;
    }
    let argIdx = 0;
    const decoded = template.replace(/%s/g, () => args[argIdx++] ?? "?");
    return `React error #${code}: ${decoded}`;
  } catch (_) {
    return null;
  }
}

/**
 * Report a client-side error to the server endpoint /api/log/error
 * 
 * @param {object} params
 * @param {Error|string} params.error - Error object or message
 * @param {object} [params.errorInfo] - React errorInfo containing componentStack
 * @param {string} [params.category="CLIENT_ERROR"] - Error category badge
 * @param {object} [params.meta={}] - Additional contextual metadata
 */
export function reportClientError({
  error,
  errorInfo = null,
  category = "CLIENT_ERROR",
  meta = {},
}) {
  if (typeof window === "undefined") return;

  try {
    const rawMessage =
      typeof error === "string"
        ? error
        : error?.message || "Unknown client-side error";

    // Decode minified React production errors into full readable messages
    const decoded = decodeReactError(rawMessage);
    const message = decoded ? `${decoded} | raw: ${rawMessage}` : rawMessage;

    const stack = error?.stack || "";
    // React 19 attaches componentStack directly on boundary-caught errors;
    // older paths pass it via errorInfo.
    const componentStack =
      errorInfo?.componentStack || error?.componentStack || "";
    const url = window.location.href;
    const userAgent = window.navigator.userAgent;
    const domain = window.location.hostname;

    // Deduplicate rapid identical errors
    const errorHash = hashString(`${message}|${stack.slice(0, 100)}|${url}`);
    const now = Date.now();
    const lastSeen = recentErrors.get(errorHash);

    if (lastSeen && now - lastSeen < DEDUPE_WINDOW_MS) {
      return;
    }
    recentErrors.set(errorHash, now);

    // Clean up stale dedupe keys
    if (recentErrors.size > 100) {
      for (const [key, time] of recentErrors.entries()) {
        if (now - time > DEDUPE_WINDOW_MS) {
          recentErrors.delete(key);
        }
      }
    }

    const payload = JSON.stringify({
      category,
      message,
      stack,
      componentStack,
      url,
      domain,
      userAgent,
      timestamp: new Date().toISOString(),
      meta,
    });

    // 1. Prefer sendBeacon for non-blocking asynchronous dispatch
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/log/error", blob);
      if (sent) return;
    }

    // 2. Fallback to fetch with keepalive
    fetch("/api/log/error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Intentionally ignore transmission failure to prevent recursion
    });
  } catch (err) {
    // Avoid throwing inside error handler
    console.error("[reportClientError] Failed to send error:", err);
  }
}
