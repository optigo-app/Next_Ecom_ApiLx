"use client";

import { useEffect, useRef, useState } from "react";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Cookies from "js-cookie";
import Pako from "pako";
import './BestSellerSection.scss'
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const BestSellerSection = ({ storeData }) => {
    const [imageUrl, setImageUrl] = useState();
    const { loginUserDetail, islogin } = useStore();
    const [bestSellerData, setBestSellerData] = useState([]);
    const navigation = useNextRouterLikeRR().push;
    const productRefs = useRef({});
    const noimage = `./image-not-found.jpg`;

    useEffect(() => {
        const storeInit = storeData;
        const IsB2BWebsite = storeInit?.IsB2BWebsite;
        const visiterID = Cookies.get("visiterId");
        let finalID;
        if (IsB2BWebsite == 0) {
            finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
        } else {
            finalID = loginUserDetail?.id || "0";
        }

        // setImageUrl(data?.DesignImageFol);
        // setImageUrl(data?.CDNDesignImageFol);
        setImageUrl(storeInit?.CDNDesignImageFolThumb);

        const BestSeller = async () => {
            Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETBestSeller", finalID)
                .then((response) => {
                    if (response?.Data?.rd) {
                        setBestSellerData(response?.Data?.rd);
                    }
                })
                .catch((err) => console.log(err));
        }

        BestSeller()
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

    const handleNavigation = (designNo, autoCode, titleLine, index) => {
        let obj = {
            a: autoCode,
            b: designNo,
            m: loginUserDetail?.MetalId,
            d: loginUserDetail?.cmboDiaQCid,
            c: loginUserDetail?.cmboCSQCid,
            f: {},
        };
        let encodeObj = compressAndEncode(JSON.stringify(obj));
        sessionStorage.setItem('scrollToProduct4', `product-${index}`);
        // navigation(
        //   `/d/${titleLine.replace(/\s+/g, `_`)}${
        //     titleLine?.length > 0 ? "_" : ""
        //   }${designNo}?p=${encodeObj}`
        // );
        navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
    };

    useEffect(() => {
        const scrollDataStr = sessionStorage.getItem('scrollToProduct4');
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
                sessionStorage.removeItem('scrollToProduct4');
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(tryScroll, 200); // retry until ref is ready
            }
        };

        tryScroll();

    }, [bestSellerData]);

    const ImageUrl = (designNo, ext) => {
        // return storeData?.CDNDesignImageFol + designNo + "~" + 1 + "." + ext;
        return storeData?.CDNDesignImageFolThumb + designNo + "~" + 1 + "." + ext;
    };
    const RollUpImageUrl2 = (designNo, ext, imagCount) => {
        if (imagCount > 1) {
            // return storeData?.CDNDesignImageFol + designNo + "~" + 2 + "." + ext;
            return storeData?.CDNDesignImageFolThumb + designNo + "~" + 2 + "." + ext;
        }
        return;
    };

    if (bestSellerData?.length === 0) {
        return <div style={{ marginTop: "-2rem" }}></div>;
    }

    return (
        <div className="hoq_main_TabSection"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="header">
                <h1>Best Seller</h1>
                <button
                    onClick={() => navigation(`/p/BestSeller/?B=${btoa("BestSeller")}`)}
                >
                    View All
                </button>
            </div>
            <div className="tab_card">
                {bestSellerData?.slice(0, 4)?.map((data, i) => {
                    return (
                        <CARD
                            key={i}
                            imgurl={ImageUrl(data?.designno, "jpg")}
                            data={data}
                            i={i}
                            rollUpImage={RollUpImageUrl2(
                                data?.designno,
                                "jpg",
                                data?.ImageCount
                            )}
                            id={`product-${i}`}
                            ref={(el) => (productRefs.current[`product-${i}`] = el)}
                            condition={storeData?.IsPriceShow === 1}
                            designNo={data?.designno}
                            CurrCode={
                                loginUserDetail?.CurrencyCode ?? storeData?.CurrencyCode
                            }
                            price={data?.UnitCostWithMarkUp}
                            onClick={() =>
                                handleNavigation(
                                    data?.designno,
                                    data?.autocode,
                                    data?.TitleLine,
                                    i
                                )
                            }
                            ImageCount={data?.ImageCount}
                        />
                    );
                })}
                {/* <div className="TabCard_main t-mobile-only">
          <div className="box">
            <span onClick={()=>navigation(`/p/BestSeller/?N=${btoa("BestSeller")}`)}>
              View All 
            </span>
          </div>
        </div> */}
            </div>
        </div>
    );
};

export default BestSellerSection;

const CARD = ({
    imgurl,
    i,
    data,
    rollUpImage,
    designNo,
    CurrCode,
    price,
    onClick,
    ImageCount,
    condition
}) => {
    const formatter = new Intl.NumberFormat("en-IN");
    return (
        <div
            className="TabCard_main"
            style={{ backgroundColor: "#F5F5F5" }}
            onClick={onClick}
        >
            {data?.new && <button className="new">New</button>}
            <div className="cardhover">
                <img
                    style={{ mixBlendMode: "multiply" }}
                    src={imgurl}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                            noimage;
                    }}
                    draggable={true}
                    onContextMenu={(e) => e.preventDefault()}
                    loading="lazy"
                />
                {ImageCount > 1 && (
                    <div className="overlay_img" style={{ backgroundColor: "#F5F5F5" }}>
                        <img onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                noimage;
                        }} src={rollUpImage} loading="lazy" style={{ mixBlendMode: "multiply" }} />
                    </div>
                )}
            </div>
            <div className="tab_hover_Details">
                <h3>{designNo}</h3>
                {condition && <small>
                    {CurrCode}
                    &nbsp;
                    {formatter.format(price)}
                </small>}
            </div>
        </div>
    );
};
