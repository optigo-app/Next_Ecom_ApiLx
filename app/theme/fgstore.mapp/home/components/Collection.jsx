"use client";
import React, { useMemo } from "react";
import { Box, Skeleton } from "@mui/material";
import Headers from "./composable/Headers";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.client";

/* ---------- helpers ---------- */

const sortByOrder = (list) =>
    [...(Array.isArray(list) ? list : [])].sort(
        (a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)
    );

/* ---------- component ---------- */

function Collection({ storeinit }) {
    const { push } = useNextRouterLikeRR();

    const { collections, loading, isError } = useWebContentManagement();

    

    const CollectionData = useMemo(() => sortByOrder(collections), [collections]);

    const handleNavigate = (name) => {
        let finalData = {
            menuname: name,
            FilterKey: "Collection",
            FilterVal: name,
            FilterKey1: "",
            FilterVal1: "",
            FilterKey2: "",
            FilterVal2: "",
        };
        sessionStorage.setItem("menuparams", JSON.stringify(finalData));
        const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].filter(Boolean).join("/");
        const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].join(",");
        const otherparamUrl = Object.entries({
            b: finalData?.FilterKey,
            g: finalData?.FilterKey1,
            c: finalData?.FilterKey2,
        })
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => value)
            .filter(Boolean)
            .join(",");
        let menuEncoded = `${queryParameters}/${otherparamUrl}`;
        const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
        push(url);
    };

    if (isError) return null;

    if (!loading && CollectionData?.length == 0) {
        return null;
    }

    return (
        <>
            <Headers title="Most Loved Collections" onViewMore={() => push(`/collection?utf=home`)} />
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
                {
                    loading ? (
                        Array.from(new Array(8)).map((_, index) => (
                            <Box key={index} sx={{ minWidth: "320px", width: "100%" }}>
                                <Skeleton
                                    variant="rectangular"
                                    width="320px"
                                    height="420px"
                                    sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.06)" }}
                                />
                            </Box>
                        ))
                    ) : (
                        CollectionData?.map((item, index) => (
                            <Box
                                key={item?.recordId || item?.masterId || item?.name}
                                onClick={() => handleNavigate(item?.name)}
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
                                    backgroundImage: `url(${item?.imageUrl ? encodeURI(item.imageUrl) : "/fallback.jpg"})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            ></Box>
                        ))
                    )}
            </Box>
        </>
    );
}
export default Collection;