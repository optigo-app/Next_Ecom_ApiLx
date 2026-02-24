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

export default async function Home({storeinit}) {
    //  localData?.IsHomeBestSeller === 1
    // localData?.IsHomeAlbum === 1
    // localData?.IsHomeNewArrival === 1
    // localData?.IsHomeTrending === 1
    // localData?.IsHomeDesignSet === 1
    return (
        <>
        <Box sx={{ paddingBottom: 15 }}>
        <Box sx={{ py: 1.2, px: 1 }}>
        <Searchbar />
        <ProductTypeBar />
        <PromotionCarousel />
        <Categories />
        </Box>
        <AlbumSection />
        <GiftBlock />
        <BestSellers />
        <ShowCaseBlock />
        <Trendings />
        <Collection />
        <NewArrival />
        </Box>
        </>
    );
}
