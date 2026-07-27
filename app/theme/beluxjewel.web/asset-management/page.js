"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  TextField,
  InputAdornment,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import StorageIcon from "@mui/icons-material/Storage";
import {
  Camera,
  Share2,
  FileText,
  Image as LucideImageIcon,
  Layers,
  Sparkles,
  Lock,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Cookies from "js-cookie";
import {
  GetAssetMasterAPI,
  GetAssetNodesAPI,
  handleDownloadFile,
} from "@/app/(core)/utils/API/AssetManagementAPI/AssetManagementAPI";
import "./AssetManagement.scss";


const getCategoryDetails = (title = "", index = 0) => {
  const lower = title.toLowerCase();
  if (lower.includes("photo") || lower.includes("image")) {
    return {
      icon: Camera,
      badge: "Approved Partners",
      badgeType: "approved",
      desc: "High-resolution product images for all catalog styles, optimized for web and print use.",
    };
  }
  if (
    lower.includes("social") ||
    lower.includes("media") ||
    lower.includes("creative")
  ) {
    return {
      icon: Share2,
      badge: "Approved Partners",
      badgeType: "approved",
      desc: "Ready-to-use social media graphics and templates for Instagram, Facebook and Pinterest.",
    };
  }
  if (
    lower.includes("pdf") ||
    lower.includes("catalog") ||
    lower.includes("doc")
  ) {
    return {
      icon: FileText,
      badge: "Approved Partners",
      badgeType: "approved",
      desc: "Downloadable PDF catalogs for all jewelry collections, updated seasonally.",
    };
  }
  if (lower.includes("banner") || lower.includes("promo")) {
    return {
      icon: LucideImageIcon,
      badge: "Approved Partners",
      badgeType: "approved",
      desc: "Web and print-ready marketing banners for promotions and seasonal campaigns.",
    };
  }
  if (lower.includes("private") || lower.includes("label")) {
    return {
      icon: Layers,
      badge: "Private Label Partners",
      badgeType: "private",
      desc: "Custom-branded marketing materials for private-label jewelry lines.",
    };
  }
  if (
    lower.includes("logo") ||
    lower.includes("custom") ||
    lower.includes("retailer")
  ) {
    return {
      icon: Sparkles,
      badge: "Coming Soon",
      badgeType: "soon",
      desc: "Add your retail brand to selected marketing templates. Available for qualifying partners.",
    };
  }

  const presets = [
    {
      icon: Camera,
      badge: "Approved Partners",
      badgeType: "approved",
      desc: "High-resolution product images for all catalog styles, optimized for web and print use.",
    },
    {
      icon: Share2,
      badge: "Approved Partners",
      badgeType: "approved",
      desc: "Ready-to-use social media graphics and templates for Instagram, Facebook and Pinterest.",
    },
    {
      icon: FileText,
      badge: "Approved Partners",
      badgeType: "approved",
      desc: "Downloadable PDF catalogs for all jewelry collections, updated seasonally.",
    },
    {
      icon: LucideImageIcon,
      badge: "Approved Partners",
      badgeType: "approved",
      desc: "Web and print-ready marketing banners for promotions and seasonal campaigns.",
    },
    {
      icon: Layers,
      badge: "Private Label Partners",
      badgeType: "private",
      desc: "Custom-branded marketing materials for private-label jewelry lines.",
    },
    {
      icon: Sparkles,
      badge: "Coming Soon",
      badgeType: "soon",
      desc: "Add your retail brand to selected marketing templates. Available for qualifying partners.",
    },
  ];

  return presets[index % presets.length];
};

const getBadgeStyle = (type) => {
  switch (type) {
    case "approved":
      return {
        bgcolor: "#D8EBF3",
        color: "#0F3F56",
        borderColor: "#B8DFEE",
      };
    case "private":
      return {
        bgcolor: "#E3F2F9",
        color: "#0C4761",
        borderColor: "#C5E6F5",
      };
    case "soon":
      return {
        bgcolor: "#FCEBE6",
        color: "#A03C25",
        borderColor: "#F7D6CC",
      };
    default:
      return {
        bgcolor: "#D8EBF3",
        color: "#0F3F56",
        borderColor: "#B8DFEE",
      };
  }
};

/**
 * Dynamically extracts CompanyDbName from base64 encoded YearCode in storeInit.
 * Example YearCode: "e3tuemVufX17ezIwfX17e2RlbW9zdG9yZX19e3tkZW1vc3RvcmV9fQ=="
 * Decodes to: "{{nzen}}{{20}}{{demostore}}{{demostore}}"
 * Extracts 3rd bracket value (index 2): "demostore"
 */
const getCompanyDbFromYearCode = () => {
  if (typeof window !== "undefined") {
    const storeInit = window.__STORE_INIT__ || getSession("storeInit");
    const yearCode = storeInit?.YearCode;
    if (yearCode) {
      try {
        const decoded = atob(yearCode);
        const parts = decoded.match(/\{\{([^}]+)\}\}/g);
        if (parts && parts.length >= 3) {
          const dbName = parts[2].replace(/[{}]/g, "").trim();
          if (dbName) return dbName;
        }
      } catch (e) {
        console.error("Error decoding YearCode for CompanyDbName:", e);
      }
    }
    if (storeInit?.CompanyDbName) return storeInit.CompanyDbName;
  }
  return "";
};

