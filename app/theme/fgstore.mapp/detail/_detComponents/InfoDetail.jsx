import { formatTitleLine, formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Box, Typography, Skeleton, Stack } from "@mui/material";
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

    // Prioritize API response (singleProd or singleProd1) over default payload
    const prod = (singleProd1 && Object.keys(singleProd1).length > 0)
        ? singleProd1
        : (singleProd && Object.keys(singleProd).length > 0 ? singleProd : {});

    const articleNo = prod?.ArticleNo || prod?.articleno || "";
    const designNo = prod?.designno || prod?.b || "";
    const titleLine = prod?.TitleLine || prod?.titleline || "";

    // Clean title line without duplicating ArticleNo or DesignNo
    let displayTitle = "";
    if (articleNo && titleLine && titleLine !== articleNo && titleLine !== designNo) {
        displayTitle = `${articleNo} - ${titleLine}`;
    } else if (articleNo) {
        displayTitle = articleNo;
    } else if (titleLine) {
        displayTitle = titleLine;
    } else {
        displayTitle = designNo;
    }

    const priceVal = prod?.UnitCostWithMarkUp ?? prod?.price ?? 0;
    const currencySymbol = Currency || storeInit?.CurrencyCode || "INR";

    return (
        <Box sx={{ width: "100%", px: 2, mt: 2, textAlign: "left" }}>
            {/* Title Line */}
            <Typography
                sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#102A43",
                    lineHeight: 1.3,
                    mb: 0.5,
                }}
            >
                {displayTitle}
            </Typography>

            {/* Design No (show only if different from displayTitle) */}
            {designNo && displayTitle !== designNo && (
                <Typography
                    sx={{
                        fontSize: "12px",
                        color: "#627D98",
                        fontWeight: 600,
                        mb: 1,
                    }}
                >
                    Design No: {designNo}
                </Typography>
            )}

            {/* Price Section */}
            {storeInit?.IsPriceShow === 1 && (
                <Box sx={{ mb: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        {isPriceloading || !priceVal ? (
                            <Skeleton variant="rounded" width={140} height={28} />
                        ) : (
                            <Typography sx={{ fontSize: "22px", fontWeight: 800, color: "#0B2F83" }}>
                                {currencySymbol} {formatter(priceVal)}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            )}

            {/* Description */}
            {prod?.description && (
                <Box sx={{ mt: 1 }}>
                    <Typography
                        sx={{
                            fontSize: "13px",
                            color: "#486581",
                            display: "-webkit-box",
                            WebkitLineClamp: showMdesc ? "unset" : 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {prod?.description}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default InfoDetail;