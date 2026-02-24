import React, { useEffect } from "react";
import { Skeleton } from "@mui/material";
import { IoIosPlayCircle } from "react-icons/io";

const ProductImageGallery = ({
    ImagePromise,
    isVisionShow,
    selectedThumbImg,
    vison360,
    pdThumbImg,
    filteredVideos,
    storeInit,
    setSelectedThumbImg,
    setIsVisionShow,
    setThumbImgIndex,
}) => {

    const imageNotFound = "/image-not-found.jpg";

    return (
        <div className="smr_prod_image_Sec">
            {ImagePromise && (
                <Skeleton
                    sx={{
                        width: "95%",
                        height: "750px",
                        margin: "20px 0 0 0",
                    }}
                    variant="rounded"
                    className="pSkelton"
                />
            )}

            <div
                className="smr_main_prod_img"
                style={{
                    display: ImagePromise ? "none" : "block",
                }}
            >
                {!isVisionShow ? (
                    selectedThumbImg?.type == "img" ? (
                        <img
                            src={selectedThumbImg?.link?.imageUrl !== "" ? selectedThumbImg?.link?.imageUrl : imageNotFound}
                            onError={(e) => {
                                e.target.src = imageNotFound;
                                e.target.alt = 'no-image-found';
                            }}
                            alt={""}
                            className="smr_prod_img"
                            loading="lazy"
                            draggable={true}
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    ) : (
                        <div className="smr_prod_video">
                            <video
                                src={filteredVideos?.length > 0 ? selectedThumbImg?.link?.imageUrl : imageNotFound}
                                loop={true}
                                autoPlay={true}
                                style={{
                                    width: "100%",
                                    objectFit: "cover",
                                    marginTop: "40px",
                                    borderRadius: "8px",
                                }}
                                draggable={true}
                                onContextMenu={(e) => e.preventDefault()}
                            // poster={imageNotFound}
                            />
                        </div>
                    )
                ) : (
                    <iframe
                        src={vison360}
                        className="smr_prod_img"
                        style={{
                            height: "80%",
                            overflow: "hidden",
                            border: "none",
                            marginLeft: "5%",
                            marginTop: "5%",
                        }}
                    />
                )}

                <div className="smr_main_thumb_prod_img">
                    {(pdThumbImg?.length > 1 ||
                        filteredVideos?.length > 0 ||
                        storeInit?.IsVision360 == 1) &&
                        pdThumbImg?.map((ele, i) => {
                            const firstHalf = ele?.thumbImageUrl?.split("/Design_Thumb")[0];
                            const secondhalf = ele?.thumbImageUrl?.split("/Design_Thumb")[1]?.split('.')[0];
                            return (
                                <img
                                    key={i}
                                    src={ele?.thumbImageUrl}
                                    alt={""}
                                    onError={(e) => {
                                        e.target.src = imageNotFound;
                                        e.target.alt = 'no-image-found';
                                    }}
                                    className="smr_prod_thumb_img"
                                    onClick={() => {
                                        setSelectedThumbImg({
                                            link: {
                                                "imageUrl": `${firstHalf}${secondhalf}.${ele?.originalImageExtension}`,
                                                "extension": `${ele?.originalImageExtension}`
                                            },
                                            type: "img",
                                        });
                                        setIsVisionShow(false);
                                        setThumbImgIndex(i);
                                    }}
                                    loading="lazy"
                                    draggable={true}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            )
                        })}

                    {filteredVideos?.map((data, i) => (
                        <div
                            key={i}
                            style={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onClick={() => {
                                setSelectedThumbImg({
                                    link: {
                                        "imageUrl": data,
                                        "extension": "mp4"
                                    },
                                    type: 'vid'
                                })
                                setIsVisionShow(false);
                            }}
                        >
                            <video
                                src={data}
                                autoPlay={false}
                                loop={true}
                                className="smr_prod_thumb_img"
                                style={{ height: "70px", objectFit: "cover" }}
                                draggable={true}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                            <IoIosPlayCircle
                                style={{
                                    position: "absolute",
                                    color: "white",
                                    width: "35px",
                                    height: "35px",
                                }}
                                onError={(e) => {
                                    e.target.poster = imageNotFound;
                                    e.target.alt = 'no-image-found';
                                }}
                            />
                        </div>
                    ))}

                    {vison360 && vison360?.length > 0 ? (
                        <img
                            src={'/360.png'}
                            alt={""}
                            className="smr_prod_thumb_img"
                            id="vision360"
                            onClick={() => {
                                setIsVisionShow(true);
                            }}
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = imageNotFound;
                                e.target.alt = 'no-image-found';
                            }}
                            draggable={true}
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ProductImageGallery;