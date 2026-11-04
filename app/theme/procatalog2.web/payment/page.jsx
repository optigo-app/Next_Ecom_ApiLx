import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Payment from "./PaymentPage/Payment";

const ProductList = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();

    return (
        <>
            <Payment params={params} searchParams={searchParams} storeinit={storeinit} />
        </>
    );
};

export default ProductList;


