
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Typography,
    Paper,
    Divider,
    Chip,
    TableContainer
} from "@mui/material";


const ProductDetailsSection = ({
    diaList,
    csList
}) => {
    const hasMisc = csList?.filter((ele) => ele?.D === "MISC")?.length > 0;
    const hasColorStone = csList?.filter((ele) => ele?.D !== "MISC")?.length > 0;

    return (
        <Box sx={{
            mt: 8, width: {
                lg: '60%',
                md: "70%",
                sm: '100%',
                xs: '100%'
            }, mx: 'auto'
        }}>
            {(diaList?.length > 0 || hasMisc || hasColorStone) && (
                <Box sx={{ mb: 3, textAlign: 'center', width: '100%' }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            color: "#1a1a1a",
                            letterSpacing: "-0.5px",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            textAlign: 'center'
                        }}
                    >
                        Product Specifications
                    </Typography>
                    {/* <Divider sx={{ mt: 1.5, borderColor: "#e0e0e0" }} /> */}
                </Box>
            )}

            {diaList?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <DiamondTable list={diaList} details="Diamond Details" />
                </Box>
            )}

            {hasColorStone && (
                <Box sx={{ mb: 3 }}>
                    <MiscTable list={csList} details="Color Stone Details" />
                </Box>
            )}

            {hasMisc && (
                <Box sx={{ mb: 3 }}>
                    <MiscTable list={csList} details="MISC Details" />
                </Box>
            )}
        </Box>
    );
};

export default ProductDetailsSection;

const DiamondTable = ({ list, details }) => {
    const totalPcs = list?.reduce((acc, item) => acc + item?.M, 0);
    const totalWt = list?.reduce((acc, item) => acc + item?.N, 0)?.toFixed(3);

    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 2,
                    bgcolor: "#fafafa",
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.4
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#424242",
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    {details}
                </Typography>

                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    <Chip
                        label={`${totalPcs} Pieces`}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.76rem"
                        }}
                        color="default"
                    />
                    <Chip
                        label={`${totalWt}ct`}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.76rem"
                        }}
                        color="default"
                    />
                </Box>
            </Box>

            <TableContainer>
                <Table size="small" sx={{ minWidth: { xs: 300, sm: 500 } }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                            <TableCell sx={{ fontWeight: 600, color: "#616161", fontSize: "0.875rem" }}>
                                Shape
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#616161", fontSize: "0.875rem" }}>
                                Clarity
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#616161", fontSize: "0.875rem" }}>
                                Color
                            </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#616161", fontSize: "0.875rem" }}>
                              Size
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#616161", fontSize: "0.875rem" }}>
                                Pcs / Weight
                            </TableCell>
                        
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {list?.map((val, i) => (
                            <TableRow
                                key={i}
                                sx={{
                                    "&:hover": { bgcolor: "#fafafa" },
                                    "&:last-child td": { borderBottom: 0 }
                                }}
                            >
                                <TableCell sx={{ color: "#424242", fontSize: "0.875rem" }}>
                                    {val?.F}
                                </TableCell>
                                <TableCell sx={{ color: "#424242", fontSize: "0.875rem" }}>
                                    {val?.H}
                                </TableCell>
                                
                                <TableCell sx={{ color: "#424242", fontSize: "0.875rem" }}>
                                    {val?.J}
                                </TableCell>
                                 <TableCell sx={{ color: "#424242", fontSize: "0.875rem", fontWeight: 500 }}>
                                    {`${val?.L}` ?? "-"}
                                </TableCell>
                                <TableCell sx={{ color: "#424242", fontSize: "0.875rem", fontWeight: 500 }}>
                                    {`${val?.M} / ${val?.N.toFixed(3)}`}
                                </TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

const MiscTable = ({ list, details }) => {
    const miscList = list?.filter((e) => e?.D === "MISC");
    const colorStoneList = list?.filter((e) => e?.D !== "MISC");

    const pcs = details.includes("MISC")
        ? miscList.reduce((sum, x) => sum + x?.M, 0)
        : colorStoneList.reduce((sum, x) => sum + x?.M, 0);

    const wt = details.includes("MISC")
        ? miscList.reduce((sum, x) => sum + x?.N, 0)?.toFixed(3)
        : colorStoneList.reduce((sum, x) => sum + x?.N, 0)?.toFixed(3);

    const renderList = details.includes("MISC") ? miscList : colorStoneList;

    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 2,
                    bgcolor: "#fafafa",
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.4
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#424242",
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    {details}
                </Typography>

                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    <Chip
                        label={`${pcs} Pieces`}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.76rem"
                        }}
                        color="default"
                    />
                    <Chip
                        label={`${wt}${details.includes("MISC") ? "gm" : "ct"}`}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.76rem"
                        }}
                        color="default"
                    />
                </Box>
            </Box>

            <TableContainer>
                <Table size="small" sx={{ minWidth: { xs: 300, sm: 500 } }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                            <TableCell sx={{ fontWeight: 600, color: "#616161", fontSize: "0.875rem" }}>
                                Shape
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#616161", fontSize: "0.875rem" }}>
                                Clarity
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#616161", fontSize: "0.875rem" }}>
                                Color
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#616161", fontSize: "0.875rem" }}>
                                Pcs / Weight
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {renderList?.map((val, i) => (
                            <TableRow
                                key={i}
                                sx={{
                                    "&:hover": { bgcolor: "#fafafa" },
                                    "&:last-child td": { borderBottom: 0 }
                                }}
                            >
                                <TableCell sx={{ color: "#424242", fontSize: "0.875rem" }}>
                                    {val?.F}
                                </TableCell>
                                <TableCell sx={{ color: "#424242", fontSize: "0.875rem" }}>
                                    {val?.H}
                                </TableCell>
                                <TableCell sx={{ color: "#424242", fontSize: "0.875rem" }}>
                                    {val?.J}
                                </TableCell>
                                <TableCell sx={{ color: "#424242", fontSize: "0.875rem", fontWeight: 500 }}>
                                    {`${val?.M} / ${val?.N.toFixed(3)}`}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
