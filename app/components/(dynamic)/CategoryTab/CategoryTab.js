"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import "./CategoryTab.scss";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Cookies from "js-cookie";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";

const noimage = "/image-not-found.jpg";

const CategoryTab = ({ storeData }) => {
    const [albumData, setAlbumData] = useState();
    const { loginUserDetail, islogin } = useStore();
    const [imageUrl, setImageUrl] = useState();
    const navigation = useNextRouterLikeRR().push;
    const showShapeSection = false;
    const productRefs = useRef({});

    const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeData, islogin), [loginUserDetail, storeData, islogin]);
    const isFetchingRef = useRef(false);
    const lastRequestKeyRef = useRef("");

    const fetchAndSetAlbums = useCallback(
        async (finalID, cacheKey) => {
            if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

            isFetchingRef.current = true;

            try {
                const cacheRes = await readCache(cacheKey);

                if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
                    console.log("[CategoryTab] Serving from cache");
                    setAlbumData(cacheRes.data);
                    isFetchingRef.current = false;
                    return;
                }

                console.log("[CategoryTab] Cache miss, calling API...");
                const response = await Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETAlbum", finalID);
                const apiData = response?.Data?.rd || [];

                if (apiData.length > 0) {
                    setAlbumData(apiData);
                    writeCache(cacheKey, apiData).catch(console.error);
                } else {
                    setAlbumData([]);
                }
                isFetchingRef.current = false;
            } catch (err) {
                console.log("[CategoryTab] Error in fetch:", err);
                setAlbumData([]);
                isFetchingRef.current = false;
            }
        },
        [pricingContext, storeData]
    );

    useEffect(() => {
        if (!pricingContext || !storeData) return;

        setImageUrl(storeData?.AlbumImageFol);

        const fetchData = async () => {
            const IsB2BWebsite = storeData?.IsB2BWebsite;
            const visiterID = Cookies.get("visiterId");
            const userId = loginUserDetail?.id;
            const finalID = IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

            const keyALC = normalizeALC("");
            const { key } = buildAlbumCacheKey("home_album", storeData, pricingContext, finalID, keyALC);

            if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
            lastRequestKeyRef.current = key;

            await fetchAndSetAlbums(finalID, key);
        };

        fetchData();
    }, [islogin, pricingContext, storeData, fetchAndSetAlbums, loginUserDetail?.id]);

    const handleNavigate = (name, index) => {
        sessionStorage.setItem('scrollToProduct3', `product-${index}`);
        navigation(`/p/${name}/?A=${btoa(`AlbumName=${name}`)}`);
    };

    useEffect(() => {
        const scrollDataStr = sessionStorage.getItem('scrollToProduct3');
        if (!scrollDataStr) return;

        const maxRetries = 10;
        let retries = 0;

        const tryScroll = () => {
            const el = productRefs.current[scrollDataStr];
            if (el) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                sessionStorage.removeItem('scrollToProduct3');
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(tryScroll, 200); // retry until ref is ready
            }
        };

        tryScroll();

    }, [albumData]);

    if (albumData?.length === 0) {
        return <div style={{ marginTop: "-2rem" }}></div>;
    }

    return (
        <div className="hoq_main_CategoryTab"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="header">
                <h1>Shop By Category</h1>
            </div>
            <div className="category_row">
                {albumData?.slice(0, 4)?.map((data, i) => {
                    return (
                        <CategoryCard
                            key={i}
                            src={imageUrl + data?.AlbumImageFol + "/" + data?.AlbumImageName}
                            onClick={() => handleNavigate(data?.AlbumName)}
                            name={data?.AlbumName}
                            id={`product-${i}`}
                            ref={(el) => (productRefs.current[`product-${i}`] = el)}
                        />
                    );
                })}
                {/* <CategoryCard
              src={'http://zen/R50B3/UFS/BYJQD1FKE0ON69L2IRW4/AlbumImages/QWxidW1fMjc=/Necklace_27072024171233537.png'}
              name={"Zero 11"}
            />  <CategoryCard
            src={'http://zen/R50B3/UFS/BYJQD1FKE0ON69L2IRW4/AlbumImages/QWxidW1fMjc=/Necklace_27072024171233537.png'}
            name={"Zero 11"}
          />  */}
            </div>
        </div>
    );
};

export default CategoryTab;


const CategoryCard = ({ src, onClick, name }) => {
    return (
        <div className="c_card" onClick={onClick}>
            <div className="image">
                <img
                    src={src}
                    alt=""
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noimage;
                    }}
                    draggable={true}
                    onContextMenu={(e) => e.preventDefault()}
                />
            </div>
            <div className="title">
                <h2 className="hoq_albumName">{name}</h2>
            </div>
        </div>
    );
};

const ShapeCard = ({ img, shape }) => {
    return (
        <div className="s_card">
            <div className="image">
                <img src={img} alt="" onError={(e) => e.target.src = noimage} />
            </div>
            <div className="title">
                <h2>{shape}</h2>
            </div>
        </div>
    );
};
