import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Product from "./ProductList/ProductList";

const ProductList = async ({ params, searchParams, initialData, initialFilterData }) => {
  const storeinit = await getStoreInit();
  return (
    <>
      <Product
        storeinit={storeinit}
        searchParams={searchParams}
        params={params}
        initialData={initialData}
        initialFilterData={initialFilterData}
      />
    </>
  );
};

export default ProductList;
