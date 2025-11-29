"use client";

import React, { useEffect, useState, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./Collection.scss";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Cookies from "js-cookie";
import Pako from "pako";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const Collection = ({ storeInit }) => {
    const navigate = useNextRouterLikeRR().push;
    const [imageUrl, setImageUrl] = useState();
    const { loginUserDetail, islogin } = useStore();
    const [designSetList, setDesignSetList] = useState([]);
    const productRefs = useRef({});
    const noimage = `./image-not-found.jpg`;

    useEffect(() => {
        // const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const IsB2BWebsite = storeInit?.IsB2BWebsite;
        const visiterID = Cookies.get("visiterId");
        let finalID;
        if (IsB2BWebsite == 0) {
            finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
        } else {
            finalID = loginUserDetail?.id || "0";
        }

        let data = storeInit;
        setImageUrl(data?.DesignSetImageFol);

        const Collections = async () => {
            Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETDesignSet", finalID)
                .then((response) => {
                    if (response?.Data?.rd) {
                        setDesignSetList(response?.Data?.rd);
                    }
                })
                .catch((err) => console.log(err));
        }
        Collections()
    }, []);

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

    const ProdCardImageFunc = (pd) => {
        let finalprodListimg;
        if (pd?.DefaultImageName) {
            finalprodListimg =
                imageUrl + pd?.designsetuniqueno + "/" + pd?.DefaultImageName;
        } else {
            finalprodListimg =
                noimage;
        }
        return finalprodListimg;
    };

    const handleNavigation = (designNo, autoCode, titleLine, index, product) => {
        console.log("TCL: handleNavigation -> product", product)
        let obj = {
            a: autoCode,
            b: designNo,
            m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
            d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
            c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
            f: {},
        };
        let encodeObj = compressAndEncode(JSON.stringify(obj));
        sessionStorage.setItem('scrollToProduct1', `product-${index}`);
        // navigate(
        //   `/d/${titleLine?.replace(/\s+/g, `_`)}${
        //     titleLine?.length > 0 ? "_" : ""
        //   }${designNo}?p=${encodeObj}`
        // );
        navigate(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
    };

    useEffect(() => {
        const scrollDataStr = sessionStorage.getItem('scrollToProduct1');
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
                sessionStorage.removeItem('scrollToProduct1');
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(tryScroll, 200); // retry until ref is ready
            }
        };

        tryScroll();

    }, [designSetList]);

    if (designSetList?.length === 0) {
        return <div style={{ marginTop: "-3rem" }}></div>;
    }

    return (
        <div className="hoq_main_Collection"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="heading">
                <h1>Collections</h1>
            </div>
            <div className="collection_cards desktop-collection">
                {designSetList?.slice(0, 4)?.map((val, i) => {
                    return (
                        <div
                            key={i}
                            className="c_card"
                            onClick={() =>
                                handleNavigation(
                                    val?.designno,
                                    val?.autocode,
                                    val?.TitleLine ? val?.TitleLine : "",
                                    i,
                                    val,
                                )
                            }
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={ProdCardImageFunc(val)}
                                alt={val?.title}
                                id={`product-${i}`}
                                ref={(el) => (productRefs.current[`product-${i}`] = el)}
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = noimage;
                                    e.target.alt = 'Fallback image';
                                }}
                                draggable={true}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                            <div className="details">
                                <h3>{val?.designsetno}</h3>
                                <button
                                // onClick={() =>
                                //   handleNavigation(
                                //     val?.designno,
                                //     val?.autocode,
                                //     val?.TitleLine ? val?.TitleLine : ""
                                //   )
                                // }
                                >
                                    Explore
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mobile-only">
                <MobileCollection
                    ProdCardImageFunc={ProdCardImageFunc}
                    designSetList={designSetList}
                    handleNavigation={handleNavigation}
                />
            </div>
        </div>
    );
};

export default Collection;

const MobileCollection = ({
    ProdCardImageFunc,
    designSetList,
    handleNavigation,
}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        draggable: true,
        fade: true,
        // cssEase: "linear",
        useTransform: true,
    };

    return (
        <div className=" mobile-collection">
            <Slider {...settings}>
                {designSetList?.slice(0, 4)?.map((val, i) => {
                    return (
                        <div
                            key={i}
                            className="c_card"
                            onClick={() =>
                                handleNavigation(
                                    val?.designno,
                                    val?.autocode,
                                    val?.TitleLine ? val?.TitleLine : "",
                                    i,
                                    val,
                                )
                            }
                        >
                            <div className="details">
                                <h3>{val?.designsetno}</h3>
                                <button
                                // onClick={() =>
                                //   handleNavigation(
                                //     val?.designno,
                                //     val?.autocode,
                                //     val?.TitleLine ? val?.TitleLine : ""
                                //   )
                                // }
                                >
                                    Explore
                                </button>
                            </div>
                            <img
                                src={ProdCardImageFunc(val)}
                                alt={val?.designsetno}
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};
