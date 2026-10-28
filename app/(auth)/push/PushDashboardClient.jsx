"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import {
  Play,
  RotateCw,
  Database,
  Store,
  Layers,
  FileCode,
  FolderTree,
  Image,
  Boxes,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

const KNOWN_DOMAINS = [
  "beluxjewel.web",
  "procatalog.web",
  "demostore",
  "sonasons.procatalog.in",
  "omjiyanshjewels.com",
  "nxtdiamondtine.web",
  "nxtelvee.web",
  "nxthoq.web",
  "nxtjulian.web",
  "nxtjulian4.web",
];

export default function PushDashboardClient() {
  const [targetDomain, setTargetDomain] = useState("beluxjewel.web");
  const [customDomain, setCustomDomain] = useState("");
  const activeDomain = customDomain.trim() || targetDomain;

  // 1. Store Init JSON Payload
  const [storeInitPayloadStr, setStoreInitPayloadStr] = useState(
    JSON.stringify(
      {
        apiurl: "http://newnextjs.web/api/report",
        domain: "beluxjewel.web",
        version: "NXTAS",
        sv: 0,
      },
      null,
      2
    )
  );

  // 2. Policy Pricing JSON Payload
  const [policyPayloadStr, setPolicyPayloadStr] = useState(
    JSON.stringify(
      {
        domain: "beluxjewel.web",
        Config: [
          {
            "Laboursetid": 1,
            "diamondpricelistName": "dhruv",
            "colorstonepricelistName": "Retail",
            "SettingPriceUniqueNo": 1,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 2,
            "diamondpricelistName": "kayraHKD",
            "colorstonepricelistName": "kayracsHKD",
            "SettingPriceUniqueNo": 4,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 7,
            "diamondpricelistName": "dhrdiamond",
            "colorstonepricelistName": "dhrcolormisc",
            "SettingPriceUniqueNo": 8,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 14,
            "diamondpricelistName": "dhrdiamond",
            "colorstonepricelistName": "dhrcolormisc",
            "SettingPriceUniqueNo": 8,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 16,
            "diamondpricelistName": "hir",
            "colorstonepricelistName": "demo",
            "SettingPriceUniqueNo": 8,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 20,
            "diamondpricelistName": "BEdiamond",
            "colorstonepricelistName": "BEcolorStone",
            "SettingPriceUniqueNo": 11,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 20,
            "diamondpricelistName": "BEdiamond1",
            "colorstonepricelistName": "BEcolorStone1",
            "SettingPriceUniqueNo": 11,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 21,
            "diamondpricelistName": "hir",
            "colorstonepricelistName": "HIR",
            "SettingPriceUniqueNo": 11,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 22,
            "diamondpricelistName": "hi2",
            "colorstonepricelistName": "hir2",
            "SettingPriceUniqueNo": 11,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 23,
            "diamondpricelistName": "hir3",
            "colorstonepricelistName": "hir3",
            "SettingPriceUniqueNo": 8,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 24,
            "diamondpricelistName": "testing",
            "colorstonepricelistName": "testing",
            "SettingPriceUniqueNo": 8,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          },
          {
            "Laboursetid": 25,
            "diamondpricelistName": "testing",
            "colorstonepricelistName": "new",
            "SettingPriceUniqueNo": 12,
            "FrontEnd_RegNo": "80kgizbiduw5e7gg"
          }
        ],
      },
      null,
      2
    )
  );

  // Live execution logs
  const [logs, setLogs] = useState([]);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runningStep, setRunningStep] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [copiedLogIndex, setCopiedLogIndex] = useState(null);

  const addLog = useCallback((type, title, data = null, duration = null) => {
    const entry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      type, // 'start' | 'success' | 'error' | 'info'
      title,
      data,
      duration,
    };
    setLogs((prev) => [entry, ...prev]);
  }, []);

  const handleDomainChange = (newDomain) => {
    setTargetDomain(newDomain);
    setCustomDomain("");

    // Auto-update domain field in both JSON editors if they were targeting previous domain
    try {
      const storeObj = JSON.parse(storeInitPayloadStr);
      storeObj.domain = newDomain;
      setStoreInitPayloadStr(JSON.stringify(storeObj, null, 2));
    } catch (_) { }

    try {
      const policyObj = JSON.parse(policyPayloadStr);
      policyObj.domain = newDomain;
      setPolicyPayloadStr(JSON.stringify(policyObj, null, 2));
    } catch (_) { }
  };

  // Helper to run any SQLite API endpoint
  const executeApiCall = async (endpoint, options = {}, stepLabel = "") => {
    const startTime = performance.now();
    try {
      const res = await fetch(endpoint, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });

      const elapsed = Math.round(performance.now() - startTime);
      const data = await res.json().catch(() => ({ status: res.status, text: "No JSON body" }));

      if (res.ok && (data.success !== false && data.Status !== "400" && data.Status !== "500")) {
        addLog("success", `[${stepLabel || endpoint}] Completed successfully (${elapsed}ms)`, data, elapsed);
        return { success: true, data };
      } else {
        addLog("error", `[${stepLabel || endpoint}] Failed with status ${res.status}`, data, elapsed);
        return { success: false, data };
      }
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      addLog("error", `[${stepLabel || endpoint}] Network/Fetch Exception: ${err.message}`, { error: err.stack }, elapsed);
      return { success: false, error: err.message };
    }
  };

  // ── Step 1: Push Store Init ────────────────────────────────────────────────
  const handlePushStoreInit = async () => {
    setRunningStep("store-init");
    addLog("start", `Initiating Store Init push for '${activeDomain}'...`);
    try {
      let bodyObj = JSON.parse(storeInitPayloadStr);
      bodyObj.domain = activeDomain;
      await executeApiCall(
        "/api/sqlite/store-init",
        { method: "POST", body: JSON.stringify(bodyObj) },
        "Store Init"
      );
    } catch (err) {
      addLog("error", `Invalid JSON in Store Init payload: ${err.message}`);
    } finally {
      setRunningStep(null);
    }
  };

  // ── Step 2: Push Products (Policy Catalog) ─────────────────────────────────
  const handlePushProducts = async () => {
    setRunningStep("products");
    addLog("start", `Initiating Products (Policy Catalog) sync for '${activeDomain}'...`);
    try {
      let bodyObj = JSON.parse(policyPayloadStr);
      bodyObj.domain = activeDomain;
      await executeApiCall(
        "/api/sqlite/products",
        { method: "POST", body: JSON.stringify(bodyObj) },
        "Products & Policy"
      );
    } catch (err) {
      addLog("error", `Invalid JSON in Policy payload: ${err.message}`);
    } finally {
      setRunningStep(null);
    }
  };

  // ── Step 3: Push Articles & Materials ──────────────────────────────────────
  const handlePushArticles = async () => {
    setRunningStep("articles");
    addLog("start", `Initiating Articles & Materials sync for '${activeDomain}'...`);
    try {
      let bodyObj = JSON.parse(policyPayloadStr);
      bodyObj.domain = activeDomain;
      await executeApiCall(
        "/api/sqlite/articles",
        { method: "POST", body: JSON.stringify(bodyObj) },
        "Articles & Materials"
      );
    } catch (err) {
      addLog("error", `Invalid JSON in Policy payload: ${err.message}`);
    } finally {
      setRunningStep(null);
    }
  };

  // ── Step 4: Sync Package Master ────────────────────────────────────────────
  const handleSyncPackages = async () => {
    setRunningStep("packages");
    addLog("start", `Initiating Package Master ERP sync for '${activeDomain}'...`);
    await executeApiCall(
      `/api/sqlite/package-master?domain=${encodeURIComponent(activeDomain)}&sync=true`,
      { method: "POST" },
      "Package Master"
    );
    setRunningStep(null);
  };

  // ── Step 5: Sync Menus ─────────────────────────────────────────────────────
  const handleSyncMenus = async () => {
    setRunningStep("menus");
    addLog("start", `Initiating Menus ERP sync for '${activeDomain}'...`);
    await executeApiCall(
      `/api/sqlite/menus?domain=${encodeURIComponent(activeDomain)}&sync=true`,
      { method: "POST" },
      "Menus"
    );
    setRunningStep(null);
  };

  // ── Step 6: Sync Exclusive Albums ──────────────────────────────────────────
  const handleSyncAlbums = async () => {
    setRunningStep("albums");
    addLog("start", `Initiating Exclusive Albums ERP sync for '${activeDomain}'...`);
    await executeApiCall(
      `/api/sqlite/albums?domain=${encodeURIComponent(activeDomain)}&sync=true`,
      { method: "POST" },
      "Exclusive Albums"
    );
    setRunningStep(null);
  };

  // ── Step 7: Sync Website Content ───────────────────────────────────────────
  const handleSyncContent = async () => {
    setRunningStep("content");
    addLog("start", `Initiating Website Content ERP sync for '${activeDomain}'...`);
    await executeApiCall(
      `/api/sqlite/website-content?domain=${encodeURIComponent(activeDomain)}&sync=true`,
      { method: "POST" },
      "Website Content"
    );
    setRunningStep(null);
  };

  // ── Step 8: Sync Stock List (Policy-Based matching Product Listing) ─────────
  const handleSyncStock = async () => {
    setRunningStep("stock");
    addLog("start", `Initiating Stock List (Policy) sync for '${activeDomain}'...`);
    try {
      let bodyObj = JSON.parse(policyPayloadStr);
      bodyObj.domain = activeDomain;
      await executeApiCall(
        `/api/sqlite/stock-list?domain=${encodeURIComponent(activeDomain)}`,
        { method: "POST", body: JSON.stringify(bodyObj) },
        "Stock List (Policy)"
      );
    } catch (err) {
      addLog("error", `Invalid JSON in Policy payload: ${err.message}`);
    } finally {
      setRunningStep(null);
    }
  };

  // ── Step 9: Flush WAL Checkpoint ───────────────────────────────────────────
  const handleFlushWal = async () => {
    setRunningStep("flush");
    addLog("start", `Flushing SQLite WAL checkpoint for '${activeDomain}'...`);
    await executeApiCall(
      `/api/sqlite/flush?domain=${encodeURIComponent(activeDomain)}`,
      { method: "POST" },
      "Flush WAL"
    );
    setRunningStep(null);
  };

  // ── Step 10: Inspect Local Store Init ──────────────────────────────────────
  const handleInspectStoreInit = async () => {
    setRunningStep("inspect");
    addLog("start", `Inspecting local StoreInit for '${activeDomain}'...`);
    await executeApiCall(
      `/api/sqlite/store-init?domain=${encodeURIComponent(activeDomain)}`,
      { method: "GET" },
      "Inspect StoreInit"
    );
    setRunningStep(null);
  };

  // ── Run Full Pipeline (1-Click Push All) ───────────────────────────────────
  const handleRunAllPipeline = async () => {
    setIsRunningAll(true);
    addLog("info", `🚀 Starting Full Push & Sync Pipeline for '${activeDomain}'...`);

    const steps = [
      { name: "Store Init", fn: handlePushStoreInit },
      { name: "Products & Policy", fn: handlePushProducts },
      { name: "Articles & Materials", fn: handlePushArticles },
      { name: "Package Master", fn: handleSyncPackages },
      { name: "Menus", fn: handleSyncMenus },
      { name: "Exclusive Albums", fn: handleSyncAlbums },
      { name: "Website Content", fn: handleSyncContent },
      { name: "Stock List", fn: handleSyncStock },
      { name: "Flush WAL", fn: handleFlushWal },
    ];

    for (let i = 0; i < steps.length; i++) {
      setActiveStepIndex(i + 1);
      await steps[i].fn();
    }

    setIsRunningAll(false);
    setActiveStepIndex(0);
    addLog("success", `🎉 Full Push & Sync Pipeline Completed for '${activeDomain}'!`);
  };

  const copyLogData = (index, data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedLogIndex(index);
    setTimeout(() => setCopiedLogIndex(null), 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0B0F19",
        color: "#F1F5F9",
        py: 4,
        px: { xs: 2, sm: 3, md: 5 },
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <Container maxWidth="xl">
        {/* Top Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 4,
            pb: 3,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Box
                sx={{
                  backgroundColor: "#2563EB",
                  p: 1,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Database size={24} color="#FFFFFF" />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                }}
              >
                Database Push & Sync Control Panel
              </Typography>
              <Chip
                label="NO-INDEX ROUTE"
                size="small"
                icon={<ShieldAlert size={14} color="#E2E8F0" />}
                sx={{
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  color: "#FCA5A5",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Direct SQLite sync pipeline for StoreInit, Policy Products, Articles, Packages, Menus, and Exclusive Albums.
            </Typography>
          </Box>

          {/* Quick External Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              target="_blank"
              href={`/?exclusive-album&customerid=2587`}
              endIcon={<ExternalLink size={14} />}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "#E2E8F0",
                textTransform: "none",
                fontSize: "0.82rem",
                "&:hover": { borderColor: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.1)" },
              }}
            >
              Test Exclusive Album
            </Button>
            <Button
              variant="outlined"
              size="small"
              target="_blank"
              href={`/api/sqlite/store-init?domain=${encodeURIComponent(activeDomain)}`}
              endIcon={<ExternalLink size={14} />}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "#E2E8F0",
                textTransform: "none",
                fontSize: "0.82rem",
                "&:hover": { borderColor: "#A855F7", backgroundColor: "rgba(168, 85, 247, 0.1)" },
              }}
            >
              View Local StoreInit
            </Button>
          </Box>
        </Box>

        {/* Domain Selection Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 4,
            backgroundColor: "#131C2E",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "14px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2.5,
          }}
        >
          <Box sx={{ minWidth: 260 }}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "#94A3B8" }}>Select Target Domain</InputLabel>
              <Select
                value={targetDomain}
                label="Select Target Domain"
                onChange={(e) => handleDomainChange(e.target.value)}
                sx={{
                  color: "#FFFFFF",
                  backgroundColor: "#1E293B",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.15)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#38BDF8" },
                }}
              >
                {KNOWN_DOMAINS.map((dom) => (
                  <MenuItem key={dom} value={dom}>
                    {dom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1, width: "100%" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Or enter custom domain (e.g. beluxjewel.web)"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              label="Custom Domain Override"
              InputLabelProps={{ sx: { color: "#94A3B8" } }}
              InputProps={{
                sx: {
                  color: "#FFFFFF",
                  backgroundColor: "#1E293B",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.15)" },
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Active Database:
            </Typography>
            <Chip
              label={activeDomain}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: "0.85rem", borderColor: "#38BDF8", color: "#38BDF8" }}
            />
          </Box>
        </Paper>

        {/* 1-Click Master Pipeline Button */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(147, 51, 234, 0.25) 100%)",
            border: "1px solid rgba(96, 165, 250, 0.3)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Sparkles size={20} color="#FBBF24" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
                1-Click Master Push & Sync Pipeline
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#CBD5E1" }}>
              Sequentially triggers StoreInit → Products Policy → Articles Policy → Packages → Menus → Albums → Content → Stock → Flush WAL.
            </Typography>
          </Box>

          <Button
            variant="contained"
            disabled={isRunningAll || Boolean(runningStep)}
            onClick={handleRunAllPipeline}
            startIcon={isRunningAll ? <RotateCw className="animate-spin" size={18} /> : <Play size={18} />}
            sx={{
              backgroundColor: "#2563EB",
              px: 4,
              py: 1.25,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)",
              "&:hover": { backgroundColor: "#1D4ED8" },
            }}
          >
            {isRunningAll ? `Running Pipeline (${activeStepIndex}/9)...` : "Run Full Pipeline Now"}
          </Button>
        </Paper>

        {isRunningAll && (
          <Box sx={{ mb: 4 }}>
            <LinearProgress sx={{ borderRadius: "4px", height: 6, backgroundColor: "#1E293B" }} />
          </Box>
        )}

        {/* Configuration JSON Editors Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* StoreInit Config */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: "#131C2E",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Store size={18} color="#38BDF8" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
                    Store Init Payload
                  </Typography>
                </Box>
                <Chip label="POST /api/sqlite/store-init" size="small" sx={{ backgroundColor: "rgba(56, 189, 248, 0.15)", color: "#38BDF8", fontSize: "0.72rem" }} />
              </Box>

              <TextField
                multiline
                rows={9}
                fullWidth
                value={storeInitPayloadStr}
                onChange={(e) => setStoreInitPayloadStr(e.target.value)}
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  backgroundColor: "#0B0F19",
                  borderRadius: "8px",
                  "& .MuiInputBase-input": { color: "#38BDF8", fontFamily: "Consolas, monospace", fontSize: "0.85rem" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.1)" },
                }}
              />

              <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={Boolean(runningStep)}
                  onClick={handlePushStoreInit}
                  startIcon={runningStep === "store-init" ? <RotateCw className="animate-spin" size={16} /> : <Play size={16} />}
                  sx={{
                    backgroundColor: "#0284C7",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#0369A1" },
                  }}
                >
                  Push Store Init
                </Button>
                <Button
                  variant="outlined"
                  disabled={Boolean(runningStep)}
                  onClick={handleInspectStoreInit}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "#E2E8F0",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Verify
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Policy Pricing Config */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: "#131C2E",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Layers size={18} color="#C084FC" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
                    Policy Configuration (Products, Articles & Stock List)
                  </Typography>
                </Box>
                <Chip label="Config [...]" size="small" sx={{ backgroundColor: "rgba(192, 132, 252, 0.15)", color: "#C084FC", fontSize: "0.72rem" }} />
              </Box>

              <TextField
                multiline
                rows={9}
                fullWidth
                value={policyPayloadStr}
                onChange={(e) => setPolicyPayloadStr(e.target.value)}
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  backgroundColor: "#0B0F19",
                  borderRadius: "8px",
                  "& .MuiInputBase-input": { color: "#C084FC", fontFamily: "Consolas, monospace", fontSize: "0.85rem" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.1)" },
                }}
              />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
                <Button
                  sx={{
                    flex: 1,
                    minWidth: "120px",
                    backgroundColor: "#7E22CE",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#6B21A8" },
                  }}
                  variant="contained"
                  disabled={Boolean(runningStep)}
                  onClick={handlePushProducts}
                  startIcon={runningStep === "products" ? <RotateCw className="animate-spin" size={16} /> : <Play size={16} />}
                >
                  Sync Products
                </Button>
                <Button
                  sx={{
                    flex: 1,
                    minWidth: "120px",
                    backgroundColor: "#9333EA",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#7E22CE" },
                  }}
                  variant="contained"
                  disabled={Boolean(runningStep)}
                  onClick={handlePushArticles}
                  startIcon={runningStep === "articles" ? <RotateCw className="animate-spin" size={16} /> : <Play size={16} />}
                >
                  Sync Articles
                </Button>
                <Button
                  sx={{
                    flex: 1,
                    minWidth: "120px",
                    backgroundColor: "#059669",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#047857" },
                  }}
                  variant="contained"
                  disabled={Boolean(runningStep)}
                  onClick={handleSyncStock}
                  startIcon={runningStep === "stock" ? <RotateCw className="animate-spin" size={16} /> : <Play size={16} />}
                >
                  Sync Stock List
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Individual Step Action Buttons Grid */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: "#131C2E",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "14px",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#FFFFFF", mb: 2 }}>
            Individual Master Sync Endpoints
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2.4}>
              <Button
                fullWidth
                variant="outlined"
                disabled={Boolean(runningStep)}
                onClick={handleSyncPackages}
                startIcon={<Boxes size={16} />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#E2E8F0",
                  textTransform: "none",
                  py: 1.25,
                  fontSize: "0.85rem",
                  "&:hover": { borderColor: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.08)" },
                }}
              >
                Package Master
              </Button>
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <Button
                fullWidth
                variant="outlined"
                disabled={Boolean(runningStep)}
                onClick={handleSyncMenus}
                startIcon={<FolderTree size={16} />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#E2E8F0",
                  textTransform: "none",
                  py: 1.25,
                  fontSize: "0.85rem",
                  "&:hover": { borderColor: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.08)" },
                }}
              >
                Menus Master
              </Button>
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <Button
                fullWidth
                variant="outlined"
                disabled={Boolean(runningStep)}
                onClick={handleSyncAlbums}
                startIcon={<Image size={16} />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#E2E8F0",
                  textTransform: "none",
                  py: 1.25,
                  fontSize: "0.85rem",
                  "&:hover": { borderColor: "#EC4899", backgroundColor: "rgba(236, 72, 153, 0.08)" },
                }}
              >
                Exclusive Albums
              </Button>
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <Button
                fullWidth
                variant="outlined"
                disabled={Boolean(runningStep)}
                onClick={handleSyncStock}
                startIcon={<FileCode size={16} />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#E2E8F0",
                  textTransform: "none",
                  py: 1.25,
                  fontSize: "0.85rem",
                  "&:hover": { borderColor: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.08)" },
                }}
              >
                Stock List
              </Button>
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <Button
                fullWidth
                variant="outlined"
                disabled={Boolean(runningStep)}
                onClick={handleFlushWal}
                startIcon={<Database size={16} />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#F59E0B",
                  textTransform: "none",
                  py: 1.25,
                  fontSize: "0.85rem",
                  "&:hover": { borderColor: "#F59E0B", backgroundColor: "rgba(245, 158, 11, 0.08)" },
                }}
              >
                Flush WAL Checkpoint
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Live Terminal & Logs Output */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "#0B0F19",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "14px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Terminal size={20} color="#38BDF8" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
                Execution Console & Response Logs
              </Typography>
              <Chip label={`${logs.length} events`} size="small" sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#94A3B8" }} />
            </Box>

            {logs.length > 0 && (
              <Button
                size="small"
                onClick={() => setLogs([])}
                sx={{ color: "#94A3B8", textTransform: "none", fontSize: "0.78rem" }}
              >
                Clear Console
              </Button>
            )}
          </Box>

          {logs.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
                color: "#64748B",
                fontFamily: "Consolas, monospace",
                fontSize: "0.85rem",
              }}
            >
              No API requests dispatched yet. Click "Run Full Pipeline Now" or an individual button above.
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxHeight: 520, overflowY: "auto", pr: 1 }}>
              {logs.map((log, index) => {
                const isSuccess = log.type === "success";
                const isError = log.type === "error";
                const isStart = log.type === "start";

                return (
                  <Box
                    key={log.id}
                    sx={{
                      p: 2,
                      backgroundColor: "#131C2E",
                      borderLeft: `4px solid ${isSuccess ? "#10B981" : isError ? "#EF4444" : isStart ? "#38BDF8" : "#818CF8"
                        }`,
                      borderRadius: "6px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {isSuccess && <CheckCircle2 size={16} color="#10B981" />}
                        {isError && <AlertCircle size={16} color="#EF4444" />}
                        {isStart && <RotateCw size={16} color="#38BDF8" className="animate-spin" />}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: isSuccess ? "#A7F3D0" : isError ? "#FCA5A5" : "#E2E8F0",
                            fontFamily: "Consolas, monospace",
                          }}
                        >
                          {log.title}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {log.duration !== null && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#64748B", fontSize: "0.75rem" }}>
                            <Clock size={12} />
                            <span>{log.duration}ms</span>
                          </Box>
                        )}
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          {log.timestamp}
                        </Typography>
                        {log.data && (
                          <Tooltip title={copiedLogIndex === index ? "Copied!" : "Copy JSON"}>
                            <IconButton
                              size="small"
                              onClick={() => copyLogData(index, log.data)}
                              sx={{ color: "#94A3B8", p: "2px" }}
                            >
                              {copiedLogIndex === index ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>

                    {log.data && (
                      <Box
                        component="pre"
                        sx={{
                          mt: 1,
                          p: 1.5,
                          backgroundColor: "#0B0F19",
                          borderRadius: "4px",
                          color: "#94A3B8",
                          fontSize: "0.78rem",
                          fontFamily: "Consolas, monospace",
                          overflowX: "auto",
                          maxHeight: 180,
                        }}
                      >
                        {JSON.stringify(log.data, null, 2)}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
