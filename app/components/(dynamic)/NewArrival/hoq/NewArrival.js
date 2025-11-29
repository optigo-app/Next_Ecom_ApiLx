"use client"

import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import "./NewArrival.scss";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import Pako from "pako";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const TabSection = ({ storeData }) => {
    const [newArrivalData, setNewArrivalData] = useState([]);
    const { loginUserDetail, islogin } = useStore();
    const [imageUrl, setImageUrl] = useState();
    const navigation = useNextRouterLikeRR().push;
    const productRefs = useRef({});
    const noimage = `./image-not-found.jpg`;

    useEffect(() => {
        const IsB2BWebsite = storeData?.IsB2BWebsite;
        const visiterID = Cookies.get("visiterId");
        let finalID;
        if (IsB2BWebsite == 0) {
            finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
        } else {
            finalID = loginUserDetail?.id || "0";
        }
        let data = storeData;
        setImageUrl(data?.CDNDesignImageFolThumb);


        Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETNewArrival", finalID)
            ?.then((response) => {
                if (response?.Data?.rd) {
                    setNewArrivalData(response?.Data?.rd);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const ImageGenrate = (product) => {
        return product?.ImageCount >= 1
            ? `${imageUrl}${newArrivalData && product?.designno}~1.jpg`
            : "noImageFound";
    };

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);

            const compressed = Pako.deflate(uint8Array, { to: "string" });

            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error("Error compressing and encoding:", error);
            return null;
        }
    };
    const handleMoveToDetail = (productData, index) => {
        let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let obj = {
            a: productData?.autocode,
            b: productData?.designno,
            m: loginInfo?.MetalId,
            d: loginInfo?.cmboDiaQCid,
            c: loginInfo?.cmboCSQCid,
            f: {},
        };

        let encodeObj = compressAndEncode(JSON.stringify(obj));
        sessionStorage.setItem('scrollToProduct2', `product-${index}`);

        navigation(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`);
    };

    const hasScrolledRef = useRef(false);

    useEffect(() => {
        if (hasScrolledRef.current) return;  // prevent loop

        const scrollDataStr = sessionStorage.getItem("scrollToProduct2");
        if (!scrollDataStr) return;

        const el = productRefs.current[scrollDataStr];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            sessionStorage.removeItem("scrollToProduct2");
            hasScrolledRef.current = true; // mark as done
        }
    }, [newArrivalData]);

    const formatter = new Intl.NumberFormat("en-IN");

    if (newArrivalData?.length === 0) {
        return <div style={{ marginTop: "2rem" }}></div>;
    }

    return (
        <div className="hoq_main_TabSection"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="header">
                <h1>New Arrivals</h1>
                <button
                    onClick={() => navigation(`/p/NewArrival/?N=${btoa("NewArrival")}`)}
                >
                    View All
                </button>
            </div>
            {/* 330 w 500 h */}
            <div className="tab_card">
                {newArrivalData?.slice(0, 4)?.map((val, i) => {
                    return (
                        <div
                            key={i}
                            className="TabCard_main"
                            style={{ backgroundColor: " #b8b4b823", cursor: "pointer" }}
                            onClick={() => handleMoveToDetail(val, i)}
                        >
                            <div className="cardhover">
                                <img
                                    src={ImageGenrate(val)}
                                    alt={val?.id}
                                    id={`product-${i}`}
                                    ref={(el) => (productRefs.current[`product-${i}`] = el)}
                                    style={{ mixBlendMode: "multiply", objectFit: "contain" }}
                                    onError={(e) => {
                                        e.target.src = noimage;
                                        e.target.alt = "Fallback image";
                                    }}
                                    draggable={true}
                                    onContextMenu={(e) => e.preventDefault()}
                                    loading="lazy"
                                />
                            </div>
                            <div className="tab_hover_Details">
                                <h3 style={{ fontSize: "20px" }}>{val?.designno}</h3>
                                {storeData?.IsPriceShow === 1 && (
                                    <small>
                                        {loginUserDetail?.CurrencyCode ?? storeData?.CurrencyCode}{" "}
                                        &nbsp;
                                        {formatter.format(val?.UnitCostWithMarkUp)}
                                    </small>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TabSection;
