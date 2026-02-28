
import { Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


const Headers = ({ title = "Untitled", onViewMore }) => {
    return (
        <Box sx={{
            pr: 1,
        }}>
            <Box
                sx={{
                    width: "100%",
                    py: 1,
                    px: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#1a1a1a",
                        fontSize: "1.2rem",
                        letterSpacing: "-0.3px",
                    }}
                >
                    {title}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "#1976d2",
                        fontWeight: 500,
                        "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={onViewMore}
                >
                    <Typography variant="body2" sx={{
                        mr: 0.5,
                        display: "flex",
                        alignItems: "center"
                    }}>
                        View More
                        <ChevronRightIcon fontSize="small" />
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};


export default Headers;