import { alpha } from "@mui/material";
import { Box, Modal, TextField ,Chip,Typography  ,Button } from "@mui/material";
import { styled  } from "@mui/material/styles";
// Premium styled components
const StyledModal = styled(Modal)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const Bar = styled(Box, {
    shouldForwardProp: (prop) => prop !== "color",
  })(({ theme, color }) => ({
    position: "sticky",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    maxWidth: 480,
    backgroundColor: color === "error" ? theme.palette.error.light : "#AE8135",
    borderRadius: "0",
    display: "flex",
    flexDirection: "column",
    outline: "none",
    textAlign: "center",
    padding: "8px 0",
    alignItems: "center",
    color:'#fff !important',
    bottom:0
  }));
  
  const ModalContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    width: "100%",
    maxWidth: 480,
    maxHeight: "85vh",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    boxShadow: "0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    outline: "none",
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  }));
  
  const ModalHeader = styled(Box)(({ theme }) => ({
    padding: "20px 24px",
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
  }));
  
  const ModalBody = styled(Box)(({ theme }) => ({
    padding: "0 24px 24px",
    overflowY: "auto",
    flexGrow: 1,
    "&::-webkit-scrollbar": {
      width: 6,
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: alpha(theme.palette.grey[400], 0.4),
      borderRadius: 10,
      "&:hover": {
        background: alpha(theme.palette.grey[400], 0.6),
      },
    },
    position:'relative' ,
  }));
  
  const CouponInputField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 13,
      backgroundColor: "#fafafa",
      fontSize: 14,
      fontWeight: 500,
      transition: "all 0.2s ease",
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      "&:hover": {
        backgroundColor: "#f5f5f5",
        borderColor: alpha(theme.palette.primary.main, 0.3),
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)}`,
      },
      "& fieldset": {
        border: "none",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "12px 14px",
      "&::placeholder": {
        color: theme.palette.text.secondary,
        opacity: 0.7,
      },
    },
  }));
  
  const CouponCard = styled(Box)(({ theme }) => ({
    padding: "16px",
    borderRadius: 12,
    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    backgroundColor: "#ffffff",
    marginBottom: 12,
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: alpha(theme.palette.primary.main, 0.3),
      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
      transform: "translateY(-1px)",
    },
    "&:last-child": {
      marginBottom: 0,
    },
  }));
  
  const CouponHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  }));
  
  const CouponCode = styled(Chip)(({ theme }) => ({
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.3px",
    borderRadius: 8,
    height: 26,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    "& .MuiChip-label": {
      padding: "0 10px",
    },
  }));
  
  const ApplyButton = styled(Button)(({ theme }) => ({
    borderRadius: 8,
    fontSize: 13,
    padding: "6px 18px",
    textTransform: "none",
    fontWeight: 600,
    minWidth: 70,
    border: `1.5px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
      borderColor: theme.palette.grey[400],
    },
  }));
  
  const KnowMoreLink = styled(Typography)(({ theme }) => ({
    fontSize: 13,
    color: theme.palette.text.secondary,
    marginTop: 8,
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    transition: "color 0.2s ease",
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
    },
  }));
  
  const SavingsText = styled(Typography)(({ theme }) => ({
    fontSize: 15,
    fontWeight: 600,
    color: theme.palette.text.primary,
    lineHeight: 1.4,
  }));
  
  const DescriptionText = styled(Typography)(({ theme }) => ({
    fontSize: 13,
    color: theme.palette.text.secondary,
    marginTop: 4,
    lineHeight: 1.5,
  }));
  
  const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: 13,
    fontWeight: 600,
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 12,
  }));
  
  const AppliedBanner = styled(Box)(({ theme }) => ({
    padding: "12px 16px",
    borderRadius: 12,
    backgroundColor: alpha("#10b981", 0.08),
    border: `1px solid ${alpha("#10b981", 0.2)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    width:'100%'
  }));


const Button2 = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontSize: "0.75rem",
  fontWeight: 500,
  borderRadius: "10px",
  padding: "4px 12px",
  minWidth: "auto",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: theme.palette.text.primary,
  background: theme.palette.mode === "dark" 
    ? "rgba(255,255,255,0.08)" 
    : "rgba(0,0,0,0.04)",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  backdropFilter: "blur(6px)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    background: theme.palette.mode === "dark" 
      ? "rgba(255,255,255,0.12)" 
      : "rgba(0,0,0,0.06)",
    boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
  },
  marginRight:-5
}));


  export { Button2 , StyledModal, ModalContainer, ModalHeader, ModalBody, CouponInputField, CouponCard, CouponHeader, CouponCode, ApplyButton, KnowMoreLink, SavingsText, DescriptionText, SectionTitle, AppliedBanner ,Bar};