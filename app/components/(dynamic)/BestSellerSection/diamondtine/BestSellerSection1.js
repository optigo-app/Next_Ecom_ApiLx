"use client";

import React, { useEffect, useRef, useState } from 'react'
import './BestSellerSection1.scss';
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

import { useRouter } from 'next/navigation';
import Pako from 'pako';
import Cookies from 'js-cookie';
 
// import GoogleAnalytics from 'react-ga4';

const BestSellerSection1 = ({ data, storeData }) => {
  
    const bestSallerRef = useRef(null);
    const [imageUrl, setImageUrl] = useState();
    const [bestSellerData, setBestSellerData] = useState('')
    const [storeInit, setStoreInit] = useState({});
 
    const router = useRouter();
    const { islogin, loginUserDetail } = useStore();
    const [hoveredItem, setHoveredItem] = useState(null);
    const productRefs = useRef({});


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        // prevArrow: false, 
        // nextArrow: false,
    };

    useEffect(() => {
       const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
       const { IsB2BWebsite } = storeInit;
       const visiterID = Cookies.get("visiterId");
       let finalID;
       if (IsB2BWebsite == 0) {
         finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
       } else {
         finalID = loginUserDetail?.id || "0";
       }
   
       let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
       setStoreInit(storeinit);
   
       let data = JSON.parse(sessionStorage.getItem("storeInit"));
     
       setImageUrl(data?.DesignImageFolThumb);
   
       Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETBestSeller", finalID)
         .then((response) => {
           if (response?.Data?.rd) {
            
            console.log("TCL: response?.Data?.rd", response?.Data)
             setBestSellerData(response?.Data?.rd);
           }
         })
         .catch((err) => console.log(err));
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
        GoogleAnalytics.event({
            action: "Navigate to Product Detail",
            category: `Product Interaction Through Best Seller Section`,
            label: designNo || titleLine,
            value: loginUserDetail?.firstname ?? 'User Not Login',
        });
        let obj = {
            a: autoCode,
            b: designNo,
            m: loginUserDetail?.MetalId,
            d: loginUserDetail?.cmboDiaQCid,
            c: loginUserDetail?.cmboCSQCid,
            f: {}
        }
        sessionStorage.setItem('scrollToProduct2', `product-${index}`);
        let encodeObj = compressAndEncode(JSON.stringify(obj))
        // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
        router.push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
    }

    useEffect(() => {
        const scrollDataStr = sessionStorage.getItem('scrollToProduct2');
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
                sessionStorage.removeItem('scrollToProduct2');
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(tryScroll, 200); // retry until ref is ready
            }
        };

        tryScroll();

    }, [bestSellerData]);

    const handleMouseEnterRing1 = (data) => {
        if (data?.ImageCount > 1) {
            setHoveredItem(data.SrNo);
        }
    }
    const handleMouseLeaveRing1 = () => {
        setHoveredItem(null);
    }

    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const chunkedData = [];
    for (let i = 0; i < bestSellerData?.length; i += 3) {
        chunkedData.push(bestSellerData?.slice(i, i + 3));
    }

    return (
        <div ref={bestSallerRef} onContextMenu={(e) => e.preventDefault()}>
            {bestSellerData?.length != 0 &&
                <div className='dt_mainBestSeler1Div' >
                    <div className='smr_bestseler1TitleDiv' >
                        <span className='smr_bestseler1Title' >Best Seller</span>  
                    </div>
                    <div className="product-grid">
                        <div className='smr_leftSideBestSeler'>
                            {bestSellerData?.slice(0, 4).map((data, index) => (
                                <div key={index} className="product-card">
                                    <div className='smr_btimageDiv' onClick={() => handleNavigation(data?.designno, data?.autocode, data?.TitleLine, index)}>
                                        <img
                                            src={data?.ImageCount >= 1 ?
                                                // `${imageUrl}${data.designno === undefined ? '' : data?.designno}~1.${data?.ImageExtension === undefined ? '' : data.ImageExtension}`
                                                `${imageUrl}${data.designno === undefined ? '' : data?.designno}~1.jpg`
                                                :
                                                "/image-not-found.jpg"
                                            }
                                            id={`product-${index}`}
                                            ref={(el) => (productRefs.current[`product-${index}`] = el)}
                                            alt={data.name}
                                            onError={(e) => {
                                                e.target.src = "/image-not-found.jpg";
                                                e.target.alt = "no-image-image"
                                            }}
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                        />
                                    </div>
                                    <div className="dt_bestSaller_product_info_Web">
                                        <h3>{formatTitleLine(data?.TitleLine) && data?.TitleLine}</h3>
                                      
                                        {storeInit?.IsPriceShow == 1 && <p>
                                            <span
                                                className="smr_currencyFont"
                                                dangerouslySetInnerHTML={{
                                                    __html: decodeEntities(
                                                        islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode
                                                    ),
                                                }}
                                            /> {formatter(data?.UnitCostWithMarkUp)}</p>}
                                    </div>

                                    <div className="dt_bestSaller_product_info_mobile">
                                        <h3>{data?.designno}</h3>
                                      
                                        <p>
                                            <span
                                                className="smr_currencyFont"
                                                dangerouslySetInnerHTML={{
                                                    __html: decodeEntities(
                                                        islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode
                                                    ),
                                                }}
                                            /> {formatter(data?.UnitCostWithMarkUp)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='smr_rightSideBestSeler'>
                        
                            <img src={data?.image?.[0]} alt="modalimages" />
                            <div className="smr_lookbookImageRightDT">
                                <p>SHORESIDE COLLECTION</p>
                                <h2>FOR LOVE OF SUN & SEA</h2>
                                <button onClick={() => router.push(`/p/BestSeller/?B=${btoa('BestSeller')}`)}>SHOP COLLECTION</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default BestSellerSection1;
