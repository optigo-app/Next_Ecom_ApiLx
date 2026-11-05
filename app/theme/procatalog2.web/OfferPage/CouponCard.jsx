import React, { useState } from "react";
import { Box, Card, Typography, Button, alpha, styled } from "@mui/material";
import { ContentCopy as CopyIcon, Celebration as CelebrationIcon } from "@mui/icons-material";
import { parse, format } from "date-fns";

const PremiumCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  border: 'none',
  borderRadius: "25px",
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  minHeight: "100%",
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  boxShadow: 'none',
}));
const LeftSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '20%',
  background: 'linear-gradient(135deg, #AF8238 0%, #AF8238 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  overflow: 'hidden',
  boxShadow: 'none',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100%',
    minWidth: '100%',
  },
}));
const RightSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3, 4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));
const CircleDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: '#fff !important',
  left: -60,
  top: '50%',
  transform: 'translateY(-50%)',
  [theme.breakpoints.down('sm')]: {
    width: 100,
    height: 100,
    left: -50,
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));
const DiscountText = styled(Typography)(({ theme }) => ({
  transform: 'rotate(-90deg)',
  transformOrigin: 'center',
  fontSize: '2.5rem',
  fontWeight: 800,
  color: '#ffffff',
  letterSpacing: -2,
  whiteSpace: 'nowrap',
  textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));
const PremiumButton = styled(Button)(({ theme }) => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${alpha("#ffffff", 0.15)}, ${alpha("#ffffff", 0.05)})`,
  color: "black",
  fontWeight: 600,
  fontSize: 14,
  textTransform: "none",
  padding: "10px 20px",
  borderRadius: 2,
  backdropFilter: "blur(10px)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    background: `linear-gradient(135deg, ${alpha("#ffffff", 0.15)}, ${alpha("#ffffff", 0.05)})`,
  },
}));

const CouponCard = ({ coupon, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon?.DiscountCode);
      setCopied(true);
      onCopy(coupon?.DiscountCode);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const isLongDescription = coupon?.Description?.length > 120;


  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "25px",
        backdropFilter: "blur(6px)",
        transition: "all 0.3s ease",
        bgcolor: 'transparent'
      }}
    >
      <PremiumCard>
        <LeftSection>
          <CircleDecoration
          />
          <DiscountText>{coupon?.LabourDiscount || coupon?.DiamondDiscount}%</DiscountText>
        </LeftSection>

        <RightSection>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // push left/right
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#10264E',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 0.5,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Flat {coupon?.LabourDiscount || coupon?.DiamondDiscount}% off
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption">
                  Expires:
                </Typography>
                <Typography variant="caption" fontWeight={600} >
                  {format(parse(coupon?.EndDate, "dd MMM yyyy", new Date()), "dd MMM yyyy")}
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: 1,
                fontFamily: 'Geist Sans, Inter, sans-serif',
              }}
            >
              {coupon?.DiscountCode}
            </Typography>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.6,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: expanded ? "none" : 2,
                  transition: "all 0.3s ease",
                }}
              >
                {coupon?.Description}
              </Typography>
              {isLongDescription && (
                <Button
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  sx={{
                    mt: 0.5,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {expanded ? "Show Less" : "Know More"}
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
            <PremiumButton
              onClick={handleCopy}
              startIcon={copied ? <CelebrationIcon /> : <CopyIcon />}
              fullWidth variant="contained">
              {copied ? "Copied!" : "Copy"}
            </PremiumButton>
          </Box>
        </RightSection>
      </PremiumCard>
    </Card>
  );
};

export default CouponCard;
















// import React, { useState } from "react";
// import { Box, Card, CardContent, Typography, Button, Chip, alpha } from "@mui/material";
// import { ContentCopy as CopyIcon, LocalOffer as OfferIcon, Celebration as CelebrationIcon } from "@mui/icons-material";
// import { parse ,format } from "date-fns";



// const CouponCard = ({ coupon, onCopy }) => {
//   const [copied, setCopied] = useState(false);
//   const [expanded, setExpanded] = useState(false);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(coupon?.DiscountCode);
//       setCopied(true);
//       onCopy(coupon?.DiscountCode);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };

//   const isLongDescription = coupon?.Description?.length > 120;

//   // Color palette
//   const colors = {
//     primary: "#10264E",   // deep blue - headings/buttons
//     accent: "#AF8238",    // gold - chip & highlights
//     cardBg: "#fffefc",    // light cream - card background
//     text: "#4A5B79",      // muted blue - text
//     hover: "#AE8135",     // darker gold - hover/border accent
//   };

//   return (
//     <Card
//       sx={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         borderRadius: 4,
//         border: `1px solid ${alpha(colors.hover, 0.25)}`,
//         boxShadow: `0px 8px 24px ${alpha(colors.primary, 0.1)}`,
//         bgcolor: colors.cardBg,
//         backdropFilter: "blur(6px)",
//         transition: "all 0.3s ease",
//         "&:hover": {
//           transform: "translateY(-4px)",
//           boxShadow: `0px 12px 32px ${alpha(colors.primary, 0.2)}`,
//         },
//       }}
//     >
//       <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
//         {/* Header */}
//         <Box display="flex" alignItems="center" justifyContent="space-between">
//           <Typography
//             variant="h2"
//             sx={{
//               fontSize: { xs: "1.3rem", sm: "1.6rem" },
//               fontWeight: 700,
//               color: colors.primary,
//               display: "flex",
//               alignItems: "center",
//               gap: 1.2,
//             }}
//           >
//             <OfferIcon fontSize="small" sx={{ color : colors.accent }} />
//             {coupon?.DiscountName}
//           </Typography>

//           <Chip
//             label={coupon?.businessclassname}
//             size="small"
//             sx={{
//               fontWeight: 600,
//               fontSize: "0.75rem",
//               backdropFilter: "blur(10px)",
//               bgcolor: alpha(colors.accent, 0.15),
//               color: colors.accent,
//               borderRadius: 2,
//               px: 1.5,
//             }}
//           />
//         </Box>

//         {/* Description */}
//         <Box>
//           <Typography
//             variant="body2"
//             sx={{
//               color: colors.text,
//               lineHeight: 1.6,
//               overflow: "hidden",
//               display: "-webkit-box",
//               WebkitBoxOrient: "vertical",
//               WebkitLineClamp: expanded ? "none" : 2,
//               transition: "all 0.3s ease",
//             }}
//           >
//             {coupon?.Description}
//           </Typography>
//           {isLongDescription && (
//             <Button
//               size="small"
//               onClick={() => setExpanded(!expanded)}
//               sx={{
//                 mt: 0.5,
//                 textTransform: "none",
//                 fontWeight: 600,
//                 color: colors.primary,
//               }}
//             >
//               {expanded ? "Show Less" : "Know More"}
//             </Button>
//           )}
//         </Box>

//         {/* Expiry */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//             py: 1,
//             px: 2,
//             bgcolor: alpha(colors.primary, 0.06),
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="caption" color={colors.text}>
//             Expires:
//           </Typography>
//           <Typography variant="caption" fontWeight={600} color={colors.primary}>
//             {parse(coupon.StartDate, "dd MMM yyyy", new Date()).toLocaleDateString()}
//           </Typography>
//         </Box>

//         {/* Code + Copy */}
//         <Box display="flex" gap={1.5} alignItems="center">
//           <Box
//             sx={{
//               flexGrow: 1,
//               py: 1.25,
//               px: 2,
//               border: `2px dashed ${alpha(colors.primary, 0.35)}`,
//               borderRadius: 3,
//               bgcolor: alpha(colors.primary, 0.05),
//               textAlign: "center",
//               transition: "all 0.25s ease",
//               "&:hover": {
//                 borderColor: alpha(colors.hover, 0.6),
//               },
//             }}
//           >
//             <Typography
//               sx={{
//                 fontFamily: '"Roboto Mono", monospace',
//                 fontSize: { xs: "0.9rem", sm: "1rem" },
//                 fontWeight: 700,
//                 letterSpacing: "0.08em",
//                 color: colors.primary,
//               }}
//             >
//               {coupon?.DiscountCode}
//             </Typography>
//           </Box>

//           <Button
//             variant="contained"
//             onClick={handleCopy}
//             startIcon={copied ? <CelebrationIcon /> : <CopyIcon />}
//             sx={{
//               minWidth: { xs: 90, sm: 110 },
//               height: 44,
//               fontSize: "0.85rem",
//               fontWeight: 700,
//               bgcolor: colors.primary,
//               color: "#fff",
//               borderRadius: 3,
//               "&:hover": {
//                 bgcolor: alpha(colors.primary, 0.85),
//               },
//             }}
//           >
//             {copied ? "Copied!" : "Copy"}
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default CouponCard;








// import React from 'react';
// import {
//   Box,
//   Card,
//   Typography,
//   Button,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';

// // Styled components for premium feel
// const PremiumCard = styled(Card)(({ theme }) => ({
//   position: 'relative',
//   background: 'linear-gradient(135deg, #f3e7f5 0%, #fce4ec 100%)',
//   border: 'none',
//   borderRadius: theme.spacing(2),
//   overflow: 'hidden',
//   boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
//   display: 'flex',
//   minHeight: 200,
//   [theme.breakpoints.down('sm')]: {
//     minHeight: 180,
//     flexDirection: 'column',
//   },
// }));

// const LeftSection = styled(Box)(({ theme }) => ({
//   position: 'relative',
//   width: '20%',
//   background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: theme.spacing(3),
//   overflow: 'hidden',
//   [theme.breakpoints.down('sm')]: {
//     width: '100%',
//     height: 120,
//     minWidth: '100%',
//   },
// }));

// const RightSection = styled(Box)(({ theme }) => ({
//   flex: 1,
//   padding: theme.spacing(3, 4),
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-between',
//   [theme.breakpoints.down('sm')]: {
//     padding: theme.spacing(3),
//   },
// }));

// // Circular decoration that half attaches to the left side
// const CircleDecoration = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   width: 120,
//   height: 120,
//   borderRadius: '50%',
//   background: 'rgba(255, 255, 255, 0.1)',
//   bottom: -60,
//   left: -60,
//   boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.2)',
//   [theme.breakpoints.down('sm')]: {
//     width: 100,
//     height: 100,
//     bottom: -50,
//     left: -50,
//   },
// }));

// // Discount text rotated for vertical display
// const DiscountText = styled(Typography)(({ theme }) => ({
//   transform: 'rotate(-90deg)',
//   transformOrigin: 'center',
//   fontSize: '3rem',
//   fontWeight: 800,
//   color: '#ffffff',
//   letterSpacing: -2,
//   whiteSpace: 'nowrap',
//   textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
//   [theme.breakpoints.down('sm')]: {
//     fontSize: '2rem',
//   },
// }));

// // Accent bar at bottom
// const AccentBar = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   right: 0,
//   height: 6,
//   background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #ef4444 100%)',
//   borderRadius: '0 0 16px 0',
// }));

// // Premium button styling
// const ApplyButton = styled(Button)(({ theme }) => ({
//   background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
//   color: '#ffffff',
//   textTransform: 'uppercase',
//   fontWeight: 600,
//   fontSize: '0.875rem',
//   letterSpacing: 0.5,
//   padding: theme.spacing(1.25, 2.5),
//   borderRadius: theme.spacing(0.75),
//   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   boxShadow: '0 8px 20px rgba(125, 40, 237, 0.25)',
//   border: 'none',
//   '&:hover': {
//     background: 'linear-gradient(135deg, #5b21b6 0%, #6d28d9 100%)',
//     boxShadow: '0 12px 28px rgba(125, 40, 237, 0.35)',
//     transform: 'translateY(-2px)',
//   },
//   '&:active': {
//     transform: 'translateY(0)',
//   },
//   [theme.breakpoints.down('sm')]: {
//     width: '100%',
//   },
// }));

// const DiscountCard = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   return (
//     <Box sx={{ padding: 4, backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <PremiumCard>
//         <LeftSection>
//           <CircleDecoration />
//           <DiscountText>25%</DiscountText>
//         </LeftSection>

//         <RightSection>
//           <Box>
//             <Typography
//               sx={{
//                 fontSize: '0.875rem',
//                 fontWeight: 500,
//                 color: '#6d28d9',
//                 textTransform: 'uppercase',
//                 letterSpacing: 1,
//                 marginBottom: 0.5,
//                 fontFamily: 'Inter, sans-serif',
//               }}
//             >
//               Flat 52% off
//             </Typography>

//             <Typography
//               sx={{
//                 fontSize: '1.75rem',
//                 fontWeight: 700,
//                 color: '#1f2937',
//                 marginBottom: 1,
//                 fontFamily: 'Geist Sans, Inter, sans-serif',
//               }}
//             >
//               FINRIST 3
//             </Typography>

//             <Typography
//               sx={{
//                 fontSize: '0.95rem',
//                 color: '#6b7280',
//                 lineHeight: 1.6,
//                 marginBottom: 2,
//                 fontFamily: 'Inter, sans-serif',
//               }}
//             >
//               Save 52% on all transactions
//               <br />
//               Terms & conditions
//             </Typography>
//           </Box>

//           <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//             <ApplyButton variant="contained">
//               Apply Code
//             </ApplyButton>
//             <Box
//               sx={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: '50%',
//                 background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontSize: '1.5rem',
//                 boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
//               }}
//             >
//               🍪
//             </Box>
//           </Box>
//         </RightSection>

//         <AccentBar />
//       </PremiumCard>
//     </Box>
//   );
// };

// export default DiscountCard;