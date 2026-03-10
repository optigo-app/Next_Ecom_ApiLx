import { Box, SwipeableDrawer } from "@mui/material";
import styled from "@emotion/styled";

const COLORS = {
  primaryGradient: "linear-gradient(135deg, #4A66FF 0%, #1D42FF 100%)",
  bgLight: "#F0F2F5",
  textPrimary: "#1A1A1A",
  textSecondary: "#777777",
  success: "#059669",
  danger: "#dc2626",
  surface: "#FFFFFF",
};

const DrawerPaper = styled("div")(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
  maxHeight: "85vh",
  overflow: "hidden", // Let inner content scroll
}));

const Puller = styled(Box)(() => ({
  width: 40,
  height: 5,
  backgroundColor: "#E5E7EB",
  borderRadius: 3,
  position: "absolute",
  top: 10,
  left: "calc(50% - 20px)",
}));

const SwipeableBottomDrawer = ({ children, open, onClose ,bgcolor }) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen
      transitionDuration={250}
      PaperProps={{ component: DrawerPaper }}
      sx={{
        zIndex: 13000000,
        "& .MuiBackdrop-root": { backgroundColor: "rgba(0,0,0,0.4)" },
        "& .MuiDrawer-paper": {
          maxWidth: "600px",
          margin: "0 auto",
          width: "100%",
          borderRadius: "24px 24px 0 0",
        },
      }}
    >
      {/* Handle Area */}
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          height: 24,
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Puller />
      </Box>

      {/* Content Container */}
      <Box
        sx={{
          pb: 2,
          overflowY: "auto",
          maxHeight: "calc(85vh - 30px)",
          // Smooth scrolling
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { display: "none" },
          bgcolor: bgcolor || "transparent" 

        }}
      >
        {children}
      </Box>
    </SwipeableDrawer>
  );
};

export default SwipeableBottomDrawer;
