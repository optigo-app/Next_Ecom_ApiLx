import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import AddressManagement from "./_deliComp/Delivery";

const ProductList = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();

    return (
        <>
            <AddressManagement params={params} searchParams={searchParams} storeinit={storeinit} />
        </>
    );
};

export default ProductList;


