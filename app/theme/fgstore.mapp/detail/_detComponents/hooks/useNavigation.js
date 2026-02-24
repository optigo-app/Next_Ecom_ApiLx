import Pako from "pako";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

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
        let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let obj = {
            a: productData?.autocode,
            b: productData?.designno,
            m: loginInfo?.MetalId,
            d: loginInfo?.cmboDiaQCid,
            c: loginInfo?.cmboCSQCid,
            f: {},
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