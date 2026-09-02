"use client";

import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

export default function ClearCachePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleClearCacheAndRebuild = async () => {
    setLoading(true);
    setStatus(null);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.clear();
      }

      const res = await fetch("/api/clear-cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data?.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Error clearing cache:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Clear & Rebuild</title>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "#fff",
          zIndex: 999999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          disabled={loading}
          onClick={handleClearCacheAndRebuild}
          sx={{
            bgcolor: status === "success" ? "#2e7d32" : "#1d6bf3",
            color: "#fff",
            px: 4,
            py: 1.2,
            fontSize: "0.92rem",
            fontWeight: 500,
            borderRadius: "6px",
            textTransform: "none",
            boxShadow: "none",
            minWidth: "220px",
            height: "44px",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: status === "success" ? "#1b5e20" : "#1557c0",
              boxShadow: "0 2px 8px rgba(29, 107, 243, 0.3)",
            },
            "&:disabled": {
              bgcolor: "#90caf9",
              color: "#fff",
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <CircularProgress size={16} sx={{ color: "#fff" }} />
              <span>Clearing & Rebuilding...</span>
            </Box>
          ) : status === "success" ? (
            "Cache Cleared & Rebuilt!"
          ) : (
            "Clear Cache & Rebuild"
          )}
        </Button>

        {status === "success" && (
          <Typography variant="body2" sx={{ color: "#2e7d32", fontWeight: 500, fontSize: "0.85rem" }}>
            All cache files, storeInit, and session data cleared successfully.
          </Typography>
        )}

        {status === "error" && (
          <Typography variant="body2" sx={{ color: "#d32f2f", fontWeight: 500, fontSize: "0.85rem" }}>
            Failed to clear cache. Please try again.
          </Typography>
        )}
      </Box>
    </>
  );
}
