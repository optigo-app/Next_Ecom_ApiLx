"use client";

import React, { useEffect } from "react";
import { reportClientError } from "@/app/(core)/utils/errorTracker/reportClientError";

/**
 * Next.js Global Error Boundary for root layout crashes.
 * Required to render html/body tags and reports critical errors to log/error.log.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    reportClientError({
      error,
      category: "REACT_ROOT_LAYOUT_CRASH",
      meta: {
        digest: error?.digest,
      },
    });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            padding: "32px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              margin: "0 auto 16px",
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: "0 0 8px 0" }}>
            Application Error
          </h1>
          <p style={{ color: "#4b5563", fontSize: "0.95rem", lineHeight: 1.5, margin: "0 0 24px 0" }}>
            A critical error occurred while loading the application. The issue has been recorded in our system logs.
          </p>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: "#111827",
              color: "#ffffff",
              padding: "10px 24px",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
