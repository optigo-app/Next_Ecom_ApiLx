'use client'
import React, { useState, useCallback, useEffect } from "react";
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import CouponCard from "./CouponCard";
import { styled } from "@mui/material/styles";
import { DiscountMasterAPI } from "@/app/(core)/utils/API/DiscountMaster/DiscountMaster";
import { useSnackbarStore } from "@/app/(core)/hooks/useSnackbar";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const HeaderGradient = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg,#10264E 0%, #10264E 100%)`,
  color: theme.palette.common.white,
  textAlign: "center",
  padding: theme.spacing(8, 2),
}));

export const couponColors = [
  "#4F46E5",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
  "#14B8A6",
  "#22D3EE",
  "#6366F1",
  "#F43F5E",
  "#FBBF24",
  "#34D399",
  "#60A5FA",
  "#F87171",
  "#A78BFA",
  "#FB923C",
  "#2DD4BF",
  "#22C55E",
];

const CouponPage = () => {
  const theme = useTheme();
  const [copiedCode, setCopiedCode] = useState("");
  const [couponData, setCouponData] = useState([]);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { finalId } = useStore();


  useEffect(() => {
    const fetchCouponData = async () => {
      const response = await DiscountMasterAPI(finalId);
      if (response?.Data?.rd) {
        const repeatdata = [...response?.Data?.rd, ...response?.Data?.rd, ...response?.Data?.rd, ...response?.Data?.rd, ...response?.Data?.rd];
        setCouponData(response?.Data?.rd);
      } else {
        setCouponData([]);
      }
    };
    fetchCouponData();
  }, []);

  const handleCopy = useCallback((code) => {
    setCopiedCode(code);
    showSnackbar(`${code} coupon code copied to clipboard`);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 6, overflow: "hidden !important", width: "100%" }}>
      <HeaderGradient>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              letterSpacing: "-0.5px",
              fontSize: { xs: "2rem", md: "2.5rem", lg: "2.5rem" },
            }}
          >
            Exclusive Coupon Codes
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 1.5,
              color: theme.palette.info.light,
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "0.7rem", md: "1rem" },
            }}
          >
            Here are the latest deals and discounts to help you save on your next purchase. Happy shopping!
          </Typography>
        </Container>
      </HeaderGradient>
      <Container
        maxWidth="xl"
        sx={{
          mt: 6,
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {couponData?.map((coupon, index) => {
            const colorIndex = index % couponColors.length;
            const cardColor = couponColors[colorIndex];
            return (
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }} key={coupon.id}>
                <CouponCard coupon={coupon} onCopy={handleCopy} cardColor={cardColor} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default CouponPage;

const VoucherGraphic = () => (
  <svg
    width="260"
    height="130"
    viewBox="0 0 260 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(-3px 5px 5px rgba(0, 0, 0, 0.15))' }}
  >
    {/* Base Green Rectangle */}
    <rect width="260" height="130" fill="#699955" />

    {/* Dark Green Starburst Background Patterns */}
    {/* Right large starburst */}
    <polygon points="170,20 190,-10 210,20 240,20 220,40 240,80 200,70 180,110 160,75 130,65 155,40" fill="#548040" />
    {/* Left edge jagged accents */}
    <polygon points="-10,60 20,40 10,80" fill="#548040" />
    <polygon points="40,-10 60,10 80,-10" fill="#548040" />
    <polygon points="260,110 240,130 260,130" fill="#548040" />

    {/* Jagged Line Divider */}
    <polyline
      points="85,0 78,10 85,20 78,30 85,40 78,50 85,60 78,70 85,80 78,90 85,100 78,110 85,120 78,130"
      stroke="#4F783C"
      strokeWidth="2.5"
      fill="none"
    />

    {/* Hand-drawn style "%" Sign */}
    <circle cx="40" cy="50" r="6" fill="none" stroke="#F0E5C0" strokeWidth="4" />
    <circle cx="65" cy="80" r="6" fill="none" stroke="#F0E5C0" strokeWidth="4" />
    <line x1="75" y1="45" x2="30" y2="85" stroke="#F0E5C0" strokeWidth="4" strokeLinecap="round" />

    {/* "voucher" Text Box */}
    <rect x="95" y="32" width="105" height="30" rx="2" fill="#F0E5C0" />
    <text
      x="147.5"
      y="53"
      fontFamily="'Nunito', 'Segoe UI', 'Comic Sans MS', sans-serif"
      fontWeight="900"
      fontSize="17"
      fill="#548040"
      textAnchor="middle"
      letterSpacing="1"
    >
      voucher
    </text>

    {/* Bottom Placeholder Lines */}
    <rect x="95" y="75" width="45" height="6" fill="#F0E5C0" />
    <rect x="95" y="90" width="85" height="6" fill="#F0E5C0" />
  </svg>
);

function VoucherCard() {
  return (
    // Background Container (The Solid Orange)
    <Box
      sx={{
        backgroundColor: '#F26522', // Exact vibrant orange
        width: '100%',
        maxWidth: '500px',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: '8px',
        mx: 'auto',
      }}
    >
      {/* Interactive Hover Area Container */}
      <Box
        sx={{
          position: 'relative',
          width: '320px',
          height: '200px',
          cursor: 'pointer',
          // THE HOVER ANIMATION logic using pure CSS in MUI sx
          '&:hover .back-voucher': {
            transform: 'rotate(-10deg) translate(-20px, -10px)',
          },
          '&:hover .front-voucher': {
            transform: 'rotate(5deg) translate(20px, 10px)',
          },
        }}
      >
        {/* Back Voucher */}
        <Box
          className="back-voucher"
          sx={{
            position: 'absolute',
            top: '35px',
            left: '20px',
            transform: 'rotate(-2deg)', // Default rotated position
            // Springy bezier curve for a high-end feel
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <VoucherGraphic />
        </Box>

        {/* Front Voucher */}
        <Box
          className="front-voucher"
          sx={{
            position: 'absolute',
            top: '45px',
            left: '40px',
            transform: 'rotate(2deg)', // Default rotated position
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <VoucherGraphic />
        </Box>
      </Box>
    </Box>
  );
}