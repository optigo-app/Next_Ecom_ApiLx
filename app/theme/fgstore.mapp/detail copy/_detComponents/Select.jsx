import {
    Box,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";

const CustomSelect = ({
    label,
    options = [],
    value,
    onChange,
    getOptionLabel = (opt) => opt?.label,
    getOptionValue = (opt) => opt?.value,
    placeholder = "Select",
}) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (option) => {
        const val = getOptionValue(option);
        if (onChange) {
            onChange({ target: { value: val, name: label, option } });
        }
        setOpen(false);
    };

    // Find strictly, loosely, or fallback to first option if not found (matches native select behavior)
    let selectedOption = options?.find((opt) => {
        const optVal = getOptionValue(opt);
        return optVal === value || String(optVal) === String(value);
    });

    if (!selectedOption && options?.length > 0) {
        selectedOption = options[0];
    }

    return (
        <>
            {/* 🔹 Closed UI */}
            <Box
                onClick={() => setOpen(true)}
                sx={{
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                }}
            >
                <Typography fontSize={14}>
                    {selectedOption
                        ? getOptionLabel(selectedOption)
                        : placeholder}
                </Typography>

                <KeyboardArrowDownIcon fontSize="small" />
            </Box>

            {/* 🔥 Drawer */}
            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                        maxHeight: "70vh", // ✅ limit height
                    },
                }}
            >
                <Box sx={{
                    p: 2, pb: 4,
                    height: "100%",
                }}>
                    <Typography
                        sx={{ textAlign: "center", mb: 2, fontWeight: 600 }}
                    >
                        {label || "Select"}
                    </Typography>

                    <List>
                        {options?.map((opt, i) => {
                            const val = getOptionValue(opt);
                            const isSelected = selectedOption
                                ? getOptionValue(selectedOption) === val
                                : val === value;

                            return (
                                <ListItem key={i} disablePadding>
                                    <ListItemButton
                                        onClick={() => handleSelect(opt)}
                                        selected={isSelected}
                                        sx={{ borderRadius: "8px", mb: 0.5 }}
                                    >
                                        <Typography fontSize={14}>
                                            {getOptionLabel(opt)}
                                        </Typography>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default CustomSelect;
