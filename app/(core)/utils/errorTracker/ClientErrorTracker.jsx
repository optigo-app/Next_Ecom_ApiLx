"use client";

import { useEffect } from "react";
import { reportClientError } from "./reportClientError";

/**
 * Global Client Error Tracker Component.
 * Mounts in RootLayout once to intercept all uncaught browser errors
 * and unhandled promise rejections, flushing them to log/error.log.
 */
export default function ClientErrorTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleError = (event) => {
      // Ignore cross-origin script error noise without actionable detail
      if (event.message === "Script error." && !event.filename) return;

      reportClientError({
        error: event.error || event.message,
        category: "CLIENT_UNCAUGHT_ERROR",
        meta: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    const handleUnhandledRejection = (event) => {
      const reason = event.reason;
      const error =
        reason instanceof Error
          ? reason
          : new Error(typeof reason === "string" ? reason : JSON.stringify(reason));

      reportClientError({
        error,
        category: "CLIENT_UNHANDLED_PROMISE",
        meta: {
          type: "unhandledrejection",
        },
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
