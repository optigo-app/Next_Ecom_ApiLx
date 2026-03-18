import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Box, Typography, Button, Skeleton, Stack } from "@mui/material";
import React, { useState } from "react";

const InfoDetail = ({
    singleProd,
    storeInit,
    isPriceloading,
    singleProd1,
    decodeEntities,
    Currency
}) => {
    const [showMdesc, setShowMdesc] = useState(false);
    console.log(singleProd, "singleProd", singleProd1)
    return (
        <Box sx={{ width: "100%", px: 2, mt: 4, textAlign: 'left' }}>

            {/* Product Title */}
            {formatTitleLine(singleProd?.TitleLine) && (
                <Typography
                    sx={{
                        fontSize: "20px",
                        fontWeight: 600,
                        lineHeight: 1.3,
                        mb: 0.5
                    }}
                >
                    {singleProd?.TitleLine}
                </Typography>
            )}

            {/* Design Number */}
            <Typography
                sx={{
                    fontSize: "20px",
                    color: "#666",
                    fontWeight: 600,
                    mb: 1
                }}
            >
                {singleProd?.designno}
            </Typography>

            {/* Price Section */}
            {storeInit?.IsPriceShow === 1 && (
                <Box sx={{ mb: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>

                        {isPriceloading ? (
                            <Skeleton variant="rounded" width={140} height={30} />
                        ) : (
                            <>
                                <Typography
                                    component="span"
                                    sx={{ fontSize: "18px", fontWeight: 600 }}
                                    dangerouslySetInnerHTML={{
                                        __html: decodeEntities(
                                            Currency
                                        ),
                                    }}
                                />

                                <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                                    {(singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp)?.toLocaleString("en-IN")}
                                </Typography>
                            </>
                        )}

                    </Stack>
                </Box>
            )}

            {/* Description */}
            {singleProd?.description && (
                <Box>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: "#555",
                            display: "-webkit-box",
                            WebkitLineClamp: showMdesc ? "unset" : 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                        }}
                    >
                        {singleProd?.description}
                    </Typography>

                    <Button
                        onClick={() => setShowMdesc((prev) => !prev)}
                        size="small"
                        sx={{
                            textTransform: "none",
                            fontSize: "13px",
                            mt: 0.5,
                            p: 0,
                            minWidth: "auto"
                        }}
                    >
                        {showMdesc ? "...Show Less" : "...Show More"}
                    </Button>

                </Box>
            )}

        </Box>
    );
};

export default InfoDetail;




//    {/* <div className="product_info">
//                             {formatTitleLine(singleProd?.TitleLine) && singleProd?.TitleLine}
//                             <span className="fgstore_mapp_single_prod_designno" style={{ marginTop: "5px", fontSize: "1.1rem" }}>
//                                 {singleProd?.designno}
//                             </span>
//                             {storeInit?.IsPriceShow === 1 && (
//                                 <div className="pricecharge">
//                                     {
//                                         <div className="fgstore_mapp_price_portion">
//                                             {isPriceloading ? (
//                                                 ""
//                                             ) : (
//                                                 <span
//                                                     style={{ paddingRight: "0.4rem" }}
//                                                     className="fgstore_mapp_currencyFont"
//                                                     dangerouslySetInnerHTML={{
//                                                         __html: decodeEntities(loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode),
//                                                     }}
//                                                 />
//                                             )}
//                                             {isPriceloading ? <Skeleton variant="rounded" width={140} height={30} /> : <>{singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp?.toLocaleString("en-IN")}</>}
//                                         </div>
//                                     }
//                                 </div>
//                             )}
//                             {singleProd?.description && (
//                                 <div className="desc-p-details">
//                                     <p className={`${!ShowMdesc ? "showless" : "showmore"}`}>{singleProd?.description}</p>
//                                     <div className="btn_sec_pd">
//                                         <button onClick={() => setShowMdesc(!ShowMdesc)}>{ShowMdesc ? "...Show Less" : "...Show More"}</button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div> */}