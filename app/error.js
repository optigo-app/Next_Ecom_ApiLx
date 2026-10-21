"use client";

import React, { useEffect } from "react";
import { reportClientError } from "@/app/(core)/utils/errorTracker/reportClientError";

/**
 * Next.js App Router Route Segment Error Boundary.
 * Catches uncaught runtime errors in pages and components,
 * reports full diagnostics to log/error.log, and renders a clean recovery UI.
 */
export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    reportClientError({
      error,
      category: "REACT_PAGE_CRASH",
      meta: {
        digest: error?.digest,
      },
    });
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#fee2e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          color: "#dc2626",
          fontSize: "24px",
        }}
      >
        !
      </div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0" }}>
        Something went wrong
      </h2>
      <p style={{ color: "#6b7280", maxWidth: "450px", margin: "0 0 24px 0", fontSize: "0.95rem" }}>
        An unexpected error occurred while loading this section. Our system has logged the details.
      </p>
      {process.env.NODE_ENV !== "production" && error?.message && (
        <pre
          style={{
            maxWidth: "600px",
            background: "#f3f4f6",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            color: "#b91c1c",
            overflowX: "auto",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          {error.message}
        </pre>
      )}
      <button
        onClick={() => reset()}
        style={{
          backgroundColor: "#1f2937",
          color: "#ffffff",
          padding: "10px 24px",
          borderRadius: "6px",
          border: "none",
          fontSize: "0.95rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Try Again
      </button>
    </div>
  );
}
