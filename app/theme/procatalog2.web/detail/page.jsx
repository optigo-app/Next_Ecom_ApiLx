
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import ProductDetail from "./ProductDetail/ProductDetail";

const ProductList = async ({ params, searchParams }) => {
    const st = await getStoreInit();
    return (
        <>
            <ProductDetail params={params} searchParams={searchParams} storeinit={st} />
        </>
    );
};

export default ProductList;


