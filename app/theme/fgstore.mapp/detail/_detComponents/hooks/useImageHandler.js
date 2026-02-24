import { useState, useEffect } from "react";

export const useImageHandler = (singleProd, singleProd1, selectMtColor, storeInit, prodLoading) => {

    // Image and video states
    const [pdThumbImg, setPdThumbImg] = useState([]);
    const [selectedThumbImg, setSelectedThumbImg] = useState({});
    const [thumbImgIndex, setThumbImgIndex] = useState();
    const [metalWiseColorImg, setMetalWiseColorImg] = useState();
    const [vison360, setVision360] = useState();
    const [selectedMetalColor, setSelectedMetalColor] = useState();
    const [pdVideoArr, setPdVideoArr] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [ImagePromise, setImagePromise] = useState(true);
    const [isVisionShow, setIsVisionShow] = useState(false);

    // Check if image is available
    const checkImageAvailability = (imageUrl) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imageUrl;
        });
    };

    // Filter videos based on selected metal color
    useEffect(() => {
        if (!pdVideoArr || !selectedMetalColor) return;

        const colorMatched = pdVideoArr.filter((url) => {
            const parts = url.split("~");
            const colorPart = parts[2]?.split(".")[0];
            return colorPart === selectedMetalColor;
        });

        if (colorMatched.length > 0) {
            setFilteredVideos(colorMatched);
        } else {
            // Fallback: videos without any color in the filename
            const noColorVideos = pdVideoArr.filter((url) => {
                const parts = url.split("~");
                return parts.length === 2; // means format is like MCJ66~1.mp4
            });
            setFilteredVideos(noColorVideos);
        }
    }, [pdVideoArr, selectedMetalColor]);

    // Main function to process product card images
    const ProdCardImageFunc = async () => {
        const mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo")) || [];
        const imageVideoDetail = singleProd?.ImageVideoDetail;
        const pd = singleProd;

        let parsedData = [];
        try {
            parsedData = imageVideoDetail === "0" ? [] : JSON.parse(imageVideoDetail || "[]");
        } catch (err) {
            console.error("Invalid JSON in ImageVideoDetail:", err);
            return;
        }

        // Filter categorized media
        const normalImages = [], colorImages = [], normalVideos = [], colorVideos = [];
        parsedData.forEach(item => {
            if (item?.TI === 1 && !item?.CN) normalImages.push(item);
            else if (item?.TI === 2 && item?.CN) colorImages.push(item);
            else if (item?.TI === 4 && item?.CN) colorVideos.push(item);
            else if (item?.TI === 3 && !item?.CN) normalVideos.push(item);
        });

        const getMaxCountByColor = (list) => {
            return list.reduce((acc, curr) => {
                const color = curr.CN;
                acc[color] = (acc[color] || 0) + 1;
                return acc;
            }, {});
        };

        const maxColorCount = Math.max(...Object.values(getMaxCountByColor(colorImages)), 0);
        const normalImageCount = normalImages.length ? Math.max(...normalImages.map(i => i.Nm)) : 0;

        // Get metal color code
        const mcArr = mtColorLocal.find(ele => ele.id === singleProd?.MetalColorid);
        setSelectedMetalColor(mcArr?.colorcode);

        const buildImageURL = (i, isColor = false) => {
            const base = storeInit?.CDNDesignImageFol;
            const extension = isColor ? colorImages[i - 1]?.Ex : normalImages[i - 1]?.Ex;
            const imageUrl = isColor
                ? `${base}${pd.designno}~${i}~${mcArr?.colorcode}.${colorImages[i - 1]?.Ex}`
                : `${base}${pd.designno}~${i}.${normalImages[i - 1]?.Ex}`;
            return { imageUrl, extension };
        };

        const pdImgList = [];

        if (maxColorCount > 0) {
            // Asynchronously populate pdImgList with color images
            for (let i = 1; i <= maxColorCount; i++) {
                const colorImageUrl = buildImageURL(i, true);
                const isColorImageAvailable = await checkImageAvailability(colorImageUrl?.imageUrl);
                if (isColorImageAvailable) {
                    pdImgList.push(colorImageUrl);
                }
            }
        }

        // If no color image was added, push normal images
        if (pdImgList.length === 0 && normalImageCount > 0) {
            for (let i = 1; i <= normalImageCount; i++) {
                pdImgList.push(buildImageURL(i));
            }
        }

        // Set the first image as selected
        let finalprodListimg = {};
        if (pdImgList.length > 0) {
            finalprodListimg = pdImgList[0];
            if (Object.keys(finalprodListimg).length > 0) {
                setSelectedThumbImg({
                    link: {
                        imageUrl: finalprodListimg?.imageUrl,
                        extension: finalprodListimg?.extension
                    },
                    type: 'img'
                });
            }
        }

        setImagePromise(false);

        // Set thumbnail images
        if (pdImgList.length) {
            const thumbImagePath = pdImgList.map(url => {
                const fileName = url?.imageUrl?.split("Design_Image/")[1];
                const thumbImageUrl = `${storeInit?.CDNDesignImageFolThumb}${fileName?.split('.')[0]}.jpg`;
                const originalImageExtension = url?.extension;
                return { thumbImageUrl, originalImageExtension };
            });
            setPdThumbImg(thumbImagePath);
            setThumbImgIndex(0);
        } else {
            setThumbImgIndex();
        }

        // Video processing
        const buildVideoURL = (video, isColor = false) => {
            const base = storeInit?.CDNVPath;
            return isColor
                ? `${base}${pd.designno}~${video.Nm}~${video.CN}.${video.Ex}`
                : `${base}${pd.designno}~${video.Nm}.${video.Ex}`;
        };

        const pdvideoList = [
            ...colorVideos.map(v => buildVideoURL(v, true)),
            ...normalVideos.map(v => buildVideoURL(v))
        ];

        setPdVideoArr(pdvideoList.length ? pdvideoList : []);
    };

    // Handle metal color change with image update
    const handleMetalWiseColorImg = async (e) => {
        const selectedColorCode = e.target.value;
        const mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo") || "[]");
        const mcArr = mtColorLocal.find(ele => ele?.colorcode === selectedColorCode);

        const prod = singleProd ?? singleProd1;
        const { designno, ImageExtension } = prod || {};
        const baseCDN = storeInit?.CDNDesignImageFol;
        const thumbCDN = storeInit?.CDNDesignImageFolThumb;

        setSelectedMetalColor(mcArr?.colorcode);

        // Parse image/video data
        let parsedData = [];
        try {
            parsedData = prod?.ImageVideoDetail && prod.ImageVideoDetail !== "0"
                ? JSON.parse(prod.ImageVideoDetail)
                : [];
        } catch (err) {
            console.error("Invalid JSON in ImageVideoDetail:", err);
            return;
        }

        // Filter categorized media
        const normalImages = [], colorImages = [];
        parsedData.forEach(item => {
            if (item?.TI === 1 && !item?.CN) normalImages.push(item);
            else if (item?.TI === 2 && item?.CN) colorImages.push(item);
        });

        const colorImgs = parsedData.filter(ele => ele?.CN && ele?.TI === 2);
        const normalImgs = parsedData.filter(ele => !ele?.CN && ele?.TI === 1);

        const maxColorImgCount = Math.max(
            0,
            ...Object.values(
                colorImgs.reduce((acc, { CN }) => {
                    acc[CN] = (acc[CN] || 0) + 1;
                    return acc;
                }, {})
            )
        );

        const normalImageCount = normalImgs.length > 0
            ? Math.max(...normalImgs.map(item => item.Nm))
            : 0;

        // Build image URLs
        const buildColorImageList = () => Array.from({ length: maxColorImgCount }, (_, i) => {
            const extension = colorImages[i]?.Ex;
            const imageUrl = `${baseCDN}${designno}~${i + 1}~${mcArr?.colorcode}.${colorImages[i]?.Ex}`;
            return { imageUrl, extension };
        });

        const buildNormalImageList = () => Array.from({ length: normalImageCount }, (_, i) => {
            const extension = normalImages[i]?.Ex;
            const imageUrl = `${baseCDN}${designno}~${i + 1}.${normalImages[i]?.Ex}`;
            return { imageUrl, extension };
        });

        let pdImgListCol = [];
        let pdImgList = [];
        let colorImagesAvailable = false;

        // Check color image availability dynamically
        if (colorImgs.length > 0) {
            const tempColorList = buildColorImageList().filter(Boolean);
            const checkImages = tempColorList.length > 3 ? tempColorList.slice(0, 3) : tempColorList;

            const availabilityChecks = await Promise.all(
                checkImages.map(url => checkImageAvailability(url?.imageUrl))
            );

            colorImagesAvailable = availabilityChecks.some(Boolean);
            if (colorImagesAvailable) {
                pdImgListCol = tempColorList;
            }
        }

        // Fallback to normal images if no color images are available
        if (!colorImagesAvailable && normalImgs.length > 0) {
            pdImgList = buildNormalImageList();
        }

        // Set images to UI
        if (colorImagesAvailable && pdImgListCol.length > 0) {
            const thumbImagePath = pdImgListCol.map(url => {
                const fileName = url?.imageUrl.split('Design_Image/')[1]?.split('.')[0];
                const thumbImageUrl = `${thumbCDN}${fileName}.jpg`;
                const originalImageExtension = url?.extension;
                return { thumbImageUrl, originalImageExtension };
            });

            setPdThumbImg(thumbImagePath);

            const safeIndex = thumbImgIndex < pdImgListCol.length ? thumbImgIndex : pdImgListCol.length - 1;
            const mainImg = pdImgListCol[safeIndex];

            setSelectedThumbImg({
                link: {
                    imageUrl: mainImg?.imageUrl,
                    extension: mainImg?.extension
                },
                type: 'img'
            });
            setThumbImgIndex(safeIndex);

            const defaultMainImg = `${baseCDN}${designno}~${safeIndex + 1}~${mcArr?.colorcode}.${ImageExtension}`;
            setMetalWiseColorImg(defaultMainImg);

        } else if (pdImgList.length > 0) {
            const thumbImagePath = pdImgList.map(url => {
                const fileName = url?.imageUrl?.split('Design_Image/')[1]?.split('.')[0];
                const thumbImageUrl = `${thumbCDN}${fileName}.jpg`;
                const originalImageExtension = url?.extension;
                return { thumbImageUrl, originalImageExtension };
            });

            setPdThumbImg(thumbImagePath);

            const safeIndex = thumbImgIndex < pdImgList.length ? thumbImgIndex : pdImgList.length - 1;
            const fallbackImg = pdImgList[safeIndex];

            setSelectedThumbImg({
                link: {
                    imageUrl: fallbackImg?.imageUrl,
                    extension: fallbackImg?.extension
                },
                type: 'img'
            });
            setThumbImgIndex(safeIndex);
        }
    };

    // Initialize images when product changes
    useEffect(() => {
        if (singleProd && Object.keys(singleProd).length > 0) {
            ProdCardImageFunc();
        }
    }, [singleProd, singleProd1]);

    // Set fallback image when no images are available
    useEffect(() => {
        if (!(pdThumbImg?.length !== 0 || pdVideoArr?.length !== 0)) {
            setSelectedThumbImg({
                link: {
                    imageUrl: "",
                    extension: "jpg"
                },
                type: 'img'
            });
        }
    }, [pdThumbImg, pdVideoArr]);

    return {
        // States
        pdThumbImg,
        selectedThumbImg,
        thumbImgIndex,
        metalWiseColorImg,
        vison360,
        selectedMetalColor,
        pdVideoArr,
        filteredVideos,
        ImagePromise,
        isVisionShow,

        // Setters
        setSelectedThumbImg,
        setThumbImgIndex,
        setVision360,
        setSelectedMetalColor,
        setImagePromise,
        setIsVisionShow,

        // Functions
        handleMetalWiseColorImg,
        checkImageAvailability,
        ProdCardImageFunc
    };
};