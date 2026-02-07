import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import ProductDetail from "./ProductDetail/ProductDetail";

const page = async ({ params, searchParams }) => {
    const storeint = await getStoreInit();
    return (
        <>
            <ProductDetail storeInit={storeint} params={params} searchParams={searchParams}  />
        </>
    );
};

export default page;
