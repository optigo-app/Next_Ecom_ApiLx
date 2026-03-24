import Pako from "pako";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

export const useNavigation = (setSingleProd1, setSingleProd, setProdLoading, setImagePromise, setWishListFlag) => {
    const navigate = useNextRouterLikeRR();

    // Compress and encode function for URL
    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);
            const compressed = Pako.deflate(uint8Array, { to: "string" });
            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error("Error compressing and encoding:", error);
            return null;
        }
    };

    // Handle move to detail page
    const handleMoveToDetail = (productData) => {
        const loginInfo = window.__LOGIN_USER_DETAIL__ || getSession("loginUserDetail");

        let obj = {
            a: productData?.autocode,
            b: productData?.designno,
            m: loginInfo?.MetalId,
            d: loginInfo?.cmboDiaQCid,
            c: loginInfo?.cmboCSQCid,
            f: {},
            l: productData?.ImageExtension,
            count: productData?.ImageCount
        };

        let encodeObj = compressAndEncode(JSON.stringify(obj));

        navigate.push(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeURIComponent(encodeObj)}`);

        // Reset states
        setSingleProd1({});
        setSingleProd({});
        setImagePromise(true);
    };

    return {
        handleMoveToDetail,
        compressAndEncode
    };
};