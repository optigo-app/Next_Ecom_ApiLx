import { useState, useEffect } from "react";

export const useProductCustomization = (singleProd, singleProd1, storeInit) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);

    // Toggle description expand/collapse
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleText = () => {
        setIsExpanded((prevState) => !prevState);
    };

    // Sort size array
    const SizeSorting = (SizeArr) => {
        let SizeSorted = SizeArr?.sort((a, b) => {
            const nameA = parseInt(a?.sizename?.toUpperCase()?.slice(0, -2), 10);
            const nameB = parseInt(b?.sizename?.toUpperCase()?.slice(0, -2), 10);
            return nameA - nameB;
        });
        return SizeSorted;
    };

    // Handle metal color change without image update
    const handleMetalWiseColorImgWithFlag = async (e, setSelectMtColor) => {
        let mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo"));
        let mcArr;

        if (mtColorLocal?.length) {
            mcArr = mtColorLocal?.filter(
                (ele) => ele?.colorcode == e.target.value
            )[0];
        }

        setSelectMtColor(e.target.value);
    };

    // Format number with Indian formatting
    const formatter = new Intl.NumberFormat("en-IN");

    // Decode HTML entities
    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    // CSS variable setter
    const setCSSVariable = () => {
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
        document.documentElement.style.setProperty(
            "--background-color",
            backgroundColor
        );
    };

    // Check text overflow for description
    const checkTextOverflow = (descriptionRef) => {
        const descriptionElement = descriptionRef.current;
        if (descriptionElement) {
            const isOverflowing =
                descriptionElement.scrollHeight > descriptionElement.clientHeight;
            setIsClamped(isOverflowing);
        }
    };

    // Reset expand state when product changes
    useEffect(() => {
        setIsClamped(false);
        setIsExpanded(false);
    }, [singleProd?.autocode]);

    // Initialize CSS variables
    useEffect(() => {
        setCSSVariable();
    }, []);

    return {
        // States
        isExpanded,
        isClamped,
        
        // Setters
        setIsExpanded,
        setIsClamped,
        
        // Functions
        toggleExpand,
        toggleText,
        SizeSorting,
        handleMetalWiseColorImgWithFlag,
        formatter,
        decodeEntities,
        setCSSVariable,
        checkTextOverflow
    };
};