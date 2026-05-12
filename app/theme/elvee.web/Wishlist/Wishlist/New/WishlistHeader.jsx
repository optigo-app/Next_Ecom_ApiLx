import { Box, Typography, Divider, Button, Stack } from "@mui/material";

export default function WishlistHeader({ count = 0 , handleMovetoCartAll, handleRemoveAll }) {
    return (
        <Box sx={{ width: "100%", mx: "auto", textAlign: "center", mt: 5 , }}>
            {/* ---- Title ---- */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%" }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        letterSpacing: "-0.5px",
                        color: "#0a1f47",
                    }}
                >
                   My Wishlist
                </Typography>

                {/* ---- Item Count ---- */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        mt: 0.6,
                        color: "#555",
                        fontSize: "18px",
                    }}
                >
                    &nbsp; ( {count} {count === 1 ? "Item" : "Items"})
                </Typography>
            </Box>

            {/* ---- Divider ---- */}
            <Divider sx={{ mt: 2.5, mb: 3 }} />

            {/* ---- Buttons ---- */}
          {count > 0 &&  <Stack spacing={2} direction={{ xs: "row", sm: "row" }} justifyContent="center" maxWidth={600} mx="auto">
                <Button
                    variant="contained"
                    sx={{
                        flex: 1,
                        background: "#163164",
                        color: "#fff",
                        fontSize: { xs: "13px", sm: "15px" },
                        textTransform: "none",
                        borderRadius: "10px",
                        py: 0.8,
                        ":hover": { background: "#163164" },
                    }}
                    onClick={handleMovetoCartAll}
                >
                    Move All To Cart
                </Button>

                <Button
                    variant="outlined"
                    sx={{
                        flex: 1,
                        color: "#1a1a1a",
                        borderColor: "#ccc",
                        fontSize: { xs: "13px", sm: "15px" },
                        textTransform: "none",
                        borderRadius: "10px",
                        py: 0.8,
                        ":hover": { borderColor: "#999", background: "#fafafa" },
                    }}
                    onClick={handleRemoveAll}
                >
                    Clear Wishlist
                </Button>
            </Stack>}
        </Box>
    );
}
