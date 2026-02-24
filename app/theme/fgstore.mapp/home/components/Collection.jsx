import { Box, Typography,Button  } from "@mui/material";
import Headers from "./composable/Headers";


function Collection() {
    return (
        <>
            <Headers title="Most Loved Products" />
            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 1.5,
                    pb: 2, 
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    px: 1.5,
                }}
            >
                {Array.from({ length: 4 }).map((_, index) => (
                    <Box
                        key={index} 
                        sx={{
                            minWidth: "320px", 
                            maxWidth: "320px",
                            flexShrink: 0,
                            scrollSnapAlign: "start", 
                            height: "420px",
                            position: "relative",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                            cursor: "pointer",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            backgroundImage: 'url("https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* Dark Gradient Overlay for better text/logo visibility at the bottom */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                height: "50%",
                                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
                                pointerEvents: "none",
                            }}
                        />

                        {/* Top Left Discount Badge */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 24,
                                left: 0,
                                backgroundColor: "#D13217",
                                color: "white",
                                padding: "6px 14px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                boxShadow: "2px 4px 12px rgba(209, 50, 23, 0.3)",
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    marginBottom: "2px",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                UPTO
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontSize: "1.15rem",
                                    fontWeight: 800,
                                    lineHeight: 1,
                                }}
                            >
                                {Math.floor(Math.random() * 50) + 30}% OFF
                            </Typography>
                        </Box>

                        {/* Bottom Content Area (Logo & Button) */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 24,
                                left: 0,
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2.5,
                            }}
                        >
                            {/* Logo Recreation */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    color: "white",
                                }}
                            >
                                {/* Top Line */}
                                <Box sx={{ width: "100%", height: "2px", backgroundColor: "white", mb: "4px" }} />
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: "serif",
                                        fontWeight: 500,
                                        letterSpacing: "1px",
                                        textTransform: "lowercase",
                                        lineHeight: 1,
                                        px: 1,
                                    }}
                                >
                                    Sonasons
                                </Typography>
                                {/* Bottom Line */}
                                <Box sx={{ width: "100%", height: "2px", backgroundColor: "white", mt: "4px" }} />
                            </Box>

                            {/* Shop Now Button */}
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "white",
                                    color: "#A03C1D",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: "0.95rem",
                                    padding: "8px 32px",
                                    borderRadius: "6px",
                                    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                                    "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                                    },
                                }}
                            >
                                Shop Now
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>
        </>
    );
}
export default Collection;