const getUserEmailFromSession = () => {
  if (typeof window !== "undefined") {
    const loginInfo = getSession("loginUserDetail");
    return loginInfo?.userid || loginInfo?.EmailId || "";
  }
  return "";
};

const getYearCodeFromSession = () => {
  if (typeof window !== "undefined") {
    const storeInit = window.__STORE_INIT__ || getSession("storeInit");
    return storeInit?.YearCode || "";
  }
  return "";
};

function AssetManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { islogin } = useStore();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication Protection Effect
  useEffect(() => {
    let loggedIn = false;
    if (typeof window !== "undefined") {
      const cookieToken = Cookies.get("userLoginCookie");
      const cookieLoginUser = Cookies.get("LoginUser");
      const sessionLoginUser = getSession("LoginUser");
      const sessionUserDetail =
        getSession("loginUserDetail") || window.__LOGIN_USER_DETAIL__;

      loggedIn = Boolean(
        islogin ||
          cookieToken ||
          cookieLoginUser === "true" ||
          sessionLoginUser === true ||
          (sessionUserDetail &&
            (sessionUserDetail?.id ||
              sessionUserDetail?.userid ||
              sessionUserDetail?.EmailId)),
      );
    }

    setIsAuthenticated(loggedIn);
    setAuthChecked(true);

    if (!loggedIn) {
      const redirectUrl = `/LoginOption?LoginRedirect=${encodeURIComponent("/asset-management")}`;
      router.replace(redirectUrl);
    }
  }, [islogin, router]);

  const [userInfo, setUserInfo] = useState({
    email: "",
    companyDb: "",
    yearCode: "",
  });
  const [masters, setMasters] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(true);
  const [selectedMasterId, setSelectedMasterId] = useState(null);

  const [nodes, setNodes] = useState([]);
  const [loadingNodes, setLoadingNodes] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingNodeId, setDownloadingNodeId] = useState(null);

  // View Mode: 'grid' | 'list'
  const [viewMode, setViewMode] = useState("grid");

  // File Preview Modal State
  const [previewFile, setPreviewFile] = useState(null);

  // Helper to update URL query params without full page reload
  const updateUrl = (masterId, nodeId) => {
    const params = new URLSearchParams();
    if (masterId) params.set("masterId", String(masterId));
    if (nodeId) params.set("nodeId", String(nodeId));
    const queryStr = params.toString();
    router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, {
      scroll: false,
    });
  };

  // Single mount effect: resolve session parameters dynamically and load masters once if authenticated
  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;

    const email = getUserEmailFromSession();
    const companyDb = getCompanyDbFromYearCode();
    const yearCode = getYearCodeFromSession();
    setUserInfo({ email, companyDb, yearCode });

    const fetchMasters = async () => {
      setLoadingMasters(true);
      try {
        const res = await GetAssetMasterAPI({}, email, companyDb, yearCode);
        const activeMasters = (res || []).filter((m) => m.IsActive !== false);
        activeMasters.sort((a, b) => {
          const rowA = Number(a.RowNum) || 0;
          const rowB = Number(b.RowNum) || 0;
          if (rowA !== rowB) return rowA - rowB;
          return (a.Title || "").localeCompare(b.Title || "");
        });

        setMasters(activeMasters);

        const urlMasterId = searchParams.get("masterId");
        const matchedMaster = activeMasters.find(
          (m) => String(m.Id) === String(urlMasterId),
        );

        if (matchedMaster) {
          setSelectedMasterId(String(matchedMaster.Id));
        } else {
          setSelectedMasterId(null);
        }
      } catch (err) {
        console.error("Failed to fetch masters:", err);
        toast.error("Failed to load asset categories.");
      } finally {
        setLoadingMasters(false);
      }
    };

    fetchMasters();
  }, [authChecked, isAuthenticated]);

  // Fetch Nodes when selectedMasterId changes
  useEffect(() => {
    if (!selectedMasterId) {
      setNodes([]);
      setCurrentNodeId(null);
      return;
    }

    let isMounted = true;
    const fetchNodes = async () => {
      setLoadingNodes(true);
      try {
        const res = await GetAssetNodesAPI(
          selectedMasterId,
          userInfo.email,
          userInfo.companyDb,
          userInfo.yearCode,
        );
        if (!isMounted) return;
        setNodes(res || []);

        const urlNodeId = searchParams.get("nodeId");
        const matchedNode = (res || []).find(
          (n) => String(n.Id) === String(urlNodeId),
        );

        if (matchedNode) {
          setCurrentNodeId(String(matchedNode.Id));
        } else {
          const rootNode = (res || []).find(
            (n) => n.ParentId === null || n.ParentId === undefined,
          );
          const initialNodeId = rootNode ? String(rootNode.Id) : null;
          setCurrentNodeId(initialNodeId);
          updateUrl(selectedMasterId, initialNodeId);
        }
      } catch (err) {
        console.error("Failed to fetch nodes:", err);
        toast.error("Failed to load folder contents.");
      } finally {
        if (isMounted) setLoadingNodes(false);
      }
    };

    fetchNodes();
    return () => {
      isMounted = false;
    };
  }, [selectedMasterId, userInfo.email, userInfo.companyDb, userInfo.yearCode]);

  // Handle Category Master click
  const handleSelectMaster = (masterId) => {
    const targetId = String(masterId);
    setSelectedMasterId(targetId);
    setCurrentNodeId(null);
    updateUrl(targetId, null);
  };

  // Handle Back to All Categories click
  const handleBackToCategories = () => {
    setSelectedMasterId(null);
    setCurrentNodeId(null);
    setNodes([]);
    updateUrl(null, null);
  };

  // Handle Folder Node click
  const handleOpenFolder = (folderId) => {
    const targetId = String(folderId);
    setCurrentNodeId(targetId);
    updateUrl(selectedMasterId, targetId);
  };

  // Active Category Master Object
  const activeMaster = useMemo(
    () => masters.find((m) => String(m.Id) === String(selectedMasterId)),
    [masters, selectedMasterId],
  );

  // Current Node Object
  const currentNodeObj = useMemo(() => {
    if (!currentNodeId) return null;
    return nodes.find((n) => String(n.Id) === String(currentNodeId)) || null;
  }, [nodes, currentNodeId]);

  // Compute Breadcrumb Trail from Root to Current Node
  const breadcrumbTrail = useMemo(() => {
    if (!currentNodeObj || !nodes.length) return [];
    const trail = [];
    let curr = currentNodeObj;
    const visited = new Set();

    while (curr && !visited.has(curr.Id)) {
      visited.add(curr.Id);
      trail.push(curr);
      if (!curr.ParentId) break;
      curr = nodes.find((n) => String(n.Id) === String(curr.ParentId));
    }
    return trail.reverse();
  }, [currentNodeObj, nodes]);

  // Map of child item counts per folder
  const childCountsMap = useMemo(() => {
    const map = {};
    nodes.forEach((node) => {
      if (node.ParentId) {
        const pId = String(node.ParentId);
        map[pId] = (map[pId] || 0) + 1;
      }
    });
    return map;
  }, [nodes]);

  // Filter items in current node by search query and parent node ID
  const currentChildren = useMemo(() => {
    if (!nodes.length) return [];

    let targetParentId = currentNodeId;
    if (!targetParentId) {
      const root = nodes.find((n) => !n.ParentId);
      if (root) targetParentId = String(root.Id);
    }

    let items = nodes.filter((n) => {
      if (!targetParentId) return !n.ParentId;
      return String(n.ParentId) === String(targetParentId);
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (n) =>
          (n.Name || "").toLowerCase().includes(q) ||
          (n.OriginalFileName || "").toLowerCase().includes(q),
      );
    }

    return items.sort((a, b) => {
      if (a.NodeType === "folder" && b.NodeType !== "folder") return -1;
      if (a.NodeType !== "folder" && b.NodeType === "folder") return 1;
      return (a.Name || "").localeCompare(b.Name || "");
    });
  }, [nodes, currentNodeId, searchQuery]);

  // Auth checking fallback UI
  if (!authChecked) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#114D6E" }} />
        <Typography variant="body2" sx={{ color: "#666", letterSpacing: "1px" }}>
          Verifying access permissions...
        </Typography>
      </Box>
    );
  }

  // Access Denied / Login Required UI
  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 12, display: "flex", justifyContent: "center" }}>
        <Card
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: "16px",
            border: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
            maxWidth: 540,
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "rgba(17, 77, 110, 0.08)",
              color: "#114D6E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <Lock size={36} />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#114D6E", mb: 1.5, letterSpacing: "-0.5px" }}
          >
            Login Required
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}>
            Access to our private B2B design catalogue & asset management library is restricted to logged-in partners only. Please log in to continue.
          </Typography>
          <Button
            variant="contained"
            onClick={() =>
              router.push(
                `/LoginOption?LoginRedirect=${encodeURIComponent("/asset-management")}`,
              )
            }
            sx={{
              py: 1.5,
              px: 5,
              backgroundColor: "#114D6E",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.95rem",
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(17, 77, 110, 0.3)",
              "&:hover": {
                backgroundColor: "#0d3b54",
              },
            }}
          >
            Log In to Access Assets
          </Button>
        </Card>
      </Container>
    );
  }



  // Handle File Download
  const handleDownload = async (fileNode) => {
    setDownloadingNodeId(fileNode.Id);
    await handleDownloadFile(
      fileNode,
      (errMsg) => {
        toast.error(errMsg);
      },
      userInfo.email,
      userInfo.companyDb,
      userInfo.yearCode,
    );
    setDownloadingNodeId(null);
    toast.success(
      `Download initiated for ${fileNode.OriginalFileName || fileNode.Name}`,
    );
  };

  // Format byte sizes
  const formatSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "—";
    const b = parseInt(bytes, 10);
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Render File Type Icon
  const getFileIcon = (fileNode, size = "2rem") => {
    const category = (fileNode.FileCategory || "").toLowerCase();
    const ext = (fileNode.FileExtension || "").toLowerCase();

    if (category === "image" || ["png", "jpg", "jpeg", "webp"].includes(ext)) {
      return <ImageIcon sx={{ color: "#114D6E", fontSize: size }} />;
    }
    if (category === "video" || ["mp4", "webm", "mov"].includes(ext)) {
      return <VideocamIcon sx={{ color: "#d32f2f", fontSize: size }} />;
    }
    if (ext === "pdf") {
      return <PictureAsPdfIcon sx={{ color: "#e53935", fontSize: size }} />;
    }
    return (
      <InsertDriveFileOutlinedIcon sx={{ color: "#555555", fontSize: size }} />
    );
  };

  if (loadingMasters) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#114D6E" }} />
        <Typography
          variant="body2"
          sx={{ color: "#666", letterSpacing: "1px" }}
        >
          Loading asset categories...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="assetContainer">
      {!selectedMasterId ? (
        /* ─── Overview Mode: Category Cards Grid ───────────────────────────────── */
        <>
          {/* Header Section */}
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 6, md: 8 },
              bgcolor: "#FFFFFF",
            }}
          >
            <Container maxWidth="lg">
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#5B8AA2",
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                AVAILABLE TO PARTNERS
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "Prata, Playfair Display, serif",
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "2.75rem" },
                  fontWeight: 700,
                  color: "#0C2E40",
                  letterSpacing: "-0.5px",
                  mb: 1.5,
                }}
              >
                Marketing Asset Library
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                  color: "#5A7180",
                  maxWidth: "600px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Access professional marketing resources to support your retail
                jewelry business. Click any category card to explore folders and
                files.
              </Typography>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  mb: 3,
                  textTransform: "uppercase",
                  fontSize: "0.78rem",
                  color: "#5B8AA2",
                  textAlign: "center",
                }}
              >
                SELECT A MARKETING CATEGORY
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {masters.map((cat, idx) => {
                  const details = getCategoryDetails(cat.Title, idx);
                  const IconComponent = details.icon;
                  const badgeStyle = getBadgeStyle(details.badgeType);

                  return (
                    <Card
                      key={cat.Id}
                      onClick={() => handleSelectMaster(cat.Id)}
                      elevation={0}
                      sx={{
                        backgroundColor: "#F2F7FA",
                        borderRadius: "18px",
                        border: "1px solid #E1EDF3",
                        p: { xs: 3, sm: 3.5 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "220px",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 14px 35px rgba(12, 46, 64, 0.09)",
                          borderColor: "#0C2E40",
                        },
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 3,
                          }}
                        >
                          <Box
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: "50%",
                              bgcolor: "#0C2E40",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#FFFFFF",
                              boxShadow: "0 4px 12px rgba(12, 46, 64, 0.2)",
                            }}
                          >
                            <IconComponent size={20} />
                          </Box>

                          <Chip
                            label={details.badge}
                            sx={{
                              bgcolor: badgeStyle.bgcolor,
                              color: badgeStyle.color,
                              border: `1px solid ${badgeStyle.borderColor}`,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              height: "26px",
                              borderRadius: "20px",
                              px: 0.5,
                            }}
                          />
                        </Box>

                        <Typography
                          variant="h5"
                          sx={{
                            fontFamily: "Prata, Playfair Display, serif",
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "#0C2E40",
                            mb: 1,
                          }}
                        >
                          {cat.Title}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "0.88rem",
                            color: "#5A7180",
                            lineHeight: 1.6,
                          }}
                        >
                          {cat.Description || details.desc}
                        </Typography>
                      </Box>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          </Container>
        </>
      ) : (
        /* ─── Folder & File Explorer Mode ─────────────────────────────────────── */
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Back to All Categories Bar */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              pb: 2.5,
              borderBottom: "1px solid #E1EDF3",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBackToCategories}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#0C2E40",
                borderColor: "#0C2E40",
                borderRadius: "30px",
                px: 3,
                py: 0.9,
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#F2F7FA",
                  borderColor: "#0C2E40",
                },
              }}
            >
              Back to All Categories
            </Button>

            <Chip
              label={`Category: ${activeMaster?.Title || "Selected Category"}`}
              sx={{
                bgcolor: "#0C2E40",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.85rem",
                px: 1.5,
                height: "34px",
                borderRadius: "20px",
              }}
            />
          </Box>

          {/* Toolbar: Breadcrumbs, View Switcher & Search */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            sx={{ mb: 4 }}
          >
            {/* Breadcrumb Navigation */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {breadcrumbTrail.length > 1 && (
                <Tooltip title="Go to Parent Folder">
                  <IconButton
                    size="small"
                    onClick={() => {
                      const parentNode =
                        breadcrumbTrail[breadcrumbTrail.length - 2];
                      if (parentNode) handleOpenFolder(parentNode.Id);
                    }}
                    sx={{ border: "1px solid #eaeaea", borderRadius: "0px" }}
                  >
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="folder breadcrumb"
                sx={{ "& .MuiBreadcrumbs-li": { fontSize: "0.9rem" } }}
              >
                {breadcrumbTrail.map((item, index) => {
                  const isLast = index === breadcrumbTrail.length - 1;
                  return isLast ? (
                    <Typography
                      key={item.Id}
                      sx={{ color: "#114D6E", fontWeight: 700 }}
                    >
                      {item.Name || activeMaster?.Title}
                    </Typography>
                  ) : (
                    <MuiLink
                      key={item.Id}
                      underline="hover"
                      color="inherit"
                      sx={{ cursor: "pointer", fontWeight: 500 }}
                      onClick={() => handleOpenFolder(item.Id)}
                    >
                      {item.Name || activeMaster?.Title}
                    </MuiLink>
                  );
                })}
              </Breadcrumbs>
            </Box>

            {/* Right Controls: View Switcher (Grid / List) & Search */}
            <Stack direction="row" spacing={2} alignItems="center">
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, val) => val && setViewMode(val)}
                size="small"
                sx={{ border: "1px solid #eaeaea", borderRadius: "0px" }}
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <Tooltip title="Grid View">
                    <GridViewIcon fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  <Tooltip title="List View">
                    <ViewListIcon fontSize="small" />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <TextField
                placeholder="Filter contents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  maxWidth: { xs: "100%", md: "260px" },
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0px",
                    bgcolor: "#ffffff",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#888", fontSize: "1.2rem" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>

          {/* Nodes Content */}
          {loadingNodes ? (
            <Box
              sx={{
                py: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <CircularProgress size={32} sx={{ color: "#114D6E" }} />
              <Typography variant="body2" sx={{ color: "#777" }}>
                Loading folder nodes...
              </Typography>
            </Box>
          ) : viewMode === "grid" ? (
            /* GRID VIEW */
            <Grid container spacing={3}>
              {currentChildren.map((item) => {
                const isFolder = item.NodeType === "folder";

                if (isFolder) {
                  const childCount = childCountsMap[String(item.Id)] || 0;
                  return (
                    <Grid item key={item.Id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card
                        className="assetCard"
                        onClick={() => handleOpenFolder(item.Id)}
                        sx={{
                          p: 2.5,
                          cursor: "pointer",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <FolderIcon
                          sx={{ color: "#114D6E", fontSize: "2.8rem" }}
                        />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle1"
                            noWrap
                            sx={{ fontWeight: 600, color: "#1a1a1a" }}
                          >
                            {item.Name}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mt: 0.5 }}
                          >
                            <Chip
                              label={`${childCount} ${childCount === 1 ? "item" : "items"}`}
                              size="small"
                              sx={{
                                fontSize: "0.65rem",
                                height: "18px",
                                bgcolor: "#f0f4f8",
                                color: "#114D6E",
                                fontWeight: 600,
                              }}
                            />
                          </Stack>
                        </Box>
                        <NavigateNextIcon sx={{ color: "#ccc" }} />
                      </Card>
                    </Grid>
                  );
                }

                // File Node Grid
                const fileSizeStr = formatSize(item.FileSizeBytes);
                const displayName = item.OriginalFileName || item.Name;
                const isDownloading = downloadingNodeId === item.Id;

                return (
                  <Grid item key={item.Id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                      className="assetCard"
                      sx={{
                        p: 2.5,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Media Preview or Icon Header */}
                      <Box
                        sx={{
                          width: "100%",
                          height: "180px",
                          bgcolor: "#f9f9f9",
                          borderBottom: "1px solid #f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          mb: 2,
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                        onClick={() => setPreviewFile(item)}
                      >
                        {item.FileCategory === "image" && item.StoragePath ? (
                          <Box
                            component="img"
                            src={item.StoragePath}
                            alt={displayName}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              p: 1,
                            }}
                          />
                        ) : (
                          getFileIcon(item, "2.5rem")
                        )}

                        {/* File Type & Provider Badges */}
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{ position: "absolute", top: 8, left: 8 }}
                        >
                          {item.FileExtension && (
                            <Chip
                              label={(item.FileExtension || "").toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: "#114D6E",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                height: "20px",
                                borderRadius: "2px",
                              }}
                            />
                          )}
                          {item.StorageProvider && (
                            <Chip
                              icon={
                                <StorageIcon
                                  sx={{
                                    fontSize: "0.8rem !important",
                                    color: "#666",
                                  }}
                                />
                              }
                              label={item.StorageProvider}
                              size="small"
                              sx={{
                                bgcolor: "rgba(255,255,255,0.9)",
                                color: "#444",
                                fontWeight: 600,
                                fontSize: "0.65rem",
                                height: "20px",
                                borderRadius: "2px",
                              }}
                            />
                          )}
                        </Stack>

                        {fileSizeStr && (
                          <Chip
                            label={fileSizeStr}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              fontWeight: 600,
                              fontSize: "0.68rem",
                              borderRadius: "2px",
                            }}
                          />
                        )}

                        {/* Quick Preview Hover Button */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            p: 0.5,
                            borderRadius: "2px",
                            display: "flex",
                            alignItems: "center",
                            "&:hover": { bgcolor: "#114D6E" },
                          }}
                        >
                          <Tooltip title="Preview File">
                            <VisibilityIcon sx={{ fontSize: "1rem" }} />
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Meta info */}
                      <Stack spacing={0.8} sx={{ flexGrow: 1, mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          title={displayName}
                          onClick={() => setPreviewFile(item)}
                          sx={{
                            fontWeight: 600,
                            color: "#1a1a1a",
                            fontSize: "0.95rem",
                            lineHeight: 1.3,
                            wordBreak: "break-word",
                            cursor: "pointer",
                            "&:hover": { color: "#114D6E" },
                          }}
                        >
                          {displayName}
                        </Typography>

                        {item.FileCategory && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#888",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              fontWeight: 600,
                            }}
                          >
                            {item.FileCategory} •{" "}
                            {item.MimeType || item.FileExtension || "file"}
                          </Typography>
                        )}
                      </Stack>

                      {/* Action Strip */}
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setPreviewFile(item)}
                          startIcon={<VisibilityIcon />}
                          sx={{
                            borderRadius: "0px",
                            borderColor: "#eaeaea",
                            color: "#555",
                            flex: 1,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          disabled={isDownloading}
                          onClick={() => handleDownload(item)}
                          startIcon={
                            isDownloading ? (
                              <CircularProgress size={14} color="inherit" />
                            ) : (
                              <CloudDownloadOutlinedIcon />
                            )
                          }
                          sx={{
                            borderRadius: "0px",
                            bgcolor: "#114D6E",
                            color: "#fff",
                            flex: 1,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": { bgcolor: "#0d3c56" },
                          }}
                        >
                          Download
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                );
              })}

              {currentChildren.length === 0 && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      py: 10,
                      textAlign: "center",
                      bgcolor: "#fafafa",
                      border: "1px dashed #e0e0e0",
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "#555", mb: 1, fontWeight: 500 }}
                    >
                      No items found in this folder
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      {searchQuery
                        ? `No files or subfolders match "${searchQuery}"`
                        : "This folder node is currently empty."}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          ) : (
            /* LIST VIEW TABLE */
            <Box sx={{ border: "1px solid #eaeaea", bgcolor: "#ffffff" }}>
              <Table size="medium">
                <TableHead sx={{ bgcolor: "#fafafa" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>
                      NAME
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>
                      TYPE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>
                      SIZE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>
                      PROVIDER
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, fontSize: "0.8rem" }}
                    >
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentChildren.map((item) => {
                    const isFolder = item.NodeType === "folder";
                    const displayName = item.OriginalFileName || item.Name;
                    const fileSizeStr = formatSize(item.FileSizeBytes);
                    const isDownloading = downloadingNodeId === item.Id;

                    if (isFolder) {
                      const childCount = childCountsMap[String(item.Id)] || 0;
                      return (
                        <TableRow
                          key={item.Id}
                          hover
                          onClick={() => handleOpenFolder(item.Id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <FolderIcon
                                sx={{ color: "#114D6E", fontSize: "1.5rem" }}
                              />
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600 }}
                              >
                                {item.Name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`Folder (${childCount})`}
                              size="small"
                              sx={{
                                fontSize: "0.7rem",
                                height: "20px",
                                bgcolor: "#f0f4f8",
                                color: "#114D6E",
                              }}
                            />
                          </TableCell>
                          <TableCell>—</TableCell>
                          <TableCell>—</TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              onClick={() => handleOpenFolder(item.Id)}
                              endIcon={<NavigateNextIcon />}
                              sx={{
                                color: "#114D6E",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            >
                              Open
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    return (
                      <TableRow key={item.Id} hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ cursor: "pointer" }}
                            onClick={() => setPreviewFile(item)}
                          >
                            {getFileIcon(item, "1.5rem")}
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                "&:hover": { color: "#114D6E" },
                              }}
                            >
                              {displayName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={(
                              item.FileExtension ||
                              item.FileCategory ||
                              "file"
                            ).toUpperCase()}
                            size="small"
                            sx={{
                              fontSize: "0.65rem",
                              height: "20px",
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                        <TableCell>{fileSizeStr}</TableCell>
                        <TableCell>{item.StorageProvider || "Local"}</TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Tooltip title="Preview File">
                              <IconButton
                                size="small"
                                onClick={() => setPreviewFile(item)}
                                sx={{
                                  border: "1px solid #eaeaea",
                                  borderRadius: "0px",
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Button
                              variant="contained"
                              size="small"
                              disabled={isDownloading}
                              onClick={() => handleDownload(item)}
                              startIcon={
                                isDownloading ? (
                                  <CircularProgress size={14} color="inherit" />
                                ) : (
                                  <CloudDownloadOutlinedIcon />
                                )
                              }
                              sx={{
                                borderRadius: "0px",
                                bgcolor: "#114D6E",
                                color: "#fff",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#0d3c56" },
                              }}
                            >
                              Download
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {currentChildren.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ py: 6, color: "#888" }}
                      >
                        No items found in this folder.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </Container>
      )}

      {/* File Preview Modal / Dialog */}
      <Dialog
        open={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "2px", overflow: "hidden" },
        }}
      >
        {previewFile && (
          <>
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                bgcolor: "#fbfbfb",
                borderBottom: "1px solid #eaeaea",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: "1.1rem" }}
              >
                {previewFile.OriginalFileName || previewFile.Name}
              </Typography>
              <IconButton onClick={() => setPreviewFile(null)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, textAlign: "center" }}>
              {/* Media Preview Player / Viewer */}
              <Box
                sx={{
                  width: "100%",
                  maxHeight: "450px",
                  minHeight: "220px",
                  bgcolor: "#000",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  mb: 3,
                }}
              >
                {previewFile.FileCategory === "image" &&
                previewFile.StoragePath ? (
                  <Box
                    component="img"
                    src={previewFile.StoragePath}
                    alt={previewFile.Name}
                    sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : previewFile.FileCategory === "video" &&
                  previewFile.StoragePath ? (
                  <video
                    controls
                    autoPlay
                    src={previewFile.StoragePath}
                    style={{ width: "100%", maxHeight: "450px" }}
                  />
                ) : previewFile.StoragePath &&
                  previewFile.FileExtension === "pdf" ? (
                  <iframe
                    src={previewFile.StoragePath}
                    title={previewFile.Name}
                    style={{ width: "100%", height: "420px", border: "none" }}
                  />
                ) : (
                  <Stack
                    spacing={2}
                    alignItems="center"
                    sx={{ color: "#fff", py: 4 }}
                  >
                    {getFileIcon(previewFile, "4rem")}
                    <Typography variant="body2" sx={{ color: "#ccc" }}>
                      Preview not available for this file type.
                    </Typography>
                  </Stack>
                )}
              </Box>

              {/* File Details Grid */}
              <Grid container spacing={2} sx={{ textAlign: "left" }}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#888", display: "block" }}
                  >
                    File Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {previewFile.OriginalFileName || previewFile.Name}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#888", display: "block" }}
                  >
                    File Size
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatSize(previewFile.FileSizeBytes)}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#888", display: "block" }}
                  >
                    Category
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textTransform: "capitalize" }}
                  >
                    {previewFile.FileCategory ||
                      previewFile.FileExtension ||
                      "Document"}
                  </Typography>
                </Grid>
                {previewFile.MimeType && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#888", display: "block" }}
                    >
                      MIME Type
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {previewFile.MimeType}
                    </Typography>
                  </Grid>
                )}
                {previewFile.StorageProvider && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#888", display: "block" }}
                    >
                      Storage Provider
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, textTransform: "uppercase" }}
                    >
                      {previewFile.StorageProvider}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions
              sx={{ p: 2, bgcolor: "#fafafa", borderTop: "1px solid #eaeaea" }}
            >
              <Button
                onClick={() => setPreviewFile(null)}
                sx={{ color: "#666" }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleDownload(previewFile);
                  setPreviewFile(null);
                }}
                startIcon={<CloudDownloadOutlinedIcon />}
                sx={{
                  bgcolor: "#114D6E",
                  color: "#fff",
                  "&:hover": { bgcolor: "#0d3c56" },
                }}
              >
                Download File
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default function AssetManagementPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "#114D6E" }} />
          <Typography
            variant="body2"
            sx={{ color: "#666", letterSpacing: "1px" }}
          >
            Loading Asset Management...
          </Typography>
        </Box>
      }
    >
      <AssetManagementContent />
    </Suspense>
  );
}
