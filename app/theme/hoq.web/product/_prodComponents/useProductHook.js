"use client";

import { useState, useEffect, useCallback } from "react";

export function useDynamicImage(storeInit, productListData = []) {
    const [imageMap, setImageMap] = useState({});
    const [finalProductListData, setFinalProductListData] = useState([]);
    const [selectedMetalColor, setSelectedMetalColor] = useState(null);
    const [StoryLineProductList, setStoryLineProductList] = useState([]);

    const getDesignImageFol = storeInit?.CDNDesignImageFolThumb;
    const getDesignVideoFol = storeInit?.CDNVPath;

    // --------------------
    // Helpers
    // --------------------
    const getDynamicImage = useCallback(
        async (item, designno, extension, type, color) => {
            const baseImagePath = `${getDesignImageFol}${designno}~${type}`;
            const colorImagePath = `${baseImagePath}~${color}.jpg`;

            let defaultImagePath = "";
            if (type === 2) {
                defaultImagePath = `${getDesignImageFol}${designno}~1.jpg`;
            } else {
                defaultImagePath = `${baseImagePath}.jpg`;
            }

            if (item?.ColorImageCount > 0) {
                return colorImagePath;
            }
            return defaultImagePath;
        },
        [getDesignImageFol]
    );

    const getDynamicYellowImage = useCallback(
        (item, designno, extension) =>
            getDynamicImage(item, designno, extension, 1, "Yellow"),
        [getDynamicImage]
    );
    const getDynamicWhiteImage = useCallback(
        (item, designno, extension) =>
            getDynamicImage(item, designno, extension, 1, "White"),
        [getDynamicImage]
    );
    const getDynamicRoseImage = useCallback(
        (item, designno, extension) =>
            getDynamicImage(item, designno, extension, 1, "Rose"),
        [getDynamicImage]
    );

    const getDynamicRollYellowImage = useCallback(
        (item, designno, extension) =>
            getDynamicImage(item, designno, extension, 2, "Yellow"),
        [getDynamicImage]
    );
    const getDynamicRollWhiteImage = useCallback(
        (item, designno, extension) =>
            getDynamicImage(item, designno, extension, 2, "White"),
        [getDynamicImage]
    );
    const getDynamicRollRoseImage = useCallback(
        (item, designno, extension) =>
            getDynamicImage(item, designno, extension, 2, "Rose"),
        [getDynamicImage]
    );

    const getDynamicRollImages = useCallback(
        (designno, count) => {
            if (count > 1) {
                return `${getDesignImageFol}${designno}~${2}.jpg`;
            }
            return;
        },
        [getDesignImageFol]
    );

    const getDynamicImages = useCallback(
        (designno) => `${getDesignImageFol}${designno}~${1}.jpg`,
        [getDesignImageFol]
    );

    const getDynamicVideo = useCallback(
        (designno, count, extension) => {
            if (extension && count > 0) {
                return `${getDesignVideoFol}${designno}~1.${extension}`;
            }
            return;
        },
        [getDesignVideoFol]
    );

    // // --------------------
    // // Rollover Functions
    // // --------------------
    const handleImgRollover = useCallback(
        async (pd, yellowRollImage, whiteRollImage, roseRollImage, metalId) => {
            if (pd?.images?.length >= 1) {
                const color = metalId ?? selectedMetalColor?.[pd?.autocode];
                let imageUrl;

                switch (color) {
                    case 1:
                        imageUrl = yellowRollImage;
                        break;
                    case 2:
                        imageUrl = whiteRollImage;
                        break;
                    case 3:
                        imageUrl = roseRollImage;
                        break;
                    default:
                        imageUrl = pd?.images[1] || pd?.images[0];
                        break;
                }

                setRolloverImgPd({ [pd?.autocode]: imageUrl });
            }
        },
        [selectedMetalColor]
    );

    const handleLeaveImgRolloverImg = useCallback(
        async (pd, yellowImage, whiteImage, roseImage) => {
            if (pd?.images?.length > 0) {
                const color = selectedMetalColor?.[pd?.autocode];
                let imageUrl;

                switch (color) {
                    case 1:
                        imageUrl = yellowImage;
                        break;
                    case 2:
                        imageUrl = whiteImage;
                        break;
                    case 3:
                        imageUrl = roseImage;
                        break;
                    default:
                        imageUrl = pd?.images[0];
                        break;
                }

                if (imageUrl) {
                    setRolloverImgPd({ [pd?.autocode]: imageUrl });
                }
            }
        },
        [selectedMetalColor]
    );

    // --------------------
    // Generate multiple images for a product
    // --------------------
    const generateImageList = useCallback((product) => {
        const pdImgList = [];
        if (product?.ImageCount > 0) {
            for (let i = 1; i <= product?.ImageCount; i++) {
                pdImgList.push(
                    `${storeInit?.CDNDesignImageFolThumb}${product?.designno}~${i}.jpg`
                );
            }
        } else {
            pdImgList.push("/image-not-found.jpg");
        }
        return pdImgList;
    }, []);

    // --------------------
    // First effect: preload base color images into imageMap
    // --------------------
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages = {};
            await Promise.all(
                productListData.map(async (item) => {
                    const yellowImage = await getDynamicYellowImage(
                        item,
                        item.designno,
                        item.ImageExtension
                    );
                    const whiteImage = await getDynamicWhiteImage(
                        item,
                        item.designno,
                        item.ImageExtension
                    );
                    const roseImage = await getDynamicRoseImage(
                        item,
                        item.designno,
                        item.ImageExtension
                    );
                    const yellowRollImage = await getDynamicRollYellowImage(
                        item,
                        item.designno,
                        item.ImageExtension
                    );
                    const whiteRollImage = await getDynamicRollWhiteImage(
                        item,
                        item.designno,
                        item.ImageExtension
                    );
                    const roseRollImage = await getDynamicRollRoseImage(
                        item,
                        item.designno,
                        item.ImageExtension
                    );

                    loadedImages[item.designno] = {
                        yellowImage,
                        whiteImage,
                        roseImage,
                        yellowRollImage,
                        whiteRollImage,
                        roseRollImage,
                    };
                })
            );
            setImageMap(loadedImages);
        };

        if (productListData.length > 0) loadImages();
    }, [
        productListData,
        getDynamicYellowImage,
        getDynamicWhiteImage,
        getDynamicRoseImage,
        getDynamicRollYellowImage,
        getDynamicRollWhiteImage,
        getDynamicRollRoseImage,
    ]);

    // --------------------
    // Second effect: build finalProductListData with lazy loading
    // --------------------
    useEffect(() => {
        // Step 1: initialize with loading state
        const initialProducts = productListData?.map((product) => ({
            ...product,
            images: [],
            colorImages: [],
            loading: true,
        }));
        setFinalProductListData(initialProducts);

        // Step 2: async populate images
        const timer = setTimeout(async () => {
            const processedProducts = await Promise.all(
                productListData.map(async (product) => {
                    const yellowImage = await getDynamicYellowImage(
                        product,
                        product.designno,
                        product.ImageExtension
                    );
                    const whiteImage = await getDynamicWhiteImage(
                        product,
                        product.designno,
                        product.ImageExtension
                    );
                    const roseImage = await getDynamicRoseImage(
                        product,
                        product.designno,
                        product.ImageExtension
                    );

                    const yellowRollImage = await getDynamicRollYellowImage(
                        product,
                        product.designno,
                        product.ImageExtension
                    );
                    const whiteRollImage = await getDynamicRollWhiteImage(
                        product,
                        product.designno,
                        product.ImageExtension
                    );
                    const roseRollImage = await getDynamicRollRoseImage(
                        product,
                        product.designno,
                        product.ImageExtension
                    );

                    const pdImgList = generateImageList(product);
                    const pdColorImgList = [
                        { color: "yellow", image: yellowImage, rollover: yellowRollImage },
                        { color: "white", image: whiteImage, rollover: whiteRollImage },
                        { color: "rose", image: roseImage, rollover: roseRollImage },
                    ];

                    return {
                        ...product,
                        images: pdImgList,
                        colorImages: pdColorImgList,
                        loading: false,
                    };
                })
            );

            setFinalProductListData(processedProducts);
        }, 0);

        return () => clearTimeout(timer);
    }, [
        productListData,
        storeInit,
        generateImageList,
        getDynamicYellowImage,
        getDynamicWhiteImage,
        getDynamicRoseImage,
        getDynamicRollYellowImage,
        getDynamicRollWhiteImage,
        getDynamicRollRoseImage,
    ]);

    function checkImageAvailability(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imageUrl;
        });
    }

    // ----------------------------------
    // ProdCardImageFunc (Integrated)
    // ----------------------------------
    const ProdCardImageFunc = async (data) => {
        let pdImgList = [];
        let pdvideoList = [];

        let mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo"));
        let mcArr;

        if (mtColorLocal?.length) {
            mcArr = mtColorLocal?.find((ele) => ele?.id === data?.MetalColorid);
        }

        // Fetch fallback images (without color code)
        if (data?.ImageCount > 0 && pdImgList.length === 0) {
            for (let i = 2; i <= data?.ImageCount; i++) {
                let imgString =
                    storeInit?.CDNDesignImageFol +
                    data?.designno +
                    "~" +
                    i +
                    "." +
                    data?.ImageExtension;

                const IsImg = await checkImageAvailability(imgString);
                if (IsImg) {
                    pdImgList.push(imgString);
                }
            }
        }

        // Fetch videos
        if (data?.VideoCount > 0) {
            for (let i = 1; i <= data?.VideoCount; i++) {
                let videoString =
                    storeInit?.CDNVPath +
                    data?.designno +
                    "~" +
                    i +
                    "." +
                    data?.VideoExtension;

                pdvideoList.push(videoString);
            }
        }

        return { images: pdImgList, videos: pdvideoList };
    };

    // ----------------------------------
    // StoryLine Product List (Integrated)
    // ----------------------------------
    useEffect(() => {
        const MakeNewImageList = async () => {
            const newImgListPromises = productListData?.map(async (item) => {
                const media = await ProdCardImageFunc(item);

                return {
                    designno: item?.designno,
                    images: media.images,
                    videos: media.videos,
                };
            });

            const result = await Promise.all(newImgListPromises);
            setStoryLineProductList(result);
        };

        if (productListData?.length > 0) {
            MakeNewImageList();
        }
    }, [productListData]);

    return {
        imageMap,
        finalProductListData,
        StoryLineProductList,
        getDynamicImage,
        getDynamicYellowImage,
        getDynamicWhiteImage,
        getDynamicRoseImage,
        getDynamicRollYellowImage,
        getDynamicRollWhiteImage,
        getDynamicRollRoseImage,
        getDynamicRollImages,
        getDynamicImages,
        getDynamicVideo,
        generateImageList,
        selectedMetalColor,
        handleImgRollover,
        handleLeaveImgRolloverImg,
    };
};