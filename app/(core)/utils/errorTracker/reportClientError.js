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
    const message =
      typeof error === "string"
        ? error
        : error?.message || "Unknown client-side error";

    const stack = error?.stack || "";
    const componentStack = errorInfo?.componentStack || "";
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
