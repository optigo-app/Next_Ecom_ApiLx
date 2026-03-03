import { Box ,Chip } from "@mui/material";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import WatchOutlinedIcon from "@mui/icons-material/WatchOutlined";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";


const categoriesList = [
    { label: "Fashion", icon: <CheckroomOutlinedIcon color="info" fontSize="small" /> },
    { label: "Silver", icon: <SpaOutlinedIcon color="warning" fontSize="small" /> },
    { label: "Watch", icon: <WatchOutlinedIcon color="success" fontSize="small" /> },
    { label: "Gold", icon: <DiamondOutlinedIcon color="secondary" fontSize="small" /> },
    { label: "Diamond", icon: <DiamondOutlinedIcon color="error" fontSize="small" /> },
];

function ProductTypeBar() {
    return (
        <Box sx={{ display: "flex", overflowX: "auto", gap: 1, mb: 2, "&::-webkit-scrollbar": { display: "none" },px:1 }}>
            {categoriesList.map((item, index) => (
                <Chip
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    clickable
                    sx={{
                        borderRadius: "999px",
                        px: 1.5,
                        height: 42,
                        fontWeight: 500,
                        backgroundColor: "#fff",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                        },
                    }}
                />
            ))}
        </Box>
    );
}
export default ProductTypeBar;