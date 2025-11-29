"use client";

import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd'
import React from 'react'

const BreadCrumbs = ({
    result,
    IsBreadCumShow,
    menuDecode
}) => {

    const location = useNextRouterLikeRR();

    const handleBreadcums = (mparams) => {
        let key = Object?.keys(mparams);
        let val = Object?.values(mparams);

        let KeyObj = {};
        let ValObj = {};

        key.forEach((value, index) => {
            let keyName = `FilterKey${index === 0 ? "" : index}`;
            KeyObj[keyName] = value;
        });

        val.forEach((value, index) => {
            let keyName = `FilterVal${index === 0 ? "" : index}`;
            ValObj[keyName] = value;
        });

        let finalData = { ...KeyObj, ...ValObj };

        const queryParameters1 = [
            finalData?.FilterKey && `${finalData.FilterVal}`,
            finalData?.FilterKey1 && `${finalData.FilterVal1}`,
            finalData?.FilterKey2 && `${finalData.FilterVal2}`,
        ]
            .filter(Boolean)
            .join("/");

        const queryParameters = [
            finalData?.FilterKey && `${finalData.FilterVal}`,
            finalData?.FilterKey1 && `${finalData.FilterVal1}`,
            finalData?.FilterKey2 && `${finalData.FilterVal2}`,
        ]
            .filter(Boolean)
            .join(",");

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

        const url = `/p/${BreadCumsObj()?.menuname}/${queryParameters1}/?M=${btoa(
            menuEncoded
        )}`;
        // const url = `/p?V=${queryParameters}/K=${otherparamUrl}`;

        navigate(url);

        // console.log("mparams", KeyObj, ValObj)
    };

    const BreadCumsObj = () => {
        let BreadCum = decodeURI(atob(location?.search?.slice(3))).split('/')
        console.log("TCL: BreadCum", BreadCum)

        const values = BreadCum?.[0]?.split(',');
        const labels = BreadCum?.[1]?.split(',');

        const updatedBreadCum = labels?.reduce((acc, label, index) => {
            acc[label] = values[index] || '';
            return acc;
        }, {});

        let result = Object?.entries(updatedBreadCum ?? {})?.reduce((acc, [key, value], index) => {
            acc[`FilterKey${index === 0 ? '' : index}`] = key?.charAt(0)?.toUpperCase() + key?.slice(1);
            acc[`FilterVal${index === 0 ? '' : index}`] = value;
            return acc;
        }, {});

        if (result) {
            result.menuname = decodeURI(location?.pathname)?.slice(3)?.slice(0, -1)?.split("/")[0]
        } else {
            result = {}
        }

        return result
    }

    return (
        <div className="empty_sorting_div">
            <span
                className="smr_breadcums_port "
                onClick={() => {
                    navigate("/");
                }}
            >
                {"Home >"}{" "}
            </span>

            {result[0]?.split("=")[0] == "A" && (
                <div
                    className="smr_breadcums_port"
                    style={{ marginLeft: "3px" }}
                >
                    {location?.pathname?.split("/")[2]?.replaceAll('%20', '')}
                </div>
            )}

            {result[0]?.split("=")[0] == "T" && (
                <div
                    className="smr_breadcums_port"
                    style={{ marginLeft: "3px" }}
                >
                    <span>{"Trending"}</span>
                </div>
            )}

            {result[0]?.split("=")[0] == "B" && (
                <div
                    className="smr_breadcums_port"
                    style={{ marginLeft: "3px" }}
                >
                    <span>{"Best Seller"}</span>
                </div>
            )}

            {result[0]?.split("=")[0] == "N" && (
                <div
                    className="smr_breadcums_port"
                    style={{ marginLeft: "3px" }}
                >
                    <span>{"New Arrival"}</span>
                </div>
            )}

            {result[0]?.split("=")[0] == "S" && (
                <div
                    className="smr_breadcums_port"
                    style={{ marginLeft: "3px", textTransform: "uppercase" }}
                >
                    <span>{decodeURIComponent(location?.pathname?.split("/")[2])}</span>
                </div>
            )}

            {IsBreadCumShow && (
                <div
                    className="smr_breadcums_port"
                    style={{ marginLeft: "3px" }}
                >
                    {BreadCumsObj()?.menuname && (
                        <span
                            onClick={() =>
                                handleBreadcums({
                                    [BreadCumsObj()?.FilterKey]:
                                        BreadCumsObj()?.FilterVal,
                                })
                            }
                        >
                            {result[0]?.split("=")[0] == "S" ? "" : BreadCumsObj()?.menuname}
                        </span>
                    )}

                    {BreadCumsObj()?.FilterVal1 && (
                        <span
                            onClick={() =>
                                handleBreadcums({
                                    [BreadCumsObj()?.FilterKey]:
                                        BreadCumsObj()?.FilterVal,
                                    [BreadCumsObj()?.FilterKey1]:
                                        BreadCumsObj()?.FilterVal1,
                                })
                            }
                        >
                            {` > ${BreadCumsObj()?.FilterVal1}`}
                        </span>
                    )}

                    {BreadCumsObj()?.FilterVal2 && (
                        <span
                            onClick={() =>
                                handleBreadcums({
                                    [BreadCumsObj()?.FilterKey]:
                                        BreadCumsObj()?.FilterVal,
                                    [BreadCumsObj()?.FilterKey1]:
                                        BreadCumsObj()?.FilterVal1,
                                    [BreadCumsObj()?.FilterKey2]:
                                        BreadCumsObj()?.FilterVal2,
                                })
                            }
                        >
                            {` > ${BreadCumsObj()?.FilterVal2}`}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export default BreadCrumbs
