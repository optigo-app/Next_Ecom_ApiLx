import React from "react";
import { Checkbox } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const ProductSections = ({
    diaList,
    csList,
    stockItemArr,
    SimilarBrandArr,
    designSetList,
    storeInit,
    loginInfo,
    formatter,
    handleCartandWish,
    cartArr,
    handleMoveToDetail
}) => {
    const imageNotFound = "/image-not-found.jpg";
    const KayraCreation = 1; // Set according to your business logic

    return (
        <>
            {/* Material Details Section */}
            {KayraCreation === 2 && (
                <div className="smr_material_details_portion">
                    {(diaList?.length > 0 ||
                        csList?.filter((ele) => ele?.D === "MISC")?.length > 0 ||
                        csList?.filter((ele) => ele?.D !== "MISC")?.length > 0) && (
                        <p className="smr_details_title"> Product Details</p>
                    )}

                    {/* Diamond Details */}
                    {diaList?.length > 0 && (
                        <div className="smr_material_details_portion_inner">
                            <ul style={{ margin: "0px 0px 3px 0px" }}>
                                <li style={{ fontWeight: 600 }}>
                                    {`Diamond Detail (${diaList?.reduce(
                                        (accumulator, data) => accumulator + data.M,
                                        0
                                    )} / ${diaList
                                        ?.reduce(
                                            (accumulator, data) => accumulator + data?.N,
                                            0
                                        )
                                        .toFixed(3)}ct)`}
                                </li>
                            </ul>
                            <ul className="smr_mt_detail_title_ul">
                                <li className="smr_proDeatilList">Shape</li>
                                <li className="smr_proDeatilList">Clarity</li>
                                <li className="smr_proDeatilList">Color</li>
                                <li className="smr_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
                            </ul>
                            {diaList?.map((data, i) => (
                                <ul key={i} className="smr_mt_detail_title_ul">
                                    <li className="smr_proDeatilList1">{data?.F}</li>
                                    <li className="smr_proDeatilList1">{data?.H}</li>
                                    <li className="smr_proDeatilList1">{data?.J}</li>
                                    <li className="smr_proDeatilList1">
                                        {data.M}&nbsp;/&nbsp;{data?.N?.toFixed(3)}
                                    </li>
                                </ul>
                            ))}
                        </div>
                    )}

                    {/* ColorStone Details */}
                    {csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
                        <div className="smr_material_details_portion_inner">
                            <ul style={{ margin: "10px 0px 3px 0px" }}>
                                <li style={{ fontWeight: 600 }}>
                                    {`ColorStone Detail (${csList
                                        ?.filter((ele) => ele?.D !== "MISC")
                                        ?.reduce(
                                            (accumulator, data) => accumulator + data.M,
                                            0
                                        )} / ${csList
                                            ?.filter((ele) => ele?.D !== "MISC")
                                            ?.reduce(
                                                (accumulator, data) => accumulator + data?.N,
                                                0
                                            )
                                            .toFixed(3)}ct)`}
                                </li>
                            </ul>
                            <ul className="smr_mt_detail_title_ul">
                                <li className="smr_proDeatilList">Shape</li>
                                <li className="smr_proDeatilList">Clarity</li>
                                <li className="smr_proDeatilList">Color</li>
                                <li className="smr_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
                            </ul>
                            {csList
                                ?.filter((ele) => ele?.D !== "MISC")
                                ?.map((data, i) => (
                                    <ul key={i} className="smr_mt_detail_title_ul">
                                        <li className="smr_proDeatilList1">{data?.F}</li>
                                        <li className="smr_proDeatilList1">{data?.H}</li>
                                        <li className="smr_proDeatilList1">{data?.J}</li>
                                        <li className="smr_proDeatilList1">
                                            {data.M}&nbsp;/&nbsp;{data?.N?.toFixed(3)}
                                        </li>
                                    </ul>
                                ))}
                        </div>
                    )}

                    {/* MISC Details */}
                    {csList?.filter((ele) => ele?.D === "MISC")?.length > 0 && (
                        <div className="smr_material_details_portion_inner">
                            <ul style={{ margin: "10px 0px 3px 0px" }}>
                                <li style={{ fontWeight: 600 }}>
                                    {`MISC Detail (${csList
                                        ?.filter((ele) => ele?.D === "MISC")
                                        ?.reduce(
                                            (accumulator, data) => accumulator + data.M,
                                            0
                                        )} / ${csList
                                            ?.filter((ele) => ele?.D === "MISC")
                                            ?.reduce(
                                                (accumulator, data) => accumulator + data?.N,
                                                0
                                            )
                                            .toFixed(3)}gm)`}
                                </li>
                            </ul>
                            <ul className="smr_mt_detail_title_ul">
                                <li className="smr_proDeatilList">Shape</li>
                                <li className="smr_proDeatilList">Clarity</li>
                                <li className="smr_proDeatilList">Color</li>
                                <li className="smr_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
                            </ul>
                            {csList
                                ?.filter((ele) => ele?.D === "MISC")
                                ?.map((data, i) => (
                                    <ul key={i} className="smr_mt_detail_title_ul">
                                        <li className="smr_proDeatilList1">{data?.F}</li>
                                        <li className="smr_proDeatilList1">{data?.H}</li>
                                        <li className="smr_proDeatilList1">{data?.J}</li>
                                        <li className="smr_proDeatilList1">
                                            {data.M}&nbsp;/&nbsp;{data?.N?.toFixed(3)}
                                        </li>
                                    </ul>
                                ))}
                        </div>
                    )}
                </div>
            )}

            {/* Stock Items Section */}
            {stockItemArr?.length > 0 &&
                storeInit?.IsStockWebsite === 1 && 
                stockItemArr?.[0]?.stat_code != 1005 && (
                <div className="smr_stockItem_div">
                    <p className="smr_details_title"> Stock Items </p>
                    <div className="smr_stockitem_container">
                        <table className="Smr_stockItem_table">
                            <thead>
                                <tr className="Smr_stockItem_table_tr">
                                    <th className="Smr_stockItem_table_td">SrNo</th>
                                    <th className="Smr_stockItem_table_td">Design No</th>
                                    <th className="Smr_stockItem_table_td">Job No</th>
                                    <th
                                        className="Smr_stockItem_table_td"
                                        style={{ textAlign: "center" }}
                                    >
                                        Gross Wt / Net Wt / Dia Wt / CS Wt
                                    </th>
                                    <th className="Smr_stockItem_table_td">Metal Color-Purity</th>
                                    {Boolean(storeInit?.IsPriceShow) && (
                                        <th className="Smr_stockItem_table_td">Price</th>
                                    )}
                                    <th className="Smr_stockItem_table_td">Add To Cart</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockItemArr?.map((ele, i) => (
                                    <tr key={i} className="Smr_stockItem_table_tr">
                                        <td className="Smr_stockItem_table_td">
                                            <span className="smr_prod_designno">
                                                {ele?.SrNo}
                                            </span>
                                        </td>
                                        <td className="Smr_stockItem_table_td">
                                            <span className="smr_prod_designno">
                                                {ele?.designno}
                                            </span>
                                        </td>
                                        <td className="Smr_stockItem_table_td">
                                            <span className="smr_prod_designno">
                                                {ele?.StockBarcode}
                                            </span>
                                        </td>
                                        <td className="Smr_stockItem_table_td">
                                            <div className="smr_prod_Allwt_det">
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        letterSpacing: "1px",
                                                        gap: "3px",
                                                    }}
                                                >
                                                    {storeInit?.IsGrossWeight == 1 &&
                                                        Number(ele?.GrossWt) !== 0 && (
                                                        <>
                                                            <span className="smr_prod_wt">
                                                                <span className="smr_d_keys">GWT:</span>
                                                                <span className="smr_d_val">
                                                                    {ele?.GrossWt?.toFixed(3)}
                                                                </span>
                                                            </span>
                                                        </>
                                                    )}

                                                    {Number(ele?.NetWt) !== 0 && (
                                                        <>
                                                            <span>|</span>
                                                            <span className="smr_prod_wt">
                                                                <span className="smr_d_keys">NWT:</span>
                                                                <span className="smr_d_val">
                                                                    {ele?.NetWt?.toFixed(3)}
                                                                </span>
                                                            </span>
                                                        </>
                                                    )}

                                                    {storeInit?.IsDiamondWeight == 1 &&
                                                        Number(ele?.DiaWt) !== 0 && (
                                                        <>
                                                            <span>|</span>
                                                            <span className="smr_prod_wt">
                                                                <span className="smr_d_keys">DWT:</span>
                                                                <span className="smr_d_val">
                                                                    {ele?.DiaWt?.toFixed(3)}
                                                                    {storeInit?.IsDiamondPcs === 1
                                                                        ? `/${ele?.DiaPcs}`
                                                                        : null}
                                                                </span>
                                                            </span>
                                                        </>
                                                    )}

                                                    {storeInit?.IsStoneWeight == 1 &&
                                                        Number(ele?.CsWt) !== 0 && (
                                                        <>
                                                            <span>|</span>
                                                            <span className="smr_prod_wt">
                                                                <span className="smr_d_keys">CWT:</span>
                                                                <span className="smr_d_val">
                                                                    {ele?.CsWt?.toFixed(3)}
                                                                    {storeInit?.IsStonePcs === 1
                                                                        ? `/${ele?.CsPcs}`
                                                                        : null}
                                                                </span>
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="Smr_stockItem_table_td">
                                            <span>
                                                {ele?.MetalColorName}-{ele?.metaltypename}
                                                {ele?.metalPurity}
                                            </span>
                                        </td>
                                        {storeInit?.IsPriceShow == 1 && (
                                            <td className="Smr_stockItem_table_td">
                                                <span>
                                                    <span className="smr_currencyFont">
                                                        {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                                    </span>
                                                    &nbsp;
                                                    <span> {formatter.format(ele?.Amount)}</span>
                                                </span>
                                            </td>
                                        )}
                                        <td
                                            className="Smr_stockItem_table_td"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                border: "none",
                                            }}
                                        >
                                            <Checkbox
                                                icon={
                                                    <LocalMallOutlinedIcon
                                                        sx={{
                                                            fontSize: "22px",
                                                            color: "#7d7f85",
                                                            opacity: ".7",
                                                        }}
                                                    />
                                                }
                                                checkedIcon={
                                                    <LocalMallIcon
                                                        sx={{
                                                            fontSize: "22px",
                                                            color: "#009500",
                                                        }}
                                                    />
                                                }
                                                disableRipple={false}
                                                sx={{ padding: "10px" }}
                                                onChange={(e) => handleCartandWish(e, ele, "Cart")}
                                                checked={
                                                    cartArr[ele?.StockId] ?? ele?.IsInCart === 1
                                                        ? true
                                                        : false
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Similar Designs Section */}
            {storeInit?.IsProductDetailSimilarDesign == 1 &&
                SimilarBrandArr?.length > 0 && 
                SimilarBrandArr?.[0]?.stat_code != 1005 && (
                <div className="smr_stockItem_div">
                    <p className="smr_details_title"> Similar Designs</p>
                    <div className="smr_stockitem_container">
                        <div className="smr_stock_item_card">
                            {SimilarBrandArr?.map((ele, i) => (
                                <div
                                    key={i}
                                    className="smr_stockItemCard"
                                    onClick={() => handleMoveToDetail(ele)}
                                >
                                    <img
                                        className="smr_productCard_Image"
                                        src={
                                            ele?.ImageCount > 0
                                                ? storeInit?.CDNDesignImageFolThumb +
                                                  ele?.designno +
                                                  "~" +
                                                  "1" +
                                                  "." +
                                                  "jpg"
                                                : imageNotFound
                                        }
                                        loading="lazy"
                                        alt={""}
                                        onError={(e) => {
                                            e.target.src = imageNotFound;
                                            e.target.alt = 'no-image-found';
                                        }}
                                        draggable={true}
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                    <div
                                        className="smr_stockutem_shortinfo"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "5px",
                                            paddingBottom: "5px",
                                        }}
                                    >
                                        <span
                                            className="smr_prod_designno"
                                            style={{ fontSize: "14px" }}
                                        >
                                            {ele?.designno}
                                        </span>

                                        {storeInit?.IsPriceShow == 1 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    fontSize: "16px",
                                                }}
                                                className="smr_stockItem_price_type_mt"
                                            >
                                                <span>
                                                    <span className="smr_currencyFont">
                                                        {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                                    </span>
                                                    &nbsp;
                                                </span>
                                                <span>
                                                    {formatter.format(ele?.UnitCostWithMarkUp)}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Design Set Section */}
            {storeInit?.IsProductDetailDesignSet === 1 && (
                <div className="smr_DesignSet_main">
                    {designSetList?.length > 0 && designSetList?.[0]?.stat_code != 1005 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <p className="smr_details_title">Complete The Look</p>
                        </div>
                    )}

                    <div className="smr_Swiper_designSet">
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar]}
                            navigation
                            pagination={{ clickable: true }}
                        >
                            {designSetList?.map((designSetList, i) => (
                                <SwiperSlide key={i}>
                                    <div className="compeletethelook_cont">
                                        <div className="smr_ctlImg_containe">
                                            <img
                                                src={
                                                    designSetList?.DefaultImageName
                                                        ? storeInit?.DesignSetImageFol +
                                                          designSetList?.designsetuniqueno +
                                                          "/" +
                                                          designSetList?.DefaultImageName
                                                        : imageNotFound
                                                }
                                                draggable={true}
                                                onContextMenu={(e) => e.preventDefault()}
                                                alt={""}
                                                loading="lazy"
                                                className="ctl_img"
                                                onError={(e) => e.target.src = imageNotFound}
                                            />
                                        </div>

                                        <div
                                            className={
                                                (designSetList?.Designdetail == undefined
                                                    ? []
                                                    : JSON.parse(designSetList?.Designdetail)
                                                )?.length > 3
                                                    ? "compeletethelook_prodt_for_3"
                                                    : "compeletethelook_prodt"
                                            }
                                        >
                                            {(designSetList?.Designdetail == undefined
                                                ? []
                                                : JSON.parse(designSetList?.Designdetail)
                                            )?.map((ele, i) => {
                                                const imageUrl =
                                                    storeInit?.CDNDesignImageFolThumb +
                                                    ele?.designno +
                                                    "~" +
                                                    "1" +
                                                    "." +
                                                    "jpg";
                                                return (
                                                    <div
                                                        key={i}
                                                        className="completethelook_outer"
                                                        onClick={() => handleMoveToDetail(ele)}
                                                        style={{
                                                            borderTop: i !== 0 ? "none" : "",
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <div style={{ display: "flex", gap: "60px" }}>
                                                            <div style={{ marginLeft: "12px" }}>
                                                                <img
                                                                    src={
                                                                        ele?.ImageCount > 0
                                                                            ? imageUrl
                                                                            : imageNotFound
                                                                    }
                                                                    alt={""}
                                                                    loading="lazy"
                                                                    draggable={true}
                                                                    onContextMenu={(e) => e.preventDefault()}
                                                                    onError={(e) => {
                                                                        const imgEl = e.target;
                                                                        imgEl.src = imageNotFound;
                                                                    }}
                                                                    className="srthelook_img"
                                                                />
                                                            </div>
                                                            <div className="srthelook_prodinfo">
                                                                <div
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        color: "#7d7f85",
                                                                        textTransform: "uppercase",
                                                                    }}
                                                                    className="srthelook_prodinfo_inner"
                                                                >
                                                                    <p>
                                                                        {ele?.designno} - {ele?.CategoryName}
                                                                        <br />
                                                                        {storeInit?.IsPriceShow == 1 && (
                                                                            <>
                                                                                <span className="smr_currencyFont">
                                                                                    {loginInfo?.CurrencyCode ??
                                                                                        storeInit?.CurrencyCode}
                                                                                </span>
                                                                                &nbsp;
                                                                                {formatter.format(
                                                                                    ele?.UnitCostWithMarkUp
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductSections;