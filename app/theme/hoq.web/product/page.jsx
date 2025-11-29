import Product from "./_prodComponents/page";
import './page.scss';
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

const ProductList = async ({ params, searchParams }) => {
  const storeinit = await getStoreInit();

  return (
    <>
      <Product params={params} searchParams={searchParams} storeinit={storeinit} />
    </>
  );
};

export default ProductList;
