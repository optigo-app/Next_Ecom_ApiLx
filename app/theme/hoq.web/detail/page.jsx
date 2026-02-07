
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import ProductDetail from "./_detComponents/page";

const ProductList = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();

    return (
        <>
            <ProductDetail params={params} searchParams={searchParams} storeInit={storeinit} />
        </>
    );
};

export default ProductList;


