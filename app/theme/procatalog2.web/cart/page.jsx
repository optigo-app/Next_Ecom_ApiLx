
import { getStoreInit, GetVistitorId } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import MainCart from "./MainCart";

const Cart = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();
    const visiterId = await GetVistitorId();

    return (
        <>
            <MainCart params={params} searchParams={searchParams} storeinit={storeinit} visiterId={visiterId} />
        </>
    );
};

export default Cart;


