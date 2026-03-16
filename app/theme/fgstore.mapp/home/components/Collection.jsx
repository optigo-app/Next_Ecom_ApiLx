"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import Headers from "./composable/Headers";
import { HomeCollectionApi } from "@/app/(core)/utils/API/Home/HomeCollectionApi/HomeCollectionApi";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const DummyCollections = [
    {
        title: "Duometrik",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Duometrik.jpg",
    },
    {
        title: "Inner Glow",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Inner Glow.jpg",
    },
    {
        title: "Kendall",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Kendall.jpg",
    },
    {
        title: "Moodust",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Moodust.webp",
    },
    {
        title: "Petalush",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Petalush.webp",
    },
    {
        title: "Petalyn",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Petalyn.webp",
    },
    {
        title: "Pristine",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Pristine.jpg",
    },
    {
        title: "Velar",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Velar.webp",
    },
];



function Collection({ storeinit }) {
    const { finalId, loginUserDetail } = useStore();
    const [CollectionData, setCollectionData] = useState([]);
    const { push } = useNextRouterLikeRR();
    const [loading, setLoading] = useState(true);


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
        const paginationParam = [`page=${finalData.page ?? 1}`, `size=${finalData.size ?? 50}`].join("&");
        let menuEncoded = `${queryParameters}/${otherparamUrl}`;
        const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
        push(url);
    };


    const fetchCollection = async () => {
        try {
            setLoading(true);
            const res = await HomeCollectionApi(storeinit, finalId)

            let List = res?.Data?.rd || [];
            const updatedList = List.map((item) => {
                const matchedImage = DummyCollections?.find((img) => img?.title?.toLowerCase() === item?.CollectionName?.toLowerCase());
                return {
                    ...item,
                    image: matchedImage ? encodeURI(matchedImage.image) : "/fallback.jpg",
                };
            });
            setCollectionData(updatedList);
        } catch (err) {
            console.error("Error fetching GiftBlock data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCollection();
    }, []);


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
                                key={item?.CollectionName}
                                onClick={() => handleNavigate(item?.CollectionName)}
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
                                    backgroundImage: `url(${item?.image})`,
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
