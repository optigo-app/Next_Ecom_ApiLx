"use client";
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { toast } from "react-toastify";
import "./AssetManagement.scss";

export default function AssetManagementPage() {
  const { islogin } = useStore();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (islogin) {
      setCheckingAuth(false);
    }
  }, [islogin]);

  const allDesigns = [
    {
      id: "BJ-R-1092",
      title: "Eternal Halo Solitaire Ring",
      category: "Rings",
      image: "/WebSiteStaticImage/category/ring.webp",
      metal: "18kt Yellow Gold ~ 3.8g",
      diamond: "1 Center Diamond / 0.50ct",
      cadSize: "8.4 MB",
    },
    {
      id: "BJ-E-2051",
      title: "Classy Stud Diamond Earrings",
      category: "Earrings",
      image: "/WebSiteStaticImage/category/diamond-style-stud-earrings-for-women.webp",
      metal: "18kt White Gold ~ 4.2g",
      diamond: "24 Accent Diamonds / 0.72ct",
      cadSize: "12.1 MB",
    },
    {
      id: "BJ-B-4081",
      title: "Classic Tennis Bangle",
      category: "Bangles",
      image: "/WebSiteStaticImage/category/Bangal.webp",
      metal: "18kt Rose Gold ~ 8.5g",
      diamond: "42 Round Diamonds / 2.10ct",
      cadSize: "15.7 MB",
    },
    {
      id: "BJ-R-1095",
      title: "Princess Cut Bridal Band",
      category: "Rings",
      image: "/WebSiteStaticImage/category/ring1.webp",
      metal: "Platinum 950 ~ 5.1g",
      diamond: "7 Princess Diamonds / 0.45ct",
      cadSize: "9.2 MB",
    },
    {
      id: "BJ-E-2052",
      title: "Halo Drop Diamond Earrings",
      category: "Earrings",
      image: "/WebSiteStaticImage/category/earing1.webp",
      metal: "18kt Rose Gold ~ 4.8g",
      diamond: "36 Diamonds / 0.95ct",
      cadSize: "11.5 MB",
    },
    {
      id: "BJ-E-2053",
      title: "Vintage Solitaire Studs",
      category: "Earrings",
      image: "/WebSiteStaticImage/category/Earing.webp",
      metal: "18kt Yellow Gold ~ 3.2g",
      diamond: "2 Round Diamonds / 0.60ct",
      cadSize: "6.8 MB",
    },
  ];

  const handleDownloadCad = (designId) => {
    toast.success(`Production CAD file for ${designId} downloaded successfully.`);
  };

  const handleDownloadKit = (designId) => {
    toast.success(`Marketing asset kit for ${designId} added to downloads.`);
  };

  // Filter items
  const filteredDesigns = allDesigns.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (checkingAuth) {
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
        <Typography variant="body2" sx={{ color: "#666", letterSpacing: "1px" }}>
          Checking authentication credentials...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="assetContainer">
      {/* Header Section */}
      <Box className="assetHeader" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            className="assetOverline"
            sx={{
              letterSpacing: "0.2em",
              fontWeight: 600,
              fontSize: "0.85rem",
              mb: 1.5,
              display: "block",
            }}
          >
            B2B PORTAL ACCESS
          </Typography>
          <Typography
            variant="h3"
            className="assetTitle"
            sx={{
              fontFamily: "Prata, Playfair Display, serif",
              fontWeight: 400,
              fontSize: { xs: "2rem", md: "2.8rem" },
              mb: 2,
            }}
          >
            Asset Management & Design Library
          </Typography>
          <Typography
            variant="body1"
            className="assetCardSpec"
            sx={{ fontSize: "1rem", maxWidth: "700px", lineHeight: 1.7 }}
          >
            Welcome, partner. Explore your dashboard to download print-ready CAD files (.3dm format), high-res studio photography banners, and B2B spec sheets.
          </Typography>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Controls: Search and Categories */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          sx={{ mb: 6 }}
        >
          {/* Categories Tab Selectors */}
          <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: { xs: 1, md: 0 } }}>
            {["All", "Rings", "Earrings", "Bangles"].map((cat) => (
              <Button
                key={cat}
                variant="outlined"
                onClick={() => setActiveCategory(cat)}
                sx={{
                  borderRadius: "0px",
                  borderColor: activeCategory === cat ? "#114D6E" : "#eaeaea",
                  color: activeCategory === cat ? "#ffffff" : "#555555",
                  bgcolor: activeCategory === cat ? "#114D6E" : "transparent",
                  px: 3,
                  py: 1,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  "&:hover": {
                    bgcolor: activeCategory === cat ? "#114D6E" : "rgba(0,0,0,0.02)",
                    borderColor: activeCategory === cat ? "#114D6E" : "#1a1a1a",
                  },
                }}
              >
                {cat}
              </Button>
            ))}
          </Stack>

          {/* Search Field */}
          <TextField
            placeholder="Search by design ID or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              maxWidth: { xs: "100%", md: "320px" },
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "0px",
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

        {/* Designs List Grid */}
        <Grid container spacing={3}>
          {filteredDesigns.map((design) => (
            <Grid
              item
              key={design.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Box className="assetCard" sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Image Section */}
                <Box
                  sx={{
                    width: "100%",
                    height: "260px",
                    overflow: "hidden",
                    bgcolor: "#fcfcfc",
                    borderBottom: "1px solid #f5f5f5",
                    position: "relative",
                    mb: 2.5,
                  }}
                >
                  <Box
                    component="img"
                    src={design.image}
                    alt={design.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      p: 2,
                      mixBlendMode: "multiply",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "rgba(17, 77, 110, 0.08)",
                      color: "#114D6E",
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      borderRadius: "1px",
                    }}
                  >
                    {design.cadSize} CAD
                  </Box>
                </Box>

                {/* Info Section */}
                <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "1.5px",
                        color: "#999",
                      }}
                    >
                      {design.id}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CheckCircleOutlineIcon sx={{ color: "#2e7d32", fontSize: "0.95rem" }} />
                      <Typography variant="caption" sx={{ color: "#2e7d32", fontWeight: 600 }}>
                        Active
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="h6"
                    className="assetCardTitle"
                    sx={{
                      fontFamily: "Prata, Playfair Display, serif",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {design.title}
                  </Typography>

                  <Box sx={{ bgcolor: "#fafafa", p: 1.5, borderRadius: "1px" }}>
                    <Typography
                      variant="body2"
                      className="assetCardSpec"
                      sx={{ fontSize: "0.8rem", mb: 0.5, display: "flex", justifyContent: "space-between" }}
                    >
                      <span>Metal:</span>
                      <strong>{design.metal}</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      className="assetCardSpec"
                      sx={{ fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}
                    >
                      <span>Gemstones:</span>
                      <strong>{design.diamond}</strong>
                    </Typography>
                  </Box>
                </Stack>

                {/* Actions Button Strip */}
                <Stack spacing={1} sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleDownloadCad(design.id)}
                    className="assetDownloadButton"
                    startIcon={<CloudDownloadOutlinedIcon />}
                    sx={{ py: 1.4, fontSize: "0.8rem", letterSpacing: "1px" }}
                  >
                    Download CAD (.3dm)
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleDownloadKit(design.id)}
                    className="assetDownloadButton"
                    startIcon={<InfoOutlinedIcon />}
                    sx={{ py: 1.4, fontSize: "0.8rem", letterSpacing: "1px" }}
                  >
                    Download Marketing Kit
                  </Button>
                </Stack>
              </Box>
            </Grid>
          ))}

          {filteredDesigns.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ py: 10, textAlign: "center" }}>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  No designs found matching search filters.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
