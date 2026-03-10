
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
// import ProductDetail from "./_detComponents/page";
import ProductPage from './_detComponents/page'
import MobileNavbar from "./_detComponents/NavigationBar";

const ProductList = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();

    return (
        <>
        <MobileNavbar/>
            <ProductPage params={params} searchParams={searchParams} storeInit={storeinit} />
        </>
    );
};

export default ProductList;


