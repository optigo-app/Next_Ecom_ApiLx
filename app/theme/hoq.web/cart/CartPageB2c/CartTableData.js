"use client";

import React, { useEffect, useState } from 'react';
import QuantitySelector from './QuantitySelector';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import Cookies from "js-cookie";
import moment from 'moment';
import { CardMedia, Skeleton } from '@mui/material';
import { formatTitleLine } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const ExampleComponent = ({
    cartData,
    CurrencyData,
    qtyCount,
    CartCardImageFunc,
    noImageFound,
    decodeEntities,
    handleDecrement,
    handleIncrement,
    onRemove,
    storeinit,
    visiterId

}) => {

    const { loginUserDetail, setCartCountNum } = useStore();

    const setCartCountVal = setCartCountNum;
    const storeInitData = storeinit;

    const [imageSrc, setImageSrc] = useState();

    const shipsDate = cartData?.shipsdate;
    const dayOfMonth = moment(shipsDate).format('D');

    const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

    const CDNDesignImageFolThumb = storeInitData?.CDNDesignImageFolThumb;
    const fullImagePath = `${CDNDesignImageFolThumb}${cartData?.designno}~1.jpg`;

    const isLoading = cartData?.loading;

    useEffect(() => {
        console.log("koko", cartData)
        console.log("koko1", fullImagePath)
    }, [cartData])


    // useEffect(() => {
    //     if (cartData?.ImageCount > 0) {
    //         CartCardImageFunc(cartData).then((src) => {
    //             setImageSrc(src);
    //         });
    //     } else {
    //         setImageSrc(noImageFound);
    //     }
    // }, [cartData]);

    // const handleRemovecartData = (cartData) => {
    //     onRemove(cartData)
    //     setTimeout(() => {
    //         if (countstatus) {
    //             GetCountAPI(visiterId).then((res) => {
    //                 
    //                 setCartCountVal(res?.cartcount);
    //             })
    //         }
    //     }, 500)
    // }

    const handleRemovecartData = async (item) => {
        const returnValue = await onRemove(item);
        if (returnValue?.msg == "success") {
            GetCountAPI(visiterId).then((res) => {
                setCartCountVal(res?.cartcount);
            })
        }
    };

    return (
        <table className="Hoq_B2C-table Hoq_B2C-table-xs">
            <tbody>
                <tr key={cartData.id} className="Hoq_B2C-cartData-row">
                    <td className='Hoq_b2cCartImagetd'>
                        {isLoading === true ? (
                            <CardMedia
                                sx={{
                                    width: "10rem",
                                    height: "9rem",
                                    '@media (max-width: 1350px)': {
                                        width: "9rem",
                                    },
                                    '@media (max-width: 840px)': {
                                        width: "10rem",
                                    },
                                    '@media (max-width: 650px)': {
                                        width: "9rem",
                                    },
                                }}
                            >
                                <Skeleton
                                    animation="wave"
                                    variant="rect"
                                    width="100%"
                                    height="100%"
                                />
                            </CardMedia>
                        ) : (
                            <img
                                className='Hoq_b2ccartImage'
                                src={cartData?.images}
                                alt=" "
                                sx={{
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    '&:focus': { outline: 'none' },
                                    '&:active': { outline: 'none' },
                                }}
                                onError={(e) => {
                                    const current = e.target.src;
                                    if (!current.includes(fullImagePath) && cartData?.ImageCount > 0) {
                                        e.target.src = fullImagePath;
                                        return;
                                    }
                                    if (!current.includes("image-not-found.jpg")) {
                                        e.target.src = noImageFound;
                                    }
                                }}
                                loading='lazy'
                            />
                        )}
                    </td>
                    <td className='Hoq_b2ccartContentTd'>
                        <p className='Hoq_b2ccartContentTitle' title="Titleline">{formatTitleLine(cartData?.TitleLine)}</p>
                        {/* <p className='Hoq_b2ccartContentMtDT'>{cartData?.metalcolorname} | {cartData?.MetalWeight} | {cartData?.totalGrossweight} | {cartData?.totalDiaWt} / {cartData?.totaldiamondpcs} | {cartData?.totalCSWt}  / {cartData?.totalcolorstonepcs}</p> */}
                        <p className='Hoq_b2ccartContentMtDT'>
                            {storeInitData?.IsMetalTypeWithColor == 1 &&
                                <>
                                    <span className='Hoq_b2ccartContentcartData'>{cartData?.metalcolorname}</span>
                                    <span> | </span>
                                </>
                            }
                            {storeInitData?.IsGrossWeight == 1 &&
                                <>
                                    <span className='Hoq_b2ccartContentcartData'>{(cartData?.Nwt || 0)?.toFixed(3)}</span>
                                </>
                            }
                            {storeInitData?.IsMetalWeight == 1 &&
                                <>
                                    <span> | </span>
                                    {Number(cartData?.Nwt) !== 0 && (
                                        <>
                                            <span className='Hoq_b2ccartContentcartData'>{(cartData?.Gwt || 0)?.toFixed(3)}</span>
                                        </>
                                    )}
                                </>
                            }
                            <span> | </span>
                            {storeInitData?.IsDiamondWeight == 1 &&
                                <>
                                    {(cartData?.Dwt != "0" || cartData?.Dpcs != "0") &&

                                        <span className='Hoq_b2ccartContentcartData'>{(cartData?.Dwt || 0)?.toFixed(3)} / {(cartData?.Dpcs || 0)}</span>
                                    }
                                </>
                            }
                            <span> | </span>
                            {storeInitData?.IsStoneWeight == 1 &&
                                <>
                                    {(cartData?.CSwt != "0" || cartData?.CSpcs != "0") &&
                                        <span className='Hoq_b2ccartContentcartData'>{(cartData?.CSwt || 0)?.toFixed(3)} / {(cartData?.CSpcs || 0)}</span>
                                    }
                                </>
                            }
                        </p>

                        <div className='Hoq_b2cCartQTRm'>

                            <QuantitySelector
                                cartData={cartData}
                                qtyCount={qtyCount}
                                handleIncrement={handleIncrement}
                                handleDecrement={handleDecrement}
                            />
                            <p className='Hoq_b2cCartRmBtn' onClick={() => handleRemovecartData(cartData)}>Remove</p>
                        </div>
                        <td className="Hoq_B2cCartshippingDayMobile" title="Shipping Info">Ships in {dayOfMonth} days</td>
                        <td className="Hoq_B2cCartPriceDayMobile" title="Price">
                            {storeInitData?.IsPriceShow == 1 &&
                                <span>
                                    <span
                                        className="Hoq_currencyFont"
                                    >
                                        {loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}
                                    </span>
                                    {/* <span
                                    className="Hoq_currencyFont"
                                    dangerouslySetInnerHTML={{
                                        __html: decodeEntities(
                                            CurrencyData?.Currencysymbol
                                        ),
                                    }}
                                /> */}
                                    {" "}{(cartData?.UnitCostWithMarkUp)}
                                </span>
                            }
                        </td>
                    </td>
                    <td className="Hoq_B2C-text-right Hoq_B2cCartshippingDay" title="Shipping Info">Ships in {dayOfMonth} days</td>
                    <td className="Hoq_B2C-text-right Hoq_B2cCartPrice" title="Total">
                        {storeInitData?.IsPriceShow == 1 &&
                            <span>
                                {/* <span
                                    className="Hoq_currencyFont"
                                    dangerouslySetInnerHTML={{
                                        __html: decodeEntities(
                                            CurrencyData?.Currencysymbol
                                        ),
                                    }}
                                /> */}
                                <span
                                    className="Hoq_currencyFont"
                                >
                                    {loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}
                                </span>
                                {" "}{(cartData?.UnitCostWithMarkUp)}
                            </span>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default ExampleComponent;
