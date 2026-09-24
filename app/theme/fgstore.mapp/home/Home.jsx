import { Box } from "@mui/material";
import Searchbar from "./components/Searchbar";
import ProductTypeBar from "./components/ProductTypeBar";
import PromotionCarousel from "./components/PromotionCarousel";
import Categories from "./components/Categories";
import GiftBlock from "./components/GiftBlock";
import AlbumSection from "./components/Album";
import NewArrival from "./components/NewArrivals";
import Collection from "./components/Collection";
import BestSellers from "./components/BestSellers";
import Trendings from "./components/Trendings";
import ShowCaseBlock from "./components/ShowCaseBlock";
import OrderBlock from "./CustomOrder/OrderBlock";
import TokenWrapper from "./TokenWrapper";

export default function Home({
  storeinit,
  initialBestSellers = [],
  initialNewArrivals = [],
  initialTrending = [],
  initialCategories = [],
}) {
  return (
    <>
      <TokenWrapper>
        <Box sx={{ paddingBottom: 15 }}>
          <Box sx={{ py: 1.2 }}>
            <Searchbar storeinit={storeinit} />
            <ProductTypeBar storeinit={storeinit} />
            <PromotionCarousel />
            <Categories storeinit={storeinit} initialCategories={initialCategories} />
            <OrderBlock />
          </Box>
          {/* <AlbumSection /> */}
          {/* <GiftBlock storeinit={storeinit} /> */}
          {/* storeinit?.IsHomeAlbum === 0 && */}
          <BestSellers storeinit={storeinit} initialData={initialBestSellers} />
          {/* storeinit?.IsHomeBestSeller === 0 && */}
          <ShowCaseBlock />
          <Trendings storeinit={storeinit} initialData={initialTrending} />
          {/* storeinit?.IsHomeTrending === 0 && */}
          {/* <Collection storeinit={storeinit} /> */}
          <NewArrival storeinit={storeinit} initialData={initialNewArrivals} />
          {/* storeinit?.IsHomeNewArrival === 0 && */}
        </Box>
      </TokenWrapper>
    </>
  );
}
