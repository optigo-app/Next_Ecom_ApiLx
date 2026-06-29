"use client";

import React, { useEffect, useRef, useState } from 'react'
import './TrendingView1.scss';
 
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import pako from "pako";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Cookies from 'js-cookie';




const TrendingView1 = ({ data ,storeData}) => {
    const trendingRef = useRef(null);
    const [trandingViewData, setTrandingViewData] = useState([]);
    const [imageUrl, setImageUrl] = useState();
    const [ring1ImageChange, setRing1ImageChange] = useState(false);
    const [ring1ImageChangeOdd, setRing1ImageChangeOdd] = useState(false);
    const [ring3ImageChange, setRing3ImageChange] = useState(false);
    const [ring4ImageChange, setRing4ImageChange] = useState(false);
 
        const { push } = useNextRouterLikeRR();
          const navigation = push;
    const [storeInit, setStoreInit] = useState({});
    const productRefs = useRef({});

    const [oddNumberObjects, setOddNumberObjects] = useState([]);
    const [evenNumberObjects, setEvenNumberObjects] = useState([]);
    const { islogin, loginUserDetail } = useStore();
    const [hoveredItem, setHoveredItem] = useState(null);
   
    const isOdd = (num) => num % 2 !== 0;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
 
    };

  

   useEffect(() => {
          setImageUrl(storeInit?.CDNDesignImageFolThumb);
          const { IsB2BWebsite } = storeInit;
          const visiterID = Cookies.get('visiterId');
          let finalID;
          if (IsB2BWebsite == 0) {
              finalID = islogin === false ? visiterID : (loginUserDetail?.id || '0');
          } else {
              finalID = loginUserDetail?.id || '0';
          }
  
  
          Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETTrending", finalID).then((response) => {
              if (response?.Data?.rd) {
                
                console.log("TCL: tranding data ", response?.Data?.rd)
                  setTrandingViewData(response?.Data?.rd);
  
                  const oddNumbers = response.Data.rd.filter(obj => isOdd(obj.SrNo));
                  const evenNumbers = response.Data.rd.filter(obj => !isOdd(obj.SrNo));
  
                  // Setting states with the separated objects
                  setOddNumberObjects(oddNumbers);
                  setEvenNumberObjects(evenNumbers);
              }
          }).catch((err) => console.log(err))
      }, [])
  
    const ProdCardImageFunc = (pd) => {
        let finalprodListimg;
        if (pd?.ImageCount > 0) {
            finalprodListimg = imageUrl + pd?.designno + "_" + 1 + "." + pd?.ImageExtension
        }
        else {
            finalprodListimg = "image-not-found.jpg";
        }
        return finalprodListimg
    }

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);
            const compressed = pako.deflate(uint8Array, { to: 'string' });
            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error('Error compressing and encoding:', error);
            return null;
        }
    };

    const handleNavigation = (designNo, autoCode, titleLine, index) => {
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit')) ?? "";
        const { IsB2BWebsite } = storeInit;
        GoogleAnalytics.event({
            action: "Navigate to Product Detail",
            category: `Product Interaction Through Trending Section`,
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
        sessionStorage.setItem('scrollToProduct4', `product-${index}`);
        let encodeObj = compressAndEncode(JSON.stringify(obj))
        // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
        navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
    }

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

    }, [trandingViewData]);

    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const chunkedData = [];
    for (let i = 0; i < trandingViewData?.length; i += 3) {
        chunkedData.push(trandingViewData?.slice(i, i + 3));
    }

    return (
        <div ref={trendingRef} onContextMenu={(e) => e.preventDefault()}>
            {trandingViewData?.length != 0 &&
                <div className='dt_mainTrending1Div'>
                    <div className='smr_trending1TitleDiv'>
                        <span className='smr_trending1Title'>Trending</span>
                    </div>
                    <div className="smr_trendingProduct-grid">
                        <div className='smr_leftSideBestTR'>
                          
                            <img src={data?.image?.[0]} alt="modalimages"
                                onContextMenu={(e) => e.preventDefault()}
                                draggable={true}
                            />

                            <div className="smr_lookbookImageRightDT">
                                <p>SHORESIDE COLLECTION</p>
                                <h2>FOR LOVE OF SUN & SEA</h2>
                                <button onClick={() => navigation(`/p/Trending/?T=${btoa('Trending')}`)}>SHOP COLLECTION</button>
                            </div>
                        </div>
                        <div className='smr_rightSideTR'>
                            {trandingViewData?.slice(0, 4).map((data, index) => (
                                <div key={index} className="product-card">
                                    <div className='smr_btimageDiv' onClick={() => handleNavigation(data?.designno, data?.autocode, data?.TitleLine, index)}>
                                        <img
                                            src={data?.ImageCount >= 1 ?
                                                // `${imageUrl}${data.designno === undefined ? '' : data?.designno}~1.${data?.ImageExtension === undefined ? '' : data.ImageExtension}`
                                                `${imageUrl}${data.designno === undefined ? '' : data?.designno}~1.jpg`
                                                :
                                                "image-not-found.jpg"
                                            }
                                            id={`product-${index}`}
                                            ref={(el) => (productRefs.current[`product-${index}`] = el)}
                                            alt={data.name}
                                            onError={(e) => {
                                                e.target.src = "image-not-found.jpg";
                                            }}
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                        />
                                    </div>
                                    <div className="trending_ifno_web_product_info">
                                        <h3>{formatTitleLine(data?.TitleLine) && data?.TitleLine}</h3>
                                        
                                        {storeInit?.IsPriceShow == 1 && <p>
                                            <span
                                                className="smr_currencyFont"
                                                dangerouslySetInnerHTML={{
                                                    __html: decodeEntities(
                                                        islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode
                                                    ),
                                                }}
                                            /> {formatter(data?.UnitCostWithMarkUp)}
                                        </p>}
                                    </div>

                                    <div className="trending_ifno_mobile_product_info">
                                        <h3>{data?.designno}</h3>
                                         
                                        {storeInit?.IsPriceShow == 1 && <p>
                                            <span
                                                className="smr_currencyFont"
                                                dangerouslySetInnerHTML={{
                                                    __html: decodeEntities(
                                                        islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode
                                                    ),
                                                }}
                                            /> {formatter(data?.UnitCostWithMarkUp)}
                                        </p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            }
        </div>
    );
};

export default TrendingView1;
