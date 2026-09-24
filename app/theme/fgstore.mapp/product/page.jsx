import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import MobileProductListing from "./MobileView";

const ProductList = async ({ params, searchParams, storeinit: initialStoreInit, initialData, initialFilterData }) => {
  const storeinit = initialStoreInit || await getStoreInit();
  return (
    <MobileProductListing
      params={params}
      searchParams={searchParams}
      storeinit={storeinit}
      initialData={initialData}
      initialFilterData={initialFilterData}
    />
  );
};

export default ProductList;
