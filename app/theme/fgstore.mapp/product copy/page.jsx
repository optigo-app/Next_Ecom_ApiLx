import Product from "./_prodComponents/page";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import MobileProductListing from "./MobileView";

const ProductList = async ({ params, searchParams }) => {
  const storeinit = await getStoreInit();

  return (
    <>
      {/* <Product params={params} searchParams={searchParams} storeinit={storeinit} /> */}
      <MobileProductListing params={params} searchParams={searchParams} storeinit={storeinit} />
    </>
  );
};

export default ProductList;
