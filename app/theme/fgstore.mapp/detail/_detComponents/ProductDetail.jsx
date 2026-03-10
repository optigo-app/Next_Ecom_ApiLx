
import React, { useState } from "react";
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
    TableContainer,
    Button
} from "@mui/material";
import SwipeableBottomDrawer from "@/app/components/ui/SwipeableDrawer";


const ProductDetailsSection = ({
    diaList,
    csList
}) => {
    const [open, setOpen] = useState(false);

    const hasMisc = csList?.filter((ele) => ele?.D === "MISC")?.length > 0;
    const hasColorStone = csList?.filter((ele) => ele?.D !== "MISC")?.length > 0;

    return (
        <>
            {(diaList?.length > 0 || hasMisc || hasColorStone) && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpen(true)}
                        sx={{
                            borderRadius: "30px",
                            textTransform: "none",
                            px: 3,
                            fontSize: "0.9rem"
                        }}
                    >
                        View Product Details
                    </Button>
                </Box>
            )}
            <SwipeableBottomDrawer
                open={open}
                onClose={()=>setOpen((prev)=>!prev)}
            >
                <Box
                    sx={{
                        p: 2,
                        maxHeight: "70vh",
                        overflowY: "auto"
                    }}
                >            <Box sx={{
                    width: {
                        lg: '60%',
                        md: "70%",
                        sm: '100%',
                        xs: '100%'
                    }, mx: 'auto'
                }}>

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
                </Box>
            </SwipeableBottomDrawer>
        </>
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







                    //         {(diaList?.length > 0 || csList?.filter((ele) => ele?.D !== "MISC")?.length > 0) && (
                    //             <Accordion
                    //                 className="accordian"
                    //                 sx={{
                    //                     border: "none", // Remove default border
                    //                     boxShadow: "none", // Remove default shadow
                    //                     "&:before": {
                    //                         // Remove the border-top pseudo-element
                    //                         display: "none",
                    //                     },
                    //                 }}
                    //                 key={2}
                    //                 expanded={expandedIndex === 2}
                    //                 onChange={handleChange(2)}
                    //             >
                    //                 <AccordionSummary
                    //                     expandIcon={expandedIndex === 2 ? <RemoveIcon style={{ fontSize: "1.2rem", color: "black" }} /> : <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />}
                    //                     aria-controls="panel1-content"
                    //                     id="panel1-header"
                    //                     className="summary"
                    //                     sx={{
                    //                         padding: "0 5px",
                    //                     }}
                    //                 >
                    //                     <Typography
                    //                         className="title"
                    //                         sx={{
                    //                             textAlign: "center",
                    //                             width: "100%",
                    //                         }}
                    //                         style={{
                    //                             fontSize: "0.9rem",
                    //                             textTransform: "uppercase",
                    //                             marginLeft: "3.4px",
                    //                         }}
                    //                     >
                    //                         PRODUCT DETAILS
                    //                     </Typography>
                    //                 </AccordionSummary>
                    //                 <AccordionDetails>
                    //                     <div className="details_d_C">
                    //                         <div className="fgstore_mapp_material_details_portion">
                    //                             {/* {diaList?.length > 0 && (
                    //   <p className="fgstore_mapp_details_title"> Product Details</p>
                    // )} */}
                    //                             {/* {diaList?.length > 0 && (
                    //   <div className="fgstore_mapp_material_details_portion_inner">
                    //     <ul
                    //       style={{
                    //         margin: "0px 0px 3px 0px",
                    //         listStyle: "none",
                    //       }}
                    //     >
                    //       <li
                    //         className="dia-title"
                    //         style={{ fontWeight: 600 }}
                    //       >{`Diamond Detail(${diaList?.reduce(
                    //         (accumulator, data) => accumulator + data.M,
                    //         0
                    //       )}   ${diaList
                    //         ?.reduce(
                    //           (accumulator, data) => accumulator + data?.N,
                    //           0
                    //         )
                    //         .toFixed(3)}ct)`}</li>
                    //     </ul>
                    //     <ul className="fgstore_mapp_mt_detail_title_ul">
                    //       <li className="fgstore_mapp_proDeatilList">Shape</li>
                    //       <li className="fgstore_mapp_proDeatilList">Clarity</li>
                    //       <li className="fgstore_mapp_proDeatilList">Color</li>
                    //       <li className="fgstore_mapp_proDeatilList">Pcs &nbsp; Wt</li>
                    //     </ul>
                    //     {diaList?.map((data) => (
                    //       <ul className="fgstore_mapp_mt_detail_title_ul">
                    //         <li className="fgstore_mapp_proDeatilList1">{data?.F}</li>
                    //         <li className="fgstore_mapp_proDeatilList1">{data?.H}</li>
                    //         <li className="fgstore_mapp_proDeatilList1">{data?.J}</li>
                    //         <li className="fgstore_mapp_proDeatilList1">
                    //           {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                    //         </li>
                    //       </ul>
                    //     ))}
                    //   </div>
                    // )}

                    // {csList?.length > 0 && (
                    //   <div className="fgstore_mapp_material_details_portion_inner">
                    //     <ul style={{ margin: "10px 0px 3px 0px" }}>
                    //       <li
                    //         style={{ fontWeight: 600 }}
                    //       >{`ColorStone Detail(${csList?.reduce(
                    //         (accumulator, data) => accumulator + data.M,
                    //         0
                    //       )}/${csList
                    //         ?.reduce(
                    //           (accumulator, data) => accumulator + data?.N,
                    //           0
                    //         )
                    //         .toFixed(2)}ct)`}</li>
                    //     </ul>
                    //     <ul className="fgstore_mapp_mt_detail_title_ul">
                    //       <li className="fgstore_mapp_proDeatilList">Shape</li>
                    //       <li className="fgstore_mapp_proDeatilList">Clarity</li>
                    //       <li className="fgstore_mapp_proDeatilList">Color</li>
                    //       <li className="fgstore_mapp_proDeatilList">Pcs/Wt</li>
                    //     </ul>
                    //     {csList?.map((data) => (
                    //       <ul className="fgstore_mapp_mt_detail_title_ul">
                    //         <li className="fgstore_mapp_proDeatilList1">{data?.F}</li>
                    //         <li className="fgstore_mapp_proDeatilList1">{data?.H}</li>
                    //         <li className="fgstore_mapp_proDeatilList1">{data?.J}</li>
                    //         <li className="fgstore_mapp_proDeatilList1">
                    //           {data.M}/{data?.N?.toFixed(3)}
                    //         </li>
                    //       </ul>
                    //     ))}
                    //   </div>
                    // )} */}
                    //                             {diaList?.length > 0 && (
                    //                                 <div className="fgstore_mapp_material_details_portion_inner">
                    //                                     <ul style={{ margin: "0px 0px 3px 0px" }}>
                    //                                         <li style={{ fontWeight: 600 }}>{`Diamond Detail (${diaList?.reduce((accumulator, data) => accumulator + data.M, 0)}   ${diaList?.reduce((accumulator, data) => accumulator + data?.N, 0).toFixed(3)}ct)`}</li>
                    //                                     </ul>
                    //                                     <ul className="fgstore_mapp_mt_detail_title_ul">
                    //                                         <li className="fgstore_mapp_proDeatilList">Shape</li>
                    //                                         <li className="fgstore_mapp_proDeatilList">Clarity</li>
                    //                                         <li className="fgstore_mapp_proDeatilList">Color</li>
                    //                                         <li className="fgstore_mapp_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
                    //                                     </ul>
                    //                                     {diaList?.map((data) => (
                    //                                         <ul className="fgstore_mapp_mt_detail_title_ul">
                    //                                             <li className="fgstore_mapp_proDeatilList1">{data?.F}</li>
                    //                                             <li className="fgstore_mapp_proDeatilList1">{data?.H}</li>
                    //                                             <li className="fgstore_mapp_proDeatilList1">{data?.J}</li>
                    //                                             <li className="fgstore_mapp_proDeatilList1">
                    //                                                 {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                    //                                             </li>
                    //                                         </ul>
                    //                                     ))}
                    //                                 </div>
                    //                             )}
                    //                             {/* {console.log("csListcsList",csList?.filter((ele)=>ele?.D === "MISC"))} */}
                    //                             {csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
                    //                                 <div className="fgstore_mapp_material_details_portion_inner">
                    //                                     <ul style={{ margin: "10px 0px 3px 0px" }}>
                    //                                         <li style={{ fontWeight: 600 }}>{`ColorStone Detail (${csList?.filter((ele) => ele?.D !== "MISC")?.reduce((accumulator, data) => accumulator + data.M, 0)} ${csList
                    //                                             ?.filter((ele) => ele?.D !== "MISC")
                    //                                             ?.reduce((accumulator, data) => accumulator + data?.N, 0)
                    //                                             .toFixed(3)}ct)`}</li>
                    //                                     </ul>
                    //                                     <ul className="fgstore_mapp_mt_detail_title_ul">
                    //                                         <li className="fgstore_mapp_proDeatilList">Shape</li>
                    //                                         <li className="fgstore_mapp_proDeatilList">Clarity</li>
                    //                                         <li className="fgstore_mapp_proDeatilList">Color</li>
                    //                                         <li className="fgstore_mapp_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
                    //                                     </ul>
                    //                                     {csList
                    //                                         ?.filter((ele) => ele?.D !== "MISC")
                    //                                         ?.map((data) => (
                    //                                             <ul className="fgstore_mapp_mt_detail_title_ul">
                    //                                                 <li className="fgstore_mapp_proDeatilList1">{data?.F}</li>
                    //                                                 <li className="fgstore_mapp_proDeatilList1">{data?.H}</li>
                    //                                                 <li className="fgstore_mapp_proDeatilList1">{data?.J}</li>
                    //                                                 <li className="fgstore_mapp_proDeatilList1">
                    //                                                     {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                    //                                                 </li>
                    //                                             </ul>
                    //                                         ))}
                    //                                 </div>
                    //                             )}

                    //                             {csList?.filter((ele) => ele?.D === "MISC")?.length > 0 && (
                    //                                 <div className="fgstore_mapp_material_details_portion_inner">
                    //                                     <ul style={{ margin: "10px 0px 3px 0px" }}>
                    //                                         <li style={{ fontWeight: 600 }}>{`MISC Detail(${csList?.filter((ele) => ele?.D === "MISC")?.reduce((accumulator, data) => accumulator + data.M, 0)}  ${csList
                    //                                             ?.filter((ele) => ele?.D === "MISC")
                    //                                             ?.reduce((accumulator, data) => accumulator + data?.N, 0)
                    //                                             .toFixed(3)}gm)`}</li>
                    //                                     </ul>
                    //                                     <ul className="fgstore_mapp_mt_detail_title_ul">
                    //                                         <li className="fgstore_mapp_proDeatilList">Shape</li>
                    //                                         <li className="fgstore_mapp_proDeatilList">Clarity</li>
                    //                                         <li className="fgstore_mapp_proDeatilList">Color</li>
                    //                                         <li className="fgstore_mapp_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
                    //                                     </ul>
                    //                                     {csList
                    //                                         ?.filter((ele) => ele?.D === "MISC")
                    //                                         ?.map((data) => (
                    //                                             <ul className="fgstore_mapp_mt_detail_title_ul">
                    //                                                 <li className="fgstore_mapp_proDeatilList1">{data?.F}</li>
                    //                                                 <li className="fgstore_mapp_proDeatilList1">{data?.H}</li>
                    //                                                 <li className="fgstore_mapp_proDeatilList1">{data?.J}</li>
                    //                                                 <li className="fgstore_mapp_proDeatilList1">
                    //                                                     {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                    //                                                 </li>
                    //                                             </ul>
                    //                                         ))}
                    //                                 </div>
                    //                             )}
                    //                         </div>
                    //                     </div>
                    //                 </AccordionDetails>
                    //             </Accordion>
                    //         )}