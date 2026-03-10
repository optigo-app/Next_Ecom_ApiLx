import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import AddressManagement from "./_deliComp/Delivery";
import MobileNavbar from "./_deliComp/NavigationBar";

const ProductList = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();

    return (
        <>
        <MobileNavbar/>
            <AddressManagement params={params} searchParams={searchParams} storeinit={storeinit} />
        </>
    );
};

export default ProductList;


