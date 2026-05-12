import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Product from "./ProductList/ProductList";

const ProductList = async ({ params, searchParams }) => {
  const storeinit = await getStoreInit();
  return (
    <>
      <Product
        storeinit={storeinit}
        searchParams={searchParams}
        params={params}
      />
    </>
  );
};

export default ProductList;
