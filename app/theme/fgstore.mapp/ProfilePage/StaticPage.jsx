"use client";

import React, { useEffect, useState } from "react";
import { Drawer, Box, CircularProgress, Typography } from "@mui/material";
import MobileNavbar from "./NavigationBar";
import { AppConfig } from "@/app/(core)/constants/AppConfig";
import { activeBrand } from "@/app/env";

export default function StaticPage({ open, onClose, title = "Page" }) {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);

  const brandConfig = AppConfig[activeBrand] || AppConfig.SonasonsApp;
  const staticPageUrl = brandConfig?.static_pages?.[title];

  useEffect(() => {
    if (open && staticPageUrl) {
      setLoading(true);
      fetch(staticPageUrl)
        .then((res) => {
          if (!res.ok) throw new Error("File not found");
          return res.text();
        })
        .then((data) => {
          setHtmlContent(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(`Error fetching static page [${title}]:`, err);
          setHtmlContent("<p style='padding: 20px; text-align: center;'>Content not found.</p>");
          setLoading(false);
        });
    } else if (!open) {
      setHtmlContent("");
    }
  }, [open, staticPageUrl, title]);

  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "100%",
          bgcolor: "#fff",
        },
      }}
    >
      <MobileNavbar title={title} onClose={onClose} />

      <Box sx={{ overflowY: "auto", height: "calc(100% - 64px)", px: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress size={30} sx={{ color: "#000" }} />
          </Box>
        ) : htmlContent ? (
          <Box
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            sx={{
              "& img": { maxWidth: "100%", height: "auto" },
              "& a": { color: "primary.main" },
              p: 0,
            }}
          />
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No information available for {title}.
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
