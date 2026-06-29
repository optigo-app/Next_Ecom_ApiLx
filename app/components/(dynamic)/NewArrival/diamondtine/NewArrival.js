"use client";


import React, { useEffect, useRef, useState } from 'react'
import './NewArrival.modul.scss'
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { Grid } from '@mui/material';
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import Pako from 'pako';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
 
 

const NewArrival = ({storeData}) => {
    const newArrivalRef = useRef(null);
    const [newArrivalData, setNewArrivalData] = useState([]);
    const [imageUrl, setImageUrl] = useState();
    const { islogin, loginUserDetail } = useStore();
    const [storeInit, setStoreInit] = useState({});
    const router = useRouter();
 
    const productRefs = useRef({});

  

    useEffect(() => {
        setStoreInit(storeData);
      }, [storeData]);
    
      useEffect(() => {
        const IsB2BWebsite = storeInit?.IsB2BWebsite;
        const visiterID = Cookies.get("visiterId");
        let finalID;
        if (IsB2BWebsite == 0) {
          finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
        } else {
          finalID = loginUserDetail?.id || "0";
        }
    
        setImageUrl(storeInit?.DesignImageFol);
    
        Get_Tren_BestS_NewAr_DesigSet_Album(storeData ,"GETNewArrival", finalID)
          .then((response) => {
            if (response?.Data?.rd) {
                
                console.log("TCL: NewArrival -> ",response?.Data?.rd )
              setNewArrivalData(response?.Data?.rd);
            }
          })
          .catch((err) => console.log(err));
      }, []);
    
    
    

    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }


    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);
            const compressed = Pako.deflate(uint8Array, { to: 'string' });
            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error('Error compressing and encoding:', error);
            return null;
        }
    };

    const handleNavigation = (designNo, autoCode, titleLine, index) => {
        GoogleAnalytics.event({
            action: "Navigate to Product Detail",
            category: `Product Interaction Through New Arrival Section`,
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
        sessionStorage.setItem('scrollToProduct3', `product-${index}`);
        let encodeObj = compressAndEncode(JSON.stringify(obj))
        // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
        router.push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
    }

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

    }, [newArrivalData]);

    return (
        <>
            {newArrivalData?.length != 0 &&
                <div className='dt_newArrivalMain' onContextMenu={(e) => e.preventDefault()}>
                    {/* <h1 className='dt_titleNewArrival' style={{ textAlign: 'center', padding: '20px 0px 20px 0px' }}>NEW ARRIVAL</h1> */}
                    {newArrivalData?.length != 0 &&
                        <p className='smr_bestseler1Title'>
                            New Arrival
                            {newArrivalData?.length > 5 && <span className='dt_ViewAllBtn_new' onClick={() => router.push(`/p/NewArrival/?N=${btoa('NewArrival')}`)}>
                                View more
                            </span>}
                        </p>
                    }

                    <div className='dt_newArrivalGridMain' style={{ paddingInline: '10px', display: 'flex', justifyContent: 'start' }}>
                        {newArrivalData?.slice(0, 4).map((product, index) => (
                            <div key={index} className='dt_NewArrivalProductMain' onClick={() => handleNavigation(product?.designno, product?.autocode, product?.TitleLine, index)}>
                                <div className='dt_newArrivalMian'>
                                    <img
                                        style={{ height: "100%", width: "100%" }}
                                        // src={`${imageUrl}/${product?.designno}~1.${product.ImageExtension}`}
                                        src={`${imageUrl}/${product?.designno}~1.jpg`}
                                        // src={product.image}
                                        alt={product.title}
                                        id={`product-${index}`}
                                        ref={(el) => (productRefs.current[`product-${index}`] = el)}
                                        loading='lazy'
                                        onError={(e) => {
                                            e.target.src = "/image-not-found.jpg";
                                        }}
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                </div>
                                <div className='dt_newArrivalMainDeatil'>
                                    <h3 className='dt_newArrival_DesignNumber_web'>{formatTitleLine(product?.TitleLine) && product?.TitleLine}</h3>
                                    <h3 className='dt_newArrival_DesignNumber_Mobile'>{product?.designno}</h3>
                                    {/* <div className='dt_newArrivalSetData'>
                                        {storeInit?.IsGrossWeight == 1 &&
                                            <>
                                                <span className='smr_btdetailDT'>GWT: </span>
                                                <span className='smr_btdetailDT'>{(product?.Gwt || 0)?.toFixed(3)}</span>
                                            </>
                                        }
                                        {Number(product?.Nwt) !== 0 && (
                                            <>
                                                <span className='smr_btpipe'>|</span>
                                                <span className='smr_btdetailDT'>NWT : </span>
                                                <span className='smr_btdetailDT'>{(product?.Nwt || 0)?.toFixed(3)}</span>
                                            </>
                                        )}
                                        {storeInit?.IsDiamondWeight == 1 &&
                                            <>
                                                {(product?.Dwt != "0" || product?.Dpcs != "0") &&
                                                    <>
                                                        <span className='smr_btpipe'>|</span>
                                                        <span className='smr_btdetailDT'>DWT: </span>
                                                        <span className='smr_btdetailDT'>{(product?.Dwt || 0)?.toFixed(3)}/{(product?.Dpcs || 0)}</span>
                                                    </>
                                                }
                                            </>
                                        }
                                        {storeInit?.IsStoneWeight == 1 &&
                                            <>
                                                {(product?.CSwt != "0" || product?.CSpcs != "0") &&
                                                    <>
                                                        <span className='smr_btpipe'>|</span>
                                                        <span className='smr_btdetailDT'>CWT: </span>
                                                        <span className='smr_btdetailDT'>{(product?.CSwt || 0)?.toFixed(3)}/{(product?.CSpcs || 0)}</span>
                                                    </>
                                                }
                                            </>
                                        }
                                    </div> */}
                                    <p className='dt_newArrivalPdPrice'>
                                        <span
                                            className="smr_currencyFont"
                                            dangerouslySetInnerHTML={{
                                                __html: decodeEntities(
                                                    islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode
                                                ),
                                            }}
                                        /> {formatter(product?.UnitCostWithMarkUp)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default NewArrival