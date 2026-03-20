import React from "react";
import { IconButton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import LookbookSkelton from "../lookbookSkelton";
import { Pagination, FreeMode, Navigation, Thumbs, Scrollbar, Keyboard } from "swiper/modules";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const DesignBlockView = ({
    selectedValue,
    filteredDesignSetLstData,
    isPgLoading,
    storeInit,
    loginUserDetail,
    cartItems,
    imageNotFound,
    imageLoadError,
    dataKey,
    ProdCardImageFunc,
    handleImageError,
    handleHoverImages,
    seyDataKey,
    getRandomBgColor,
    calculateTotalUnitCostWithMarkUp,
    calculateTotalUnitCostWithMarkUpDwt,
    calculateTotalUnitCostWithMarkUpGWt,
    calculateTotalUnitCostWithMarkUpNwt,
    parseDesignDetails,
    sortDesignDetailsBySrNo,
    handleByCombo,
    handleAddToCart,
    handleRemoveCart,
    handleNavigation,
    setSwiper,
    setThumbsSwiper,
    SwiperSlideRef,
    DynamicSize,
    thumbsSwiper ,
    handleImageLoad ,
    imageSources ,
    imageUrlDesignSet 
}) => {
    switch (selectedValue) {
        case 2:
            return (
                <>
                    <div className="smr_lookBookImgDivMain">
                        {filteredDesignSetLstData?.length == 0 ? (
                            <div className="smr_noProductFoundLookBookDiv">
                                <p>No Product Found!</p>
                            </div>
                        ) : (
                            filteredDesignSetLstData?.map((slide, index) => (
                                <div className="smr_designSetDiv" key={index}>
                                    <div
                                        style={{
                                            display: "flex",
                                            height: dataKey == index && "100%",
                                            position: "relative",
                                        }}
                                    >
                                        {ProdCardImageFunc(slide) && !imageLoadError[index] ? (
                                            <img
                                                className="smr_lookBookImg"
                                                loading="lazy"
                                                src={ProdCardImageFunc(slide)}
                                                alt={`Slide ${index}`}
                                                onError={() => handleImageError(index)}
                                                onMouseEnter={() => handleHoverImages(index)}
                                                onMouseLeave={() => seyDataKey(null)}
                                                draggable={true}
                                                onContextMenu={(e) => e.preventDefault()}
                                                style={{
                                                    height: dataKey == index ? "100%" : "250px",
                                                    cursor: "pointer",
                                                    backgroundColor: ProdCardImageFunc(slide) === null ? "rgb(191, 200, 255)" : getRandomBgColor(index),
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    height: dataKey == index ? "100%" : "250px",
                                                    width: "100%",
                                                    ...getRandomBgColor(index),
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "rgb(191, 200, 255)",
                                                    cursor: "pointer",
                                                }}
                                            ></div>
                                        )}
                                        <p className="smr_lb2designList_title">{slide?.designsetno}</p>
                                    </div>
                                    <div
                                        className="smr_lookBookImgDeatil"
                                        style={{
                                            display: dataKey == index ? "none" : "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            margin: "5px",
                                        }}
                                    >
                                        <p className="smr_lookBookDesc" style={{ fontSize: "13px", margin: "2px" }}>
                                            DWT: {calculateTotalUnitCostWithMarkUpDwt(JSON?.parse(slide.Designdetail)).toFixed(3)} | GWT: {calculateTotalUnitCostWithMarkUpGWt(JSON?.parse(slide.Designdetail)).toFixed(3)} | NWT: {calculateTotalUnitCostWithMarkUpNwt(JSON?.parse(slide.Designdetail)).toFixed(3)}{" "}
                                        </p>
                                        <div className="smr_lookBookImgDeatilSub" style={{ display: "flex", alignItems: "center" }}>
                                            {storeInit?.IsPriceShow == 1 && (
                                                <p
                                                    style={{
                                                        margin: "0px 10px 0px 0px",
                                                        fontSize: "15px",
                                                        fontWeight: 600,
                                                    }}
                                                    className="smr_lookBookPriceShow"
                                                >
                                                    {" "}
                                                    <span className="smr_currencyFont">{loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}</span>
                                                    &nbsp;
                                                    {formatter(calculateTotalUnitCostWithMarkUp(JSON?.parse(slide.Designdetail)))}
                                                </p>
                                            )}
                                            <button className="smr_lookBookBuyBtn" onClick={() => handleByCombo(parseDesignDetails(slide?.Designdetail, "Cart"))}>
                                                Buy Combo
                                            </button>
                                        </div>
                                    </div>
                                    <div className="smr_lookBookSubImgMain" style={{ display: dataKey == index && "none" }}>
                                        <Swiper
                                            slidesPerView={4}
                                            spaceBetween={10}
                                            navigation={true}
                                            loop={false}
                                            modules={[Pagination, Navigation]}
                                            className="smr_LookBookmySwiper"
                                            breakpoints={{
                                                320: { slidesPerView: 1, spaceBetween: 10 },
                                                480: { slidesPerView: 2, spaceBetween: 20 },
                                                640: { slidesPerView: 3, spaceBetween: 30 },
                                            }}
                                        >
                                            {sortDesignDetailsBySrNo(parseDesignDetails(slide?.Designdetail))?.map((detail, subIndex) => {
                                                const imageSrc = imageSources[detail?.designno] || imageNotFound;

                                                return (
                                                    <div className="smr_lookBookSubImageDiv" key={` ${subIndex + index}-view_${detail?.designno}`}>
                                                        <SwiperSlide key={` ${subIndex + index}-view_${detail?.designno}`} className="smr_lookBookSliderSubDiv" style={{ marginRight: "0px", cursor: "pointer" }}>
                                                            {detail?.IsInReadyStock == 1 && <span className="smr_LookBookinstock">In Stock</span>}
                                                            <img
                                                                className="smr_lookBookSubImage"
                                                                loading="lazy"
                                                                src={imageSrc}
                                                                alt={`Sub image ${subIndex} for slide ${index}`}
                                                                onClick={() => handleNavigation(detail?.designno, detail?.autocode, detail?.TitleLine ? detail?.TitleLine : "",detail)}
                                                                draggable={true}
                                                                onContextMenu={(e) => e.preventDefault()}
                                                                onError={(e) => {
                                                                    e.target.src = imageNotFound;
                                                                }}
                                                            />
                                                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
                                                                {cartItems.includes(detail?.autocode) ? (
                                                                    <button className="smr_lookBookINCartBtn" onClick={() => handleRemoveCart(detail)}>
                                                                        REMOVE CART
                                                                    </button>
                                                                ) : (
                                                                    <button className="smr_lookBookAddtoCartBtn" onClick={() => handleAddToCart(detail)}>
                                                                        ADD TO CART +
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </SwiperSlide>
                                                    </div>
                                                );
                                            })}
                                        </Swiper>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    ) : (
                    <LookbookSkelton param={selectedValue} />
          )
                </>
            );
        case 3:
            return (
                <>
                    {!isPgLoading ? (
                        <div className="smr_lookBookImgDivMain">
                            {filteredDesignSetLstData?.length == 0 ? (
                                <div className="smr_noProductFoundLookBookDiv">
                                    <p>No Product Found!</p>
                                </div>
                            ) : (
                                <>
                                    {filteredDesignSetLstData?.map((slide, index) => (
                                        <div className="smr_designSetDiv2" key={index}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    width: "30%",
                                                    height: "300px",
                                                    position: "relative",
                                                }}
                                                className="smr_designSetDiv2_sub1"
                                            >
                                                {ProdCardImageFunc(slide) && !imageLoadError[index] ? (
                                                    <img
                                                        className="smr_lookBookImg"
                                                        loading="lazy"
                                                        src={ProdCardImageFunc(slide)}
                                                        alt={`Slide ${index}`}
                                                        onError={() => handleImageError(index)}
                                                        style={{
                                                            height: "100%",
                                                            cursor: "pointer",
                                                            backgroundColor: ProdCardImageFunc(slide) === null ? "rgb(191, 200, 255)" : getRandomBgColor(index),
                                                        }}
                                                        draggable={true}
                                                        onContextMenu={(e) => e.preventDefault()}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            height: "100%",
                                                            width: "100%",
                                                            ...getRandomBgColor(index),
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            cursor: "pointer",
                                                            backgroundColor: "rgb(191, 200, 255)",
                                                        }}
                                                    ></div>
                                                )}
                                                <p className="smr_lb1designList_title">{slide?.designsetno}</p>
                                            </div>

                                            <div
                                                style={{
                                                    display: dataKey == index && "none",
                                                    display: "flex",
                                                    width: "70%",
                                                    justifyContent: "space-around",
                                                    alignItems: "center",
                                                    flexDirection: "column",
                                                }}
                                                className="smr_designSetDiv2_sub2"
                                            >
                                                <div
                                                    className="smr_lookBookImgDeatil"
                                                    style={{
                                                        display: dataKey == index ? "none" : "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        width: "100%",
                                                        padding: "0px 15px",
                                                        margin: "5px",
                                                    }}
                                                >
                                                    <p className="smr_lookBookDesc" style={{ fontSize: "13px", margin: "2px" }}>
                                                        DWT: {calculateTotalUnitCostWithMarkUpDwt(JSON?.parse(slide.Designdetail)).toFixed(3)} | GWT: {calculateTotalUnitCostWithMarkUpGWt(JSON?.parse(slide.Designdetail)).toFixed(3)} | NWT: {calculateTotalUnitCostWithMarkUpNwt(JSON?.parse(slide.Designdetail)).toFixed(3)}{" "}
                                                    </p>
                                                    <div className="smr_lookBookImgDeatilSub" style={{ display: "flex", alignItems: "center" }}>
                                                        {storeInit?.IsPriceShow == 1 && (
                                                            <p
                                                                style={{
                                                                    margin: "0px 10px 0px 0px",
                                                                    fontSize: "15px",
                                                                    fontWeight: 600,
                                                                }}
                                                                className="smr_lookBookPriceShow"
                                                            >
                                                                <span className="smr_currencyFont">{loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}</span>
                                                                &nbsp;
                                                                {formatter(calculateTotalUnitCostWithMarkUp(JSON?.parse(slide.Designdetail)))}
                                                            </p>
                                                        )}
                                                        <button className="smr_lookBookBuyBtn" onClick={() => handleByCombo(parseDesignDetails(slide?.Designdetail, "Cart"))}>
                                                            Buy Combo
                                                        </button>
                                                    </div>
                                                </div>
                                                <Swiper
                                                    slidesPerView={4}
                                                    spaceBetween={10}
                                                    navigation={true}
                                                    loop={false}
                                                    modules={[Pagination, Navigation]}
                                                    className="smr_LookBookmySwiper smr_lookBookThirdViewWeb"
                                                    breakpoints={{
                                                        320: {
                                                            slidesPerView: 1,
                                                            spaceBetween: 10,
                                                        },
                                                        480: {
                                                            slidesPerView: 2,
                                                            spaceBetween: 20,
                                                        },
                                                        640: {
                                                            slidesPerView: 3,
                                                            spaceBetween: 30,
                                                        },
                                                    }}
                                                >
                                                    {sortDesignDetailsBySrNo(parseDesignDetails(slide?.Designdetail))?.map((detail, subIndex) => (
                                                        <div className="smr_lookBookSubImageDiv" key={subIndex}>
                                                            <SwiperSlide
                                                                key={subIndex + index + "-view_" + detail?.designno}
                                                                className="smr_lookBookSliderSubDiv"
                                                                style={{
                                                                    marginRight: "0px",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                {detail?.IsInReadyStock == 1 && <span className="smr_LookBookinstock">In Stock</span>}
                                                                <img
                                                                    className="smr_lookBookSubImage"
                                                                    loading="lazy"
                                                                    // src={`${imageUrlDesignSet}${detail?.designno}~1.${detail?.ImageExtension}`}
                                                                    src={`${imageUrlDesignSet}${detail?.designno}~1.jpg`}
                                                                    // alt={`Sub image ${subIndex} for slide ${index}`}
                                                                    onClick={() => handleNavigation(detail?.designno, detail?.autocode, detail?.TitleLine ? detail?.TitleLine : "",detail)}
                                                                    draggable={true}
                                                                    onContextMenu={(e) => e.preventDefault()}
                                                                    onError={(e) => {
                                                                        e.target.src = imageNotFound;
                                                                        e.target.alt = "";
                                                                    }}
                                                                />
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        marginBottom: "5px",
                                                                    }}
                                                                >
                                                                    {cartItems.includes(detail?.autocode) ? (
                                                                        <button className="smr_lookBookINCartBtn" onClick={() => handleRemoveCart(detail)}>
                                                                            REMOVE CART
                                                                        </button>
                                                                    ) : (
                                                                        <button className="smr_lookBookAddtoCartBtn" onClick={() => handleAddToCart(detail)}>
                                                                            ADD TO CART +
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </SwiperSlide>
                                                        </div>
                                                    ))}
                                                </Swiper>

                                                <div className="smr_LookBookMobileThridViewMain">
                                                    <div className="card">
                                                        <Swiper className="smr_LookBookMobileThridViewMain_swiper_w" spaceBetween={5} slidesPerView={1} speed={1000} onSwiper={setSwiper} navigation pagination>
                                                            {sortDesignDetailsBySrNo(parseDesignDetails(slide?.Designdetail))?.map((detail, subIndex) => (
                                                                <div className="smr_lookBookSubImageDiv" key={subIndex}>
                                                                    <SwiperSlide
                                                                        key={`detail-${detail?.id}_view_${detail?.designno}`}
                                                                        style={{
                                                                            marginRight: "0px",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        {detail?.IsInReadyStock == 1 && <span className="smr_LookBookinstock">In Stock</span>}
                                                                        <img
                                                                            className="smr_lookBookSubImage"
                                                                            loading="lazy"
                                                                            src={`${imageUrlDesignSet}${detail?.designno}~1.jpg`}
                                                                            alt={`Sub image ${subIndex} for slide ${index}`}
                                                                            onClick={() => handleNavigation(detail?.designno, detail?.autocode, detail?.TitleLine ? detail?.TitleLine : "",detail)}
                                                                            draggable={true}
                                                                            onContextMenu={(e) => e.preventDefault()}
                                                                            onError={(e) => {
                                                                                e.target.src = imageNotFound;
                                                                            }}
                                                                        />
                                                                        <div
                                                                            style={{
                                                                                display: "flex",
                                                                                justifyContent: "center",
                                                                                marginBottom: "5px",
                                                                            }}
                                                                        >
                                                                            {cartItems.includes(detail?.autocode) ? (
                                                                                <button className="smr_lookBookINCartBtn" onClick={() => handleRemoveCart(detail)}>
                                                                                    REMOVE CART
                                                                                </button>
                                                                            ) : (
                                                                                <button className="smr_lookBookAddtoCartBtn" onClick={() => handleAddToCart(detail)}>
                                                                                    ADD TO CART +
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </SwiperSlide>
                                                                </div>
                                                            ))}
                                                        </Swiper>
                                                    </div>
                                                </div>

                                                {/* } */}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    ) : (
                        <LookbookSkelton param={selectedValue} />
                    )}
                </>
            );
        case 1:
            return (
                <>
                    {!isPgLoading ? (
                        <div className="smr_lookbook3MainDiv">
                            {filteredDesignSetLstData?.length == 0 ? (
                                <div className="smr_noProductFoundLookBookDiv">
                                    <p>No Product Found!</p>
                                </div>
                            ) : (
                                <>
                                    <Swiper initialSlide={0} slidesPerView={1} spaceBetween={10} navigation={true} loop={true} thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }} modules={[Keyboard, FreeMode, Navigation, Thumbs, Scrollbar]} keyboard={{ enabled: true }} mousewheel={true} className="smr_LookBookmySwiper mySwiper2">
                                        {filteredDesignSetLstData?.map((slide, index) => (
                                            <SwiperSlide key={index}>
                                                <div>
                                                    <div className="smr1_lb3compeletethelook_cont">
                                                        <div className="smr1_lb3ctlImg_containe">
                                                            {ProdCardImageFunc(slide) && !imageLoadError[index] ? (
                                                                <img
                                                                    src={ProdCardImageFunc(slide)}
                                                                    alt={`Slide ${index}`}
                                                                    onError={() => handleImageError(index)}
                                                                    className="smr_lb3ctl_img_new"
                                                                    style={{
                                                                        backgroundColor: ProdCardImageFunc(slide) === null ? "rgb(191, 200, 255)" : getRandomBgColor(index),
                                                                    }}
                                                                    draggable={true}
                                                                    onContextMenu={(e) => e.preventDefault()}
                                                                />
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        height: "100%",
                                                                        width: "100%",
                                                                        ...getRandomBgColor(index),
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        cursor: "pointer",
                                                                        backgroundColor: "rgb(191, 200, 255)",
                                                                    }}
                                                                    className="smr_lb3ctl_img_new"
                                                                ></div>
                                                            )}
                                                        </div>
                                                        <div className={(slide?.Designdetail == undefined ? [] : sortDesignDetailsBySrNo(parseDesignDetails(slide?.Designdetail)))?.length > 3 ? "smr_lb3compeletethelook_prodt_for_3" : "smr_lb3compeletethelook_prodt"}>
                                                            <p className="smr_lb3designList_title">{slide?.designsetno}</p>
                                                            <div className="smr_lb3_prodtDivs2">
                                                                {sortDesignDetailsBySrNo(parseDesignDetails(slide?.Designdetail))?.map((ele, subIndex) => (
                                                                    <div
                                                                        key={subIndex}
                                                                        className="smr_lb3completethelook_outer"
                                                                        style={{
                                                                            borderTop: subIndex !== 0 ? "none" : "",
                                                                            width: "513px",
                                                                            padding: "5px",
                                                                            border: "1px solid #e1e1e1",
                                                                            backgroundColor: "#fff",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className="smr_lookbookMainDivdata"
                                                                            style={{
                                                                                display: "flex",
                                                                                gap: "40px",
                                                                                justifyContent: "space-around",
                                                                            }}
                                                                        >
                                                                            <div className="smr_lb3ImageDiv" style={{ marginLeft: "12px" }}>
                                                                                <img
                                                                                    src={
                                                                                        ele?.ImageCount > 0
                                                                                            ? // ? `${storeInit?.CDNDesignImageFol}${ele?.designno}~1.${ele?.ImageExtension}`
                                                                                            `${storeInit?.CDNDesignImageFolThumb}${ele?.designno}~1.jpg`
                                                                                            : imageNotFound
                                                                                    }
                                                                                    alt=""
                                                                                    className="smr_lb3srthelook_img"
                                                                                    onClick={() => handleNavigation(ele?.designno, ele?.autocode, ele?.TitleLine ? ele?.TitleLine : "",detail)}
                                                                                    draggable={true}
                                                                                    onContextMenu={(e) => e.preventDefault()}
                                                                                    onError={(e) => {
                                                                                        e.target.src = imageNotFound;
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="smr_lb3srthelook_prodinfo" onClick={() => handleNavigation(ele?.designno, ele?.autocode, ele?.TitleLine ? ele?.TitleLine : "",detail)}>
                                                                                <div
                                                                                    style={{
                                                                                        fontSize: "14px",
                                                                                        color: "#7d7f85",
                                                                                        textTransform: "uppercase",
                                                                                    }}
                                                                                    className="smr_lb3srthelook_prodinfo_inner"
                                                                                >
                                                                                    <p>
                                                                                        <span>
                                                                                            {ele?.designno} - {ele?.CategoryName}
                                                                                        </span>
                                                                                        <br />

                                                                                        {storeInit?.IsGrossWeight == 1 && (
                                                                                            <>
                                                                                                <span className="smr_lb3detailDT">GWT: </span>
                                                                                                <span className="smr_lb3detailDT">{(ele?.Gwt || 0)?.toFixed(3)}</span>
                                                                                            </>
                                                                                        )}
                                                                                        {storeInit?.IsMetalWeight == 1 && (
                                                                                            <>
                                                                                                {Number(ele?.Nwt) !== 0 && (
                                                                                                    <>
                                                                                                        <span className="smr_lb3pipe"> | </span>
                                                                                                        <span className="smr_lb3detailDT">NWT : </span>
                                                                                                        <span className="smr_lb3detailDT">{(ele?.Nwt || 0)?.toFixed(3)}</span>
                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                        {storeInit?.IsGrossWeight == 1 && (
                                                                                            <>
                                                                                                {(ele?.Dwt != "0" || ele?.Dpcs != "0") && (
                                                                                                    <>
                                                                                                        <span className="smr_lb3pipe"> | </span>
                                                                                                        <span className="smr_lb3detailDT">DWT: </span>
                                                                                                        <span className="smr_lb3detailDT">
                                                                                                            {(ele?.Dwt || 0)?.toFixed(3)} / {ele?.Dpcs || 0}
                                                                                                        </span>
                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                        {(ele?.CSwt != "0" || ele?.CSpcs != "0") && <br />}
                                                                                        {storeInit?.IsStoneWeight == 1 && (
                                                                                            <>
                                                                                                {(ele?.CSwt != "0" || ele?.CSpcs != "0") && (
                                                                                                    <>
                                                                                                        {/* <span className='smr_lb3pipe'> | </span> */}
                                                                                                        <span className="smr_lb3detailDT">CWT: </span>
                                                                                                        <span className="smr_lb3detailDT">
                                                                                                            {(ele?.CSwt || 0)?.toFixed(3)} /{ele?.CSpcs || 0}
                                                                                                        </span>
                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                        <br />
                                                                                        {storeInit?.IsPriceShow == 1 && (
                                                                                            <>
                                                                                                <span className="smr_currencyFont">{loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}</span>
                                                                                                &nbsp;
                                                                                                {formatter(ele?.UnitCostWithMarkUp)}
                                                                                            </>
                                                                                        )}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    display: "flex",
                                                                                    justifyContent: "end",
                                                                                    alignItems: "center",
                                                                                    marginBottom: "5px",
                                                                                }}
                                                                                className="smr_lb3cartIconBtnDiv"
                                                                            >
                                                                                {cartItems.includes(ele?.autocode) ? (
                                                                                    <IconButton onClick={() => handleRemoveCart(ele)}>
                                                                                        <LocalMallIcon className="smr_lookBookINCartIconBtn" />
                                                                                    </IconButton>
                                                                                ) : (
                                                                                    <IconButton onClick={() => handleAddToCart(ele)}>
                                                                                        <LocalMallOutlinedIcon className="smr_lookBookAddtoCartIconBtn" />
                                                                                    </IconButton>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="smr_lb3TotalBtnGroups">
                                                                {storeInit?.IsPriceShow == 1 && (
                                                                    <div className="smr_lb3TotalPrice">
                                                                        <span>
                                                                            <span className="smr_currencyFont">{loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}</span>
                                                                            &nbsp;
                                                                            {formatter(calculateTotalUnitCostWithMarkUp(JSON?.parse(slide.Designdetail)))}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="smr_lb3BuyComboDiv" onClick={() => handleByCombo(parseDesignDetails(slide?.Designdetail, "Cart"))}>
                                                                    <span>Buy Combo</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <div className="smr_lookbook3thumbMainDiv">
                                        {filteredDesignSetLstData?.length != 0 && (
                                            <Swiper
                                                initialSlide={0}
                                                onSwiper={setThumbsSwiper}
                                                spaceBetween={10}
                                                slidesPerView={20}
                                                freeMode={true}
                                                watchSlidesProgress={true}
                                                modules={[Keyboard, FreeMode, Navigation, Thumbs]}
                                                keyboard={{ enabled: true }}
                                                mousewheel={true}
                                                className="mySwiper"
                                                breakpoints={{
                                                    320: {
                                                        slidesPerView: 2,
                                                        spaceBetween: 10,
                                                    },
                                                    480: {
                                                        slidesPerView: 3,
                                                        spaceBetween: 10,
                                                    },
                                                    640: {
                                                        slidesPerView: 4,
                                                        spaceBetween: 10,
                                                    },
                                                    768: {
                                                        slidesPerView: 5,
                                                        spaceBetween: 10,
                                                    },
                                                    1024: {
                                                        slidesPerView: 10,
                                                        spaceBetween: 10,
                                                    },
                                                    1280: {
                                                        slidesPerView: 20,
                                                        spaceBetween: 10,
                                                    },
                                                }}
                                            >
                                                {filteredDesignSetLstData?.map((slide, index) => (
                                                    <SwiperSlide key={index} ref={SwiperSlideRef}>
                                                        {ProdCardImageFunc(slide) && !imageLoadError[index] ? (
                                                            <img
                                                                src={ProdCardImageFunc(slide)}
                                                                alt=""
                                                                className="ctl_Paginationimg"
                                                                onLoad={() => {
                                                                    handleImageLoad();
                                                                }}
                                                                onError={() => handleImageError(index)}
                                                                style={{
                                                                    height: DynamicSize.h || "66.5px",
                                                                    width: DynamicSize.w || "66.5x",
                                                                    backgroundColor: ProdCardImageFunc(slide) === null ? "rgb(191, 200, 255)" : getRandomBgColor(index),
                                                                }}
                                                                draggable={true}
                                                                onContextMenu={(e) => e.preventDefault()}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    ...getRandomBgColor(index),
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    height: DynamicSize.h || "66.5px",
                                                                    width: DynamicSize.w || "66.5x",
                                                                    backgroundColor: "rgb(191, 200, 255)",
                                                                    cursor: "pointer",
                                                                    margin: 0,
                                                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
                                                                }}
                                                                className="smr_lb3ctl_img_new"
                                                            ></div>
                                                        )}
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <LookbookSkelton param={selectedValue} />
                    )}
                </>
            );
        default:
            return null;
    }
};

export default DesignBlockView;
