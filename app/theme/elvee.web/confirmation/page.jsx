import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Confirmation from "./ConfirmationPage/Confirmation";

const ProductList = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();

    return (
        <>
            <Confirmation params={params} searchParams={searchParams} storeinit={storeinit} />
        </>
    );
};

export default ProductList;


